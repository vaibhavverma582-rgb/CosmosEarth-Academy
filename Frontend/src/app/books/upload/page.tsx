"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Upload, Loader2, BookOpen, FileText, X, Image,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const categories = ["Geology", "Geography", "Astronomy", "Current Affairs", "General Science"];

export default function BookUploadPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: "", author: "", description: "", isbn: "", publisher: "",
    publicationYear: "", category: "Astronomy", subcategory: "", tags: "",
    externalLink: "", isFree: "true", price: "", salePrice: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.author) return alert("Title and author are required");

    setUploading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (coverFile) formData.append("coverImage", coverFile);
      if (bookFile) formData.append("file", bookFile);

      const res = await fetch(`${API_URL}/api/books`, {
        method: "POST",
        headers: { "x-user-id": session!.user.id },
        body: formData,
      });

      if (res.ok) { router.push("/books"); }
      else { const err = await res.json(); alert(err.error || "Upload failed"); }
    } catch { alert("Upload failed"); } finally { setUploading(false); }
  };

  if (!session) return <div className="flex justify-center py-20"><p className="text-white/40">Sign in to upload books</p></div>;

  return (
    <div className="min-h-screen pt-16">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Link href="/books" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Books
        </Link>

        <Badge variant="outline" className="mb-2"><Upload className="mr-1 h-3 w-3" /> Upload</Badge>
        <h1 className="font-display text-3xl font-bold text-white mb-6">Add Book</h1>

        <form onSubmit={handleSubmit} className="admin-stat-card p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs text-white/50 mb-1">Title *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Book title" className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" required />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Author *</label>
              <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Author name" className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" required />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Category</label>
              <Select value={form.category} onChange={(v) => setForm({ ...form, category: v })} options={categories.map(c => ({ label: c, value: c }))} />
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Book description" rows={3} className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1">ISBN</label>
              <input value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} placeholder="ISBN" className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Publisher</label>
              <input value={form.publisher} onChange={(e) => setForm({ ...form, publisher: e.target.value })} placeholder="Publisher" className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Year</label>
              <input type="number" value={form.publicationYear} onChange={(e) => setForm({ ...form, publicationYear: e.target.value })} placeholder="Year" className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-1">External Link (optional)</label>
            <input value={form.externalLink} onChange={(e) => setForm({ ...form, externalLink: e.target.value })} placeholder="https://..." className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" />
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-1">Tags (comma-separated)</label>
            <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="tag1, tag2" className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" />
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1">Access</label>
              <Select value={form.isFree} onChange={(v) => setForm({ ...form, isFree: v })} options={[{ label: "Free", value: "true" }, { label: "Paid", value: "false" }]} />
            </div>
            {form.isFree === "false" && (
              <>
                <div>
                  <label className="block text-xs text-white/50 mb-1">Price (₹)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0" className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">Sale Price (₹)</label>
                  <input type="number" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: e.target.value })} placeholder="Optional" className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" />
                </div>
              </>
            )}
          </div>

          {/* Files */}
          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <label className="block text-xs text-white/50 mb-1">Book File</label>
              {bookFile ? (
                <div className="flex items-center gap-2 rounded-lg border border-cyan-400/30 bg-cyan-400/5 p-2">
                  <FileText className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span className="text-xs text-white truncate flex-1">{bookFile.name}</span>
                  <button type="button" onClick={() => setBookFile(null)} className="text-white/40 hover:text-red-400"><X className="h-3 w-3" /></button>
                </div>
              ) : (
                <label className="flex flex-col items-center gap-1 rounded-lg border-2 border-dashed border-white/10 bg-white/5 p-4 cursor-pointer hover:border-cyan-400/30 transition-colors">
                  <FileText className="h-5 w-5 text-white/30" />
                  <span className="text-[10px] text-white/40">PDF, EPUB, DOCX</span>
                  <input type="file" accept=".pdf,.epub,.doc,.docx" className="hidden" onChange={(e) => setBookFile(e.target.files?.[0] || null)} />
                </label>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Link href="/books" className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-white/60 hover:text-white">Cancel</Link>
            <button type="submit" disabled={uploading} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Add Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
