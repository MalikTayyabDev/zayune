/**
 * Append-only seed: Winter Dawat Edit categories, 15 products + 4 bundles.
 * Does NOT wipe Winter Special catalog.
 * Usage: npm run db:seed-dawat
 */
import { PrismaClient } from "@prisma/client";
import { seedDawatCatalog } from "../src/lib/seed-dawat-catalog";

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
  const result = await seedDawatCatalog(prisma);
  console.log("Winter Dawat Edit seeded (append-only):", result);
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
