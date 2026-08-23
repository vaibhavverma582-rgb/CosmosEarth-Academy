"use client";

import { useState, useEffect, useRef, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Brain,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  Trophy,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface QuizData {
  id: string;
  title: string;
  slug: string;
  description?: string;
  subject: string;
  difficulty: string;
  timeLimit?: number;
  passingScore: number;
  questions: Question[];
  _count: { questions: number; attempts: number };
}

interface Question {
  id: string;
  question: string;
  type: string;
  options: string;
  points: number;
  order: number;
}

interface QuizResult {
  score: number;
  totalPoints: number;
  earnedPoints: number;
  passed: boolean;
  passingScore: number;
  results: Record<string, { correct: boolean; correctAnswer: string; explanation?: string }>;
}

export default function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const quizSlug = resolvedParams.slug;
  const { data: session } = useSession();
  const router = useRouter();
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<"intro" | "taking" | "results">("intro");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/quizzes/${quizSlug}`
        );
        if (res.ok) {
          const data = await res.json();
          setQuiz(data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizSlug]);

  useEffect(() => {
    if (phase === "taking" && quiz?.timeLimit) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [phase, quiz?.timeLimit]);

  const startQuiz = () => {
    if (!quiz) return;
    setPhase("taking");
    setCurrentQ(0);
    setAnswers({});
    if (quiz.timeLimit) setTimeLeft(quiz.timeLimit * 60);
  };

  const selectAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (!quiz || !session) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/quizzes/${quiz.id}/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-user-id": session.user.id },
          body: JSON.stringify({ answers, timeTaken: quiz.timeLimit ? (quiz.timeLimit * 60 - timeLeft) : undefined }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      setResult(data.data);
      setPhase("results");
      if (timerRef.current) clearInterval(timerRef.current);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  if (loading) {
    return <div className="flex min-h-[70vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-cyan-400" /></div>;
  }

  if (!quiz) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-white/40">Quiz not found</p>
          <Link href="/quizzes"><Button variant="ghost" className="mt-4"><ArrowLeft className="h-4 w-4" /> Back</Button></Link>
        </div>
      </div>
    );
  }

  const questions = quiz.questions.map((q) => ({ ...q, options: JSON.parse(q.options) as string[] }));
  const q = questions[currentQ];
  const answeredCount = Object.keys(answers).length;

  // ─── INTRO PHASE ─────────────────────────────
  if (phase === "intro") {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <Link href="/quizzes" className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Quizzes
          </Link>

          <Card>
            <CardContent className="p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10">
                <Brain className="h-8 w-8 text-cyan-400" />
              </div>
              <h1 className="font-display text-2xl font-bold text-white mb-2">{quiz.title}</h1>
              {quiz.description && <p className="text-sm text-white/50 mb-6">{quiz.description}</p>}

              <div className="mb-8 flex flex-wrap justify-center gap-3">
                <Badge variant="outline">{quiz.subject}</Badge>
                <Badge variant="outline" className={
                  quiz.difficulty === "easy" ? "text-green-400" :
                  quiz.difficulty === "hard" ? "text-red-400" : "text-orange-400"
                }>{quiz.difficulty}</Badge>
                <Badge variant="outline">{quiz._count.questions} questions</Badge>
                {quiz.timeLimit && <Badge variant="outline"><Clock className="mr-1 h-3 w-3" />{quiz.timeLimit} min</Badge>}
                <Badge variant="outline">Pass: {quiz.passingScore}%</Badge>
              </div>

              <div className="mb-6 rounded-lg bg-white/5 p-4 text-sm text-white/50">
                <p>• Answer all {quiz._count.questions} questions</p>
                {quiz.timeLimit && <p>• Time limit: {quiz.timeLimit} minutes</p>}
                <p>• You need {quiz.passingScore}% to pass</p>
                <p>• You can review answers after submitting</p>
              </div>

              {error && <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 flex items-center gap-2"><AlertCircle className="h-4 w-4" />{error}</div>}

              <Button size="lg" onClick={startQuiz} disabled={!session}>
                {session ? "Start Quiz" : "Sign in to take quiz"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ─── TAKING PHASE ────────────────────────────
  if (phase === "taking" && q) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Top bar */}
          <div className="mb-6 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-white">
                {currentQ + 1} / {questions.length}
              </span>
              <div className="hidden sm:flex gap-1">
                {questions.map((_, i) => (
                  <div key={i} className={`h-2 w-2 rounded-full transition-colors ${
                    i === currentQ ? "bg-cyan-400" : answers[questions[i].id] ? "bg-green-400" : "bg-white/20"
                  }`} />
                ))}
              </div>
            </div>
            {quiz.timeLimit && (
              <div className={`flex items-center gap-1.5 font-mono text-sm ${timeLeft < 60 ? "text-red-400" : "text-white/60"}`}>
                <Clock className="h-4 w-4" />
                {formatTime(timeLeft)}
              </div>
            )}
          </div>

          {/* Question */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-[10px]">Q{currentQ + 1}</Badge>
                <Badge variant="outline" className="text-[10px]">{q.points} pt{q.points > 1 ? "s" : ""}</Badge>
              </div>
              <CardTitle className="text-lg">{q.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {q.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => selectAnswer(q.id, option)}
                  className={`w-full rounded-xl border p-4 text-left text-sm transition-all ${
                    answers[q.id] === option
                      ? "border-cyan-400 bg-cyan-400/10 text-cyan-400"
                      : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-medium" style={{
                    borderColor: answers[q.id] === option ? "rgb(0, 212, 255)" : "rgba(255,255,255,0.2)",
                    backgroundColor: answers[q.id] === option ? "rgba(0, 212, 255, 0.2)" : "transparent",
                  }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {option}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}>
              Previous
            </Button>
            <div className="text-sm text-white/40">
              {answeredCount}/{questions.length} answered
            </div>
            {currentQ < questions.length - 1 ? (
              <Button onClick={() => setCurrentQ(currentQ + 1)}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={submitting} className="bg-green-600 hover:bg-green-700">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Quiz"}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── RESULTS PHASE ───────────────────────────
  if (phase === "results" && result) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Score Card */}
          <Card className="mb-8 overflow-hidden">
            <div className={`p-8 text-center ${result.passed ? "bg-gradient-to-br from-green-500/20 to-cyan-400/10" : "bg-gradient-to-br from-red-500/20 to-orange-400/10"}`}>
              <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${result.passed ? "bg-green-500/20" : "bg-red-500/20"}`}>
                {result.passed ? <Trophy className="h-10 w-10 text-green-400" /> : <XCircle className="h-10 w-10 text-red-400" />}
              </div>
              <h1 className="font-display text-3xl font-bold text-white mb-2">
                {result.passed ? "Congratulations!" : "Keep Practicing!"}
              </h1>
              <p className="text-white/50 mb-4">
                {result.passed ? "You passed the quiz!" : `You needed ${result.passingScore}% to pass`}
              </p>
              <div className="font-display text-5xl font-bold text-white mb-2">{result.score}%</div>
              <p className="text-sm text-white/40">
                {result.earnedPoints}/{result.totalPoints} points
              </p>
            </div>
            <CardContent className="p-6 flex justify-center gap-4">
              <Button variant="outline" onClick={startQuiz}><RotateCcw className="h-4 w-4" /> Retake</Button>
              <Link href="/quizzes"><Button>Back to Quizzes</Button></Link>
            </CardContent>
          </Card>

          {/* Answer Review */}
          <h2 className="mb-4 font-display text-lg font-bold text-white">Review Answers</h2>
          <div className="space-y-4">
            {questions.map((question, i) => {
              const r = result.results[question.id];
              const userAnswer = answers[question.id] || "Not answered";
              return (
                <Card key={question.id} className={`border-l-4 ${r?.correct ? "border-l-green-500" : "border-l-red-500"}`}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      {r?.correct ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-400" />
                      ) : (
                        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white mb-2">Q{i + 1}. {question.question}</p>
                        <p className="text-xs mb-1">
                          <span className="text-white/40">Your answer: </span>
                          <span className={r?.correct ? "text-green-400" : "text-red-400"}>{userAnswer}</span>
                        </p>
                        {!r?.correct && (
                          <p className="text-xs mb-1">
                            <span className="text-white/40">Correct: </span>
                            <span className="text-green-400">{r?.correctAnswer}</span>
                          </p>
                        )}
                        {r?.explanation && (
                          <p className="mt-2 text-xs text-white/40 italic bg-white/5 rounded-lg p-2">💡 {r.explanation}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
