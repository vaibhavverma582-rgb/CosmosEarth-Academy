"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  LinkIcon,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  "Astronomy",
  "Geology",
  "Geography",
  "Current Affairs",
];

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function VideoUploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [tags, setTags] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const previewId = youtubeUrl ? extractYouTubeId(youtubeUrl) : null;

  if (status === "loading") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }
  if (status === "unauthenticated") {
    router.push("/auth/login");
    return null;
  }
  if (!session) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !youtubeUrl) {
      setError("Title and YouTube URL are required");
      return;
    }

    const youtubeId = extractYouTubeId(youtubeUrl);
    if (!youtubeId) {
      setError("Invalid YouTube URL");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/videos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": session.user.id,
          },
          body: JSON.stringify({
            title,
            description,
            youtubeUrl,
            category,
            tags: tags || undefined,
          }),
        }
      );

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to add video");
      }

      router.push("/videos");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/videos"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Videos
        </Link>
        <h1 className="font-display text-3xl font-bold text-white mb-2">
          <span className="gradient-text-cyan">Add</span> YouTube Video
        </h1>
        <p className="text-white/50 mb-8">
          Paste a YouTube link to add educational content to the library
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="p-6 space-y-6">
              {/* YouTube URL */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">
                  YouTube URL *
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <input
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                  />
                </div>
                {youtubeUrl && !previewId && (
                  <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Invalid YouTube URL
                  </p>
                )}
                {previewId && (
                  <p className="mt-1.5 text-xs text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Valid YouTube video detected
                  </p>
                )}
              </div>

              {/* Preview */}
              {previewId && (
                <div className="overflow-hidden rounded-xl border border-white/10">
                  <div className="relative aspect-video bg-black">
                    <img
                      src={`https://img.youtube.com/vi/${previewId}/maxresdefault.jpg`}
                      alt="Video thumbnail"
                      className="h-full w-full object-cover opacity-80"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${previewId}/hqdefault.jpg`;
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600/90 shadow-lg">
                        <Play className="h-7 w-7 text-white ml-0.5" fill="white" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Introduction to Black Holes — PBS Space Time"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="What is this video about? Why is it educational?"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 resize-none"
                />
              </div>

              {/* Category + Tags */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c} className="bg-cosmos-navy">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="comma-separated tags"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                  />
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting || !title || !youtubeUrl || !previewId}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Add Video
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
