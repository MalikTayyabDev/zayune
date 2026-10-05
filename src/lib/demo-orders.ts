import type { OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";

export type DemoOrderItem = {
  id: string;
  productId: string;
  variantId?: string | null;
  name: string;
  variantName?: string | null;
  price: number;
  quantity: number;
};

export type DemoOrder = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingNotes?: string | null;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentRef?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  adminNotes?: string | null;
  total: number;
  currency: string;
  shippingFee: number;
  subtotal: number;
  discountCode?: string | null;
  discountAmount?: number;
  instructions?: string;
  items: DemoOrderItem[];
  createdAt: Date;
  updatedAt: Date;
};

const globalStore = globalThis as unknown as {
  __zayuneDemoOrders?: Map<string, DemoOrder>;
};

export function getDemoOrdersStore() {
  if (!globalStore.__zayuneDemoOrders) {
    globalStore.__zayuneDemoOrders = new Map();
  }
  return globalStore.__zayuneDemoOrders;
}

export function listDemoOrders() {
  return Array.from(getDemoOrdersStore().values()).sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
}

export function listDemoOrdersByEmail(email: string) {
  const normalized = email.toLowerCase();
  return listDemoOrders().filter(
    (order) => order.customerEmail.toLowerCase() === normalized
  );
}

export function findDemoOrder(idOrNumber: string) {
  const store = getDemoOrdersStore();
  return (
    store.get(idOrNumber) ||
    listDemoOrders().find((o) => o.orderNumber === idOrNumber) ||
    null
  );
}

export function updateDemoOrder(id: string, patch: Partial<DemoOrder>) {
  const store = getDemoOrdersStore();
  const current = store.get(id);
  if (!current) return null;
  const next = { ...current, ...patch, updatedAt: new Date() };
  store.set(id, next);
  return next;
}
