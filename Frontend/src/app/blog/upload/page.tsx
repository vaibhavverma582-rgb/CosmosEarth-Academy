"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  FileText,
  Upload,
  Eye,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const categories = [
  "Astronomy",
  "Geology",
  "Geography",
  "Current Affairs",
];

export default function BlogUploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Astronomy");
  const [readTime, setReadTime] = useState("5 min");
  const [coverImage, setCoverImage] = useState("");
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  // Upload cover image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_URL}/api/blog/upload`, {
        method: "POST",
        headers: { "x-user-id": session?.user?.id || "" },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setCoverImage(data.url);
      } else {
        const data = await res.json();
        setError(data.error || "Upload failed");
      }
    } catch {
      setError("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  // Submit blog post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!title || !slug || !excerpt || !content || !category) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/blog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": session?.user?.id || "",
        },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          category,
          readTime,
          coverImage: coverImage || null,
          published,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/blog"), 1500);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create post");
      }
    } catch {
      setError("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  // Auth check
  if (status === "loading") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-white/40">Sign in to create blog posts</p>
          <Link href="/auth/login">
            <Button className="mt-4">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
            <FileText className="h-8 w-8 text-green-400" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-2">Post Created!</h2>
          <p className="text-sm text-white/50">Redirecting to blog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <Link href="/blog" className="mb-8 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Blog
        </Link>

        {/* Header */}
        <div className="mb-8">
          <Badge variant="outline" className="mb-4">
            <FileText className="mr-1 h-3 w-3" />
            New Post
          </Badge>
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Create <span className="gradient-text-cyan">Blog Post</span>
          </h1>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Your blog post title"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">
                  URL Slug <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/30">/blog/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    placeholder="your-post-slug"
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white font-mono placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                    required
                  />
                </div>
              </div>

              {/* Category + Read Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c} className="bg-[#0a0e27]">{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">
                    Reading Time
                  </label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="5 min"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Excerpt */}
          <Card>
            <CardContent className="p-6">
              <label className="mb-1.5 block text-sm font-medium text-white/70">
                Short Description / Excerpt <span className="text-red-400">*</span>
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A brief summary of your blog post (shown in the listing)"
                rows={2}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 resize-none"
                required
              />
            </CardContent>
          </Card>

          {/* Cover Image */}
          <Card>
            <CardContent className="p-6">
              <label className="mb-1.5 block text-sm font-medium text-white/70">
                Cover Image
              </label>
              <div className="flex items-center gap-4">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/5 px-6 py-4 text-sm text-white/50 transition-colors hover:border-cyan-400/30 hover:bg-white/10">
                  <Upload className="h-4 w-4" />
                  {uploading ? "Uploading..." : "Upload Image"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                <span className="text-xs text-white/30">or paste URL:</span>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                />
              </div>
              {coverImage && (
                <div className="relative mt-4">
                  <img src={coverImage} alt="Preview" className="h-40 w-full rounded-xl object-cover" />
                  <button
                    type="button"
                    onClick={() => setCoverImage("")}
                    className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white/60 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardContent className="p-6">
              <label className="mb-1.5 block text-sm font-medium text-white/70">
                Full Article Content <span className="text-red-400">*</span>
              </label>
              <p className="mb-3 text-xs text-white/30">
                Supports markdown: # Heading, ## Subheading, **bold**, *italic*, - list, &gt; quote, ```code```
              </p>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="# Your Blog Title&#10;&#10;Write your article content here using markdown...&#10;&#10;## Section Heading&#10;&#10;Your paragraphs go here. You can use **bold** and *italic* formatting.&#10;&#10;- List item one&#10;- List item two&#10;&#10;> A blockquote for emphasis"
                rows={16}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white font-mono placeholder:text-white/20 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 resize-y leading-relaxed"
                required
              />
            </CardContent>
          </Card>

          {/* Publish Settings */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Publish immediately</p>
                  <p className="text-xs text-white/40">Uncheck to save as draft</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPublished(!published)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${published ? "bg-cyan-400" : "bg-white/20"}`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${published ? "left-[22px]" : "left-0.5"}`}
                  />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex items-center gap-4">
            <Button type="submit" size="lg" disabled={loading} className="gap-2">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              {published ? "Publish Post" : "Save as Draft"}
            </Button>
            <Link href="/blog">
              <Button type="button" variant="ghost" size="lg">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
