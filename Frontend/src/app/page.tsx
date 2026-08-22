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
  BookOpen,
  Calendar,
  Tag,
  Sparkles,
  Loader2,
  Telescope,
  Mountain,
  Globe,
  Newspaper,
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

/* ─── Category Colors ────────────────────────── */
const categoryColors: Record<string, { icon: string; badge: string; hover: string; gradient: string }> = {
  Astronomy: { icon: "text-cosmos-cyan", badge: "border-cosmos-cyan/30 text-cosmos-cyan", hover: "group-hover:text-cosmos-cyan", gradient: "from-cosmos-cyan/20 to-cosmos-cyan/5" },
  Geology: { icon: "text-cosmos-orange", badge: "border-cosmos-orange/30 text-cosmos-orange", hover: "group-hover:text-cosmos-orange", gradient: "from-cosmos-orange/20 to-cosmos-orange/5" },
  Geography: { icon: "text-green-400", badge: "border-green-400/30 text-green-400", hover: "group-hover:text-green-400", gradient: "from-green-400/20 to-green-400/5" },
  "Current Affairs": { icon: "text-cosmos-purple", badge: "border-cosmos-purple/30 text-cosmos-purple", hover: "group-hover:text-cosmos-purple", gradient: "from-cosmos-purple/20 to-cosmos-purple/5" },
};

