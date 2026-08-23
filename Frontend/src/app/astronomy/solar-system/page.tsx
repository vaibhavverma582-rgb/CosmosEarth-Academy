"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Dynamic import to avoid SSR issues with Three.js
const SolarSystem3D = dynamic(
  () =>
    import("@/components/astronomy/SolarSystem3D").then(
      (mod) => mod.SolarSystem3D
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[500px] items-center justify-center rounded-2xl border border-white/10 bg-cosmos-navy">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          <p className="mt-4 text-sm text-white/50">
            Loading 3D solar system...
          </p>
        </div>
      </div>
    ),
  }
);

export default function SolarSystemPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/astronomy"
              className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Astronomy
            </Link>
            <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
              <span className="gradient-text-cyan">3D</span> Solar System
            </h1>
            <p className="mt-2 text-white/50">
              An interactive visualization of our cosmic neighborhood
            </p>
          </div>
          <Badge variant="outline" className="hidden sm:inline-flex">
            <Globe className="mr-1 h-3 w-3" />
            Interactive
          </Badge>
        </div>

        {/* 3D Scene */}
        <SolarSystem3D />

        {/* Planet quick links */}
        <div className="mt-8 grid grid-cols-4 gap-2 sm:grid-cols-8">
          {[
            { name: "Mercury", color: "#8c7e6d" },
            { name: "Venus", color: "#c4a35a" },
            { name: "Earth", color: "#4a90d9" },
            { name: "Mars", color: "#c1440e" },
            { name: "Jupiter", color: "#c88b3a" },
            { name: "Saturn", color: "#e8c36a" },
            { name: "Uranus", color: "#73c2d4" },
            { name: "Neptune", color: "#3b5998" },
          ].map((p) => (
            <Link
              key={p.name}
              href={`/astronomy/planets/${p.name.toLowerCase()}`}
              className="group flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-white/5 p-3 transition-all hover:border-white/20 hover:bg-white/10"
            >
              <div
                className="h-8 w-8 rounded-full transition-transform group-hover:scale-110"
                style={{
                  background: `radial-gradient(circle at 35% 35%, ${p.color}cc, ${p.color}66)`,
                }}
              />
              <span className="text-[11px] text-white/50 group-hover:text-white/80">
                {p.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
