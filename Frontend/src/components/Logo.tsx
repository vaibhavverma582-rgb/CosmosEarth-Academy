"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/wallpaper/logo`)
      .then((r) => r.json())
      .then((d) => {
        if (d.data) setLogoUrl(d.data);
      })
      .catch(() => {});
  }, []);

  const iconSize = size === "sm" ? 28 : size === "md" ? 32 : 40;
  const textSize = size === "sm" ? "text-[13px]" : size === "md" ? "text-[15px]" : "text-lg";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {logoUrl ? (
        <img
          src={`${API_URL}${logoUrl}`}
          alt="CosmosEarth Academy"
          className="shrink-0 rounded-full object-cover"
          style={{ width: iconSize, height: iconSize }}
        />
      ) : (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <circle cx="50" cy="50" r="48" stroke="url(#logoGradient)" strokeWidth="3" fill="none" />
          <circle cx="50" cy="38" r="18" fill="#1a3a5c" />
          <ellipse cx="50" cy="38" rx="18" ry="18" fill="url(#globeGradient)" />
          <path d="M42 28 Q48 25 55 28 Q58 32 56 38 Q52 42 46 40 Q40 36 42 28Z" fill="#2d8a4e" opacity="0.8" />
          <path d="M38 34 Q42 30 48 33 Q50 38 46 42 Q40 40 38 34Z" fill="#3a9e5c" opacity="0.7" />
          <path d="M55 30 Q60 28 62 34 Q60 38 56 36 Q53 32 55 30Z" fill="#2d8a4e" opacity="0.6" />
          <ellipse cx="44" cy="32" rx="6" ry="8" fill="white" opacity="0.15" />
          <ellipse cx="50" cy="38" rx="28" ry="8" stroke="#9b59b6" strokeWidth="1.5" fill="none" opacity="0.6" transform="rotate(-15 50 38)" />
          <circle cx="25" cy="20" r="1.5" fill="#f1c40f" />
          <circle cx="78" cy="18" r="1" fill="#f1c40f" />
          <circle cx="82" cy="30" r="1.5" fill="#f1c40f" />
          <circle cx="20" cy="50" r="1" fill="#f1c40f" />
          <circle cx="85" cy="50" r="1" fill="#f1c40f" />
          <path d="M30 62 L50 58 L70 62 L70 72 L50 68 L30 72Z" fill="#1a2a4a" stroke="#c4a052" strokeWidth="0.8" />
          <line x1="50" y1="58" x2="50" y2="68" stroke="#c4a052" strokeWidth="0.8" />
          <path d="M30 62 L50 66 L70 62" fill="none" stroke="#c4a052" strokeWidth="0.5" />
          <path d="M18 55 Q14 45 18 35 Q22 45 18 55Z" fill="#c4a052" opacity="0.7" />
          <path d="M22 58 Q18 48 22 38 Q26 48 22 58Z" fill="#c4a052" opacity="0.6" />
          <path d="M82 55 Q86 45 82 35 Q78 45 82 55Z" fill="#c4a052" opacity="0.7" />
          <path d="M78 58 Q82 48 78 38 Q74 48 78 58Z" fill="#c4a052" opacity="0.6" />
          <text x="50" y="85" textAnchor="middle" fill="#1a2a4a" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
            Cosmos<tspan fill="#c4a052">Earth</tspan>
          </text>
          <text x="50" y="95" textAnchor="middle" fill="#c4a052" fontSize="5" fontWeight="600" fontFamily="sans-serif" letterSpacing="3">
            ACADEMY
          </text>
          <defs>
            <linearGradient id="logoGradient" x1="0" y1="0" x2="100" y2="100">
              <stop offset="0%" stopColor="#1a2a4a" />
              <stop offset="50%" stopColor="#9b59b6" />
              <stop offset="100%" stopColor="#c4a052" />
            </linearGradient>
            <radialGradient id="globeGradient" cx="40%" cy="35%">
              <stop offset="0%" stopColor="#2980b9" />
              <stop offset="100%" stopColor="#1a3a5c" />
            </radialGradient>
          </defs>
        </svg>
      )}

      {showText && (
        <span className={`font-display ${textSize} font-bold tracking-tight text-white/90`}>
          Cosmos<span className="text-cyan-400">Earth</span>
        </span>
      )}
    </div>
  );
}
