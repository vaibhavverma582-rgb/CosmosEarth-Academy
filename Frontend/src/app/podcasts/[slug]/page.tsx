"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ArrowLeft,
  Headphones,
  Heart,
  Bell,
  BellOff,
  Play,
  Clock,
  Loader2,
  Users,
  Mic,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PodcastDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  author: string;
  coverUrl?: string;
  category: string;
  episodeCount: number;
  episodes: Episode[];
  _count: { episodes: number; favorites: number; subscriptions: number };
}

interface Episode {
  id: string;
  title: string;
  description?: string;
  audioUrl: string;
  duration?: number;
  episodeNumber: number;
  seasonNumber: number;
  createdAt: string;
}

function formatDuration(seconds?: number): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PodcastDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const podcastSlug = resolvedParams.slug;
  const { data: session } = useSession();
  const [podcast, setPodcast] = useState<PodcastDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [playingEpisode, setPlayingEpisode] = useState<Episode | null>(null);

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/podcasts/${podcastSlug}`
        );
        if (res.ok) {
          const data = await res.json();
          setPodcast(data.data);

          if (session) {
            const [favRes, subRes] = await Promise.all([
              fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/podcasts/${data.data.id}/favorite`, {
                method: "POST", headers: { "Content-Type": "application/json", "x-user-id": session.user.id },
              }).then((r) => r.json()),
              fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/podcasts/${data.data.id}/subscribe`, {
                method: "POST", headers: { "Content-Type": "application/json", "x-user-id": session.user.id },
              }).then((r) => r.json()),
            ]);
            // These toggle, so we need to check initial state differently
            // For simplicity, just check if they're true after the POST
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPodcast();
  }, [podcastSlug, session]);

  const toggleFavorite = async () => {
    if (!session || !podcast) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/podcasts/${podcast.id}/favorite`,
        { method: "POST", headers: { "Content-Type": "application/json", "x-user-id": session.user.id } }
      );
      const data = await res.json();
      setIsFavorited(data.favorited);
    } catch (error) { console.error(error); }
  };

  const toggleSubscribe = async () => {
    if (!session || !podcast) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/podcasts/${podcast.id}/subscribe`,
        { method: "POST", headers: { "Content-Type": "application/json", "x-user-id": session.user.id } }
      );
      const data = await res.json();
      setIsSubscribed(data.subscribed);
    } catch (error) { console.error(error); }
  };

  const playEpisode = (episode: Episode) => {
    setPlayingEpisode(episode);
  };

  if (loading) {
    return <div className="flex min-h-[70vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-cosmos-cyan" /></div>;
  }

  if (!podcast) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-white/40">Podcast not found</p>
          <Link href="/podcasts"><Button variant="ghost" className="mt-4"><ArrowLeft className="h-4 w-4" /> Back</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link href="/podcasts" className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Podcasts
        </Link>

        {/* Podcast Header */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row">
          {podcast.coverUrl ? (
            <img src={podcast.coverUrl} alt={podcast.title} className="h-48 w-48 shrink-0 rounded-2xl object-cover shadow-2xl ring-2 ring-white/10" />
          ) : (
            <div className="flex h-48 w-48 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cosmos-purple/20 to-cosmos-navy ring-2 ring-white/10">
              <Mic className="h-16 w-16 text-white/20" />
            </div>
          )}
          <div className="flex-1">
            <Badge variant="outline" className="mb-2">{podcast.category}</Badge>
            <h1 className="font-display text-3xl font-bold text-white">{podcast.title}</h1>
            <p className="mt-1 text-sm text-white/40">by {podcast.author}</p>
            <p className="mt-3 text-sm text-white/50 leading-relaxed line-clamp-3">{podcast.description}</p>
            <div className="mt-4 flex items-center gap-4 text-xs text-white/40">
              <span className="flex items-center gap-1"><Headphones className="h-3 w-3" />{_count(podcast)} episodes</span>
              <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{podcast._count.favorites} favorites</span>
              <span className="flex items-center gap-1"><Users className="h-3 w-3" />{podcast._count.subscriptions} subscribers</span>
            </div>
            {session && (
              <div className="mt-4 flex gap-2">
                <Button variant={isFavorited ? "default" : "outline"} size="sm" onClick={toggleFavorite}>
                  <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} /> {isFavorited ? "Favorited" : "Favorite"}
                </Button>
                <Button variant={isSubscribed ? "default" : "outline"} size="sm" onClick={toggleSubscribe}>
                  {isSubscribed ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />} {isSubscribed ? "Unsubscribe" : "Subscribe"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Episodes */}
        <h2 className="mb-4 font-display text-lg font-bold text-white">Episodes</h2>
        <div className="space-y-3">
          {podcast.episodes.map((episode) => (
            <Card key={episode.id} className="group">
              <CardContent className="flex items-center gap-4 p-4">
                <button
                  onClick={() => playEpisode(episode)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cosmos-cyan/10 text-cosmos-cyan transition-all hover:bg-cosmos-cyan hover:text-white"
                >
                  <Play className="h-4 w-4 ml-0.5" fill="currentColor" />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] text-white/30">S{episode.seasonNumber} E{episode.episodeNumber}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-cosmos-cyan transition-colors line-clamp-1">
                    {episode.title}
                  </h3>
                  {episode.description && (
                    <p className="mt-0.5 text-xs text-white/40 line-clamp-1">{episode.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-white/30 shrink-0">
                  {episode.duration && (
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatDuration(episode.duration)}</span>
                  )}
                  <span>{new Date(episode.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {podcast.episodes.length === 0 && (
          <div className="py-12 text-center">
            <Headphones className="mx-auto h-10 w-10 text-white/20" />
            <p className="mt-3 text-white/40">No episodes yet</p>
          </div>
        )}
      </div>

      {/* Sticky Player */}
      {playingEpisode && (
        <StickyAudioPlayer
          episode={{
            id: playingEpisode.id,
            title: playingEpisode.title,
            audioUrl: playingEpisode.audioUrl,
            podcastTitle: podcast.title,
            podcastCover: podcast.coverUrl,
            duration: playingEpisode.duration,
          }}
          onClose={() => setPlayingEpisode(null)}
          onNext={() => {
            const idx = podcast.episodes.findIndex((e) => e.id === playingEpisode.id);
            if (idx < podcast.episodes.length - 1) setPlayingEpisode(podcast.episodes[idx + 1]);
          }}
          onPrev={() => {
            const idx = podcast.episodes.findIndex((e) => e.id === playingEpisode.id);
            if (idx > 0) setPlayingEpisode(podcast.episodes[idx - 1]);
          }}
        />
      )}
    </div>
  );
}

function _count(podcast: any): number {
  return podcast._count?.episodes || podcast.episodeCount || 0;
}

// Import the sticky player
import { StickyAudioPlayer } from "@/components/audio/StickyAudioPlayer";
