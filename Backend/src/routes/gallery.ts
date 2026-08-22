import { Router, Request, Response } from "express";
import { prisma } from "../index";
import { z } from "zod";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { UPLOAD_DIRS } from "../config/uploads";

export const galleryRoutes = Router();

// ─── File Upload Config ────────────────────────
if (!fs.existsSync(UPLOAD_DIRS.gallery)) {
  fs.mkdirSync(UPLOAD_DIRS.gallery, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIRS.gallery);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error(`File type ${file.mimetype} not allowed`));
  },
});

const createImageSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  category: z.string().default("General"),
  tags: z.string().optional(),
});

// ─── GET /api/gallery — List all images ────────
galleryRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const { category, search, featured, page = "1", limit = "24" } = req.query;

    const where: Record<string, any> = {};
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

    const [images, total] = await Promise.all([
      prisma.galleryImage.findMany({
        where,
        include: {
          uploader: { select: { id: true, name: true, avatar: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.galleryImage.count({ where }),
    ]);

    res.json({
      data: images,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    console.error("Error fetching gallery:", error);
    res.status(500).json({ error: "Failed to fetch gallery" });
  }
});

// ─── GET /api/gallery/categories — List categories
galleryRoutes.get("/categories", async (_req: Request, res: Response) => {
  try {
    const cats = await prisma.galleryImage.groupBy({
      by: ["category"],
      _count: { category: true },
      orderBy: { _count: { category: "desc" } },
    });
    res.json({ data: cats.map((c) => ({ name: c.category, count: c._count.category })) });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// ─── GET /api/gallery/:id — Get single image ───
galleryRoutes.get("/:id", async (req: Request, res: Response) => {
  try {
    const image = await prisma.galleryImage.findUnique({
      where: { id: req.params.id as string },
      include: { uploader: { select: { id: true, name: true, avatar: true } } },
    });
    if (!image) return res.status(404).json({ error: "Image not found" });
    res.json({ data: image });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch image" });
  }
});

// ─── POST /api/gallery — Upload image ──────────
galleryRoutes.post("/", upload.single("image"), async (req: Request, res: Response) => {
  try {
    const uploaderId = req.headers["x-user-id"] as string;
    if (!uploaderId) return res.status(401).json({ error: "Authentication required" });

    const file = req.file;
    if (!file) return res.status(400).json({ error: "No image provided" });

    const data = createImageSchema.parse(req.body);

    const image = await prisma.galleryImage.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl: `/uploads/gallery/${file.filename}`,
        thumbnailUrl: `/uploads/gallery/${file.filename}`,
        category: data.category,
        tags: data.tags,
        fileSize: file.size,
        uploaderId,
      },
      include: { uploader: { select: { id: true, name: true, avatar: true } } },
    });

    res.status(201).json({ data: image });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", details: error.errors });
    }
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

// ─── DELETE /api/gallery/:id — Delete image ────
galleryRoutes.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.galleryImage.delete({ where: { id: req.params.id as string } });
    res.json({ message: "Image deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete image" });
  }
});

// ─── POST /api/gallery/:id/download — Track download
galleryRoutes.post("/:id/download", async (req: Request, res: Response) => {
  try {
    const image = await prisma.galleryImage.update({
      where: { id: req.params.id as string },
      data: { downloads: { increment: 1 } } as any,
      select: { imageUrl: true },
    });
    res.json({ downloadUrl: image.imageUrl });
  } catch (error) {
    res.status(500).json({ error: "Failed to track download" });
  }
});
