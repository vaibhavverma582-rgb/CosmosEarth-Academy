"use client";

import dynamic from "next/dynamic";
import { Globe } from "lucide-react";
const CategoryPage = dynamic(() => import("@/components/category/CategoryPage"), { ssr: false });

export default function GeographyPage() {
  return (
    <CategoryPage
      category="Geography"
      icon={Globe}
      accentColor="text-green-400"
      glowColor="bg-glow-green"
      heroTitle="Geography"
      heroDescription="Explore our planet through interactive maps, discover countries and cultures, understand climate zones, and journey through the world's diverse biomes."
    />
  );
}
