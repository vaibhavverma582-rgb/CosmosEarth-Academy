"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const processes = [
  {
    id: "melting",
    name: "Melting",
    description: "Rock melts into magma when heated to extreme temperatures (above 700°C). Found deep within Earth's crust or mantle.",
    from: "any",
    to: "magma",
    color: "#ff6b35",
  },
  {
    id: "cooling",
    name: "Cooling & Crystallization",
    description: "Magma cools and crystallizes to form igneous rock. Slow cooling creates large crystals (intrusive), rapid cooling creates fine grains (extrusive).",
    from: "magma",
    to: "igneous",
    color: "#ff6b35",
  },
  {
    id: "weathering",
    name: "Weathering & Erosion",
    description: "Wind, water, ice, and biological activity break rock into smaller pieces called sediment.",
    from: "igneous",
    to: "sediment",
    color: "#4a90d9",
  },
  {
    id: "compaction",
    name: "Compaction & Cementation",
    description: "Layers of sediment pile up and are compressed. Minerals precipitate from water and cement grains into sedimentary rock.",
    from: "sediment",
    to: "sedimentary",
    color: "#4a90d9",
  },
  {
    id: "heat-pressure",
    name: "Heat & Pressure",
    description: "Deep burial subjects rock to intense heat and pressure, causing minerals to recrystallize and rearrange without melting — creating metamorphic rock.",
    from: "sedimentary",
    to: "metamorphic",
    color: "#7b2ff2",
  },
  {
    id: "uplift",
    name: "Uplift & Exposure",
    description: "Tectonic forces push deep rocks to the surface where they're exposed to weathering, completing the cycle.",
    from: "metamorphic",
    to: "igneous",
    color: "#7b2ff2",
  },
];

interface RockCycleDiagramProps {
  onSelectProcess?: (process: typeof processes[0]) => void;
}

