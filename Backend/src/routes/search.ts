import { Router, Request, Response } from "express";
import { prisma } from "../index";

export const searchRoutes = Router();

// ─── GET /api/search — Global search ────────────
searchRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const { q, type, category, page = "1", limit = "20" } = req.query;

    if (!q || (q as string).trim().length === 0) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const searchTerm = q as string;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const results: Record<string, any[]> = {};
    let totalResults = 0;

    const searchInModel = async (
      modelName: string,
      model: any,
      searchFields: string[],
      selectFields: any,
      whereExtra: any = {}
    ) => {
      const where: any = {
        OR: searchFields.map((f) => ({ [f]: { contains: searchTerm, mode: "insensitive" } })),
        ...whereExtra,
      };
      const [items, count] = await Promise.all([
        model.findMany({ where, select: selectFields, orderBy: { createdAt: "desc" }, take: limitNum }),
        model.count({ where }),
      ]);
      results[modelName] = items;
      totalResults += count;
    };

    const types = type ? [type as string] : ["blogs", "videos", "notes", "books", "research-papers", "podcasts", "gallery", "study-materials"];

    const categoryFilter = category ? { category: category as string } : {};

    if (types.includes("blogs")) {
      await searchInModel("blogs", prisma.blogPost,
        ["title", "excerpt", "content", "category", "tags"],
        { id: true, title: true, slug: true, excerpt: true, category: true, coverImage: true, createdAt: true },
        { published: true, ...categoryFilter }
      );
    }

    if (types.includes("videos")) {
      await searchInModel("videos", prisma.video,
        ["title", "description", "category", "tags"],
        { id: true, title: true, description: true, youtubeUrl: true, thumbnailUrl: true, category: true, createdAt: true },
        { published: true, ...categoryFilter }
      );
    }

    if (types.includes("notes")) {
      await searchInModel("notes", prisma.note,
        ["title", "description", "content", "subject", "topic", "mediaCategory"],
        { id: true, title: true, description: true, subject: true, mediaCategory: true, fileType: true, createdAt: true },
        { published: true, ...(category ? { mediaCategory: category } : {}) }
      );
    }

    if (types.includes("books")) {
      await searchInModel("books", prisma.book,
        ["title", "author", "description", "category", "tags", "isbn"],
        { id: true, title: true, author: true, description: true, category: true, coverImage: true, isFree: true, price: true, createdAt: true },
        { published: true, ...categoryFilter }
      );
    }

    if (types.includes("research-papers")) {
      await searchInModel("researchPapers", prisma.researchPaper,
        ["title", "authors", "abstract", "keywords", "journal", "researchArea"],
        { id: true, title: true, authors: true, abstract: true, category: true, journal: true, publicationYear: true, createdAt: true },
        { published: true, ...categoryFilter }
      );
    }

    if (types.includes("podcasts")) {
      await searchInModel("podcasts", prisma.podcast,
        ["title", "description", "author", "category", "tags"],
        { id: true, title: true, slug: true, description: true, author: true, coverUrl: true, category: true, createdAt: true },
        { published: true, ...categoryFilter }
      );
    }

    if (types.includes("gallery")) {
      await searchInModel("gallery", prisma.galleryImage,
        ["title", "description", "category", "tags"],
        { id: true, title: true, description: true, imageUrl: true, category: true, createdAt: true },
        categoryFilter
      );
    }

    if (types.includes("study-materials")) {
      await searchInModel("storeProducts", prisma.storeProduct,
        ["title", "description", "type", "tags"],
        { id: true, title: true, description: true, type: true, category: true, coverImage: true, isFree: true, price: true, createdAt: true },
        { published: true, ...categoryFilter }
      );
    }

    res.json({
      query: searchTerm,
      totalResults,
      results,
    });
  } catch (error) {
    console.error("Error searching:", error);
    res.status(500).json({ error: "Search failed" });
  }
});
