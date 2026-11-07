/**
 * Append-only seed: Atelier Edit (Butterfly Sweater + 9).
 * Does NOT wipe Winter / Dawat catalogs.
 * Usage: npm run db:seed-atelier
 */
import { PrismaClient } from "@prisma/client";
import { seedAtelierCatalog } from "../src/lib/seed-atelier-catalog";

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
  const result = await seedAtelierCatalog(prisma);
  console.log("Atelier Edit seeded (append-only):", result);
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
