/**
 * Neon / Vercel often inject POSTGRES_* instead of DATABASE_URL.
 * Normalize so Prisma and isDemoMode see one source of truth.
 */
export function ensureDatabaseUrl(): string | undefined {
  if (process.env.DATABASE_URL?.trim()) {
    return process.env.DATABASE_URL.trim();
  }

  const alt = [
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL,
    process.env.DATABASE_URL_UNPOOLED,
    process.env.POSTGRES_URL_NON_POOLING,
  ]
    .map((v) => v?.trim())
    .find(Boolean);

  if (alt) {
    process.env.DATABASE_URL = alt;
    return alt;
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
