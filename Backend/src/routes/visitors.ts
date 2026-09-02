import { Router } from "express";
import { prisma } from "../index.js";

export const visitorRoutes = Router();

// ─── Track a page view ───────────────────────────
// POST /api/visitors/track
visitorRoutes.post("/track", async (req, res) => {
  try {
    const { page, sessionId, visitorId, country, countryCode } = req.body;
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "";
    const userAgent = req.headers["user-agent"] || "";
    const referer = (req.headers["referer"] || req.headers["referrer"] || "") as string;

    if (!page) {
      return res.status(400).json({ error: "page is required" });
    }

    await prisma.visitor.create({
      data: {
        ip,
        userAgent,
        page,
        country: country || null,
        countryCode: countryCode || null,
        referer,
        sessionId: sessionId || null,
        visitorId: visitorId || null,
      },
    });

    res.status(201).json({ ok: true });
  } catch (error) {
    console.error("Error tracking visitor:", error);
    res.status(500).json({ error: "Failed to track visitor" });
  }
});

// ─── Get visitor stats ────────────────────────────
// GET /api/visitors/stats?days=7
visitorRoutes.get("/stats", async (req, res) => {
  try {
    const days = parseInt(req.query.days as string) || 7;
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - days);

    // ── 1. Total views (all time) ──
    const totalViews = await prisma.visitor.count();

    // ── 2. Period views ──
    const periodViews = await prisma.visitor.count({
      where: { createdAt: { gte: startDate } },
    });

    // ── 3. Unique visitors (all time + period) ──
    // Use COALESCE to pick the best fingerprint: visitorId > sessionId > ip
    const [allUniqueRes, periodUniqueRes] = await Promise.all([
      prisma.$queryRawUnsafe<{ cnt: bigint }[]>(
        `SELECT COUNT(DISTINCT COALESCE("visitorId","sessionId","ip")) AS cnt FROM "visitors"`
      ),
      prisma.$queryRawUnsafe<{ cnt: bigint }[]>(
        `SELECT COUNT(DISTINCT COALESCE("visitorId","sessionId","ip")) AS cnt
         FROM "visitors" WHERE "createdAt" >= $1`,
        startDate
      ),
    ]);
    const uniqueVisitors = Number(allUniqueRes[0]?.cnt ?? 0);
    const periodUniqueVisitors = Number(periodUniqueRes[0]?.cnt ?? 0);

    // ── 4. Views per day (chart) ──
    // Key fix: extract date as YYYY-MM-DD string directly in SQL
    // using TO_CHAR to avoid timezone/type mismatch with JS date strings
    const dailyRows = await prisma.$queryRawUnsafe<
      { day: string; cnt: bigint }[]
    >(
      `SELECT TO_CHAR("createdAt"::date, 'YYYY-MM-DD') AS day,
              COUNT(*)::int AS cnt
       FROM "visitors"
       WHERE "createdAt" >= $1
       GROUP BY "createdAt"::date
       ORDER BY day ASC`,
      startDate
    );

    // Build lookup map
    const dayMap = new Map<string, number>();
    for (const row of dailyRows) {
      dayMap.set(row.day, Number(row.cnt));
    }

    // Generate all day labels (including zeros) using LOCAL dates
    const chartData: { date: string; count: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const key = `${y}-${m}-${dd}`;
      chartData.push({ date: key, count: dayMap.get(key) || 0 });
    }

    // ── 5. Country breakdown ──
    const countryRows = await prisma.$queryRawUnsafe<
      { country: string; countryCode: string; cnt: bigint }[]
    >(
      `SELECT "country","countryCode", COUNT(*)::int AS cnt
       FROM "visitors"
       WHERE "createdAt" >= $1 AND "country" IS NOT NULL
       GROUP BY "country","countryCode"
       ORDER BY cnt DESC
       LIMIT 10`,
      startDate
    );
    const countryData = countryRows
      .filter((c) => c.country)
      .map((c) => ({
        country: c.country,
        countryCode: c.countryCode || null,
        count: Number(c.cnt),
      }));

    // Total country visits (for percentage calculation)
    const totalCountryVisits = countryData.reduce((sum, c) => sum + c.count, 0);

    // ── 6. Top pages ──
    const pageRows = await prisma.visitor.groupBy({
      by: ["page"],
      where: { createdAt: { gte: startDate } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    });
    const pageViews = pageRows.map((p) => ({
      page: p.page,
      count: p._count.id,
    }));

    // ── 7. Sessions / bounce rate / avg duration ──
    // Group visits by the best available fingerprint
    const sessionRows = await prisma.$queryRawUnsafe<
      { key: string; cnt: bigint; first_at: Date; last_at: Date }[]
    >(
      `SELECT key, COUNT(*)::int AS cnt,
              MIN("createdAt") AS first_at,
              MAX("createdAt") AS last_at
       FROM (
         SELECT COALESCE("visitorId","sessionId","ip",'anon') AS key,
                "createdAt"
         FROM "visitors"
         WHERE "createdAt" >= $1
       ) sub
       GROUP BY key`,
      startDate
    );

    const totalSessions = sessionRows.length;
    const bouncedSessions = sessionRows.filter((s) => Number(s.cnt) === 1).length;
    const bounceRate =
      totalSessions > 0 ? Math.round((bouncedSessions / totalSessions) * 100) : 0;

    // Average session duration
    let avgTime = "0:00";
    let totalDurationSec = 0;
    let durationCount = 0;

    for (const s of sessionRows) {
      if (Number(s.cnt) < 2) continue;
      const dur =
        (new Date(s.last_at).getTime() - new Date(s.first_at).getTime()) / 1000;
      if (dur > 0 && dur < 7200) {
        // ignore >2h (idle tab)
        totalDurationSec += dur;
        durationCount++;
      }
    }

    if (durationCount > 0) {
      const avgSec = Math.round(totalDurationSec / durationCount);
      const mins = Math.floor(avgSec / 60);
      const secs = avgSec % 60;
      avgTime = `${mins}:${secs.toString().padStart(2, "0")}`;
    }

    // ── 8. Recent visitors ──
    const recentVisitors = await prisma.visitor.findMany({
      orderBy: { createdAt: "desc" },
      take: 15,
      select: {
        id: true,
        page: true,
        country: true,
        countryCode: true,
        createdAt: true,
      },
    });

    res.json({
      totalViews,
      uniqueVisitors,
      periodViews,
      periodUniqueVisitors,
      avgTime,
      bounceRate,
      chartData,
      countryData,
      totalCountryVisits,
      pageViews,
      recentVisitors,
    });
  } catch (error) {
    console.error("Error fetching visitor stats:", error);
    res.status(500).json({ error: "Failed to fetch visitor stats" });
  }
});
