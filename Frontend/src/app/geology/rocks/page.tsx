"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Gem, Search, Layers, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { rocks, rockCategories } from "@/data/geology/rocks";
import { minerals } from "@/data/geology/minerals";

const allCategories = ["All", "igneous", "sedimentary", "metamorphic"];

export default function RocksMineralsPage() {
  const [tab, setTab] = useState<"rocks" | "minerals">("rocks");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRocks = rocks.filter((r) => {
    const matchCat = selectedCategory === "All" || r.category === selectedCategory;
    const matchSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredMinerals = minerals.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.formula.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
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
            <span className="gradient-text-cyan">Rocks</span> &{" "}
            <span className="gradient-text-warm">Minerals</span>
          </h1>
          <p className="mt-3 max-w-2xl text-white/50">
            A comprehensive database of Earth&apos;s building blocks. Search, filter, and learn about rocks and minerals.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="mb-6 flex gap-1 rounded-lg bg-white/5 p-1 w-fit">
          <button
            onClick={() => setTab("rocks")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
              tab === "rocks"
                ? "bg-cosmos-orange/20 text-cosmos-orange"
                : "text-white/50 hover:text-white/70"
            }`}
          >
            <Layers className="inline h-4 w-4 mr-1.5" />
            Rocks ({rocks.length})
          </button>
          <button
            onClick={() => setTab("minerals")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
              tab === "minerals"
                ? "bg-cosmos-cyan/20 text-cosmos-cyan"
                : "text-white/50 hover:text-white/70"
            }`}
          >
            <Gem className="inline h-4 w-4 mr-1.5" />
            Minerals ({minerals.length})
          </button>
        </div>

        {/* Search */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder={`Search ${tab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-cosmos-cyan/50 focus:outline-none focus:ring-1 focus:ring-cosmos-cyan/30"
            />
          </div>
          {tab === "rocks" && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-cosmos-orange/20 text-cosmos-orange border border-cosmos-orange/30"
                      : "bg-white/5 text-white/50 border border-transparent hover:bg-white/10"
                  }`}
                >
                  {cat === "All" ? "All Types" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Rocks tab */}
        {tab === "rocks" && (
          <>
            <p className="mb-4 text-sm text-white/40">
              Showing {filteredRocks.length} rock{filteredRocks.length !== 1 ? "s" : ""}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRocks.map((rock) => {
                const catInfo = rockCategories.find((c) => c.slug === rock.category);
                return (
                  <Card key={rock.slug} className="group">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <div
                              className="h-4 w-4 rounded-full"
                              style={{ backgroundColor: catInfo?.color || "#888" }}
                            />
                            <CardTitle className="text-lg group-hover:text-cosmos-cyan transition-colors">
                              {rock.name}
                            </CardTitle>
                          </div>
                          <p className="mt-1 text-xs text-white/40">
                            {rock.type.charAt(0).toUpperCase() + rock.type.slice(1)} · {rock.texture}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-[10px]">
                          {rock.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-white/50 leading-relaxed mb-3">
                        {rock.description}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div>
                          <span className="text-white/30">Hardness:</span>{" "}
                          <span className="text-white/60">{rock.hardness} Mohs</span>
                        </div>
                        <div>
                          <span className="text-white/30">Composition:</span>{" "}
                          <span className="text-white/60">{rock.composition.split(",")[0]}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {rock.uses.slice(0, 3).map((use) => (
                          <Badge key={use} variant="outline" className="text-[10px]">
                            {use}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-white/30 italic">
                        💡 {rock.funFact}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {/* Minerals tab */}
        {tab === "minerals" && (
          <>
            <p className="mb-4 text-sm text-white/40">
              Showing {filteredMinerals.length} mineral{filteredMinerals.length !== 1 ? "s" : ""}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMinerals.map((mineral) => (
                <Card key={mineral.slug} className="group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg group-hover:text-cosmos-cyan transition-colors">
                          {mineral.name}
                        </CardTitle>
                        <p className="mt-1 font-mono text-xs text-cosmos-cyan/60">
                          {mineral.formula}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <div
                              key={i}
                              className={`h-2 w-2 rounded-full ${
                                i < mineral.hardness ? "bg-cosmos-cyan" : "bg-white/10"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-[10px] text-white/30 mt-0.5">
                          Mohs: {mineral.hardness}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-white/50 leading-relaxed mb-3">
                      {mineral.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div>
                        <span className="text-white/30">Crystal:</span>{" "}
                        <span className="text-white/60">{mineral.crystalSystem}</span>
                      </div>
                      <div>
                        <span className="text-white/30">Luster:</span>{" "}
                        <span className="text-white/60">{mineral.luster}</span>
                      </div>
                      <div>
                        <span className="text-white/30">Streak:</span>{" "}
                        <span className="text-white/60">{mineral.streak}</span>
                      </div>
                      <div>
                        <span className="text-white/30">Density:</span>{" "}
                        <span className="text-white/60">{mineral.specificGravity}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {mineral.uses.slice(0, 3).map((use) => (
                        <Badge key={use} variant="outline" className="text-[10px]">
                          {use}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-white/30 italic">
                      💡 {mineral.funFact}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
