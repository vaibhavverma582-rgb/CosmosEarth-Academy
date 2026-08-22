import { Router } from "express";
import { prisma } from "../index";
import { z } from "zod";

export const userRoutes = Router();

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  password: z.string().min(8),
  bio: z.string().optional(),
});

// GET /api/users/:id — Get user profile
userRoutes.get("/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        bio: true,
        createdAt: true,
        _count: {
          select: { enrollments: true, reviews: true, courses: true },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// POST /api/users — Register a user (simplified — no auth yet)
userRoutes.post("/", async (req, res) => {
  try {
    const data = createUserSchema.parse(req.body);
    // In production, hash the password
    const user = await prisma.user.create({
      data: {
        ...data,
        password: data.password, // TODO: hash with bcrypt
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    res.status(201).json({ data: user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", details: error.errors });
    }
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// GET /api/users/:id/enrollments — Get user enrollments
userRoutes.get("/:id/enrollments", async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.params.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
            level: true,
            category: { select: { name: true } },
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    });

    res.json({ data: enrollments });
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    res.status(500).json({ error: "Failed to fetch enrollments" });
  }
});
