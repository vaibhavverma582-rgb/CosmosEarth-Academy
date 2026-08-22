"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  ArrowRight,
  Tag,
  Newspaper,
  ExternalLink,
  FileText,
  Images,
  Video,
  Headphones,
  Film,
  BookOpen,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const MEDIA_CATEGORY = "Current Affairs";

interface BlogItem { id: string; title: string; slug: string; excerpt: string; category: string; readTime: string; coverImage?: string | null; createdAt: string; }
interface NoteItem { id: string; title: string; description?: string | null; subject: string; topic?: string | null; createdAt: string; }
interface GalleryItem { id: string; title: string; imageUrl: string; category: string; createdAt: string; }
interface VideoItem { id: string; title: string; youtubeUrl: string; youtubeId: string; thumbnailUrl?: string | null; category: string; views: number; createdAt: string; }
interface DocumentaryItem { id: string; title: string; slug: string; description: string; posterUrl?: string | null; category: string; year?: number | null; rating?: number | null; createdAt: string; }
interface PodcastItem { id: string; title: string; slug: string; description: string; author: string; coverUrl?: string | null; category: string; episodeCount: number; createdAt: string; }

export default function CurrentAffairsPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [docs, setDocs] = useState<DocumentaryItem[]>([]);
  const [podcasts, setPodcasts] = useState<PodcastItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [b, n, g, v, d, p] = await Promise.all([
          fetch(`${API_URL}/api/blog?category=${MEDIA_CATEGORY}&limit=4`).then(r => r.ok ? r.json() : { data: [] }),
          fetch(`${API_URL}/api/notes?subject=${MEDIA_CATEGORY}&limit=4`).then(r => r.ok ? r.json() : { data: [] }),
          fetch(`${API_URL}/api/gallery?category=${MEDIA_CATEGORY}&limit=6`).then(r => r.ok ? r.json() : { data: [] }),
          fetch(`${API_URL}/api/videos?category=${MEDIA_CATEGORY}&limit=4`).then(r => r.ok ? r.json() : { data: [] }),
          fetch(`${API_URL}/api/documentaries?category=${MEDIA_CATEGORY}&limit=4`).then(r => r.ok ? r.json() : { data: [] }),
          fetch(`${API_URL}/api/podcasts?category=${MEDIA_CATEGORY}&limit=4`).then(r => r.ok ? r.json() : { data: [] }),
        ]);
        setBlogs(b.data || []);
        setNotes(n.data || []);
        setGallery(g.data || []);
        setVideos(v.data || []);
        setDocs(d.data || []);
        setPodcasts(p.data || []);
      } catch { /* API unavailable */ }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative mb-16 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[300px] w-[600px] rounded-full bg-glow-purple opacity-15 blur-3xl" />
          <div className="relative">
            <Badge variant="outline" className="mb-4">
              <Newspaper className="mr-1 h-3 w-3" />
              Current Affairs
            </Badge>
            <h1 className="font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              <span className="gradient-text-cyan">Space &amp; Science</span>{" "}
              <span className="text-white">News</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/50">
              Latest discoveries, missions, and developments in space and earth science.
            </p>
          </div>
        </div>

        {/* ===== BLOG ARTICLES ===== */}
        {blogs.length > 0 && (
          <section className="mb-16">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2"><FileText className="h-5 w-5 text-cosmos-cyan" /><h2 className="font-display text-2xl font-bold text-white">Blog Articles</h2></div>
              <Link href="/blog" className="flex items-center gap-1 text-sm font-medium text-cosmos-cyan hover:underline">View all <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {blogs.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="group h-full">
                    <CardContent className="p-5">
                      {post.coverImage && <div className="mb-3 overflow-hidden rounded-xl"><img src={post.coverImage} alt={post.title} className="h-36 w-full object-cover transition-transform group-hover:scale-105" /></div>}
                      <div className="flex items-center gap-2 mb-2"><Badge variant="outline" className="text-xs">{post.category}</Badge><span className="text-xs text-white/30">{post.readTime}</span></div>
                      <h3 className="font-display text-base font-bold text-white group-hover:text-cosmos-cyan transition-colors mb-1">{post.title}</h3>
                      <p className="text-xs text-white/40 line-clamp-2">{post.excerpt}</p>
                      <div className="mt-2 flex items-center gap-1 text-xs text-white/30"><Calendar className="h-3 w-3" />{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ===== NOTES ===== */}
        {notes.length > 0 && (
          <section className="mb-16">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-cosmos-purple" /><h2 className="font-display text-2xl font-bold text-white">Notes</h2></div>
              <Link href="/notes" className="flex items-center gap-1 text-sm font-medium text-cosmos-cyan hover:underline">View all <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {notes.map((note) => (
                <Link key={note.id} href={`/notes/${note.id}`}>
                  <Card className="group h-full"><CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1"><Tag className="h-3 w-3 text-cosmos-purple" /><span className="text-xs text-white/40">{note.subject}</span></div>
                    <h3 className="font-display text-sm font-bold text-white group-hover:text-cosmos-cyan transition-colors">{note.title}</h3>
                    {note.topic && <p className="text-xs text-white/40 mt-1">{note.topic}</p>}
                  </CardContent></Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ===== GALLERY ===== */}
        {gallery.length > 0 && (
          <section className="mb-16">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2"><Images className="h-5 w-5 text-cosmos-orange" /><h2 className="font-display text-2xl font-bold text-white">Gallery</h2></div>
              <Link href="/gallery" className="flex items-center gap-1 text-sm font-medium text-cosmos-cyan hover:underline">View all <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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

        {/* ===== YOUTUBE VIDEOS ===== */}
        {videos.length > 0 && (
          <section className="mb-16">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2"><Video className="h-5 w-5 text-red-400" /><h2 className="font-display text-2xl font-bold text-white">YouTube Videos</h2></div>
              <Link href="/videos" className="flex items-center gap-1 text-sm font-medium text-cosmos-cyan hover:underline">View all <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
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

        {/* ===== DOCUMENTARIES ===== */}
        {docs.length > 0 && (
          <section className="mb-16">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2"><Film className="h-5 w-5 text-cosmos-gold" /><h2 className="font-display text-2xl font-bold text-white">Documentaries</h2></div>
              <Link href="/documentaries" className="flex items-center gap-1 text-sm font-medium text-cosmos-cyan hover:underline">View all <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {docs.map((doc) => (
                <Link key={doc.id} href={`/documentaries/${doc.slug}`}>
                  <Card className="group h-full"><CardContent className="p-4"><div className="flex gap-4">
                    {doc.posterUrl && <img src={doc.posterUrl} alt={doc.title} className="h-24 w-16 shrink-0 rounded-lg object-cover" />}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-sm font-bold text-white group-hover:text-cosmos-cyan transition-colors line-clamp-1">{doc.title}</h3>
                      <p className="text-xs text-white/40 line-clamp-2 mt-1">{doc.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-white/30">{doc.year && <span>{doc.year}</span>}{doc.rating && <span>⭐ {doc.rating}/10</span>}</div>
                    </div>
                  </div></CardContent></Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ===== PODCASTS ===== */}
        {podcasts.length > 0 && (
          <section className="mb-16">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2"><Headphones className="h-5 w-5 text-green-400" /><h2 className="font-display text-2xl font-bold text-white">Podcasts</h2></div>
              <Link href="/podcasts" className="flex items-center gap-1 text-sm font-medium text-cosmos-cyan hover:underline">View all <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {podcasts.map((pod) => (
                <Link key={pod.id} href={`/podcasts/${pod.slug}`}>
                  <Card className="group h-full"><CardContent className="p-4"><div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-cosmos-navy text-lg">🎙️</div>
                    <div className="min-w-0">
                      <h3 className="font-display text-sm font-bold text-white group-hover:text-cosmos-cyan transition-colors">{pod.title}</h3>
                      <p className="text-xs text-cosmos-cyan">{pod.author}</p>
                      <p className="text-xs text-white/40 mt-1 line-clamp-1">{pod.description}</p>
                      <p className="text-xs text-white/30 mt-1">{pod.episodeCount} episodes</p>
                    </div>
                  </div></CardContent></Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {!loading && blogs.length === 0 && notes.length === 0 && gallery.length === 0 && videos.length === 0 && docs.length === 0 && podcasts.length === 0 && (
          <div className="py-20 text-center">
            <Newspaper className="mx-auto h-12 w-12 text-white/20" />
            <p className="mt-4 text-white/40">No content yet. Add content from the Admin Panel to see it here.</p>
          </div>
        )}

        {loading && <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-cosmos-cyan" /></div>}
      </div>
    </div>
  );
}
