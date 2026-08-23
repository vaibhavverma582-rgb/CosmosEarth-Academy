import { Router, Request, Response } from "express";
import { prisma } from "../index";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { UPLOAD_DIRS } from "../config/uploads";

export const storeRoutes = Router();

// ─── File Upload Config ────────────────────────
const storeDir = path.join(UPLOAD_DIRS.base, "store");
if (!fs.existsSync(storeDir)) {
  fs.mkdirSync(storeDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, storeDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `store-${uuidv4()}${ext}`);
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
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/zip",
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

// ─── GET /api/store — List store products (public) ──
storeRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const { category, type, isFree, search, page = "1", limit = "20" } = req.query;
    const where: Record<string, any> = { published: true };

    if (category) where.category = category as string;
    if (type) where.type = type as string;
    if (isFree === "true") where.isFree = true;
    if (isFree === "false") where.isFree = false;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
        { tags: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      prisma.storeProduct.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
        select: {
          id: true, title: true, description: true, type: true,
          category: true, subcategory: true, tags: true,
          coverImage: true, price: true, salePrice: true, isFree: true,
          downloads: true, createdAt: true,
        },
      }),
      prisma.storeProduct.count({ where }),
    ]);

    res.json({
      data: products,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    console.error("Error fetching store products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ─── GET /api/store/categories — List categories ──
storeRoutes.get("/categories", async (_req: Request, res: Response) => {
  try {
    const cats = await prisma.storeProduct.groupBy({
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

// ─── GET /api/store/types — List types ──
storeRoutes.get("/types", async (_req: Request, res: Response) => {
  try {
    const types = await prisma.storeProduct.groupBy({
      by: ["type"],
      where: { published: true },
      _count: { type: true },
      orderBy: { _count: { type: "desc" } },
    });
    res.json({ data: types.map((t) => ({ name: t.type, count: t._count.type })) });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch types" });
  }
});

// ─── GET /api/store/analytics — Admin analytics ──
storeRoutes.get("/analytics", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!(await requireAdmin(userId))) return res.status(403).json({ error: "Admin access required" });

    const [totalProducts, freeProducts, paidProducts, totalOrders, paidOrders, failedOrders, totalRevenue, totalDownloads] = await Promise.all([
      prisma.storeProduct.count(),
      prisma.storeProduct.count({ where: { isFree: true } }),
      prisma.storeProduct.count({ where: { isFree: false } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PAID" } }),
      prisma.order.count({ where: { status: "FAILED" } }),
      prisma.order.aggregate({ where: { status: "PAID" }, _sum: { totalAmount: true } }),
      prisma.storeProduct.aggregate({ _sum: { downloads: true } }),
    ]);

    const recentPurchases = await prisma.purchase.findMany({
      include: {
        user: { select: { name: true, email: true } },
        product: { select: { title: true } },
        order: { select: { orderNumber: true, totalAmount: true, createdAt: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    res.json({
      data: {
        totalProducts,
        freeProducts,
        paidProducts,
        totalOrders,
        paidOrders,
        failedOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        totalDownloads: totalDownloads._sum.downloads || 0,
        recentPurchases,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

// ─── GET /api/store/:id — Get single product ──
storeRoutes.get("/:id", async (req: Request, res: Response) => {
  try {
    const product = await prisma.storeProduct.findUnique({ where: { id: req.params.id as string } });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ data: product });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// ─── POST /api/store — Create product (admin) ──
storeRoutes.post("/", upload.fields([{ name: "coverImage", maxCount: 1 }, { name: "file", maxCount: 1 }, { name: "preview", maxCount: 1 }]), async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!(await requireAdmin(userId))) return res.status(403).json({ error: "Admin access required" });

    const { title, description, type, category, subcategory, tags, price, salePrice, isFree, published } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const product = await prisma.storeProduct.create({
      data: {
        title,
        description: description || null,
        type: type || "Other",
        category: category || "Astronomy",
        subcategory: subcategory || null,
        tags: tags || null,
        coverImage: files?.coverImage?.[0] ? `/uploads/store/${files.coverImage[0].filename}` : null,
        fileUrl: files?.file?.[0] ? `/uploads/store/${files.file[0].filename}` : null,
        fileName: files?.file?.[0]?.originalname || null,
        fileSize: files?.file?.[0]?.size || null,
        previewUrl: files?.preview?.[0] ? `/uploads/store/${files.preview[0].filename}` : null,
        price: price ? parseFloat(price) : 0,
        salePrice: salePrice ? parseFloat(salePrice) : null,
        isFree: isFree !== "false",
        published: published !== "false",
        uploaderId: userId,
      },
    });

    res.status(201).json({ data: product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// ─── PUT /api/store/:id — Update product (admin) ──
storeRoutes.put("/:id", upload.fields([{ name: "coverImage", maxCount: 1 }, { name: "file", maxCount: 1 }, { name: "preview", maxCount: 1 }]), async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!(await requireAdmin(userId))) return res.status(403).json({ error: "Admin access required" });

    const existing = await prisma.storeProduct.findUnique({ where: { id: req.params.id as string } });
    if (!existing) return res.status(404).json({ error: "Product not found" });

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const { title, description, type, category, subcategory, tags, price, salePrice, isFree, published } = req.body;

    const product = await prisma.storeProduct.update({
      where: { id: req.params.id as string },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(type && { type }),
        ...(category && { category }),
        ...(subcategory !== undefined && { subcategory }),
        ...(tags !== undefined && { tags }),
        ...(files?.coverImage?.[0] && { coverImage: `/uploads/store/${files.coverImage[0].filename}` }),
        ...(files?.file?.[0] && { fileUrl: `/uploads/store/${files.file[0].filename}`, fileName: files.file[0].originalname, fileSize: files.file[0].size }),
        ...(files?.preview?.[0] && { previewUrl: `/uploads/store/${files.preview[0].filename}` }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(salePrice !== undefined && { salePrice: salePrice ? parseFloat(salePrice) : null }),
        ...(isFree !== undefined && { isFree: isFree === "true" || isFree === true }),
        ...(published !== undefined && { published: published === "true" || published === true }),
      },
    });

    res.json({ data: product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// ─── DELETE /api/store/:id — Delete product (admin) ──
storeRoutes.delete("/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!(await requireAdmin(userId))) return res.status(403).json({ error: "Admin access required" });

    const existing = await prisma.storeProduct.findUnique({ where: { id: req.params.id as string } });
    if (!existing) return res.status(404).json({ error: "Product not found" });

    // Delete files
    for (const field of ["coverImage", "fileUrl", "previewUrl"]) {
      const url = (existing as any)[field];
      if (url) {
        const p = path.join(UPLOAD_DIRS.base, url.replace("/uploads/", ""));
        if (fs.existsSync(p)) fs.unlinkSync(p);
      }
    }

    await prisma.storeProduct.delete({ where: { id: req.params.id as string } });
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});
