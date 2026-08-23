"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingCart, Search, Loader2, DollarSign, Download, Filter,
  Package, ArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Product {
  id: string;
  title: string;
  description: string | null;
  type: string;
  category: string;
  coverImage: string | null;
  price: number;
  salePrice: number | null;
  isFree: boolean;
  downloads: number;
  createdAt: string;
}

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");

  useEffect(() => { fetchProducts(); }, [category, type]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (category) params.set("category", category);
      if (type) params.set("type", type);
      const res = await fetch(`${API_URL}/api/store?${params}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.data);
      }
    } catch {} finally { setLoading(false); }
  };

  const filtered = products.filter((p) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return p.title.toLowerCase().includes(term) || (p.description || "").toLowerCase().includes(term);
  });

  const categories = ["Geology", "Geography", "Astronomy", "Current Affairs", "General Science"];

  return (
    <div className="min-h-screen pt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Badge variant="outline" className="mb-2">
            <ShoppingCart className="mr-1 h-3 w-3" /> Store
          </Badge>
          <h1 className="font-display text-3xl font-bold text-white">Study Material Store</h1>
          <p className="mt-1 text-sm text-white/50">Free and paid educational resources</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search store..."
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <Select value={category} onChange={setCategory} options={[{ label: "All Categories", value: "" }, ...categories.map(c => ({ label: c, value: c }))]} />
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-cyan-400" /></div>
        ) : filtered.length === 0 ? (
          <div className="admin-stat-card p-16 text-center">
            <Package className="mx-auto mb-3 h-8 w-8 text-white/20" />
            <p className="text-sm text-white/40">No study materials available yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <Card key={p.id} className="group h-full">
                <CardContent className="p-4">
                  {p.coverImage && (
                    <div className="mb-3 overflow-hidden rounded-xl bg-white/5 flex items-center justify-center">
                      <img src={`${API_URL}${p.coverImage}`} alt={p.title} className="w-full max-h-56 object-contain transition-transform group-hover:scale-105" />
                    </div>
                  )}
                  <h3 className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">{p.title}</h3>
                  {p.description && <p className="text-xs text-white/40 mt-1 line-clamp-2">{p.description}</p>}
                  <div className="mt-3 flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">{p.type}</Badge>
                    <Badge variant="outline" className="text-[10px]">{p.category}</Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    {p.isFree || p.price === 0 ? (
                      <Badge className="text-xs bg-green-500/20 text-green-400">Free</Badge>
                    ) : (
                      <Badge className="text-xs bg-orange-400/20 text-orange-400">
                        <DollarSign className="mr-0.5 h-3 w-3" />₹{p.salePrice || p.price}
                      </Badge>
                    )}
                    <span className="text-[10px] text-white/30">{p.downloads} downloads</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
