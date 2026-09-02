"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen, Search, Loader2, Upload, DollarSign, Download, ExternalLink,
  Trash2, FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const categories = ["Geology", "Geography", "Astronomy", "Current Affairs", "General Science"];

interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  category: string;
  coverImage: string | null;
  fileUrl: string | null;
  price: number;
  salePrice: number | null;
  isFree: boolean;
  downloads: number;
  externalLink: string | null;
  createdAt: string;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => { fetchBooks(); }, [category]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (category) params.set("category", category);
      const res = await fetch(`${API_URL}/api/books?${params}`);
      if (res.ok) {
        const data = await res.json();
        setBooks(data.data);
      }
    } catch {} finally { setLoading(false); }
  };

  const filtered = books.filter((b) => !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen pt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Badge variant="outline" className="mb-2"><BookOpen className="mr-1 h-3 w-3" /> Books</Badge>
            <h1 className="font-display text-3xl font-bold text-white">Books</h1>
            <p className="mt-1 text-sm text-white/50">Free and paid books and e-books</p>
          </div>

        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search books..." className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none" />
          </div>
          <Select value={category} onChange={setCategory} options={[{ label: "All Categories", value: "" }, ...categories.map(c => ({ label: c, value: c }))]} />
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-cyan-400" /></div>
        ) : filtered.length === 0 ? (
          <div className="admin-stat-card p-16 text-center">
            <BookOpen className="mx-auto mb-3 h-8 w-8 text-white/20" />
            <p className="text-sm text-white/40">No books available yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((book) => (
              <Card key={book.id} className="group h-full">
                <CardContent className="p-4">
                  {book.coverImage && (
                    <div className="mb-3 overflow-hidden rounded-xl bg-white/5 flex items-center justify-center">
                      <img src={`${API_URL}${book.coverImage}`} alt={book.title} className="w-full max-h-56 object-contain transition-transform group-hover:scale-105" />
                    </div>
                  )}
                  <h3 className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">{book.title}</h3>
                  <p className="text-xs text-white/40 mt-1">by {book.author}</p>
                  {book.description && <p className="text-xs text-white/30 mt-1 line-clamp-2">{book.description}</p>}
                  <div className="mt-3 flex items-center gap-2">
                    {book.isFree || book.price === 0 ? (
                      <Badge className="text-[10px] bg-green-500/20 text-green-400">Free</Badge>
                    ) : (
                      <Badge className="text-[10px] bg-orange-400/20 text-orange-400">
                        <DollarSign className="mr-0.5 h-2.5 w-2.5" />₹{book.salePrice || book.price}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-[10px]">{book.category}</Badge>
                    <span className="text-[10px] text-white/20 ml-auto">{book.downloads} downloads</span>
                  </div>
                  {book.fileUrl && (
                    <a href={book.fileUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-cyan-400 hover:underline">
                      <FileText className="h-3 w-3" /> Open File
                    </a>
                  )}
                  {book.externalLink && book.externalLink.startsWith("http") && (
                    <a href={book.externalLink} target="_blank" rel="noopener noreferrer" className="mt-2 ml-2 inline-flex items-center gap-1 text-xs text-cyan-400 hover:underline">
                      <ExternalLink className="h-3 w-3" /> External Link
                    </a>
                  )}

                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
