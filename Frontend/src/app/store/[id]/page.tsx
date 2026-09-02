"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  BookOpen,
  Tag,
  ShoppingCart,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Shield,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface StoreProduct {
  id: string;
  title: string;
  description: string | null;
  type: string;
  category: string;
  subcategory: string | null;
  tags: string | null;
  coverImage: string | null;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  previewUrl: string | null;
  price: number;
  salePrice: number | null;
  isFree: boolean;
  published: boolean;
  downloads: number;
  createdAt: string;
}

interface PurchaseInfo {
  purchased: boolean;
  free: boolean;
  purchase: {
    id: string;
    order: {
      orderNumber: string;
      totalAmount: number;
      createdAt: string;
      paymentId: string | null;
    };
  } | null;
  product: StoreProduct;
}

export default function StoreProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const { data: session } = useSession();

  const [product, setProduct] = useState<StoreProduct | null>(null);
  const [purchaseInfo, setPurchaseInfo] = useState<PurchaseInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch product and purchase status
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const headers: Record<string, string> = {};
        if (session?.user?.id) headers["x-user-id"] = session.user.id;

        const [productRes, statusRes] = await Promise.all([
          fetch(`${API_URL}/api/store/${productId}`),
          fetch(`${API_URL}/api/store/${productId}/purchase-status`, { headers }),
        ]);

        if (productRes.ok) {
          const pData = await productRes.json();
          setProduct(pData.data);
        } else {
          setError("Product not found");
          return;
        }

        if (statusRes.ok) {
          const sData = await statusRes.json();
          setPurchaseInfo(sData);
        }
      } catch {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId, session?.user?.id]);

  const handleBuyNow = async () => {
    if (!session?.user?.id) {
      setError("Please sign in to purchase");
      return;
    }
    setBuying(true);
    setError("");
    setSuccess("");

    try {
      // Create order
      const orderRes = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": session.user.id,
        },
        body: JSON.stringify({ productId }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.error || "Failed to create order");
      }

      // If free or payment gateway not configured, handle directly
      if (orderData.message === "Free item granted") {
        setSuccess("Material accessed successfully!");
        // Refresh purchase status
        const statusRes = await fetch(`${API_URL}/api/store/${productId}/purchase-status`, {
          headers: { "x-user-id": session.user.id },
        });
        if (statusRes.ok) {
          const sData = await statusRes.json();
          setPurchaseInfo(sData);
        }
        return;
      }

      if (orderData.error === "Payment gateway is not configured") {
        setError("Payment gateway is not configured yet. Please contact admin.");
        return;
      }

      // For paid orders — simulate successful payment (test mode)
      // In production, this would redirect to payment gateway
      if (orderData.data && orderData.data.status === "PENDING") {
        // Simulate payment verification for test mode
        const verifyRes = await fetch(`${API_URL}/api/orders/${orderData.data.id}/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": session.user.id,
          },
          body: JSON.stringify({
            paymentId: `pay_test_${Date.now()}`,
            status: "captured",
            method: "upi",
          }),
        });

        if (verifyRes.ok) {
          setSuccess("Payment successful! You now have access to this material.");
          // Refresh purchase status
          const statusRes = await fetch(`${API_URL}/api/store/${productId}/purchase-status`, {
            headers: { "x-user-id": session.user.id },
          });
          if (statusRes.ok) {
            const sData = await statusRes.json();
            setPurchaseInfo(sData);
          }
        } else {
          throw new Error("Payment verification failed");
        }
      }
    } catch (err: any) {
      setError(err.message || "Purchase failed. Please try again.");
    } finally {
      setBuying(false);
    }
  };

  const handleDownload = async () => {
    if (!session?.user?.id || !purchaseInfo?.purchase) return;
    try {
      const res = await fetch(`${API_URL}/api/orders/purchases/${purchaseInfo.purchase.id}/download`, {
        method: "POST",
        headers: { "x-user-id": session.user.id },
      });
      if (res.ok) {
        const data = await res.json();
        window.open(data.downloadUrl, "_blank");
      }
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-white/40">Product not found</p>
          <Link href="/store">
            <Button variant="ghost" className="mt-4">
              <ArrowLeft className="h-4 w-4" /> Back to Store
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isPurchased = purchaseInfo?.purchased || false;
  const isFree = product.isFree || product.price === 0;
  const displayPrice = product.salePrice || product.price;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link href="/store" className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/60 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Store
        </Link>

        {/* Messages */}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4" /> {error}
          </div>
        )}
        {success && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
            <CheckCircle2 className="h-4 w-4" /> {success}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Product Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                {/* Cover Image */}
                {product.coverImage && (
                  <div className="mb-6 overflow-hidden rounded-xl">
                    <img
                      src={product.coverImage}
                      alt={product.title}
                      className="w-full max-h-64 object-contain bg-white/5"
                    />
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge variant="outline" className="text-xs">
                    <Tag className="mr-1 h-3 w-3" /> {product.type}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                  {product.subcategory && (
                    <Badge variant="outline" className="text-xs">
                      {product.subcategory}
                    </Badge>
                  )}
                </div>

                <h1 className="font-display text-2xl font-bold text-white mb-3">
                  {product.title}
                </h1>

                {product.description && (
                  <p className="text-sm text-white/60 leading-relaxed mb-6">
                    {product.description}
                  </p>
                )}

                {/* Tags */}
                {product.tags && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {product.tags.split(",").map((tag, i) => (
                      <span key={i} className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] text-white/40">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg bg-white/5 p-3">
                    <span className="text-white/40">Type:</span>{" "}
                    <span className="text-white">{product.type}</span>
                  </div>
                  <div className="rounded-lg bg-white/5 p-3">
                    <span className="text-white/40">Category:</span>{" "}
                    <span className="text-white">{product.category}</span>
                  </div>
                  <div className="rounded-lg bg-white/5 p-3">
                    <span className="text-white/40">Downloads:</span>{" "}
                    <span className="text-white">{product.downloads}</span>
                  </div>
                  <div className="rounded-lg bg-white/5 p-3">
                    <span className="text-white/40">Added:</span>{" "}
                    <span className="text-white">{new Date(product.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Purchase Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                {/* Price */}
                <div className="mb-6 text-center">
                  {isFree ? (
                    <div className="text-3xl font-bold text-green-400">FREE</div>
                  ) : (
                    <div>
                      {product.salePrice && product.salePrice < product.price && (
                        <div className="text-sm text-white/30 line-through">₹{product.price}</div>
                      )}
                      <div className="text-3xl font-bold text-white">₹{displayPrice}</div>
                    </div>
                  )}
                  <Badge variant={isFree ? "default" : "outline"} className={`mt-2 ${isFree ? "bg-green-500/20 text-green-400" : ""}`}>
                    {isFree ? "Free Material" : "Paid Material"}
                  </Badge>
                </div>

                {/* Action Button */}
                {isPurchased || isFree ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-sm text-green-400">
                      <CheckCircle2 className="h-4 w-4" />
                      {isFree ? "Free Material" : "Purchased"}
                    </div>

                    {product.fileUrl && (
                      <Button className="w-full" onClick={isPurchased ? handleDownload : () => product.fileUrl && window.open(product.fileUrl, "_blank")}>
                        <Download className="mr-2 h-4 w-4" />
                        Access Material
                      </Button>
                    )}

                    {product.previewUrl && (
                      <Button variant="outline" className="w-full" onClick={() => product.previewUrl && window.open(product.previewUrl, "_blank")}>
                        <FileText className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button className="w-full" size="lg" onClick={handleBuyNow} disabled={buying || !session}>
                    {buying ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ShoppingCart className="mr-2 h-4 w-4" />
                    )}
                    {!session ? "Sign in to Buy" : `Buy Now — ₹${displayPrice}`}
                  </Button>
                )}

                {/* Purchase Info */}
                {isPurchased && purchaseInfo?.purchase && (
                  <div className="mt-4 rounded-lg bg-white/5 p-3 text-xs text-white/40 space-y-1">
                    <div className="flex justify-between">
                      <span>Order:</span>
                      <span className="text-white">{purchaseInfo.purchase.order.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="text-white">₹{purchaseInfo.purchase.order.totalAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="text-white">{new Date(purchaseInfo.purchase.order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}

                {/* Security note */}
                <div className="mt-4 flex items-start gap-2 rounded-lg bg-white/[0.02] p-3 text-[10px] text-white/30">
                  <Shield className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <span>Secure payment. Your purchase is verified server-side.</span>
                </div>

                {!session && (
                  <p className="mt-3 text-center text-xs text-white/30">
                    <Link href="/auth/login" className="text-cyan-400 hover:underline">Sign in</Link> to purchase this material.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
