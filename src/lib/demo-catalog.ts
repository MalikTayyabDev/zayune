import {
  demoCategories,
  demoProducts,
  isDemoMode,
  type DemoProductSeed,
} from "@/lib/demo-data";
import { getDemoOrdersStore, type DemoOrder } from "@/lib/demo-orders";

export type DemoProduct = DemoProductSeed;

const globalStore = globalThis as unknown as {
  __zayuneCatalog?: DemoProduct[];
  __zayuneCatalogVersion?: number;
};

/** Bump when clearing placeholder catalog so in-memory demos reset. */
const CATALOG_VERSION = 4;

function normalizeProduct(product: DemoProductSeed): DemoProduct {
  return {
    ...structuredClone(product),
    compareAtPrice: product.compareAtPrice ?? null,
    isBundle: product.isBundle ?? false,
    bundleProductIds: product.bundleProductIds ?? [],
    introOfferPercent: product.introOfferPercent ?? null,
  };
}

export function getDemoCatalog() {
  if (
    !globalStore.__zayuneCatalog ||
    globalStore.__zayuneCatalogVersion !== CATALOG_VERSION
  ) {
    globalStore.__zayuneCatalog = demoProducts.map(normalizeProduct);
    globalStore.__zayuneCatalogVersion = CATALOG_VERSION;
  }
  return globalStore.__zayuneCatalog;
}

export function findDemoProduct(idOrSlug: string) {
  return getDemoCatalog().find((p) => p.id === idOrSlug || p.slug === idOrSlug) ?? null;
}

export function upsertDemoProduct(product: DemoProduct) {
  const catalog = getDemoCatalog();
  const index = catalog.findIndex((p) => p.id === product.id);
  if (index >= 0) catalog[index] = product;
  else catalog.unshift(product);
  return product;
}

export function deleteDemoProduct(id: string) {
  const catalog = getDemoCatalog();
  const index = catalog.findIndex((p) => p.id === id);
  if (index >= 0) catalog.splice(index, 1);
}

export function getDemoCategories() {
  return demoCategories;
}

export function getDemoMetrics() {
  const catalog = getDemoCatalog();
  const orders = Array.from(getDemoOrdersStore().values()) as DemoOrder[];
  const revenue = orders
    .filter((o) => o.paymentStatus === "PAID" || o.status === "DELIVERED")
    .reduce((sum, o) => sum + o.total, 0);
  const pending = orders.filter((o) => o.status === "PENDING").length;
  const shipped = orders.filter((o) => o.status === "SHIPPED").length;
  const lowStock = catalog.filter(
    (p) => p.fulfillment === "IN_STOCK" && (p.stock ?? 0) <= 2
  ).length;

  const sold = new Map<string, { name: string; qty: number; revenue: number }>();
  for (const order of orders) {
    for (const item of order.items) {
      const prev = sold.get(item.name) || { name: item.name, qty: 0, revenue: 0 };
      prev.qty += item.quantity;
      prev.revenue += item.price * item.quantity;
      sold.set(item.name, prev);
    }
  }
  const bestSellers = Array.from(sold.values())
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  return {
    productCount: catalog.length,
    publishedCount: catalog.filter((p) => p.published).length,
    orderCount: orders.length,
    pendingCount: pending,
    shippedCount: shipped,
    revenue,
    customerEstimate: new Set(orders.map((o) => o.customerEmail)).size,
    lowStockCount: lowStock,
    avgOrderValue: orders.length
      ? Math.round(orders.reduce((s, o) => s + o.total, 0) / orders.length)
      : 0,
    invoiceCount: orders.length,
    bestSellers,
    recentOrders: orders.slice(-5).reverse(),
  };
}

export { isDemoMode };
