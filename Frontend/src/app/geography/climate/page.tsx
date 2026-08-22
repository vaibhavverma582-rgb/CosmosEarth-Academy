"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Thermometer, Droplets, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { climateZones } from "@/data/geography/climate";

const categories = [
  "All",
  "Tropical",
  "Arid",
  "Temperate",
  "Continental",
  "Polar",
];

function getZoneCategory(zone: typeof climateZones[0]): string {
  const code = zone.koppenCode;
  if (code.startsWith("A")) return "Tropical";
  if (code.startsWith("B")) return "Arid";
  if (code.startsWith("C")) return "Temperate";
  if (code.startsWith("D")) return "Continental";
  if (code.startsWith("E")) return "Polar";
  return "Other";
}

export default function ClimatePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = climateZones.filter((z) => {
    return selectedCategory === "All" || getZoneCategory(z) === selectedCategory;
  });

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
            <span className="gradient-text-warm">Climate Zones</span>
          </h1>
          <p className="mt-3 max-w-2xl text-white/50">
            Earth&apos;s climate is classified into zones using the Köppen system.
            Temperature, precipitation, and seasonality define each zone.
          </p>
        </div>

        {/* Köppen Overview */}
        <div className="mb-10 glass-card rounded-2xl p-6">
          <h2 className="mb-4 font-display text-lg font-bold text-white">
            The Köppen Climate Classification
          </h2>
          <div className="grid grid-cols-5 gap-3 text-center">
            {[
              { letter: "A", name: "Tropical", color: "#ff6b35" },
              { letter: "B", name: "Arid", color: "#d4a35a" },
              { letter: "C", name: "Temperate", color: "#4a90d9" },
              { letter: "D", name: "Continental", color: "#7b2ff2" },
              { letter: "E", name: "Polar", color: "#a8c4d8" },
            ].map((k) => (
              <div key={k.letter} className="rounded-lg p-3" style={{ backgroundColor: k.color + "15" }}>
                <p className="font-display text-2xl font-bold" style={{ color: k.color }}>
                  {k.letter}
                </p>
                <p className="text-[10px] text-white/50">{k.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-cosmos-orange/20 text-cosmos-orange border border-cosmos-orange/30"
                  : "bg-white/5 text-white/50 border border-transparent hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <p className="mb-6 text-sm text-white/40">
          Showing {filtered.length} climate zone{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Climate zone cards */}
        <div className="grid gap-6 sm:grid-cols-2">
          {filtered.map((zone) => (
            <Card key={zone.slug} className="group overflow-hidden">
              {/* Color bar */}
              <div className="h-1.5" style={{ backgroundColor: zone.color }} />
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg group-hover:text-cosmos-orange transition-colors">
                      {zone.name}
                    </CardTitle>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-[10px]">
                        {zone.koppenCode}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {getZoneCategory(zone)}
                      </Badge>
                    </div>
                  </div>
                  <div
                    className="h-10 w-10 shrink-0 rounded-xl"
                    style={{ backgroundColor: zone.color + "20" }}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/50 leading-relaxed mb-4">
                  {zone.description}
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-3.5 w-3.5 text-cosmos-orange" />
                    <div>
                      <span className="text-white/30">Temperature</span>
                      <p className="text-white/60">{zone.temperature}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="h-3.5 w-3.5 text-cosmos-cyan" />
                    <div>
                      <span className="text-white/30">Rainfall</span>
                      <p className="text-white/60">{zone.precipitation}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-xs text-white/30 mb-1">Vegetation:</p>
                  <p className="text-xs text-white/50">{zone.vegetation}</p>
                </div>

                <div>
                  <p className="text-xs text-white/30 mb-1.5">
                    <MapPin className="inline h-3 w-3 mr-1" />
                    Found in:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {zone.regions.map((r) => (
                      <Badge key={r} variant="outline" className="text-[10px]">
                        {r}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-3 border-t border-white/5 pt-3">
                  <p className="text-xs text-white/30 mb-1">Key characteristics:</p>
                  <div className="space-y-1">
                    {zone.characteristics.map((c, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-white/40">
                        <span style={{ color: zone.color }}>•</span>
                        {c}
                      </div>
                    ))}
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
