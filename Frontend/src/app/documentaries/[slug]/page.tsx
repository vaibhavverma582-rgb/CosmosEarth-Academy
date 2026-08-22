"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  Clock,
  Calendar,
  User,
  BookmarkPlus,
  BookmarkCheck,
  ExternalLink,
  Loader2,
  Play,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DocDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  posterUrl?: string;
  trailerUrl?: string;
  duration?: string;
  year?: number;
  director?: string;
  rating?: number;
  category: string;
  tags?: string;
  featured: boolean;
  uploader: { name: string };
  createdAt: string;
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) { const m = url.match(p); if (m) return m[1]; }
  return null;
}

export default function DocumentaryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { data: session } = useSession();
  const [doc, setDoc] = useState<DocDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/documentaries/${slug}`
        );
        if (res.ok) {
          const data = await res.json();
          setDoc(data.data);

          if (session) {
            const wlRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/documentaries/${data.data.id}/watchlist/check`,
              { headers: { "x-user-id": session.user.id } }
            );
            const wlData = await wlRes.json();
            setInWatchlist(wlData.inWatchlist);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [slug, session]);

  const toggleWatchlist = async () => {
    if (!session || !doc) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/documentaries/${doc.id}/watchlist`,
        { method: "POST", headers: { "Content-Type": "application/json", "x-user-id": session.user.id } }
      );
      const data = await res.json();
      setInWatchlist(data.inWatchlist);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className="flex min-h-[70vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-cosmos-cyan" /></div>;
  }

  if (!doc) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-white/40">Documentary not found</p>
          <Link href="/documentaries"><Button variant="ghost" className="mt-4"><ArrowLeft className="h-4 w-4" /> Back</Button></Link>
        </div>
      </div>
    );
  }

  const trailerId = doc.trailerUrl ? extractYouTubeId(doc.trailerUrl) : null;
  const tags = doc.tags ? doc.tags.split(",").map((t) => t.trim()) : [];

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero banner */}
      <div className="relative h-[50vh] min-h-[400px]">
        {doc.posterUrl ? (
          <img src={doc.posterUrl} alt={doc.title} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-cosmos-navy to-cosmos-navy-light" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-cosmos-navy via-cosmos-navy/60 to-transparent" />

        <div className="relative mx-auto flex h-full max-w-7xl items-end px-4 pb-8 sm:px-6 lg:px-8">
          <Link href="/documentaries" className="absolute top-4 left-4 sm:left-6 lg:left-8">
            <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /> Back</Button>
          </Link>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
            {doc.posterUrl && (
              <div className="hidden sm:block shrink-0">
                <img src={doc.posterUrl} alt={doc.title} className="h-48 w-32 rounded-xl object-cover shadow-2xl ring-2 ring-white/10" />
              </div>
            )}
            <div>
              <Badge variant="outline" className="mb-2">{doc.category}</Badge>
              <h1 className="font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">{doc.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/60">
                {doc.year && <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{doc.year}</span>}
                {doc.duration && <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{doc.duration}</span>}
                {doc.rating && <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-cosmos-gold text-cosmos-gold" />{doc.rating}/10</span>}
                {doc.director && <span className="flex items-center gap-1"><User className="h-4 w-4" />{doc.director}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-4">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Actions */}
            <div className="flex flex-wrap gap-3 mb-6">
              {session && (
                <Button onClick={toggleWatchlist} variant={inWatchlist ? "default" : "outline"}>
                  {inWatchlist ? <BookmarkCheck className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
                  {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
                </Button>
              )}
              <Button variant="ghost" onClick={() => navigator.clipboard.writeText(window.location.href)}>
                <Share2 className="h-4 w-4" /> Share
              </Button>
            </div>

            {/* Description */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="font-display text-lg font-bold text-white mb-3">About</h2>
                <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">{doc.description}</p>
                {tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tags.map((tag) => <Badge key={tag} variant="outline" className="text-xs">#{tag}</Badge>)}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Trailer */}
            {trailerId && (
              <div className="mb-8">
                <h2 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Play className="h-5 w-5 text-cosmos-orange" fill="currentColor" /> Trailer
                </h2>
                <div className="overflow-hidden rounded-2xl border border-white/10">
                  <div className="relative aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${trailerId}?rel=0`}
                      title={`${doc.title} trailer`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Category</span>
                  <Badge variant="outline" className="text-xs">{doc.category}</Badge>
                </div>
                {doc.director && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Director</span>
                    <span className="text-white/60">{doc.director}</span>
                  </div>
                )}
                {doc.year && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Year</span>
                    <span className="text-white/60">{doc.year}</span>
                  </div>
                )}
                {doc.duration && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Duration</span>
                    <span className="text-white/60">{doc.duration}</span>
                  </div>
                )}
                {doc.rating && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Rating</span>
                    <span className="flex items-center gap-1 text-cosmos-gold"><Star className="h-3 w-3 fill-cosmos-gold" />{doc.rating}/10</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Added by</span>
                  <span className="text-white/60">{doc.uploader.name}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
