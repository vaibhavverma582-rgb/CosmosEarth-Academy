import { Router, Request, Response } from "express";
import { prisma } from "../index";

export const blogCommentRoutes = Router();

// ─── GET /api/blog/:blogPostId/comments — List comments ──
blogCommentRoutes.get("/:blogPostId/comments", async (req: Request, res: Response) => {
  try {
    const comments = await prisma.blogComment.findMany({
      where: {
        blogPostId: req.params.blogPostId as string,
        hidden: false,
        parentId: null, // top-level only
      },
      include: {
        user: { select: { id: true, name: true, avatar: true, image: true } },
        replies: {
          where: { hidden: false },
          include: { user: { select: { id: true, name: true, avatar: true, image: true } } },
          orderBy: { createdAt: "asc" },
        },
        _count: { select: { replies: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Map guestName for guest comments
    const mapped = comments.map((c: any) => ({
      ...c,
      displayName: c.user?.name || c.guestName || "Anonymous",
      replies: c.replies?.map((r: any) => ({
        ...r,
        displayName: r.user?.name || r.guestName || "Anonymous",
      })),
    }));

    res.json({ data: mapped });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// ─── POST /api/blog/:blogPostId/comments — Create comment (public + authenticated) ──
blogCommentRoutes.post("/:blogPostId/comments", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string | undefined;
    const { content, parentId, guestName } = req.body;
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: "Comment content is required" });
    }

    // If not authenticated, require a guest name
    if (!userId && (!guestName || guestName.trim().length === 0)) {
      return res.status(400).json({ error: "Name is required for guest comments" });
    }

    // Verify blog post exists
    const blogPost = await prisma.blogPost.findUnique({ where: { id: req.params.blogPostId as string } });
    if (!blogPost) return res.status(404).json({ error: "Blog post not found" });

    const comment = await prisma.blogComment.create({
      data: {
        content: content.trim(),
        userId: userId || undefined,
        guestName: userId ? undefined : guestName.trim(),
        blogPostId: req.params.blogPostId as string,
        parentId: parentId || undefined,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true, image: true } },
      },
    });

    // For guest comments, attach the guestName so the frontend can display it
    const commentData: any = { ...comment };
    if (!userId && guestName) {
      commentData.user = null;
      commentData.guestName = guestName.trim();
    }

    res.status(201).json({ data: commentData });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Failed to create comment" });
  }
});

// ─── POST /api/blog/comments/:id/like — Like comment ──
blogCommentRoutes.post("/comments/:id/like", async (req: Request, res: Response) => {
  try {
    const comment = await prisma.blogComment.update({
      where: { id: req.params.id as string },
      data: { likes: { increment: 1 } },
    });
    res.json({ likes: comment.likes });
  } catch (error) {
    res.status(500).json({ error: "Failed to like comment" });
  }
});

// ─── DELETE /api/blog/comments/:id — Delete comment (admin or owner) ──
blogCommentRoutes.delete("/comments/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Authentication required" });

    const comment = await prisma.blogComment.findUnique({ where: { id: req.params.id as string } });
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (comment.userId !== userId && user?.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    await prisma.blogComment.delete({ where: { id: req.params.id as string } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

// ─── PUT /api/blog/comments/:id/hide — Hide/show comment (admin) ──
blogCommentRoutes.put("/comments/:id/hide", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Authentication required" });

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (user?.role !== "admin") return res.status(403).json({ error: "Admin access required" });

    const { hidden } = req.body;
    const comment = await prisma.blogComment.update({
      where: { id: req.params.id as string },
      data: { hidden: hidden !== false },
    });

    res.json({ data: comment });
  } catch (error) {
    res.status(500).json({ error: "Failed to update comment" });
  }
});

// ─── GET /api/blog/admin/comments — All comments (admin) ──
blogCommentRoutes.get("/admin/comments", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Authentication required" });

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (user?.role !== "admin") return res.status(403).json({ error: "Admin access required" });

    const comments = await prisma.blogComment.findMany({
      include: {
        user: { select: { id: true, name: true } },
        blogPost: { select: { id: true, title: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    res.json({ data: comments });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});
