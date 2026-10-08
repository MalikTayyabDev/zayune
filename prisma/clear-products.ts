/**
 * Removes all products (and related images/variants) from the database.
 * Keeps categories, settings, and orders structure.
 *
 * Usage: npx tsx prisma/clear-products.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const variants = await prisma.variant.deleteMany();
  const images = await prisma.productImage.deleteMany();
  const wishlist = await prisma.wishlistItem.deleteMany();
  const waitlist = await prisma.waitlistEntry.deleteMany();
  const products = await prisma.product.deleteMany();

  await prisma.settings.update({
    where: { id: "default" },
    data: {
      bannerText:
        "Products coming soon · Custom orders open · Handmade in Pakistan",
    },
  }).catch(() => null);

  console.log("Cleared catalog:", {
    products: products.count,
    images: images.count,
    variants: variants.count,
    wishlist: wishlist.count,
    waitlist: waitlist.count,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
