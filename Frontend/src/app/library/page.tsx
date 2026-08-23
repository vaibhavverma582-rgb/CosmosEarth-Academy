"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen, Download, ShoppingCart, ArrowLeft, Loader2, ExternalLink,
  FileText, Package,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Purchase {
  id: string;
  createdAt: string;
  product: { id: string; title: string; coverImage: string | null; type: string; category: string; fileUrl: string | null } | null;
  book: { id: string; title: string; coverImage: string | null; author: string; fileUrl: string | null } | null;
  order: { orderNumber: string; createdAt: string };
}

interface DownloadItem {
  id: string;
  fileUrl: string;
  fileName: string | null;
  createdAt: string;
}

export default function LibraryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetchLibrary();
  }, [session?.user?.id]);

  const fetchLibrary = async () => {
    try {
      const res = await fetch(`${API_URL}/api/purchases/user/library`, {
        headers: { "x-user-id": session!.user.id },
      });
      if (res.ok) {
        const data = await res.json();
        setPurchases(data.data.purchases);
        setDownloads(data.data.downloads);
      }
    } catch {} finally { setLoading(false); }
  };

  const handleDownload = async (purchaseId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/purchases/${purchaseId}/download`, {
        method: "POST",
        headers: { "x-user-id": session!.user.id },
      });
      if (res.ok) {
        const data = await res.json();
        // Use relative URL through Next.js rewrite proxy
        const link = document.createElement("a");
        link.href = data.downloadUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch {}
  };

  if (status === "loading" || loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-cyan-400" /></div>;
  }

  if (!session) {
    router.push("/auth/login");
    return null;
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to site
        </Link>

        <div className="mb-8">
          <Badge variant="outline" className="mb-2"><BookOpen className="mr-1 h-3 w-3" /> Library</Badge>
          <h1 className="font-display text-3xl font-bold text-white">My Library</h1>
          <p className="mt-1 text-sm text-white/50">Your purchased and downloaded materials</p>
        </div>

        {/* Purchased Items */}
        <div className="mb-8">
          <h2 className="mb-4 text-sm font-bold text-white/60 uppercase tracking-wider">Purchased Materials</h2>
          {purchases.length === 0 ? (
            <div className="admin-stat-card p-8 text-center">
              <ShoppingCart className="mx-auto mb-3 h-8 w-8 text-white/20" />
              <p className="text-sm text-white/40">No purchases yet.</p>
              <Link href="/store" className="mt-3 inline-block text-xs text-cyan-400 hover:underline">
                Browse Store →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {purchases.map((p) => {
                const item = p.product || p.book;
                return (
                  <div key={p.id} className="admin-stat-card p-4 flex items-center gap-4">
                    {item?.coverImage ? (
                      <img src={`${API_URL}${item.coverImage}`} alt="" className="h-14 w-14 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white/5 shrink-0">
                        <Package className="h-6 w-6 text-white/20" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-white truncate">{item?.title}</h3>
                      <p className="text-xs text-white/40">
                        {p.product?.type || "Book"} • {p.product?.category || (p.book as any)?.author}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDownload(p.id)}
                      className="flex items-center gap-1.5 rounded-lg bg-cyan-400/10 border border-cyan-400/30 px-3 py-1.5 text-xs font-medium text-cyan-400 hover:bg-cyan-400/20 transition-colors shrink-0"
                    >
                      <Download className="h-3.5 w-3.5" /> Download
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Download History */}
        <div>
          <h2 className="mb-4 text-sm font-bold text-white/60 uppercase tracking-wider">Download History</h2>
          {downloads.length === 0 ? (
            <div className="admin-stat-card p-8 text-center">
              <Download className="mx-auto mb-3 h-8 w-8 text-white/20" />
              <p className="text-sm text-white/40">No downloads yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5 admin-stat-card">
              {downloads.map((d) => (
                <div key={d.id} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-white/30" />
                    <span className="text-sm text-white">{d.fileName || "File"}</span>
                  </div>
                  <span className="text-[10px] text-white/30">{new Date(d.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
