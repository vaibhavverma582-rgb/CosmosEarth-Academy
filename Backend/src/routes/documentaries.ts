import { Router, Request, Response } from "express";
import { prisma } from "../index";
import { z } from "zod";

export const documentaryRoutes = Router();

// Extract YouTube ID
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

const createSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  description: z.string().min(1),
  posterUrl: z.string().url().optional(),
  trailerUrl: z.string().optional(),
  duration: z.string().optional(),
  year: z.coerce.number().optional(),
  director: z.string().optional(),
  rating: z.coerce.number().min(0).max(10).optional(),
  category: z.string().default("General"),
  tags: z.string().optional(),
  featured: z.coerce.boolean().optional(),
});

// GET /api/documentaries
documentaryRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const { category, search, featured } = req.query;
    const where: Record<string, any> = { published: true };
    if (category) where.category = category as string;
    if (featured === "true") where.featured = true;
    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { description: { contains: search as string } },
        { director: { contains: search as string } },
      ];
    }

    const docs = await prisma.documentary.findMany({
      where,
      include: { uploader: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json({ data: docs });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch documentaries" });
  }
});

// GET /api/documentaries/categories
documentaryRoutes.get("/categories", async (_req: Request, res: Response) => {
  try {
    const cats = await prisma.documentary.groupBy({
      by: ["category"],
      _count: { category: true },
      orderBy: { _count: { category: "desc" } },
    });
    res.json({ data: cats.map((c) => ({ name: c.category, count: c._count.category })) });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// GET /api/documentaries/:slug
documentaryRoutes.get("/:slug", async (req: Request, res: Response) => {
  try {
    const doc = await prisma.documentary.findUnique({
      where: { slug: req.params.slug as string },
      include: { uploader: { select: { id: true, name: true } } },
    });
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json({ data: doc });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch documentary" });
  }
});

// POST /api/documentaries
documentaryRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const uploaderId = req.headers["x-user-id"] as string;
    if (!uploaderId) return res.status(401).json({ error: "Auth required" });

    const data = createSchema.parse(req.body);

    // Extract YouTube ID from trailer URL if provided
    let trailerYoutubeId: string | undefined;
    if (data.trailerUrl) {
      const id = extractYouTubeId(data.trailerUrl);
      if (id) trailerYoutubeId = id;
    }

    const doc = await prisma.documentary.create({
      data: {
        ...data,
        trailerUrl: data.trailerUrl || undefined,
        uploaderId,
      },
      include: { uploader: { select: { id: true, name: true } } },
    });
    res.status(201).json({ data: doc });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", details: error.errors });
    }
    res.status(500).json({ error: "Failed to create documentary" });
  }
});

// DELETE /api/documentaries/:id
documentaryRoutes.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.documentary.delete({ where: { id: req.params.id as string } });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

// ─── Watchlist ─────────────────────────────────

// GET /api/documentaries/user/watchlist
documentaryRoutes.get("/user/watchlist", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Auth required" });

    const items = await prisma.watchlistItem.findMany({
      where: { userId },
      include: { documentary: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ data: items.map((i) => i.documentary) });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch watchlist" });
  }
});

// POST /api/documentaries/:id/watchlist
documentaryRoutes.post("/:id/watchlist", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Auth required" });

    const documentaryId = req.params.id as string;
    const existing = await prisma.watchlistItem.findUnique({
      where: { userId_documentaryId: { userId, documentaryId } },
    });

    if (existing) {
      await prisma.watchlistItem.delete({ where: { id: existing.id } });
      res.json({ inWatchlist: false });
    } else {
      await prisma.watchlistItem.create({ data: { userId, documentaryId } });
      res.json({ inWatchlist: true });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to toggle watchlist" });
  }
});

// GET /api/documentaries/:id/watchlist/check
documentaryRoutes.get("/:id/watchlist/check", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.json({ inWatchlist: false });

    const item = await prisma.watchlistItem.findUnique({
      where: { userId_documentaryId: { userId, documentaryId: req.params.id as string } },
    });
    res.json({ inWatchlist: !!item });
  } catch (error) {
    res.status(500).json({ error: "Failed to check watchlist" });
  }
});
