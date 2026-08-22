import Link from "next/link";
import { Rocket, Heart, Globe } from "lucide-react";

const explore = [
  { title: "Blog", href: "/blog" },
  { title: "Gallery", href: "/gallery" },
  { title: "Videos", href: "/videos" },
  { title: "Podcasts", href: "/podcasts" },
];

const learn = [
  { title: "Astronomy", href: "/astronomy" },
  { title: "Geology", href: "/geology" },
  { title: "Geography", href: "/geography" },
  { title: "Quizzes", href: "/quizzes" },
  { title: "Study Materials", href: "/study-materials" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#050710]/50 backdrop-blur-sm">
      <div className="section-divider" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 py-12 sm:py-16 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cosmos-cyan to-cosmos-purple">
                <Rocket className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-lg font-bold">
                <span className="gradient-text-cyan">Cosmos</span>
                <span className="text-white">Earth</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/50 max-w-xs">
              A personal cosmic journal. Exploring the universe, one idea at a time.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white/80">Explore</h3>
            <ul className="space-y-2.5">
              {explore.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="text-sm text-white/40 transition-colors hover:text-cosmos-cyan">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white/80">Learn</h3>
            <ul className="space-y-2.5">
              {learn.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="text-sm text-white/40 transition-colors hover:text-cosmos-cyan">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white/80">Info</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="text-sm text-white/40 transition-colors hover:text-cosmos-cyan">
                  About
                </Link>
              </li>
              <li>
                <Link href="/visitors" className="text-sm text-white/40 transition-colors hover:text-cosmos-cyan">
                  Visitors
                </Link>
              </li>
              <li>
                <Link href="/media" className="text-sm text-white/40 transition-colors hover:text-cosmos-cyan">
                  Media Hub
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 py-6">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-xs text-white/30">
              © 2026 CosmosEarth Academy. A personal cosmic journal.
            </p>
            <p className="flex items-center gap-1 text-xs text-white/30">
              Built with <Heart className="h-3 w-3 text-cosmos-pink" /> for the cosmos
              <Globe className="h-3 w-3 ml-1" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
