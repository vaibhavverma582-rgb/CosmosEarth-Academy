import { Router, Request, Response } from "express";
import { prisma } from "../index";
import { z } from "zod";

export const podcastRoutes = Router();

const createPodcastSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  description: z.string().min(1),
  author: z.string().min(1),
  coverUrl: z.string().url().optional(),
  category: z.string().default("General"),
  tags: z.string().optional(),
});

const createEpisodeSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  audioUrl: z.string().url(),
  duration: z.coerce.number().optional(),
  episodeNumber: z.coerce.number().default(1),
  seasonNumber: z.coerce.number().default(1),
});

// ─── GET /api/podcasts ─────────────────────────
podcastRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const { category, search, featured } = req.query;
    const where: Record<string, any> = { published: true };
    if (category) where.category = category as string;
    if (featured === "true") where.featured = true;
    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { author: { contains: search as string } },
        { description: { contains: search as string } },
      ];
    }

    const podcasts = await prisma.podcast.findMany({
      where,
      include: {
        creator: { select: { id: true, name: true } },
        _count: { select: { episodes: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ data: podcasts });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch podcasts" });
  }
});

// GET /api/podcasts/categories
podcastRoutes.get("/categories", async (_req: Request, res: Response) => {
  try {
    const cats = await prisma.podcast.groupBy({
      by: ["category"],
      _count: { category: true },
      orderBy: { _count: { category: "desc" } },
    });
    res.json({ data: cats.map((c) => ({ name: c.category, count: c._count.category })) });
  } catch (error) {
    res.status(500).json({ error: "Failed" });
  }
});

// ─── DELETE /api/podcasts/:id — Delete a podcast
podcastRoutes.delete("/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Auth required" });

    const podcast = await prisma.podcast.findUnique({ where: { id: req.params.id as string } });
    if (!podcast) return res.status(404).json({ error: "Podcast not found" });
    if (podcast.creatorId !== userId) return res.status(403).json({ error: "Not authorized" });

    await prisma.podcast.delete({ where: { id: req.params.id as string } });
    res.json({ message: "Podcast deleted successfully" });
  } catch (error) {
    console.error("Error deleting podcast:", error);
    res.status(500).json({ error: "Failed to delete podcast" });
  }
});

// GET /api/podcasts/:slug
podcastRoutes.get("/:slug", async (req: Request, res: Response) => {
  try {
    const podcast = await prisma.podcast.findUnique({
      where: { slug: req.params.slug as string },
      include: {
        creator: { select: { id: true, name: true } },
        episodes: { orderBy: { episodeNumber: "desc" } },
        _count: { select: { episodes: true, favorites: true, subscriptions: true } },
      },
    });
    if (!podcast) return res.status(404).json({ error: "Not found" });
    res.json({ data: podcast });
  } catch (error) {
    res.status(500).json({ error: "Failed" });
  }
});

// POST /api/podcasts
podcastRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const creatorId = req.headers["x-user-id"] as string;
    if (!creatorId) return res.status(401).json({ error: "Auth required" });
    const data = createPodcastSchema.parse(req.body);
    const podcast = await prisma.podcast.create({
      data: { ...data, creatorId },
      include: { creator: { select: { id: true, name: true } } },
    });
    res.status(201).json({ data: podcast });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", details: error.errors });
    }
    res.status(500).json({ error: "Failed" });
  }
});

// ─── Episodes ──────────────────────────────────

// GET /api/podcasts/:id/episodes
podcastRoutes.get("/:id/episodes", async (req: Request, res: Response) => {
  try {
    const episodes = await prisma.podcastEpisode.findMany({
      where: { podcastId: req.params.id as string },
      orderBy: { episodeNumber: "desc" },
    });
    res.json({ data: episodes });
  } catch (error) {
    res.status(500).json({ error: "Failed" });
  }
});

// POST /api/podcasts/:id/episodes
podcastRoutes.post("/:id/episodes", async (req: Request, res: Response) => {
  try {
    const uploaderId = req.headers["x-user-id"] as string;
    if (!uploaderId) return res.status(401).json({ error: "Auth required" });

    const data = createEpisodeSchema.parse(req.body);
    const episode = await prisma.podcastEpisode.create({
      data: { ...data, podcastId: req.params.id as string, uploaderId },
    });

    // Update episode count
    await prisma.podcast.update({
      where: { id: req.params.id as string },
      data: { episodeCount: { increment: 1 } } as any,
    });

    res.status(201).json({ data: episode });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", details: error.errors });
    }
    res.status(500).json({ error: "Failed" });
  }
});

// ─── Favorites ─────────────────────────────────

podcastRoutes.post("/:id/favorite", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Auth required" });
    const podcastId = req.params.id as string;

    const existing = await prisma.podcastFavorite.findUnique({
      where: { userId_podcastId: { userId, podcastId } },
    });
    if (existing) {
      await prisma.podcastFavorite.delete({ where: { id: existing.id } });
      res.json({ favorited: false });
    } else {
      await prisma.podcastFavorite.create({ data: { userId, podcastId } });
      res.json({ favorited: true });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed" });
  }
});

// GET /api/podcasts/user/favorites
podcastRoutes.get("/user/favorites", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Auth required" });
    const favs = await prisma.podcastFavorite.findMany({
      where: { userId },
      include: { podcast: { include: { _count: { select: { episodes: true } } } } },
      orderBy: { createdAt: "desc" },
    });
    res.json({ data: favs.map((f) => f.podcast) });
  } catch (error) {
    res.status(500).json({ error: "Failed" });
  }
});

// ─── Subscriptions ─────────────────────────────

podcastRoutes.post("/:id/subscribe", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Auth required" });
    const podcastId = req.params.id as string;

    const existing = await prisma.podcastSubscription.findUnique({
      where: { userId_podcastId: { userId, podcastId } },
    });
    if (existing) {
      await prisma.podcastSubscription.delete({ where: { id: existing.id } });
      res.json({ subscribed: false });
    } else {
      await prisma.podcastSubscription.create({ data: { userId, podcastId } });
      res.json({ subscribed: true });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed" });
  }
});

// GET /api/podcasts/user/subscriptions
podcastRoutes.get("/user/subscriptions", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Auth required" });
    const subs = await prisma.podcastSubscription.findMany({
      where: { userId },
      include: { podcast: { include: { _count: { select: { episodes: true } } } } },
      orderBy: { createdAt: "desc" },
    });
    res.json({ data: subs.map((s) => s.podcast) });
  } catch (error) {
    res.status(500).json({ error: "Failed" });
  }
});

// ─── Listening History ─────────────────────────

podcastRoutes.post("/episodes/:episodeId/progress", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Auth required" });
    const episodeId = req.params.episodeId as string;
    const { currentTime, duration } = req.body;
    const percentComplete = duration > 0 ? (currentTime / duration) * 100 : 0;
    const completed = percentComplete >= 90;

    const progress = await prisma.listeningHistory.upsert({
      where: { userId_episodeId: { userId, episodeId } },
      update: { currentTime, percentComplete, completed },
      create: { userId, episodeId, currentTime, percentComplete, completed },
    });
    res.json({ data: progress });
  } catch (error) {
    res.status(500).json({ error: "Failed" });
  }
});

podcastRoutes.get("/user/history", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Auth required" });
    const history = await prisma.listeningHistory.findMany({
      where: { userId },
      include: { episode: { include: { podcast: { select: { id: true, title: true, coverUrl: true, author: true } } } } },
      orderBy: { updatedAt: "desc" },
    });
    res.json({ data: history });
  } catch (error) {
    res.status(500).json({ error: "Failed" });
  }
});
