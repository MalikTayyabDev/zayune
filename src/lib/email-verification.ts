import { createHash, randomInt } from "crypto";
import { isDemoMode } from "@/lib/demo-data";
import { prisma } from "@/lib/prisma";

export type PendingRegistration = {
  email: string;
  codeHash: string;
  name: string;
  phone: string | null;
  passwordHash: string;
  expiresAt: Date;
};

const globalForVerify = globalThis as unknown as {
  __zayuneVerify?: Map<string, PendingRegistration>;
};

function demoStore() {
  if (!globalForVerify.__zayuneVerify) {
    globalForVerify.__zayuneVerify = new Map();
  }
  return globalForVerify.__zayuneVerify;
}

function secret() {
  return process.env.NEXTAUTH_SECRET || "zayune-dev-verify";
}

export function hashVerificationCode(code: string, email: string) {
  return createHash("sha256")
    .update(`${code}:${email.toLowerCase()}:${secret()}`)
    .digest("hex");
}

export function generateVerificationCode() {
  return String(randomInt(100000, 999999));
}

export async function savePendingRegistration(input: {
  email: string;
  code: string;
  name: string;
  phone?: string | null;
  passwordHash: string;
  ttlMinutes?: number;
}) {
  const email = input.email.toLowerCase();
  const expiresAt = new Date(
    Date.now() + (input.ttlMinutes ?? 15) * 60 * 1000
  );
  const codeHash = hashVerificationCode(input.code, email);
  const row: PendingRegistration = {
    email,
    codeHash,
    name: input.name,
    phone: input.phone || null,
    passwordHash: input.passwordHash,
    expiresAt,
  };

  if (isDemoMode()) {
    demoStore().set(email, row);
    return row;
  }

  await prisma.emailVerification.upsert({
    where: { email },
    create: row,
    update: {
      codeHash: row.codeHash,
      name: row.name,
      phone: row.phone,
      passwordHash: row.passwordHash,
      expiresAt: row.expiresAt,
    },
  });
  return row;
}

export async function consumePendingRegistration(
  emailRaw: string,
  code: string
): Promise<PendingRegistration | null> {
  const email = emailRaw.toLowerCase();
  const codeHash = hashVerificationCode(code, email);

  if (isDemoMode()) {
    const row = demoStore().get(email);
    if (!row) return null;
    if (row.expiresAt.getTime() < Date.now()) {
      demoStore().delete(email);
      return null;
    }
    if (row.codeHash !== codeHash) return null;
    demoStore().delete(email);
    return row;
  }

  const row = await prisma.emailVerification.findUnique({ where: { email } });
  if (!row) return null;
  if (row.expiresAt.getTime() < Date.now()) {
    await prisma.emailVerification.delete({ where: { email } }).catch(() => {});
    return null;
  }
  if (row.codeHash !== codeHash) return null;
  await prisma.emailVerification.delete({ where: { email } }).catch(() => {});
  return row;
}
