"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Map, Star, Search, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { constellations } from "@/data/constellations";
import { ConstellationCard } from "@/components/astronomy/ConstellationCard";

const hemispheres = ["All", "Northern", "Southern", "Both"];
const seasons = ["All", "Winter", "Spring", "Summer", "Autumn"];

export default function ConstellationsPage() {
  const [selectedHemisphere, setSelectedHemisphere] = useState("All");
  const [selectedSeason, setSelectedSeason] = useState("All");
  const [expandedConstellation, setExpandedConstellation] = useState<string | null>(null);

  const filtered = constellations.filter((c) => {
    const matchHemisphere =
      selectedHemisphere === "All" || c.hemisphere === selectedHemisphere;
    const matchSeason =
      selectedSeason === "All" || c.season === selectedSeason;
    return matchHemisphere && matchSeason;
  });

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/astronomy"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Astronomy
          </Link>
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
            <span className="gradient-text-purple">Constellations</span>{" "}
            of the Night Sky
          </h1>
          <p className="mt-3 max-w-2xl text-white/50">
            The 88 official constellations mapped by the IAU. Explore their
            star patterns, brightest stars, and ancient mythology.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {hemispheres.map((h) => (
              <button
                key={h}
                onClick={() => setSelectedHemisphere(h)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  selectedHemisphere === h
                    ? "bg-cosmos-purple/20 text-cosmos-purple border border-cosmos-purple/30"
                    : "bg-white/5 text-white/50 border border-transparent hover:bg-white/10"
                }`}
              >
                {h}
              </button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {seasons.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSeason(s)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  selectedSeason === s
                    ? "bg-cosmos-cyan/20 text-cosmos-cyan border border-cosmos-cyan/30"
                    : "bg-white/5 text-white/50 border border-transparent hover:bg-white/10"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Constellation grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((c) => (
            <div key={c.slug} id={c.slug}>
              <ConstellationCard
                name={c.name}
                slug={c.slug}
                abbreviation={c.abbreviation}
                stars={c.stars}
                brightestStar={c.brightestStar}
                hemisphere={c.hemisphere}
                season={c.season}
                color={c.color}
              />
            </div>
          ))}
        </div>

        {/* Expanded details */}
        {filtered.map((c) => (
          <div key={`detail-${c.slug}`} id={`detail-${c.slug}`}>
            {/* This section shows when a constellation is expanded */}
          </div>
        ))}

        {/* Detail modals */}
        <div className="mt-12 space-y-6">
          {constellations.map((c) => (
            <Card key={`expanded-${c.slug}`} id={c.slug} className="scroll-mt-24">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">{c.name}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {c.abbreviation}
                      </Badge>
                    </div>
                    <CardDescription className="mt-1">
                      {c.hemisphere} Hemisphere · {c.season} · {c.stars} main
                      stars
                    </CardDescription>
                  </div>
                  <Badge variant="default" className="text-xs">
                    <Star className="mr-1 h-3 w-3 fill-cosmos-gold" />
                    {c.brightestStar}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Star pattern */}
                  <div className="flex items-center justify-center rounded-xl bg-cosmos-navy/50 p-6">
                    <svg viewBox="0 0 100 100" className="h-48 w-48">
                      {[
                        [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
                        [0, 2], [1, 3], [2, 4], [3, 5], [4, 6],
                      ]
                        .slice(0, c.stars)
                        .map(([a, b], i) => (
                          <line
                            key={i}
                            x1={(a * 14) + 8}
                            y1={50 + (i % 2 === 0 ? -15 : 15)}
                            x2={(b * 14) + 8}
                            y2={50 + (i % 2 === 0 ? 15 : -15)}
                            stroke={c.color}
                            strokeOpacity="0.3"
                            strokeWidth="0.5"
                          />
                        ))}
                      {Array.from({ length: c.stars }).map((_, i) => (
                        <g key={i}>
                          <circle
                            cx={(i * 14) + 8}
                            cy={50 + (i % 2 === 0 ? -15 : 15)}
                            r={i === 0 ? 4 : 2.5}
                            fill={c.color}
                          />
                          <circle
                            cx={(i * 14) + 8}
                            cy={50 + (i % 2 === 0 ? -15 : 15)}
                            r={i === 0 ? 8 : 5}
                            fill={c.color}
                            opacity="0.15"
                          />
                        </g>
                      ))}
                    </svg>
                  </div>

                  {/* Text info */}
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-white/80">
                      Mythology
                    </h4>
                    <p className="mb-4 text-sm text-white/50 leading-relaxed">
                      {c.mythology}
                    </p>
                    <h4 className="mb-2 text-sm font-semibold text-white/80">
                      Key Stars
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {c.keyStars.map((star) => (
                        <Badge key={star} variant="outline" className="text-xs">
                          <Star className="mr-1 h-2.5 w-2.5 fill-cosmos-gold" />
                          {star}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
