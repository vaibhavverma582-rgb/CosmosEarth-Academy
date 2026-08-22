"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Flame,
  Activity,
  MapPin,
  Calendar,
  ArrowUp,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { volcanoes, majorEarthquakes } from "@/data/geology/volcanoes";

const volcanoTypes = ["All", "stratovolcano", "shield", "caldera", "complex", "cinder cone"];
const volcanoStatuses = ["All", "active", "dormant", "extinct"];

export default function VolcanoesPage() {
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [activeTab, setActiveTab] = useState<"volcanoes" | "earthquakes">("volcanoes");

  const filteredVolcanoes = volcanoes.filter((v) => {
    const matchType = selectedType === "All" || v.type === selectedType;
    const matchStatus = selectedStatus === "All" || v.status === selectedStatus;
    return matchType && matchStatus;
  });

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/geology"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Geology
          </Link>
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
            <span className="gradient-text-warm">Volcanoes</span> &{" "}
            <span className="gradient-text-cyan">Earthquakes</span>
          </h1>
          <p className="mt-3 max-w-2xl text-white/50">
            Earth&apos;s most powerful forces — where tectonic plates collide, volcanoes erupt and
            the ground shakes.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className="glass-card rounded-xl p-4 text-center">
            <Flame className="mx-auto mb-1 h-5 w-5 text-cosmos-orange" />
            <p className="font-display text-xl font-bold text-white">1,500+</p>
            <p className="text-xs text-white/40">Active Volcanoes</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <Activity className="mx-auto mb-1 h-5 w-5 text-cosmos-cyan" />
            <p className="font-display text-xl font-bold text-white">500K+</p>
            <p className="text-xs text-white/40">Earthquakes/Year</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <AlertTriangle className="mx-auto mb-1 h-5 w-5 text-cosmos-pink" />
            <p className="font-display text-xl font-bold text-white">~50</p>
            <p className="text-xs text-white/40">Destructive/Year</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="mb-6 flex gap-1 rounded-lg bg-white/5 p-1 w-fit">
          <button
            onClick={() => setActiveTab("volcanoes")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
              activeTab === "volcanoes"
                ? "bg-cosmos-orange/20 text-cosmos-orange"
                : "text-white/50 hover:text-white/70"
            }`}
          >
            <Flame className="inline h-4 w-4 mr-1.5" />
            Volcanoes
          </button>
          <button
            onClick={() => setActiveTab("earthquakes")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
              activeTab === "earthquakes"
                ? "bg-cosmos-cyan/20 text-cosmos-cyan"
                : "text-white/50 hover:text-white/70"
            }`}
          >
            <Activity className="inline h-4 w-4 mr-1.5" />
            Major Earthquakes
          </button>
        </div>

        {/* ═══ VOLCANOES TAB ═══ */}
        {activeTab === "volcanoes" && (
          <>
            {/* Filters */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {volcanoTypes.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                      selectedType === t
                        ? "bg-cosmos-orange/20 text-cosmos-orange border border-cosmos-orange/30"
                        : "bg-white/5 text-white/50 border border-transparent hover:bg-white/10"
                    }`}
                  >
                    {t === "All" ? "All Types" : t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {volcanoStatuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedStatus(s)}
                    className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                      selectedStatus === s
                        ? "bg-cosmos-pink/20 text-cosmos-pink border border-cosmos-pink/30"
                        : "bg-white/5 text-white/50 border border-transparent hover:bg-white/10"
                    }`}
                  >
                    {s === "All" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Volcano cards */}
            <div className="grid gap-6 sm:grid-cols-2">
              {filteredVolcanoes.map((volcano) => (
                <Card key={volcano.slug} className="group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg group-hover:text-cosmos-orange transition-colors">
                          {volcano.name}
                        </CardTitle>
                        <p className="mt-1 text-xs text-white/40">
                          <MapPin className="inline h-3 w-3 mr-1" />
                          {volcano.country}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge
                          variant={
                            volcano.status === "active"
                              ? "default"
                              : volcano.status === "dormant"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-[10px]"
                        >
                          {volcano.status === "active" && "🔴 "}
                          {volcano.status === "dormant" && "🟡 "}
                          {volcano.status}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {volcano.type}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-white/50 leading-relaxed mb-3">
                      {volcano.description}
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                      <div>
                        <span className="text-white/30">Elevation</span>
                        <p className="font-medium text-white/60">{volcano.elevation}</p>
                      </div>
                      <div>
                        <span className="text-white/30">Last Eruption</span>
                        <p className="font-medium text-white/60">{volcano.lastEruption}</p>
                      </div>
                      <div>
                        <span className="text-white/30">Type</span>
                        <p className="font-medium text-white/60 capitalize">{volcano.type}</p>
                      </div>
                    </div>
                    <p className="text-xs text-white/30 italic">
                      💡 {volcano.funFact}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* ═══ EARTHQUAKES TAB ═══ */}
        {activeTab === "earthquakes" && (
          <div className="space-y-6">
            {majorEarthquakes.map((eq, i) => (
              <Card key={i} className="group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cosmos-cyan/10">
                          <span className="font-display text-lg font-bold text-cosmos-cyan">
                            {eq.magnitude}
                          </span>
                        </div>
                        <div>
                          <CardTitle className="text-lg group-hover:text-cosmos-cyan transition-colors">
                            {eq.name}
                          </CardTitle>
                          <p className="text-xs text-white/40">
                            {eq.location} · {eq.date}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          eq.magnitude >= 9
                            ? "default"
                            : eq.magnitude >= 8
                            ? "secondary"
                            : "outline"
                        }
                        className="text-xs"
                      >
                        M{eq.magnitude}
                      </Badge>
                      {eq.casualties && (
                        <p className="mt-1 text-[10px] text-red-400/60">
                          {eq.casualties} casualties
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-white/50 leading-relaxed mb-3">
                    {eq.description}
                  </p>
                  <div className="rounded-lg border border-white/5 bg-white/5 p-3">
                    <p className="text-xs font-semibold text-white/60 mb-1">Impact:</p>
                    <p className="text-sm text-white/50">{eq.impact}</p>
                  </div>
                  <div className="mt-3 flex gap-4 text-xs text-white/30">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {eq.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <ArrowUp className="h-3 w-3" />
                      Depth: {eq.depth}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {eq.date}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
