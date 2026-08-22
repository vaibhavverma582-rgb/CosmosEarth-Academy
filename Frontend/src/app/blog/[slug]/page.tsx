"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Tag, User, Loader2, Share2 } from "lucide-react";
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string>("");
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFound] = useState(false);

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
        <Loader2 className="h-8 w-8 animate-spin text-cosmos-cyan" />
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
            <pre key={`code-${i}`} className="my-4 overflow-x-auto rounded-xl bg-black/30 p-4 font-mono text-sm text-cosmos-cyan">
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
          <blockquote key={i} className="my-3 border-l-2 border-cosmos-cyan/40 pl-4 text-white/50 italic">
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
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cosmos-cyan to-cosmos-purple text-sm font-bold text-white">
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
