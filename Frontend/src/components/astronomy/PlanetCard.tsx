import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PlanetCardProps {
  name: string;
  slug: string;
  type: string;
  diameter: string;
  moons: number;
  distanceFromSun: string;
  color: string;
  size?: "sm" | "md" | "lg";
}

export function PlanetCard({
  name,
  slug,
  type,
  diameter,
  moons,
  distanceFromSun,
  color,
  size = "md",
}: PlanetCardProps) {
  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <Link href={`/astronomy/planets/${slug}`}>
      <Card className="group overflow-hidden">
        <CardContent className="p-5">
          {/* Planet visual */}
          <div className="mb-4 flex justify-center">
            <div
              className={`${sizeClasses[size]} rounded-full shadow-lg transition-transform group-hover:scale-110`}
              style={{
                background: `radial-gradient(circle at 35% 35%, ${color}cc, ${color}66, ${color}22)`,
                boxShadow: `0 0 30px ${color}33, inset -8px -8px 20px rgba(0,0,0,0.4)`,
              }}
            />
          </div>

          {/* Info */}
          <div className="text-center">
            <h3
              className={`${textSizes[size]} font-display font-bold text-white group-hover:text-cyan-300 transition-colors`}
            >
              {name}
            </h3>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
              <Badge variant="outline" className="text-[10px]">
                {type}
              </Badge>
            </div>
            <div className="mt-3 space-y-1 text-xs text-white/40">
              <p>⌀ {diameter}</p>
              <p>{distanceFromSun} AU from Sun</p>
              <p>{moons} moon{moons !== 1 ? "s" : ""}</p>
            </div>

            <div className="mt-3 flex items-center justify-center gap-1 text-xs font-medium text-cyan-400 opacity-0 transition-all group-hover:opacity-100">
              Explore
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
