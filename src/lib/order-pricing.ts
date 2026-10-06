import {
  findDemoDiscount,
  getDemoDiscounts,
  getDemoRedemptions,
} from "@/lib/demo-discounts";
import { findDemoProduct } from "@/lib/demo-catalog";
import { demoSettings, isDemoMode } from "@/lib/demo-data";
import { prisma } from "@/lib/prisma";

export type CartLineInput = {
  productId: string;
  variantId?: string;
  quantity: number;
};

export type PricedLine = {
  productId: string;
  variantId?: string | null;
  name: string;
  variantName?: string | null;
  price: number;
  quantity: number;
  image?: string;
  slug?: string;
};

const MAX_QTY = 20;

export async function priceCartLines(lines: CartLineInput[]): Promise<PricedLine[]> {
  if (lines.length === 0) {
    throw new Error("Cart is empty.");
  }

  const priced: PricedLine[] = [];

  for (const line of lines) {
    const qty = Math.min(Math.max(1, Math.floor(line.quantity)), MAX_QTY);

    if (isDemoMode()) {
      const product = findDemoProduct(line.productId);
      if (!product || !product.published) {
        throw new Error("One or more products are unavailable.");
      }
      const variant = line.variantId
        ? product.variants.find((v) => v.id === line.variantId)
        : product.variants[0];
      if (line.variantId && !variant) {
        throw new Error("Selected option is unavailable.");
      }
      if (
        product.fulfillment === "IN_STOCK" &&
        product.stock != null &&
        product.stock < qty
      ) {
        throw new Error(`${product.name} does not have enough stock.`);
      }
      if (variant?.stock != null && variant.stock < qty) {
        throw new Error(`${product.name} (${variant.name}) is low on stock.`);
      }

      const unit = product.price + (variant?.priceDelta || 0);
      priced.push({
        productId: product.id,
        variantId: variant?.id || null,
        name: product.name,
        variantName: variant?.name || null,
        price: unit,
        quantity: qty,
        image: variant?.imageUrl || product.images[0]?.url,
        slug: product.slug,
      });
      continue;
    }

    const product = await prisma.product.findUnique({
      where: { id: line.productId },
      include: { variants: true, images: { orderBy: { sortOrder: "asc" } } },
    });
    if (!product || !product.published) {
      throw new Error("One or more products are unavailable.");
    }
    const variant = line.variantId
      ? product.variants.find((v) => v.id === line.variantId)
      : product.variants[0];
    if (line.variantId && !variant) {
      throw new Error("Selected option is unavailable.");
    }
    if (
      product.fulfillment === "IN_STOCK" &&
      product.stock != null &&
      product.stock < qty
    ) {
      throw new Error(`${product.name} does not have enough stock.`);
    }
    if (variant?.stock != null && variant.stock < qty) {
      throw new Error(`${product.name} (${variant.name}) is low on stock.`);
    }

    priced.push({
      productId: product.id,
      variantId: variant?.id || null,
      name: product.name,
      variantName: variant?.name || null,
      price: product.price + (variant?.priceDelta || 0),
      quantity: qty,
      image: variant?.imageUrl || product.images[0]?.url,
      slug: product.slug,
    });
  }

  return priced;
}

export async function resolveDiscount(
  code: string | undefined | null,
  subtotal: number,
  opts?: { email?: string; productIds?: string[] }
) {
  if (!code?.trim()) {
    return { discountAmount: 0, discountCode: null as string | null, label: null as string | null };
  }

  const normalized = code.trim().toUpperCase();
  const now = Date.now();

  const discount = isDemoMode()
    ? findDemoDiscount(normalized)
    : await prisma.discountCode.findUnique({ where: { code: normalized } });

  if (!discount || !discount.active) {
    throw new Error("Discount code is invalid.");
  }
  if (discount.startsAt && discount.startsAt.getTime() > now) {
    throw new Error("Discount code is not active yet.");
  }
  if (discount.endsAt && discount.endsAt.getTime() < now) {
    throw new Error("Discount code has expired.");
  }

  const usageType =
    ("usageType" in discount && discount.usageType) ||
    (discount.maxUses === 1 ? "ONE_TIME" : discount.maxUses != null ? "LIMITED" : "UNLIMITED");

  const maxUses =
    usageType === "ONE_TIME" ? 1 : discount.maxUses != null ? discount.maxUses : null;

  if (maxUses != null && discount.usedCount >= maxUses) {
    throw new Error("Discount code has reached its usage limit.");
  }

  if (usageType === "ONE_TIME_EMAIL" && opts?.email) {
    const email = opts.email.toLowerCase();
    if (isDemoMode()) {
      if (getDemoRedemptions().some((r) => r.code === normalized && r.email === email)) {
        throw new Error("This code was already used with this email.");
      }
    } else {
      const prior = await prisma.discountRedemption.findFirst({
        where: { code: normalized, email },
      });
      if (prior) {
        throw new Error("This code was already used with this email.");
      }
    }
  }

  const productIdsRaw =
    "productIds" in discount ? (discount.productIds as string | null) : null;
  if (productIdsRaw && opts?.productIds?.length) {
    try {
      const allowed = JSON.parse(productIdsRaw) as string[];
      if (Array.isArray(allowed) && allowed.length > 0) {
        const hit = opts.productIds.some((id) => allowed.includes(id));
        if (!hit) {
          throw new Error("This code doesn’t apply to the items in your cart.");
        }
      }
    } catch (e) {
      if (e instanceof Error && e.message.includes("doesn’t apply")) throw e;
    }
  }

  if (subtotal < discount.minSubtotal) {
    throw new Error(
      `Add ${discount.minSubtotal - subtotal} more to use this code.`
    );
  }

  const discountAmount =
    discount.type === "PERCENT"
      ? Math.min(subtotal, Math.round((subtotal * discount.value) / 100))
      : Math.min(subtotal, discount.value);

  return {
    discountAmount,
    discountCode: discount.code,
    label: discount.description,
  };
}

export async function resolveShipping(subtotalAfterDiscount: number) {
  const settings = isDemoMode()
    ? demoSettings
    : (await prisma.settings.findUnique({ where: { id: "default" } })) || {
        shippingFlatFee: 250,
        freeShippingOver: 5000,
      };

  if (subtotalAfterDiscount >= (settings.freeShippingOver || 5000)) {
    return 0;
  }
  return settings.shippingFlatFee ?? 250;
}

export async function incrementDiscountUse(
  code: string | null,
  email?: string | null
) {
  if (!code) return;
  if (isDemoMode()) {
    const d = findDemoDiscount(code);
    if (d) {
      d.usedCount += 1;
      d.updatedAt = new Date();
      if (d.usageType === "ONE_TIME_EMAIL" && email) {
        getDemoRedemptions().push({ code: d.code, email: email.toLowerCase() });
      }
    }
    return;
  }
  await prisma.discountCode.update({
    where: { code },
    data: { usedCount: { increment: 1 } },
  });
  if (email) {
    const discount = await prisma.discountCode.findUnique({ where: { code } });
    if (discount?.usageType === "ONE_TIME_EMAIL") {
      await prisma.discountRedemption.create({
        data: { code, email: email.toLowerCase() },
      });
    }
  }
}

export async function getIntroOfferBanner() {
  if (isDemoMode()) {
    const offer = getDemoDiscounts().find((d) => d.active && d.isIntroOffer);
    return offer;
  }
  return prisma.discountCode.findFirst({
    where: { active: true, isIntroOffer: true },
    orderBy: { createdAt: "desc" },
  });
}
