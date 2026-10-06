export type DemoDiscount = {
  id: string;
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  minSubtotal: number;
  maxUses: number | null;
  usedCount: number;
  active: boolean;
  isIntroOffer: boolean;
  usageType: "UNLIMITED" | "LIMITED" | "ONE_TIME" | "ONE_TIME_EMAIL";
  productIds: string | null;
  startsAt: Date | null;
  endsAt: Date | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const defaults: DemoDiscount[] = [
  {
    id: "disc-welcome",
    code: "WELCOME10",
    type: "PERCENT",
    value: 10,
    minSubtotal: 0,
    maxUses: null,
    usedCount: 0,
    active: true,
    isIntroOffer: true,
    usageType: "UNLIMITED",
    productIds: null,
    startsAt: null,
    endsAt: null,
    description: "Introductory offer — 10% off your first order",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "disc-bloom",
    code: "BLOOM500",
    type: "FIXED",
    value: 500,
    minSubtotal: 3000,
    maxUses: 100,
    usedCount: 0,
    active: true,
    isIntroOffer: false,
    usageType: "LIMITED",
    productIds: null,
    startsAt: null,
    endsAt: null,
    description: "PKR 500 off orders over 3,000",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "disc-sub5",
    code: "SUBSCRIBE5",
    type: "PERCENT",
    value: 5,
    minSubtotal: 0,
    maxUses: null,
    usedCount: 0,
    active: true,
    isIntroOffer: false,
    usageType: "ONE_TIME_EMAIL",
    productIds: null,
    startsAt: null,
    endsAt: null,
    description: "Subscribe offer — 5% off (one-time per email)",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const globalStore = globalThis as unknown as {
  __zayuneDiscounts?: DemoDiscount[];
  __zayuneRedemptions?: { code: string; email: string }[];
};

export function getDemoDiscounts() {
  if (!globalStore.__zayuneDiscounts) {
    globalStore.__zayuneDiscounts = structuredClone(defaults);
  }
  return globalStore.__zayuneDiscounts;
}

export function getDemoRedemptions() {
  if (!globalStore.__zayuneRedemptions) {
    globalStore.__zayuneRedemptions = [];
  }
  return globalStore.__zayuneRedemptions;
}

export function findDemoDiscount(code: string) {
  return (
    getDemoDiscounts().find(
      (d) => d.code.toUpperCase() === code.trim().toUpperCase()
    ) || null
  );
}

export function upsertDemoDiscount(discount: DemoDiscount) {
  const list = getDemoDiscounts();
  const i = list.findIndex((d) => d.id === discount.id);
  if (i >= 0) list[i] = discount;
  else list.unshift(discount);
  return discount;
}

export function getActiveIntroOffer() {
  const now = Date.now();
  return (
    getDemoDiscounts().find((d) => {
      if (!d.active || !d.isIntroOffer) return false;
      if (d.startsAt && d.startsAt.getTime() > now) return false;
      if (d.endsAt && d.endsAt.getTime() < now) return false;
      if (d.usageType === "LIMITED" || d.usageType === "ONE_TIME") {
        const max = d.usageType === "ONE_TIME" ? 1 : d.maxUses;
        if (max != null && d.usedCount >= max) return false;
      }
      if (d.maxUses != null && d.usedCount >= d.maxUses) return false;
      return true;
    }) || null
  );
}
