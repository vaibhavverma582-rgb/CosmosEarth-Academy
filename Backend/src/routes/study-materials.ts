import { Router, Request, Response } from "express";
import { prisma } from "../index";
import { z } from "zod";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { UPLOAD_DIRS } from "../config/uploads";

export const studyMaterialRoutes = Router();

// ─── File Upload Config ────────────────────────
if (!fs.existsSync(UPLOAD_DIRS.studyMaterials)) {
  fs.mkdirSync(UPLOAD_DIRS.studyMaterials, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIRS.studyMaterials),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "text/markdown",
      "text/plain",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`));
    }
  },
});

const createStudyMaterialSchema = z.object({
  title: z.string().min(1).max(200),
  author: z.string().min(1).max(200),
  type: z.string().default("Book"),
  status: z.string().default("Reading"),
  description: z.string().optional(),
  link: z.string().optional(),
});

// ─── GET /api/study-materials — List all ──────
studyMaterialRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const { type, search } = req.query;
    const where: Record<string, any> = {};

    if (type) where.type = type as string;
    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { author: { contains: search as string } },
      ];
    }

    const materials = await prisma.studyMaterial.findMany({
      where,
      include: {
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ data: materials });
  } catch (error) {
    console.error("Error fetching study materials:", error);
    res.status(500).json({ error: "Failed to fetch study materials" });
  }
});

// ─── GET /api/study-materials/my — List user's materials ──
studyMaterialRoutes.get("/my", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Auth required" });

    const materials = await prisma.studyMaterial.findMany({
      where: { userId },
      include: {
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ data: materials });
  } catch (error) {
    console.error("Error fetching study materials:", error);
    res.status(500).json({ error: "Failed to fetch study materials" });
  }
});

// ─── GET /api/study-materials/types — List types ──
studyMaterialRoutes.get("/types", async (_req: Request, res: Response) => {
  try {
    const types = await prisma.studyMaterial.groupBy({
      by: ["type"],
      _count: { type: true },
      orderBy: { _count: { type: "desc" } },
    });

    res.json({
      data: types.map((t) => ({ name: t.type, count: t._count.type })),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch types" });
  }
});

// ─── POST /api/study-materials — Create ────────
studyMaterialRoutes.post(
  "/",
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      const userId = req.headers["x-user-id"] as string;
      if (!userId) return res.status(401).json({ error: "Auth required" });

      const body = req.body;
      const data = createStudyMaterialSchema.parse(body);

      const fileUrl = req.file
        ? `/uploads/study-materials/${req.file.filename}`
        : null;
      const fileName = req.file ? req.file.originalname : null;
      const fileSize = req.file ? req.file.size : null;

      const material = await prisma.studyMaterial.create({
        data: {
          ...data,
          description: body.description || null,
          link: body.link || null,
          fileUrl,
          fileName,
          fileSize,
          userId,
        },
        include: {
          user: { select: { id: true, name: true } },
        },
      });

      res.status(201).json({ data: material });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ error: "Validation failed", details: error.errors });
      }
      console.error("Error creating study material:", error);
      res.status(500).json({ error: "Failed to create study material" });
    }
  }
);

// ─── DELETE /api/study-materials/:id — Delete ──
studyMaterialRoutes.delete("/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Auth required" });

    const material = await prisma.studyMaterial.findUnique({
      where: { id: req.params.id as string },
    });

    if (!material) {
      return res.status(404).json({ error: "Material not found" });
    }

    if (material.userId !== userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Delete the file if it exists
    if (material.fileUrl) {
      const filePath = path.join(UPLOAD_DIRS.studyMaterials, path.basename(material.fileUrl));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await prisma.studyMaterial.delete({
      where: { id: req.params.id as string },
    });

    res.json({ message: "Study material deleted successfully" });
  } catch (error) {
    console.error("Error deleting study material:", error);
    res.status(500).json({ error: "Failed to delete study material" });
  }
});
