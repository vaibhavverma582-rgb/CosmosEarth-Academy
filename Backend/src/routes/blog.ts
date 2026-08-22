import { Router } from "express";
import { prisma } from "../index";
import multer from "multer";
import path from "path";
import fs from "fs";
import { UPLOAD_DIRS } from "../config/uploads";

export const blogRoutes = Router();

// ─── File Upload Config ──────────────────────
if (!fs.existsSync(UPLOAD_DIRS.blog)) {
  fs.mkdirSync(UPLOAD_DIRS.blog, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIRS.blog);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowed.test(file.mimetype);
    cb(null, extOk && mimeOk);
  },
});

// ─── GET /api/blog — List posts ─────────────
blogRoutes.get("/", async (req, res) => {
  try {
    const { search, category, page = "1", limit = "20" } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { published: true };

    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { excerpt: { contains: search as string } },
        { category: { contains: search as string } },
      ];
    }

    if (category) {
      where.category = category as string;
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, avatar: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.blogPost.count({ where }),
    ]);

    res.json({
      data: posts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Blog list error:", error);
    res.status(500).json({ error: "Failed to fetch blog posts" });
  }
});

// ─── GET /api/blog/categories — List categories
blogRoutes.get("/categories", async (_req, res) => {
  try {
    const categories = await prisma.blogPost.groupBy({
      by: ["category"],
      where: { published: true },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });

    res.json({
      data: categories.map((c) => ({
        name: c.category,
        count: c._count.id,
      })),
    });
  } catch (error) {
    console.error("Blog categories error:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// ─── GET /api/blog/:slug — Get single post ──
blogRoutes.get("/:slug", async (req, res) => {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: req.params.slug },
      include: {
        author: { select: { id: true, name: true, avatar: true, image: true, bio: true } },
      },
    });

    if (!post) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    res.json({ data: post });
  } catch (error) {
    console.error("Blog get error:", error);
    res.status(500).json({ error: "Failed to fetch blog post" });
  }
});

// ─── POST /api/blog — Create post ───────────
blogRoutes.post("/", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { title, slug, excerpt, content, category, readTime, coverImage, published } = req.body;

    if (!title || !slug || !excerpt || !content || !category) {
      return res.status(400).json({ error: "Title, slug, excerpt, content, and category are required" });
    }

    // Check slug uniqueness
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) {
      return res.status(409).json({ error: "A post with this slug already exists" });
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        category,
        readTime: readTime || "5 min",
        coverImage: coverImage || null,
        published: published !== false,
        authorId: userId,
      },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
      },
    });

    res.status(201).json({ data: post });
  } catch (error) {
    console.error("Blog create error:", error);
    res.status(500).json({ error: "Failed to create blog post" });
  }
});

// ─── PUT /api/blog/:id — Update post ────────
blogRoutes.put("/:id", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { title, slug, excerpt, content, category, readTime, coverImage, published } = req.body;

    // Check ownership
    const existing = await prisma.blogPost.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return res.status(404).json({ error: "Blog post not found" });
    }
    if (existing.authorId !== userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Check slug uniqueness if changed
    if (slug && slug !== existing.slug) {
      const slugTaken = await prisma.blogPost.findUnique({ where: { slug } });
      if (slugTaken) {
        return res.status(409).json({ error: "A post with this slug already exists" });
      }
    }

    const post = await prisma.blogPost.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(excerpt && { excerpt }),
        ...(content && { content }),
        ...(category && { category }),
        ...(readTime && { readTime }),
        ...(coverImage !== undefined && { coverImage }),
        ...(published !== undefined && { published }),
      },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
      },
    });

    res.json({ data: post });
  } catch (error) {
    console.error("Blog update error:", error);
    res.status(500).json({ error: "Failed to update blog post" });
  }
});

// ─── DELETE /api/blog/:id — Delete post ─────
blogRoutes.delete("/:id", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const existing = await prisma.blogPost.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return res.status(404).json({ error: "Blog post not found" });
    }
    if (existing.authorId !== userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await prisma.blogPost.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    console.error("Blog delete error:", error);
    res.status(500).json({ error: "Failed to delete blog post" });
  }
});

// ─── POST /api/blog/upload — Upload cover image
blogRoutes.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileUrl = `/uploads/blog/${req.file.filename}`;
    res.json({ url: fileUrl });
  } catch (error) {
    console.error("Blog upload error:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});
