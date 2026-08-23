import { Router } from "express";
import { prisma } from "../index";
import { z } from "zod";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import multer from "multer";
import path from "path";
import fs from "fs";
import { UPLOAD_DIRS } from "../config/uploads";

export const authRoutes = Router();

// ─── Avatar Upload Config ─────────────────────
const avatarDir = path.join(UPLOAD_DIRS.base, "avatars");
if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
}

const avatarStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, avatarDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${Date.now()}${ext}`);
  },
});

const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error(`File type ${file.mimetype} not allowed. Use JPG, PNG, GIF, or WebP.`));
  },
});

// ─── Validation Schemas ────────────────────────
const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8),
  emailVerified: z.boolean().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// ─── POST /api/auth/register ───────────────────
authRoutes.post("/register", async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        emailVerified: data.emailVerified ? new Date() : null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(201).json({ user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", details: error.errors });
    }
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// ─── POST /api/auth/login ──────────────────────
authRoutes.post("/login", async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !user.password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify password
    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image || user.avatar,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", details: error.errors });
    }
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// POST /api/auth/send-otp
authRoutes.post("/send-otp", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();

    if (!email || !z.string().email().safeParse(email).success) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expires = new Date(
      Date.now() +
        Number(process.env.OTP_EXPIRES_IN_MINUTES || 5) * 60 * 1000
    );

    await prisma.otpCode.deleteMany({
      where: {
        email,
        purpose: "LOGIN",
        used: false,
      },
    });

    await prisma.otpCode.create({
      data: {
        email,
        code: await bcrypt.hash(otp, 10),
        purpose: "LOGIN",
        expires,
        used: false,
      },
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"CosmosEarth Academy" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "CosmosEarth Academy Login OTP",
      text: `Your login OTP is ${otp}. It expires in 5 minutes.`,
    });

    res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});
// ─── POST /api/auth/otp-login ──────────────────
// Called after OTP is verified on the frontend
authRoutes.post("/otp-login", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    let user = await prisma.user.findUnique({
      where: { email },
    });

    // Auto-create user if not exists (OTP login)
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: email.split("@")[0],
          password: "", // No password for OTP users
          emailVerified: new Date(),
        },
      });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image || user.avatar,
      },
    });
  } catch (error) {
    console.error("OTP login error:", error);
    res.status(500).json({ error: "OTP login failed" });
  }
});

// ─── POST /api/auth/reset-password ─────────────
authRoutes.post("/reset-password", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: "No account found with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

// ─── POST /api/auth/avatar — Upload profile picture
authRoutes.post("/avatar", avatarUpload.single("avatar"), async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Delete old avatar file if it exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true, image: true },
    });

    if (existingUser?.avatar && existingUser.avatar.startsWith("/uploads/avatars/")) {
      const oldPath = path.join(UPLOAD_DIRS.base, existingUser.avatar.replace("/uploads/", ""));
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const avatarUrl = `/uploads/avatars/${file.filename}`;

    await prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl, image: avatarUrl },
    });

    res.json({ avatar: avatarUrl, message: "Profile picture updated" });
  } catch (error) {
    console.error("Avatar upload error:", error);
    res.status(500).json({ error: "Failed to upload avatar" });
  }
});

// ─── PUT /api/auth/profile — Update profile info
authRoutes.put("/profile", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { name, bio } = req.body;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(bio !== undefined && { bio }),
      },
      select: { id: true, name: true, email: true, role: true, avatar: true, bio: true },
    });

    res.json({ user: updated });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// ─── GET /api/auth/me ──────────────────────────
authRoutes.get("/me", async (req, res) => {
  // In production, verify JWT token here
  // For now, accept userId from header
  const userId = req.headers["x-user-id"] as string;

  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        bio: true,
        createdAt: true,
        _count: {
          select: { enrollments: true, reviews: true },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});
