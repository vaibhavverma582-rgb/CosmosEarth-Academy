"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Brain,
  Search,
  Clock,
  Trophy,
  Users,
  Star,
  Loader2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Quiz {
  id: string;
  title: string;
  slug: string;
  description?: string;
  subject: string;
  category: string;
  difficulty: string;
  timeLimit?: number;
  passingScore: number;
  creator: { name: string };
  _count: { questions: number; attempts: number };
}

const subjects = ["All", "Astronomy", "Geology", "Geography", "Physics", "Space Engineering", "General"];
const difficulties = ["All", "easy", "medium", "hard"];

const difficultyColors: Record<string, string> = {
  easy: "text-green-400 bg-green-500/10 border-green-500/20",
  medium: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  hard: "text-red-400 bg-red-500/10 border-red-500/20",
};

export default function QuizzesPage() {
  const { data: session } = useSession();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (selectedSubject !== "All") params.set("subject", selectedSubject);
      if (selectedDifficulty !== "All") params.set("difficulty", selectedDifficulty);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/quizzes?${params}`
      );
      const data = await res.json();
      setQuizzes(data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuizzes(); }, [searchQuery, selectedSubject, selectedDifficulty]);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
              <span className="gradient-text-cyan">Quizzes</span> & Tests
            </h1>
            <p className="mt-2 text-white/50">
              Test your knowledge across astronomy, geology, and more
            </p>
          </div>
          {session && (
            <Link href="/quizzes/create">
              <Button><Plus className="h-4 w-4" /> Create Quiz</Button>
            </Link>
          )}
        </div>

        {/* Search + Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input type="text" placeholder="Search quizzes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30" />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {subjects.map((s) => (
                <button key={s} onClick={() => setSelectedSubject(s)}
                  className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all ${selectedSubject === s ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/30" : "bg-white/5 text-white/50 border border-transparent hover:bg-white/10"}`}>
                  {s}
                </button>
              ))}
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex gap-2 overflow-x-auto pb-1">
              {difficulties.map((d) => (
                <button key={d} onClick={() => setSelectedDifficulty(d)}
                  className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all ${selectedDifficulty === d ? "bg-purple-400/20 text-purple-400 border border-purple-400/30" : "bg-white/5 text-white/50 border border-transparent hover:bg-white/10"}`}>
                  {d === "All" ? "All Levels" : d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quiz Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-cyan-400" /></div>
        ) : quizzes.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <Link key={quiz.id} href={`/quizzes/${quiz.slug}`}>
                <Card className="group h-full">
                  <CardContent className="p-5">
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
                          <Brain className="h-5 w-5 text-cyan-400" />
                        </div>
                        <Badge variant="outline" className={`text-[10px] ${difficultyColors[quiz.difficulty] || ""}`}>
                          {quiz.difficulty}
                        </Badge>
                      </div>
                      <Badge variant="default" className="text-[10px]">{quiz.subject}</Badge>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">{quiz.title}</h3>
                    {quiz.description && <p className="mt-1 text-xs text-white/40 line-clamp-2">{quiz.description}</p>}
                    <div className="mt-4 flex items-center gap-4 text-xs text-white/30">
                      <span className="flex items-center gap-1"><Brain className="h-3 w-3" />{quiz._count.questions} questions</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{quiz._count.attempts} attempts</span>
                      {quiz.timeLimit && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{quiz.timeLimit}m</span>}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-white/30">Pass: {quiz.passingScore}%</span>
                      <span className="text-white/30">by {quiz.creator.name}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <Brain className="mx-auto h-12 w-12 text-white/20" />
            <p className="mt-4 text-lg text-white/40">No quizzes found</p>
          </div>
        )}
      </div>
    </div>
  );
}
