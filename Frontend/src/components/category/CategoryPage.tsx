"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText, Video, BookOpen, Headphones, Images, Search, Loader2,
  ArrowRight, ExternalLink, FileStack, Tag, Calendar, ShoppingCart, Brain,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const contentTabs = [
  { key: "blog", label: "Blogs", icon: FileText, color: "text-cyan-400" },
  { key: "video", label: "Videos", icon: Video, color: "text-red-400" },
  { key: "book", label: "Books", icon: BookOpen, color: "text-emerald-400" },
  { key: "paper", label: "Research Papers", icon: FileStack, color: "text-orange-400" },
  { key: "podcast", label: "Podcasts", icon: Headphones, color: "text-pink-400" },
  { key: "gallery", label: "Images", icon: Images, color: "text-amber-400" },
  { key: "quiz", label: "Quizzes", icon: Brain, color: "text-purple-400" },
  { key: "store", label: "Study Materials", icon: ShoppingCart, color: "text-cyan-400" },
];

interface CategoryPageProps {
  category: string;
  icon: any;
  accentColor: string;
  glowColor: string;
  heroTitle: string;
  heroDescription: string;
}

export default function CategoryPage({
  category,
  icon: HeroIcon,
  accentColor,
  glowColor,
  heroTitle,
  heroDescription,
}: CategoryPageProps) {
  const [activeTab, setActiveTab] = useState("blog");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchContent(); }, [activeTab]);

  const fetchContent = async () => {
    setLoading(true);
    setSearch("");
    try {
      let url = "";
      switch (activeTab) {
        case "blog": url = `${API_URL}/api/blog?category=${category}&limit=20`; break;
        case "video": url = `${API_URL}/api/videos?category=${category}&limit=20`; break;

        case "book": url = `${API_URL}/api/books?category=${category}&limit=20`; break;
        case "paper": url = `${API_URL}/api/research-papers?category=${category}&limit=20`; break;
        case "podcast": url = `${API_URL}/api/podcasts?category=${category}&limit=20`; break;
        case "gallery": url = `${API_URL}/api/gallery?category=${category}&limit=20`; break;
        case "quiz": url = `${API_URL}/api/quizzes?category=${category}&limit=20`; break;
        case "store": url = `${API_URL}/api/store?category=${category}&limit=20`; break;
      }
      if (url) {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setItems(data.data || []);
        }
      }
    } catch {} finally { setLoading(false); }
  };

  const filtered = items.filter((i) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (i.title || "").toLowerCase().includes(term) ||
      (i.description || i.excerpt || i.abstract || "").toLowerCase().includes(term) ||
      (typeof i.author === 'string' ? i.author : i.author?.name || "").toLowerCase().includes(term) ||
      (i.tags || "").toLowerCase().includes(term);
  });

  return (
    <div className="min-h-screen pt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="relative mb-10 text-center">
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 h-[200px] w-[400px] rounded-full ${glowColor} opacity-8 blur-3xl`} />
          <div className="relative">
            <Badge variant="outline" className="mb-3">
              <HeroIcon className="mr-1 h-3 w-3" />
              Earth &amp; Space Science
            </Badge>
            <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
              <span className={accentColor}>{heroTitle}</span>
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/35">
              {heroDescription}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${heroTitle.toLowerCase()} content...`}
            className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/25 focus:border-cyan-500/30 focus:outline-none"
          />
        </div>

        {/* Content Tabs */}
        <div className="mb-7 flex flex-wrap gap-1.5">
          {contentTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                  : "bg-white/[0.03] text-white/35 hover:text-white/55 border border-transparent"
              }`}
            >
              <tab.icon className="h-3 w-3" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-14">
            <Loader2 className="h-5 w-5 animate-spin text-cyan-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="admin-stat-card p-14 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-white/[0.03]">
              <HeroIcon className="h-7 w-7 text-white/15" />
            </div>
            <h3 className="text-base font-semibold text-white/30 mb-1">No content yet</h3>
            <p className="text-xs text-white/20">
              No {contentTabs.find((t) => t.key === activeTab)?.label.toLowerCase()} in {heroTitle} have been added yet.
            </p>
          </div>
        ) : (
          <div className={
            activeTab === "gallery"
              ? "grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4"
              : activeTab === "video"
              ? "grid gap-4 sm:grid-cols-2"
              : "grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          }>
            {filtered.map((item) => (
              <ContentCard key={item.id} item={item} type={activeTab} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ContentCard({ item, type }: { item: any; type: string }) {
  // Gallery grid cards
  if (type === "gallery") {
    return (
      <div className="group relative overflow-hidden rounded-xl aspect-square">
        <img src={`${API_URL}${item.imageUrl}`} alt={item.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
          <p className="text-[11px] font-medium text-white">{item.title}</p>
        </div>
      </div>
    );
  }

  // Video cards
  if (type === "video") {
    return (
      <Link href={`/videos/${item.id}`}>
        <Card className="group h-full">
          <div className="relative overflow-hidden rounded-t-xl">
            <img src={item.thumbnailUrl || `https://img.youtube.com/vi/${item.youtubeId}/mqdefault.jpg`} alt={item.title} className="h-36 w-full object-cover transition-transform group-hover:scale-105" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600/90">
                <Video className="h-3.5 w-3.5 text-white ml-0.5" fill="white" />
              </div>
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">{item.title}</h3>
            <p className="text-[11px] text-white/35 mt-1">{item.views || 0} views</p>
          </CardContent>
        </Card>
      </Link>
    );
  }

  // Blog cards
  if (type === "blog") {
    return (
      <Link href={`/blog/${item.slug}`}>
        <Card className="group h-full">
          <CardContent className="p-4">
            {item.coverImage && (
              <div className="mb-3 overflow-hidden rounded-lg">
                <img src={`${API_URL}${item.coverImage}`} alt={item.title} className="h-32 w-full object-cover transition-transform group-hover:scale-105" />
              </div>
            )}
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-[10px]">{item.category}</Badge>
              {item.readTime && <span className="text-[10px] text-white/25">{item.readTime}</span>}
            </div>
            <h3 className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition-colors mb-1 line-clamp-2">{item.title}</h3>
            <p className="text-[11px] text-white/35 line-clamp-2">{item.excerpt}</p>
            <div className="mt-2 flex items-center gap-1 text-[10px] text-white/25">
              <Calendar className="h-3 w-3" />
              {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  // Podcast cards
  if (type === "podcast") {
    return (
      <Link href={`/podcasts/${item.slug}`}>
        <Card className="group h-full">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-base">
                🎙️
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">{item.title}</h3>
                <p className="text-[11px] text-emerald-400/70">{typeof item.author === 'string' ? item.author : item.author?.name}</p>
                <p className="text-[11px] text-white/35 mt-1 line-clamp-1">{item.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  // Book cards
  if (type === "book") {
    return (
      <Card className="group h-full">
        <CardContent className="p-4">
          {item.coverImage && (
            <div className="mb-3 overflow-hidden rounded-lg bg-white/[0.02] flex items-center justify-center">
              <img src={`${API_URL}${item.coverImage}`} alt={item.title} className="w-full max-h-48 object-contain" />
            </div>
          )}
          <h3 className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">{item.title}</h3>
          {item.author && <p className="text-[11px] text-white/35 mt-1">by {typeof item.author === 'string' ? item.author : item.author?.name}</p>}
          {item.description && <p className="text-[11px] text-white/25 mt-1 line-clamp-2">{item.description}</p>}
          <div className="mt-2 flex items-center gap-2">
            {item.isFree !== false || item.price === 0 ? (
              <Badge className="text-[10px] bg-emerald-500/15 text-emerald-400 border-emerald-500/20">Free</Badge>
            ) : (
              <Badge className="text-[10px] bg-orange-500/15 text-orange-400 border-orange-500/20">₹{item.salePrice || item.price}</Badge>
            )}
            {item.type && <Badge variant="outline" className="text-[10px]">{item.type}</Badge>}
          </div>
          {item.fileUrl && (
            <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300">
              <FileStack className="h-3 w-3" /> Open File
            </a>
          )}
          {item.externalLink && item.externalLink.startsWith("http") && (
            <a href={item.externalLink} target="_blank" rel="noopener noreferrer" className="mt-2 ml-2 inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300">
              <ExternalLink className="h-3 w-3" /> External Link
            </a>
          )}
        </CardContent>
      </Card>
    );
  }

  // Quiz cards
  if (type === "quiz") {
    return (
      <Link href={`/quizzes/${item.slug}`}>
        <Card className="group h-full">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-400/10">
                <Brain className="h-4 w-4 text-purple-400" />
              </div>
              <Badge variant="outline" className={`text-[10px] ${item.difficulty === 'easy' ? 'text-green-400 border-green-500/20' : item.difficulty === 'hard' ? 'text-red-400 border-red-500/20' : 'text-orange-400 border-orange-500/20'}`}>{item.difficulty}</Badge>
            </div>
            <h3 className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">{item.title}</h3>
            {item.description && <p className="text-[11px] text-white/25 mt-1 line-clamp-2">{item.description}</p>}
            <div className="mt-2 flex items-center gap-3 text-[11px] text-white/30">
              <span>{item._count?.questions || 0} questions</span>
              <span>{item._count?.attempts || 0} attempts</span>
            </div>
            <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-cyan-400">
              Take Quiz →
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  // Store cards — link to purchase page
  if (type === "store") {
    return (
      <Link href={`/store/${item.id}`}>
        <Card className="group h-full">
          <CardContent className="p-4">
            {item.coverImage && (
              <div className="mb-3 overflow-hidden rounded-lg bg-white/[0.02] flex items-center justify-center">
                <img src={`${API_URL}${item.coverImage}`} alt={item.title} className="w-full max-h-48 object-contain transition-transform group-hover:scale-105" />
              </div>
            )}
            <h3 className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">{item.title}</h3>
            {item.description && <p className="text-[11px] text-white/25 mt-1 line-clamp-2">{item.description}</p>}
            <div className="mt-2 flex items-center gap-2">
              {item.isFree || item.price === 0 ? (
                <Badge className="text-[10px] bg-emerald-500/15 text-emerald-400 border-emerald-500/20">Free</Badge>
              ) : (
                <Badge className="text-[10px] bg-orange-500/15 text-orange-400 border-orange-500/20">₹{item.salePrice || item.price}</Badge>
              )}
              {item.type && <Badge variant="outline" className="text-[10px]">{item.type}</Badge>}
            </div>
            <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-cyan-400">
              {item.isFree || item.price === 0 ? "Open Material →" : "View Details →"}
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  // Research Paper cards
  if (type === "paper") {
    return (
      <Card className="group h-full">
        <CardContent className="p-4">
          {item.coverImage && (
            <div className="mb-3 overflow-hidden rounded-lg bg-white/[0.02] flex items-center justify-center">
              <img src={`${API_URL}${item.coverImage}`} alt="" className="w-full max-h-48 object-contain" />
            </div>
          )}
          <h3 className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">{item.title}</h3>
          <p className="text-[11px] text-cyan-400/70 mt-1">{item.authors}</p>
          {item.abstract && <p className="text-[11px] text-white/30 mt-1 line-clamp-3">{item.abstract}</p>}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {item.journal && <Badge variant="outline" className="text-[10px]">{item.journal}</Badge>}
            {item.publicationYear && <span className="text-[10px] text-white/25">{item.publicationYear}</span>}
            {item.doi && <span className="text-[10px] text-white/20">DOI: {item.doi}</span>}
          </div>
          {item.fileUrl && (
            <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300">
              <FileStack className="h-3 w-3" /> Open PDF
            </a>
          )}
          {item.externalLink && item.externalLink.startsWith("http") && (
            <a href={item.externalLink} target="_blank" rel="noopener noreferrer" className="mt-2 ml-2 inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300">
              <ExternalLink className="h-3 w-3" /> View Paper
            </a>
          )}
        </CardContent>
      </Card>
    );
  }

  // Notes cards
  if (type === "note") {
    return (
      <Link href={`/notes/${item.id}`}>
        <Card className="group h-full">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Tag className="h-3 w-3 text-purple-400" />
              <span className="text-[11px] text-white/35">{item.subject || item.mediaCategory}</span>
            </div>
            <h3 className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">{item.title}</h3>
            {item.topic && <p className="text-[11px] text-white/35 mt-1">{item.topic}</p>}
            {item.description && <p className="text-[11px] text-white/25 mt-1 line-clamp-2">{item.description}</p>}
          </CardContent>
        </Card>
      </Link>
    );
  }

  // Default card
  return (
    <Card className="group h-full">
      <CardContent className="p-4">
        <h3 className="font-display text-sm font-bold text-white">{item.title}</h3>
        {item.description && <p className="text-[11px] text-white/35 mt-1 line-clamp-2">{item.description}</p>}
      </CardContent>
    </Card>
  );
}
