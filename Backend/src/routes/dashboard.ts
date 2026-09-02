import { Router, Request, Response } from "express";
import { prisma } from "../index";

export const dashboardRoutes = Router();

// GET /api/dashboard — Get aggregated student dashboard data
dashboardRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Auth required" });

    // Run all queries in parallel
    const [
      enrollments,
      watchProgress,
      listeningHistory,
      noteBookmarks,
      notes,
      quizAttempts,
      noteCount,
      purchasedProducts,
    ] = await Promise.all([
      // 1. Enrolled courses with progress
      prisma.enrollment.findMany({
        where: { userId },
        include: {
          course: {
            select: {
              id: true, title: true, slug: true, thumbnail: true, level: true, duration: true,
              category: { select: { name: true } },
              instructor: { select: { name: true } },
              _count: { select: { modules: true } },
            },
          },
        },
        orderBy: { enrolledAt: "desc" },
      }),

      // 2. Video watch progress (continue watching)
      prisma.watchProgress.findMany({
        where: { userId, completed: false },
        include: {
          video: { select: { id: true, title: true, thumbnailUrl: true, duration: true, category: true } },
        },
        orderBy: { updatedAt: "desc" },
        take: 6,
      }),

      // 3. Podcast listening history
      prisma.listeningHistory.findMany({
        where: { userId },
        include: {
          episode: {
            select: {
              id: true, title: true, duration: true,
              podcast: { select: { id: true, title: true, coverUrl: true, author: true } },
            },
          },
        },
        orderBy: { updatedAt: "desc" },
        take: 6,
      }),

      // 4. Bookmarked notes
      prisma.noteBookmark.findMany({
        where: { userId },
        include: {
          note: {
            select: {
              id: true, title: true, subject: true, topic: true, fileType: true,
              author: { select: { name: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),

      // 5. User's uploaded notes
      prisma.note.findMany({
        where: { authorId: userId },
        select: {
          id: true, title: true, subject: true, fileType: true, downloads: true, createdAt: true,
          _count: { select: { bookmarks: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),

      // 6. Quiz scores
      prisma.quizAttempt.findMany({
        where: { userId },
        include: {
          quiz: { select: { id: true, title: true, subject: true, difficulty: true } },
        },
        orderBy: { completedAt: "desc" },
        take: 10,
      }),

      // 7. Total notes uploaded
      prisma.note.count({ where: { authorId: userId } }),

      // 8. Purchased notes
      prisma.purchase.findMany({
        where: { userId },
        include: {
          product: { select: { id: true, title: true, description: true, category: true, coverImage: true } },
          book: { select: { id: true, title: true, coverImage: true, category: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    // Calculate stats
    const totalCourses = enrollments.length;
    const completedCourses = enrollments.filter((e) => e.status === "completed").length;
    const totalQuizzesTaken = quizAttempts.length;
    const avgScore = quizAttempts.length > 0
      ? Math.round(quizAttempts.reduce((sum, a) => sum + a.score, 0) / quizAttempts.length)
      : 0;
    const passedQuizzes = quizAttempts.filter((a) => a.passed).length;

    // Best quiz scores (one per quiz, highest score)
    const bestScores = new Map<string, typeof quizAttempts[0]>();
    for (const attempt of quizAttempts) {
      const existing = bestScores.get(attempt.quizId);
      if (!existing || attempt.score > existing.score) {
        bestScores.set(attempt.quizId, attempt);
      }
    }

    res.json({
      stats: {
        totalCourses,
        completedCourses,
        inProgressCourses: totalCourses - completedCourses,
        totalQuizzesTaken,
        passedQuizzes,
        avgScore,
        totalNotesUploaded: noteCount,
        totalBookmarks: noteBookmarks.length,
        totalWatchHistory: watchProgress.length + listeningHistory.length,
        totalPurchasedNotes: purchasedProducts.length,
      },
      enrollments: enrollments.map((e) => ({
        ...e.course,
        status: e.status,
        enrolledAt: e.enrolledAt,
      })),
      continueWatching: watchProgress.map((wp) => ({
        videoId: wp.video.id,
        title: wp.video.title,
        thumbnailUrl: wp.video.thumbnailUrl,
        duration: wp.video.duration,
        category: wp.video.category,
        currentTime: wp.currentTime,
        percentComplete: wp.percentComplete,
      })),
      continueListening: listeningHistory.map((lh) => ({
        episodeId: lh.episode.id,
        episodeTitle: lh.episode.title,
        podcastTitle: lh.episode.podcast.title,
        podcastCover: lh.episode.podcast.coverUrl,
        podcastAuthor: lh.episode.podcast.author,
        duration: lh.episode.duration,
        currentTime: lh.currentTime,
        percentComplete: lh.percentComplete,
      })),
      bookmarkedNotes: noteBookmarks.map((nb) => ({
        ...nb.note,
        bookmarkedAt: nb.createdAt,
      })),
      uploadedNotes: notes,
      quizScores: Array.from(bestScores.values()).map((a) => ({
        quizId: a.quizId,
        quizTitle: a.quiz.title,
        subject: a.quiz.subject,
        difficulty: a.quiz.difficulty,
        score: a.score,
        passed: a.passed,
        completedAt: a.completedAt,
      })),
      recentAttempts: quizAttempts.slice(0, 5),
      purchasedNotes: purchasedProducts.map((p) => ({
        id: p.id,
        title: p.product?.title || p.book?.title || "Untitled",
        category: p.product?.category || p.book?.category || "",
        coverImage: p.product?.coverImage || p.book?.coverImage,
        purchasedAt: p.createdAt,
      })),
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Failed to load dashboard" });
  }
});
