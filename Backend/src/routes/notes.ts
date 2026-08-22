import { Router, Request, Response } from "express";
import { prisma } from "../index";
import { z } from "zod";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { UPLOAD_DIRS } from "../config/uploads";

export const noteRoutes = Router();

// ─── File Upload Config ────────────────────────
if (!fs.existsSync(UPLOAD_DIRS.notes)) {
  fs.mkdirSync(UPLOAD_DIRS.notes, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIRS.notes);
  },
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

// Validation
const createNoteSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  content: z.string().optional(),
  subject: z.string().min(1),
  topic: z.string().optional(),
  mediaCategory: z.string().default("Astronomy"),
  tags: z.array(z.string()).optional(),
});

// ─── GET /api/notes — List all notes ───────────
noteRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const { subject, topic, search, authorId, page = "1", limit = "20" } = req.query;

    const where: Record<string, any> = { published: true };

    if (subject) where.subject = subject as string;
    if (topic) where.topic = topic as string;
    if (authorId) where.authorId = authorId as string;
    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { description: { contains: search as string } },
        { subject: { contains: search as string } },
        { topic: { contains: search as string } },
      ];
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, avatar: true, image: true } },
          tags: { select: { name: true } },
          _count: { select: { bookmarks: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.note.count({ where }),
    ]);

    res.json({
      data: notes,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// ─── GET /api/notes/subjects — List all subjects
noteRoutes.get("/subjects", async (_req: Request, res: Response) => {
  try {
    const subjects = await prisma.note.groupBy({
      by: ["subject"],
      _count: { subject: true },
      orderBy: { _count: { subject: "desc" } },
    });

    res.json({
      data: subjects.map((s) => ({
        name: s.subject,
        count: s._count.subject,
      })),
    });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
});

// ─── GET /api/notes/:id — Get single note ──────
noteRoutes.get("/:id", async (req: Request, res: Response) => {
  try {
    const note = await prisma.note.findUnique({
      where: { id: req.params.id as string },
      include: {
        author: { select: { id: true, name: true, avatar: true, image: true, bio: true } },
        tags: { select: { name: true } },
        _count: { select: { bookmarks: true } },
      },
    });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ data: note });
  } catch (error) {
    console.error("Error fetching note:", error);
    res.status(500).json({ error: "Failed to fetch note" });
  }
});

// ─── POST /api/notes — Create a note ───────────
noteRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const data = createNoteSchema.parse(req.body);
    const authorId = req.headers["x-user-id"] as string;

    if (!authorId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const note = await prisma.note.create({
      data: {
        title: data.title,
        description: data.description,
        content: data.content,
        subject: data.subject,
        topic: data.topic,
        mediaCategory: data.mediaCategory || "Astronomy",
        authorId,
        fileType: data.content ? "markdown" : "markdown",
        tags: data.tags
          ? { create: data.tags.map((name) => ({ name })) }
          : undefined,
      },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        tags: { select: { name: true } },
      },
    });

    res.status(201).json({ data: note });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", details: error.errors });
    }
    console.error("Error creating note:", error);
    res.status(500).json({ error: "Failed to create note" });
  }
});

// ─── POST /api/notes/upload — Upload a file note
noteRoutes.post("/upload", upload.single("file"), async (req: Request, res: Response) => {
  try {
    const authorId = req.headers["x-user-id"] as string;
    if (!authorId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const { title, description, subject, topic, mediaCategory, tags } = req.body;

    if (!title || !subject) {
      return res.status(400).json({ error: "Title and subject are required" });
    }

    // Determine file type
    let fileType = "markdown";
    if (file.mimetype === "application/pdf") fileType = "pdf";
    else if (file.mimetype.includes("word")) fileType = "docx";
    else if (file.mimetype.startsWith("image/")) fileType = "image";

    const note = await prisma.note.create({
      data: {
        title,
        description: description || "",
        subject,
        topic: topic || null,
        mediaCategory: mediaCategory || "Astronomy",
        fileType,
        fileName: file.originalname,
        fileSize: file.size,
        fileUrl: `/uploads/notes/${file.filename}` as string,
        authorId,
        tags: tags
          ? { create: JSON.parse(tags).map((name: string) => ({ name })) }
          : undefined,
      },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        tags: { select: { name: true } },
      },
    });

    res.status(201).json({ data: note });
  } catch (error) {
    console.error("Error uploading note:", error);
    res.status(500).json({ error: "Failed to upload note" });
  }
});

// ─── PUT /api/notes/:id — Update a note ────────
noteRoutes.put("/:id", async (req: Request, res: Response) => {
  try {
    const note = await prisma.note.update({
      where: { id: req.params.id as string },
      data: req.body,
      include: {
        author: { select: { id: true, name: true } },
        tags: { select: { name: true } },
      },
    });
    res.json({ data: note });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Failed to update note" });
  }
});

// ─── DELETE /api/notes/:id — Delete a note ─────
noteRoutes.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.note.delete({ where: { id: req.params.id as string } });
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Failed to delete note" });
  }
});

// ─── POST /api/notes/:id/bookmark — Toggle bookmark
noteRoutes.post("/:id/bookmark", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const noteId = req.params.id as string;

    // Check if bookmark exists
    const existing = await prisma.noteBookmark.findUnique({
      where: { userId_noteId: { userId, noteId } },
    });

    if (existing) {
      await prisma.noteBookmark.delete({ where: { id: existing.id } });
      res.json({ bookmarked: false });
    } else {
      await prisma.noteBookmark.create({
        data: { userId, noteId },
      });
      res.json({ bookmarked: true });
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    res.status(500).json({ error: "Failed to toggle bookmark" });
  }
});

// ─── GET /api/notes/bookmarks — Get user bookmarks
noteRoutes.get("/user/bookmarks", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const bookmarks = await prisma.noteBookmark.findMany({
      where: { userId },
      include: {
        note: {
          include: {
            author: { select: { id: true, name: true, avatar: true } },
            tags: { select: { name: true } },
            _count: { select: { bookmarks: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      data: bookmarks.map((b) => b.note),
    });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({ error: "Failed to fetch bookmarks" });
  }
});

// ─── POST /api/notes/:id/download — Track download
noteRoutes.post("/:id/download", async (req: Request, res: Response) => {
  try {
    const note = await prisma.note.update({
      where: { id: req.params.id as string },
      data: { downloads: { increment: 1 } },
      select: { fileUrl: true, fileName: true },
    });

    if (!note.fileUrl) {
      return res.status(400).json({ error: "No file to download" });
    }

    res.json({
      downloadUrl: note.fileUrl,
      fileName: note.fileName,
    });
  } catch (error) {
    console.error("Error tracking download:", error);
    res.status(500).json({ error: "Failed to process download" });
  }
});
