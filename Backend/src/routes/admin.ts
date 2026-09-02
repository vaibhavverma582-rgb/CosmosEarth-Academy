import { Router, Request, Response } from "express";
import { prisma } from "../index";

export const adminRoutes = Router();

// GET /api/admin/stats — Real database statistics for admin overview
adminRoutes.get("/stats", async (_req: Request, res: Response) => {
  try {
    const [
      totalUsers,
      totalNotes,
      totalNoteBookmarks,
      totalNotePurchases,
      totalQuizzes,
      totalQuizAttempts,
      totalBlogPosts,
      totalGalleryImages,
      totalVideos,
      totalPodcasts,
      totalBooks,
      totalResearchPapers,
      totalStudyMaterials,
      totalOrders,
      totalPayments,
      totalVisitors,
      totalBlogComments,
      totalEnrollments,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.note.count(),
      prisma.noteBookmark.count(),
      prisma.purchase.count(),
      prisma.quiz.count(),
      prisma.quizAttempt.count(),
      prisma.blogPost.count(),
      prisma.galleryImage.count(),
      prisma.video.count(),
      prisma.podcast.count(),
      prisma.book.count(),
      prisma.researchPaper.count(),
      prisma.studyMaterial.count(),
      prisma.order.count(),
      prisma.payment.count(),
      prisma.visitor.count(),
      prisma.blogComment.count(),
      prisma.enrollment.count(),
    ]);

    // Average quiz score
    const avgQuizScore = await prisma.quizAttempt.aggregate({
      _avg: { score: true },
    });

    // Total revenue
    const revenueResult = await prisma.payment.aggregate({
      where: { status: "SUCCESS" },
      _sum: { amount: true },
    });

    // Recent activity (last 10 actions across different tables)
    const [recentUsers, recentNotes, recentQuizzes, recentOrders] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, email: true, createdAt: true },
      }),
      prisma.note.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, title: true, createdAt: true, author: { select: { name: true } } },
      }),
      prisma.quizAttempt.findMany({
        orderBy: { completedAt: "desc" },
        take: 5,
        include: {
          quiz: { select: { title: true } },
          user: { select: { name: true, email: true } },
        },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, totalAmount: true, status: true, createdAt: true, user: { select: { name: true } } },
      }),
    ]);

    res.json({
      stats: {
        totalUsers,
        totalNotes,
        totalNoteBookmarks,
        totalNotePurchases,
        totalQuizzes,
        totalQuizAttempts,
        avgQuizScore: avgQuizScore._avg.score ? Math.round(avgQuizScore._avg.score) : 0,
        totalBlogPosts,
        totalGalleryImages,
        totalVideos,
        totalPodcasts,
        totalBooks,
        totalResearchPapers,
        totalStudyMaterials,
        totalOrders,
        totalPayments,
        totalRevenue: revenueResult._sum.amount || 0,
        totalVisitors,
        totalBlogComments,
        totalEnrollments,
      },
      recentActivity: {
        recentUsers,
        recentNotes,
        recentQuizzes,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ error: "Failed to load admin stats" });
  }
});

// GET /api/admin/quiz-attempts — All quiz attempts for admin management
adminRoutes.get("/quiz-attempts", async (req: Request, res: Response) => {
  try {
    const {
      page = "1",
      limit = "20",
      search,
      quizId,
      userType,
      passed,
      sortBy = "completedAt",
      sortOrder = "desc",
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, any> = {};

    if (search) {
      where.OR = [
        { user: { name: { contains: search as string, mode: "insensitive" } } },
        { user: { email: { contains: search as string, mode: "insensitive" } } },
        { guestName: { contains: search as string, mode: "insensitive" } },
        { quiz: { title: { contains: search as string, mode: "insensitive" } } },
      ];
    }

    if (quizId) where.quizId = quizId as string;
    if (userType === "registered") where.userId = { not: null };
    if (userType === "guest") where.userId = null;
    if (passed === "true") where.passed = true;
    if (passed === "false") where.passed = false;

    const validSortBy = ["completedAt", "score", "earnedPoints"];
    const field = validSortBy.includes(sortBy as string) ? sortBy as string : "completedAt";
    const order = sortOrder === "asc" ? "asc" : "desc";

    const [attempts, total] = await Promise.all([
      prisma.quizAttempt.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          quiz: { select: { id: true, title: true, subject: true, category: true, difficulty: true, passingScore: true } },
        },
        orderBy: { [field]: order },
        skip,
        take: limitNum,
      }),
      prisma.quizAttempt.count({ where }),
    ]);

    const quizList = await prisma.quiz.findMany({
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    });

    res.json({
      data: attempts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
      quizzes: quizList,
    });
  } catch (error) {
    console.error("Admin quiz attempts error:", error);
    res.status(500).json({ error: "Failed to load quiz attempts" });
  }
});
