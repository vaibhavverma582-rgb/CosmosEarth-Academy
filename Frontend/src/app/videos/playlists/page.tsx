"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ListVideo, Play, Loader2, Clock, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PlaylistItem {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  creator: { name: string; avatar?: string };
  items: { video: { id: string; title: string; thumbnailUrl?: string; duration?: number } }[];
  createdAt: string;
}

function formatDuration(seconds?: number): string {
  if (!seconds) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/videos/playlists/all`
        );
        const data = await res.json();
        setPlaylists(data.data || []);
      } catch (error) {
        console.error("Failed to fetch playlists:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, []);

  const totalDuration = (items: PlaylistItem["items"]) =>
    items.reduce((acc, item) => acc + (item.video.duration || 0), 0);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href="/videos" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Videos
        </Link>
        <h1 className="font-display text-3xl font-bold text-white sm:text-4xl mb-8">
          <span className="gradient-text-cyan">Playlists</span>
        </h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-cosmos-cyan" />
          </div>
        ) : playlists.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {playlists.map((playlist) => (
              <Card key={playlist.id} className="group overflow-hidden">
                {/* Thumbnail collage */}
                <div className="relative aspect-video bg-white/5">
                  {playlist.items.length > 0 ? (
                    <div className="grid h-full grid-cols-2 grid-rows-2 gap-0.5">
                      {playlist.items.slice(0, 4).map((item, i) => (
                        <div key={item.video.id} className="relative overflow-hidden">
                          {item.video.thumbnailUrl ? (
                            <img src={item.video.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-cosmos-navy-light">
                              <Play className="h-6 w-6 text-white/20" />
                            </div>
                          )}
                        </div>
                      ))}
                      {playlist.items.length < 4 &&
                        Array.from({ length: 4 - playlist.items.length }).map((_, i) => (
                          <div key={`empty-${i}`} className="flex items-center justify-center bg-cosmos-navy-light">
                            <Play className="h-6 w-6 text-white/10" />
                          </div>
                        ))
                      }
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ListVideo className="h-12 w-12 text-white/20" />
                    </div>
                  )}

                  <div className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-1 text-xs text-white">
                    {playlist.items.length} videos · {formatDuration(totalDuration(playlist.items))}
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-display text-base font-bold text-white group-hover:text-cosmos-cyan transition-colors line-clamp-1">
                    {playlist.title}
                  </h3>
                  {playlist.description && (
                    <p className="mt-1 text-xs text-white/40 line-clamp-2">{playlist.description}</p>
                  )}
                  <div className="mt-3 flex items-center gap-2 text-xs text-white/30">
                    <User className="h-3 w-3" />
                    <span>{playlist.creator.name}</span>
                    <span>·</span>
                    <Clock className="h-3 w-3" />
                    <span>{new Date(playlist.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <ListVideo className="mx-auto h-12 w-12 text-white/20" />
            <p className="mt-4 text-lg text-white/40">No playlists yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
