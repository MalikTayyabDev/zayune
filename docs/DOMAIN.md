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

## 3. Resend — send from store@zayune.com

1. In [Resend](https://resend.com) → **Domains** → add `zayune.com`.
2. Add the DNS records Resend gives you (SPF, DKIM, and optional DMARC) at your registrar.
3. Wait until the domain is **Verified**.
4. Confirm `RESEND_FROM_EMAIL=store@zayune.com` (or `ZAYUNE <store@zayune.com>`) on Vercel.
5. Place a test order and confirm the confirmation email arrives From `store@zayune.com`.

Until the domain is verified, Resend will reject sends from `@zayune.com` addresses.

## 4. Receiving mail at store@zayune.com

DNS/MX for *receiving* mail is separate from Resend (sending). Point MX to whatever hosts `store@zayune.com` (Google Workspace, Zoho, your registrar mailbox, etc.). Order notifications go to `ORDER_NOTIFY_EMAILS` / `NEXT_PUBLIC_STUDIO_EMAIL`.

## 5. Quick checks after go-live

- [ ] `https://zayune.com` loads the store
- [ ] `https://zayune.com/api/health/db` → `ok` / `demoMode: false`
- [ ] Checkout confirmation email From `store@zayune.com`
- [ ] Pay / advance link host is `zayune.com` (not `*.vercel.app`)
- [ ] Contact page shows `store@zayune.com`
