"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Brain,
  Clock,
  Trophy,
  Bookmark,
  FileText,
  Play,
  Headphones,
  TrendingUp,
  ArrowRight,
  Loader2,
  Rocket,
  Star,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DashboardData {
  stats: {
    totalCourses: number;
    completedCourses: number;
    inProgressCourses: number;
    totalQuizzesTaken: number;
    passedQuizzes: number;
    avgScore: number;
    totalNotesUploaded: number;
    totalBookmarks: number;
    totalWatchHistory: number;
  };
  enrollments: any[];
  continueWatching: any[];
  continueListening: any[];
  bookmarkedNotes: any[];
  uploadedNotes: any[];
  quizScores: any[];
  recentAttempts: any[];
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
    if (status === "authenticated" && session) {
      fetchDashboard();
    }
  }, [status, session]);

  const fetchDashboard = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/dashboard`,
        { headers: { "x-user-id": session!.user.id } }
      );
      if (res.ok) {
        const d = await res.json();
        setData(d);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-cyan-400" />
          <p className="mt-3 text-sm text-white/50">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session || !data) return null;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m}m`;
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Welcome back, <span className="gradient-text-cyan">{session.user.name?.split(" ")[0]}</span> 👋
          </h1>
          <p className="mt-2 text-white/50">
            Here&apos;s your learning overview. Keep exploring the cosmos!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { icon: BookOpen, label: "Courses", value: data.stats.totalCourses, color: "text-cyan-400" },
            { icon: CheckCircle2, label: "Completed", value: data.stats.completedCourses, color: "text-green-400" },
            { icon: Brain, label: "Quizzes Taken", value: data.stats.totalQuizzesTaken, color: "text-purple-400" },
            { icon: Trophy, label: "Avg Score", value: `${data.stats.avgScore}%`, color: "text-amber-400" },
            { icon: FileText, label: "Notes Uploaded", value: data.stats.totalNotesUploaded, color: "text-orange-400" },
            { icon: Bookmark, label: "Bookmarks", value: data.stats.totalBookmarks, color: "text-pink-400" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="font-display text-xl font-bold text-white">{stat.value}</p>
                  <p className="text-[11px] text-white/40">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Watching */}
        {data.continueWatching.length > 0 && (
          <Section title="Continue Watching" icon={Play} href="/videos" color="text-cyan-400">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.continueWatching.map((item: any) => (
                <Link key={item.videoId} href={`/videos/${item.videoId}`}>
                  <Card className="group overflow-hidden">
                    <div className="relative aspect-video bg-white/5">
                      {item.thumbnailUrl ? (
                        <img src={item.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center"><Play className="h-8 w-8 text-white/20" /></div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                        <div className="h-full bg-cyan-400" style={{ width: `${item.percentComplete}%` }} />
                      </div>
                      <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs text-white">
                        {formatTime(item.currentTime)} / {formatTime(item.duration || 0)}
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">{item.title}</h3>
                      <Badge variant="outline" className="mt-1 text-[10px]">{item.category}</Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </Section>
        )}

        {/* Continue Listening */}
        {data.continueListening.length > 0 && (
          <Section title="Continue Listening" icon={Headphones} href="/podcasts" color="text-purple-400">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.continueListening.map((item: any) => (
                <Card key={item.episodeId} className="group">
                  <CardContent className="flex items-center gap-3 p-4">
                    {item.podcastCover ? (
                      <img src={item.podcastCover} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-white/10"><Headphones className="h-5 w-5 text-white/30" /></div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/40">{item.podcastTitle}</p>
                      <h3 className="text-sm font-semibold text-white line-clamp-1">{item.episodeTitle}</h3>
                      <div className="mt-1 h-1 w-full rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-purple-400" style={{ width: `${item.percentComplete}%` }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Section>
        )}

        {/* My Courses */}
        {data.enrollments.length > 0 && (
          <Section title="My Courses" icon={BookOpen} href="/courses" color="text-orange-400">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.enrollments.slice(0, 6).map((course: any) => (
                <Link key={course.id} href={`/courses/${course.slug}`}>
                  <Card className="group overflow-hidden">
                    <div className="relative h-32 bg-white/5">
                      {course.thumbnail ? (
                        <img src={course.thumbnail} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-cosmos-navy-light to-cosmos-navy">
                          <BookOpen className="h-8 w-8 text-white/10" />
                        </div>
                      )}
                      <Badge variant={course.status === "completed" ? "default" : "outline"} className="absolute top-2 right-2 text-[10px]">
                        {course.status}
                      </Badge>
                    </div>
                    <CardContent className="p-3">
                      <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">{course.title}</h3>
                      <p className="mt-0.5 text-xs text-white/40">{course.instructor?.name}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </Section>
        )}

        {/* Quiz Scores */}
        {data.quizScores.length > 0 && (
          <Section title="Quiz Scores" icon={Trophy} href="/quizzes" color="text-amber-400">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.quizScores.map((score: any, i: number) => (
                <Card key={i}>
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${score.passed ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                      {score.score}%
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-white line-clamp-1">{score.quizTitle}</h3>
                      <div className="flex items-center gap-2 text-[11px] text-white/40">
                        <Badge variant="outline" className="text-[9px]">{score.subject}</Badge>
                        <span>{score.difficulty}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Section>
        )}

        {/* Bookmarked Notes */}
        {data.bookmarkedNotes.length > 0 && (
          <Section title="Bookmarked Notes" icon={Bookmark} href="/notes" color="text-pink-400">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.bookmarkedNotes.map((note: any) => (
                <Link key={note.id} href={`/notes/${note.id}`}>
                  <Card className="group">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-cyan-400" />
                        <Badge variant="outline" className="text-[10px]">{note.subject}</Badge>
                        <Badge variant="outline" className="text-[10px]">{note.fileType}</Badge>
                      </div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">{note.title}</h3>
                      {note.topic && <p className="mt-0.5 text-xs text-white/40">{note.topic}</p>}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </Section>
        )}

        {/* Uploaded Notes */}
        {data.uploadedNotes.length > 0 && (
          <Section title="My Uploaded Notes" icon={FileText} href="/notes/upload" color="text-cyan-400">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.uploadedNotes.map((note: any) => (
                <Link key={note.id} href={`/notes/${note.id}`}>
                  <Card className="group">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-[10px]">{note.subject}</Badge>
                        <span className="text-[10px] text-white/30">{note.downloads} downloads</span>
                      </div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">{note.title}</h3>
                      <p className="mt-1 text-[11px] text-white/30">
                        {note._count.bookmarks} bookmarks · {new Date(note.createdAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </Section>
        )}

        {/* Empty state */}
        {data.enrollments.length === 0 && data.quizScores.length === 0 && (
          <div className="py-16 text-center">
            <Rocket className="mx-auto h-12 w-12 text-cyan-400/40" />
            <h2 className="mt-4 font-display text-xl font-bold text-white">Ready to Start?</h2>
            <p className="mt-2 text-sm text-white/50 max-w-md mx-auto">
              Enroll in courses, take quizzes, upload notes, and build your learning journey through the cosmos.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/courses"><Button><BookOpen className="h-4 w-4" /> Browse Courses</Button></Link>
              <Link href="/quizzes"><Button variant="outline"><Brain className="h-4 w-4" /> Take a Quiz</Button></Link>
              <Link href="/notes/upload"><Button variant="outline"><FileText className="h-4 w-4" /> Upload Notes</Button></Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable Section component
function Section({ title, icon: Icon, href, color, children }: {
  title: string; icon: any; href: string; color: string; children: React.ReactNode;
}) {
  return (
    <div className="mb-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
          <Icon className={`h-5 w-5 ${color}`} /> {title}
        </h2>
        <Link href={href} className="flex items-center gap-1 text-xs text-cyan-400 hover:underline">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      {children}
    </div>
  );
}
