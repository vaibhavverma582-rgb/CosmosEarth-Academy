"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Images,
  Search,
  Download,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageLightbox } from "@/components/gallery/ImageLightbox";

interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  downloads: number;
  uploader: { id: string; name: string; avatar?: string };
  createdAt: string;
}

interface Category {
  name: string;
  count: number;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const fetchImages = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (selectedCategory !== "All") params.set("category", selectedCategory);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/gallery?${params}`
      );
      const data = await res.json();
      setImages(data.data || []);
    } catch (error) {
      console.error("Failed to fetch gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/gallery/categories`
      );
      const data = await res.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchImages();
  }, [searchQuery, selectedCategory]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
              <span className="gradient-text-cyan">Image</span> Gallery
            </h1>
            <p className="mt-2 text-white/50">
              Stunning astronomy, geology, and space imagery — free to download
            </p>
          </div>

        </div>

        {/* Search + Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                selectedCategory === "All"
                  ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/30"
                  : "bg-white/5 text-white/50 border border-transparent hover:bg-white/10"
              }`}
            >
              All ({images.length})
            </button>
            {categories.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedCategory(c.name)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  selectedCategory === c.name
                    ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/30"
                    : "bg-white/5 text-white/50 border border-transparent hover:bg-white/10"
                }`}
              >
                {c.name} ({c.count})
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          </div>
        ) : images.length > 0 ? (
          <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
            {images.map((image, i) => (
              <div
                key={image.id}
                className="mb-4 break-inside-avoid cursor-pointer group"
                onClick={() => openLightbox(i)}
              >
                <div className="relative overflow-hidden rounded-xl border border-white/5 transition-all hover:border-white/20">
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full transition-transform group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100 p-3">
                    <h3 className="text-sm font-semibold text-white line-clamp-1">
                      {image.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-white/50">
                      <Badge variant="outline" className="text-[10px]">
                        {image.category}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {image.downloads}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <Images className="mx-auto h-12 w-12 text-white/20" />
            <p className="mt-4 text-lg text-white/40">No images found</p>

          </div>
        )}

        {/* Lightbox */}
        <ImageLightbox
          images={images}
          currentIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onNavigate={setLightboxIndex}
        />
      </div>
    </div>
  );
}
