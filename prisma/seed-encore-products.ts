/**
 * Append-only seed: Encore Edit (16 crochet SKUs).
 * Usage: npm run db:seed-encore
 */
import { PrismaClient } from "@prisma/client";
import { seedEncoreCatalog } from "../src/lib/seed-encore-catalog";

function dbUrl() {
  const base = process.env.DATABASE_URL || "";
  if (!base) return base;
  const sep = base.includes("?") ? "&" : "?";
  if (/connection_limit=/i.test(base)) return base;
  return `${base}${sep}connection_limit=1&pool_timeout=60`;
}

const prisma = new PrismaClient({
  datasources: { db: { url: dbUrl() } },
});

async function main() {
  const result = await seedEncoreCatalog(prisma);
  console.log("Encore Edit seeded (append-only):", result);
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
