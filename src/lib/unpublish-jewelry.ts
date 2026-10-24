import type { PrismaClient } from "@prisma/client";
import { JEWELRY_PRODUCT_SLUGS } from "@/lib/jewelry-slugs";

/** Unpublish jewelry products and strip jewelry children from crochet bundles. */
export async function unpublishJewelryProducts(prisma: PrismaClient) {
  const result = await prisma.product.updateMany({
    where: { slug: { in: [...JEWELRY_PRODUCT_SLUGS] } },
    data: { published: false, featured: false },
  });

  // Mehndi Glow: crochet only (gajra + clips) — drop jhumkas from bundle links.
  const glow = await prisma.product.findUnique({
    where: { slug: "mehndi-glow-set" },
  });
  if (glow) {
    const keep = await prisma.product.findMany({
      where: {
        slug: {
          in: ["crochet-gajra-mehndi", "crochet-flower-hair-clips-set-mehndi"],
        },
      },
      select: { id: true },
    });
    await prisma.product.update({
      where: { id: glow.id },
      data: {
        published: true,
        isBundle: true,
        bundleProductIds: keep.map((p) => p.id),
        oneLiner:
          "Crochet gajra pair + flower clips set — matching mehndi colour story.",
        story:
          "Curated mehndi crochet bundle: a handmade gajra pair and set of three flower clips in one colour story — crochet accessories only.",
        price: Math.round(2399 * 0.95),
        compareAtPrice: 2399,
        seoTitle: "Mehndi Glow Crochet Set | Gajra & Clips | ZAYUNE",
        seoDescription:
          "Mehndi Glow crochet set: handmade gajra pair and flower hair clips. Pure crochet accessories by ZAYUNE Pakistan.",
      },
    });
  }

  // Hide empty jewelry category from shop if nothing published remains.
  const jewelryPublished = await prisma.product.count({
    where: { category: { slug: "jewelry" }, published: true },
  });
  if (jewelryPublished === 0) {
    // Leave category; products unpublished so shop/jewelry shows empty / soft.
  }

  const engagementPublished = await prisma.product.count({
    where: { category: { slug: "engagement" }, published: true },
  });

  return {
    unpublished: result.count,
    mehndiGlowUpdated: Boolean(glow),
    engagementStillPublished: engagementPublished,
  };
}
