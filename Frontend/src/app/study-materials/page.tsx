"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  BookOpen,
  FileText,
  GraduationCap,
  ExternalLink,
  Plus,
  Loader2,
  Trash2,
  X,
  Upload,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface StudyMaterial {
  id: string;
  title: string;
  author: string;
  type: string;
  status: string;
  description?: string;
  coverUrl?: string;
  link?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  user: { id: string; name: string };
  createdAt: string;
}

const materialTypes = ["Book", "Research Paper", "Course", "Resource"];
const statusOptions = ["Reading", "Completed", "Ongoing", "To Read"];

const typeConfig: Record<string, { icon: string; color: string }> = {
  Book: { icon: "📖", color: "from-cyan-400/10 to-transparent" },
  "Research Paper": { icon: "📄", color: "from-green-500/10 to-transparent" },
  Course: { icon: "🎓", color: "from-purple-400/10 to-transparent" },
  Resource: { icon: "🔭", color: "from-orange-500/10 to-transparent" },
};

const statusColors: Record<string, string> = {
  Reading: "bg-cyan-400/15 text-cyan-400",
  Completed: "bg-green-500/15 text-green-400",
  Ongoing: "bg-purple-400/15 text-purple-400",
  "To Read": "bg-white/10 text-white/50",
};

export default function StudyMaterialsPage() {
  const { data: session, status } = useSession();
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [type, setType] = useState("Book");
  const [materialStatus, setMaterialStatus] = useState("Reading");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/study-materials`);
      const data = await res.json();
      setMaterials(data.data || []);
    } catch (error) {
      console.error("Failed to fetch materials:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this material?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`${API_URL}/api/study-materials/${id}`, {
        method: "DELETE",
        headers: { "x-user-id": session!.user.id },
      });
      if (res.ok) {
        setMaterials((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author) return;

    setSubmitting(true);
    setError("");
    const url = `${API_URL}/api/study-materials`;
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("type", type);
      formData.append("status", materialStatus);
      if (description) formData.append("description", description);
      if (link) formData.append("link", link);
      if (file) formData.append("file", file);

      const res = await fetch(url, {
        method: "POST",
        headers: { "x-user-id": session!.user.id },
        body: formData,
      });

      console.log("[StudyMaterials] Response", res.status, res.statusText);

      if (!res.ok) {
        const text = await res.text();
        console.error("[StudyMaterials] Error response:", text);
        let errorMessage = "Failed to add material";
        try {
          const data = JSON.parse(text);
          errorMessage = data.error || errorMessage;
        } catch {
          errorMessage = text || `Failed with status ${res.status}`;
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      console.log("[StudyMaterials] Success:", data);
      setTitle("");
      setAuthor("");
      setType("Book");
      setMaterialStatus("Reading");
      setDescription("");
      setLink("");
      setFile(null);
      setShowUpload(false);
      await fetchMaterials();
    } catch (err: any) {
      console.error("[StudyMaterials] Create error:", err);
      setError(err.message || "Failed to add material. Make sure the backend server is running.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Badge variant="outline" className="mb-4">
              <GraduationCap className="mr-1 h-3 w-3" />
              Study Materials
            </Badge>
            <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
              Study <span className="gradient-text-cyan">Materials</span>
            </h1>
            <p className="mt-4 text-lg text-white/50">
              Books, research papers, courses, and resources to explore.
            </p>
          </div>
          {session && (
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-cosmos-sm self-start"
            >
              {showUpload ? (
                <>
                  <X className="h-4 w-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Material
                </>
              )}
            </button>
          )}
        </div>

        {/* Upload Form */}
        {showUpload && (
          <Card className="mb-8 border-cyan-400/20">
            <CardContent className="p-6">
              <h3 className="font-display text-lg font-bold text-white mb-4">
                Add New Material
              </h3>
              {error && (
                <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-white/70">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., An Introduction to Modern Astrophysics"
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-white/70">
                      Author *
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g., Carroll & Ostlie"
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-white/70">
                      Type
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                    >
                      {materialTypes.map((t) => (
                        <option key={t} value={t} className="bg-[#0a0e27]">
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-white/70">
                      Status
                    </label>
                    <select
                      value={materialStatus}
                      onChange={(e) => setMaterialStatus(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s} className="bg-[#0a0e27]">
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">
                    Description (optional)
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">
                    Link (optional)
                  </label>
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">
                    File (optional — PDF, DOCX, Image)
                  </label>
                  <div className="relative rounded-xl border-2 border-dashed border-white/10 p-6 text-center transition-colors hover:border-cyan-400/30">
                    {file ? (
                      <div className="space-y-2">
                        <FileText className="mx-auto h-6 w-6 text-cyan-400" />
                        <p className="text-sm text-white">{file.name}</p>
                        <p className="text-xs text-white/40">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <button
                          type="button"
                          onClick={() => setFile(null)}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          Remove file
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="mx-auto h-6 w-6 text-white/30" />
                        <p className="text-sm text-white/50">
                          Drag and drop or click to select
                        </p>
                        <p className="text-xs text-white/30">
                          PDF, DOCX, PNG, JPG (max 50MB)
                        </p>
                        <input
                          type="file"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              if (f.size > 50 * 1024 * 1024) {
                                setError("File size must be under 50MB");
                                return;
                              }
                              setFile(f);
                              setError("");
                            }
                          }}
                          accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,.gif,.webp,.md,.txt"
                          className="absolute inset-0 cursor-pointer opacity-0"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <Button type="submit" disabled={submitting || !title || !author}>
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Add Material
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Materials Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          </div>
        ) : materials.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2">
            {materials.map((mat) => {
              const cfg = typeConfig[mat.type] || typeConfig["Book"];
              const statusColor =
                statusColors[mat.status] || statusColors["Reading"];

              return (
                <div key={mat.id} className="group relative">
                  <Card className="group/card h-full">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${cfg.color} text-2xl`}
                        >
                          {cfg.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-400">
                              {mat.type}
                            </span>
                          </div>
                          <h3 className="font-display text-sm font-bold text-white group-hover/card:text-cyan-400 transition-colors">
                            {mat.title}
                          </h3>
                          <p className="text-xs text-white/40 mt-0.5">
                            {mat.author}
                          </p>
                          {mat.description && (
                            <p className="text-xs text-white/30 mt-1 line-clamp-1">
                              {mat.description}
                            </p>
                          )}
                          <div className="mt-2 flex items-center gap-2">
                            <span
                              className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${statusColor}`}
                            >
                              {mat.status}
                            </span>
                            {mat.fileUrl && (
                              <a
                                href={`${mat.fileUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-400/80"
                              >
                                <FileText className="h-3 w-3" />
                                {mat.fileName || "File"}
                              </a>
                            )}
                            {mat.link && (
                              <a
                                href={mat.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-400/80"
                              >
                                <ExternalLink className="h-3 w-3" />
                                Link
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Delete button */}
                  {session && (
                    <button
                      onClick={() => handleDelete(mat.id)}
                      disabled={deletingId === mat.id}
                      className="absolute top-3 right-3 z-10 rounded-lg p-1.5 transition-all opacity-0 group-hover:opacity-100 hover:bg-red-500/10"
                      title="Delete material"
                    >
                      <Trash2
                        className={`h-3.5 w-3.5 ${
                          deletingId === mat.id
                            ? "text-red-300 animate-pulse"
                            : "text-white/30 hover:text-red-400"
                        }`}
                      />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center">
            <GraduationCap className="mx-auto h-12 w-12 text-white/20" />
            <p className="mt-4 text-lg text-white/40">
              No study materials yet
            </p>
            {session && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setShowUpload(true)}
              >
                <Plus className="h-4 w-4" />
                Add your first material
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
