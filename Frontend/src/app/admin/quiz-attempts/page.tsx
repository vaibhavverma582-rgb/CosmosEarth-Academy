"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Loader2,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2,
  XCircle,
  User,
  Brain,
  Clock,
  Trophy,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface QuizAttempt {
  id: string;
  answers: string;
  score: number;
  totalPoints: number;
  earnedPoints: number;
  passed: boolean;
  timeTaken: number | null;
  completedAt: string;
  guestName: string | null;
  userId: string | null;
  user: { id: string; name: string; email: string } | null;
  quiz: { id: string; title: string; subject: string; category: string; difficulty: string; passingScore: number };
}

interface QuizOption {
  id: string;
  title: string;
}

function getDisplayName(attempt: QuizAttempt): string {
  return attempt.user?.name || attempt.guestName || "Guest";
}

function getUserType(attempt: QuizAttempt): "registered" | "guest" {
  return attempt.userId ? "registered" : "guest";
}

function formatTime(s: number | null): string {
  if (!s) return "—";
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

export default function AdminQuizAttemptsPage() {
  const { data: session, status } = useSession();
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [quizzes, setQuizzes] = useState<QuizOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [quizId, setQuizId] = useState("");
  const [userType, setUserType] = useState("");
  const [passedFilter, setPassedFilter] = useState("");
  const [sortBy, setSortBy] = useState("completedAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Detail modal
  const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(null);

  const fetchAttempts = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "15");
      if (search) params.set("search", search);
      if (quizId) params.set("quizId", quizId);
      if (userType) params.set("userType", userType);
      if (passedFilter) params.set("passed", passedFilter);
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);

      const res = await fetch(`${API_URL}/api/admin/quiz-attempts?${params}`);
      if (res.ok) {
        const data = await res.json();
        setAttempts(data.data);
        setQuizzes(data.quizzes || []);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
      } else {
        setError("Failed to load quiz attempts");
      }
    } catch {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAttempts(); }, [page, sortBy, sortOrder, quizId, userType, passedFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => { setPage(1); fetchAttempts(); }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field) return <ChevronDown className="h-3 w-3 text-white/20" />;
    return sortOrder === "desc"
      ? <ChevronDown className="h-3 w-3 text-cyan-400" />
      : <ChevronUp className="h-3 w-3 text-cyan-400" />;
  };

  if (status === "loading" || (status === "authenticated" && loading && attempts.length === 0)) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <Link href="/admin" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Admin
          </Link>
          <h1 className="font-display text-2xl font-bold text-white mt-2">
            <span className="gradient-text-cyan">Quiz</span> Attempts
          </h1>
          <p className="mt-1 text-sm text-white/50">
            {total} total attempt{total !== 1 ? "s" : ""}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchAttempts} disabled={loading}>
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            id="qa-search"
            name="search"
            type="text"
            placeholder="Search by name, email, or quiz..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none"
          />
        </div>
        <select id="qa-quiz" name="quizId" value={quizId} onChange={(e) => { setQuizId(e.target.value); setPage(1); }}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none">
          <option value="" className="bg-[#0a0e27]">All Quizzes</option>
          {quizzes.map((q) => <option key={q.id} value={q.id} className="bg-[#0a0e27]">{q.title}</option>)}
        </select>
        <select id="qa-usertype" name="userType" value={userType} onChange={(e) => { setUserType(e.target.value); setPage(1); }}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none">
          <option value="" className="bg-[#0a0e27]">All Users</option>
          <option value="registered" className="bg-[#0a0e27]">Registered</option>
          <option value="guest" className="bg-[#0a0e27]">Guest</option>
        </select>
        <select id="qa-result" name="passed" value={passedFilter} onChange={(e) => { setPassedFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none">
          <option value="" className="bg-[#0a0e27]">All Results</option>
          <option value="true" className="bg-[#0a0e27]">Passed</option>
          <option value="false" className="bg-[#0a0e27]">Failed</option>
        </select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wider cursor-pointer hover:text-white/70" onClick={() => toggleSort("completedAt")}>
                  <div className="flex items-center gap-1">Date <SortIcon field="completedAt" /></div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">Quiz</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wider cursor-pointer hover:text-white/70" onClick={() => toggleSort("score")}>
                  <div className="flex items-center gap-1">Score <SortIcon field="score" /></div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-white/50 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center"><Loader2 className="h-6 w-6 animate-spin text-cyan-400 mx-auto" /></td></tr>
              ) : attempts.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-white/40">No quiz attempts found</td></tr>
              ) : (
                attempts.map((a) => (
                  <tr key={a.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-white/60 whitespace-nowrap">
                      {new Date(a.completedAt).toLocaleDateString()}{" "}
                      <span className="text-white/30">{new Date(a.completedAt).toLocaleTimeString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <span className="text-white font-medium">{getDisplayName(a)}</span>
                        {a.user?.email && <span className="block text-xs text-white/30">{a.user.email}</span>}
                      </div>
                      <Badge variant="outline" className={`mt-1 text-[9px] ${getUserType(a) === "registered" ? "text-green-400 border-green-500/30" : "text-amber-400 border-amber-400/30"}`}>
                        {getUserType(a) === "registered" ? "Registered" : "Guest"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white/70">{a.quiz.title}</span>
                      <span className="block text-xs text-white/30">{a.quiz.subject}</span>
                    </td>
                    <td className="px-4 py-3 cursor-pointer hover:text-white/80" onClick={() => toggleSort("score")}>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${a.passed ? "text-green-400" : "text-red-400"}`}>{a.score}%</span>
                        <span className="text-xs text-white/30">({a.earnedPoints}/{a.totalPoints})</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {a.passed ? (
                        <Badge variant="outline" className="text-[10px] text-green-400 border-green-500/30 bg-green-500/10">
                          <CheckCircle2 className="mr-1 h-3 w-3" /> Passed
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] text-red-400 border-red-500/30 bg-red-500/10">
                          <XCircle className="mr-1 h-3 w-3" /> Failed
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedAttempt(a)}
                        className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-2.5 py-1.5 text-xs text-white/50 hover:bg-white/10 hover:text-white/70 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" /> Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-white/40">
            Page {page} of {totalPages} ({total} attempts)
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedAttempt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelectedAttempt(null)}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0e1525] p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="font-display text-xl font-bold text-white">Attempt Details</h2>
                <p className="text-sm text-white/40 mt-1">{selectedAttempt.quiz.title} — {selectedAttempt.quiz.subject}</p>
              </div>
              <button onClick={() => setSelectedAttempt(null)} className="rounded-lg p-1.5 text-white/30 hover:text-white/60 hover:bg-white/5">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* User Info */}
            <div className="mb-4 rounded-xl bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <User className="h-5 w-5 text-white/40" />
                </div>
                <div>
                  <p className="font-medium text-white">{getDisplayName(selectedAttempt)}</p>
                  {selectedAttempt.user?.email && <p className="text-xs text-white/40">{selectedAttempt.user.email}</p>}
                  <Badge variant="outline" className={`mt-1 text-[9px] ${getUserType(selectedAttempt) === "registered" ? "text-green-400 border-green-500/30" : "text-amber-400 border-amber-400/30"}`}>
                    {getUserType(selectedAttempt) === "registered" ? "Registered User" : "Guest"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-white/5 p-3 text-center">
                <Trophy className={`mx-auto h-5 w-5 mb-1 ${selectedAttempt.passed ? "text-green-400" : "text-red-400"}`} />
                <p className={`font-display text-xl font-bold ${selectedAttempt.passed ? "text-green-400" : "text-red-400"}`}>{selectedAttempt.score}%</p>
                <p className="text-[10px] text-white/40">Score</p>
              </div>
              <div className="rounded-xl bg-white/5 p-3 text-center">
                <CheckCircle2 className="mx-auto h-5 w-5 mb-1 text-green-400" />
                <p className="font-display text-xl font-bold text-white">{selectedAttempt.earnedPoints}</p>
                <p className="text-[10px] text-white/40">Correct ({selectedAttempt.totalPoints - selectedAttempt.earnedPoints} wrong)</p>
              </div>
              <div className="rounded-xl bg-white/5 p-3 text-center">
                <Brain className="mx-auto h-5 w-5 mb-1 text-cyan-400" />
                <p className="font-display text-xl font-bold text-white">{selectedAttempt.totalPoints}</p>
                <p className="text-[10px] text-white/40">Total Points</p>
              </div>
              <div className="rounded-xl bg-white/5 p-3 text-center">
                <Clock className="mx-auto h-5 w-5 mb-1 text-purple-400" />
                <p className="font-display text-xl font-bold text-white">{formatTime(selectedAttempt.timeTaken)}</p>
                <p className="text-[10px] text-white/40">Time Taken</p>
              </div>
            </div>

            {/* Quiz Info */}
            <div className="mb-4 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-white/5 p-3">
                <span className="text-white/40">Quiz:</span> <span className="text-white">{selectedAttempt.quiz.title}</span>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <span className="text-white/40">Subject:</span> <span className="text-white">{selectedAttempt.quiz.subject}</span>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <span className="text-white/40">Difficulty:</span> <span className="text-white capitalize">{selectedAttempt.quiz.difficulty}</span>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <span className="text-white/40">Pass Score:</span> <span className="text-white">{selectedAttempt.quiz.passingScore}%</span>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <span className="text-white/40">Date:</span> <span className="text-white">{new Date(selectedAttempt.completedAt).toLocaleString()}</span>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <span className="text-white/40">Status:</span>{" "}
                {selectedAttempt.passed ? (
                  <span className="text-green-400 font-medium">Passed ✓</span>
                ) : (
                  <span className="text-red-400 font-medium">Failed ✗</span>
                )}
              </div>
            </div>

            {/* Question-by-question answers */}
            {(() => {
              try {
                const answers = JSON.parse(selectedAttempt.answers);
                const answerKeys = Object.keys(answers);
                if (answerKeys.length === 0) return null;
                return (
                  <div>
                    <h3 className="mb-3 text-sm font-bold text-white/60 uppercase tracking-wider">Answers</h3>
                    <div className="space-y-2">
                      {answerKeys.map((qId, i) => (
                        <div key={qId} className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2 text-xs">
                          <span className="text-white/30 w-6">Q{i + 1}</span>
                          <span className="flex-1 text-white/60 truncate">{answers[qId]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              } catch { return null; }
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
