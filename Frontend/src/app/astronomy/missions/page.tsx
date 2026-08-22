"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Rocket,
  Filter,
  CheckCircle2,
  Clock,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { missions } from "@/data/missions";

const types = [
  "All",
  "flyby",
  "orbiter",
  "lander",
  "rover",
  "telescope",
  "crewed",
];
const statuses = ["All", "completed", "active", "planned"];

export default function MissionsPage() {
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filtered = missions.filter((m) => {
    const matchType = selectedType === "All" || m.type === selectedType;
    const matchStatus = selectedStatus === "All" || m.status === selectedStatus;
    return matchType && matchStatus;
  });

  // Group by decade
  const decades = filtered.reduce(
    (acc, mission) => {
      const decade = `${Math.floor(mission.year / 10) * 10}s`;
      if (!acc[decade]) acc[decade] = [];
      acc[decade].push(mission);
      return acc;
    },
    {} as Record<string, typeof missions>
  );

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/astronomy"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Astronomy
          </Link>
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
            <span className="gradient-text-warm">Space Missions</span>{" "}
            Timeline
          </h1>
          <p className="mt-3 max-w-2xl text-white/50">
            From Sputnik to Artemis — the milestones of human space exploration.
            Explore the missions that expanded our understanding of the cosmos.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className="glass-card rounded-xl p-4 text-center">
            <CheckCircle2 className="mx-auto mb-1 h-5 w-5 text-green-400" />
            <p className="font-display text-xl font-bold text-white">
              {missions.filter((m) => m.status === "completed").length}
            </p>
            <p className="text-xs text-white/40">Completed</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <Clock className="mx-auto mb-1 h-5 w-5 text-cosmos-cyan" />
            <p className="font-display text-xl font-bold text-white">
              {missions.filter((m) => m.status === "active").length}
            </p>
            <p className="text-xs text-white/40">Active</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <Calendar className="mx-auto mb-1 h-5 w-5 text-cosmos-purple" />
            <p className="font-display text-xl font-bold text-white">
              {missions.filter((m) => m.status === "planned").length}
            </p>
            <p className="text-xs text-white/40">Planned</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  selectedType === t
                    ? "bg-cosmos-orange/20 text-cosmos-orange border border-cosmos-orange/30"
                    : "bg-white/5 text-white/50 border border-transparent hover:bg-white/10"
                }`}
              >
                {t === "All" ? "All Types" : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedStatus(s)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  selectedStatus === s
                    ? "bg-cosmos-cyan/20 text-cosmos-cyan border border-cosmos-cyan/30"
                    : "bg-white/5 text-white/50 border border-transparent hover:bg-white/10"
                }`}
              >
                {s === "All"
                  ? "All Status"
                  : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-cosmos-cyan/30 via-cosmos-purple/30 to-cosmos-orange/30 sm:left-1/2" />

          {Object.entries(decades).map(([decade, decadeMissions]) => (
            <div key={decade} className="mb-12">
              {/* Decade header */}
              <div className="relative mb-6">
                <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-cosmos-cyan border-2 border-cosmos-navy z-10" />
                <div className="ml-12 sm:ml-0 sm:text-center">
                  <h2 className="inline-block rounded-full bg-cosmos-cyan/10 px-4 py-1 font-display text-lg font-bold text-cosmos-cyan">
                    {decade}
                  </h2>
                </div>
              </div>

              {/* Mission cards */}
              <div className="space-y-6">
                {decadeMissions.map((mission, i) => {
                  const isLeft = i % 2 === 0;
                  return (
                    <div
                      key={mission.slug}
                      id={mission.slug}
                      className={`relative flex ${
                        isLeft ? "sm:flex-row" : "sm:flex-row-reverse"
                      } flex-col sm:items-center`}
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-white/50 z-10 hidden sm:block" />

                      {/* Card */}
                      <div
                        className={`ml-12 sm:ml-0 sm:w-[calc(50%-2rem)] ${
                          isLeft ? "sm:pr-8" : "sm:pl-8"
                        }`}
                      >
                        <Card className="group" id={mission.slug}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl">{mission.icon}</span>
                                  <CardTitle className="text-lg group-hover:text-cosmos-cyan transition-colors">
                                    {mission.name}
                                  </CardTitle>
                                </div>
                                <p className="mt-1 text-xs text-white/40">
                                  {mission.agency} · {mission.destination}
                                </p>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <Badge
                                  variant={
                                    mission.status === "active"
                                      ? "default"
                                      : mission.status === "planned"
                                      ? "secondary"
                                      : "outline"
                                  }
                                  className="text-[10px]"
                                >
                                  {mission.status}
                                </Badge>
                                <span className="text-xs text-white/30">
                                  {mission.year}
                                  {mission.endYear
                                    ? `–${mission.endYear}`
                                    : ""}
                                </span>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-white/60 leading-relaxed">
                              {mission.description}
                            </p>
                            <div className="mt-4 space-y-1.5">
                              {mission.achievements.map((a, j) => (
                                <div
                                  key={j}
                                  className="flex items-start gap-2 text-xs text-white/40"
                                >
                                  <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-cosmos-cyan" />
                                  {a}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
