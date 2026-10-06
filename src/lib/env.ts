/**
 * Neon / Vercel often inject POSTGRES_* instead of DATABASE_URL.
 * The Neon marketplace integration may also prefix them, e.g.
 * zayune_web_POSTGRES_PRISMA_URL — pick those up too.
 */
function pickUrl(...candidates: Array<string | undefined>): string | undefined {
  return candidates.map((v) => v?.trim()).find(Boolean);
}

function findPrefixedNeonUrl(): string | undefined {
  const preferredSuffixes = [
    "POSTGRES_PRISMA_URL",
    "DATABASE_URL",
    "POSTGRES_URL",
    "DATABASE_URL_UNPOOLED",
    "POSTGRES_URL_NON_POOLING",
  ];

  for (const suffix of preferredSuffixes) {
    const exact = process.env[suffix]?.trim();
    if (exact) return exact;

    for (const [key, value] of Object.entries(process.env)) {
      if (!value?.trim()) continue;
      if (key === suffix || key.endsWith(`_${suffix}`)) {
        return value.trim();
      }
    }
  }

  return undefined;
}

export function ensureDatabaseUrl(): string | undefined {
  const found =
    pickUrl(
      process.env.DATABASE_URL,
      process.env.POSTGRES_PRISMA_URL,
      process.env.POSTGRES_URL,
      process.env.DATABASE_URL_UNPOOLED,
      process.env.POSTGRES_URL_NON_POOLING
    ) || findPrefixedNeonUrl();

  if (found) {
    process.env.DATABASE_URL = found;
    return found;
  }

  return undefined;
}

export function hasDatabase(): boolean {
  return Boolean(ensureDatabaseUrl());
}

/** True on Vercel / similar — in-memory stores do not survive across requests. */
export function isServerlessRuntime(): boolean {
  return (
    process.env.VERCEL === "1" ||
    process.env.AWS_LAMBDA_FUNCTION_NAME != null ||
    process.env.NETLIFY === "true"
  );
}