export function RockCycleDiagram({ onSelectProcess }: RockCycleDiagramProps) {
  const [activeProcess, setActiveProcess] = useState<string | null>(null);

  const handleClick = (process: typeof processes[0]) => {
    setActiveProcess(activeProcess === process.id ? null : process.id);
    onSelectProcess?.(process);
  };

  return (
    <div className="relative">
      <svg viewBox="0 0 600 500" className="w-full max-w-2xl mx-auto">
        {/* Background glow */}
        <defs>
          <radialGradient id="magmaGlow">
            <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ff6b35" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="igneousGlow">
            <stop offset="0%" stopColor="#c1440e" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#c1440e" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sedimentGlow">
            <stop offset="0%" stopColor="#4a90d9" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#4a90d9" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sedimentaryGlow">
            <stop offset="0%" stopColor="#c4a35a" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#c4a35a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="metamorphicGlow">
            <stop offset="0%" stopColor="#7b2ff2" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#7b2ff2" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Magma */}
        <g onClick={() => handleClick(processes[0])} className="cursor-pointer">
          <circle cx="300" cy="80" r="55" fill="url(#magmaGlow)" />
          <circle cx="300" cy="80" r="40" fill="#ff6b35" opacity="0.2" stroke="#ff6b35" strokeWidth="2" />
          <text x="300" y="76" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">Magma</text>
          <text x="300" y="92" textAnchor="middle" fill="white" fontSize="9" opacity="0.5">Molten Rock</text>
        </g>

        {/* Igneous Rock */}
        <g onClick={() => handleClick(processes[2])} className="cursor-pointer">
          <circle cx="480" cy="200" r="55" fill="url(#igneousGlow)" />
          <circle cx="480" cy="200" r="40" fill="#c1440e" opacity="0.2" stroke="#c1440e" strokeWidth="2" />
          <text x="480" y="196" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">Igneous</text>
          <text x="480" y="212" textAnchor="middle" fill="white" fontSize="9" opacity="0.5">From Cooling</text>
        </g>

        {/* Sediment */}
        <g onClick={() => handleClick(processes[4])} className="cursor-pointer">
          <circle cx="430" cy="380" r="55" fill="url(#sedimentGlow)" />
          <circle cx="430" cy="380" r="40" fill="#4a90d9" opacity="0.2" stroke="#4a90d9" strokeWidth="2" />
          <text x="430" y="376" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">Sediment</text>
          <text x="430" y="392" textAnchor="middle" fill="white" fontSize="9" opacity="0.5">Loose Particles</text>
        </g>

        {/* Sedimentary Rock */}
        <g onClick={() => handleClick(processes[5])} className="cursor-pointer">
          <circle cx="170" cy="380" r="55" fill="url(#sedimentaryGlow)" />
          <circle cx="170" cy="380" r="40" fill="#c4a35a" opacity="0.2" stroke="#c4a35a" strokeWidth="2" />
          <text x="170" y="376" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">Sedimentary</text>
          <text x="170" y="392" textAnchor="middle" fill="white" fontSize="9" opacity="0.5">From Layers</text>
        </g>

        {/* Metamorphic Rock */}
        <g onClick={() => handleClick(processes[3])} className="cursor-pointer">
          <circle cx="120" cy="200" r="55" fill="url(#metamorphicGlow)" />
          <circle cx="120" cy="200" r="40" fill="#7b2ff2" opacity="0.2" stroke="#7b2ff2" strokeWidth="2" />
          <text x="120" y="196" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Metamorphic</text>
          <text x="120" y="212" textAnchor="middle" fill="white" fontSize="9" opacity="0.5">Transformed</text>
        </g>

        {/* Arrows — Cooling (Magma → Igneous) */}
        <path d="M 340 80 Q 420 100 460 160" fill="none" stroke="#ff6b35" strokeWidth="2" strokeDasharray="6,3" opacity="0.6" markerEnd="url(#arrowOrange)" />
        <defs>
          <marker id="arrowOrange" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#ff6b35" />
          </marker>
          <marker id="arrowBlue" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#4a90d9" />
          </marker>
          <marker id="arrowGold" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#c4a35a" />
          </marker>
          <marker id="arrowPurple" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#7b2ff2" />
          </marker>
        </defs>

        {/* Weathering (Igneous → Sediment) */}
        <path d="M 490 245 Q 490 320 460 355" fill="none" stroke="#4a90d9" strokeWidth="2" strokeDasharray="6,3" opacity="0.6" markerEnd="url(#arrowBlue)" />

        {/* Compaction (Sediment → Sedimentary) */}
        <path d="M 385 390 Q 280 420 215 390" fill="none" stroke="#c4a35a" strokeWidth="2" strokeDasharray="6,3" opacity="0.6" markerEnd="url(#arrowGold)" />

        {/* Heat & Pressure (Sedimentary → Metamorphic) */}
        <path d="M 155 335 Q 120 280 120 250" fill="none" stroke="#7b2ff2" strokeWidth="2" strokeDasharray="6,3" opacity="0.6" markerEnd="url(#arrowPurple)" />

        {/* Melting (Metamorphic → Magma) */}
        <path d="M 140 155 Q 180 100 260 80" fill="none" stroke="#ff6b35" strokeWidth="2" strokeDasharray="6,3" opacity="0.6" markerEnd="url(#arrowOrange)" />

        {/* Direct arrows — shortcuts */}
        {/* Igneous → Metamorphic (Heat & Pressure) */}
        <path d="M 440 220 Q 280 160 160 200" fill="none" stroke="#7b2ff2" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />

        {/* Sedimentary → Sediment (Weathering) */}
        <path d="M 190 420 Q 300 440 410 420" fill="none" stroke="#4a90d9" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />

        {/* Process labels on arrows */}
        <text x="380" y="115" fill="#ff6b35" fontSize="8" opacity="0.7">Cooling</text>
        <text x="510" y="305" fill="#4a90d9" fontSize="8" opacity="0.7">Weathering</text>
        <text x="285" y="430" fill="#c4a35a" fontSize="8" opacity="0.7">Compaction</text>
        <text x="105" y="305" fill="#7b2ff2" fontSize="8" opacity="0.7">Heat & Pressure</text>
        <text x="180" y="105" fill="#ff6b35" fontSize="8" opacity="0.7">Melting</text>
      </svg>
    </div>
  );
}
