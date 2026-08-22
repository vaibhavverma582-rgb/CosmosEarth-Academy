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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const adminLinks = [
  {
    title: "Wallpaper",
    description: "Upload and manage website background",
    icon: Palette,
    href: "/admin/wallpaper",
    color: "text-cosmos-cyan",
    bg: "from-cosmos-cyan/10 to-transparent",
  },
  {
    title: "Blog Posts",
    description: "Create and publish blog articles",
    icon: FileText,
    href: "/blog/upload",
    color: "text-cosmos-purple",
    bg: "from-cosmos-purple/10 to-transparent",
  },
  {
    title: "Gallery",
    description: "Upload images and space imagery",
    icon: Images,
    href: "/gallery/upload",
    color: "text-cosmos-orange",
    bg: "from-cosmos-orange/10 to-transparent",
  },
  {
    title: "Videos",
    description: "Add YouTube videos and documentaries",
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
    title: "Notes",
    description: "Upload study notes and materials",
    icon: BookOpen,
    href: "/notes/upload",
    color: "text-yellow-400",
    bg: "from-yellow-500/10 to-transparent",
  },
  {
    title: "Quizzes",
    description: "Manage quizzes and questions",
    icon: Brain,
    href: "/quizzes",
    color: "text-cosmos-pink",
    bg: "from-cosmos-pink/10 to-transparent",
  },
];

export default function AdminOverviewPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-cosmos-cyan" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-lg text-white/40">Sign in to access admin panel</p>
          <Link href="/auth/login">
            <button className="mt-4 rounded-xl bg-gradient-to-r from-cosmos-cyan to-cosmos-purple px-6 py-2.5 text-sm font-semibold text-white">
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
          Manage your website content and settings.
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {adminLinks.map((item) => (
          <Link key={item.title} href={item.href}>
            <div className="admin-stat-card group cursor-pointer p-5 h-full">
              <div className="flex items-start gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.bg}`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-sm font-bold text-white group-hover:text-cosmos-cyan transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-white/40 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-cosmos-cyan transition-colors mt-1 shrink-0" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
