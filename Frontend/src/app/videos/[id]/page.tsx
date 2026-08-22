"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  Calendar,
  User,
  Loader2,
  Share2,
  ExternalLink,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { YouTubeEmbed } from "@/components/videos/YouTubeEmbed";

interface VideoDetail {
  id: string;
  title: string;
  description?: string;
  youtubeUrl: string;
  youtubeId: string;
  thumbnailUrl?: string;
  duration?: number;
  category: string;
  tags?: string;
  views: number;
  featured: boolean;
  uploader: { id: string; name: string; avatar?: string; bio?: string };
  createdAt: string;
}

function formatDuration(seconds?: number): string {
  if (!seconds) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatViews(views: number): string {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views.toString();
}

export default function VideoPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const videoId = resolvedParams.id;
  const { data: session } = useSession();
  const [video, setVideo] = useState<VideoDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/videos/${videoId}`
        );
        if (res.ok) {
          const data = await res.json();
          setVideo(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch video:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [videoId]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cosmos-cyan" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-white/40">Video not found</p>
          <Link href="/videos">
            <Button variant="ghost" className="mt-4">
              <ArrowLeft className="h-4 w-4" /> Back to Videos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const tags = video.tags ? video.tags.split(",").map((t) => t.trim()) : [];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/videos"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Videos
        </Link>

        {/* YouTube Embed */}
        <div className="mb-8">
          <YouTubeEmbed youtubeId={video.youtubeId} title={video.title} />
        </div>

        {/* Video Info */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline">{video.category}</Badge>
              {video.featured && <Badge variant="default">Featured</Badge>}
            </div>
            <h1 className="font-display text-2xl font-bold text-white sm:text-3xl mb-3">
              {video.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-white/40 mb-4">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" /> {formatViews(video.views)} views
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />{" "}
                {new Date(video.createdAt).toLocaleDateString()}
              </span>
              {video.duration && (
                <span className="flex items-center gap-1">
                  ⏱ {formatDuration(video.duration)}
                </span>
              )}
            </div>

            {video.description && (
              <Card className="mb-6">
                <CardContent className="p-5">
                  <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">
                    {video.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <ExternalLink className="h-4 w-4" />
                  Watch on YouTube
                </Button>
              </a>
              <Button
                variant="ghost"
                onClick={() => navigator.clipboard.writeText(window.location.href)}
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Author */}
            <Card className="mb-6">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cosmos-cyan to-cosmos-purple text-sm font-bold text-white">
                    {video.uploader.avatar ? (
                      <img
                        src={video.uploader.avatar}
                        alt={video.uploader.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      video.uploader.name?.charAt(0)?.toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {video.uploader.name}
                    </p>
                    {video.uploader.bio && (
                      <p className="text-xs text-white/40 line-clamp-2">
                        {video.uploader.bio}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardContent className="p-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Views</span>
                  <span className="text-white/60">{video.views.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Category</span>
                  <span className="text-white/60">{video.category}</span>
                </div>
                {video.duration && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Duration</span>
                    <span className="text-white/60">{formatDuration(video.duration)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Platform</span>
                  <span className="flex items-center gap-1 text-white/60">
                    <Play className="h-3 w-3 text-red-400" fill="currentColor" />
                    YouTube
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
