"use client";

import dynamic from "next/dynamic";
import { Mountain } from "lucide-react";
const CategoryPage = dynamic(() => import("@/components/category/CategoryPage"), { ssr: false });

export default function GeologyPage() {
  return (
    <CategoryPage
      category="Geology"
      icon={Mountain}
      accentColor="gradient-text-warm"
      glowColor="bg-glow-orange"
      heroTitle="Geology"
      heroDescription="Discover the dynamic processes that shape our planet — from the rocks beneath your feet to the tectonic forces that build mountains and trigger earthquakes."
    />
  );
}
