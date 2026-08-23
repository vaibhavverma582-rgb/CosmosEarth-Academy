"use client";

import dynamic from "next/dynamic";
import { Telescope } from "lucide-react";
const CategoryPage = dynamic(() => import("@/components/category/CategoryPage"), { ssr: false });

export default function AstronomyPage() {
  return (
    <CategoryPage
      category="Astronomy"
      icon={Telescope}
      accentColor="gradient-text-cyan"
      glowColor="bg-glow-cyan"
      heroTitle="Astronomy"
      heroDescription="Journey through our solar system, discover constellations, trace the history of space exploration, and find worlds beyond our own."
    />
  );
}
