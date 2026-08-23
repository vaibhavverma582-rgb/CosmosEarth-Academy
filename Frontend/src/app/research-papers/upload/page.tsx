"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Upload, Loader2, FileStack, FileText, X, Image,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const categories = ["Geology", "Geography", "Astronomy", "Current Affairs", "General Science"];

export default function ResearchPaperUploadPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [paperFile, setPaperFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: "", authors: "", abstract: "", journal: "", doi: "",
    publicationYear: "", category: "Astronomy", subcategory: "", keywords: "",
    researchArea: "", externalLink: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.authors) return alert("Title and authors are required");

    setUploading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (paperFile) formData.append("file", paperFile);
      if (coverFile) formData.append("coverImage", coverFile);

      const res = await fetch(`${API_URL}/api/research-papers`, {
        method: "POST",
        headers: { "x-user-id": session!.user.id },
        body: formData,
      });

      if (res.ok) { router.push("/research-papers"); }
      else { const err = await res.json(); alert(err.error || "Upload failed"); }
    } catch { alert("Upload failed"); } finally { setUploading(false); }
  };

  if (!session) return <div className="flex justify-center py-20"><p className="text-white/40">Sign in to upload papers</p></div>;

  return (
    <div className="min-h-screen pt-16">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Link href="/research-papers" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Research Papers
        </Link>

        <Badge variant="outline" className="mb-2"><Upload className="mr-1 h-3 w-3" /> Upload</Badge>
        <h1 className="font-display text-3xl font-bold text-white mb-6">Add Research Paper</h1>

        <form onSubmit={handleSubmit} className="admin-stat-card p-6 space-y-4">
          <div>
            <label className="block text-xs text-white/50 mb-1">Paper Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Research paper title" className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" required />
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-1">Authors *</label>
            <input value={form.authors} onChange={(e) => setForm({ ...form, authors: e.target.value })} placeholder="Author 1, Author 2, ..." className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" required />
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-1">Abstract</label>
            <textarea value={form.abstract} onChange={(e) => setForm({ ...form, abstract: e.target.value })} placeholder="Paper abstract" rows={4} className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1">Journal</label>
              <input value={form.journal} onChange={(e) => setForm({ ...form, journal: e.target.value })} placeholder="Journal name" className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">DOI</label>
              <input value={form.doi} onChange={(e) => setForm({ ...form, doi: e.target.value })} placeholder="10.xxxx/xxxxx" className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Year</label>
              <input type="number" value={form.publicationYear} onChange={(e) => setForm({ ...form, publicationYear: e.target.value })} placeholder="Year" className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1">Category</label>
              <Select value={form.category} onChange={(v) => setForm({ ...form, category: v })} options={categories.map(c => ({ label: c, value: c }))} />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Research Area</label>
              <input value={form.researchArea} onChange={(e) => setForm({ ...form, researchArea: e.target.value })} placeholder="e.g. Planetary Science" className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-1">Keywords (comma-separated)</label>
            <input value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} placeholder="keyword1, keyword2" className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" />
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-1">External Link (optional)</label>
            <input value={form.externalLink} onChange={(e) => setForm({ ...form, externalLink: e.target.value })} placeholder="https://..." className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" />
          </div>

          {/* Files */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1">Paper PDF</label>
              {paperFile ? (
                <div className="flex items-center gap-2 rounded-lg border border-cyan-400/30 bg-cyan-400/5 p-2">
                  <FileText className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span className="text-xs text-white truncate flex-1">{paperFile.name}</span>
                  <button type="button" onClick={() => setPaperFile(null)} className="text-white/40 hover:text-red-400"><X className="h-3 w-3" /></button>
                </div>
              ) : (
                <label className="flex flex-col items-center gap-1 rounded-lg border-2 border-dashed border-white/10 bg-white/5 p-4 cursor-pointer hover:border-cyan-400/30 transition-colors">
                  <FileText className="h-5 w-5 text-white/30" />
                  <span className="text-[10px] text-white/40">PDF file</span>
                  <input type="file" accept=".pdf" className="hidden" onChange={(e) => setPaperFile(e.target.files?.[0] || null)} />
                </label>
              )}
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Cover Image</label>
              {coverFile ? (
                <div className="flex items-center gap-2 rounded-lg border border-cyan-400/30 bg-cyan-400/5 p-2">
                  <Image className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span className="text-xs text-white truncate flex-1">{coverFile.name}</span>
                  <button type="button" onClick={() => setCoverFile(null)} className="text-white/40 hover:text-red-400"><X className="h-3 w-3" /></button>
                </div>
              ) : (
                <label className="flex flex-col items-center gap-1 rounded-lg border-2 border-dashed border-white/10 bg-white/5 p-4 cursor-pointer hover:border-cyan-400/30 transition-colors">
                  <Image className="h-5 w-5 text-white/30" />
                  <span className="text-[10px] text-white/40">Cover image</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} />
                </label>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Link href="/research-papers" className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-white/60 hover:text-white">Cancel</Link>
            <button type="submit" disabled={uploading} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Add Paper
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
