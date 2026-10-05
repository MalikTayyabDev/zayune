import type { Customer } from "@prisma/client";
import { hashPassword } from "@/lib/password";

const globalStore = globalThis as unknown as {
  __zayuneCustomers?: Map<string, Customer & { passwordHash: string }>;
  __zayuneWaitlist?: Array<{
    id: string;
    email: string;
    productId: string;
    variantId?: string | null;
    createdAt: Date;
  }>;
};

function seedDemoCustomer(store: Map<string, Customer & { passwordHash: string }>) {
  const email = "customer@zayune.test";
  if (store.has(email)) return;
  const now = new Date();
  store.set(email, {
    id: "cus_demo_ayesha",
    email,
    passwordHash: hashPassword("test1234"),
    name: "Ayesha Test",
    phone: "03001234567",
    createdAt: now,
    updatedAt: now,
  });
}

export function getDemoCustomers() {
  if (!globalStore.__zayuneCustomers) {
    globalStore.__zayuneCustomers = new Map();
    seedDemoCustomer(globalStore.__zayuneCustomers);
  }
  return globalStore.__zayuneCustomers;
}

export function getDemoWaitlist() {
  if (!globalStore.__zayuneWaitlist) {
    globalStore.__zayuneWaitlist = [];
  }
  return globalStore.__zayuneWaitlist;
}
