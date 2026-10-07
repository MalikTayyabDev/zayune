# Domain & email setup (zayune.com)

Production site: **https://zayune.com**  
Studio inbox: **store@zayune.com**

## 1. Vercel — attach the domain

1. Open the project on [Vercel](https://vercel.com) → **Settings → Domains**.
2. Add `zayune.com` and `www.zayune.com`.
3. At your registrar, point DNS as Vercel shows (usually):
   - `A` `@` → `76.76.21.21`
   - `CNAME` `www` → `cname.vercel-dns.com`
4. Wait until both domains show **Valid**. Prefer redirecting `www` → apex (or the reverse — pick one canonical).

## 2. Vercel — environment variables

Set these for **Production** (and Preview if you send real mail from previews):

| Variable | Value |
|---|---|
| `NEXTAUTH_URL` | `https://zayune.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://zayune.com` |
| `NEXT_PUBLIC_STUDIO_EMAIL` | `store@zayune.com` |
| `RESEND_FROM_EMAIL` | `store@zayune.com` |
| `ORDER_NOTIFY_EMAILS` | `store@zayune.com` |

Keep `DATABASE_URL`, `NEXTAUTH_SECRET`, `RESEND_API_KEY`, bank fields, and WhatsApp number as already configured.

Redeploy after saving env vars so `NEXTAUTH_URL` and public URL take effect (order pay links, emails, Auth.js callbacks).

## 3. Hostinger inbox + Resend sending (recommended)

**Split of roles**

| Role | Provider |
|---|---|
| Receive / reply in webmail | **Hostinger** (`store@zayune.com`) |
| Site auto-sends (orders, status, alerts) | **Resend**, From `store@zayune.com` |

Platform alerts use `ORDER_NOTIFY_EMAILS=store@zayune.com` → they land in Hostinger webmail.

### Hostinger (receiving) — leave MX alone

1. In Hostinger → **Emails** → confirm `store@zayune.com` exists and webmail works.
2. Do **not** remove Hostinger **MX** records. Those control receiving.
3. Website / Vercel DNS (`A` / `CNAME` for the site) can live on the same domain; MX stays on Hostinger.

### Resend (sending)

1. Sign up at [resend.com](https://resend.com) → **API Keys** → create a key → set `RESEND_API_KEY` on Vercel (and local `.env`).
2. **Domains** → add `zayune.com`.
3. In Hostinger **DNS** (or wherever `zayune.com` DNS is managed), add **only** the records Resend shows:
   - DKIM `TXT` / `CNAME` (usually several)
   - SPF: if you already have an SPF `TXT` for Hostinger, **merge** into one record, e.g.  
     `v=spf1 include:_spf.mail.hostinger.com include:amazonses.com ~all`  
     (use the exact `include:` Resend shows — often AWS SES). Do not create two SPF records.
   - Optional DMARC `TXT` on `_dmarc`
4. Wait until Resend shows the domain **Verified**.
5. Confirm Vercel has `RESEND_FROM_EMAIL=store@zayune.com`.
6. Place a test order: customer mail From `store@zayune.com`; team copy arrives in Hostinger inbox.

Until the domain is verified, Resend will reject sends from `@zayune.com`.

## 5. Quick checks after go-live

- [ ] `https://zayune.com` loads the store
- [ ] `https://zayune.com/api/health/db` → `ok` / `demoMode: false`
- [ ] Checkout confirmation email From `store@zayune.com`
- [ ] Pay / advance link host is `zayune.com` (not `*.vercel.app`)
- [ ] Contact page shows `store@zayune.com`
