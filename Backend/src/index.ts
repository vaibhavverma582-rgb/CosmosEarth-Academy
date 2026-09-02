import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import * as path from "path";
import { PrismaClient } from "@prisma/client";

// Routes
import { courseRoutes } from "./routes/courses";
import { categoryRoutes } from "./routes/categories";
import { userRoutes } from "./routes/users";
import { healthRoutes } from "./routes/health";
import { authRoutes } from "./routes/auth";
import { noteRoutes } from "./routes/notes";
import { galleryRoutes } from "./routes/gallery";
import { videoRoutes } from "./routes/videos";
import { documentaryRoutes } from "./routes/documentaries";
import { podcastRoutes } from "./routes/podcasts";
import { quizRoutes } from "./routes/quizzes";
import { dashboardRoutes } from "./routes/dashboard";
import { blogRoutes } from "./routes/blog";
import { wallpaperRoutes } from "./routes/wallpaper";
import { studyMaterialRoutes } from "./routes/study-materials";
import { bookRoutes } from "./routes/books";
import { researchPaperRoutes } from "./routes/research-papers";
import { blogCommentRoutes } from "./routes/blog-comments";
import { storeRoutes } from "./routes/store";
import { orderRoutes } from "./routes/orders";
import { searchRoutes } from "./routes/search";
import { visitorRoutes } from "./routes/visitors";
import { adminRoutes } from "./routes/admin";

// ─── Prisma Client ─────────────────────────────
export const prisma = new PrismaClient();

// ─── App Setup ──────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// ─── Uploads Directory ──────────────────────────
// On Render with persistent disk, set UPLOAD_DIR to the disk mount path
// e.g., UPLOAD_DIR=/opt/render/project/src/uploads
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, "..", "uploads");

// ─── Middleware ──────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      objectSrc: ["'self'", "blob:"],
      mediaSrc: ["'self'", "blob:"],
      frameSrc: ["'self'", "blob:", "https://www.youtube.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS: accept FRONTEND_URL (single) or FRONTEND_URLS (comma-separated)
const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Rate limiting (skip in development)
if (process.env.NODE_ENV !== "development") {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // limit each IP to 500 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api", limiter);
}

// ─── Routes ─────────────────────────────────────
app.use("/api/health", healthRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/documentaries", documentaryRoutes);
app.use("/api/podcasts", podcastRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/wallpaper", wallpaperRoutes);
app.use("/api/study-materials", studyMaterialRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/research-papers", researchPaperRoutes);
app.use("/api/blog", blogCommentRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/purchases", orderRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/admin", adminRoutes);

// Static files for uploads
app.use("/uploads", express.static(UPLOAD_DIR));

// Root route
app.get("/", (_, res) => {
  res.json({
    name: "CosmosEarth Academy API",
    version: "1.0.0",
    docs: "/api/health",
  });
});

// ─── 404 Handler ────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ─── Error Handler ──────────────────────────────
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
);

// ─── Start Server ───────────────────────────────
async function main() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected");
    console.log(`📁 Uploads directory: ${UPLOAD_DIR}`);

    app.listen(PORT, () => {
      console.log(`🚀 CosmosEarth API running on http://localhost:${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

main();

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
