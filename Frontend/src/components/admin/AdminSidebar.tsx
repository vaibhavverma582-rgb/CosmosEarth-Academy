"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Palette,
  FileText,
  Images,
  Video,
  Headphones,
  BookOpen,
  Brain,
  ChevronLeft,
  ChevronRight,
  Rocket,
  LayoutDashboard,
} from "lucide-react";

const navItems = [
  { title: "Overview", href: "/admin", icon: LayoutDashboard },
  { title: "Wallpaper", href: "/admin/wallpaper", icon: Palette },
  { title: "Blog Posts", href: "/blog/upload", icon: FileText },
  { title: "Gallery", href: "/gallery/upload", icon: Images },
  { title: "Videos", href: "/videos/upload", icon: Video },
  { title: "Podcasts", href: "/podcasts/upload", icon: Headphones },
  { title: "Notes", href: "/notes/upload", icon: BookOpen },
  { title: "Quizzes", href: "/quizzes", icon: Brain },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden lg:flex flex-col border-r border-white/5 bg-[#080b1a] transition-all duration-300 sticky top-16 h-[calc(100vh-4rem)] ${
        collapsed ? "w-[68px]" : "w-60"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/5">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cosmos-cyan to-cosmos-purple">
              <Rocket className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-xs font-bold text-white/80 uppercase tracking-wider">Admin</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-1.5 text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.title}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-cosmos-cyan/10 text-cosmos-cyan"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5"
                } ${collapsed ? "justify-center" : ""}`}
                title={collapsed ? item.title : undefined}
              >
                <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-cosmos-cyan" : ""}`} />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-white/5 px-3 py-3">
        <Link
          href="/"
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-white/30 hover:text-white/50 hover:bg-white/5 transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <Rocket className="h-3.5 w-3.5" />
          {!collapsed && <span>Back to Site</span>}
        </Link>
      </div>
    </aside>
  );
}
