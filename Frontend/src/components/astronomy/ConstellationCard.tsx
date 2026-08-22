import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ConstellationCardProps {
  name: string;
  slug: string;
  abbreviation: string;
  stars: number;
  brightestStar: string;
  hemisphere: string;
  season: string;
  color: string;
}

// Simple star pattern positions (normalized 0-1) for each constellation
const starPatterns: Record<string, { x: number; y: number }[]> = {
  orion: [
    { x: 0.3, y: 0.15 }, { x: 0.7, y: 0.15 },
    { x: 0.3, y: 0.45 }, { x: 0.45, y: 0.45 }, { x: 0.6, y: 0.45 },
    { x: 0.25, y: 0.85 }, { x: 0.75, y: 0.85 },
  ],
  "ursa-major": [
    { x: 0.2, y: 0.3 }, { x: 0.35, y: 0.25 },
    { x: 0.5, y: 0.3 }, { x: 0.55, y: 0.45 },
    { x: 0.65, y: 0.55 }, { x: 0.75, y: 0.65 },
    { x: 0.85, y: 0.55 },
  ],
  scorpius: [
    { x: 0.5, y: 0.1 }, { x: 0.5, y: 0.25 },
    { x: 0.45, y: 0.4 }, { x: 0.5, y: 0.55 },
    { x: 0.55, y: 0.65 }, { x: 0.6, y: 0.75 },
    { x: 0.65, y: 0.85 }, { x: 0.75, y: 0.9 },
  ],
  cassiopeia: [
    { x: 0.1, y: 0.5 }, { x: 0.3, y: 0.25 },
    { x: 0.5, y: 0.5 }, { x: 0.7, y: 0.25 },
    { x: 0.9, y: 0.5 },
  ],
  cygnus: [
    { x: 0.5, y: 0.1 }, { x: 0.5, y: 0.4 },
    { x: 0.3, y: 0.5 }, { x: 0.7, y: 0.5 },
    { x: 0.5, y: 0.4 }, { x: 0.5, y: 0.85 },
  ],
  leo: [
    { x: 0.15, y: 0.4 }, { x: 0.3, y: 0.2 },
    { x: 0.45, y: 0.25 }, { x: 0.45, y: 0.5 },
    { x: 0.65, y: 0.45 }, { x: 0.85, y: 0.55 },
    { x: 0.9, y: 0.4 },
  ],
  lyra: [
    { x: 0.5, y: 0.15 }, { x: 0.35, y: 0.5 },
    { x: 0.65, y: 0.5 }, { x: 0.4, y: 0.85 },
    { x: 0.6, y: 0.85 },
  ],
  gemini: [
    { x: 0.3, y: 0.1 }, { x: 0.7, y: 0.1 },
    { x: 0.3, y: 0.4 }, { x: 0.7, y: 0.4 },
    { x: 0.3, y: 0.7 }, { x: 0.7, y: 0.7 },
  ],
};

const starConnections: Record<string, [number, number][]> = {
  orion: [[0,1],[1,2],[2,3],[3,4],[4,1],[2,5],[4,6]],
  "ursa-major": [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]],
  scorpius: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]],
  cassiopeia: [[0,1],[1,2],[2,3],[3,4]],
  cygnus: [[0,1],[1,2],[1,3],[1,5]],
  leo: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]],
  lyra: [[0,1],[0,2],[1,3],[2,4],[3,4]],
  gemini: [[0,2],[1,3],[2,4],[3,5]],
};

export function ConstellationCard({
  name,
  slug,
  abbreviation,
  stars,
  brightestStar,
  hemisphere,
  season,
  color,
}: ConstellationCardProps) {
  const points = starPatterns[slug] || starPatterns.orion;
  const connections = starConnections[slug] || starConnections.orion;

  return (
    <Link href={`/astronomy/constellations#${slug}`}>
      <Card className="group overflow-hidden">
        <CardContent className="p-5">
          {/* Star pattern */}
          <div className="relative mb-4 h-32 w-full">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              {/* Connection lines */}
              {connections.map(([a, b], i) => (
                <line
                  key={i}
                  x1={points[a].x * 100}
                  y1={points[a].y * 100}
                  x2={points[b].x * 100}
                  y2={points[b].y * 100}
                  stroke={color}
                  strokeOpacity="0.3"
                  strokeWidth="0.5"
                />
              ))}
              {/* Stars */}
              {points.map((p, i) => (
                <g key={i}>
                  <circle
                    cx={p.x * 100}
                    cy={p.y * 100}
                    r={i === 0 ? 3 : 2}
                    fill={color}
                    className="animate-glow-pulse"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                  <circle
                    cx={p.x * 100}
                    cy={p.y * 100}
                    r={i === 0 ? 6 : 4}
                    fill={color}
                    opacity="0.15"
                  />
                </g>
              ))}
            </svg>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-display text-lg font-bold text-white group-hover:text-cosmos-cyan transition-colors">
              {name}
            </h3>
            <p className="text-xs text-white/40 mt-0.5">
              {abbreviation} · {hemisphere} Hemisphere
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="outline" className="text-[10px]">
                <Star className="mr-1 h-2.5 w-2.5 fill-cosmos-gold" />
                {brightestStar}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {season}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {stars} stars
              </Badge>
            </div>

            <div className="mt-3 flex items-center gap-1 text-xs font-medium text-cosmos-cyan opacity-0 transition-all group-hover:opacity-100">
              Learn more
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
