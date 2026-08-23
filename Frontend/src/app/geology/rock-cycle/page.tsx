"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Recycle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RockCycleDiagram } from "@/components/geology/RockCycleDiagram";

const processDetails = [
  {
    name: "Melting",
    color: "#ff6b35",
    icon: "🌋",
    description:
      "When rock is subjected to extreme heat (typically 700-1300°C), it melts and becomes magma. This occurs deep within Earth's crust or in the mantle.",
    conditions: [
      "Temperature exceeds the rock's melting point",
      "Occurs at plate boundaries (subduction zones) or hotspots",
      "Depth typically >30 km in the crust",
      "The resulting magma composition depends on the original rock",
    ],
    example:
      "When the Pacific Plate subducts beneath the North American Plate, the descending slab melts, creating magma that feeds volcanoes like Mount St. Helens.",
  },
  {
    name: "Cooling & Crystallization",
    color: "#ff6b35",
    icon: "❄️",
    description:
      "Magma cools and minerals crystallize to form igneous rock. The cooling rate determines the rock's texture and grain size.",
    conditions: [
      "Intrusive (plutonic): Slow cooling deep underground → large crystals (e.g., granite)",
      "Extrusive (volcanic): Rapid cooling at the surface → fine grains (e.g., basalt)",
      "Glassy: Instant cooling → no crystals (e.g., obsidian)",
    ],
    example:
      "Granite forms when magma cools slowly deep underground, allowing large visible crystals of quartz, feldspar, and mica to grow over thousands of years.",
  },
  {
    name: "Weathering & Erosion",
    color: "#4a90d9",
    icon: "🌧️",
    description:
      "Rock at Earth's surface is broken down by physical, chemical, and biological processes into smaller particles called sediment.",
    conditions: [
      "Physical: freeze-thaw, thermal expansion, abrasion by wind/water",
      "Chemical: dissolution by slightly acidic rainwater, oxidation",
      "Biological: root growth, lichen, burrowing organisms",
      "Transport by water, wind, ice (glaciers), or gravity",
    ],
    example:
      "The Grand Canyon was carved by the Colorado River over millions of years, exposing layers of sedimentary rock that tell Earth's geological history.",
  },
  {
    name: "Compaction & Cementation",
    color: "#4a90d9",
    icon: "📐",
    description:
      "Layers of sediment accumulate and are compressed under their own weight. Minerals precipitate from groundwater and cement the particles together.",
    conditions: [
      "Sediment accumulates in layers (strata) over time",
      "Overburden pressure squeezes out water and reduces pore space",
      "Dissolved minerals (calcite, silica, iron oxide) cement grains",
      "Process takes millions of years",
    ],
    example:
      "Sandstone forms when sand grains are buried, compressed, and cemented by silica or calcite. The cross-bedding in sandstone records ancient wind or water patterns.",
  },
  {
    name: "Heat & Pressure (Metamorphism)",
    color: "#7b2ff2",
    icon: "🔥",
    description:
      "Existing rock is transformed by intense heat and pressure without melting. Minerals recrystallize and realign, creating new textures and compositions.",
    conditions: [
      "Contact metamorphism: Heat from nearby magma (localized)",
      "Regional metamorphism: Large-scale pressure from tectonic forces",
      "Burial metamorphism: Deep burial increases temperature and pressure",
      "Minerals recrystallize; new minerals may form",
    ],
    example:
      "Marble forms when limestone is subjected to heat and pressure. The calcite crystals recrystallize into larger, interlocking grains, making marble stronger and more beautiful.",
  },
  {
    name: "Uplift & Exposure",
    color: "#7b2ff2",
    icon: "⛰️",
    description:
      "Tectonic forces push deeply buried rocks back to Earth's surface, where they can be weathered and eroded, completing the cycle.",
    conditions: [
      "Tectonic uplift from plate collisions",
      "Isostatic rebound (land rises when ice sheets melt or erosion removes weight)",
      "Removal of overlying rock by erosion exposes deeper rocks",
      "The cycle begins again",
    ],
    example:
      "The Himalayas are still rising because the Indian Plate continues to push into the Eurasian Plate — metamorphic rocks that formed deep underground are now exposed at the world's highest altitudes.",
  },
];

export default function RockCyclePage() {
  const [selectedProcess, setSelectedProcess] = useState<typeof processDetails[0] | null>(null);

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
            The <span className="gradient-text-cyan">Rock Cycle</span>
          </h1>
          <p className="mt-3 max-w-2xl text-white/50">
            Earth&apos;s rocks are in constant transformation. Click any stage in the
            diagram below to learn about the processes that create and change rocks.
          </p>
        </div>

        {/* Interactive diagram */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Recycle className="h-5 w-5 text-cyan-400" />
                Interactive Rock Cycle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RockCycleDiagram onSelectProcess={(p) => {
                const detail = processDetails.find((d) => d.name.toLowerCase().includes(p.id.replace("-", " ").split(" ")[0]));
                setSelectedProcess(detail || null);
              }} />
            </CardContent>
          </Card>
        </div>

        {/* Selected process detail */}
        {selectedProcess && (
          <div className="mb-12">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedProcess.icon}</span>
                  <div>
                    <CardTitle className="text-xl">{selectedProcess.name}</CardTitle>
                    <p className="text-xs text-white/40 mt-0.5">Click a different stage to learn about another process</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/60 leading-relaxed mb-4">
                  {selectedProcess.description}
                </p>
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-white/80 mb-2">Conditions & Stages:</h4>
                  <div className="space-y-1.5">
                    {selectedProcess.conditions.map((c, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-white/50">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: selectedProcess.color }} />
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border border-white/5 bg-white/5 p-3">
                  <p className="text-xs font-semibold text-white/60 mb-1">🌍 Real-World Example:</p>
                  <p className="text-sm text-white/50">{selectedProcess.example}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* All processes overview */}
        <h2 className="mb-6 font-display text-xl font-bold text-white">
          All Processes
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {processDetails.map((process) => (
            <Card
              key={process.name}
              className="group cursor-pointer"
              onClick={() => setSelectedProcess(
                selectedProcess?.name === process.name ? null : process
              )}
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{process.icon}</span>
                  <h3
                    className="font-display text-base font-bold"
                    style={{ color: process.color }}
                  >
                    {process.name}
                  </h3>
                </div>
                <p className="text-xs text-white/50 leading-relaxed line-clamp-3">
                  {process.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
