import Link from "next/link";
import { Rocket, ArrowLeft, Home, Search, Map } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "404 — Lost in Space | CosmosEarth Academy",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Animated rocket */}
        <div className="relative mx-auto mb-8 h-32 w-32">
          <div className="absolute inset-0 animate-float">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-cosmos-cyan/10 ring-2 ring-cosmos-cyan/20">
              <Rocket className="h-14 w-14 text-cosmos-cyan/60 -rotate-45" />
            </div>
          </div>
          {/* Stars */}
          <div className="absolute -top-2 left-4 h-1.5 w-1.5 rounded-full bg-cosmos-gold animate-glow-pulse" />
          <div className="absolute top-4 -right-2 h-1 w-1 rounded-full bg-white/60 animate-glow-pulse" style={{ animationDelay: "0.5s" }} />
          <div className="absolute bottom-4 left-0 h-1 w-1 rounded-full bg-cosmos-purple animate-glow-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute -bottom-1 right-6 h-1.5 w-1.5 rounded-full bg-cosmos-orange/60 animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
        </div>

        <h1 className="font-display text-6xl font-bold text-white mb-2">404</h1>
        <h2 className="font-display text-xl font-bold text-white mb-3">
          Lost in Space
        </h2>
        <p className="text-white/50 mb-8 leading-relaxed">
          This page has drifted beyond our sensors.
          The coordinates you entered don&apos;t match any known celestial body.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button size="lg">
              <Home className="h-4 w-4" />
              Return to Base
            </Button>
          </Link>
          <Link href="/courses">
            <Button variant="outline" size="lg">
              <BookOpen className="h-4 w-4" />
              Browse Courses
            </Button>
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {[
            { label: "Astronomy", href: "/astronomy" },
            { label: "Geology", href: "/geology" },
            { label: "Geography", href: "/geography" },
            { label: "Media Hub", href: "/media" },
            { label: "Quizzes", href: "/quizzes" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="glass-card rounded-lg px-3 py-1.5 text-xs text-white/40 transition-all hover:text-white/70 hover:border-white/20"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// Need this import for the button
import { BookOpen } from "lucide-react";
