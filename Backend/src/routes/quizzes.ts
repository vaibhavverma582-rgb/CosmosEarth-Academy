import { Router, Request, Response } from "express";
import { prisma } from "../index";
import { z } from "zod";

export const quizRoutes = Router();

const createQuizSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  description: z.string().optional(),
  subject: z.string().min(1),
  category: z.string().default("General"),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  timeLimit: z.coerce.number().optional(),
  passingScore: z.coerce.number().min(0).max(100).default(70),
});

const createQuestionSchema = z.object({
  question: z.string().min(1),
  type: z.enum(["multiple-choice", "true-false"]).default("multiple-choice"),
  options: z.array(z.string()).min(2),
  correctAnswer: z.string(),
  explanation: z.string().optional(),
  points: z.coerce.number().default(1),
});

const submitQuizSchema = z.object({
  answers: z.record(z.string(), z.string()),
  timeTaken: z.coerce.number().optional(),
  guestName: z.string().optional(),
});

// ─── GET /api/quizzes — List quizzes ───────────
quizRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const { subject, category, difficulty, search } = req.query;
    const where: Record<string, any> = { published: true };
    if (subject) where.subject = subject as string;
    if (category) where.category = category as string;
    if (difficulty) where.difficulty = difficulty as string;
    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { description: { contains: search as string } },
      ];
    }

    const quizzes = await prisma.quiz.findMany({
      where,
      include: {
        creator: { select: { id: true, name: true } },
        _count: { select: { questions: true, attempts: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ data: quizzes });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});

// GET /api/quizzes/subjects
quizRoutes.get("/subjects", async (_req: Request, res: Response) => {
  try {
    const subjects = await prisma.quiz.groupBy({
      by: ["subject"],
      _count: { subject: true },
      orderBy: { _count: { subject: "desc" } },
    });
    res.json({ data: subjects.map((s) => ({ name: s.subject, count: s._count.subject })) });
  } catch (error) {
    res.status(500).json({ error: "Failed" });
  }
});

// GET /api/quizzes/user/scores
quizRoutes.get("/user/scores", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Auth required" });

    const attempts = await prisma.quizAttempt.findMany({
      where: { userId },
      include: { quiz: { select: { id: true, title: true, subject: true, difficulty: true } } },
      orderBy: { completedAt: "desc" },
    });
    res.json({ data: attempts });
  } catch (error) {
    res.status(500).json({ error: "Failed" });
  }
});

// GET /api/quizzes/:slug
quizRoutes.get("/:slug", async (req: Request, res: Response) => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { slug: req.params.slug as string },
      include: {
        creator: { select: { id: true, name: true } },
        questions: { orderBy: { order: "asc" } },
        _count: { select: { questions: true, attempts: true } },
      },
    });
    if (!quiz) return res.status(404).json({ error: "Not found" });
    res.json({ data: quiz });
  } catch (error) {
    res.status(500).json({ error: "Failed" });
  }
});

// GET /api/quizzes/:id/attempt — Get user's past attempts
quizRoutes.get("/:id/attempt", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.json({ data: [] });

    const attempts = await prisma.quizAttempt.findMany({
      where: { userId, quizId: req.params.id as string },
      orderBy: { completedAt: "desc" },
      take: 5,
    });
    res.json({ data: attempts });
  } catch (error) {
    res.status(500).json({ error: "Failed" });
  }
});

// POST /api/quizzes — Create quiz
quizRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const creatorId = req.headers["x-user-id"] as string;
    if (!creatorId) return res.status(401).json({ error: "Auth required" });
    const data = createQuizSchema.parse(req.body);
    const quiz = await prisma.quiz.create({ data: { ...data, creatorId } });
    res.status(201).json({ data: quiz });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: "Validation failed", details: error.errors });
    res.status(500).json({ error: "Failed" });
  }
});

// POST /api/quizzes/:id/questions — Add question
quizRoutes.post("/:id/questions", async (req: Request, res: Response) => {
  try {
    const data = createQuestionSchema.parse(req.body);
    const quizId = req.params.id as string;

    const count = await prisma.quizQuestion.count({ where: { quizId } });
    const question = await prisma.quizQuestion.create({
      data: { ...data, quizId, options: JSON.stringify(data.options), order: count },
    });
    res.status(201).json({ data: question });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: "Validation failed", details: error.errors });
    res.status(500).json({ error: "Failed" });
  }
});

// POST /api/quizzes/:id/submit — Submit quiz attempt
quizRoutes.post("/:id/submit", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string | undefined;
    const quizId = req.params.id as string;
    const { answers, timeTaken, guestName } = submitQuizSchema.parse(req.body);

    // Get quiz with questions
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    // Calculate score
    let totalPoints = 0;
    let earnedPoints = 0;
    const results: Record<string, { correct: boolean; correctAnswer: string; explanation?: string }> = {};

    for (const q of quiz.questions) {
      totalPoints += q.points;
      const userAnswer = answers[q.id] || "";
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) earnedPoints += q.points;
      results[q.id] = {
        correct: isCorrect,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || undefined,
      };
    }

    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const passed = score >= quiz.passingScore;

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: userId || undefined,
        guestName: userId ? undefined : guestName?.trim() || undefined,
        quizId,
        answers: JSON.stringify(answers),
        score,
        totalPoints,
        earnedPoints,
        passed,
        timeTaken: timeTaken || null,
      },
    });

    res.json({
      data: {
        attempt,
        score,
        totalPoints,
        earnedPoints,
        passed,
        passingScore: quiz.passingScore,
        results,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: "Validation failed", details: error.errors });
    res.status(500).json({ error: "Failed" });
  }
});

// PUT /api/quizzes/:id — Update quiz info
quizRoutes.put("/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Auth required" });

    const quiz = await prisma.quiz.findUnique({ where: { id: req.params.id as string } });
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    const data = createQuizSchema.partial().parse(req.body);
    const updated = await prisma.quiz.update({ where: { id: req.params.id as string }, data });
    res.json({ data: updated });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: "Validation failed", details: error.errors });
    res.status(500).json({ error: "Failed" });
  }
});

// PUT /api/quizzes/:id/questions/:qid — Update a question
quizRoutes.put("/:id/questions/:qid", async (req: Request, res: Response) => {
  try {
    const data = createQuestionSchema.partial().parse(req.body);
    const updateData: Record<string, any> = { ...data };
    if (data.options) updateData.options = JSON.stringify(data.options);
    const question = await prisma.quizQuestion.update({
      where: { id: req.params.qid as string },
      data: updateData,
    });
    res.json({ data: question });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: "Validation failed", details: error.errors });
    res.status(500).json({ error: "Failed" });
  }
});

// DELETE /api/quizzes/:id/questions/:qid — Delete a question
quizRoutes.delete("/:id/questions/:qid", async (req: Request, res: Response) => {
  try {
    await prisma.quizQuestion.delete({ where: { id: req.params.qid as string } });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed" });
  }
});

// DELETE /api/quizzes/:id
quizRoutes.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.quiz.delete({ where: { id: req.params.id as string } });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed" });
  }
});
