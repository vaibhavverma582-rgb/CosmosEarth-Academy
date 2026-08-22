"use client";

import { useState, useEffect } from "react";

interface YouTubeEmbedProps {
  youtubeId: string;
  title?: string;
  onProgress?: (currentTime: number, duration: number) => void;
  onReady?: (duration: number) => void;
}

export function YouTubeEmbed({ youtubeId, title, onProgress, onReady }: YouTubeEmbedProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
      <div className="relative aspect-video">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-cosmos-navy">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
          </div>
        )}
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&color=white`}
          title={title || "YouTube video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
          onLoad={() => setLoaded(true)}
        />
      </div>
    </div>
  );
}
