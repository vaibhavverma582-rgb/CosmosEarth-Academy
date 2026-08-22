import { Router } from "express";
import { prisma } from "../index";
import { z } from "zod";

export const courseRoutes = Router();

// Validation schema
const createCourseSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  description: z.string().min(1),
  thumbnail: z.string().url().optional(),
  price: z.number().min(0).default(0),
  level: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
  duration: z.string().optional(),
  instructorId: z.string(),
  categoryId: z.string().optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
});

// GET /api/courses — List all courses
courseRoutes.get("/", async (req, res) => {
  try {
    const { category, level, featured, search } = req.query;

    const where: Record<string, unknown> = {};

    if (category) {
      where.category = { slug: category };
    }
    if (level) {
      where.level = level;
    }
    if (featured === "true") {
      where.featured = true;
    }
    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { description: { contains: search as string } },
      ];
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        instructor: {
          select: { id: true, name: true, avatar: true },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
        _count: {
          select: { enrollments: true, reviews: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      data: courses,
      total: courses.length,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// GET /api/courses/:slug — Get single course
courseRoutes.get("/:slug", async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { slug: req.params.slug },
      include: {
        instructor: {
          select: { id: true, name: true, avatar: true, bio: true },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
        modules: {
          include: {
            lessons: {
              orderBy: { order: "asc" },
              select: { id: true, title: true, duration: true, order: true },
            },
          },
          orderBy: { order: "asc" },
        },
        reviews: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: { enrollments: true, reviews: true },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Calculate average rating
    const avgRating =
      course.reviews.length > 0
        ? course.reviews.reduce((sum, r) => sum + r.rating, 0) /
          course.reviews.length
        : null;

    res.json({
      data: { ...course, averageRating: avgRating },
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ error: "Failed to fetch course" });
  }
});

// POST /api/courses — Create a course
courseRoutes.post("/", async (req, res) => {
  try {
    const data = createCourseSchema.parse(req.body);
    const course = await prisma.course.create({
      data,
      include: {
        instructor: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
      },
    });
    res.status(201).json({ data: course });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", details: error.errors });
    }
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Failed to create course" });
  }
});

// PUT /api/courses/:id — Update a course
courseRoutes.put("/:id", async (req, res) => {
  try {
    const course = await prisma.course.update({
      where: { id: req.params.id },
      data: req.body,
      include: {
        instructor: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
      },
    });
    res.json({ data: course });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: "Failed to update course" });
  }
});

// DELETE /api/courses/:id — Delete a course
courseRoutes.delete("/:id", async (req, res) => {
  try {
    await prisma.course.delete({ where: { id: req.params.id } });
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Failed to delete course" });
  }
});
