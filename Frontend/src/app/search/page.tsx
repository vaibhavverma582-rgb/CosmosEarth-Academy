"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, Search, FileText, Video, BookOpen, Headphones, Images, FileStack, ShoppingCart, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const typeIcons: Record<string, any> = {
  blogs: FileText,
  videos: Video,
  books: FileStack,
  researchPapers: FileStack,
  podcasts: Headphones,
  gallery: Images,
  storeProducts: ShoppingCart,
};

const typeLabels: Record<string, string> = {
  blogs: "Blogs",
  videos: "Videos",
  books: "Books",
  researchPapers: "Research Papers",
  podcasts: "Podcasts",
  gallery: "Images",
  storeProducts: "Study Materials",
};

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Record<string, any[]>>({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) doSearch(initialQuery);
  }, []);

  const doSearch = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || {});
        setTotal(data.totalResults || 0);
      }
    } catch {} finally { setLoading(false); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(query);
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold text-white">
            Search <span className="gradient-text-cyan">Everything</span>
          </h1>
          <p className="mt-2 text-sm text-white/50">Search across blogs, videos, books, research papers, podcasts, images, and study materials</p>
        </div>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search blogs, videos, books, papers..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-24 text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none text-base"
              autoFocus
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 px-5 py-2 text-sm font-semibold text-white">
              Search
            </button>
          </div>
        </form>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-cyan-400" /></div>
        ) : searched && total === 0 ? (
          <div className="admin-stat-card p-16 text-center">
            <Search className="mx-auto mb-3 h-8 w-8 text-white/20" />
            <p className="text-sm text-white/40">No results found for &ldquo;{query}&rdquo;</p>
          </div>
        ) : searched ? (
          <div>
            <p className="mb-6 text-sm text-white/40">{total} results found</p>
            {Object.entries(results).map(([type, items]) => {
              if (!items || items.length === 0) return null;
              const Icon = typeIcons[type] || FileText;
              return (
                <div key={type} className="mb-8">
                  <div className="mb-4 flex items-center gap-2">
                    <Icon className="h-4 w-4 text-cyan-400" />
                    <h2 className="font-display text-lg font-bold text-white">{typeLabels[type] || type}</h2>
                    <Badge variant="outline" className="text-[10px]">{items.length}</Badge>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {items.slice(0, 6).map((item: any) => (
                      <Card key={item.id} className="group">
                        <CardContent className="p-4">
                          {item.coverImage && (
                            <img src={`${API_URL}${item.coverImage}`} alt="" className="mb-2 h-24 w-full rounded-lg object-cover" />
                          )}
                          {item.imageUrl && (
                            <img src={`${API_URL}${item.imageUrl}`} alt="" className="mb-2 h-24 w-full rounded-lg object-cover" />
                          )}
                          <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">{item.title}</h3>
                          <p className="text-xs text-white/40 mt-1 line-clamp-2">{item.excerpt || item.description || item.abstract || ""}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-cyan-400" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
