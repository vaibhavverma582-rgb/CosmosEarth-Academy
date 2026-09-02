"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Palette,
  FileText,
  Images,
  Video,
  Headphones,
  BookOpen,
  Brain,
  ArrowRight,
  Loader2,
  Globe,
  Mountain,
  Telescope,
  BarChart3,
  Sparkles,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  FileStack,
  Users,
  Download,
  Eye,
  MessageSquare,
  BookMarked,
  Trophy,
  GraduationCap,
  Clock,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface AdminStats {
  totalUsers: number;
  totalNoteBookmarks: number;
  totalNotePurchases: number;
  totalQuizzes: number;
  totalQuizAttempts: number;
  avgQuizScore: number;
  totalBlogPosts: number;
  totalGalleryImages: number;
  totalVideos: number;
  totalPodcasts: number;
  totalBooks: number;
  totalResearchPapers: number;
  totalStudyMaterials: number;
  totalOrders: number;
  totalPayments: number;
  totalRevenue: number;
  totalVisitors: number;
  totalBlogComments: number;
  totalEnrollments: number;
}

interface RecentActivity {
  recentUsers: { id: string; name: string; email: string; createdAt: string }[];
  recentQuizzes: { id: string; score: number; passed: boolean; completedAt: string; guestName?: string; quiz: { title: string }; user?: { name: string; email: string } }[];
  recentOrders: { id: string; totalAmount: number; status: string; createdAt: string; user: { name: string } }[];
}

const earthSpaceLinks = [
  { title: "Geology", description: "Rocks, tectonics, volcanoes, Earth structure", icon: Mountain, href: "/geology", color: "text-orange-400", bg: "from-orange-400/10 to-transparent" },
  { title: "Geography", description: "Maps, climate, biomes, cartography", icon: Globe, href: "/geography", color: "text-green-400", bg: "from-green-500/10 to-transparent" },
  { title: "Astronomy", description: "Solar system, constellations, exoplanets", icon: Telescope, href: "/astronomy", color: "text-cyan-400", bg: "from-cyan-400/10 to-transparent" },
  { title: "Current Affairs", description: "Latest space & science news", icon: BarChart3, href: "/current-affairs", color: "text-purple-400", bg: "from-purple-400/10 to-transparent" },
  { title: "General Science", description: "Physics, chemistry, biology", icon: Sparkles, href: "/general-science", color: "text-yellow-400", bg: "from-yellow-500/10 to-transparent" },
];

const contentLinks = [
  { title: "Blog Posts", description: "Create and publish blog articles", icon: FileText, href: "/blog/upload", color: "text-purple-400", bg: "from-purple-400/10 to-transparent" },
  { title: "Gallery", description: "Upload images and space imagery", icon: Images, href: "/gallery/upload", color: "text-orange-400", bg: "from-orange-400/10 to-transparent" },
  { title: "Videos", description: "Add YouTube videos", icon: Video, href: "/videos/upload", color: "text-red-400", bg: "from-red-500/10 to-transparent" },
  { title: "Podcasts", description: "Add podcast shows and episodes", icon: Headphones, href: "/podcasts/upload", color: "text-green-400", bg: "from-green-500/10 to-transparent" },
  { title: "Research Papers", description: "Upload research papers and journals", icon: FileStack, href: "/research-papers/upload", color: "text-cyan-400", bg: "from-cyan-400/10 to-transparent" },
  { title: "Books", description: "Add books and e-books to the library", icon: BookOpen, href: "/books/upload", color: "text-yellow-400", bg: "from-yellow-500/10 to-transparent" },
  { title: "Quizzes", description: "Manage quizzes and questions", icon: Brain, href: "/quizzes/create", color: "text-pink-400", bg: "from-pink-400/10 to-transparent" },
];

