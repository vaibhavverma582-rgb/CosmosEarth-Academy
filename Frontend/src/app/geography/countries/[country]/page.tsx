import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Users,
  Globe,
  Thermometer,
  TreePine,
  Languages,
  Coins,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { countries, getCountryBySlug } from "@/data/geography/countries";

export function generateStaticParams() {
  return countries.map((c) => ({ country: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }) {
  const { country: slug } = await params;
  const country = getCountryBySlug(slug);
  if (!country) return { title: "Country Not Found" };
  return {
    title: `${country.name} — CosmosEarth Academy`,
    description: country.description,
  };
}

export default async function CountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country: slug } = await params;
  const country = getCountryBySlug(slug);
  if (!country) notFound();

  const countryIndex = countries.findIndex((c) => c.slug === country.slug);
  const prevCountry = countryIndex > 0 ? countries[countryIndex - 1] : null;
  const nextCountry = countryIndex < countries.length - 1 ? countries[countryIndex + 1] : null;

  const specs = [
    { icon: MapPin, label: "Capital", value: country.capital },
    { icon: Users, label: "Population", value: country.population },
    { icon: Globe, label: "Area", value: country.area },
    { icon: Thermometer, label: "Climate", value: country.climate },
    { icon: TreePine, label: "Biome", value: country.biome },
    { icon: Languages, label: "Languages", value: country.languages.join(", ") },
    { icon: Coins, label: "Currency", value: country.currency },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/geography/countries"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All Countries
        </Link>

        {/* Country Hero */}
        <div className="mb-10 flex flex-col items-center gap-6 sm:flex-row">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/5 text-6xl ring-2 ring-white/10">
            {country.flag}
          </div>
          <div className="text-center sm:text-left">
            <Badge variant="outline" className="mb-2">
              {country.continent}
            </Badge>
            <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
              {country.name}
            </h1>
            <p className="mt-1 text-white/40">
              {country.capital} · {country.population} people
            </p>
          </div>
        </div>

        {/* Description */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <p className="text-white/60 leading-relaxed">{country.description}</p>
          </CardContent>
        </Card>

        {/* Specs Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {specs.map((spec) => (
            <Card key={spec.label}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5">
                  <spec.icon className="h-5 w-5 text-cosmos-cyan" />
                </div>
                <div>
                  <p className="text-xs text-white/40">{spec.label}</p>
                  <p className="text-sm font-medium text-white">{spec.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Fun Fact */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">💡 Fun Fact</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/60 leading-relaxed">{country.funFact}</p>
          </CardContent>
        </Card>

        {/* Coordinates */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/40">Coordinates</span>
              <span className="font-mono text-white/60">
                {country.lat.toFixed(4)}°, {country.lng.toFixed(4)}°
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {prevCountry ? (
            <Link href={`/geography/countries/${prevCountry.slug}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4" />
                {prevCountry.flag} {prevCountry.name}
              </Button>
            </Link>
          ) : (
            <div />
          )}
          {nextCountry ? (
            <Link href={`/geography/countries/${nextCountry.slug}`}>
              <Button variant="outline" size="sm">
                {nextCountry.flag} {nextCountry.name}
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
