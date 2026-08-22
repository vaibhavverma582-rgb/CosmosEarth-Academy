import { Router } from "express";
import { prisma } from "../index";

export const categoryRoutes = Router();

// GET /api/categories — List all categories
categoryRoutes.get("/", async (_req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { courses: true },
        },
      },
      orderBy: { name: "asc" },
    });

    res.json({ data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// GET /api/categories/:slug — Get single category with courses
categoryRoutes.get("/:slug", async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug },
      include: {
        courses: {
          include: {
            instructor: { select: { id: true, name: true, avatar: true } },
            _count: { select: { enrollments: true } },
          },
          where: { published: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ data: category });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Failed to fetch category" });
  }
});

// POST /api/categories — Create a category
categoryRoutes.post("/", async (req, res) => {
  try {
    const category = await prisma.category.create({ data: req.body });
    res.status(201).json({ data: category });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
});
