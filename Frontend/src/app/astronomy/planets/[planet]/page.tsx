import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Moon,
  Thermometer,
  Ruler,
  Weight,
  Clock,
  Zap,
  Wind,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { planets, getPlanetBySlug } from "@/data/planets";

// Generate static params for all planets
export function generateStaticParams() {
  return planets.map((planet) => ({ planet: planet.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ planet: string }> }) {
  const { planet: slug } = await params;
  const planet = getPlanetBySlug(slug);
  if (!planet) return { title: "Planet Not Found" };
  return {
    title: `${planet.name} — CosmosEarth Academy`,
    description: planet.description,
  };
}

export default async function PlanetPage({ params }: { params: Promise<{ planet: string }> }) {
  const { planet: slug } = await params;
  const planet = getPlanetBySlug(slug);
  if (!planet) notFound();

  const planetIndex = planets.findIndex((p) => p.slug === planet.slug);
  const prevPlanet = planetIndex > 0 ? planets[planetIndex - 1] : null;
  const nextPlanet =
    planetIndex < planets.length - 1 ? planets[planetIndex + 1] : null;

  const specs = [
    { icon: Ruler, label: "Diameter", value: planet.diameter },
    { icon: Weight, label: "Mass", value: planet.mass },
    { icon: Zap, label: "Gravity", value: planet.gravity },
    { icon: Clock, label: "Day Length", value: planet.dayLength },
    { icon: Thermometer, label: "Temperature", value: planet.temperature },
    { icon: Moon, label: "Moons", value: planet.moons.toString() },
    { icon: Wind, label: "Atmosphere", value: planet.atmosphere },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/astronomy/solar-system"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Solar System
        </Link>

        {/* Planet Hero */}
        <div className="mb-12 flex flex-col items-center gap-8 lg:flex-row">
          {/* Planet visualization */}
          <div className="flex shrink-0 items-center justify-center">
            <div
              className="h-48 w-48 rounded-full sm:h-64 sm:w-64 lg:h-80 lg:w-80"
              style={{
                background: `radial-gradient(circle at 35% 35%, ${planet.color}ee, ${planet.color}88, ${planet.color}22)`,
                boxShadow: `0 0 80px ${planet.color}33, inset -20px -20px 40px rgba(0,0,0,0.4)`,
              }}
            />
          </div>

          {/* Planet info */}
          <div className="text-center lg:text-left">
            <Badge variant="outline" className="mb-3">
              {planet.type.charAt(0).toUpperCase() + planet.type.slice(1)}
            </Badge>
            <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
              {planet.name}
            </h1>
            <p className="mt-2 text-lg text-white/40">
              {planet.distanceFromSun} AU from the Sun · Orbital period:{" "}
              {planet.orbitalPeriod}
            </p>
            <p className="mt-4 max-w-xl text-white/60 leading-relaxed">
              {planet.description}
            </p>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="mb-12">
          <h2 className="mb-6 font-display text-xl font-bold text-white">
            Key Facts
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {specs.map((spec) => (
              <Card key={spec.label}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5">
                      <spec.icon className="h-5 w-5 text-cosmos-cyan" />
                    </div>
                    <div>
                      <p className="text-xs text-white/40">{spec.label}</p>
                      <p className="text-sm font-medium text-white">
                        {spec.value}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Fun Facts */}
        <div className="mb-12">
          <h2 className="mb-6 font-display text-xl font-bold text-white">
            Fun Facts
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {planet.funFacts.map((fact, i) => (
              <Card key={i}>
                <CardContent className="p-5">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-cosmos-cyan/10 text-sm font-bold text-cosmos-cyan">
                    {i + 1}
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {fact}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {prevPlanet ? (
            <Link href={`/astronomy/planets/${prevPlanet.slug}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4" />
                {prevPlanet.name}
              </Button>
            </Link>
          ) : (
            <div />
          )}
          {nextPlanet ? (
            <Link href={`/astronomy/planets/${nextPlanet.slug}`}>
              <Button variant="outline" size="sm">
                {nextPlanet.name}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
