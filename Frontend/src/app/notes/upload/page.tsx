"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Upload, Loader2, BookOpen, FileText, X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const categories = ["Geology", "Geography", "Astronomy", "Current Affairs", "General Science"];

export default function NoteUploadPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: "", description: "", subject: "Astronomy", topic: "",
    mediaCategory: "Astronomy", tags: "",
    isFree: "true", price: "", salePrice: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.subject) return alert("Title and subject are required");
    if (!file) return alert("Please select a file to upload");

    setUploading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      formData.append("file", file);

      const res = await fetch(`${API_URL}/api/notes/upload`, {
        method: "POST",
        headers: { "x-user-id": session!.user.id },
        body: formData,
      });

      if (res.ok) {
        router.push("/notes");
      } else {
        const err = await res.json();
        alert(err.error || "Upload failed");
      }
    } catch { alert("Upload failed"); } finally { setUploading(false); }
  };

  if (!session) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-white/40">Sign in to upload notes</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Link href="/notes" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Notes
        </Link>

        <Badge variant="outline" className="mb-2"><Upload className="mr-1 h-3 w-3" /> Upload</Badge>
        <h1 className="font-display text-3xl font-bold text-white mb-6">Upload Note</h1>

        <form onSubmit={handleSubmit} className="admin-stat-card p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs text-white/50 mb-1">Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Enter note title" className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" required />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-white/50 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description" rows={2} className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" />
          </div>

          {/* Subject + Topic */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1">Category *</label>
              <Select value={form.subject} onChange={(v) => setForm({ ...form, subject: v, mediaCategory: v })} options={categories.map(c => ({ label: c, value: c }))} />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Topic</label>
              <input value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} placeholder="Optional topic" className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs text-white/50 mb-1">Tags (comma-separated)</label>
            <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="tag1, tag2" className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" />
          </div>

          {/* Free / Paid */}
          <div className="grid grid-cols-2 gap-4">
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
              </>
            )}
          </div>

          {form.isFree === "false" && (
            <div>
              <label className="block text-xs text-white/50 mb-1">Sale Price (₹)</label>
              <input type="number" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: e.target.value })} placeholder="Optional sale price" className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" />
            </div>
          )}

          {/* File Upload */}
          <div>
            <label className="block text-xs text-white/50 mb-1">File *</label>
            {file ? (
              <div className="flex items-center gap-3 rounded-lg border border-cyan-400/30 bg-cyan-400/5 p-3">
                <FileText className="h-5 w-5 text-cyan-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{file.name}</p>
                  <p className="text-xs text-white/40">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button type="button" onClick={() => setFile(null)} className="text-white/40 hover:text-red-400"><X className="h-4 w-4" /></button>
              </div>
            ) : (
              <label className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-white/10 bg-white/5 p-6 cursor-pointer hover:border-cyan-400/30 transition-colors">
                <Upload className="h-6 w-6 text-white/30" />
                <span className="text-xs text-white/40">Click to select file (PDF, DOCX, images)</span>
                <input type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.webp" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </label>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <Link href="/notes" className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-white/60 hover:text-white">Cancel</Link>
            <button type="submit" disabled={uploading} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Upload Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
