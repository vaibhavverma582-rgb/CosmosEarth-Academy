import { Router, Request, Response } from "express";
import { prisma } from "../index";
import { z } from "zod";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import sharp from "sharp";
import { UPLOAD_DIRS } from "../config/uploads";
import { createClient } from "@supabase/supabase-js";

export const galleryRoutes = Router();

// ─── Supabase Storage ──────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const SUPABASE_STORAGE_URL = process.env.SUPABASE_STORAGE_URL;
const SUPABASE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "uploads";

let supabase: ReturnType<typeof createClient> | null = null;
if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
}

const getStorageUrl = (filePath: string) => {
  if (!SUPABASE_STORAGE_URL || !filePath) return filePath;

  // Handle both /uploads/gallery/... and /uploads/... paths
  return `${SUPABASE_STORAGE_URL}/${filePath.replace(/^\/uploads\//, "")}`;
};

const uploadToSupabase = async (localPath: string, storagePath: string): Promise<string | null> => {
  if (!supabase) return null;

  try {
    const fileBuffer = fs.readFileSync(localPath);
    const { error } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: "image/*",
        upsert: true,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return null;
    }

    // Return the public URL path (relative to bucket)
    return storagePath;
  } catch (error) {
    console.error("Error uploading to Supabase:", error);
    return null;
  }
};

