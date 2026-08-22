import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SessionProvider } from "@/components/SessionProvider";
import { WallpaperProvider } from "@/components/WallpaperProvider";

export const metadata: Metadata = {
  title: {
    default: "CosmosEarth Academy — Exploring the Universe, One Idea at a Time",
    template: "%s | CosmosEarth Academy",
  },
  description:
    "A personal cosmic journal for exploring space, astronomy, and planetary science. Blog posts, notes, study materials, gallery, videos, and podcasts.",
  keywords: [
    "astronomy", "space", "cosmos", "planets", "solar system",
    "blog", "personal journal", "space exploration",
  ],
  authors: [{ name: "CosmosEarth Academy" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CosmosEarth Academy",
    title: "CosmosEarth Academy — Exploring the Universe, One Idea at a Time",
    description:
      "A personal cosmic journal for space and astronomy enthusiasts.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CosmosEarth Academy",
    description:
      "A personal cosmic journal for space and astronomy enthusiasts.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="space-bg">
        {/* Animated Solar System Background */}
        <div className="solar-system-bg">
          <div className="ss-sun" />
          <div className="ss-orbit ss-orbit-1" />
          <div className="ss-orbit-body ss-orbit-body-1"><div className="ss-planet ss-planet-1" /></div>
          <div className="ss-orbit ss-orbit-2" />
          <div className="ss-orbit-body ss-orbit-body-2"><div className="ss-planet ss-planet-2" /></div>
          <div className="ss-orbit ss-orbit-3" />
          <div className="ss-orbit-body ss-orbit-body-3"><div className="ss-planet ss-planet-3" /></div>
          <div className="ss-orbit ss-orbit-4" />
          <div className="ss-orbit-body ss-orbit-body-4"><div className="ss-planet ss-planet-4" /></div>
          <div className="ss-orbit ss-orbit-5" />
          <div className="ss-orbit-body ss-orbit-body-5"><div className="ss-planet ss-planet-5" /></div>
          <div className="ss-orbit ss-orbit-6" />
          <div className="ss-orbit-body ss-orbit-body-6"><div className="ss-planet ss-planet-6" /></div>
          <div className="ss-orbit ss-orbit-7" />
          <div className="ss-orbit-body ss-orbit-body-7"><div className="ss-planet ss-planet-7" /></div>
          <div className="ss-orbit ss-orbit-8" />
          <div className="ss-orbit-body ss-orbit-body-8"><div className="ss-planet ss-planet-8" /></div>
        </div>

        {/* Dynamic Wallpaper */}
        <WallpaperProvider />

        {/* Ambient cosmic orbs */}
        <div className="cosmic-orb-1" />
        <div className="cosmic-orb-2" />
        <div className="cosmic-orb-3" />

        {/* Main content */}
        <SessionProvider>
          <div className="relative z-10 flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
