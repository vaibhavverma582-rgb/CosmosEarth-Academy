"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Rocket,
  ArrowRight,
  FileText,
  Images,
  Video,
  Headphones,
  Film,
  Calendar,
  Tag,
  Loader2,
  Telescope,
  Mountain,
  Globe,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/* ─── Interfaces ─────────────────────────────── */
interface BlogItem { id: string; title: string; slug: string; excerpt: string; category: string; readTime: string; coverImage?: string | null; createdAt: string; }
interface GalleryItem { id: string; title: string; imageUrl: string; category: string; createdAt: string; }
interface VideoItem { id: string; title: string; youtubeId: string; thumbnailUrl?: string | null; category: string; views: number; createdAt: string; }
interface DocumentaryItem { id: string; title: string; slug: string; description: string; posterUrl?: string | null; category: string; year?: number | null; createdAt: string; }
interface PodcastItem { id: string; title: string; slug: string; description: string; author: string; coverUrl?: string | null; category: string; episodeCount: number; createdAt: string; }

/* ─── Category Data ──────────────────────────── */
const earthSpaceCategories = [
  { name: "Geology", href: "/geology", icon: Mountain, color: "text-orange-400", gradient: "from-orange-400/15 to-orange-400/5", description: "Rocks, tectonics, volcanoes, and Earth's dynamic structure" },
  { name: "Geography", href: "/geography", icon: Globe, color: "text-emerald-400", gradient: "from-emerald-400/15 to-emerald-400/5", description: "Maps, climate zones, biomes, and world cultures" },
  { name: "Astronomy", href: "/astronomy", icon: Telescope, color: "text-cyan-400", gradient: "from-cyan-400/15 to-cyan-400/5", description: "Solar system, constellations, exoplanets, and deep space" },
  { name: "Current Affairs", href: "/current-affairs", icon: BarChart3, color: "text-purple-400", gradient: "from-purple-400/15 to-purple-400/5", description: "Latest space exploration and science discoveries" },
  { name: "General Science", href: "/general-science", icon: Sparkles, color: "text-amber-400", gradient: "from-amber-400/15 to-amber-400/5", description: "Physics, chemistry, biology, and interdisciplinary research" },
];

const categoryColors: Record<string, { badge: string; hover: string }> = {
  Astronomy: { badge: "border-cyan-500/20 text-cyan-400", hover: "group-hover:text-cyan-400" },
  Geology: { badge: "border-orange-500/20 text-orange-400", hover: "group-hover:text-orange-400" },
  Geography: { badge: "border-emerald-500/20 text-emerald-400", hover: "group-hover:text-emerald-400" },
  "Current Affairs": { badge: "border-purple-500/20 text-purple-400", hover: "group-hover:text-purple-400" },
  "General Science": { badge: "border-amber-500/20 text-amber-400", hover: "group-hover:text-amber-400" },
};