const categoryIcons: Record<string, typeof Telescope> = {
  Astronomy: Telescope,
  Geology: Mountain,
  Geography: Globe,
  "Current Affairs": Newspaper,
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
  const cc = (cat: string) => categoryColors[cat] || categoryColors.Astronomy;

  return (
    <div className="relative">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden pb-16 pt-32 sm:pb-24 sm:pt-40">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-glow-cyan opacity-20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="outline" className="mb-6 border-cosmos-cyan/20 bg-cosmos-cyan/5 text-cosmos-cyan">
              <Sparkles className="mr-1 h-3 w-3" />
              Personal Cosmic Journal
            </Badge>
            <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Exploring the{" "}
              <span className="gradient-text-cyan">universe</span>, one idea{" "}
              <br className="hidden sm:block" />
              at a <span className="gradient-text-warm">time</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/50 sm:text-xl">
              A personal space for thoughts, discoveries, and reflections on
              astronomy, planetary science, and the cosmos beyond.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/blog" className="btn-cosmic inline-flex items-center gap-2 text-base">
                <FileText className="h-4 w-4" /> Read Latest
              </Link>
              <Link href="/gallery" className="btn-outline-cosmic inline-flex items-center gap-2 text-base">
                <Images className="h-4 w-4" /> Browse Gallery
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ===== CATEGORY QUICK LINKS ===== */}
        <section className="relative py-12">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Object.keys(categoryColors).map((cat) => {
              const Icon = categoryIcons[cat];
              const c = cc(cat);
              return (
                <Link key={cat} href={`/${cat.toLowerCase().replace(" & ", "-").replace(" ", "-")}`}>
                  <Card className="group text-center">
                    <CardContent className="p-5">
                      <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${c.gradient}`}>
                        <Icon className={`h-6 w-6 ${c.icon}`} />
                      </div>
                      <p className={`font-display text-sm font-bold text-white ${c.hover} transition-colors`}>{cat}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        <div className="section-divider" />

        {/* ===== LATEST BLOGS ===== */}
        {blogs.length > 0 && (
          <section className="py-16">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2"><FileText className="h-5 w-5 text-cosmos-cyan" /><h2 className="font-display text-2xl font-bold text-white">Latest Blog Posts</h2></div>
              <Link href="/blog" className="flex items-center gap-1 text-sm font-medium text-cosmos-cyan hover:underline">View all <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="group h-full">
                    <CardContent className="p-5">
                      {post.coverImage && <div className="mb-3 overflow-hidden rounded-xl"><img src={post.coverImage} alt={post.title} className="h-36 w-full object-cover transition-transform group-hover:scale-105" /></div>}
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={`text-xs ${cc(post.category).badge}`}>{post.category}</Badge>
                        <span className="text-xs text-white/30">{post.readTime}</span>
                      </div>
                      <h3 className={`font-display text-base font-bold text-white ${cc(post.category).hover} transition-colors mb-1`}>{post.title}</h3>
                      <p className="text-xs text-white/40 line-clamp-2">{post.excerpt}</p>
                      <div className="mt-2 flex items-center gap-1 text-xs text-white/30"><Calendar className="h-3 w-3" />{formatDate(post.createdAt)}</div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="section-divider" />

        {/* ===== WRITE A BLOG ===== */}
        <section className="py-16">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-cosmos-navy-light/50 backdrop-blur-sm">
            <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-glow-cyan opacity-20 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-glow-purple opacity-20 blur-3xl" />
            <div className="relative px-6 py-16 text-center sm:px-12 sm:py-20">
              <Badge variant="outline" className="mb-6"><FileText className="mr-1 h-3 w-3" /> Write</Badge>
              <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Share Your <span className="gradient-text-cyan">Cosmic Thoughts</span></h2>
              <p className="mx-auto mt-4 max-w-xl text-white/50">Write blog posts about space, science, and your discoveries.</p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/blog/upload"><button className="btn-cosmic inline-flex items-center gap-2 text-base"><FileText className="h-4 w-4" /> Write a Blog Post</button></Link>
                <Link href="/blog"><button className="btn-outline-cosmic inline-flex items-center gap-2 text-base">Read Blog <ArrowRight className="h-4 w-4" /></button></Link>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ===== LATEST GALLERY ===== */}
        {gallery.length > 0 && (
          <section className="py-16">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2"><Images className="h-5 w-5 text-cosmos-orange" /><h2 className="font-display text-2xl font-bold text-white">Gallery</h2></div>
              <Link href="/gallery" className="flex items-center gap-1 text-sm font-medium text-cosmos-cyan hover:underline">View all <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {gallery.map((img) => (
                <Link key={img.id} href="/gallery">
                  <div className="group relative overflow-hidden rounded-xl aspect-square">
                    <img src={img.imageUrl} alt={img.title} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <p className="text-xs font-medium text-white">{img.title}</p>
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
          <section className="py-16">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2"><Video className="h-5 w-5 text-red-400" /><h2 className="font-display text-2xl font-bold text-white">Latest Videos</h2></div>
              <Link href="/videos" className="flex items-center gap-1 text-sm font-medium text-cosmos-cyan hover:underline">View all <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((vid) => (
                <Link key={vid.id} href={`/videos/${vid.id}`}>
                  <Card className="group h-full">
                    <div className="relative overflow-hidden rounded-t-xl">
                      <img src={vid.thumbnailUrl || `https://img.youtube.com/vi/${vid.youtubeId}/mqdefault.jpg`} alt={vid.title} className="h-40 w-full object-cover transition-transform group-hover:scale-105" />
                      <div className="absolute inset-0 flex items-center justify-center"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/90"><Video className="h-4 w-4 text-white ml-0.5" fill="white" /></div></div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-display text-sm font-bold text-white group-hover:text-cosmos-cyan transition-colors line-clamp-1">{vid.title}</h3>
                      <p className="text-xs text-white/40 mt-1">{vid.views} views</p>
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
          <section className="py-16">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2"><Film className="h-5 w-5 text-cosmos-gold" /><h2 className="font-display text-2xl font-bold text-white">Documentaries</h2></div>
              <Link href="/documentaries" className="flex items-center gap-1 text-sm font-medium text-cosmos-cyan hover:underline">View all <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {docs.map((doc) => (
                <Link key={doc.id} href={`/documentaries/${doc.slug}`}>
                  <Card className="group h-full"><CardContent className="p-4"><div className="flex gap-4">
                    {doc.posterUrl && <img src={doc.posterUrl} alt={doc.title} className="h-24 w-16 shrink-0 rounded-lg object-cover" />}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-sm font-bold text-white group-hover:text-cosmos-cyan transition-colors line-clamp-1">{doc.title}</h3>
                      <p className="text-xs text-white/40 line-clamp-2 mt-1">{doc.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-white/30">
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
          <section className="py-16">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2"><Headphones className="h-5 w-5 text-green-400" /><h2 className="font-display text-2xl font-bold text-white">Podcasts</h2></div>
              <Link href="/podcasts" className="flex items-center gap-1 text-sm font-medium text-cosmos-cyan hover:underline">View all <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {podcasts.map((pod) => (
                <Link key={pod.id} href={`/podcasts/${pod.slug}`}>
                  <Card className="group h-full"><CardContent className="p-4"><div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-cosmos-navy text-lg">🎙️</div>
                    <div className="min-w-0">
                      <h3 className="font-display text-sm font-bold text-white group-hover:text-cosmos-cyan transition-colors">{pod.title}</h3>
                      <p className="text-xs text-green-400">{pod.author}</p>
                      <p className="text-xs text-white/40 mt-1 line-clamp-1">{pod.description}</p>
                      <p className="text-xs text-white/30 mt-1">{pod.episodeCount} episodes</p>
                    </div>
                  </div></CardContent></Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-cosmos-cyan" />
          </div>
        )}

        {/* Empty State */}
        {!loading && blogs.length === 0 && gallery.length === 0 && videos.length === 0 && docs.length === 0 && podcasts.length === 0 && (
          <div className="py-20 text-center">
            <Rocket className="mx-auto h-12 w-12 text-white/20" />
            <p className="mt-4 text-lg text-white/40">Your cosmic journal is empty</p>
            <p className="mt-2 text-sm text-white/30">Add content from the Admin Panel to see it here</p>
            <Link href="/blog/upload" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-cosmos-cyan hover:underline">
              Write your first post <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
