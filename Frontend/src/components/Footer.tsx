import Link from "next/link";
import { Rocket, Heart, Globe } from "lucide-react";

const explore = [
  { title: "Blog", href: "/blog" },
  { title: "Gallery", href: "/gallery" },
  { title: "Videos", href: "/videos" },
  { title: "Podcasts", href: "/podcasts" },
  { title: "Quizzes", href: "/quizzes" },
];

const learn = [
  { title: "Geology", href: "/geology" },
  { title: "Geography", href: "/geography" },
  { title: "Astronomy", href: "/astronomy" },
  { title: "Current Affairs", href: "/current-affairs" },
  { title: "General Science", href: "/general-science" },
];

const resources = [
  { title: "Notes", href: "/notes" },
  { title: "Books", href: "/books" },
  { title: "Research Papers", href: "/research-papers" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.04] bg-[#070b14]/60 backdrop-blur-sm">
      <div className="section-divider" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 py-10 sm:py-14 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500">
                <Rocket className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-display text-sm font-bold">
                <span className="text-cyan-400">Cosmos</span>
                <span className="text-white/80">Earth</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-white/35 max-w-[200px]">
              Exploring the universe, one idea at a time. An educational platform for Earth &amp; Space Science.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-white/40">Explore</h3>
            <ul className="space-y-2">
              {explore.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="text-xs text-white/30 transition-colors hover:text-cyan-400">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-white/40">Learn</h3>
            <ul className="space-y-2">
              {learn.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="text-xs text-white/30 transition-colors hover:text-cyan-400">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-white/40">Resources</h3>
            <ul className="space-y-2">
              {resources.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="text-xs text-white/30 transition-colors hover:text-cyan-400">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-white/40">Info</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-xs text-white/30 transition-colors hover:text-cyan-400">
                  About
                </Link>
              </li>
              <li>
                <Link href="/visitors" className="text-xs text-white/30 transition-colors hover:text-cyan-400">
                  Visitors
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/[0.04] py-5">
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <p className="text-[11px] text-white/25">
              © 2026 CosmosEarth Academy. All rights reserved.
            </p>
            <p className="flex items-center gap-1 text-[11px] text-white/25">
              Built with <Heart className="h-2.5 w-2.5 text-pink-400/60" /> for the cosmos
              <Globe className="h-2.5 w-2.5 ml-0.5 text-white/20" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
