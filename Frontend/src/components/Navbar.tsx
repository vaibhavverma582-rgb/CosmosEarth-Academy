"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  ChevronDown,
  Rocket,
  Menu,
  X,
  Globe,
  Telescope,
  User,
  LayoutDashboard,
  LogOut,
  FileText,
  Images,
  Video,
  Film,
  Headphones,
  Mountain,
  Map,
  Sparkles,
  BarChart3,
  BookOpen,
  Brain,
  Palette,
} from "lucide-react";

const mediaItems = [
  { title: "Astronomy", href: "/astronomy", icon: Telescope, description: "Solar system, constellations, exoplanets", color: "text-cosmos-cyan" },
  { title: "Geology", href: "/geology", icon: Mountain, description: "Rocks, tectonics, volcanoes", color: "text-cosmos-orange" },
  { title: "Geography", href: "/geography", icon: Globe, description: "Maps, climate, biomes", color: "text-green-400" },
  { title: "Current Affairs", href: "/current-affairs", icon: BarChart3, description: "Latest space & science news", color: "text-cosmos-purple" },
];

const userMenuItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Profile", href: "/profile", icon: User },
];

const adminMenuItems = [
  { title: "Wallpaper", href: "/admin/wallpaper", icon: Palette },
];

export function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<"main" | "media">("main");

  const user = session?.user;
  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#050710]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5" onClick={closeMobile}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cosmos-cyan to-cosmos-purple shadow-cosmos-sm">
            <Rocket className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">
            <span className="gradient-text-cyan">Cosmos</span>
            <span className="text-white">Earth</span>
          </span>
          <span className="hidden rounded-full border border-cosmos-purple/30 bg-cosmos-purple/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cosmos-purple sm:inline-block">
            Academy
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {/* Media Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("media")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white">
              <Images className="h-3.5 w-3.5 text-cosmos-purple" />
              Media
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${activeDropdown === "media" ? "rotate-180" : ""}`} />
            </button>
            {activeDropdown === "media" && (
              <div className="absolute top-full left-0 mt-1 w-72 rounded-xl border border-white/10 bg-[#0d1233]/95 p-2 shadow-2xl backdrop-blur-xl">
                {mediaItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-white/5"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                    </div>
                    <div>
                      <p className="font-medium text-white">{item.title}</p>
                      <p className="text-xs text-white/40">{item.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Direct Links */}
          <Link href="/quizzes" className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white">
            <Brain className="h-3.5 w-3.5 text-cosmos-pink" />
            Quizzes
          </Link>

          <Link href="/visitors" className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white">
            <BarChart3 className="h-3.5 w-3.5 text-cosmos-orange" />
            Visitors
          </Link>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3 transition-colors hover:bg-white/10"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-cosmos-cyan to-cosmos-purple text-xs font-bold text-white">
                  {user.image ? (
                    <img src={user.image} alt="" className="h-full w-full rounded-full object-cover" />
                  ) : (
                    (user.name || "U").charAt(0).toUpperCase()
                  )}
                </div>
                <span className="hidden text-sm font-medium text-white sm:block">{user.name}</span>
                <ChevronDown className="h-3.5 w-3.5 text-white/50" />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-white/10 bg-[#0d1233]/95 p-1.5 shadow-2xl backdrop-blur-xl z-50">
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.title}
                      </Link>
                    ))}
                    <div className="my-1 h-px bg-white/10" />
                    {adminMenuItems.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.title}
                      </Link>
                    ))}
                    <div className="my-1 h-px bg-white/10" />
                    <button
                      onClick={() => { signOut(); setUserMenuOpen(false); }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/auth/login">
                <button className="rounded-lg px-3 py-1.5 text-sm font-medium text-white/70 transition-colors hover:text-white">
                  Sign In
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="rounded-lg bg-gradient-to-r from-cosmos-cyan to-cosmos-purple px-4 py-1.5 text-sm font-semibold text-white transition-all hover:shadow-cosmos-sm">
                  Get Started
                </button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => { setMobileOpen(!mobileOpen); setMobileSection("main"); }}
            className="rounded-lg p-2 text-white/60 hover:text-white md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 border-t border-white/5 bg-[#050710]/98 backdrop-blur-xl md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-6">
            {mobileSection === "main" && (
              <div className="space-y-1">
                <button
                  onClick={() => setMobileSection("media")}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-white/80 hover:bg-white/5"
                >
                  <span className="flex items-center gap-3">
                    <Images className="h-5 w-5 text-cosmos-purple" />
                    Media
                  </span>
                  <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                </button>
                <Link href="/quizzes" onClick={closeMobile} className="flex items-center gap-3 rounded-xl px-4 py-3 text-white/80 hover:bg-white/5">
                  <Brain className="h-5 w-5 text-cosmos-pink" />
                  Quizzes
                </Link>
                <Link href="/visitors" onClick={closeMobile} className="flex items-center gap-3 rounded-xl px-4 py-3 text-white/80 hover:bg-white/5">
                  <BarChart3 className="h-5 w-5 text-cosmos-orange" />
                  Visitors
                </Link>

                <div className="my-4 h-px bg-white/10" />

                {!user ? (
                  <div className="space-y-2">
                    <Link href="/auth/login" onClick={closeMobile}>
                      <button className="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white">
                        Sign In
                      </button>
                    </Link>
                    <Link href="/auth/register" onClick={closeMobile}>
                      <button className="w-full rounded-xl bg-gradient-to-r from-cosmos-cyan to-cosmos-purple py-3 text-sm font-semibold text-white">
                        Get Started
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={closeMobile}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-white/80 hover:bg-white/5"
                      >
                        <item.icon className="h-5 w-5" />
                        {item.title}
                      </Link>
                    ))}
                    <div className="my-1 h-px bg-white/10" />
                    {adminMenuItems.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={closeMobile}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-white/80 hover:bg-white/5"
                      >
                        <item.icon className="h-5 w-5" />
                        {item.title}
                      </Link>
                    ))}
                    <div className="my-1 h-px bg-white/10" />
                    <button
                      onClick={() => { signOut(); closeMobile(); }}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="h-5 w-5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

            {mobileSection === "media" && (
              <div className="space-y-1">
                <button
                  onClick={() => setMobileSection("main")}
                  className="mb-4 flex items-center gap-2 text-sm text-white/50 hover:text-white"
                >
                  <ChevronDown className="h-4 w-4 rotate-90" />
                  Back
                </button>
                {mediaItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={closeMobile}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-white/80 hover:bg-white/5"
                  >
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-white/40">{item.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
