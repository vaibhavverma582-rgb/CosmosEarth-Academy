"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Persistent visitor fingerprint (survives tab closes)
function getVisitorId(): string {
  try {
    if (typeof window === "undefined") return "";
    let vid = localStorage.getItem("cosmos-visitor-id");
    if (!vid) {
      vid = crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem("cosmos-visitor-id", vid);
    }
    return vid;
  } catch {
    return "fallback-" + Math.random().toString(36).slice(2);
  }
}

// Session ID (per tab)
function getSessionId(): string {
  try {
    if (typeof window === "undefined") return "";
    let sid = sessionStorage.getItem("cosmos-session-id");
    if (!sid) {
      sid = crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem("cosmos-session-id", sid);
    }
    return sid;
  } catch {
    return "fallback-" + Math.random().toString(36).slice(2);
  }
}

// Client-side country detection (cached in sessionStorage)
let cachedCountry: { country: string; countryCode: string } | null = null;

async function detectCountry(): Promise<{ country: string; countryCode: string } | null> {
  if (typeof window === "undefined") return null;
  if (cachedCountry) return cachedCountry;

  try {
    const cached = sessionStorage.getItem("cosmos-country-cache");
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.ts < 3600000) {
        cachedCountry = { country: parsed.country, countryCode: parsed.countryCode };
        return cachedCountry;
      }
    }
  } catch {}

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch("https://ipapi.co/json/", { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const result = {
        country: data.country_name || "Unknown",
        countryCode: data.country_code || "XX",
      };
      cachedCountry = result;
      sessionStorage.setItem("cosmos-country-cache", JSON.stringify({ ...result, ts: Date.now() }));
      return result;
    }
  } catch {}

  return null;
}

export function PageTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string>("");

  useEffect(() => {
    if (!pathname) return;
    if (lastTracked.current === pathname) return;
    lastTracked.current = pathname;

    const visitorId = getVisitorId();
    const sessionId = getSessionId();

    detectCountry()
      .then((geo) => {
        fetch(`${API_URL}/api/visitors/track`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page: pathname,
            sessionId,
            visitorId,
            country: geo?.country || null,
            countryCode: geo?.countryCode || null,
          }),
          keepalive: true,
        }).catch(() => {});
      })
      .catch(() => {});
  }, [pathname]);

  return null;
}
