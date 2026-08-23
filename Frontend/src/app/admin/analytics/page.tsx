"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Loader2, ArrowLeft, TrendingUp, Package, ShoppingCart, CreditCard,
  Download, DollarSign, Users, BarChart3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Analytics {
  totalProducts: number;
  freeProducts: number;
  paidProducts: number;
  totalOrders: number;
  paidOrders: number;
  failedOrders: number;
  totalRevenue: number;
  totalDownloads: number;
  recentPurchases: any[];
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) fetchAnalytics();
  }, [session?.user?.id]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${API_URL}/api/store/analytics`, {
        headers: { "x-user-id": session!.user.id },
      });
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data.data);
      }
    } catch {} finally { setLoading(false); }
  };

  if (status === "loading" || loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-cyan-400" /></div>;
  }

  if (!analytics) {
    return <div className="text-center py-20 text-white/40">Failed to load analytics</div>;
  }

  const stats = [
    { label: "Total Products", value: analytics.totalProducts, icon: Package, color: "text-cyan-400" },
    { label: "Free Products", value: analytics.freeProducts, icon: Package, color: "text-green-400" },
    { label: "Paid Products", value: analytics.paidProducts, icon: Package, color: "text-orange-400" },
    { label: "Total Orders", value: analytics.totalOrders, icon: ShoppingCart, color: "text-purple-400" },
    { label: "Successful Payments", value: analytics.paidOrders, icon: CreditCard, color: "text-green-400" },
    { label: "Failed Payments", value: analytics.failedOrders, icon: CreditCard, color: "text-red-400" },
    { label: "Total Revenue", value: `₹${analytics.totalRevenue}`, icon: DollarSign, color: "text-amber-400" },
    { label: "Total Downloads", value: analytics.totalDownloads, icon: Download, color: "text-cyan-400" },
  ];

  return (
    <div className="max-w-5xl">
      <Link href="/admin" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60 transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Admin
      </Link>

      <div className="mb-8">
        <Badge variant="outline" className="mb-2"><TrendingUp className="mr-1 h-3 w-3" /> Analytics</Badge>
        <h1 className="font-display text-3xl font-bold text-white">Store Analytics</h1>
        <p className="mt-1 text-sm text-white/50">Real-time store insights from the database</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="admin-stat-card p-5 text-center">
            <s.icon className={`mx-auto mb-2 h-5 w-5 ${s.color}`} />
            <p className="font-display text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-white/40">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Purchases */}
      <div className="admin-stat-card">
        <div className="border-b border-white/5 px-6 py-4">
          <h3 className="font-display text-sm font-bold text-white">Recent Purchases</h3>
        </div>
        {analytics.recentPurchases.length === 0 ? (
          <div className="p-8 text-center text-sm text-white/30">No purchases yet.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {analytics.recentPurchases.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between px-6 py-3">
                <div>
                  <p className="text-sm text-white">{p.user.name}</p>
                  <p className="text-xs text-white/40">{p.product?.title || "Item"}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">₹{p.order.totalAmount}</p>
                  <p className="text-[10px] text-white/30">{new Date(p.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
