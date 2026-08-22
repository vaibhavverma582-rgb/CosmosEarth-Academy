"use client";

import Link from "next/link";
import { Play, Clock, Eye, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VideoCardProps {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  duration?: number;
  views: number;
  category: string;
  uploader: { id: string; name: string; avatar?: string };
  createdAt: string;
  progress?: number; // 0-100
  onDelete?: (id: string) => void;
  currentUserId?: string;
}

function formatDuration(seconds?: number): string {
  if (!seconds) return "0:00";
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

export function VideoCard({
  id,
  title,
  description,
  thumbnailUrl,
  duration,
  views,
  category,
  uploader,
  progress,
  onDelete,
  currentUserId,
}: VideoCardProps) {
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this video?")) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/videos/${id}`,
        {
          method: "DELETE",
          headers: { "x-user-id": currentUserId || "" },
        }
      );
      if (res.ok) onDelete?.(id);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };
  return (
    <Link href={`/videos/${id}`}>
      <Card className="group h-full overflow-hidden transition-all hover:border-white/20">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-white/5">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-cosmos-navy-light to-cosmos-navy">
              <Play className="h-12 w-12 text-white/20" />
            </div>
          )}

          {/* Duration badge */}
          {duration && (
            <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
              {formatDuration(duration)}
            </div>
          )}

          {/* Delete button */}
          {currentUserId && (
            <button
              onClick={handleDelete}
              className="absolute top-2 right-2 z-10 rounded-full bg-black/60 p-1.5 text-white/50 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-500/30 hover:text-red-400"
              title="Delete video"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cosmos-cyan/90 shadow-lg">
              <Play className="h-6 w-6 text-white ml-0.5" fill="white" />
            </div>
          </div>

          {/* Progress bar */}
          {progress !== undefined && progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
              <div
                className="h-full bg-cosmos-cyan"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white/60">
              {uploader.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white group-hover:text-cosmos-cyan transition-colors line-clamp-2">
                {title}
              </h3>
              <p className="mt-1 text-xs text-white/40">{uploader.name}</p>
              <div className="mt-1.5 flex items-center gap-3 text-xs text-white/30">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {formatViews(views)}
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {category}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
