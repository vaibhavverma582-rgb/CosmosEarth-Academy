"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Film,
  Search,
  Star,
  Clock,
  Calendar,
  Loader2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Documentary {
  id: string;
  title: string;
  slug: string;
  description: string;
  posterUrl?: string;
  trailerUrl?: string;
  duration?: string;
  year?: number;
  director?: string;
  rating?: number;
  category: string;
  featured: boolean;
}

const categories = ["All", "Space", "Earth", "Physics", "Nature", "History", "Technology", "General"];

export default function DocumentariesPage() {
  const { data: session } = useSession();
  const [docs, setDocs] = useState<Documentary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (selectedCategory !== "All") params.set("category", selectedCategory);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/documentaries?${params}`
      );
      const data = await res.json();
      setDocs(data.data || []);
    } catch (error) {
      console.error("Failed to fetch documentaries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDocs(); }, [searchQuery, selectedCategory]);

  const featured = docs.filter((d) => d.featured);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
              <span className="gradient-text-warm">Documentaries</span>
            </h1>
            <p className="mt-2 text-white/50">
              Cinematic explorations of our universe and beyond
            </p>
          </div>
          {session && (
            <Link href="/documentaries/upload">
              <Button><Plus className="h-4 w-4" /> Add Documentary</Button>
            </Link>
          )}
        </div>

        {/* Featured */}
        {featured.length > 0 && searchQuery === "" && selectedCategory === "All" && (
          <div className="mb-12">
            <h2 className="mb-4 font-display text-lg font-bold text-white">⭐ Featured</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.slice(0, 3).map((doc) => (
                <Link key={doc.id} href={`/documentaries/${doc.slug}`}>
                  <Card className="group overflow-hidden">
                    <div className="relative aspect-[2/1] bg-white/5">
                      {doc.posterUrl ? (
                        <img src={doc.posterUrl} alt={doc.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-cosmos-navy-light to-cosmos-navy">
                          <Film className="h-16 w-16 text-white/10" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <Badge variant="default" className="mb-2 text-[10px]">Featured</Badge>
                        <h3 className="text-lg font-bold text-white">{doc.title}</h3>
                        <div className="mt-1 flex items-center gap-3 text-xs text-white/60">
                          {doc.year && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{doc.year}</span>}
                          {doc.duration && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{doc.duration}</span>}
                          {doc.rating && <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-cosmos-gold" />{doc.rating}</span>}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Search + Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search documentaries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-cosmos-cyan/50 focus:outline-none focus:ring-1 focus:ring-cosmos-cyan/30"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  selectedCategory === c
                    ? "bg-cosmos-orange/20 text-cosmos-orange border border-cosmos-orange/30"
                    : "bg-white/5 text-white/50 border border-transparent hover:bg-white/10"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-cosmos-cyan" />
          </div>
        ) : docs.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {docs.map((doc) => (
              <Link key={doc.id} href={`/documentaries/${doc.slug}`}>
                <Card className="group h-full overflow-hidden">
                  <div className="relative aspect-[3/4] bg-white/5">
                    {doc.posterUrl ? (
                      <img src={doc.posterUrl} alt={doc.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-cosmos-navy-light to-cosmos-navy">
                        <Film className="h-12 w-12 text-white/10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                      <p className="text-xs text-white/70 line-clamp-2">{doc.description}</p>
                    </div>
                    {doc.rating && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-xs text-cosmos-gold">
                        <Star className="h-3 w-3 fill-cosmos-gold" /> {doc.rating}
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <h3 className="text-sm font-bold text-white group-hover:text-cosmos-orange transition-colors line-clamp-1">
                      {doc.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-white/40">
                      {doc.year && <span>{doc.year}</span>}
                      {doc.duration && <span>· {doc.duration}</span>}
                      {doc.director && <span>· {doc.director}</span>}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <Film className="mx-auto h-12 w-12 text-white/20" />
            <p className="mt-4 text-lg text-white/40">No documentaries found</p>
          </div>
        )}
      </div>
    </div>
  );
}
