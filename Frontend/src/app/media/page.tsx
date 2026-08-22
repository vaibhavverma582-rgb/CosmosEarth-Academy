"use client";

import Link from "next/link";
import {
  FileText,
  Images,
  Video,
  Film,
  Headphones,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const sections = [
  {
    title: "Notes",
    description: "Study notes, cheat sheets, and resources uploaded by the community",
    href: "/notes",
    icon: FileText,
    color: "from-cosmos-cyan/20 to-cyan-500/5",
    iconColor: "text-cosmos-cyan",
    stats: "Upload & share study materials",
    gradient: "from-cosmos-cyan to-cyan-400",
  },
  {
    title: "Gallery",
    description: "Stunning astronomy, geology, and space imagery — free to download",
    href: "/gallery",
    icon: Images,
    color: "from-cosmos-purple/20 to-purple-500/5",
    iconColor: "text-cosmos-purple",
    stats: "Browse & download images",
    gradient: "from-cosmos-purple to-purple-400",
  },
  {
    title: "Videos",
    description: "Educational YouTube videos on astronomy, physics, and space exploration",
    href: "/videos",
    icon: Video,
    color: "from-cosmos-orange/20 to-orange-500/5",
    iconColor: "text-cosmos-orange",
    stats: "Watch & create playlists",
    gradient: "from-cosmos-orange to-orange-400",
  },
  {
    title: "Documentaries",
    description: "Cinematic explorations of the universe with trailers and watchlists",
    href: "/documentaries",
    icon: Film,
    color: "from-cosmos-pink/20 to-pink-500/5",
    iconColor: "text-cosmos-pink",
    stats: "Discover & track films",
    gradient: "from-cosmos-pink to-pink-400",
  },
  {
    title: "Podcasts",
    description: "Audio shows and episodes on science, with playlists and speed control",
    href: "/podcasts",
    icon: Headphones,
    color: "from-green-500/20 to-green-500/5",
    iconColor: "text-green-400",
    stats: "Listen & subscribe",
    gradient: "from-green-400 to-emerald-400",
  },
];

const quickLinks = [
  { label: "Quizzes", href: "/quizzes", icon: "🧠" },
  { label: "Astronomy", href: "/astronomy", icon: "🔭" },
  { label: "Geology", href: "/geology", icon: "🪨" },
  { label: "Geography", href: "/geography", icon: "🌍" },
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
];

export default function MediaPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="relative mb-12 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[300px] w-[600px] rounded-full bg-glow-cyan opacity-15 blur-3xl" />
          <div className="relative">
            <Badge variant="outline" className="mb-4">
              <Sparkles className="mr-1 h-3 w-3" />
              Media Hub
            </Badge>
            <h1 className="font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              <span className="gradient-text-cyan">Explore</span>{" "}
              <span className="text-white">Content</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/50">
              Notes, images, videos, documentaries, and podcasts — everything you need to
              explore the cosmos in one place.
            </p>
          </div>
        </div>

        {/* Quick links */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="glass-card flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white/70 transition-all hover:text-white hover:border-white/20"
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Main sections */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {sections.map((section, i) => (
            <Link key={section.title} href={section.href}>
              <Card className="group h-full overflow-hidden">
                {/* Gradient header */}
                <div className={`h-2 bg-gradient-to-r ${section.gradient}`} />
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${section.color}`}>
                      <section.icon className={`h-7 w-7 ${section.iconColor}`} />
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-bold text-white group-hover:text-cosmos-cyan transition-colors">
                        {section.title}
                      </h2>
                      <p className="text-xs text-white/40">{section.stats}</p>
                    </div>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed mb-4">
                    {section.description}
                  </p>
                  <div className="flex items-center gap-1 text-sm font-medium text-cosmos-cyan opacity-0 transition-all group-hover:opacity-100">
                    Explore {section.title}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Stats */}
        <div className="glass-card rounded-2xl p-6 sm:p-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
            {[
              { icon: FileText, label: "Study Notes", value: "Community", color: "text-cosmos-cyan" },
              { icon: Images, label: "Images", value: "High-res", color: "text-cosmos-purple" },
              { icon: Video, label: "Videos", value: "YouTube", color: "text-cosmos-orange" },
              { icon: Film, label: "Documentaries", value: "Curated", color: "text-cosmos-pink" },
              { icon: Headphones, label: "Podcasts", value: "Audio", color: "text-green-400" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className={`mx-auto mb-2 h-6 w-6 ${stat.color}`} />
                <p className="font-display text-sm font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/40">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
