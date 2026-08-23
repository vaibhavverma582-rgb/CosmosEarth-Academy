"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Loader2, Plus, Trash2, Edit, Eye, EyeOff, Package, ArrowLeft,
  Upload, X, Tag, DollarSign, FolderOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Product {
  id: string;
  title: string;
  description: string | null;
  type: string;
  category: string;
  subcategory: string | null;
  tags: string | null;
  coverImage: string | null;
  fileUrl: string | null;
  fileName: string | null;
  price: number;
  salePrice: number | null;
  isFree: boolean;
  published: boolean;
  downloads: number;
  createdAt: string;
}

const types = ["Study Notes", "PDF Notes", "E-books", "Books", "Study Guides", "Question Papers", "Practice Materials", "Educational Documents", "Other"];
const categories = ["Geology", "Geography", "Astronomy", "Current Affairs", "General Science"];

export default function StoreAdminPage() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", type: "Study Notes", category: "Astronomy",
    subcategory: "", tags: "", price: "", salePrice: "", isFree: "true", published: "true",
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [mainFile, setMainFile] = useState<File | null>(null);

  useEffect(() => {
    if (session?.user?.id) fetchProducts();
  }, [session?.user?.id]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/store?limit=100`, {
        headers: { "x-user-id": session!.user.id },
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data.data);
      }
    } catch {} finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!form.title) return alert("Title is required");
    setUploading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (coverFile) formData.append("coverImage", coverFile);
      if (mainFile) formData.append("file", mainFile);

      const url = editingId ? `${API_URL}/api/store/${editingId}` : `${API_URL}/api/store`;
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "x-user-id": session!.user.id },
        body: formData,
      });

      if (res.ok) {
        setShowForm(false);
        resetForm();
        fetchProducts();
      } else {
        const err = await res.json();
        alert(err.error || "Failed");
      }
    } catch { alert("Failed to save"); } finally { setUploading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await fetch(`${API_URL}/api/store/${id}`, {
        method: "DELETE",
        headers: { "x-user-id": session!.user.id },
      });
      fetchProducts();
    } catch {}
  };

  const resetForm = () => {
    setForm({ title: "", description: "", type: "Study Notes", category: "Astronomy", subcategory: "", tags: "", price: "", salePrice: "", isFree: "true", published: "true" });
    setCoverFile(null);
    setMainFile(null);
    setEditingId(null);
  };

  const startEdit = (p: Product) => {
    setForm({
      title: p.title, description: p.description || "", type: p.type, category: p.category,
      subcategory: p.subcategory || "", tags: p.tags || "", price: p.price.toString(),
      salePrice: p.salePrice?.toString() || "", isFree: p.isFree ? "true" : "false", published: p.published ? "true" : "false",
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  if (status === "loading" || loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-cyan-400" /></div>;
  }

  return (
    <div className="max-w-5xl">
      <Link href="/admin" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60 transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Admin
      </Link>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <Badge variant="outline" className="mb-2"><Package className="mr-1 h-3 w-3" /> Store</Badge>
          <h1 className="font-display text-3xl font-bold text-white">Study Material Store</h1>
          <p className="mt-1 text-sm text-white/50">Manage products, pricing, and files</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="admin-stat-card mb-8 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-bold text-white">{editingId ? "Edit Product" : "Add New Product"}</h3>
            <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X className="h-5 w-5" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs text-white/50 mb-1">Title *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Enter title" className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-white/50 mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Enter description" rows={3} className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Type</label>
              <Select value={form.type} onChange={(v) => setForm({ ...form, type: v })} options={types.map(t => ({ label: t, value: t }))} />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Category</label>
              <Select value={form.category} onChange={(v) => setForm({ ...form, category: v })} options={categories.map(c => ({ label: c, value: c }))} />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Tags (comma-separated)</label>
              <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="tag1, tag2" className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Access</label>
              <Select value={form.isFree} onChange={(v) => setForm({ ...form, isFree: v })} options={[{ label: "Free", value: "true" }, { label: "Paid", value: "false" }]} />
            </div>
            {form.isFree === "false" && (
              <>
                <div>
                  <label className="block text-xs text-white/50 mb-1">Price (₹)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0" className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">Sale Price (₹)</label>
                  <input type="number" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: e.target.value })} placeholder="0" className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none" />
                </div>
              </>
            )}
            <div>
              <label className="block text-xs text-white/50 mb-1">Cover Image</label>
              <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} className="w-full text-xs text-white/50 file:mr-2 file:rounded-lg file:border-0 file:bg-cyan-400/20 file:px-3 file:py-1.5 file:text-xs file:text-cyan-400" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Product File</label>
              <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.epub,.zip" onChange={(e) => setMainFile(e.target.files?.[0] || null)} className="w-full text-xs text-white/50 file:mr-2 file:rounded-lg file:border-0 file:bg-cyan-400/20 file:px-3 file:py-1.5 file:text-xs file:text-cyan-400" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Status</label>
              <Select value={form.published} onChange={(v) => setForm({ ...form, published: v })} options={[{ label: "Published", value: "true" }, { label: "Draft", value: "false" }]} />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button onClick={() => setShowForm(false)} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 hover:text-white">Cancel</button>
            <button onClick={handleSubmit} disabled={uploading} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {editingId ? "Update" : "Create"}
            </button>
          </div>
        </div>
      )}

      {/* Products List */}
      {products.length === 0 ? (
        <div className="admin-stat-card p-12 text-center">
          <Package className="mx-auto mb-3 h-8 w-8 text-white/20" />
          <p className="text-sm text-white/40">No products yet. Add your first study material.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div key={p.id} className="admin-stat-card p-4 flex items-center gap-4">
              {p.coverImage ? (
                <img src={`${API_URL}${p.coverImage}`} alt="" className="h-14 w-14 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white/5 shrink-0">
                  <FolderOpen className="h-6 w-6 text-white/20" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-white truncate">{p.title}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">{p.type}</Badge>
                  <Badge variant="outline" className="text-[10px]">{p.category}</Badge>
                  {p.isFree ? (
                    <Badge className="text-[10px] bg-green-500/20 text-green-400">Free</Badge>
                  ) : (
                    <Badge className="text-[10px] bg-orange-400/20 text-orange-400">
                      <DollarSign className="mr-0.5 h-2.5 w-2.5" />₹{p.salePrice || p.price}
                    </Badge>
                  )}
                  {!p.published && <Badge className="text-[10px] bg-yellow-500/20 text-yellow-400">Draft</Badge>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => startEdit(p)} className="rounded-lg border border-white/10 p-2 text-white/40 hover:text-cyan-300 transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(p.id)} className="rounded-lg border border-white/10 p-2 text-white/40 hover:text-red-400 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
