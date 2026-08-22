"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { tectonicPlates, plateBoundaryTypes } from "@/data/geology/tectonics";

export function TectonicMap() {
  const [selectedPlate, setSelectedPlate] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Map */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-cosmos-navy p-4">
        <svg viewBox="0 0 800 450" className="w-full">
          {/* Ocean background */}
          <rect x="0" y="0" width="800" height="450" fill="#0a1628" rx="8" />

          {/* Simplified continent outlines */}
          {/* North America */}
          <path d="M 120 80 L 180 60 L 220 80 L 240 120 L 220 160 L 180 200 L 150 180 L 100 140 L 80 100 Z" fill="#1a3050" stroke="#2a5080" strokeWidth="1" opacity="0.6" />
          {/* South America */}
          <path d="M 180 240 L 220 220 L 240 260 L 250 320 L 230 380 L 200 400 L 180 360 L 170 300 Z" fill="#1a3050" stroke="#2a5080" strokeWidth="1" opacity="0.6" />
          {/* Europe */}
          <path d="M 360 60 L 420 50 L 440 80 L 420 120 L 380 110 L 360 90 Z" fill="#1a3050" stroke="#2a5080" strokeWidth="1" opacity="0.6" />
          {/* Africa */}
          <path d="M 370 150 L 420 140 L 450 180 L 460 260 L 430 340 L 390 330 L 370 260 L 360 200 Z" fill="#1a3050" stroke="#2a5080" strokeWidth="1" opacity="0.6" />
          {/* Asia */}
          <path d="M 450 40 L 580 30 L 650 60 L 680 100 L 660 140 L 600 160 L 520 140 L 460 100 L 440 70 Z" fill="#1a3050" stroke="#2a5080" strokeWidth="1" opacity="0.6" />
          {/* Australia */}
          <path d="M 600 280 L 680 270 L 710 300 L 700 340 L 640 350 L 600 320 Z" fill="#1a3050" stroke="#2a5080" strokeWidth="1" opacity="0.6" />
          {/* Antarctica */}
          <path d="M 100 420 L 700 420 L 720 450 L 80 450 Z" fill="#1a3050" stroke="#2a5080" strokeWidth="1" opacity="0.4" />

          {/* Tectonic plates (simplified polygons) */}
          {tectonicPlates.map((plate) => {
            const isSelected = selectedPlate === plate.slug;
            const plateShapes: Record<string, string> = {
              pacific: "M 50 100 L 130 60 L 150 200 L 120 350 L 60 300 Z",
              "north-american": "M 80 30 L 240 30 L 260 180 L 150 220 L 80 180 L 40 100 Z",
              eurasian: "M 280 20 L 680 20 L 700 140 L 500 160 L 380 140 L 280 80 Z",
              african: "M 340 130 L 480 120 L 500 340 L 400 360 L 340 300 L 330 200 Z",
              antarctic: "M 60 400 L 740 400 L 760 450 L 40 450 Z",
              "indo-australian": "M 500 160 L 720 200 L 730 360 L 580 350 L 500 300 L 490 220 Z",
              nazca: "M 60 240 L 140 220 L 160 340 L 100 360 L 50 320 Z",
              "south-american": "M 140 200 L 280 190 L 300 400 L 180 410 L 130 350 L 120 260 Z",
            };

            return (
              <g
                key={plate.slug}
                onClick={() => setSelectedPlate(selectedPlate === plate.slug ? null : plate.slug)}
                className="cursor-pointer"
              >
                <path
                  d={plateShapes[plate.slug] || ""}
                  fill={plate.color}
                  opacity={isSelected ? 0.4 : 0.15}
                  stroke={plate.color}
                  strokeWidth={isSelected ? 2 : 1}
                  strokeDasharray={isSelected ? "none" : "4,4"}
                />
                {/* Plate label */}
                <text
                  x={plate.slug === "pacific" ? 100 : plate.slug === "north-american" ? 160 : plate.slug === "eurasian" ? 480 : plate.slug === "african" ? 410 : plate.slug === "antarctic" ? 400 : plate.slug === "indo-australian" ? 610 : plate.slug === "nazca" ? 100 : 210}
                  y={plate.slug === "pacific" ? 200 : plate.slug === "north-american" ? 120 : plate.slug === "eurasian" ? 80 : plate.slug === "african" ? 250 : plate.slug === "antarctic" ? 435 : plate.slug === "indo-australian" ? 280 : plate.slug === "nazca" ? 300 : 310}
                  textAnchor="middle"
                  fill={plate.color}
                  fontSize="10"
                  fontWeight="bold"
                  opacity={isSelected ? 1 : 0.6}
                >
                  {plate.name}
                </text>
              </g>
            );
          })}

          {/* Ring of Fire outline */}
          <path
            d="M 130 100 Q 120 200 130 300 Q 140 380 180 400 Q 300 420 400 380 Q 500 340 550 280 Q 600 220 640 160 Q 680 100 700 60"
            fill="none"
            stroke="#ff6b35"
            strokeWidth="3"
            opacity="0.2"
            strokeDasharray="8,4"
          />
          <text x="350" y="420" fill="#ff6b35" fontSize="9" opacity="0.5">
            Ring of Fire
          </text>
        </svg>
      </div>

      {/* Plate info */}
      {selectedPlate && (
        <Card>
          <CardContent className="p-6">
            {(() => {
              const plate = tectonicPlates.find((p) => p.slug === selectedPlate);
              if (!plate) return null;
              return (
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: plate.color }} />
                    <h3 className="font-display text-lg font-bold text-white">{plate.name}</h3>
                  </div>
                  <p className="text-sm text-white/60 mb-4">{plate.description}</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-white/40">Area</p>
                      <p className="text-sm font-medium text-white">{plate.area}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/40">Speed</p>
                      <p className="text-sm font-medium text-white">{plate.speed}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/40">Movement</p>
                      <p className="text-sm font-medium text-white">{plate.movement} ({plate.direction})</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-2">Boundaries</p>
                    <div className="space-y-1">
                      {plate.boundaries.map((b, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-white/50">
                          <span className="text-cosmos-cyan">•</span>
                          {b}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Boundary types legend */}
      <div className="grid grid-cols-3 gap-3">
        {plateBoundaryTypes.map((bt) => (
          <div key={bt.name} className="glass-card rounded-xl p-3 text-center">
            <div className="text-lg mb-1" style={{ color: bt.color }}>{bt.icon}</div>
            <p className="text-xs font-semibold text-white">{bt.name}</p>
            <p className="text-[10px] text-white/40 mt-0.5">{bt.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
