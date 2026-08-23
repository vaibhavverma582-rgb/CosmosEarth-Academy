"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Loader2,
  Share2,
  MessageCircle,
  ThumbsUp,
  Send,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  coverImage?: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author: { id: string; name: string; avatar?: string; image?: string; bio?: string };
}

interface BlogComment {
  id: string;
  content: string;
  likes: number;
  createdAt: string;
  displayName?: string;
  guestName?: string;
  user?: { id: string; name: string; avatar?: string; image?: string } | null;
  replies?: BlogComment[];
  _count?: { replies: number };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { data: session } = useSession();
  const [slug, setSlug] = useState<string>("");
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFound] = useState(false);

  // Comments state
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [guestName, setGuestName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [replyGuestName, setReplyGuestName] = useState("");
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    const fetchPost = async () => {
      try {
        const res = await fetch(`${API_URL}/api/blog/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data.data);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  // Fetch comments when post is loaded
  useEffect(() => {
    if (!post?.id) return;
    fetchComments();
  }, [post?.id]);

  const fetchComments = async () => {
    if (!post?.id) return;
    setCommentsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/blog/${post.id}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.data || []);
      }
    } catch {} finally {
      setCommentsLoading(false);
    }
  };

  // Submit a comment
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !post?.id) return;
    if (!session?.user?.id && !guestName.trim()) return;
    setSubmitting(true);
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (session?.user?.id) headers["x-user-id"] = session.user.id;
      const res = await fetch(`${API_URL}/api/blog/${post.id}/comments`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          content: newComment.trim(),
          guestName: session?.user?.id ? undefined : guestName.trim(),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setComments((prev) => [data.data, ...prev]);
        setNewComment("");
      }
    } catch {} finally {
      setSubmitting(false);
    }
  };

  // Submit a reply
  const handleReplySubmit = async (parentId: string) => {
    if (!replyContent.trim() || !post?.id) return;
    if (!session?.user?.id && !replyGuestName.trim()) return;
    setSubmitting(true);
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (session?.user?.id) headers["x-user-id"] = session.user.id;
      const res = await fetch(`${API_URL}/api/blog/${post.id}/comments`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          content: replyContent.trim(),
          parentId,
          guestName: session?.user?.id ? undefined : replyGuestName.trim(),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setComments((prev) =>
          prev.map((c) =>
            c.id === parentId
              ? { ...c, replies: [...(c.replies || []), data.data], _count: { replies: (c._count?.replies || 0) + 1 } }
              : c
          )
        );
        setReplyContent("");
        setReplyGuestName("");
        setReplyingTo(null);
      }
    } catch {} finally {
      setSubmitting(false);
    }
  };

  // Like a comment
  const handleLike = async (commentId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/blog/comments/${commentId}/like`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId ? { ...c, likes: data.likes } : c
          )
        );
      }
    } catch {}
  };

  // Delete a comment
  const handleDeleteComment = async (commentId: string, parentId?: string) => {
    if (!confirm("Delete this comment?")) return;
    try {
      const res = await fetch(`${API_URL}/api/blog/comments/${commentId}`, {
        method: "DELETE",
        headers: { "x-user-id": session?.user?.id || "" },
      });
      if (res.ok) {
        if (parentId) {
          setComments((prev) =>
            prev.map((c) =>
              c.id === parentId
                ? { ...c, replies: (c.replies || []).filter((r) => r.id !== commentId), _count: { replies: Math.max(0, (c._count?.replies || 1) - 1) } }
                : c
            )
          );
        } else {
          setComments((prev) => prev.filter((c) => c.id !== commentId));
        }
      }
    } catch {}
  };

  if (notFoundState) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-white/40">Blog post not found</p>
          <Link href="/blog">
            <Button variant="ghost" className="mt-4">
              <ArrowLeft className="h-4 w-4" /> Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!post) return null;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const formatTimeAgo = (dateStr: string) => {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return formatDate(dateStr);
  };

  // Simple markdown renderer
  const renderContent = (text: string) => {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeContent = "";

    lines.forEach((line, i) => {
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${i}`} className="my-4 overflow-x-auto rounded-xl bg-black/30 p-4 font-mono text-sm text-cyan-400">
              <code>{codeContent.trim()}</code>
            </pre>
          );
          codeContent = "";
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeContent += line + "\n";
        return;
      }

      if (line.startsWith("# "))
        elements.push(<h1 key={i} className="font-display text-3xl font-bold text-white mt-8 mb-4">{line.slice(2)}</h1>);
      else if (line.startsWith("## "))
        elements.push(<h2 key={i} className="font-display text-2xl font-bold text-white mt-6 mb-3">{line.slice(3)}</h2>);
      else if (line.startsWith("### "))
        elements.push(<h3 key={i} className="font-display text-xl font-bold text-white mt-5 mb-2">{line.slice(4)}</h3>);
      else if (line.startsWith("- ") || line.startsWith("* "))
        elements.push(<li key={i} className="text-white/60 ml-6 mb-1 list-disc">{line.slice(2)}</li>);
      else if (line.startsWith("> "))
        elements.push(
          <blockquote key={i} className="my-3 border-l-2 border-cyan-400/40 pl-4 text-white/50 italic">
            {line.slice(2)}
          </blockquote>
        );
      else if (line.trim() === "")
        elements.push(<div key={i} className="h-3" />);
      else
        elements.push(<p key={i} className="text-white/60 leading-relaxed mb-2">{line}</p>);
    });

    return elements;
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <Link href="/blog" className="mb-8 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Blog
        </Link>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-8 overflow-hidden rounded-2xl">
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-auto w-full object-cover"
            />
          </div>
        )}

        {/* Meta */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="text-xs">
            <Tag className="mr-1 h-3 w-3" />
            {post.category}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-white/30">
            <Clock className="h-3 w-3" />
            {post.readTime}
          </span>
          <span className="flex items-center gap-1 text-xs text-white/30">
            <Calendar className="h-3 w-3" />
            {formatDate(post.createdAt)}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl mb-4 leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="text-lg text-white/50 leading-relaxed mb-8">
          {post.excerpt}
        </p>

        {/* Author + Share */}
        <div className="mb-10 flex items-center justify-between border-y border-white/5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 text-sm font-bold text-white">
              {post.author.image ? (
                <img src={post.author.image} alt="" className="h-full w-full rounded-full object-cover" />
              ) : (
                post.author.name?.charAt(0)?.toUpperCase() || "A"
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{post.author.name}</p>
              {post.author.bio && <p className="text-xs text-white/40">{post.author.bio}</p>}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigator.clipboard.writeText(window.location.href)}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <Card>
          <CardContent className="p-6 sm:p-10">
            <div className="prose prose-invert prose-sm max-w-none">
              {renderContent(post.content)}
            </div>
          </CardContent>
        </Card>

        {/* ─── COMMENTS SECTION ─── */}
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle className="h-5 w-5 text-cyan-400" />
            <h2 className="font-display text-xl font-bold text-white">
              Comments ({comments.length})
            </h2>
          </div>

          {/* Add Comment Form — open to everyone */}
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 text-xs font-bold text-white">
                {session?.user?.image ? (
                  <img src={session.user.image} alt="" className="h-full w-full rounded-full object-cover" />
                ) : (
                  <span>{guestName ? guestName.charAt(0).toUpperCase() : (session?.user?.name as string)?.charAt(0)?.toUpperCase() || "?"}</span>
                )}
              </div>
              <div className="flex-1">
                {!session && (
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Your name"
                    className="mb-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                    required
                  />
                )}
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 resize-none"
                />
                <div className="mt-2 flex justify-end">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!newComment.trim() || (!session && !guestName.trim()) || submitting}
                    className="gap-1.5"
                  >
                    {submitting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          </form>

          {/* Comments List */}
          {commentsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
            </div>
          ) : comments.length === 0 ? (
            <div className="py-8 text-center">
              <MessageCircle className="mx-auto mb-3 h-8 w-8 text-white/10" />
              <p className="text-sm text-white/30">No comments yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="group">
                  <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-400/40 to-cyan-400/40 text-xs font-bold text-white">
                      {comment.user?.image ? (
                        <img src={comment.user.image} alt="" className="h-full w-full rounded-full object-cover" />
                      ) : (
                        (comment as any).displayName?.charAt(0)?.toUpperCase() || comment.user?.name?.charAt(0)?.toUpperCase() || "A"
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-white">{(comment as any).displayName || comment.user?.name || "Anonymous"}</span>
                        <span className="text-[10px] text-white/20">{formatTimeAgo(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <button
                          onClick={() => handleLike(comment.id)}
                          className="flex items-center gap-1 text-[11px] text-white/30 hover:text-cyan-300 transition-colors"
                        >
                          <ThumbsUp className="h-3 w-3" />
                          {comment.likes > 0 && comment.likes}
                        </button>
                        <button
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          className="text-[11px] text-white/30 hover:text-cyan-300 transition-colors"
                        >
                          Reply
                        </button>
                        {session?.user?.id && (session.user.id === comment.user?.id || (session.user as any).role === "admin") && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-[11px] text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-8 mt-2">
                      <button
                        onClick={() => setExpandedReplies((prev) => ({ ...prev, [comment.id]: !prev[comment.id] }))}
                        className="flex items-center gap-1 text-[11px] text-cyan-400/60 hover:text-cyan-300 transition-colors mb-2"
                      >
                        {expandedReplies[comment.id] ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
                      </button>
                      {expandedReplies[comment.id] && (
                        <div className="space-y-2">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="group flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-400/30 to-cyan-400/30 text-[10px] font-bold text-white">
                                {reply.user?.image ? (
                                  <img src={reply.user.image} alt="" className="h-full w-full rounded-full object-cover" />
                                ) : (
                                  (reply as any).displayName?.charAt(0)?.toUpperCase() || reply.user?.name?.charAt(0)?.toUpperCase() || "A"
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-semibold text-white">{(reply as any).displayName || reply.user?.name || "Anonymous"}</span>
                                  <span className="text-[10px] text-white/20">{formatTimeAgo(reply.createdAt)}</span>
                                </div>
                                <p className="text-xs text-white/60 leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                                <div className="mt-1 flex items-center gap-3">
                                  <button
                                    onClick={() => handleLike(reply.id)}
                                    className="flex items-center gap-1 text-[10px] text-white/30 hover:text-cyan-300 transition-colors"
                                  >
                                    <ThumbsUp className="h-2.5 w-2.5" />
                                    {reply.likes > 0 && reply.likes}
                                  </button>
                                  {session?.user?.id && (session.user.id === reply.user?.id || (session.user as any).role === "admin") && (
                                    <button
                                      onClick={() => handleDeleteComment(reply.id, comment.id)}
                                      className="text-[10px] text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                      <Trash2 className="h-2.5 w-2.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Reply Form */}
                  {replyingTo === comment.id && (
                    <div className="ml-8 mt-2 flex items-start gap-2">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 text-[10px] font-bold text-white">
                        {session?.user?.image ? (
                          <img src={session.user.image} alt="" className="h-full w-full rounded-full object-cover" />
                        ) : (
                          replyGuestName ? replyGuestName.charAt(0).toUpperCase() : (session?.user?.name as string)?.charAt(0)?.toUpperCase() || "?"
                        )}
                      </div>
                      <div className="flex-1">
                        {!session && (
                          <input
                            type="text"
                            value={replyGuestName}
                            onChange={(e) => setReplyGuestName(e.target.value)}
                            placeholder="Your name"
                            className="mb-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none"
                            required
                          />
                        )}
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder={`Reply to ${(comment as any).displayName || comment.user?.name || "Anonymous"}...`}
                          rows={2}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none resize-none"
                          autoFocus
                        />
                        <div className="mt-1.5 flex justify-end gap-2">
                          <button
                            onClick={() => { setReplyingTo(null); setReplyContent(""); setReplyGuestName(""); }}
                            className="text-[11px] text-white/30 hover:text-white/50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleReplySubmit(comment.id)}
                            disabled={!replyContent.trim() || (!session && !replyGuestName.trim()) || submitting}
                            className="flex items-center gap-1 rounded-lg bg-cyan-400/20 px-2.5 py-1 text-[11px] font-medium text-cyan-400 hover:bg-cyan-400/30 transition-colors disabled:opacity-50"
                          >
                            {submitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom nav */}
        <div className="mt-10">
          <Link href="/blog">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </article>
    </div>
  );
}
