import { Router, Request, Response } from "express";
import { prisma } from "../index";
import { z } from "zod";

export const videoRoutes = Router();

// ─── Helper: Extract YouTube ID ────────────────
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function getYouTubeThumbnail(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
}

const createVideoSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  youtubeUrl: z.string().url(),
  category: z.string().default("General"),
  tags: z.string().optional(),
  duration: z.coerce.number().optional(),
  thumbnailUrl: z.string().url().optional(),
  featured: z.coerce.boolean().optional(),
});

// ─── GET /api/videos — List all videos ─────────
videoRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const { category, search, featured, page = "1", limit = "20" } = req.query;

    const where: Record<string, any> = { published: true };
    if (category) where.category = category as string;
    if (featured === "true") where.featured = true;
    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { description: { contains: search as string } },
        { tags: { contains: search as string } },
      ];
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        include: {
          uploader: { select: { id: true, name: true, avatar: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.video.count({ where }),
    ]);

    res.json({
      data: videos,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

// ─── GET /api/videos/categories — List categories
videoRoutes.get("/categories", async (_req: Request, res: Response) => {
  try {
    const cats = await prisma.video.groupBy({
      by: ["category"],
      _count: { category: true },
      orderBy: { _count: { category: "desc" } },
    });
    res.json({ data: cats.map((c) => ({ name: c.category, count: c._count.category })) });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// ─── GET /api/videos/:id — Get single video ────
videoRoutes.get("/:id", async (req: Request, res: Response) => {
  try {
    const video = await prisma.video.findUnique({
      where: { id: req.params.id as string },
      include: { uploader: { select: { id: true, name: true, avatar: true, bio: true } } },
    });
    if (!video) return res.status(404).json({ error: "Video not found" });

    // Increment view count
    await prisma.video.update({ where: { id: video.id }, data: { views: { increment: 1 } } as any });

    res.json({ data: { ...video, views: video.views + 1 } });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch video" });
  }
});

// ─── POST /api/videos — Add a YouTube video ────
videoRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const uploaderId = req.headers["x-user-id"] as string;
    if (!uploaderId) return res.status(401).json({ error: "Authentication required" });

    const data = createVideoSchema.parse(req.body);

    const youtubeId = extractYouTubeId(data.youtubeUrl);
    if (!youtubeId) {
      return res.status(400).json({ error: "Invalid YouTube URL" });
    }

    const thumbnailUrl = data.thumbnailUrl || getYouTubeThumbnail(youtubeId);

    const video = await prisma.video.create({
      data: {
        title: data.title,
        description: data.description,
        youtubeUrl: data.youtubeUrl,
        youtubeId,
        thumbnailUrl,
        category: data.category,
        tags: data.tags,
        duration: data.duration,
        featured: data.featured || false,
        uploaderId,
      },
      include: { uploader: { select: { id: true, name: true, avatar: true } } },
    });

    res.status(201).json({ data: video });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", details: error.errors });
    }
    console.error("Error creating video:", error);
    res.status(500).json({ error: "Failed to create video" });
  }
});

// ─── PUT /api/videos/:id — Update video ────────
videoRoutes.put("/:id", async (req: Request, res: Response) => {
  try {
    const updateData: any = { ...req.body };

    // If youtubeUrl is being updated, re-extract the ID
    if (updateData.youtubeUrl) {
      const youtubeId = extractYouTubeId(updateData.youtubeUrl);
      if (!youtubeId) return res.status(400).json({ error: "Invalid YouTube URL" });
      updateData.youtubeId = youtubeId;
      if (!updateData.thumbnailUrl) {
        updateData.thumbnailUrl = getYouTubeThumbnail(youtubeId);
      }
    }

    const video = await prisma.video.update({
      where: { id: req.params.id as string },
      data: updateData,
      include: { uploader: { select: { id: true, name: true } } },
    });
    res.json({ data: video });
  } catch (error) {
    res.status(500).json({ error: "Failed to update video" });
  }
});

// ─── DELETE /api/videos/:id — Delete video ─────
videoRoutes.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.video.delete({ where: { id: req.params.id as string } });
    res.json({ message: "Video deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete video" });
  }
});

// ─── POST /api/videos/:id/progress — Update watch progress
videoRoutes.post("/:id/progress", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Authentication required" });

    const videoId = req.params.id as string;
    const { currentTime, duration } = req.body;

    const percentComplete = duration > 0 ? (currentTime / duration) * 100 : 0;
    const completed = percentComplete >= 90;

    const progress = await prisma.watchProgress.upsert({
      where: { userId_videoId: { userId, videoId } },
      update: { currentTime, percentComplete, completed },
      create: { userId, videoId, currentTime, percentComplete, completed },
    });

    res.json({ data: progress });
  } catch (error) {
    res.status(500).json({ error: "Failed to update progress" });
  }
});

// ─── GET /api/videos/user/progress — Get user's watch progress
videoRoutes.get("/user/progress", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Authentication required" });

    const progress = await prisma.watchProgress.findMany({
      where: { userId },
      include: {
        video: { select: { id: true, title: true, thumbnailUrl: true, duration: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    res.json({ data: progress });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});

// ─── Playlists ─────────────────────────────────

// GET /api/videos/playlists/all — List playlists
videoRoutes.get("/playlists/all", async (_req: Request, res: Response) => {
  try {
    const playlists = await prisma.playlist.findMany({
      include: {
        creator: { select: { id: true, name: true, avatar: true } },
        items: {
          include: {
            video: { select: { id: true, title: true, thumbnailUrl: true, duration: true } },
          },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ data: playlists });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
});

// POST /api/videos/playlists — Create playlist
videoRoutes.post("/playlists", async (req: Request, res: Response) => {
  try {
    const creatorId = req.headers["x-user-id"] as string;
    if (!creatorId) return res.status(401).json({ error: "Authentication required" });

    const { title, description, videoIds } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const playlist = await prisma.playlist.create({
      data: {
        title,
        description,
        creatorId,
        items: videoIds
          ? { create: videoIds.map((videoId: string, i: number) => ({ videoId, order: i + 1 })) }
          : undefined,
      },
      include: {
        creator: { select: { id: true, name: true } },
        items: { include: { video: { select: { id: true, title: true, thumbnailUrl: true } } } },
      },
    });

    res.status(201).json({ data: playlist });
  } catch (error) {
    res.status(500).json({ error: "Failed to create playlist" });
  }
});

// GET /api/videos/playlists/:id — Get playlist
videoRoutes.get("/playlists/:id", async (req: Request, res: Response) => {
  try {
    const playlist = await prisma.playlist.findUnique({
      where: { id: req.params.id as string },
      include: {
        creator: { select: { id: true, name: true, avatar: true } },
        items: {
          include: {
            video: { include: { uploader: { select: { id: true, name: true } } } },
          },
          orderBy: { order: "asc" },
        },
      },
    });
    if (!playlist) return res.status(404).json({ error: "Playlist not found" });
    res.json({ data: playlist });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch playlist" });
  }
});
