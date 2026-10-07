# ZAYUNE

Designer-led handmade fashion & accessories storefront.

**Designed, not just made.**

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS with brand tokens
- Prisma + PostgreSQL
- Auth.js (admin only)
- Zustand cart (localStorage)
- Resend (transactional email)
- Payment provider interface (COD, bank/Raast, swappable gateway)

## Quick start (demo catalog)

```bash
npm install
npm run dev
```

With no `DATABASE_URL`, the app serves a built-in demo catalog so you can review brand layouts immediately.

## Connect PostgreSQL

1. Copy `.env.example` → `.env` and set `DATABASE_URL` (Neon or Supabase).
2. Run:

```bash
npx prisma db push
npm run db:seed
npm run dev
```

## Admin

- URL: `/admin/login`
- Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env` (and on Vercel for production).
- Never commit real credentials.

## Brand assets

Replace `public/logo.svg` and `public/monogram.svg` with the approved logo lockup and monogram. Do not recolor or regenerate the wordmark.

## Project structure

```
src/app          # routes
src/components   # UI, layout, product, admin
src/lib          # prisma, cart, payments, auth, email
prisma           # schema + seed
public           # logo / favicon
```

## Payment methods

- **COD** and **bank/Raast transfer** are wired for launch.
- Card/wallet gateway sits behind `src/lib/payments/providers.ts` — set `PAYMENT_GATEWAY_PROVIDER` and implement provider-specific initiate + webhook verify. Webhook: `POST /api/payments/webhook`.

## Domain & email (production)

Attach your domain on Vercel, set `NEXTAUTH_URL`, studio email env vars, and verify the domain in Resend. Full checklist: [`docs/DOMAIN.md`](docs/DOMAIN.md).
