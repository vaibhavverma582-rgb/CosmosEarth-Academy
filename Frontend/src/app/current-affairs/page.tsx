"use client";

import dynamic from "next/dynamic";
import { BarChart3 } from "lucide-react";
const CategoryPage = dynamic(() => import("@/components/category/CategoryPage"), { ssr: false });

export default function CurrentAffairsPage() {
  return (
    <CategoryPage
      category="Current Affairs"
      icon={BarChart3}
      accentColor="text-purple-400"
      glowColor="bg-glow-purple"
      heroTitle="Current Affairs"
      heroDescription="Stay updated with the latest developments in space exploration, scientific discoveries, and Earth science from around the world."
    />
  );
}
