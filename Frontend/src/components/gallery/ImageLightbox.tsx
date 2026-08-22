"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut, Share2 } from "lucide-react";

interface LightboxImage {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  uploader?: { name: string };
}

interface ImageLightboxProps {
  images: LightboxImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function ImageLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: ImageLightboxProps) {
  const [zoom, setZoom] = useState(1);
  const image = images[currentIndex];

  const goNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      onNavigate(currentIndex + 1);
      setZoom(1);
    }
  }, [currentIndex, images.length, onNavigate]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
      setZoom(1);
    }
  }, [currentIndex, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, goNext, goPrev, onClose]);

  if (!isOpen || !image) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fade-in">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/70">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Navigation arrows */}
      {currentIndex > 0 && (
        <button
          onClick={goPrev}
          className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}
      {currentIndex < images.length - 1 && (
        <button
          onClick={goNext}
          className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Image */}
      <div className="flex max-h-[85vh] max-w-[90vw] items-center justify-center">
        <img
          src={image.imageUrl}
          alt={image.title}
          className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain transition-transform"
          style={{ transform: `scale(${zoom})` }}
          onClick={() => setZoom(zoom === 1 ? 1.5 : 1)}
        />
      </div>

      {/* Bottom info bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
        <div className="mx-auto flex max-w-4xl items-end justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">{image.title}</h3>
            {image.description && (
              <p className="mt-1 text-sm text-white/50">{image.description}</p>
            )}
            <div className="mt-2 flex items-center gap-3 text-xs text-white/40">
              <span>{image.category}</span>
              {image.uploader && <span>by {image.uploader.name}</span>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom(zoom === 1 ? 1.5 : zoom === 1.5 ? 2 : 1)}
              className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            >
              {zoom > 1 ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
            </button>
            <a
              href={image.imageUrl}
              download
              className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            >
              <Download className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
