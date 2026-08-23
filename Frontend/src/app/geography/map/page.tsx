"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Map } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const WorldMap = dynamic(
  () => import("@/components/geography/WorldMap").then((m) => m.WorldMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[500px] items-center justify-center rounded-2xl border border-white/10 bg-cosmos-navy">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          <p className="mt-4 text-sm text-white/50">Loading world map...</p>
        </div>
      </div>
    ),
  }
);

export default function MapPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/geography"
              className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Geography
            </Link>
            <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
              <span className="gradient-text-cyan">World</span> Map
            </h1>
            <p className="mt-2 text-white/50">
              Switch between satellite, countries, climate, and biome layers
            </p>
          </div>
          <Badge variant="outline" className="hidden sm:inline-flex">
            <Map className="mr-1 h-3 w-3" />
            Interactive
          </Badge>
        </div>

        {/* Map */}
        <WorldMap />

        {/* Layer descriptions */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Satellite",
              description: "Real satellite imagery of Earth's surface — see deserts, forests, cities, and ice caps from space.",
              color: "border-cyan-400/20",
            },
            {
              title: "Countries",
              description: "Political boundaries with capitals, populations, and area data. Click any country for details.",
              color: "border-purple-400/20",
            },
            {
              title: "Climate Zones",
              description: "Köppen climate classification overlay — see tropical, arid, temperate, and polar zones.",
              color: "border-orange-400/20",
            },
            {
              title: "Biomes",
              description: "Major ecosystem types — rainforests, deserts, tundra, coral reefs, and more.",
              color: "border-green-500/20",
            },
          ].map((layer) => (
            <div
              key={layer.title}
              className={`glass-card rounded-xl border ${layer.color} p-4`}
            >
              <h3 className="text-sm font-bold text-white">{layer.title}</h3>
              <p className="mt-1 text-xs text-white/40 leading-relaxed">
                {layer.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
