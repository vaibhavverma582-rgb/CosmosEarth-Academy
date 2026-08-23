"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Loader2, BookOpen, Download, Tag, DollarSign, Calendar,
  FileText, ExternalLink, Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function NoteDetailPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleDelete = async () => {
    if (!confirm("Delete this note?")) return;
    try {
      await fetch(`${API_URL}/api/notes/${note.id}`, {
        method: "DELETE",
        headers: { "x-user-id": session!.user.id },
      });
      router.push("/notes");
    } catch {}
  };

  useEffect(() => {
    if (id) {
      fetch(`${API_URL}/api/notes/${id}`)
        .then((r) => r.json())
        .then((d) => setNote(d.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleTrackDownload = async () => {
    if (!note?.fileUrl) return;
    try {
      await fetch(`${API_URL}/api/notes/${note.id}/download`, { method: "POST" });
    } catch {}
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-cyan-400" /></div>;
  if (!note) return <div className="text-center py-20 text-white/40">Note not found</div>;

  return (
    <div className="min-h-screen pt-16">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link href="/notes" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Notes
        </Link>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="h-3 w-3 text-purple-400" />
              <span className="text-xs text-white/40">{note.mediaCategory}</span>
              {note.topic && <span className="text-xs text-white/30">• {note.topic}</span>}
            </div>

            <h1 className="font-display text-2xl font-bold text-white mb-2">{note.title}</h1>
            {note.description && <p className="text-sm text-white/50 mb-4">{note.description}</p>}

            <div className="flex flex-wrap items-center gap-3 mb-4">
              {note.isFree ? (
                <Badge className="bg-green-500/20 text-green-400">Free</Badge>
              ) : (
                <Badge className="bg-orange-400/20 text-orange-400">
                  <DollarSign className="mr-0.5 h-3 w-3" />₹{note.salePrice || note.price}
                </Badge>
              )}
              <Badge variant="outline">{note.fileType?.toUpperCase()}</Badge>
              <span className="text-xs text-white/30">{note.downloads} downloads</span>
            </div>

            {/* File Info */}
            {note.fileName && (
              <div className="rounded-lg border border-white/10 bg-white/5 p-4 mb-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-cyan-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{note.fileName}</p>
                    {note.fileSize && <p className="text-xs text-white/40">{(note.fileSize / 1024 / 1024).toFixed(2)} MB</p>}
                  </div>
                  {note.isFree || !session ? (
                    <a
                      href={note.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleTrackDownload}
                      className="flex items-center gap-1.5 rounded-lg bg-cyan-400/10 border border-cyan-400/30 px-3 py-2 text-xs font-medium text-cyan-400 hover:bg-cyan-400/20 transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" /> Download
                    </a>
                  ) : (
                    <Badge className="bg-orange-400/20 text-orange-400">Purchase Required</Badge>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {note.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {note.tags.map((t: any) => (
                  <Badge key={t.name} variant="outline" className="text-[10px]">{t.name}</Badge>
                ))}
              </div>
            )}

            {/* Delete button */}
            {session && (
              <div className="mt-4">
                <button onClick={handleDelete} className="flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400 hover:bg-red-500/20 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" /> Delete Note
                </button>
              </div>
            )}

            {/* Author + Date */}
            <div className="flex items-center justify-between text-xs text-white/30 border-t border-white/5 pt-4 mt-4">
              <div className="flex items-center gap-2">
                {note.author?.avatar || note.author?.image ? (
                  <img src={`${API_URL}${note.author.avatar || note.author.image}`} alt="" className="h-6 w-6 rounded-full object-cover" />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
                    {note.author?.name?.charAt(0)}
                  </div>
                )}
                <span>{note.author?.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(note.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