const generateThumbnail = async (inputPath: string, outputPath: string, width = 400, height = 400): Promise<void> => {
  await sharp(inputPath)
    .resize(width, height, {
      fit: "cover",
      position: "center",
    })
    .jpeg({ quality: 80 })
    .toFile(outputPath);
};

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
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`));
    }
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
    const {
      category,
      search,
      featured,
      page = "1",
      limit = "24",
    } = req.query;

    const where: Record<string, any> = {};

    if (category) {
      where.category = category as string;
    }

    if (featured === "true") {
      where.featured = true;
    }

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
          uploader: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limitNum,
      }),
      prisma.galleryImage.count({ where }),
    ]);

    res.json({
      data: images.map((image) => ({
        ...image,
        imageUrl: getStorageUrl(image.imageUrl),
        thumbnailUrl: image.thumbnailUrl ? getStorageUrl(image.thumbnailUrl) : null,
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching gallery:", error);
    res.status(500).json({
      error: "Failed to fetch gallery",
    });
  }
});

// ─── GET /api/gallery/categories — List categories
galleryRoutes.get("/categories", async (_req: Request, res: Response) => {
  try {
    const cats = await prisma.galleryImage.groupBy({
      by: ["category"],
      _count: {
        category: true,
      },
      orderBy: {
        _count: {
          category: "desc",
        },
      },
    });

    res.json({
      data: cats.map((c) => ({
        name: c.category,
        count: c._count.category,
      })),
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch categories",
    });
  }
});

// ─── GET /api/gallery/:id — Get single image ───
galleryRoutes.get("/:id", async (req: Request, res: Response) => {
  try {
    const image = await prisma.galleryImage.findUnique({
      where: {
        id: req.params.id as string,
      },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    if (!image) {
      return res.status(404).json({
        error: "Image not found",
      });
    }

    res.json({
      data: {
        ...image,
        imageUrl: getStorageUrl(image.imageUrl),
        thumbnailUrl: image.thumbnailUrl ? getStorageUrl(image.thumbnailUrl) : null,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch image",
    });
  }
});

// ─── POST /api/gallery — Upload image ──────────
galleryRoutes.post(
  "/",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      const uploaderId = req.headers["x-user-id"] as string;

      if (!uploaderId) {
        return res.status(401).json({
          error: "Authentication required",
        });
      }

      const file = req.file;

      if (!file) {
        return res.status(400).json({
          error: "No image provided",
        });
      }

      const data = createImageSchema.parse(req.body);

      // Generate thumbnail
      const thumbnailFilename = `thumb_${file.filename}`;
      const thumbnailPath = path.join(UPLOAD_DIRS.gallery, thumbnailFilename);
      await generateThumbnail(file.path, thumbnailPath);

      // Get image dimensions
      const metadata = await sharp(file.path).metadata();

      // Storage paths (relative to bucket)
      const storageImagePath = `gallery/${file.filename}`;
      const storageThumbPath = `gallery/${thumbnailFilename}`;

      // Upload to Supabase if configured
      let finalImageUrl = `/uploads/gallery/${file.filename}`;
      let finalThumbUrl = `/uploads/gallery/${thumbnailFilename}`;

      if (supabase) {
        const [imageUploaded, thumbUploaded] = await Promise.all([
          uploadToSupabase(file.path, storageImagePath),
          uploadToSupabase(thumbnailPath, storageThumbPath),
        ]);

        if (imageUploaded) {
          finalImageUrl = `/uploads/${storageImagePath}`;
        }
        if (thumbUploaded) {
          finalThumbUrl = `/uploads/${storageThumbPath}`;
        }
      }

      const image = await prisma.galleryImage.create({
        data: {
          title: data.title,
          description: data.description,
          imageUrl: finalImageUrl,
          thumbnailUrl: finalThumbUrl,
          category: data.category,
          tags: data.tags,
          fileSize: file.size,
          width: metadata.width,
          height: metadata.height,
          uploaderId,
        },
        include: {
          uploader: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      });

      res.status(201).json({
        data: {
          ...image,
          imageUrl: getStorageUrl(image.imageUrl),
          thumbnailUrl: image.thumbnailUrl ? getStorageUrl(image.thumbnailUrl) : null,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors,
        });
      }

      console.error("Error uploading image:", error);

      res.status(500).json({
        error: "Failed to upload image",
      });
    }
  }
);

// ─── DELETE /api/gallery/:id — Delete image ────
galleryRoutes.delete("/:id", async (req: Request, res: Response) => {
  try {
    // First, get the image to know the file paths
    const image = await prisma.galleryImage.findUnique({
      where: {
        id: req.params.id as string,
      },
      select: {
        imageUrl: true,
        thumbnailUrl: true,
      },
    });

    if (!image) {
      return res.status(404).json({
        error: "Image not found",
      });
    }

    // Delete from database
    await prisma.galleryImage.delete({
      where: {
        id: req.params.id as string,
      },
    });

    // Delete from Supabase storage if configured
    if (supabase && image.imageUrl && image.thumbnailUrl) {
      const storageImagePath = image.imageUrl.replace(/^\/uploads\//, "");
      const storageThumbPath = image.thumbnailUrl.replace(/^\/uploads\//, "");

      await Promise.all([
        supabase.storage.from(SUPABASE_BUCKET).remove([storageImagePath]),
        supabase.storage.from(SUPABASE_BUCKET).remove([storageThumbPath]),
      ]).catch((err) => {
        console.error("Error deleting from Supabase:", err);
      });
    }

    // Delete local files (optional, for cleanup)
    if (image.imageUrl) {
      const localImagePath = path.join(UPLOAD_DIRS.gallery, image.imageUrl.replace(/^\/uploads\/gallery\//, ""));
      if (fs.existsSync(localImagePath)) {
        fs.unlinkSync(localImagePath);
      }
    }
    if (image.thumbnailUrl) {
      const localThumbPath = path.join(UPLOAD_DIRS.gallery, image.thumbnailUrl.replace(/^\/uploads\/gallery\//, ""));
      if (fs.existsSync(localThumbPath)) {
        fs.unlinkSync(localThumbPath);
      }
    }

    res.json({
      message: "Image deleted",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete image",
    });
  }
});

// ─── POST /api/gallery/:id/download — Track download
galleryRoutes.post("/:id/download", async (req: Request, res: Response) => {
  try {
    const image = await prisma.galleryImage.update({
      where: {
        id: req.params.id as string,
      },
      data: {
        downloads: {
          increment: 1,
        },
      } as any,
      select: {
        imageUrl: true,
      },
    });

    if (!image) {
      return res.status(404).json({
        error: "Image not found",
      });
    }

    res.json({
      downloadUrl: getStorageUrl(image.imageUrl),
    });
  } catch (error) {
    // Check if it's a "not found" error
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return res.status(404).json({
        error: "Image not found",
      });
    }

    res.status(500).json({
      error: "Failed to track download",
    });
  }
});