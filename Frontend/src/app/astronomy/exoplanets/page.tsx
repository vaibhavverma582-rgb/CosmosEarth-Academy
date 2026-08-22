"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Search,
  Globe,
  Star,
  Thermometer,
  MapPin,
  Calendar,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { exoplanets } from "@/data/exoplanets";

const methods = [
  "All",
  "Transit",
  "Radial Velocity",
  "Direct Imaging",
  "Gravitational Microlensing",
];

export default function ExoplanetsPage() {
  const [selectedMethod, setSelectedMethod] = useState("All");
  const [showHabitableOnly, setShowHabitableOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = exoplanets.filter((ep) => {
    const matchMethod =
      selectedMethod === "All" || ep.discoveryMethod === selectedMethod;
    const matchHabitable = !showHabitableOnly || ep.habitable;
    const matchSearch =
      ep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.hostStar.toLowerCase().includes(searchQuery.toLowerCase());
    return matchMethod && matchHabitable && matchSearch;
  });

  const habitableCount = exoplanets.filter((e) => e.habitable).length;

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
            <span className="gradient-text-warm">Exoplanet</span> Explorer
          </h1>
          <p className="mt-3 max-w-2xl text-white/50">
            Discover worlds beyond our solar system. Over 5,500 exoplanets
            confirmed — some potentially habitable. These are the most
            fascinating.
          </p>
        </div>

        {/* Stats bar */}
        <div className="mb-8 glass-card rounded-2xl p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <p className="font-display text-2xl font-bold text-white">
                  {exoplanets.length}
                </p>
                <p className="text-xs text-white/40">Featured planets</p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <p className="font-display text-2xl font-bold text-green-400">
                  {habitableCount}
                </p>
                <p className="text-xs text-white/40">Potentially habitable</p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <p className="font-display text-2xl font-bold text-white">
                  5,500+
                </p>
                <p className="text-xs text-white/40">Confirmed total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search by name or host star..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-cosmos-cyan/50 focus:outline-none focus:ring-1 focus:ring-cosmos-cyan/30"
            />
          </div>
          <button
            onClick={() => setShowHabitableOnly(!showHabitableOnly)}
            className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              showHabitableOnly
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
            }`}
          >
            <Globe className="inline h-4 w-4 mr-1.5" />
            Habitable Only
          </button>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {methods.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMethod(m)}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                selectedMethod === m
                  ? "bg-cosmos-pink/20 text-cosmos-pink border border-cosmos-pink/30"
                  : "bg-white/5 text-white/50 border border-transparent hover:bg-white/10"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="mb-6 text-sm text-white/40">
          Showing {filtered.length} exoplanet{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Exoplanet grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((ep) => (
            <Card key={ep.slug} className="group overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg group-hover:text-cosmos-cyan transition-colors">
                        {ep.name}
                      </CardTitle>
                      {ep.habitable && (
                        <Badge
                          variant="default"
                          className="text-[10px] bg-green-500/20 text-green-400 border-green-500/30"
                        >
                          <Globe className="mr-1 h-2.5 w-2.5" />
                          Habitable
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-white/40">
                      Orbiting {ep.hostStar}
                    </p>
                  </div>
                  {/* Planet visual */}
                  <div
                    className="h-12 w-12 shrink-0 rounded-full transition-transform group-hover:scale-110"
                    style={{
                      background: `radial-gradient(circle at 35% 35%, ${ep.color}cc, ${ep.color}66)`,
                      boxShadow: `0 0 15px ${ep.color}33`,
                    }}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-white/50 leading-relaxed line-clamp-2">
                  {ep.description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-white/40">
                    <MapPin className="h-3 w-3" />
                    {ep.distance} ly
                  </div>
                  <div className="flex items-center gap-1.5 text-white/40">
                    <Calendar className="h-3 w-3" />
                    {ep.discoveryYear}
                  </div>
                  {ep.radius && (
                    <div className="flex items-center gap-1.5 text-white/40">
                      <span>⌀</span>
                      {ep.radius}
                    </div>
                  )}
                  {ep.temperature && (
                    <div className="flex items-center gap-1.5 text-white/40">
                      <Thermometer className="h-3 w-3" />
                      {ep.temperature}
                    </div>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="text-[10px]">
                    {ep.discoveryMethod}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {ep.orbitalPeriod}
                  </Badge>
                </div>

                <p className="mt-3 text-xs text-white/30 italic">
                  &ldquo;{ep.funFact}&rdquo;
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <Sparkles className="mx-auto h-12 w-12 text-white/20" />
            <p className="mt-4 text-lg text-white/40">
              No exoplanets match your filters.
            </p>
            <Button
              variant="ghost"
              className="mt-4"
              onClick={() => {
                setSelectedMethod("All");
                setShowHabitableOnly(false);
                setSearchQuery("");
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
