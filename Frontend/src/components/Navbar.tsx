"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  ChevronDown, Rocket, Menu, X, Globe, Telescope, User,
  LayoutDashboard, LogOut, Brain, BarChart3, BookOpen,
  Mountain, Sparkles, Settings,
} from "lucide-react";

const earthSpaceItems = [
  { title: "Geology", href: "/geology", icon: Mountain, desc: "Rocks, tectonics, volcanoes", color: "text-orange-400" },
  { title: "Geography", href: "/geography", icon: Globe, desc: "Maps, climate, biomes", color: "text-emerald-400" },
  { title: "Astronomy", href: "/astronomy", icon: Telescope, desc: "Solar system, constellations", color: "text-cyan-400" },
  { title: "Current Affairs", href: "/current-affairs", icon: BarChart3, desc: "Latest space & science news", color: "text-purple-400" },
  { title: "General Science", href: "/general-science", icon: Sparkles, desc: "Physics, chemistry, biology", color: "text-amber-400" },
];

const userMenuItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Profile", href: "/profile", icon: User },
  { title: "My Library", href: "/library", icon: BookOpen },
];

const adminMenuItems = [
  { title: "Admin Panel", href: "/admin", icon: Settings },
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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.04] bg-[#0a0f1c]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[52px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0" onClick={closeMobile}>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500 to-blue-600">
            <Rocket className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-display text-[15px] font-bold tracking-tight text-white/90">
            Cosmos<span className="text-cyan-400">Earth</span>
          </span>
          <span className="hidden sm:inline-flex rounded border border-purple-500/15 bg-purple-500/8 px-1.5 py-[1px] text-[8px] font-semibold uppercase tracking-widest text-purple-400/80">
            Academy
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-0.5 md:flex">
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("media")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[12.5px] font-medium text-white/55 transition-colors hover:text-white/85">
              <Globe className="h-3 w-3 text-orange-400/70" />
              Earth & Space
              <ChevronDown className={`h-3 w-3 text-white/30 transition-transform duration-150 ${activeDropdown === "media" ? "rotate-180" : ""}`} />
            </button>

            {activeDropdown === "media" && (
              <div className="absolute top-full left-0 mt-1 w-[260px] rounded-lg border border-white/[0.06] bg-[#0e1525]/95 p-1 shadow-xl backdrop-blur-xl">
                {earthSpaceItems.map((item) => (
                  <Link key={item.title} href={item.href}
                    className="flex items-center gap-2.5 rounded-md px-2.5 py-2 transition-colors hover:bg-white/[0.04]">
                    <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
                    <div>
                      <p className="text-[12.5px] font-medium text-white/80">{item.title}</p>
                      <p className="text-[10px] text-white/30">{item.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/quizzes" className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[12.5px] font-medium text-white/55 transition-colors hover:text-white/85">
            <Brain className="h-3 w-3 text-pink-400/70" /> Quizzes
          </Link>
          <Link href="/visitors" className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[12.5px] font-medium text-white/55 transition-colors hover:text-white/85">
            <BarChart3 className="h-3 w-3 text-orange-400/70" /> Visitors
          </Link>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-1.5">
          {user ? (
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 rounded-md py-1 pl-1 pr-2 transition-colors hover:bg-white/[0.04]">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/80 to-blue-600/80 text-[9px] font-bold text-white">
                  {user.image ? <img src={user.image} alt="" className="h-full w-full rounded-full object-cover" /> : (user.name || "U").charAt(0).toUpperCase()}
                </div>
                <span className="hidden text-[12px] font-medium text-white/70 sm:block max-w-[80px] truncate">{user.name}</span>
                <ChevronDown className="h-3 w-3 text-white/30" />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 w-40 rounded-lg border border-white/[0.06] bg-[#0e1525]/95 p-1 shadow-xl backdrop-blur-xl z-50">
                    {userMenuItems.map((item) => (
                      <Link key={item.title} href={item.href} onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-md px-2.5 py-2 text-[12px] text-white/55 transition-colors hover:bg-white/[0.04] hover:text-white/85">
                        <item.icon className="h-3 w-3" /> {item.title}
                      </Link>
                    ))}
                    <div className="my-0.5 h-px bg-white/[0.05]" />
                    {adminMenuItems.map((item) => (
                      <Link key={item.title} href={item.href} onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-md px-2.5 py-2 text-[12px] text-white/55 transition-colors hover:bg-white/[0.04] hover:text-white/85">
                        <item.icon className="h-3 w-3" /> {item.title}
                      </Link>
                    ))}
                    <div className="my-0.5 h-px bg-white/[0.05]" />
                    <button onClick={() => { signOut(); setUserMenuOpen(false); }}
                      className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[12px] text-red-400/70 transition-colors hover:bg-red-500/8">
                      <LogOut className="h-3 w-3" /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-1 sm:flex">
              <Link href="/auth/login">
                <button className="rounded-md px-3 py-1.5 text-[12px] font-medium text-white/50 transition-colors hover:text-white/80">
                  Sign In
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="rounded-md bg-cyan-500/12 border border-cyan-500/20 px-3 py-1.5 text-[12px] font-medium text-cyan-400 transition-all hover:bg-cyan-500/20">
                  Get Started
                </button>
              </Link>
            </div>
          )}

          <button onClick={() => { setMobileOpen(!mobileOpen); setMobileSection("main"); }}
            className="rounded-md p-1.5 text-white/40 hover:text-white/70 md:hidden">
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-[52px] bottom-0 z-40 border-t border-white/[0.04] bg-[#0a0f1c]/98 backdrop-blur-xl md:hidden overflow-y-auto">
          <div className="px-4 py-4">
            {mobileSection === "main" ? (
              <div className="space-y-0.5">
                <button onClick={() => setMobileSection("media")}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[13px] text-white/65 hover:bg-white/[0.04]">
                  <span className="flex items-center gap-2.5"><Globe className="h-4 w-4 text-orange-400/70" /> Earth & Space Science</span>
                  <ChevronDown className="h-3.5 w-3.5 rotate-[-90deg] text-white/25" />
                </button>
                <Link href="/quizzes" onClick={closeMobile} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] text-white/65 hover:bg-white/[0.04]">
                  <Brain className="h-4 w-4 text-pink-400/70" /> Quizzes
                </Link>
                <Link href="/visitors" onClick={closeMobile} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] text-white/65 hover:bg-white/[0.04]">
                  <BarChart3 className="h-4 w-4 text-orange-400/70" /> Visitors
                </Link>
                <div className="my-3 h-px bg-white/[0.05]" />
                {!user ? (
                  <div className="space-y-2">
                    <Link href="/auth/login" onClick={closeMobile}>
                      <button className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] py-2.5 text-[13px] font-medium text-white/65">Sign In</button>
                    </Link>
                    <Link href="/auth/register" onClick={closeMobile}>
                      <button className="w-full rounded-lg bg-cyan-500/12 border border-cyan-500/20 py-2.5 text-[13px] font-medium text-cyan-400">Get Started</button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {userMenuItems.map((item) => (
                      <Link key={item.title} href={item.href} onClick={closeMobile}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] text-white/65 hover:bg-white/[0.04]">
                        <item.icon className="h-4 w-4" /> {item.title}
                      </Link>
                    ))}
                    <div className="my-2 h-px bg-white/[0.05]" />
                    {adminMenuItems.map((item) => (
                      <Link key={item.title} href={item.href} onClick={closeMobile}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] text-white/65 hover:bg-white/[0.04]">
                        <item.icon className="h-4 w-4" /> {item.title}
                      </Link>
                    ))}
                    <div className="my-2 h-px bg-white/[0.05]" />
                    <button onClick={() => { signOut(); closeMobile(); }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] text-red-400/70 hover:bg-red-500/8">
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-0.5">
                <button onClick={() => setMobileSection("main")}
                  className="mb-2 flex items-center gap-1.5 text-[11px] text-white/35 hover:text-white/60">
                  <ChevronDown className="h-3 w-3 rotate-90" /> Back
                </button>
                {earthSpaceItems.map((item) => (
                  <Link key={item.title} href={item.href} onClick={closeMobile}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-white/65 hover:bg-white/[0.04]">
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                    <div>
                      <p className="text-[13px] font-medium">{item.title}</p>
                      <p className="text-[10px] text-white/25">{item.desc}</p>
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
