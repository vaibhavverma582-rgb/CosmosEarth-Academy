"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Loader2,
  Upload,
  X,
  Image,
  Settings,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Wallpaper {
  id: string;
  imageUrl: string;
  position: string;
  size: string;
  overlayOpacity: number;
  createdAt: string;
}

const positions = [
  { value: "center", label: "Center" },
  { value: "top", label: "Top" },
  { value: "bottom", label: "Bottom" },
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
];

const sizes = [
  { value: "cover", label: "Cover" },
  { value: "contain", label: "Contain" },
  { value: "100% auto", label: "Full Width" },
  { value: "auto 100%", label: "Full Height" },
];

export default function AdminWallpaperPage() {
  const { data: session, status } = useSession();

  const [wallpaper, setWallpaper] = useState<Wallpaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Logo
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);

  // Settings
  const [position, setPosition] = useState("center");
  const [size, setSize] = useState("cover");
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);

  // Fetch current wallpaper and logo
  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/wallpaper`).then(r => r.json()),
      fetch(`${API_URL}/api/wallpaper/logo`).then(r => r.json()),
    ]).then(([wallpaperData, logoData]) => {
      if (wallpaperData.data) {
        setWallpaper(wallpaperData.data);
        setPosition(wallpaperData.data.position);
        setSize(wallpaperData.data.size);
        setOverlayOpacity(wallpaperData.data.overlayOpacity);
      }
      if (logoData.data) setLogoUrl(logoData.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setError("");

    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  // Handle logo file selection
  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedLogoFile(file);
    setError("");

    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  // Upload logo
  const handleLogoUpload = async () => {
    if (!selectedLogoFile) return;

    setLogoUploading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("logo", selectedLogoFile);

      const res = await fetch(`${API_URL}/api/wallpaper/logo`, {
        method: "POST",
        headers: { "x-user-id": session?.user?.id || "" },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setLogoUrl(data.data);
        setLogoPreview(null);
        setSelectedLogoFile(null);
        setSuccess("Logo uploaded successfully!");
        window.dispatchEvent(new Event("logo-updated"));
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Logo upload failed");
      }
    } catch {
      setError("Failed to upload logo");
    } finally {
      setLogoUploading(false);
    }
  };

  // Delete logo
  const handleLogoDelete = async () => {
    setDeleting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_URL}/api/wallpaper/logo`, {
        method: "DELETE",
        headers: { "x-user-id": session?.user?.id || "" },
      });

      if (res.ok) {
        setLogoUrl(null);
        setSuccess("Logo removed. Using default SVG logo.");
        window.dispatchEvent(new Event("logo-updated"));
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to remove logo");
      }
    } catch {
      setError("Failed to remove logo");
    } finally {
      setDeleting(false);
    }
  };

  // Upload and set wallpaper
  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("position", position);
      formData.append("size", size);
      formData.append("overlayOpacity", String(overlayOpacity));

      const res = await fetch(`${API_URL}/api/wallpaper`, {
        method: "POST",
        headers: { "x-user-id": session?.user?.id || "" },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setWallpaper(data.data);
        setPreview(null);
        setSelectedFile(null);
        setSuccess("Wallpaper uploaded and applied!");
        window.dispatchEvent(new Event("wallpaper-updated"));
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Upload failed");
      }
    } catch {
      setError("Failed to upload wallpaper");
    } finally {
      setUploading(false);
    }
  };

  // Update settings
  const handleSaveSettings = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_URL}/api/wallpaper/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": session?.user?.id || "",
        },
        body: JSON.stringify({ position, size, overlayOpacity }),
      });

      if (res.ok) {
        const data = await res.json();
        setWallpaper(data.data);
        setSuccess("Settings saved!");
        window.dispatchEvent(new Event("wallpaper-updated"));
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save");
      }
    } catch {
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  // Delete wallpaper
  const handleDelete = async () => {
    if (!confirm("Remove the current website wallpaper?")) return;

    setDeleting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_URL}/api/wallpaper`, {
        method: "DELETE",
        headers: { "x-user-id": session?.user?.id || "" },
      });

      if (res.ok) {
        setWallpaper(null);
        setPreview(null);
        setSelectedFile(null);
        setPosition("center");
        setSize("cover");
        setOverlayOpacity(0.5);
        setSuccess("Wallpaper removed. Default background restored.");
        window.dispatchEvent(new Event("wallpaper-updated"));
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to delete");
      }
    } catch {
      setError("Failed to delete wallpaper");
    } finally {
      setDeleting(false);
    }
  };

  // Auth check
  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-white/40">Sign in as admin to manage wallpaper</p>
          <Link href="/auth/login">
            <Button className="mt-4">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Badge variant="outline" className="mb-4">
            <Image className="mr-1 h-3 w-3" />
            Wallpaper
          </Badge>
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Website <span className="gradient-text-cyan">Wallpaper</span>
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Upload and manage the website background image. Admin only.
          </p>
        </div>

        {/* Status messages */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {success}
          </div>
        )}

        {/* Website Logo */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-display text-sm font-bold text-white mb-4">Website Logo</h3>
            <div className="flex flex-col gap-4">
              {/* Current Logo */}
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  {logoUrl ? (
                    <img src={`${API_URL}${logoUrl}`} alt="Current logo" className="h-14 w-14 rounded-full object-cover" />
                  ) : (
                    <span className="text-xs text-white/30">Default</span>
                  )}
                </div>
                <div>
                  <p className="text-sm text-white/60">{logoUrl ? "Custom logo uploaded" : "Using default SVG logo"}</p>
                  {logoUrl && (
                    <button
                      onClick={handleLogoDelete}
                      disabled={deleting}
                      className="mt-1 text-xs text-red-400 hover:text-red-300"
                    >
                      {deleting ? "Removing..." : "Remove logo"}
                    </button>
                  )}
                </div>
              </div>

              {/* Upload Logo */}
              <div>
                <label className="mb-2 block text-xs font-medium text-white/50">Upload new logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoSelect}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white file:mr-3 file:rounded-lg file:border-0 file:bg-cyan-500/20 file:px-3 file:py-1 file:text-xs file:text-cyan-400"
                />
              </div>

              {/* Logo Preview & Upload Button */}
              {logoPreview && (
                <div className="flex items-center gap-4">
                  <img src={logoPreview} alt="Logo preview" className="h-16 w-16 rounded-full object-cover border border-white/10" />
                  <div className="flex gap-2">
                    <button
                      onClick={handleLogoUpload}
                      disabled={logoUploading}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white"
                    >
                      {logoUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      {logoUploading ? "Uploading..." : "Save Logo"}
                    </button>
                    <button
                      onClick={() => { setLogoPreview(null); setSelectedLogoFile(null); }}
                      className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/50 hover:bg-white/5"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Current Wallpaper */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-display text-sm font-bold text-white mb-4">Current Wallpaper</h3>
            {wallpaper ? (
              <div className="space-y-4">
                <div className="overflow-hidden rounded-xl border border-white/10">
                  <img
                    src={wallpaper.imageUrl}
                    alt="Current wallpaper"
                    className="h-48 w-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/30">
                    Active since {new Date(wallpaper.createdAt).toLocaleDateString()}
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="gap-1.5"
                  >
                    {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 border border-dashed border-white/10 rounded-xl">
                <Image className="h-10 w-10 text-white/20 mb-3" />
                <p className="text-sm text-white/40">No custom wallpaper set</p>
                <p className="text-xs text-white/30 mt-1">Default space background is active</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload New */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-display text-sm font-bold text-white mb-4">Upload New Wallpaper</h3>

            {/* File input */}
            <label className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-dashed border-white/20 bg-white/5 p-8 text-center transition-colors hover:border-cyan-400/30 hover:bg-white/10">
              <Upload className="h-8 w-8 text-white/30" />
              <div>
                <p className="text-sm font-medium text-white/70">
                  {selectedFile ? selectedFile.name : "Click to select image"}
                </p>
                <p className="text-xs text-white/30 mt-1">JPEG, PNG, GIF, WebP — max 20MB</p>
              </div>
              <input
                id="wallpaper-file" name="wallpaper" type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>

            {/* Preview */}
            {preview && (
              <div className="mt-4 relative">
                <img src={preview} alt="Preview" className="h-48 w-full rounded-xl object-cover" />
                <button
                  onClick={() => { setPreview(null); setSelectedFile(null); }}
                  className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white/60 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Upload button */}
            {selectedFile && (
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="mt-4 w-full gap-2"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploading ? "Uploading..." : "Upload & Apply Wallpaper"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Background Settings */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-display text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Background Settings
            </h3>

            <div className="space-y-5">
              {/* Position */}
              <div>
                <label className="mb-1.5 block text-sm text-white/70">Position</label>
                <div className="flex flex-wrap gap-2">
                  {positions.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPosition(p.value)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        position === p.value
                          ? "bg-cyan-400 text-[#050710]"
                          : "border border-white/10 bg-white/5 text-white/50 hover:text-white"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="mb-1.5 block text-sm text-white/70">Size</label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setSize(s.value)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        size === s.value
                          ? "bg-cyan-400 text-[#050710]"
                          : "border border-white/10 bg-white/5 text-white/50 hover:text-white"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Overlay Opacity */}
              <div>
                <label className="mb-1.5 block text-sm text-white/70">
                  Overlay Opacity: {Math.round(overlayOpacity * 100)}%
                </label>
                <p className="text-xs text-white/30 mb-2">Higher = darker overlay, more readable text</p>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={overlayOpacity}
                  onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400"
                />
                <div className="flex justify-between text-xs text-white/20 mt-1">
                  <span>Transparent</span>
                  <span>Opaque</span>
                </div>
              </div>

              {/* Save settings */}
              <Button
                onClick={handleSaveSettings}
                disabled={saving || !wallpaper}
                className="w-full gap-2"
                variant="outline"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Settings className="h-4 w-4" />}
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
