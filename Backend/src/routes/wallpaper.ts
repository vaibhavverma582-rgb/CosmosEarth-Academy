import { Router, Request, Response } from "express";
import { prisma } from "../index";
import multer from "multer";
import path from "path";
import fs from "fs";
import { UPLOAD_DIRS } from "../config/uploads";

export const wallpaperRoutes = Router();

// ─── File Upload Config ────────────────────────
if (!fs.existsSync(UPLOAD_DIRS.wallpaper)) {
  fs.mkdirSync(UPLOAD_DIRS.wallpaper, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIRS.wallpaper);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `wallpaper-${Date.now()}${ext}`);
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

// ─── Helper: check authenticated ──────────────
async function requireAuth(userId: string | undefined): Promise<boolean> {
  if (!userId) return false;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
  return !!user;
}

// ─── GET /api/wallpaper — Get active wallpaper ─
wallpaperRoutes.get("/", async (_req: Request, res: Response) => {
  try {
    const wallpaper = await prisma.wallpaper.findFirst({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({ data: wallpaper || null });
  } catch (error) {
    console.error("Wallpaper get error:", error);
    res.status(500).json({ error: "Failed to fetch wallpaper" });
  }
});

// ─── POST /api/wallpaper — Upload & set wallpaper (admin)
wallpaperRoutes.post("/", upload.single("image"), async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!(await requireAuth(userId))) {
      return res.status(403).json({ error: "Authentication required" });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No image provided" });
    }

    const { position, size, overlayOpacity } = req.body;

    // Deactivate all existing wallpapers
    await prisma.wallpaper.updateMany({
      where: { active: true },
      data: { active: false },
    });

    // Create new active wallpaper
    const wallpaper = await prisma.wallpaper.create({
      data: {
        imageUrl: `/uploads/wallpaper/${file.filename}`,
        position: position || "center",
        size: size || "cover",
        overlayOpacity: parseFloat(overlayOpacity) || 0.5,
        active: true,
        uploaderId: userId,
      },
    });

    res.status(201).json({ data: wallpaper });
  } catch (error) {
    console.error("Wallpaper upload error:", error);
    res.status(500).json({ error: "Failed to upload wallpaper" });
  }
});

// ─── PUT /api/wallpaper/settings — Update settings (admin)
wallpaperRoutes.put("/settings", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!(await requireAuth(userId))) {
      return res.status(403).json({ error: "Authentication required" });
    }

    const { position, size, overlayOpacity } = req.body;
    const active = await prisma.wallpaper.findFirst({ where: { active: true } });

    if (!active) {
      return res.status(404).json({ error: "No active wallpaper found" });
    }

    const updated = await prisma.wallpaper.update({
      where: { id: active.id },
      data: {
        ...(position !== undefined && { position }),
        ...(size !== undefined && { size }),
        ...(overlayOpacity !== undefined && { overlayOpacity: parseFloat(overlayOpacity) }),
      },
    });

    res.json({ data: updated });
  } catch (error) {
    console.error("Wallpaper settings error:", error);
    res.status(500).json({ error: "Failed to update settings" });
  }
});

// ─── DELETE /api/wallpaper — Remove wallpaper (admin)
wallpaperRoutes.delete("/", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!(await requireAuth(userId))) {
      return res.status(403).json({ error: "Authentication required" });
    }

    await prisma.wallpaper.deleteMany({ where: { active: true } });

    res.json({ success: true });
  } catch (error) {
    console.error("Wallpaper delete error:", error);
    res.status(500).json({ error: "Failed to delete wallpaper" });
  }
});

// ─── Logo routes ──────────────────────────────────
const logoDir = path.join(__dirname, "../../uploads/logo");
if (!fs.existsSync(logoDir)) {
  fs.mkdirSync(logoDir, { recursive: true });
}

const logoStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, logoDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `logo-${Date.now()}${ext}`);
  },
});

const logoUpload = multer({
  storage: logoStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error(`File type ${file.mimetype} not allowed`));
  },
});

// Store active logo path in memory (simple approach)
let activeLogoPath: string | null = null;

wallpaperRoutes.get("/logo", (_req: Request, res: Response) => {
  res.json({ data: activeLogoPath });
});

wallpaperRoutes.post("/logo", logoUpload.single("logo"), async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!(await requireAuth(userId))) {
      return res.status(403).json({ error: "Authentication required" });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No logo provided" });
    }

    activeLogoPath = `/uploads/logo/${file.filename}`;
    res.status(201).json({ data: activeLogoPath });
  } catch (error) {
    console.error("Logo upload error:", error);
    res.status(500).json({ error: "Failed to upload logo" });
  }
});

wallpaperRoutes.delete("/logo", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!(await requireAuth(userId))) {
      return res.status(403).json({ error: "Authentication required" });
    }

    activeLogoPath = null;
    res.json({ data: null });
  } catch (error) {
    console.error("Logo delete error:", error);
    res.status(500).json({ error: "Failed to delete logo" });
  }
});
