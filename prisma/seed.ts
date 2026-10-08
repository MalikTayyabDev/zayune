import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.waitlistEntry.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.settings.deleteMany();

  await prisma.settings.create({
    data: {
      id: "default",
      shippingFlatFee: 250,
      freeShippingOver: 5000,
      bannerText:
        "Products coming soon · Custom orders open · Handmade in Pakistan",
      bankName: "[Bank name — to be supplied]",
      bankAccountTitle: "ZAYUNE",
      bankAccountNumber: "[Account number — to be supplied]",
      bankIban: "[IBAN / Raast ID — to be supplied]",
    },
  });

  await prisma.category.createMany({
    data: [
      {
        name: "Jewelry",
        slug: "jewelry",
        description:
          "Handmade jewelry with quiet presence — pieces meant to be worn close and often.",
        sortOrder: 1,
      },
      {
        name: "Crochet Flowers",
        slug: "crochet-flowers",
        description:
          "Crochet flowers and floral forms — soft structure, lasting bloom, made by hand in Pakistan.",
        sortOrder: 2,
      },
      {
        name: "Keychains",
        slug: "keychains",
        description:
          "Small keepsakes with character — keychains and charms for everyday carry.",
        sortOrder: 3,
      },
      {
        name: "Custom Orders",
        slug: "custom-orders",
        description:
          "Made for you — custom colorways, names, and one-of-a-kind requests.",
        sortOrder: 4,
      },
    ],
  });

  console.log("Seed complete: categories + settings only (no placeholder products).");
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
