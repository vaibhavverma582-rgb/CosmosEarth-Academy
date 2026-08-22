"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Calendar, ArrowRight, Tag, BookOpen, Loader2, Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readTime: string;
  coverImage?: string | null;
  createdAt: string;
  author: { id: string; name: string; avatar?: string; image?: string };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function BlogPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/blog?limit=50`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data.data || []);
        }
      } catch {
        // API unavailable — show empty state
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this post?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`${API_URL}/api/blog/${id}`, {
        method: "DELETE",
        headers: { "x-user-id": session!.user.id },
      });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex items-start justify-between">
          <div>
            <Badge variant="outline" className="mb-4">
              <BookOpen className="mr-1 h-3 w-3" />
              Blog
            </Badge>
            <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
              Blog <span className="gradient-text-cyan">Articles</span>
            </h1>
            <p className="mt-4 text-lg text-white/50">
              Thoughts on space, science, and the patterns we find in the cosmos.
            </p>
          </div>
          {session && (
            <Link href="/blog/upload">
              <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cosmos-cyan to-cosmos-purple px-4 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-cosmos-sm mt-14">
                <Plus className="h-4 w-4" />
                New Post
              </button>
            </Link>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-cosmos-cyan" />
          </div>
        )}

        {/* Posts */}
        {!loading && (
          <div className="space-y-6">
            {posts.map((post, i) => (
              <div key={post.id} className="relative group/post">
              <Link href={`/blog/${post.slug}`}>
                <Card className="group cursor-pointer" style={{ animationDelay: `${i * 0.05}s` }}>
                  <CardContent className="p-6 sm:p-8">
                    {post.coverImage && (
                      <div className="mb-4 overflow-hidden rounded-xl">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="outline" className="text-xs">
                        <Tag className="mr-1 h-3 w-3" />
                        {post.category}
                      </Badge>
                      <span className="text-xs text-white/30">{post.readTime}</span>
                    </div>
                    <h2 className="font-display text-xl font-bold text-white group-hover:text-cosmos-cyan transition-colors mb-3">
                      {post.title}
                    </h2>
                    <p className="text-sm text-white/50 leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs text-white/30">
                        <Calendar className="h-3 w-3" />
                        {formatDate(post.createdAt)}
                      </span>
                      <div className="flex items-center gap-2">
                        {session && (
                          <button
                            onClick={(e) => handleDelete(e, post.id)}
                            disabled={deletingId === post.id}
                            className="rounded-lg p-1.5 transition-colors hover:bg-red-500/10 opacity-0 group-hover/post:opacity-100"
                            title="Delete post"
                          >
                            <Trash2 className={`h-3.5 w-3.5 ${deletingId === post.id ? "text-red-300 animate-pulse" : "text-white/30 hover:text-red-400"}`} />
                          </button>
                        )}
                        <span className="flex items-center gap-1 text-xs font-medium text-cosmos-cyan opacity-0 group-hover:opacity-100 transition-all">
                          Read more <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && posts.length === 0 && (
          <div className="py-20 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-white/20" />
            <p className="mt-4 text-white/40">No blog posts yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
