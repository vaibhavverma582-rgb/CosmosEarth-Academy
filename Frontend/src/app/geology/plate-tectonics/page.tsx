"use client";

import Link from "next/link";
import { ArrowLeft, Map, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TectonicMap } from "@/components/geology/TectonicMap";
import { tectonicPlates, plateBoundaryTypes } from "@/data/geology/tectonics";

export default function PlateTectonicsPage() {
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
            <span className="gradient-text-warm">Plate Tectonics</span>
          </h1>
          <p className="mt-3 max-w-2xl text-white/50">
            Earth&apos;s outer shell is divided into several plates that glide over
            the mantle. Their interactions create earthquakes, volcanoes, and
            mountain ranges.
          </p>
        </div>

        {/* Interactive Map */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5 text-orange-400" />
                Interactive Tectonic Plate Map
              </CardTitle>
              <p className="text-xs text-white/40">
                Click any plate to see details about its movement and boundaries
              </p>
            </CardHeader>
            <CardContent>
              <TectonicMap />
            </CardContent>
          </Card>
        </div>

        {/* Plate details grid */}
        <div className="mb-12">
          <h2 className="mb-6 font-display text-xl font-bold text-white">
            Major Tectonic Plates
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tectonicPlates.map((plate) => (
              <Card key={plate.slug} className="group">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: plate.color }}
                    />
                    <h3 className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {plate.name}
                    </h3>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-white/30">Area</span>
                      <span className="text-white/60">{plate.area}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/30">Speed</span>
                      <span className="text-white/60">{plate.speed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/30">Direction</span>
                      <span className="text-white/60">
                        {plate.movement} ({plate.direction})
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] text-white/40 leading-relaxed line-clamp-2">
                    {plate.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* What happens at boundaries */}
        <div className="mb-12">
          <h2 className="mb-6 font-display text-xl font-bold text-white">
            What Happens at Plate Boundaries?
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {/* Convergent */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10">
                    <span className="text-lg">→←</span>
                  </div>
                  <div>
                    <CardTitle className="text-base">Convergent</CardTitle>
                    <p className="text-[10px] text-white/40">Plates collide</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-white/50">
                  When plates move toward each other, one may subduct beneath the
                  other, or they may crumple upward.
                </p>
                <div className="space-y-1.5 text-xs text-white/40">
                  <p><span className="text-pink-400">•</span> Mountains (Himalayas, Andes)</p>
                  <p><span className="text-pink-400">•</span> Ocean trenches (Mariana Trench)</p>
                  <p><span className="text-pink-400">•</span> Volcanic arcs (Japan, Indonesia)</p>
                  <p><span className="text-pink-400">•</span> Powerful earthquakes</p>
                </div>
                <div className="rounded-lg border border-pink-500/10 bg-pink-500/5 p-2 text-xs text-pink-300/60">
                  🌍 Example: Indian Plate colliding with Eurasian Plate → Himalayas
                </div>
              </CardContent>
            </Card>

            {/* Divergent */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
                    <span className="text-lg">←→</span>
                  </div>
                  <div>
                    <CardTitle className="text-base">Divergent</CardTitle>
                    <p className="text-[10px] text-white/40">Plates separate</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-white/50">
                  When plates pull apart, magma rises to fill the gap, creating new
                  oceanic crust.
                </p>
                <div className="space-y-1.5 text-xs text-white/40">
                  <p><span className="text-cyan-400">•</span> Mid-ocean ridges (Mid-Atlantic Ridge)</p>
                  <p><span className="text-cyan-400">•</span> Rift valleys (East African Rift)</p>
                  <p><span className="text-cyan-400">•</span> New ocean floor creation</p>
                  <p><span className="text-cyan-400">•</span> Volcanic activity (Iceland)</p>
                </div>
                <div className="rounded-lg border border-cyan-500/10 bg-cyan-500/5 p-2 text-xs text-cyan-300/60">
                  🌍 Example: Mid-Atlantic Ridge → Iceland sits on a divergent boundary
                </div>
              </CardContent>
            </Card>

            {/* Transform */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10">
                    <span className="text-lg">↑↓</span>
                  </div>
                  <div>
                    <CardTitle className="text-base">Transform</CardTitle>
                    <p className="text-[10px] text-white/40">Plates slide past</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-white/50">
                  When plates slide horizontally past each other, stress builds up
                  and is released as earthquakes.
                </p>
                <div className="space-y-1.5 text-xs text-white/40">
                  <p><span className="text-yellow-400">•</span> Strike-slip faults</p>
                  <p><span className="text-yellow-400">•</span> Powerful earthquakes</p>
                  <p><span className="text-yellow-400">•</span> No volcanoes or new crust</p>
                  <p><span className="text-yellow-400">•</span> Lateral displacement</p>
                </div>
                <div className="rounded-lg border border-yellow-500/10 bg-yellow-500/5 p-2 text-xs text-yellow-300/60">
                  🌍 Example: San Andreas Fault — Pacific & North American plates
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Ring of Fire */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-cosmos-navy-light/50">
          <div className="absolute top-0 right-1/4 h-48 w-48 rounded-full bg-glow-orange opacity-20 blur-3xl" />
          <div className="relative px-8 py-10 sm:px-12">
            <h2 className="mb-4 font-display text-2xl font-bold text-white">
              🔥 The Ring of Fire
            </h2>
            <p className="mb-4 max-w-2xl text-sm text-white/50 leading-relaxed">
              A 40,000 km horseshoe-shaped zone around the Pacific Ocean where
              most of Earth&apos;s subduction zones are located. It&apos;s home to 75% of
              the world&apos;s active and dormant volcanoes and 90% of the world&apos;s
              earthquakes.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Chile", "Peru", "Mexico", "USA (West Coast)", "Japan",
                "Philippines", "Indonesia", "New Zealand", "Russia (Kamchatka)",
              ].map((country) => (
                <Badge key={country} variant="outline" className="text-xs">
                  🌋 {country}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
