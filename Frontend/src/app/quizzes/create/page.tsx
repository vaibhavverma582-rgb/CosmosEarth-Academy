"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Brain,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const subjects = [
  "Astronomy",
  "Geology",
  "Geography",
  "Physics",
  "Space Engineering",
  "General",
];
const difficulties = ["easy", "medium", "hard"];

interface QuestionData {
  question: string;
  type: "multiple-choice" | "true-false";
  options: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
}

export default function CreateQuizPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Step 1: Quiz info
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("Astronomy");
  const [category, setCategory] = useState("General");
  const [difficulty, setDifficulty] = useState("medium");
  const [timeLimit, setTimeLimit] = useState("");
  const [passingScore, setPassingScore] = useState("70");

  // Step 2: Questions
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData>({
    question: "",
    type: "multiple-choice",
    options: ["", "", "", ""],
    correctAnswer: "",
    explanation: "",
    points: 1,
  });

  // State
  const [step, setStep] = useState<"quiz" | "questions" | "done">("quiz");
  const [quizId, setQuizId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (status === "loading") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-white/40">Sign in to create quizzes</p>
          <Link href="/auth/login">
            <Button className="mt-4">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Auto-generate slug
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (
      !slug ||
      slug ===
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
    ) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    }
  };

  // Step 1: Create quiz
  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !subject) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/quizzes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": session.user.id,
        },
        body: JSON.stringify({
          title,
          slug,
          description: description || undefined,
          subject,
          category,
          difficulty,
          timeLimit: timeLimit ? parseInt(timeLimit) : undefined,
          passingScore: parseInt(passingScore),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create quiz");
      }

      const data = await res.json();
      setQuizId(data.data.id);
      setStep("questions");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Add question
  const handleAddQuestion = async () => {
    if (!currentQuestion.question || !currentQuestion.correctAnswer) return;
    if (
      currentQuestion.type === "multiple-choice" &&
      currentQuestion.options.some((o) => !o)
    ) {
      setError("All options must be filled");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/quizzes/${quizId}/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": session.user.id,
        },
        body: JSON.stringify({
          question: currentQuestion.question,
          type: currentQuestion.type,
          options:
            currentQuestion.type === "true-false"
              ? ["True", "False"]
              : currentQuestion.options.filter((o) => o),
          correctAnswer: currentQuestion.correctAnswer,
          explanation: currentQuestion.explanation || undefined,
          points: currentQuestion.points,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add question");
      }

      setQuestions([...questions, { ...currentQuestion }]);
      setCurrentQuestion({
        question: "",
        type: "multiple-choice",
        options: ["", "", "", ""],
        correctAnswer: "",
        explanation: "",
        points: 1,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Remove question locally
  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // Finish
  const handleFinish = () => {
    if (questions.length === 0) {
      setError("Add at least one question");
      return;
    }
    setStep("done");
    setTimeout(() => router.push("/quizzes"), 2000);
  };

  // Done screen
  if (step === "done") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="h-8 w-8 text-green-400" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-2">
            Quiz Created!
          </h2>
          <p className="text-sm text-white/50">
            {questions.length} question{questions.length !== 1 ? "s" : ""}{" "}
            added. Redirecting...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/quizzes"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Quizzes
        </Link>

        {/* Header */}
        <div className="mb-8">
          <Badge variant="outline" className="mb-4">
            <Brain className="mr-1 h-3 w-3" />
            {step === "quiz" ? "Quiz Setup" : "Add Questions"}
          </Badge>
          <h1 className="font-display text-3xl font-bold text-white">
            <span className="gradient-text-cyan">Create</span> a Quiz
          </h1>
        </div>

        {/* Step indicator */}
        <div className="mb-8 flex items-center gap-3">
          <div
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
              step === "quiz"
                ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/30"
                : "bg-green-500/10 text-green-400 border border-green-500/20"
            }`}
          >
            1. Quiz Info
          </div>
          <div
            className={`h-px w-8 ${step === "questions" ? "bg-cyan-400" : "bg-white/10"}`}
          />
          <div
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
              step === "questions"
                ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/30"
                : "bg-white/5 text-white/30 border border-transparent"
            }`}
          >
            2. Questions ({questions.length})
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* STEP 1: Quiz Info */}
        {step === "quiz" && (
          <form onSubmit={handleCreateQuiz}>
            <Card>
              <CardContent className="p-6 space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-white/70">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g., Solar System Basics"
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-white/70">
                      URL Slug *
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/30">/quizzes/</span>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) =>
                          setSlug(
                            e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9-]/g, "")
                          )
                        }
                        placeholder="solar-system-basics"
                        required
                        className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white font-mono placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the quiz..."
                    rows={2}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 resize-none"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-white/70">
                      Subject *
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                    >
                      {subjects.map((s) => (
                        <option key={s} value={s} className="bg-[#0a0e27]">
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-white/70">
                      Difficulty *
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                    >
                      {difficulties.map((d) => (
                        <option key={d} value={d} className="bg-[#0a0e27]">
                          {d.charAt(0).toUpperCase() + d.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-white/70">
                      Category
                    </label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="General"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-white/70">
                      Time Limit (min)
                    </label>
                    <input
                      type="number"
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(e.target.value)}
                      placeholder="No limit"
                      min="1"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-white/70">
                      Passing Score (%)
                    </label>
                    <input
                      type="number"
                      value={passingScore}
                      onChange={(e) => setPassingScore(e.target.value)}
                      min="0"
                      max="100"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading || !title || !slug || !subject}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create Quiz & Add Questions
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </form>
        )}

        {/* STEP 2: Add Questions */}
        {step === "questions" && (
          <div className="space-y-6">
            {/* Question form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  Question #{questions.length + 1}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-white/70">
                      Question Type
                    </label>
                    <select
                      value={currentQuestion.type}
                      onChange={(e) => {
                        const type = e.target.value as "multiple-choice" | "true-false";
                        setCurrentQuestion({
                          ...currentQuestion,
                          type,
                          options:
                            type === "true-false"
                              ? ["True", "False"]
                              : ["", "", "", ""],
                          correctAnswer: "",
                        });
                      }}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                    >
                      <option value="multiple-choice" className="bg-[#0a0e27]">
                        Multiple Choice
                      </option>
                      <option value="true-false" className="bg-[#0a0e27]">
                        True / False
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-white/70">
                      Points
                    </label>
                    <input
                      type="number"
                      value={currentQuestion.points}
                      onChange={(e) =>
                        setCurrentQuestion({
                          ...currentQuestion,
                          points: parseInt(e.target.value) || 1,
                        })
                      }
                      min="1"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">
                    Question *
                  </label>
                  <textarea
                    value={currentQuestion.question}
                    onChange={(e) =>
                      setCurrentQuestion({
                        ...currentQuestion,
                        question: e.target.value,
                      })
                    }
                    placeholder="What is the largest planet in our solar system?"
                    rows={2}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 resize-none"
                    required
                  />
                </div>

                {/* Options */}
                {currentQuestion.type === "multiple-choice" ? (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-white/70">
                      Options * (fill all, mark correct below)
                    </label>
                    <div className="space-y-2">
                      {currentQuestion.options.map((opt, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-xs text-white/30 w-6">
                            {String.fromCharCode(65 + i)}
                          </span>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const newOpts = [...currentQuestion.options];
                              newOpts[i] = e.target.value;
                              setCurrentQuestion({
                                ...currentQuestion,
                                options: newOpts,
                              });
                            }}
                            placeholder={`Option ${String.fromCharCode(65 + i)}`}
                            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-white/70">
                      Correct Answer *
                    </label>
                    <select
                      value={currentQuestion.correctAnswer}
                      onChange={(e) =>
                        setCurrentQuestion({
                          ...currentQuestion,
                          correctAnswer: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                    >
                      <option value="" className="bg-[#0a0e27]">
                        Select answer...
                      </option>
                      <option value="True" className="bg-[#0a0e27]">
                        True
                      </option>
                      <option value="False" className="bg-[#0a0e27]">
                        False
                      </option>
                    </select>
                  </div>
                )}

                {/* Correct answer for MC */}
                {currentQuestion.type === "multiple-choice" && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-white/70">
                      Correct Answer *
                    </label>
                    <select
                      value={currentQuestion.correctAnswer}
                      onChange={(e) =>
                        setCurrentQuestion({
                          ...currentQuestion,
                          correctAnswer: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                    >
                      <option value="" className="bg-[#0a0e27]">
                        Select correct answer...
                      </option>
                      {currentQuestion.options.map(
                        (opt, i) =>
                          opt && (
                            <option key={i} value={opt} className="bg-[#0a0e27]">
                              {String.fromCharCode(65 + i)}. {opt}
                            </option>
                          )
                      )}
                    </select>
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">
                    Explanation (optional)
                  </label>
                  <input
                    type="text"
                    value={currentQuestion.explanation}
                    onChange={(e) =>
                      setCurrentQuestion({
                        ...currentQuestion,
                        explanation: e.target.value,
                      })
                    }
                    placeholder="Why this answer is correct..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                  />
                </div>

                <Button
                  onClick={handleAddQuestion}
                  disabled={
                    loading ||
                    !currentQuestion.question ||
                    !currentQuestion.correctAnswer
                  }
                  className="w-full"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Add Question
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Added questions list */}
            {questions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    Added Questions ({questions.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {questions.map((q, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3"
                    >
                      <GripVertical className="h-4 w-4 mt-1 text-white/20 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-semibold text-white/30">
                            Q{i + 1}
                          </span>
                          <Badge variant="outline" className="text-[10px]">
                            {q.type}
                          </Badge>
                          <Badge variant="outline" className="text-[10px]">
                            {q.points}pt
                          </Badge>
                        </div>
                        <p className="text-sm text-white line-clamp-1">
                          {q.question}
                        </p>
                        <p className="text-xs text-green-400/70 mt-0.5">
                          Answer: {q.correctAnswer}
                        </p>
                      </div>
                      <button
                        onClick={() => removeQuestion(i)}
                        className="shrink-0 rounded-lg p-1.5 text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Finish button */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("quiz")}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Quiz Info
              </Button>
              <Button
                onClick={handleFinish}
                disabled={questions.length === 0}
                className="flex-1"
              >
                <CheckCircle2 className="h-4 w-4" />
                Finish ({questions.length} question{questions.length !== 1 ? "s" : ""})
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
