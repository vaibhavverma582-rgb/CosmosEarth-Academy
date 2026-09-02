"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen, Search, Loader2, Upload, Tag, Download, ArrowRight,
  FileText, DollarSign, Filter, Trash2, Pencil,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Note {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  topic: string | null;
  mediaCategory: string;
  fileType: string;
  fileName: string | null;
  fileSize: number | null;
  fileUrl: string | null;
  downloads: number;
  isFree: boolean;
  price: number;
  salePrice: number | null;
  published: boolean;
  createdAt: string;
  author: { id: string; name: string; avatar: string | null; image: string | null };
  tags: { name: string }[];
}

const categories = ["Geology", "Geography", "Astronomy", "Current Affairs", "General Science"];

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [accessFilter, setAccessFilter] = useState<"all" | "free" | "paid">("all");

  useEffect(() => { fetchNotes(); }, [category, accessFilter]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (category) params.set("subject", category);
      const res = await fetch(`${API_URL}/api/notes?${params}`);
      if (res.ok) {
        const data = await res.json();
        setNotes(data.data);
      }
    } catch {} finally { setLoading(false); }
  };

  const filtered = notes.filter((n) => {
    const matchesSearch = !search || n.title.toLowerCase().includes(search.toLowerCase()) || (n.description || "").toLowerCase().includes(search.toLowerCase());
    const matchesAccess = accessFilter === "all" || (accessFilter === "free" && n.isFree) || (accessFilter === "paid" && !n.isFree);
    return matchesSearch && matchesAccess;
  });

  return (
    <div className="min-h-screen pt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Badge variant="outline" className="mb-2"><BookOpen className="mr-1 h-3 w-3" /> Notes</Badge>
            <h1 className="font-display text-3xl font-bold text-white">Notes</h1>
            <p className="mt-1 text-sm text-white/50">Free and paid study notes</p>
          </div>

        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notes..." className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none" />
          </div>
          <Select value={category} onChange={setCategory} options={[{ label: "All Categories", value: "" }, ...categories.map(c => ({ label: c, value: c }))]} />
          <div className="flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
            {(["all", "free", "paid"] as const).map((f) => (
              <button key={f} onClick={() => setAccessFilter(f)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${accessFilter === f ? "bg-cyan-400/20 text-cyan-400" : "text-white/40 hover:text-white/60"}`}>
                {f === "all" ? "All" : f === "free" ? "Free" : "Paid"}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-cyan-400" /></div>
        ) : filtered.length === 0 ? (
          <div className="admin-stat-card p-16 text-center">
            <BookOpen className="mx-auto mb-3 h-8 w-8 text-white/20" />
            <p className="text-sm text-white/40">No notes available yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((note) => (
              <Link key={note.id} href={`/notes/${note.id}`}>
                <Card className="group h-full">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="h-3 w-3 text-purple-400" />
                      <span className="text-xs text-white/40">{note.mediaCategory}</span>
                      {note.topic && <span className="text-xs text-white/30">• {note.topic}</span>}
                    </div>
                    <h3 className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">{note.title}</h3>
                    {note.description && <p className="text-xs text-white/30 mt-1 line-clamp-2">{note.description}</p>}
                    <div className="mt-3 flex items-center gap-2">
                      {note.isFree ? (
                        <Badge className="text-[10px] bg-green-500/20 text-green-400">Free</Badge>
                      ) : (
                        <Badge className="text-[10px] bg-orange-400/20 text-orange-400">
                          <DollarSign className="mr-0.5 h-2.5 w-2.5" />₹{note.salePrice || note.price}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-[10px]">{note.fileType?.toUpperCase()}</Badge>
                      <span className="text-[10px] text-white/20 ml-auto">{note.downloads} downloads</span>
                    </div>
                    {note.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {note.tags.slice(0, 3).map((t) => (
                          <Badge key={t.name} variant="outline" className="text-[10px]">{t.name}</Badge>
                        ))}
                      </div>
                    )}

                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
