"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Loader2, ArrowLeft, CreditCard, Package, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  currency: string;
  paymentProvider: string | null;
  paymentMethod: string | null;
  createdAt: string;
  user: { name: string; email: string };
  items: { price: number; product: { title: string } | null; book: { title: string } | null }[];
}

const statusColors: Record<string, string> = {
  PAID: "bg-green-500/20 text-green-400",
  PENDING: "bg-yellow-500/20 text-yellow-400",
  FAILED: "bg-red-500/20 text-red-400",
  CANCELLED: "bg-white/10 text-white/40",
  REFUNDED: "bg-purple-400/20 text-purple-400",
};

export default function OrdersAdminPage() {
  const { data: session, status: authStatus } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (session?.user?.id) fetchOrders();
  }, [session?.user?.id, filter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (filter) params.set("status", filter);
      const res = await fetch(`${API_URL}/api/orders/admin/all?${params}`, {
        headers: { "x-user-id": session!.user.id },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.data);
      }
    } catch {} finally { setLoading(false); }
  };

  if (authStatus === "loading" || loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-cyan-400" /></div>;
  }

  return (
    <div className="max-w-5xl">
      <Link href="/admin" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60 transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Admin
      </Link>

      <div className="mb-8">
        <Badge variant="outline" className="mb-2"><CreditCard className="mr-1 h-3 w-3" /> Orders</Badge>
        <h1 className="font-display text-3xl font-bold text-white">Orders</h1>
        <p className="mt-1 text-sm text-white/50">View and manage customer orders</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        {["", "PAID", "PENDING", "FAILED", "REFUNDED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${filter === s ? "bg-cyan-400/20 text-cyan-400" : "bg-white/5 text-white/40 hover:text-white/60"}`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="admin-stat-card p-12 text-center">
          <Package className="mx-auto mb-3 h-8 w-8 text-white/20" />
          <p className="text-sm text-white/40">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="admin-stat-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{o.orderNumber}</span>
                    <Badge className={`text-[10px] ${statusColors[o.status] || ""}`}>{o.status}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-white/40">
                    {o.user.name} ({o.user.email})
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">₹{o.totalAmount}</p>
                  <p className="text-xs text-white/40">{o.currency}</p>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {o.items.map((item, i) => (
                  <Badge key={i} variant="outline" className="text-[10px]">
                    {item.product?.title || item.book?.title || "Item"} — ₹{item.price}
                  </Badge>
                ))}
              </div>
              <p className="mt-2 text-[10px] text-white/30">
                {new Date(o.createdAt).toLocaleString()}
                {o.paymentProvider && ` • ${o.paymentProvider}`}
                {o.paymentMethod && ` • ${o.paymentMethod}`}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
