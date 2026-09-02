"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Headphones, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const cats = ["Astronomy", "Geology", "Geography", "Current Affairs"];

export default function PodcastUploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [category, setCategory] = useState("General");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (status === "loading") return <div className="flex min-h-[70vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-cyan-400" /></div>;
  if (status === "unauthenticated") { router.push("/auth/login"); return null; }
  if (!session) return null;

  const autoSlug = (t: string) => setSlug(t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !description || !author) { setError("All fields are required"); return; }
    setIsSubmitting(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/podcasts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": session.user.id },
        body: JSON.stringify({ title, slug, description, author, coverUrl: coverUrl || undefined, category, tags: tags || undefined }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      router.push("/podcasts");
    } catch (err: any) { setError(err.message); } finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link href="/podcasts" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60">
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Link>
        <h1 className="font-display text-3xl font-bold text-white mb-8">
          <span className="gradient-text-cyan">Create</span> Podcast Show
        </h1>

        {error && <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 flex items-center gap-2"><AlertCircle className="h-4 w-4" />{error}</div>}

        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="p-6 space-y-5">
              {[
                { label: "Show Title *", value: title, onChange: (v: string) => { setTitle(v); if (!slug) autoSlug(v); }, placeholder: "e.g., Cosmos Cast" },
                { label: "Slug *", value: slug, onChange: setSlug, placeholder: "auto-generated" },
                { label: "Author / Host *", value: author, onChange: setAuthor, placeholder: "e.g., Dr. Elena Vasquez" },
                { label: "Cover Image URL", value: coverUrl, onChange: setCoverUrl, placeholder: "https://example.com/cover.jpg" },
              ].map((f) => (
                <div key={f.label}>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">{f.label}</label>
                  <input type="text" value={f.value} onChange={(e) => f.onChange(e.target.value)} placeholder={f.placeholder}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30" />
                </div>
              ))}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">Description *</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="What is this podcast about?"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30">
                    {cats.map((c) => <option key={c} value={c} className="bg-cosmos-navy">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">Tags</label>
                  <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="comma-separated"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30" />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || !title || !slug || !description || !author}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Headphones className="h-4 w-4" /> Create Show</>}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
