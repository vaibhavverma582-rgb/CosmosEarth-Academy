"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Brain,
  Plus,
  Trash2,
  Loader2,
  Save,
  GripVertical,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const subjects = [
  "Astronomy",
  "Geology",
  "Geography",
  "Current Affairs",
  "General Science",
];
const difficulties = ["easy", "medium", "hard"];

interface QuestionData {
  id?: string;
  question: string;
  type: "multiple-choice" | "true-false";
  options: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
  order?: number;
}

interface QuizInfo {
  id: string;
  title: string;
  slug: string;
  description: string;
  subject: string;
  category: string;
  difficulty: string;
  timeLimit: number | null;
  passingScore: number;
  questions: QuestionData[];
}

export default function EditQuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const quizSlug = resolvedParams.slug;
  const { data: session, status } = useSession();
  const router = useRouter();

  const [quiz, setQuiz] = useState<QuizInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Edit state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("Astronomy");
  const [category, setCategory] = useState("General Science");
  const [difficulty, setDifficulty] = useState("medium");
  const [timeLimit, setTimeLimit] = useState("");
  const [passingScore, setPassingScore] = useState("70");
  const [questions, setQuestions] = useState<QuestionData[]>([]);

  // New question form
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState<QuestionData>({
    question: "",
    type: "multiple-choice",
    options: ["", "", "", ""],
    correctAnswer: "",
    explanation: "",
    points: 1,
  });

  // Edit question state
  const [editingQuestionIdx, setEditingQuestionIdx] = useState<number | null>(null);
  const [editQuestion, setEditQuestion] = useState<QuestionData | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`${API_URL}/api/quizzes/${quizSlug}`);
        if (res.ok) {
          const data = await res.json();
          const q = data.data;
          setQuiz(q);
          setTitle(q.title);
          setSlug(q.slug);
          setDescription(q.description || "");
          setSubject(q.subject);
          setCategory(q.category);
          setDifficulty(q.difficulty);
          setTimeLimit(q.timeLimit ? String(q.timeLimit) : "");
          setPassingScore(String(q.passingScore));
          setQuestions(
            q.questions.map((qq: any) => ({
              id: qq.id,
              question: qq.question,
              type: qq.type,
              options: typeof qq.options === "string" ? JSON.parse(qq.options) : qq.options,
              correctAnswer: qq.correctAnswer,
              explanation: qq.explanation || "",
              points: qq.points,
              order: qq.order,
            }))
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizSlug]);

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!session || (session.user as any)?.role !== "admin") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-white/40">Admin access required</p>
          <Link href="/quizzes">
            <Button variant="ghost" className="mt-4">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-white/40">Quiz not found</p>
          <Link href="/quizzes">
            <Button variant="ghost" className="mt-4">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Save quiz info
  const handleSaveQuizInfo = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API_URL}/api/quizzes/${quiz.id}`, {
        method: "PUT",
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
        throw new Error(data.error || "Failed to update quiz");
      }
      setSuccess("Quiz info updated!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Add question
  const handleAddQuestion = async () => {
    if (!newQuestion.question || !newQuestion.correctAnswer) return;
    if (newQuestion.type === "multiple-choice" && newQuestion.options.some((o) => !o)) {
      setError("All options must be filled");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/quizzes/${quiz.id}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": session.user.id },
        body: JSON.stringify({
          question: newQuestion.question,
          type: newQuestion.type,
          options: newQuestion.type === "true-false" ? ["True", "False"] : newQuestion.options.filter((o) => o),
          correctAnswer: newQuestion.correctAnswer,
          explanation: newQuestion.explanation || undefined,
          points: newQuestion.points,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add question");
      }
      const data = await res.json();
      setQuestions([...questions, { ...newQuestion, id: data.data.id }]);
      setNewQuestion({
        question: "",
        type: "multiple-choice",
        options: ["", "", "", ""],
        correctAnswer: "",
        explanation: "",
        points: 1,
      });
      setShowAddQuestion(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete question
  const handleDeleteQuestion = async (questionId: string | undefined, idx: number) => {
    if (!questionId) return;
    if (!confirm("Delete this question?")) return;
    try {
      const res = await fetch(`${API_URL}/api/quizzes/${quiz.id}/questions/${questionId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setQuestions(questions.filter((_, i) => i !== idx));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Edit question
  const startEditQuestion = (idx: number) => {
    setEditingQuestionIdx(idx);
    setEditQuestion({ ...questions[idx] });
  };

  const handleUpdateQuestion = async () => {
    if (!editQuestion || editingQuestionIdx === null || !editQuestion.id) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/quizzes/${quiz.id}/questions/${editQuestion.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-user-id": session.user.id },
        body: JSON.stringify({
          question: editQuestion.question,
          type: editQuestion.type,
          options: editQuestion.type === "true-false" ? ["True", "False"] : editQuestion.options.filter((o) => o),
          correctAnswer: editQuestion.correctAnswer,
          explanation: editQuestion.explanation || undefined,
          points: editQuestion.points,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update question");
      }
      const updated = [...questions];
      updated[editingQuestionIdx] = editQuestion;
      setQuestions(updated);
      setEditingQuestionIdx(null);
      setEditQuestion(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <Link href="/quizzes" className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Quizzes
        </Link>

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Badge variant="outline" className="mb-4">
              <Pencil className="mr-1 h-3 w-3" /> Edit Quiz
            </Badge>
            <h1 className="font-display text-3xl font-bold text-white">
              <span className="gradient-text-cyan">Edit</span> Quiz
            </h1>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
        )}
        {success && (
          <div className="mb-4 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">{success}</div>
        )}

        {/* Quiz Info Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-sm">Quiz Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">URL Slug *</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/30">/quizzes/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    required
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white font-mono placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/70">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 resize-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">Subject *</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                >
                  {subjects.map((s) => (
                    <option key={s} value={s} className="bg-[#0a0e27]">{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">Difficulty *</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                >
                  {difficulties.map((d) => (
                    <option key={d} value={d} className="bg-[#0a0e27]">{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">Time Limit (min)</label>
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
                <label className="mb-1.5 block text-sm font-medium text-white/70">Passing Score (%)</label>
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

            <Button onClick={handleSaveQuizInfo} disabled={saving || !title || !slug} className="w-full">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Save Quiz Info</>}
            </Button>
          </CardContent>
        </Card>

        {/* Questions Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Questions ({questions.length})</CardTitle>
              <Button size="sm" onClick={() => setShowAddQuestion(!showAddQuestion)}>
                <Plus className="h-3.5 w-3.5" /> Add Question
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Add Question Form */}
            {showAddQuestion && (
              <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4 space-y-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">New Question</span>
                  <button onClick={() => setShowAddQuestion(false)} className="text-white/30 hover:text-white/60">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-white/60">Type</label>
                    <select
                      value={newQuestion.type}
                      onChange={(e) => {
                        const type = e.target.value as "multiple-choice" | "true-false";
                        setNewQuestion({
                          ...newQuestion,
                          type,
                          options: type === "true-false" ? ["True", "False"] : ["", "", "", ""],
                          correctAnswer: "",
                        });
                      }}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none"
                    >
                      <option value="multiple-choice" className="bg-[#0a0e27]">Multiple Choice</option>
                      <option value="true-false" className="bg-[#0a0e27]">True / False</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-white/60">Points</label>
                    <input
                      type="number"
                      value={newQuestion.points}
                      onChange={(e) => setNewQuestion({ ...newQuestion, points: parseInt(e.target.value) || 1 })}
                      min="1"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-white/60">Question *</label>
                  <textarea
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                    rows={2}
                    placeholder="Enter the question..."
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none resize-none"
                  />
                </div>

                {newQuestion.type === "multiple-choice" && (
                  <div>
                    <label className="mb-1 block text-xs font-medium text-white/60">Options *</label>
                    <div className="space-y-2">
                      {newQuestion.options.map((opt, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-xs text-white/30 w-5">{String.fromCharCode(65 + i)}</span>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const opts = [...newQuestion.options];
                              opts[i] = e.target.value;
                              setNewQuestion({ ...newQuestion, options: opts });
                            }}
                            placeholder={`Option ${String.fromCharCode(65 + i)}`}
                            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-xs font-medium text-white/60">Correct Answer *</label>
                  {newQuestion.type === "true-false" ? (
                    <select
                      value={newQuestion.correctAnswer}
                      onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none"
                    >
                      <option value="" className="bg-[#0a0e27]">Select...</option>
                      <option value="True" className="bg-[#0a0e27]">True</option>
                      <option value="False" className="bg-[#0a0e27]">False</option>
                    </select>
                  ) : (
                    <select
                      value={newQuestion.correctAnswer}
                      onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none"
                    >
                      <option value="" className="bg-[#0a0e27]">Select...</option>
                      {newQuestion.options.map((opt, i) => opt && (
                        <option key={i} value={opt} className="bg-[#0a0e27]">{String.fromCharCode(65 + i)}. {opt}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-white/60">Explanation (optional)</label>
                  <input
                    type="text"
                    value={newQuestion.explanation}
                    onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                    placeholder="Why this answer is correct..."
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none"
                  />
                </div>

                <Button
                  onClick={handleAddQuestion}
                  disabled={saving || !newQuestion.question || !newQuestion.correctAnswer}
                  className="w-full"
                  size="sm"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-3.5 w-3.5" /> Add Question</>}
                </Button>
              </div>
            )}

            {/* Questions List */}
            {questions.length > 0 ? (
              questions.map((q, i) => (
                <div key={q.id || i} className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                  {editingQuestionIdx === i && editQuestion ? (
                    /* Edit mode */
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-cyan-400">Editing Q{i + 1}</span>
                        <button onClick={() => { setEditingQuestionIdx(null); setEditQuestion(null); }} className="text-white/30 hover:text-white/60 text-xs">
                          Cancel
                        </button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-white/60">Type</label>
                          <select
                            value={editQuestion.type}
                            onChange={(e) => {
                              const type = e.target.value as "multiple-choice" | "true-false";
                              setEditQuestion({
                                ...editQuestion,
                                type,
                                options: type === "true-false" ? ["True", "False"] : ["", "", "", ""],
                              });
                            }}
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none"
                          >
                            <option value="multiple-choice" className="bg-[#0a0e27]">Multiple Choice</option>
                            <option value="true-false" className="bg-[#0a0e27]">True / False</option>
                          </select>
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-white/60">Points</label>
                          <input
                            type="number"
                            value={editQuestion.points}
                            onChange={(e) => setEditQuestion({ ...editQuestion, points: parseInt(e.target.value) || 1 })}
                            min="1"
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-white/60">Question</label>
                        <textarea
                          value={editQuestion.question}
                          onChange={(e) => setEditQuestion({ ...editQuestion, question: e.target.value })}
                          rows={2}
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none resize-none"
                        />
                      </div>
                      {editQuestion.type === "multiple-choice" && (
                        <div>
                          <label className="mb-1 block text-xs font-medium text-white/60">Options</label>
                          <div className="space-y-2">
                            {editQuestion.options.map((opt, oi) => (
                              <div key={oi} className="flex items-center gap-2">
                                <span className="text-xs text-white/30 w-5">{String.fromCharCode(65 + oi)}</span>
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => {
                                    const opts = [...editQuestion.options];
                                    opts[oi] = e.target.value;
                                    setEditQuestion({ ...editQuestion, options: opts });
                                  }}
                                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div>
                        <label className="mb-1 block text-xs font-medium text-white/60">Correct Answer</label>
                        {editQuestion.type === "true-false" ? (
                          <select
                            value={editQuestion.correctAnswer}
                            onChange={(e) => setEditQuestion({ ...editQuestion, correctAnswer: e.target.value })}
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none"
                          >
                            <option value="" className="bg-[#0a0e27]">Select...</option>
                            <option value="True" className="bg-[#0a0e27]">True</option>
                            <option value="False" className="bg-[#0a0e27]">False</option>
                          </select>
                        ) : (
                          <select
                            value={editQuestion.correctAnswer}
                            onChange={(e) => setEditQuestion({ ...editQuestion, correctAnswer: e.target.value })}
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none"
                          >
                            <option value="" className="bg-[#0a0e27]">Select...</option>
                            {editQuestion.options.map((opt, oi) => opt && (
                              <option key={oi} value={opt} className="bg-[#0a0e27]">{String.fromCharCode(65 + oi)}. {opt}</option>
                            ))}
                          </select>
                        )}
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-white/60">Explanation</label>
                        <input
                          type="text"
                          value={editQuestion.explanation}
                          onChange={(e) => setEditQuestion({ ...editQuestion, explanation: e.target.value })}
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none"
                        />
                      </div>
                      <Button onClick={handleUpdateQuestion} disabled={saving} size="sm" className="w-full">
                        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><Save className="h-3.5 w-3.5" /> Save Question</>}
                      </Button>
                    </div>
                  ) : (
                    /* View mode */
                    <div className="flex items-start gap-3">
                      <GripVertical className="h-4 w-4 mt-1 text-white/20 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-semibold text-white/30">Q{i + 1}</span>
                          <Badge variant="outline" className="text-[10px]">{q.type}</Badge>
                          <Badge variant="outline" className="text-[10px]">{q.points}pt</Badge>
                        </div>
                        <p className="text-sm text-white line-clamp-1">{q.question}</p>
                        <p className="text-xs text-green-400/70 mt-0.5">Answer: {q.correctAnswer}</p>
                        {q.explanation && <p className="text-xs text-white/30 mt-0.5 line-clamp-1">💡 {q.explanation}</p>}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => startEditQuestion(i)}
                          className="rounded-lg p-1.5 text-white/30 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q.id, i)}
                          className="rounded-lg p-1.5 text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <Brain className="mx-auto h-8 w-8 text-white/20" />
                <p className="mt-2 text-sm text-white/40">No questions yet. Add your first question above.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
