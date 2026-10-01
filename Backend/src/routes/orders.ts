import { Router, Request, Response } from "express";
import { prisma } from "../index";

export const orderRoutes = Router();

// ─── Helper: Generate order number ──────────────
function generateOrderNumber(): string {
  const date = new Date();
  const prefix = "CEA";
  const dateStr = date.getFullYear().toString().slice(2) +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    date.getDate().toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `${prefix}-${dateStr}-${random}`;
}

// ─── POST /api/orders — Create order ────────────
orderRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Authentication required" });

    const { productId, bookId } = req.body;
    if (!productId && !bookId) {
      return res.status(400).json({ error: "Product or book ID is required" });
    }

    // Get product details
    let product: any = null;
    let price = 0;

    if (productId) {
      product = await prisma.storeProduct.findUnique({ where: { id: productId } });
      if (!product) return res.status(404).json({ error: "Product not found" });
      price = product.salePrice || product.price;
    } else if (bookId) {
      product = await prisma.book.findUnique({ where: { id: bookId } });
      if (!product) return res.status(404).json({ error: "Book not found" });
      price = product.salePrice || product.price;
    }

    // If free, grant access directly
    if (product.isFree || price === 0) {
      const order = await prisma.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          status: "PAID",
          totalAmount: 0,
          paymentVerified: true,
          userId,
          items: {
            create: [{
              price: 0,
              ...(productId ? { productId } : { bookId }),
            }],
          },
        },
        include: { items: true },
      });

      // Create purchase record
      await prisma.purchase.create({
        data: {
          userId,
          orderId: order.id,
          ...(productId ? { productId } : { bookId }),
        },
      });

      return res.json({ data: order, message: "Free item granted" });
    }

    // Check if payment provider is configured
    const paymentProvider = process.env.PAYMENT_PROVIDER;
    if (!paymentProvider) {
      return res.status(503).json({
        error: "Payment gateway is not configured",
        message: "Please contact admin to configure payment gateway.",
      });
    }

    // Create pending order
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        status: "PENDING",
        totalAmount: price,
        paymentProvider,
        userId,
        items: {
          create: [{
            price,
            ...(productId ? { productId } : { bookId }),
          }],
        },
      },
      include: { items: true },
    });

    res.json({ data: order, message: "Order created. Proceed to payment." });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// ─── GET /api/orders — List user orders ─────────
orderRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Authentication required" });

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: { select: { id: true, title: true, coverImage: true } },
            book: { select: { id: true, title: true, coverImage: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ data: orders });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// ─── GET /api/orders/:id — Get single order ─────
orderRoutes.get("/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Authentication required" });

    const order = await prisma.order.findUnique({
      where: { id: req.params.id as string },
      include: {
        items: {
          include: {
            product: true,
            book: true,
          },
        },
        payment: true,
      },
    });

    if (!order) return res.status(404).json({ error: "Order not found" });
    if (order.userId !== userId) return res.status(403).json({ error: "Not authorized" });

    res.json({ data: order });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// ─── POST /api/orders/:id/verify — Verify payment (webhook/callback) ──
orderRoutes.post("/:id/verify", async (req: Request, res: Response) => {
  try {
    const { paymentId, status, method, metadata } = req.body;
    const orderId = req.params.id as string;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) return res.status(404).json({ error: "Order not found" });

    // TODO: Verify with payment provider API using paymentId
    // For now, trust the webhook signature verification

    if (status === "captured" || status === "success") {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "PAID", paymentId, paymentVerified: true },
      });

      // Create payment record
      await prisma.payment.create({
        data: {
          provider: order.paymentProvider || "unknown",
          providerPaymentId: paymentId,
          amount: order.totalAmount,
          currency: order.currency,
          status: "captured",
          method: method || null,
          metadata: metadata ? JSON.stringify(metadata) : null,
          verifiedAt: new Date(),
          orderId,
        },
      });

      // Create purchase records for each item
      for (const item of order.items) {
        await prisma.purchase.create({
          data: {
            userId: order.userId,
            orderId,
            ...(item.productId ? { productId: item.productId } : {}),
            ...(item.bookId ? { bookId: item.bookId } : {}),
          },
        });
      }

      return res.json({ success: true, message: "Payment verified" });
    } else {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "FAILED" },
      });

      return res.json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "Failed to verify payment" });
  }
});

// ─── GET /api/purchases — User library ──────────
orderRoutes.get("/user/library", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Authentication required" });

    const purchases = await prisma.purchase.findMany({
      where: { userId },
      include: {
        product: { select: { id: true, title: true, coverImage: true, type: true, category: true, fileUrl: true } },
        book: { select: { id: true, title: true, coverImage: true, author: true, fileUrl: true } },
        order: { select: { orderNumber: true, createdAt: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const downloads = await prisma.download.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    res.json({ data: { purchases, downloads } });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch library" });
  }
});

// ─── POST /api/purchases/:id/download — Secure download ──
// Registered on both path shapes so it resolves under either mount:
//   /api/orders/purchases/:id/download  (store page)
//   /api/purchases/:id/download         (library page)
const handlePurchaseDownload = async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Authentication required" });

    const purchase = await prisma.purchase.findUnique({
      where: { id: req.params.id as string },
      include: { product: true, book: true, order: true },
    });

    if (!purchase) return res.status(404).json({ error: "Purchase not found" });
    if (purchase.userId !== userId) return res.status(403).json({ error: "Not authorized" });
    if (purchase.order.status !== "PAID" && purchase.order.totalAmount > 0) {
      return res.status(403).json({ error: "Payment not verified" });
    }

    const fileUrl = purchase.product?.fileUrl || purchase.book?.fileUrl;
    const fileName = purchase.product?.fileName || purchase.book?.fileName;

    if (!fileUrl) return res.status(404).json({ error: "No file available" });

    // Record download
    await prisma.download.create({
      data: {
        fileUrl,
        fileName,
        userId,
        productId: purchase.productId,
      },
    });

    // Increment download count
    if (purchase.productId) {
      await prisma.storeProduct.update({ where: { id: purchase.productId }, data: { downloads: { increment: 1 } } });
    }

    res.json({ downloadUrl: fileUrl, fileName });
  } catch (error) {
    res.status(500).json({ error: "Failed to process download" });
  }
};

orderRoutes.post("/purchases/:id/download", handlePurchaseDownload);
orderRoutes.post("/:id/download", handlePurchaseDownload);

// ─── GET /api/admin/orders — All orders (admin) ──
orderRoutes.get("/admin/all", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Authentication required" });

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (user?.role !== "admin") return res.status(403).json({ error: "Admin access required" });

    const { status, page = "1", limit = "20" } = req.query;
    const where: Record<string, any> = {};
    if (status) where.status = status as string;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { name: true, email: true } },
          items: { include: { product: { select: { title: true } }, book: { select: { title: true } } } },
          payment: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      data: orders,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});
