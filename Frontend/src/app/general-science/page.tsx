"use client";

import dynamic from "next/dynamic";
import { Sparkles } from "lucide-react";
const CategoryPage = dynamic(() => import("@/components/category/CategoryPage"), { ssr: false });

export default function GeneralSciencePage() {
  return (
    <CategoryPage
      category="General Science"
      icon={Sparkles}
      accentColor="text-yellow-400"
      glowColor="bg-glow-gold"
      heroTitle="General Science"
      heroDescription="Physics, chemistry, biology, and interdisciplinary science — explore the fundamental principles that govern our universe."
    />
  );
}