const storeLinks = [
  { title: "Study Material Store", description: "Manage products, pricing, and availability", icon: ShoppingCart, href: "/admin/store", color: "text-cyan-400", bg: "from-cyan-400/10 to-transparent" },
  { title: "Orders", description: "View and manage customer orders", icon: CreditCard, href: "/admin/orders", color: "text-green-400", bg: "from-green-500/10 to-transparent" },
  { title: "Store Analytics", description: "Revenue, downloads, and insights", icon: TrendingUp, href: "/admin/analytics", color: "text-purple-400", bg: "from-purple-400/10 to-transparent" },
];

export default function AdminOverviewPage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activity, setActivity] = useState<RecentActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/admin/stats`);
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setActivity(data.recentActivity);
      } else {
        setError("Failed to load stats");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") fetchStats();
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-lg text-white/40">Sign in to access admin panel</p>
          <Link href="/auth/login">
            <button className="mt-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 px-6 py-2.5 text-sm font-semibold text-white">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <Badge variant="outline" className="mb-4">
            <Palette className="mr-1 h-3 w-3" />
            Admin Panel
          </Badge>
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Admin <span className="gradient-text-cyan">Dashboard</span>
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Manage Earth &amp; Space Science content, store, and settings.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchStats} disabled={loading}>
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      {/* Stats Cards */}
      {loading && !stats ? (
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="admin-stat-card h-20 animate-pulse" />
          ))}
        </div>
      ) : stats ? (
        <>
  

          {/* Secondary Stats */}
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { icon: BookOpen, label: "Blog Posts", value: stats.totalBlogPosts, color: "text-purple-400" },
              { icon: Images, label: "Gallery Images", value: stats.totalGalleryImages, color: "text-orange-400" },
              { icon: Video, label: "Videos", value: stats.totalVideos, color: "text-red-400" },
              { icon: Headphones, label: "Podcasts", value: stats.totalPodcasts, color: "text-green-400" },
              { icon: BookOpen, label: "Books", value: stats.totalBooks, color: "text-yellow-400" },
              { icon: FileStack, label: "Research Papers", value: stats.totalResearchPapers, color: "text-cyan-400" },
            ].map((stat) => (
              <div key={stat.label} className="admin-stat-card p-3">
                <div className="flex items-center gap-2">
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-xs text-white/50">{stat.label}</span>
                </div>
                <p className="mt-1.5 font-display text-xl font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </>
      ) : null}



      {/* Content Management */}
      <div className="mb-8">
        <h2 className="mb-4 text-sm font-bold text-white/60 uppercase tracking-wider">
          Content Management
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {contentLinks.map((item) => (
            <Link key={item.title} href={item.href}>
              <div className="admin-stat-card group cursor-pointer p-4 h-full">
                <div className="flex items-start gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${item.bg}`}>
                    <item.icon className={`h-4.5 w-4.5 ${item.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">{item.title}</h3>
                    <p className="mt-0.5 text-xs text-white/40 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Store & Orders */}
      <div className="mb-8">
        <h2 className="mb-4 text-sm font-bold text-white/60 uppercase tracking-wider">
          Store &amp; Orders
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {storeLinks.map((item) => (
            <Link key={item.title} href={item.href}>
              <div className="admin-stat-card group cursor-pointer p-4 h-full">
                <div className="flex items-start gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${item.bg}`}>
                    <item.icon className={`h-4.5 w-4.5 ${item.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">{item.title}</h3>
                    <p className="mt-0.5 text-xs text-white/40 leading-relaxed">{item.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-cyan-300 transition-colors mt-1 shrink-0" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Wallpaper */}
      <div>
        <h2 className="mb-4 text-sm font-bold text-white/60 uppercase tracking-wider">
          Settings
        </h2>
        <Link href="/admin/wallpaper">
          <div className="admin-stat-card group cursor-pointer p-4 inline-flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400/10 to-transparent">
              <Palette className="h-4.5 w-4.5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">Wallpaper</h3>
              <p className="mt-0.5 text-xs text-white/40">Upload and manage website background</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
