import { Router, Request, Response } from "express";
import { prisma } from "../index";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { UPLOAD_DIRS } from "../config/uploads";

export const bookRoutes = Router();

// ─── File Upload Config ────────────────────────
const bookDir = path.join(UPLOAD_DIRS.base, "books");
if (!fs.existsSync(bookDir)) {
  fs.mkdirSync(bookDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, bookDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `book-${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/epub+zip",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error(`File type ${file.mimetype} not allowed`));
  },
});

// ─── Admin Auth Helper ─────────────────────────
async function requireAdmin(userId: string | undefined): Promise<boolean> {
  if (!userId) return false;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  return user?.role === "admin";
}

// ─── GET /api/books — List books (public) ──────
bookRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const { category, subcategory, search, page = "1", limit = "20" } = req.query;
    const where: Record<string, any> = { published: true };

    if (category) where.category = category as string;
    if (subcategory) where.subcategory = subcategory as string;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: "insensitive" } },
        { author: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.book.count({ where }),
    ]);

    res.json({
      data: books,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// ─── GET /api/books/categories — List categories ──
bookRoutes.get("/categories", async (_req: Request, res: Response) => {
  try {
    const cats = await prisma.book.groupBy({
      by: ["category"],
      where: { published: true },
      _count: { category: true },
      orderBy: { _count: { category: "desc" } },
    });
    res.json({ data: cats.map((c) => ({ name: c.category, count: c._count.category })) });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// ─── GET /api/books/:id — Get single book ──────
bookRoutes.get("/:id", async (req: Request, res: Response) => {
  try {
    const book = await prisma.book.findUnique({ where: { id: req.params.id as string } });
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json({ data: book });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch book" });
  }
});

// ─── POST /api/books — Create book (admin) ─────
bookRoutes.post("/", upload.fields([{ name: "coverImage", maxCount: 1 }, { name: "file", maxCount: 1 }]), async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!(await requireAdmin(userId))) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { title, author, description, isbn, publisher, publicationYear, category, subcategory, tags, externalLink, price, salePrice, isFree } = req.body;

    if (!title || !author) {
      return res.status(400).json({ error: "Title and author are required" });
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const coverFile = files?.coverImage?.[0];
    const bookFile = files?.file?.[0];

    const book = await prisma.book.create({
      data: {
        title,
        author,
        description: description || null,
        isbn: isbn || null,
        publisher: publisher || null,
        publicationYear: publicationYear ? parseInt(publicationYear) : null,
        category: category || "Astronomy",
        subcategory: subcategory || null,
        tags: tags || null,
        coverImage: coverFile ? `/uploads/books/${coverFile.filename}` : null,
        fileUrl: bookFile ? `/uploads/books/${bookFile.filename}` : null,
        fileName: bookFile ? bookFile.originalname : null,
        fileSize: bookFile ? bookFile.size : null,
        externalLink: externalLink || null,
        price: price ? parseFloat(price) : 0,
        salePrice: salePrice ? parseFloat(salePrice) : null,
        isFree: isFree !== "false",
        uploaderId: userId,
      },
    });

    res.status(201).json({ data: book });
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ error: "Failed to create book" });
  }
});

// ─── PUT /api/books/:id — Update book (admin) ──
bookRoutes.put("/:id", upload.fields([{ name: "coverImage", maxCount: 1 }, { name: "file", maxCount: 1 }]), async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!(await requireAdmin(userId))) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const existing = await prisma.book.findUnique({ where: { id: req.params.id as string } });
    if (!existing) return res.status(404).json({ error: "Book not found" });

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const coverFile = files?.coverImage?.[0];
    const bookFile = files?.file?.[0];

    const { title, author, description, isbn, publisher, publicationYear, category, subcategory, tags, externalLink, price, salePrice, isFree, published } = req.body;

    const book = await prisma.book.update({
      where: { id: req.params.id as string },
      data: {
        ...(title && { title }),
        ...(author && { author }),
        ...(description !== undefined && { description }),
        ...(isbn !== undefined && { isbn }),
        ...(publisher !== undefined && { publisher }),
        ...(publicationYear !== undefined && { publicationYear: publicationYear ? parseInt(publicationYear) : null }),
        ...(category && { category }),
        ...(subcategory !== undefined && { subcategory }),
        ...(tags !== undefined && { tags }),
        ...(coverFile && { coverImage: `/uploads/books/${coverFile.filename}` }),
        ...(bookFile && { fileUrl: `/uploads/books/${bookFile.filename}`, fileName: bookFile.originalname, fileSize: bookFile.size }),
        ...(externalLink !== undefined && { externalLink }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(salePrice !== undefined && { salePrice: salePrice ? parseFloat(salePrice) : null }),
        ...(isFree !== undefined && { isFree: isFree === "true" || isFree === true }),
        ...(published !== undefined && { published: published === "true" || published === true }),
      },
    });

    res.json({ data: book });
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ error: "Failed to update book" });
  }
});

// ─── DELETE /api/books/:id — Delete book (admin) ──
bookRoutes.delete("/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!(await requireAdmin(userId))) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const existing = await prisma.book.findUnique({ where: { id: req.params.id as string } });
    if (!existing) return res.status(404).json({ error: "Book not found" });

    // Delete files
    if (existing.coverImage) {
      const p = path.join(UPLOAD_DIRS.base, existing.coverImage.replace("/uploads/", ""));
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
    if (existing.fileUrl) {
      const p = path.join(UPLOAD_DIRS.base, existing.fileUrl.replace("/uploads/", ""));
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }

    await prisma.book.delete({ where: { id: req.params.id as string } });
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ error: "Failed to delete book" });
  }
});

// ─── POST /api/books/:id/download — Track download ──
bookRoutes.post("/:id/download", async (req: Request, res: Response) => {
  try {
    const book = await prisma.book.update({
      where: { id: req.params.id as string },
      data: { downloads: { increment: 1 } },
      select: { fileUrl: true, fileName: true },
    });
    if (!book.fileUrl) return res.status(400).json({ error: "No file available" });
    res.json({ downloadUrl: book.fileUrl, fileName: book.fileName });
  } catch (error) {
    res.status(500).json({ error: "Failed" });
  }
});
