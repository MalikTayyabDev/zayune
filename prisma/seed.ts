import { PrismaClient, FulfillmentType } from "@prisma/client";

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
        "Handmade in Pakistan · Custom orders welcome · Nationwide shipping",
      bankName: "[Bank name — to be supplied]",
      bankAccountTitle: "ZAYUNE",
      bankAccountNumber: "[Account number — to be supplied]",
      bankIban: "[IBAN / Raast ID — to be supplied]",
    },
  });

  const jewelry = await prisma.category.create({
    data: {
      name: "Jewelry",
      slug: "jewelry",
      description:
        "Handmade jewelry with quiet presence — pieces meant to be worn close and often.",
      sortOrder: 1,
    },
  });

  const flowers = await prisma.category.create({
    data: {
      name: "Crochet Flowers",
      slug: "crochet-flowers",
      description:
        "Crochet flowers and floral forms — soft structure, lasting bloom, made by hand in Pakistan.",
      sortOrder: 2,
    },
  });

  const keychains = await prisma.category.create({
    data: {
      name: "Keychains",
      slug: "keychains",
      description:
        "Small keepsakes with character — keychains and charms for everyday carry.",
      sortOrder: 3,
    },
  });

  const custom = await prisma.category.create({
    data: {
      name: "Custom Orders",
      slug: "custom-orders",
      description:
        "Made for you — custom colorways, names, and one-of-a-kind requests.",
      sortOrder: 4,
    },
  });

  const products = [
    {
      name: "Lumen Pendant",
      slug: "lumen-pendant",
      oneLiner: "A quiet point of light against the collarbone.",
      story:
        "Sketched for evenings that ask for one deliberate detail. The Lumen pendant holds a soft geometry — enough to catch light, never enough to shout.",
      materials: "[materials — to be supplied]",
      handmadeProof:
        "Each piece is formed by hand in the studio. [process detail — to be supplied]",
      stylingNote: "Wear alone on a fine chain, or layered with a shorter collar piece.",
      price: 4500,
      fulfillment: FulfillmentType.MADE_TO_ORDER,
      leadTimeDays: 7,
      featured: true,
      categoryId: jewelry.id,
      seoTitle: "Lumen Pendant | Handmade Jewelry by ZAYUNE Pakistan",
      seoDescription:
        "Shop the Lumen Pendant — handmade jewelry from ZAYUNE. Designer-led, made to order in Pakistan.",
      tags: ["jewelry", "pendant", "handmade", "pakistan"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1200&q=80&auto=format&fit=crop",
          alt: "Handmade pendant jewelry by ZAYUNE",
          kind: "hero",
        },
        {
          url: "https://images.unsplash.com/photo-1573408301185-91496af5d5b9?w=1200&q=80&auto=format&fit=crop",
          alt: "ZAYUNE pendant detail in soft light",
          kind: "detail",
        },
      ],
      variants: [
        { name: "Gold tone", optionGroup: "Color", swatchHex: "#B79B63" },
        { name: "Silver tone", optionGroup: "Color", swatchHex: "#C5C0B8" },
        { name: "Copper", optionGroup: "Color", swatchHex: "#B85F45" },
      ],
    },
    {
      name: "Eternal Bloom Crochet Flower",
      slug: "eternal-bloom-crochet-flower",
      oneLiner: "A lasting bloom — crocheted, not cut.",
      story:
        "Inspired by the flowers we keep returning to. Each bloom is crocheted by hand — soft petals, considered color, made to outlast a season.",
      materials: "[materials — to be supplied]",
      handmadeProof:
        "Hooked petal by petal from a studio pattern. [process detail — to be supplied]",
      stylingNote: "Pin to a bag, weave into hair, or gift as a keepsake bloom.",
      price: 1800,
      fulfillment: FulfillmentType.MADE_TO_ORDER,
      leadTimeDays: 5,
      featured: true,
      categoryId: flowers.id,
      seoTitle: "Eternal Bloom Crochet Flower | Handmade by ZAYUNE",
      seoDescription:
        "Handmade crochet flowers from ZAYUNE Pakistan. Soft, lasting blooms — custom colors available.",
      tags: ["crochet", "flowers", "handmade", "pakistan"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1708000077538-c7dfba8037d6?w=1200&q=80&auto=format&fit=crop",
          alt: "Handmade crochet flower by ZAYUNE",
          kind: "hero",
        },
        {
          url: "https://images.unsplash.com/photo-1753366556699-4be495e5bdd6?w=1200&q=80&auto=format&fit=crop",
          alt: "Crochet flower texture detail",
          kind: "detail",
        },
      ],
      variants: [
        { name: "Porcelain", optionGroup: "Color", swatchHex: "#F4EEE6" },
        { name: "Blush", optionGroup: "Color", swatchHex: "#D4A59A" },
        { name: "Sage", optionGroup: "Color", swatchHex: "#7F8B78" },
        { name: "Copper", optionGroup: "Color", swatchHex: "#B85F45" },
      ],
    },
    {
      name: "Charm Keychain",
      slug: "charm-keychain",
      oneLiner: "A small mark for the keys you carry every day.",
      story:
        "Designed as a tiny companion — handmade charm, solid finish, meant for bags and keys without feeling loud.",
      materials: "[materials — to be supplied]",
      handmadeProof: "Formed and finished by hand. [process detail — to be supplied]",
      stylingNote: "Clip to a tote zipper or house keys.",
      price: 1200,
      fulfillment: FulfillmentType.IN_STOCK,
      stock: 0,
      featured: true,
      categoryId: keychains.id,
      seoTitle: "Charm Keychain | Handmade Accessories by ZAYUNE",
      seoDescription:
        "Shop handmade keychains from ZAYUNE Pakistan. Join the waitlist when sold out.",
      tags: ["keychain", "accessories", "handmade"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1700161093261-e059af3897c7?w=1200&q=80&auto=format&fit=crop",
          alt: "Handmade crochet keychain by ZAYUNE",
          kind: "hero",
        },
      ],
      variants: [
        { name: "Aubergine", optionGroup: "Color", swatchHex: "#2A1F2D", stock: 0 },
        { name: "Copper", optionGroup: "Color", swatchHex: "#B85F45", stock: 0 },
        { name: "Brass", optionGroup: "Color", swatchHex: "#B79B63", stock: 0 },
      ],
    },
    {
      name: "Custom Colorway Request",
      slug: "custom-colorway-request",
      oneLiner: "Your palette. Our hand.",
      story:
        "For custom orders — choose a piece type and share your color story. We design and make it with the same care as our studio edit.",
      materials: "[materials — to be confirmed per order]",
      handmadeProof:
        "Custom pieces follow the same sketch → material → make path. [details — to be supplied]",
      stylingNote: "Start the conversation on WhatsApp or in checkout notes.",
      price: 2500,
      fulfillment: FulfillmentType.MADE_TO_ORDER,
      leadTimeDays: 14,
      featured: false,
      categoryId: custom.id,
      seoTitle: "Custom Orders | Handmade by ZAYUNE Pakistan",
      seoDescription:
        "Request a custom handmade piece from ZAYUNE — jewelry, crochet flowers, keychains, and colorways made for you.",
      tags: ["custom", "made-to-order", "pakistan"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1716400128984-3681f2005d22?w=1200&q=80&auto=format&fit=crop",
          alt: "Custom handmade crochet order by ZAYUNE",
          kind: "hero",
        },
      ],
      variants: [
        { name: "Flower", optionGroup: "Piece type", swatchHex: "#D4A59A" },
        { name: "Jewelry", optionGroup: "Piece type", swatchHex: "#B79B63" },
        { name: "Keychain", optionGroup: "Piece type", swatchHex: "#7F8B78" },
      ],
    },
  ];

  for (const product of products) {
    const { images, variants, ...data } = product;
    await prisma.product.create({
      data: {
        ...data,
        images: {
          create: images.map((image, index) => ({
            ...image,
            sortOrder: index,
          })),
        },
        variants: {
          create: variants.map((variant) => ({
            name: variant.name,
            optionGroup: variant.optionGroup,
            swatchHex: variant.swatchHex,
            stock: "stock" in variant ? variant.stock : null,
            priceDelta: 0,
          })),
        },
      },
    });
  }
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