/* ─── Component ──────────────────────────────── */
export default function HomePage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [docs, setDocs] = useState<DocumentaryItem[]>([]);
  const [podcasts, setPodcasts] = useState<PodcastItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [b, g, v, d, p] = await Promise.all([
          fetch(`${API_URL}/api/blog?limit=6`).then(r => r.ok ? r.json() : { data: [] }),
          fetch(`${API_URL}/api/gallery?limit=8`).then(r => r.ok ? r.json() : { data: [] }),
          fetch(`${API_URL}/api/videos?limit=6`).then(r => r.ok ? r.json() : { data: [] }),
          fetch(`${API_URL}/api/documentaries?limit=6`).then(r => r.ok ? r.json() : { data: [] }),
          fetch(`${API_URL}/api/podcasts?limit=6`).then(r => r.ok ? r.json() : { data: [] }),
        ]);
        setBlogs(b.data || []);
        setGallery(g.data || []);
        setVideos(v.data || []);
        setDocs(d.data || []);
        setPodcasts(p.data || []);
      } catch { /* API unavailable */ }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  /* ─── Helpers ───────────────────────────────── */
  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const cc = (cat: string) => categoryColors[cat] || { badge: "border-white/15 text-white/50", hover: "group-hover:text-white/80" };

  return (
    <div className="relative">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden pb-12 pt-28 sm:pb-20 sm:pt-36">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="outline" className="mb-5 border-cyan-500/15 bg-cyan-500/5 text-cyan-400">
              <Sparkles className="mr-1 h-3 w-3" />
              Educational Platform
            </Badge>
            <h1 className="mx-auto max-w-4xl font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Exploring the{" "}
              <span className="gradient-text-cyan">universe</span>, one idea{" "}
              <br className="hidden sm:block" />
              at a <span className="gradient-text-warm">time</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-white/40 sm:text-lg">
              A comprehensive platform for Earth &amp; Space Science — blogs, notes, books, research papers, podcasts, and more.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/blog" className="btn-cosmic inline-flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4" /> Read Latest
              </Link>
              <Link href="/gallery" className="btn-outline-cosmic inline-flex items-center gap-2 text-sm">
                <Images className="h-4 w-4" /> Browse Gallery
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ===== EXPLORE EARTH & SPACE SCIENCE ===== */}
        <section className="relative py-12">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-3">
              <Globe className="mr-1 h-3 w-3" />
              Earth &amp; Space Science
            </Badge>
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Explore <span className="gradient-text-cyan">Earth &amp; Space Science</span>
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-white/35">
              Five scientific disciplines with blogs, videos, notes, books, research papers, podcasts, and more.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {earthSpaceCategories.map((cat) => (
              <Link key={cat.name} href={cat.href}>
                <Card className="group h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${cat.gradient}`}>
                        <cat.icon className={`h-5 w-5 ${cat.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-display text-base font-bold text-white ${cat.color.replace('text-', 'group-hover:text-')} transition-colors`}>{cat.name}</h3>
                        <p className="mt-1 text-[11px] text-white/30 leading-relaxed">{cat.description}</p>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-white/15 group-hover:text-cyan-300 transition-colors mt-0.5 shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <div className="section-divider" />

        {/* ===== LATEST BLOGS ===== */}
        {blogs.length > 0 && (
          <section className="py-12">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-cyan-400" /><h2 className="font-display text-xl font-bold text-white">Latest Blog Posts</h2></div>
              <Link href="/blog" className="flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300">View all <ArrowRight className="h-3 w-3" /></Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="group h-full">
                    <CardContent className="p-4">
                      {post.coverImage && <div className="mb-3 overflow-hidden rounded-lg"><img src={post.coverImage} alt={post.title} className="h-32 w-full object-cover transition-transform group-hover:scale-105" /></div>}
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={`text-[10px] ${cc(post.category).badge}`}>{post.category}</Badge>
                        <span className="text-[10px] text-white/25">{post.readTime}</span>
                      </div>
                      <h3 className={`font-display text-sm font-bold text-white ${cc(post.category).hover} transition-colors mb-1 line-clamp-2`}>{post.title}</h3>
                      <p className="text-[11px] text-white/35 line-clamp-2">{post.excerpt}</p>
                      <div className="mt-2 flex items-center gap-1 text-[10px] text-white/25"><Calendar className="h-3 w-3" />{formatDate(post.createdAt)}</div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="section-divider" />

        {/* ===== LATEST GALLERY ===== */}
        {gallery.length > 0 && (
          <section className="py-12">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2"><Images className="h-4 w-4 text-orange-400" /><h2 className="font-display text-xl font-bold text-white">Gallery</h2></div>
              <Link href="/gallery" className="flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300">View all <ArrowRight className="h-3 w-3" /></Link>
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
              {gallery.map((img) => (
                <Link key={img.id} href="/gallery">
                  <div className="group relative overflow-hidden rounded-xl aspect-square">
                    <img src={img.imageUrl} alt={img.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <p className="text-[11px] font-medium text-white">{img.title}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="section-divider" />

        {/* ===== LATEST VIDEOS ===== */}
        {videos.length > 0 && (
          <section className="py-12">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2"><Video className="h-4 w-4 text-red-400" /><h2 className="font-display text-xl font-bold text-white">Latest Videos</h2></div>
              <Link href="/videos" className="flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300">View all <ArrowRight className="h-3 w-3" /></Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((vid) => (
                <Link key={vid.id} href={`/videos/${vid.id}`}>
                  <Card className="group h-full">
                    <div className="relative overflow-hidden rounded-t-xl">
                      <img src={vid.thumbnailUrl || `https://img.youtube.com/vi/${vid.youtubeId}/mqdefault.jpg`} alt={vid.title} className="h-36 w-full object-cover transition-transform group-hover:scale-105" />
                      <div className="absolute inset-0 flex items-center justify-center"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600/90"><Video className="h-3.5 w-3.5 text-white ml-0.5" fill="white" /></div></div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">{vid.title}</h3>
                      <p className="text-[11px] text-white/35 mt-1">{vid.views} views</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="section-divider" />

        {/* ===== DOCUMENTARIES ===== */}
        {docs.length > 0 && (
          <section className="py-12">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2"><Film className="h-4 w-4 text-amber-400" /><h2 className="font-display text-xl font-bold text-white">Documentaries</h2></div>
              <Link href="/documentaries" className="flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300">View all <ArrowRight className="h-3 w-3" /></Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {docs.map((doc) => (
                <Link key={doc.id} href={`/documentaries/${doc.slug}`}>
                  <Card className="group h-full"><CardContent className="p-4"><div className="flex gap-3">
                    {doc.posterUrl && <img src={doc.posterUrl} alt={doc.title} className="h-20 w-14 shrink-0 rounded-lg object-cover" />}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">{doc.title}</h3>
                      <p className="text-[11px] text-white/35 line-clamp-2 mt-1">{doc.description}</p>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-white/25">
                        {doc.year && <span>{doc.year}</span>}
                      </div>
                    </div>
                  </div></CardContent></Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="section-divider" />

        {/* ===== PODCASTS ===== */}
        {podcasts.length > 0 && (
          <section className="py-12">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2"><Headphones className="h-4 w-4 text-emerald-400" /><h2 className="font-display text-xl font-bold text-white">Podcasts</h2></div>
              <Link href="/podcasts" className="flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300">View all <ArrowRight className="h-3 w-3" /></Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {podcasts.map((pod) => (
                <Link key={pod.id} href={`/podcasts/${pod.slug}`}>
                  <Card className="group h-full"><CardContent className="p-4"><div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-base">🎙️</div>
                    <div className="min-w-0">
                      <h3 className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">{pod.title}</h3>
                      <p className="text-[11px] text-emerald-400/70">{pod.author}</p>
                      <p className="text-[11px] text-white/35 mt-1 line-clamp-1">{pod.description}</p>
                      <p className="text-[10px] text-white/25 mt-1">{pod.episodeCount} episodes</p>
                    </div>
                  </div></CardContent></Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-cyan-500" />
          </div>
        )}

        {/* Empty State */}
        {!loading && blogs.length === 0 && gallery.length === 0 && videos.length === 0 && docs.length === 0 && podcasts.length === 0 && (
          <div className="py-16 text-center">
            <Rocket className="mx-auto h-10 w-10 text-white/15" />
            <p className="mt-3 text-base text-white/30">Your cosmic journal is empty</p>
            <p className="mt-1.5 text-xs text-white/20">Add content from the Admin Panel to see it here</p>
          </div>
        )}
      </div>
    </div>
  );
}
