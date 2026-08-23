"use client";

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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const earthSpaceLinks = [
  {
    title: "Geology",
    description: "Rocks, tectonics, volcanoes, Earth structure",
    icon: Mountain,
    href: "/geology",
    color: "text-orange-400",
    bg: "from-orange-400/10 to-transparent",
  },
  {
    title: "Geography",
    description: "Maps, climate, biomes, cartography",
    icon: Globe,
    href: "/geography",
    color: "text-green-400",
    bg: "from-green-500/10 to-transparent",
  },
  {
    title: "Astronomy",
    description: "Solar system, constellations, exoplanets",
    icon: Telescope,
    href: "/astronomy",
    color: "text-cyan-400",
    bg: "from-cyan-400/10 to-transparent",
  },
  {
    title: "Current Affairs",
    description: "Latest space & science news",
    icon: BarChart3,
    href: "/current-affairs",
    color: "text-purple-400",
    bg: "from-purple-400/10 to-transparent",
  },
  {
    title: "General Science",
    description: "Physics, chemistry, biology",
    icon: Sparkles,
    href: "/general-science",
    color: "text-yellow-400",
    bg: "from-yellow-500/10 to-transparent",
  },
];

const contentLinks = [
  {
    title: "Blog Posts",
    description: "Create and publish blog articles",
    icon: FileText,
    href: "/blog/upload",
    color: "text-purple-400",
    bg: "from-purple-400/10 to-transparent",
  },
  {
    title: "Gallery",
    description: "Upload images and space imagery",
    icon: Images,
    href: "/gallery/upload",
    color: "text-orange-400",
    bg: "from-orange-400/10 to-transparent",
  },
  {
    title: "Videos",
    description: "Add YouTube videos",
    icon: Video,
    href: "/videos/upload",
    color: "text-red-400",
    bg: "from-red-500/10 to-transparent",
  },
  {
    title: "Podcasts",
    description: "Add podcast shows and episodes",
    icon: Headphones,
    href: "/podcasts/upload",
    color: "text-green-400",
    bg: "from-green-500/10 to-transparent",
  },
  {
    title: "Research Papers",
    description: "Upload research papers and journals",
    icon: FileStack,
    href: "/research-papers/upload",
    color: "text-cyan-400",
    bg: "from-cyan-400/10 to-transparent",
  },
  {
    title: "Books",
    description: "Add books and e-books to the library",
    icon: BookOpen,
    href: "/books/upload",
    color: "text-yellow-400",
    bg: "from-yellow-500/10 to-transparent",
  },
  {
    title: "Quizzes",
    description: "Manage quizzes and questions",
    icon: Brain,
    href: "/quizzes/create",
    color: "text-pink-400",
    bg: "from-pink-400/10 to-transparent",
  },
];

const storeLinks = [
  {
    title: "Study Material Store",
    description: "Manage products, pricing, and availability",
    icon: ShoppingCart,
    href: "/admin/store",
    color: "text-cyan-400",
    bg: "from-cyan-400/10 to-transparent",
  },
  {
    title: "Orders",
    description: "View and manage customer orders",
    icon: CreditCard,
    href: "/admin/orders",
    color: "text-green-400",
    bg: "from-green-500/10 to-transparent",
  },
  {
    title: "Store Analytics",
    description: "Revenue, downloads, and insights",
    icon: TrendingUp,
    href: "/admin/analytics",
    color: "text-purple-400",
    bg: "from-purple-400/10 to-transparent",
  },
];

export default function AdminOverviewPage() {
  const { data: session, status } = useSession();

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
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8">
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

      {/* Earth & Space Science Categories */}
      <div className="mb-8">
        <h2 className="mb-4 text-sm font-bold text-white/60 uppercase tracking-wider">
          Earth &amp; Space Science Categories
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {earthSpaceLinks.map((item) => (
            <Link key={item.title} href={item.href}>
              <div className="admin-stat-card group cursor-pointer p-4 h-full">
                <div className="flex items-start gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${item.bg}`}>
                    <item.icon className={`h-4.5 w-4.5 ${item.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-white/40 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-cyan-300 transition-colors mt-1 shrink-0" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Content Management */}
      <div className="mb-8">
        <h2 className="mb-4 text-sm font-bold text-white/60 uppercase tracking-wider">
          Content Management
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {contentLinks.map((item) => (
            <Link key={item.title} href={item.href}>
              <div className="admin-stat-card group cursor-pointer p-4 h-full">
                <div className="flex items-start gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${item.bg}`}>
                    <item.icon className={`h-4.5 w-4.5 ${item.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-white/40 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-cyan-300 transition-colors mt-1 shrink-0" />
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
                    <h3 className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-white/40 leading-relaxed">
                      {item.description}
                    </p>
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
              <h3 className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                Wallpaper
              </h3>
              <p className="mt-0.5 text-xs text-white/40">Upload and manage website background</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
