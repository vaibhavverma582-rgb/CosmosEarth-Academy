"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Video,
  Search,
  Upload,
  Play,
  Clock,
  Loader2,
  ListVideo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VideoCard } from "@/components/videos/VideoCard";

interface VideoItem {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  category: string;
  views: number;
  featured: boolean;
  uploader: { id: string; name: string; avatar?: string };
  createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Category {
  name: string;
  count: number;
}

export default function VideosPage() {
  const { data: session } = useSession();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleDeleteVideo = (deletedId: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== deletedId));
  };

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (selectedCategory !== "All") params.set("category", selectedCategory);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/videos?${params}`
      );
      const data = await res.json();
      setVideos(data.data || []);
    } catch (error) {
      console.error("Failed to fetch videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/videos/categories`
      );
      const data = await res.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchVideos(); }, [searchQuery, selectedCategory]);

  const featuredVideos = videos.filter((v) => v.featured);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
              <span className="gradient-text-cyan">Video</span> Library
            </h1>
            <p className="mt-2 text-white/50">
              Educational videos on astronomy, geology, and space exploration
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/videos/playlists">
              <Button variant="outline">
                <ListVideo className="h-4 w-4" />
                Playlists
              </Button>
            </Link>
            {session && (
              <Link href="/videos/upload">
                <Button>
                  <Upload className="h-4 w-4" />
                  Upload Video
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Search + Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-cosmos-cyan/50 focus:outline-none focus:ring-1 focus:ring-cosmos-cyan/30"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                selectedCategory === "All"
                  ? "bg-cosmos-cyan/20 text-cosmos-cyan border border-cosmos-cyan/30"
                  : "bg-white/5 text-white/50 border border-transparent hover:bg-white/10"
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedCategory(c.name)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  selectedCategory === c.name
                    ? "bg-cosmos-cyan/20 text-cosmos-cyan border border-cosmos-cyan/30"
                    : "bg-white/5 text-white/50 border border-transparent hover:bg-white/10"
                }`}
              >
                {c.name} ({c.count})
              </button>
            ))}
          </div>
        </div>

        {/* Featured */}
        {featuredVideos.length > 0 && searchQuery === "" && selectedCategory === "All" && (
          <div className="mb-10">
            <h2 className="mb-4 font-display text-lg font-bold text-white flex items-center gap-2">
              <Play className="h-5 w-5 text-cosmos-cyan" />
              Featured
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredVideos.slice(0, 3).map((video) => (
                <VideoCard
                  key={video.id}
                  id={video.id}
                  title={video.title}
                  description={video.description}
                  thumbnailUrl={video.thumbnailUrl}
                  duration={video.duration}
                  views={video.views}
                  category={video.category}
                  uploader={video.uploader}
                  createdAt={video.createdAt}
                  onDelete={handleDeleteVideo}
                  currentUserId={session?.user?.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Videos */}
        <h2 className="mb-4 font-display text-lg font-bold text-white">
          {selectedCategory !== "All" ? selectedCategory : "All Videos"}
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-cosmos-cyan" />
          </div>
        ) : videos.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                id={video.id}
                title={video.title}
                description={video.description}
                thumbnailUrl={video.thumbnailUrl}
                duration={video.duration}
                views={video.views}
                category={video.category}
                uploader={video.uploader}
                createdAt={video.createdAt}
                onDelete={handleDeleteVideo}
                currentUserId={session?.user?.id}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <Video className="mx-auto h-12 w-12 text-white/20" />
            <p className="mt-4 text-lg text-white/40">No videos found</p>
          </div>
        )}
      </div>
    </div>
  );
}
