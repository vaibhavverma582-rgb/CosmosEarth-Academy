import { Router, Request, Response } from "express";
import { prisma } from "../index";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { UPLOAD_DIRS } from "../config/uploads";

export const researchPaperRoutes = Router();

const papersDir = path.join(UPLOAD_DIRS.base, "research-papers");
if (!fs.existsSync(papersDir)) fs.mkdirSync(papersDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, papersDir),
  filename: (_req, file, cb) => cb(null, `paper-${uuidv4()}${path.extname(file.originalname)}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error(`File type ${file.mimetype} not allowed`));
  },
});

async function requireAdmin(userId: string | undefined): Promise<boolean> {
  if (!userId) return false;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  return user?.role === "admin";
}

// ─── GET /api/research-papers — List (public) ──
researchPaperRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const { category, search, page = "1", limit = "20" } = req.query;
    const where: Record<string, any> = { published: true };
    if (category) where.category = category as string;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: "insensitive" } },
        { authors: { contains: search as string, mode: "insensitive" } },
        { abstract: { contains: search as string, mode: "insensitive" } },
        { keywords: { contains: search as string, mode: "insensitive" } },
      ];
    }
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const [papers, total] = await Promise.all([
      prisma.researchPaper.findMany({ where, orderBy: { createdAt: "desc" }, skip: (pageNum - 1) * limitNum, take: limitNum }),
      prisma.researchPaper.count({ where }),
    ]);
    res.json({ data: papers, pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) } });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch papers" });
  }
});

// ─── GET /api/research-papers/:id ──────────────
researchPaperRoutes.get("/:id", async (req: Request, res: Response) => {
  try {
    const paper = await prisma.researchPaper.findUnique({ where: { id: req.params.id as string } });
    if (!paper) return res.status(404).json({ error: "Paper not found" });
    res.json({ data: paper });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch paper" });
  }
});

// ─── POST /api/research-papers — Create (admin) ──
researchPaperRoutes.post("/", upload.fields([{ name: "file", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]), async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!(await requireAdmin(userId))) return res.status(403).json({ error: "Admin access required" });

    const { title, authors, abstract, journal, doi, publicationYear, category, subcategory, keywords, researchArea, externalLink } = req.body;
    if (!title || !authors) return res.status(400).json({ error: "Title and authors are required" });

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const paper = await prisma.researchPaper.create({
      data: {
        title,
        authors,
        abstract: abstract || null,
        journal: journal || null,
        doi: doi || null,
        publicationYear: publicationYear ? parseInt(publicationYear) : null,
        category: category || "Astronomy",
        subcategory: subcategory || null,
        keywords: keywords || null,
        researchArea: researchArea || null,
        fileUrl: files?.file?.[0] ? `/uploads/research-papers/${files.file[0].filename}` : null,
        fileName: files?.file?.[0]?.originalname || null,
        fileSize: files?.file?.[0]?.size || null,
        externalLink: externalLink || null,
        coverImage: files?.coverImage?.[0] ? `/uploads/research-papers/${files.coverImage[0].filename}` : null,
        uploaderId: userId,
      },
    });

    res.status(201).json({ data: paper });
  } catch (error) {
    console.error("Error creating paper:", error);
    res.status(500).json({ error: "Failed to create paper" });
  }
});

// ─── PUT /api/research-papers/:id — Update (admin) ──
researchPaperRoutes.put("/:id", upload.fields([{ name: "file", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]), async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!(await requireAdmin(userId))) return res.status(403).json({ error: "Admin access required" });

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const data: Record<string, any> = {};
    for (const key of ["title", "authors", "abstract", "journal", "doi", "category", "subcategory", "keywords", "researchArea", "externalLink"]) {
      if (req.body[key] !== undefined) data[key] = req.body[key];
    }
    if (req.body.publicationYear) data.publicationYear = parseInt(req.body.publicationYear);
    if (files?.file?.[0]) { data.fileUrl = `/uploads/research-papers/${files.file[0].filename}`; data.fileName = files.file[0].originalname; data.fileSize = files.file[0].size; }
    if (files?.coverImage?.[0]) data.coverImage = `/uploads/research-papers/${files.coverImage[0].filename}`;
    if (req.body.published !== undefined) data.published = req.body.published === "true";

    const paper = await prisma.researchPaper.update({ where: { id: req.params.id as string }, data });
    res.json({ data: paper });
  } catch (error) {
    res.status(500).json({ error: "Failed to update paper" });
  }
});

// ─── DELETE /api/research-papers/:id — Delete (admin) ──
researchPaperRoutes.delete("/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!(await requireAdmin(userId))) return res.status(403).json({ error: "Admin access required" });

    const existing = await prisma.researchPaper.findUnique({ where: { id: req.params.id as string } });
    if (!existing) return res.status(404).json({ error: "Paper not found" });

    if (existing.fileUrl) {
      const p = path.join(UPLOAD_DIRS.base, existing.fileUrl.replace("/uploads/", ""));
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }

    await prisma.researchPaper.delete({ where: { id: req.params.id as string } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete paper" });
  }
});

// ─── POST /api/research-papers/:id/download ────
researchPaperRoutes.post("/:id/download", async (req: Request, res: Response) => {
  try {
    const paper = await prisma.researchPaper.update({
      where: { id: req.params.id as string },
      data: { downloads: { increment: 1 } },
      select: { fileUrl: true, fileName: true },
    });
    if (!paper.fileUrl) return res.status(400).json({ error: "No file" });
    res.json({ downloadUrl: paper.fileUrl, fileName: paper.fileName });
  } catch (error) {
    res.status(500).json({ error: "Failed" });
  }
});
