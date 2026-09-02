"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import {
  Eye,
  Users,
  TrendingDown,
  Globe,
  RefreshCw,
  FileText,
  BarChart3,
  ArrowUpRight,
  Timer,
  MapPin,
  ExternalLink,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ── Types ──────────────────────────────────────────
interface VisitorStats {
  totalViews: number;
  uniqueVisitors: number;
  periodViews: number;
  periodUniqueVisitors: number;
  avgTime: string;
  bounceRate: number;
  chartData: { date: string; count: number }[];
  countryData: { country: string; countryCode: string | null; count: number }[];
  totalCountryVisits: number;
  pageViews: { page: string; count: number }[];
  recentVisitors: {
    id: string;
    page: string;
    country: string | null;
    countryCode: string | null;
    createdAt: string;
  }[];
}

// ── ISO-2 → flag emoji ─────────────────────────────
function isoToFlag(code: string | null): string {
  if (!code || code.length !== 2) return "🌍";
  return String.fromCodePoint(
    ...code.toUpperCase().split("").map((c) => 0x1f1e6 - 65 + c.charCodeAt(0))
  );
}

// ── Time ago ───────────────────────────────────────
function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// ── Animated number ────────────────────────────────
function AnimNum({
  target,
  suffix,
}: {
  target: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const elRef = el;
    const from = prev.current;
    const to = target;
    prev.current = target;
    const t0 = performance.now();
    const dur = 900;

    function tick(now: number) {
      const p = Math.min((now - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      elRef.textContent =
        Math.round(from + (to - from) * ease).toLocaleString() +
        (suffix || "");
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [target, suffix]);

  return (
    <span ref={ref}>
      {target.toLocaleString()}
      {suffix || ""}
    </span>
  );
}

// ── Custom tooltip ─────────────────────────────────
function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-[#0c1220]/95 px-3 py-2 shadow-xl backdrop-blur">
      <p className="text-[10px] text-white/40">{label}</p>
      <p className="text-sm font-semibold text-cyan-400">
        {payload[0].value.toLocaleString()} view
        {payload[0].value !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

// ════════════════════════════════════════════════════
export default function VisitorsPage() {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState(7);
  const [refreshing, setRefreshing] = useState(false);

  async function load(days: number) {
    try {
      const res = await fetch(`${API_URL}/api/visitors/stats?days=${days}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setStats(data);
      setError("");
    } catch {
      setError("Could not load visitor data. Is the backend running?");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    load(period);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function changePeriod(d: number) {
    setPeriod(d);
    setRefreshing(true);
    await load(d);
  }

  async function refresh() {
    setRefreshing(true);
    await load(period);
  }

  // Format chart dates for display
  const chart = useMemo(() => {
    if (!stats) return [];
    return stats.chartData.map((d) => ({
      ...d,
      label: new Date(d.date + "T00:00:00").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }));
  }, [stats]);

  // Max Y for chart (force at least 2 so axis isn't degenerate)
  const chartMax = useMemo(() => {
    const mx = Math.max(...chart.map((d) => d.count), 0);
    return mx <= 2 ? 3 : undefined; // let Recharts auto-scale if small
  }, [chart]);

  const yFmt = (v: number) =>
    v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v);

  // Country percentages (relative to total country visits, NOT total views)
  const totalCountry = stats?.totalCountryVisits || 1;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <div className="mb-10 flex items-start justify-between">
          <div>
            <Badge variant="outline" className="mb-3">
              <BarChart3 className="mr-1 h-3 w-3" />
              Analytics
            </Badge>
            <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Visitors
            </h1>
            <p className="mt-2 text-sm text-white/40">
              Real-time visitor analytics
            </p>
          </div>
          <button
            onClick={refresh}
            disabled={refreshing}
            className="mt-10 rounded-lg border border-white/10 bg-white/5 p-2.5 text-white/40 transition-all hover:border-white/15 hover:bg-white/10 hover:text-white disabled:opacity-40"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        {/* ── Loading ── */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-10 text-center">
              <p className="text-sm text-red-400/80">{error}</p>
              <button
                onClick={refresh}
                className="mt-4 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                Retry
              </button>
            </CardContent>
          </Card>
        ) : stats ? (
          <>
            {/* ── Stat Cards ── */}
            <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {/* Total Views */}
              <Card className="group transition-all duration-200 hover:border-white/10 hover:shadow-lg hover:shadow-black/20">
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10">
                      <Eye className="h-4 w-4 text-cyan-400" />
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-white/0 transition-colors group-hover:text-white/20" />
                  </div>
                  <p className="font-display text-2xl font-bold text-white">
                    <AnimNum target={stats.totalViews} />
                  </p>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-white/30">
                    Total Views
                  </p>
                </CardContent>
              </Card>

              {/* Unique Visitors */}
              <Card className="group transition-all duration-200 hover:border-white/10 hover:shadow-lg hover:shadow-black/20">
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10">
                      <Users className="h-4 w-4 text-purple-400" />
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-white/0 transition-colors group-hover:text-white/20" />
                  </div>
                  <p className="font-display text-2xl font-bold text-white">
                    <AnimNum target={stats.uniqueVisitors} />
                  </p>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-white/30">
                    Unique Visitors
                  </p>
                </CardContent>
              </Card>

              {/* Avg Session — FIX: use real avgTime, parse to seconds for animated display */}
              <Card className="group transition-all duration-200 hover:border-white/10 hover:shadow-lg hover:shadow-black/20">
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
                      <Timer className="h-4 w-4 text-amber-400" />
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-white/0 transition-colors group-hover:text-white/20" />
                  </div>
                  <p className="font-display text-2xl font-bold text-white">
                    {stats.avgTime}
                  </p>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-white/30">
                    Avg. Session
                  </p>
                </CardContent>
              </Card>

              {/* Bounce Rate */}
              <Card className="group transition-all duration-200 hover:border-white/10 hover:shadow-lg hover:shadow-black/20">
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
                      <TrendingDown className="h-4 w-4 text-emerald-400" />
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-white/0 transition-colors group-hover:text-white/20" />
                  </div>
                  <p className="font-display text-2xl font-bold text-white">
                    <AnimNum target={stats.bounceRate} suffix="%" />
                  </p>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-white/30">
                    Bounce Rate
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* ── Chart + Countries ── */}
            <div className="mb-8 grid gap-6 lg:grid-cols-5">
              {/* ── Views Over Time ── */}
              <Card className="lg:col-span-3">
                <CardContent className="p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        Views Over Time
                      </h3>
                      <p className="mt-0.5 text-[11px] text-white/30">
                        {stats.periodViews.toLocaleString()} view
                        {stats.periodViews !== 1 ? "s" : ""} in the last{" "}
                        {period} days
                      </p>
                    </div>
                    <div className="flex gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
                      {[7, 30].map((d) => (
                        <button
                          key={d}
                          onClick={() => changePeriod(d)}
                          className={`rounded-md px-3 py-1 text-[11px] font-semibold transition-all ${
                            period === d
                              ? "bg-cyan-500/90 text-[#0e1525] shadow-sm"
                              : "text-white/40 hover:text-white/70"
                          }`}
                        >
                          {d}D
                        </button>
                      ))}
                    </div>
                  </div>
                  {chart.some((d) => d.count > 0) ? (
                    <div className="h-[240px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={chart}
                          margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id="grad"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#22d3ee"
                                stopOpacity={0.25}
                              />
                              <stop
                                offset="100%"
                                stopColor="#22d3ee"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.04)"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="label"
                            tick={{
                              fontSize: 10,
                              fill: "rgba(255,255,255,0.3)",
                            }}
                            tickLine={false}
                            axisLine={false}
                            interval="preserveStartEnd"
                            minTickGap={30}
                          />
                          <YAxis
                            tickFormatter={yFmt}
                            tick={{
                              fontSize: 10,
                              fill: "rgba(255,255,255,0.3)",
                            }}
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                            width={35}
                            domain={chartMax ? [0, chartMax] : ["auto", "auto"]}
                          />
                          <Tooltip content={<ChartTip />} />
                          <Area
                            type="monotone"
                            dataKey="count"
                            stroke="#22d3ee"
                            strokeWidth={2}
                            fill="url(#grad)"
                            dot={false}
                            activeDot={{
                              r: 4,
                              fill: "#22d3ee",
                              stroke: "#0e1525",
                              strokeWidth: 2,
                            }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex h-[240px] flex-col items-center justify-center">
                      <BarChart3 className="mb-2 h-8 w-8 text-white/10" />
                      <p className="text-xs text-white/25">
                        No views in this period
                      </p>
                      <p className="mt-1 text-[10px] text-white/15">
                        Data will appear as visitors browse the site
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* ── Countries ── */}
              <Card className="lg:col-span-2">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-cyan-400/70" />
                    <h3 className="text-sm font-semibold text-white">
                      Countries
                    </h3>
                  </div>
                  {stats.countryData.length > 0 ? (
                    <div className="space-y-2.5">
                      {stats.countryData.map((c) => {
                        // Percentage = this country's visits / total country visits
                        const pct = Math.round((c.count / totalCountry) * 100);
                        // Bar width = this country / max country
                        const barPct =
                          (c.count / (stats.countryData[0]?.count || 1)) * 100;
                        return (
                          <div key={c.country}>
                            <div className="flex items-center gap-2.5">
                              <span className="w-6 text-center text-sm">
                                {isoToFlag(c.countryCode)}
                              </span>
                              <span className="w-24 shrink-0 truncate text-xs text-white/60">
                                {c.country}
                              </span>
                              <div className="relative flex-1 overflow-hidden rounded-full bg-white/[0.04]">
                                <div
                                  className="h-1.5 rounded-full bg-gradient-to-r from-cyan-500/70 to-purple-500/70 transition-all duration-700"
                                  style={{ width: `${barPct}%` }}
                                />
                              </div>
                              <span className="w-10 text-right text-[11px] tabular-nums text-white/30">
                                {pct}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-8">
                      <MapPin className="mb-2 h-6 w-6 text-white/10" />
                      <p className="text-xs text-white/25">
                        No country data yet
                      </p>
                      <p className="mt-1 text-[10px] text-white/15">
                        Countries appear as visitors browse
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* ── Top Pages + Recent Visitors ── */}
            <div className="grid gap-6 lg:grid-cols-5">
              {/* ── Top Pages ── */}
              <Card className="lg:col-span-3">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-cyan-400/70" />
                    <h3 className="text-sm font-semibold text-white">
                      Top Pages
                    </h3>
                  </div>
                  {stats.pageViews.length > 0 ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-white/20">
                        <span className="w-6 text-center">#</span>
                        <span className="flex-1">Page</span>
                        <span className="w-16 text-right">Views</span>
                        <span className="w-14 text-right">Share</span>
                      </div>
                      {stats.pageViews.map((p, i) => {
                        const maxP = stats.pageViews[0]?.count || 1;
                        const barPct = (p.count / maxP) * 100;
                        const share = Math.round(
                          (p.count / (stats.periodViews || 1)) * 100
                        );
                        return (
                          <div
                            key={p.page}
                            className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-white/[0.03]"
                          >
                            <span className="w-6 text-center text-[11px] text-white/25">
                              {i + 1}
                            </span>
                            <span className="flex-1 truncate font-mono text-xs text-white/55">
                              {p.page || "/"}
                            </span>
                            <div className="hidden w-20 sm:block">
                              <div className="h-1 overflow-hidden rounded-full bg-white/[0.04]">
                                <div
                                  className="h-full rounded-full bg-cyan-500/50"
                                  style={{ width: `${barPct}%` }}
                                />
                              </div>
                            </div>
                            <span className="w-16 text-right text-[11px] tabular-nums text-white/45">
                              {p.count}
                            </span>
                            <span className="w-10 text-right text-[10px] text-white/20">
                              {share}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-8">
                      <FileText className="mb-2 h-6 w-6 text-white/10" />
                      <p className="text-xs text-white/25">
                        No page data yet
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* ── Recent Visitors ── */}
              <Card className="lg:col-span-2">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Users className="h-4 w-4 text-cyan-400/70" />
                    <h3 className="text-sm font-semibold text-white">
                      Recent Visitors
                    </h3>
                  </div>
                  {stats.recentVisitors.length > 0 ? (
                    <div className="space-y-0.5">
                      {stats.recentVisitors.map((v) => (
                        <div
                          key={v.id}
                          className="flex items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-white/[0.03]"
                        >
                          <span className="w-5 text-center text-sm">
                            {isoToFlag(v.countryCode)}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs text-white/55">
                              {v.page}
                            </p>
                          </div>
                          <span className="shrink-0 text-[10px] text-white/25">
                            {timeAgo(v.createdAt)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-8">
                      <Users className="mb-2 h-6 w-6 text-white/10" />
                      <p className="text-xs text-white/25">No visitors yet</p>
                      <p className="mt-1 text-[10px] text-white/15">
                        Visitors appear as people browse
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
