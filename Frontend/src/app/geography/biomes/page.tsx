"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  TreePine,
  AlertTriangle,
  PawPrint,
  Leaf,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { biomes } from "@/data/geography/biomes";

const biodiversityColors: Record<string, string> = {
  "Very High": "text-green-400",
  High: "text-cosmos-cyan",
  Medium: "text-cosmos-orange",
  Low: "text-cosmos-purple",
  "Very Low": "text-red-400",
};

export default function BiomesPage() {
  const [selectedBiome, setSelectedBiome] = useState<string | null>(null);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/geography"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Geography
          </Link>
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
            <span className="gradient-text-cyan">Biomes</span> of Earth
          </h1>
          <p className="mt-3 max-w-2xl text-white/50">
            Major ecosystem types defined by climate, vegetation, and wildlife.
            Each biome supports unique communities of life.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-10 grid grid-cols-3 gap-4">
          <div className="glass-card rounded-xl p-4 text-center">
            <TreePine className="mx-auto mb-1 h-5 w-5 text-green-400" />
            <p className="font-display text-xl font-bold text-white">10</p>
            <p className="text-xs text-white/40">Major Biomes</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <PawPrint className="mx-auto mb-1 h-5 w-5 text-cosmos-cyan" />
            <p className="font-display text-xl font-bold text-white">8.7M</p>
            <p className="text-xs text-white/40">Species (est.)</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <AlertTriangle className="mx-auto mb-1 h-5 w-5 text-cosmos-orange" />
            <p className="font-display text-xl font-bold text-white">1M+</p>
            <p className="text-xs text-white/40">Species at risk</p>
          </div>
        </div>

        {/* Biome grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {biomes.map((biome) => (
            <Card
              key={biome.slug}
              className="group overflow-hidden cursor-pointer"
              onClick={() => setSelectedBiome(selectedBiome === biome.slug ? null : biome.slug)}
            >
              {/* Color bar */}
              <div className="h-2" style={{ backgroundColor: biome.color }} />
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{biome.emoji}</span>
                      <CardTitle className="text-lg group-hover:text-cosmos-cyan transition-colors">
                        {biome.name}
                      </CardTitle>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-white/40">
                      <span>{biome.area}</span>
                      <span>·</span>
                      <span>{biome.percentage}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-[10px]">
                      {biome.avgTemp}
                    </Badge>
                    <p className={`mt-1 text-[10px] font-semibold ${biodiversityColors[biome.biodiversity]}`}>
                      {biome.biodiversity} biodiversity
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/50 leading-relaxed mb-3">
                  {biome.description}
                </p>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div>
                    <span className="text-white/30">Rainfall</span>
                    <p className="text-white/60">{biome.rainfall}</p>
                  </div>
                  <div>
                    <span className="text-white/30">Temperature</span>
                    <p className="text-white/60">{biome.avgTemp}</p>
                  </div>
                </div>

                {/* Expanded content */}
                {selectedBiome === biome.slug && (
                  <div className="mt-4 space-y-4 border-t border-white/5 pt-4 animate-fade-in">
                    {/* Key species */}
                    <div>
                      <p className="text-xs font-semibold text-white/60 mb-2 flex items-center gap-1">
                        <PawPrint className="h-3 w-3" />
                        Key Species
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {biome.keySpecies.map((sp) => (
                          <Badge key={sp} variant="outline" className="text-[10px]">
                            {sp}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Threats */}
                    <div>
                      <p className="text-xs font-semibold text-red-400/60 mb-2 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Threats
                      </p>
                      <div className="space-y-1">
                        {biome.threats.map((t, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-xs text-white/40">
                            <span className="text-red-400">•</span>
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Fun fact */}
                    <div className="rounded-lg border border-white/5 bg-white/5 p-3">
                      <p className="text-xs text-white/30 italic">
                        💡 {biome.funFact}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-2 text-center text-xs text-white/30">
                  {selectedBiome === biome.slug ? "Click to collapse" : "Click to expand"}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
