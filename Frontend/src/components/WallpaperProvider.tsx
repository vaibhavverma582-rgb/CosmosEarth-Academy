"use client";

import { useEffect, useState } from "react";

interface Wallpaper {
  id: string;
  imageUrl: string;
  position: string;
  size: string;
  overlayOpacity: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function WallpaperProvider() {
  const [wallpaper, setWallpaper] = useState<Wallpaper | null>(null);

  const fetchWallpaper = () => {
    fetch(`${API_URL}/api/wallpaper`)
      .then((r) => r.json())
      .then((d) => {
        if (d.data) {
          setWallpaper(d.data);
          document.body.classList.add("has-wallpaper");
        } else {
          setWallpaper(null);
          document.body.classList.remove("has-wallpaper");
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchWallpaper();

    // Listen for wallpaper updates from admin page
    const handleWallpaperUpdate = () => fetchWallpaper();
    window.addEventListener("wallpaper-updated", handleWallpaperUpdate);

    return () => {
      window.removeEventListener("wallpaper-updated", handleWallpaperUpdate);
      document.body.classList.remove("has-wallpaper");
    };
  }, []);

  if (!wallpaper) return null;

  return (
    <>
      {/* Wallpaper image — above space-bg stars (z-1), below content (z-10) */}
      <div
        className="wallpaper-bg"
        style={{
          backgroundImage: `url(${wallpaper.imageUrl})`,
          backgroundPosition: wallpaper.position,
          backgroundSize: wallpaper.size,
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Dark overlay to keep content readable */}
      <div
        className="wallpaper-overlay"
        style={{ opacity: wallpaper.overlayOpacity }}
      />
    </>
  );
}
