"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Headphones,
  Search,
  Heart,
  Plus,
  Loader2,
  Users,
  Mic,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Podcast {
  id: string;
  title: string;
  slug: string;
  description: string;
  author: string;
  coverUrl?: string;
  category: string;
  episodeCount: number;
  featured: boolean;
  creator?: { id: string; name: string };
  _count: { episodes: number };
}

const categories = ["All", "Astronomy", "Geology", "Space", "Physics", "Science News", "Interviews", "General"];

export default function PodcastsPage() {
  const { data: session } = useSession();
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this podcast?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/podcasts/${id}`,
        {
          method: "DELETE",
          headers: { "x-user-id": session!.user.id },
        }
      );
      if (res.ok) {
        setPodcasts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const fetchPodcasts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (selectedCategory !== "All") params.set("category", selectedCategory);

      let url: string;
      if (activeTab === "favorites" && session) {
        url = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/podcasts/user/favorites`;
      } else {
        url = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/podcasts?${params}`;
      }

      const headers: Record<string, string> = {};
      if (activeTab === "favorites" && session) headers["x-user-id"] = session.user.id;

      const res = await fetch(url, { headers });
      const data = await res.json();
      setPodcasts(data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPodcasts(); }, [searchQuery, selectedCategory, activeTab, session]);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
              <span className="gradient-text-cyan">Podcasts</span>
            </h1>
            <p className="mt-2 text-white/50">
              Audio explorations of science and the cosmos
            </p>
          </div>
          {session && (
            <Link href="/podcasts/upload">
              <Button><Plus className="h-4 w-4" /> Add Podcast</Button>
            </Link>
          )}
        </div>

        {/* Tabs + Search + Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {session && (
              <div className="flex gap-1 rounded-lg bg-white/5 p-1 w-fit">
                <button onClick={() => setActiveTab("all")}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${activeTab === "all" ? "bg-cosmos-cyan/20 text-cosmos-cyan" : "text-white/50 hover:text-white/70"}`}>
                  <Headphones className="inline h-4 w-4 mr-1.5" /> All Shows
                </button>
                <button onClick={() => setActiveTab("favorites")}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${activeTab === "favorites" ? "bg-cosmos-purple/20 text-cosmos-purple" : "text-white/50 hover:text-white/70"}`}>
                  <Heart className="inline h-4 w-4 mr-1.5" /> Favorites
                </button>
              </div>
            )}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input type="text" placeholder="Search podcasts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-cosmos-cyan/50 focus:outline-none focus:ring-1 focus:ring-cosmos-cyan/30" />
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((c) => (
              <button key={c} onClick={() => setSelectedCategory(c)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  selectedCategory === c ? "bg-cosmos-cyan/20 text-cosmos-cyan border border-cosmos-cyan/30" : "bg-white/5 text-white/50 border border-transparent hover:bg-white/10"
                }`}>{c}</button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-cosmos-cyan" /></div>
        ) : podcasts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {podcasts.map((podcast) => (
              <div key={podcast.id} className="relative group/podcast">
              <Link href={`/podcasts/${podcast.slug}`}>
                <Card className="group h-full overflow-hidden">
                  <div className="relative aspect-square bg-white/5">
                    {podcast.coverUrl ? (
                      <img src={podcast.coverUrl} alt={podcast.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-cosmos-purple/20 to-cosmos-navy">
                        <Mic className="h-16 w-16 text-white/10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <CardContent className="p-4">
                    <Badge variant="outline" className="mb-2 text-[10px]">{podcast.category}</Badge>
                    <h3 className="text-sm font-bold text-white group-hover:text-cosmos-cyan transition-colors line-clamp-1">{podcast.title}</h3>
                    <p className="mt-0.5 text-xs text-white/40">{podcast.author}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-white/30">
                      <span className="flex items-center gap-1"><Headphones className="h-3 w-3" />{_count(podcast)} episodes</span>
                      {session && (
                        <button
                          onClick={(e) => handleDelete(e, podcast.id)}
                          disabled={deletingId === podcast.id}
                          className="rounded-lg p-1 transition-colors hover:bg-red-500/10 opacity-0 group-hover/podcast:opacity-100"
                          title="Delete podcast"
                        >
                          <Trash2 className={`h-3 w-3 ${deletingId === podcast.id ? "text-red-300 animate-pulse" : "text-white/30 hover:text-red-400"}`} />
                        </button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <Headphones className="mx-auto h-12 w-12 text-white/20" />
            <p className="mt-4 text-lg text-white/40">{activeTab === "favorites" ? "No favorite podcasts yet" : "No podcasts found"}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function _count(podcast: any): number {
  return podcast._count?.episodes || podcast.episodeCount || 0;
}
