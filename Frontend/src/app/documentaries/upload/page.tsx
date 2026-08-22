"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Film, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const cats = ["Astronomy", "Geology", "Geography", "Current Affairs"];

export default function DocumentaryUploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [trailerUrl, setTrailerUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [year, setYear] = useState("");
  const [director, setDirector] = useState("");
  const [rating, setRating] = useState("");
  const [category, setCategory] = useState("General");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (status === "loading") return <div className="flex min-h-[70vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-cosmos-cyan" /></div>;
  if (!session) { router.push("/auth/login"); return null; }

  const autoSlug = (t: string) => setSlug(t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !description) { setError("Title, slug, and description are required"); return; }
    setIsSubmitting(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/documentaries`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": session.user.id },
        body: JSON.stringify({
          title, slug, description, posterUrl: posterUrl || undefined, trailerUrl: trailerUrl || undefined,
          duration: duration || undefined, year: year ? parseInt(year) : undefined,
          director: director || undefined, rating: rating ? parseFloat(rating) : undefined,
          category, tags: tags || undefined,
        }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      router.push("/documentaries");
    } catch (err: any) { setError(err.message); } finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link href="/documentaries" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60">
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Link>
        <h1 className="font-display text-3xl font-bold text-white mb-8">
          <span className="gradient-text-warm">Add</span> Documentary
        </h1>

        {error && <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 flex items-center gap-2"><AlertCircle className="h-4 w-4" />{error}</div>}

        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="p-6 space-y-5">
              {[
                { label: "Title *", value: title, onChange: (v: string) => { setTitle(v); if (!slug) autoSlug(v); }, placeholder: "e.g., The Farthest: Voyager in Space" },
                { label: "Slug *", value: slug, onChange: setSlug, placeholder: "auto-generated-from-title" },
                { label: "Description *", value: description, onChange: setDescription, placeholder: "Describe the documentary...", type: "textarea" },
                { label: "Poster Image URL", value: posterUrl, onChange: setPosterUrl, placeholder: "https://example.com/poster.jpg" },
                { label: "Trailer YouTube URL", value: trailerUrl, onChange: setTrailerUrl, placeholder: "https://www.youtube.com/watch?v=..." },
              ].map((f) => (
                <div key={f.label}>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">{f.label}</label>
                  {f.type === "textarea" ? (
                    <textarea value={f.value} onChange={(e) => f.onChange(e.target.value)} rows={4} placeholder={f.placeholder}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cosmos-cyan/50 focus:outline-none focus:ring-1 focus:ring-cosmos-cyan/30 resize-none" />
                  ) : (
                    <input type="text" value={f.value} onChange={(e) => f.onChange(e.target.value)} placeholder={f.placeholder}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cosmos-cyan/50 focus:outline-none focus:ring-1 focus:ring-cosmos-cyan/30" />
                  )}
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { label: "Duration", value: duration, onChange: setDuration, placeholder: "1h 32m" },
                  { label: "Year", value: year, onChange: setYear, placeholder: "2023" },
                  { label: "Director", value: director, onChange: setDirector, placeholder: "Name" },
                  { label: "Rating (/10)", value: rating, onChange: setRating, placeholder: "8.5" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="mb-1.5 block text-xs font-medium text-white/70">{f.label}</label>
                    <input type="text" value={f.value} onChange={(e) => f.onChange(e.target.value)} placeholder={f.placeholder}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-cosmos-cyan/50 focus:outline-none focus:ring-1 focus:ring-cosmos-cyan/30" />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-cosmos-cyan/50 focus:outline-none focus:ring-1 focus:ring-cosmos-cyan/30">
                    {cats.map((c) => <option key={c} value={c} className="bg-cosmos-navy">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">Tags</label>
                  <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="comma-separated"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cosmos-cyan/50 focus:outline-none focus:ring-1 focus:ring-cosmos-cyan/30" />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || !title || !slug || !description}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Film className="h-4 w-4" /> Add Documentary</>}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
