"use client";

import { useEffect, useRef } from "react";
import { BarChart3, Eye, Users, Clock, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const countryData = [
  { flag: "🇮🇳", name: "India", count: 4120 },
  { flag: "🇺🇸", name: "United States", count: 2890 },
  { flag: "🇩🇪", name: "Germany", count: 1540 },
  { flag: "🇬🇧", name: "United Kingdom", count: 1230 },
  { flag: "🇯🇵", name: "Japan", count: 980 },
  { flag: "🇧🇷", name: "Brazil", count: 760 },
  { flag: "🇨🇦", name: "Canada", count: 620 },
  { flag: "🇦🇺", name: "Australia", count: 510 },
];

const viewsData7 = [420, 385, 510, 470, 620, 580, 690];
const viewsData30 = [310,290,420,385,440,510,470,520,490,620,580,610,690,720,650,680,710,750,690,720,780,810,760,790,830,850,870,820,860,890];

function getDayLabels(count: number) {
  const labels = [];
  const today = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
  }
  return labels;
}

function AnimatedNumber({ target, suffix }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const elRef = el;
    const duration = 1200;
    const startTime = performance.now();
    function update(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      elRef.textContent = current.toLocaleString() + (suffix || "");
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }, [target, suffix]);
  return <span ref={ref}>0</span>;
}

export default function VisitorsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const c = ctx;

    let data = viewsData7;
    let currentPeriod = 7;

    function draw() {
      const w = canvas!.width;
      const h = canvas!.height;
      c.clearRect(0, 0, w, h);

      const max = Math.max(...data) * 1.1;
      const padding = { top: 10, right: 10, bottom: 30, left: 40 };
      const chartW = w - padding.left - padding.right;
      const chartH = h - padding.top - padding.bottom;

      // Grid lines
      c.strokeStyle = "rgba(255,255,255,0.04)";
      c.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartH / 4) * i;
        c.beginPath();
        c.moveTo(padding.left, y);
        c.lineTo(w - padding.right, y);
        c.stroke();
      }

      // Gradient fill
      const gradient = c.createLinearGradient(0, padding.top, 0, h - padding.bottom);
      gradient.addColorStop(0, "rgba(96, 165, 250, 0.25)");
      gradient.addColorStop(1, "rgba(96, 165, 250, 0.0)");

      const stepX = chartW / (data.length - 1);

      // Fill area
      c.beginPath();
      c.moveTo(padding.left, h - padding.bottom);
      data.forEach((v, i) => {
        const x = padding.left + i * stepX;
        const y = padding.top + chartH - (v / max) * chartH;
        if (i === 0) c.lineTo(x, y);
        else c.lineTo(x, y);
      });
      c.lineTo(padding.left + (data.length - 1) * stepX, h - padding.bottom);
      c.closePath();
      c.fillStyle = gradient;
      c.fill();

      // Line
      c.beginPath();
      data.forEach((v, i) => {
        const x = padding.left + i * stepX;
        const y = padding.top + chartH - (v / max) * chartH;
        if (i === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      });
      c.strokeStyle = "#60a5fa";
      c.lineWidth = 2.5;
      c.lineJoin = "round";
      c.stroke();

      // Points
      data.forEach((v, i) => {
        const x = padding.left + i * stepX;
        const y = padding.top + chartH - (v / max) * chartH;
        c.beginPath();
        c.arc(x, y, 4, 0, Math.PI * 2);
        c.fillStyle = "#60a5fa";
        c.fill();
        c.strokeStyle = "#050710";
        c.lineWidth = 2;
        c.stroke();
      });

      // X labels
      c.fillStyle = "#64748b";
      c.font = "10px Inter, sans-serif";
      c.textAlign = "center";
      const labels = getDayLabels(data.length);
      const maxLabels = Math.min(data.length, 7);
      const labelStep = Math.ceil(data.length / maxLabels);
      data.forEach((_, i) => {
        if (i % labelStep === 0 || i === data.length - 1) {
          const x = padding.left + i * stepX;
          c.fillText(labels[i], x, h - 8);
        }
      });

      // Y labels
      c.textAlign = "right";
      for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartH / 4) * i;
        const val = Math.round(max - (max / 4) * i);
        c.fillText(val >= 1000 ? (val / 1000).toFixed(1) + "k" : String(val), padding.left - 8, y + 4);
      }
    }

    draw();

    // Expose toggle function
    (window as any).__setPeriod = (period: number) => {
      currentPeriod = period;
      data = period === 7 ? viewsData7 : viewsData30;
      draw();
    };
  }, []);

  const maxCount = countryData[0].count;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <Badge variant="outline" className="mb-4">
            <BarChart3 className="mr-1 h-3 w-3" />
            Visitors
          </Badge>
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
            Visitors
          </h1>
          <p className="mt-4 text-lg text-white/50">
            Who&apos;s exploring CosmosEarth Academy from across the cosmos.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-5 mb-8 lg:grid-cols-4">
          <Card className="text-center">
            <CardContent className="p-6">
              <Eye className="mx-auto mb-2 h-6 w-6 text-cosmos-cyan" />
              <p className="font-display text-3xl font-bold gradient-text-cyan">
                <AnimatedNumber target={12847} />
              </p>
              <p className="text-xs text-white/40 uppercase tracking-wider mt-1">Total Views</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Users className="mx-auto mb-2 h-6 w-6 text-cosmos-purple" />
              <p className="font-display text-3xl font-bold gradient-text-cyan">
                <AnimatedNumber target={3291} />
              </p>
              <p className="text-xs text-white/40 uppercase tracking-wider mt-1">Unique Visitors</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Clock className="mx-auto mb-2 h-6 w-6 text-cosmos-orange" />
              <p className="font-display text-3xl font-bold gradient-text-cyan">4:32</p>
              <p className="text-xs text-white/40 uppercase tracking-wider mt-1">Avg. Time</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <TrendingDown className="mx-auto mb-2 h-6 w-6 text-green-400" />
              <p className="font-display text-3xl font-bold gradient-text-cyan">
                <AnimatedNumber target={24} suffix="%" />
              </p>
              <p className="text-xs text-white/40 uppercase tracking-wider mt-1">Bounce Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Line Chart */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-sm font-bold text-white">Views Over Time</h3>
                <div className="flex gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
                  <button
                    onClick={() => (window as any).__setPeriod?.(7)}
                    className="rounded-md bg-gradient-to-r from-cosmos-cyan to-cosmos-purple px-3 py-1 text-xs font-semibold text-[#050710]"
                  >
                    7D
                  </button>
                  <button
                    onClick={() => (window as any).__setPeriod?.(30)}
                    className="rounded-md px-3 py-1 text-xs font-semibold text-white/50 hover:text-white"
                  >
                    30D
                  </button>
                </div>
              </div>
              <canvas ref={canvasRef} width={500} height={250} className="w-full" />
            </CardContent>
          </Card>

          {/* Country Bars */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-display text-sm font-bold text-white mb-4">Visitor Countries</h3>
              <div className="space-y-3">
                {countryData.map((c) => {
                  const pct = (c.count / maxCount) * 100;
                  return (
                    <div key={c.name} className="flex items-center gap-3">
                      <span className="text-lg w-7 text-center">{c.flag}</span>
                      <span className="text-sm text-white/60 w-28 shrink-0">{c.name}</span>
                      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cosmos-cyan to-cosmos-purple transition-all duration-1000"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-white/40 w-12 text-right font-variant-numeric tabular-nums">
                        {c.count.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
