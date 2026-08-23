"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileStack, Search, Loader2, Upload, ExternalLink, Download, Tag,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { Select } from "@/components/ui/select";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const categories = ["Geology", "Geography", "Astronomy", "Current Affairs", "General Science"];

interface Paper {
  id: string;
  title: string;
  authors: string;
  abstract: string | null;
  journal: string | null;
  doi: string | null;
  publicationYear: number | null;
  category: string;
  keywords: string | null;
  fileUrl: string | null;
  externalLink: string | null;
  coverImage: string | null;
  downloads: number;
  createdAt: string;
}

export default function ResearchPapersPage() {
  const { data: session } = useSession();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => { fetchPapers(); }, [category]);

  const fetchPapers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (category) params.set("category", category);
      const res = await fetch(`${API_URL}/api/research-papers?${params}`);
      if (res.ok) {
        const data = await res.json();
        setPapers(data.data);
      }
    } catch {} finally { setLoading(false); }
  };

  const filtered = papers.filter((p) => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.authors.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this research paper?")) return;
    try {
      await fetch(`${API_URL}/api/research-papers/${id}`, {
        method: "DELETE",
        headers: { "x-user-id": session!.user.id },
      });
      setPapers((prev) => prev.filter((p) => p.id !== id));
    } catch {}
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Badge variant="outline" className="mb-2"><FileStack className="mr-1 h-3 w-3" /> Research Papers</Badge>
            <h1 className="font-display text-3xl font-bold text-white">Research Papers</h1>
            <p className="mt-1 text-sm text-white/50">Scientific research papers and journals</p>
          </div>
          {session && (
            <Link href="/research-papers/upload" className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 px-4 py-2.5 text-sm font-semibold text-white">
              <Upload className="h-4 w-4" /> Add Paper
            </Link>
          )}
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search papers..." className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none" />
          </div>
          <Select value={category} onChange={setCategory} options={[{ label: "All Categories", value: "" }, ...categories.map(c => ({ label: c, value: c }))]} />
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-cyan-400" /></div>
        ) : filtered.length === 0 ? (
          <div className="admin-stat-card p-16 text-center">
            <FileStack className="mx-auto mb-3 h-8 w-8 text-white/20" />
            <p className="text-sm text-white/40">No research papers available yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((paper) => (
              <Card key={paper.id} className="group h-full">
                <CardContent className="p-4">
                  {paper.coverImage && (
                    <div className="mb-3 overflow-hidden rounded-xl bg-white/5 flex items-center justify-center">
                      <img src={`${API_URL}${paper.coverImage}`} alt="" className="w-full max-h-48 object-contain" />
                    </div>
                  )}
                  <h3 className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">{paper.title}</h3>
                  <p className="text-xs text-cyan-400 mt-1">{paper.authors}</p>
                  {paper.abstract && <p className="text-xs text-white/30 mt-1 line-clamp-3">{paper.abstract}</p>}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {paper.journal && <Badge variant="outline" className="text-[10px]">{paper.journal}</Badge>}
                    {paper.publicationYear && <span className="text-[10px] text-white/30">{paper.publicationYear}</span>}
                    <Badge variant="outline" className="text-[10px]">{paper.category}</Badge>
                    <span className="text-[10px] text-white/20 ml-auto">{paper.downloads} downloads</span>
                  </div>
                  {paper.keywords && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {paper.keywords.split(",").slice(0, 3).map((k) => (
                        <Badge key={k.trim()} variant="outline" className="text-[10px]">{k.trim()}</Badge>
                      ))}
                    </div>
                  )}
                  {paper.fileUrl && (
                    <a href={paper.fileUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-cyan-400 hover:underline">
                      <FileStack className="h-3 w-3" /> Open PDF
                    </a>
                  )}
                  {paper.externalLink && paper.externalLink.startsWith("http") && (
                    <a href={paper.externalLink} target="_blank" rel="noopener noreferrer" className="mt-2 ml-2 inline-flex items-center gap-1 text-xs text-cyan-400 hover:underline">
                      <ExternalLink className="h-3 w-3" /> View Paper
                    </a>
                  )}
                  {session && (
                    <div className="mt-2">
                      <button onClick={() => handleDelete(paper.id)} className="flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-[10px] text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </div>
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
