"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, Image, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  "Astronomy",
  "Geology",
  "Geography",
  "Current Affairs",
];

export default function GalleryUploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (status === "loading") {
    return <div className="flex min-h-[70vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-cosmos-cyan" /></div>;
  }
  if (!session) { router.push("/auth/login"); return null; }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 20 * 1024 * 1024) {
        setError("File must be under 20MB");
        return;
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) { setError("Title and image are required"); return; }
    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      if (tags) formData.append("tags", tags);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/gallery`,
        { method: "POST", headers: { "x-user-id": session.user.id }, body: formData }
      );
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Upload failed"); }
      router.push("/gallery");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link href="/gallery" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Gallery
        </Link>
        <h1 className="font-display text-3xl font-bold text-white mb-8">
          <span className="gradient-text-cyan">Upload</span> Image
        </h1>

        {error && <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}

        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="p-6 space-y-6">
              {/* Image preview/upload */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">Image *</label>
                {preview ? (
                  <div className="relative">
                    <img src={preview} alt="Preview" className="w-full max-h-80 rounded-xl object-contain bg-white/5" />
                    <button type="button" onClick={() => { setFile(null); setPreview(null); }}
                      className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-white/10 p-10 transition-colors hover:border-cosmos-cyan/30">
                    <Image className="h-10 w-10 text-white/30 mb-2" />
                    <p className="text-sm text-white/50">Click to select image</p>
                    <p className="text-xs text-white/30">JPEG, PNG, GIF, WEBP — max 20MB</p>
                    <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
                  </label>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">Title *</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Pillars of Creation" required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cosmos-cyan/50 focus:outline-none focus:ring-1 focus:ring-cosmos-cyan/30" />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
                  placeholder="Describe the image..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cosmos-cyan/50 focus:outline-none focus:ring-1 focus:ring-cosmos-cyan/30 resize-none" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-cosmos-cyan/50 focus:outline-none focus:ring-1 focus:ring-cosmos-cyan/30">
                    {categories.map((c) => <option key={c} value={c} className="bg-cosmos-navy">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">Tags</label>
                  <input type="text" value={tags} onChange={(e) => setTags(e.target.value)}
                    placeholder="comma-separated tags"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cosmos-cyan/50 focus:outline-none focus:ring-1 focus:ring-cosmos-cyan/30" />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || !title || !file}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Upload className="h-4 w-4" /> Upload Image</>}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
