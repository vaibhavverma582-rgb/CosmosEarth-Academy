"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Globe, Search, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { countries, continents } from "@/data/geography/countries";

export default function CountriesPage() {
  const [selectedContinent, setSelectedContinent] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = countries.filter((c) => {
    const matchContinent = selectedContinent === "All" || c.continent === selectedContinent;
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.capital.toLowerCase().includes(searchQuery.toLowerCase());
    return matchContinent && matchSearch;
  });

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/geography"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Geography
          </Link>
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
            <span className="gradient-text-cyan">Countries</span> of the World
          </h1>
          <p className="mt-3 max-w-2xl text-white/50">
            Explore featured countries across all continents — their geography, climate, and unique characteristics.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search countries or capitals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {continents.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedContinent(c)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  selectedContinent === c
                    ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/30"
                    : "bg-white/5 text-white/50 border border-transparent hover:bg-white/10"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <p className="mb-6 text-sm text-white/40">
          Showing {filtered.length} countr{filtered.length !== 1 ? "ies" : "y"}
        </p>

        {/* Country grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((country) => (
            <Link key={country.slug} href={`/geography/countries/${country.slug}`}>
              <Card className="group h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{country.flag}</span>
                      <div>
                        <h3 className="font-display text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {country.name}
                        </h3>
                        <p className="text-xs text-white/40">
                          {country.capital}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {country.continent}
                    </Badge>
                  </div>

                  <p className="text-sm text-white/50 leading-relaxed mb-3 line-clamp-2">
                    {country.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div>
                      <span className="text-white/30">Population</span>
                      <p className="font-medium text-white/60">{country.population}</p>
                    </div>
                    <div>
                      <span className="text-white/30">Area</span>
                      <p className="font-medium text-white/60">{country.area}</p>
                    </div>
                    <div>
                      <span className="text-white/30">Climate</span>
                      <p className="font-medium text-white/60">{country.climate}</p>
                    </div>
                    <div>
                      <span className="text-white/30">Biome</span>
                      <p className="font-medium text-white/60">{country.biome}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-medium text-cyan-400 opacity-0 transition-all group-hover:opacity-100">
                    View details
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
