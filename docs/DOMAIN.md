# Domain & email setup

Use your production domain and studio inbox addresses via environment variables — do not commit real credentials or private account details to the repo.

## 1. Vercel — attach the domain

1. Open the project on [Vercel](https://vercel.com) → **Settings → Domains**.
2. Add your apex domain and `www` subdomain.
3. At your registrar, point DNS as Vercel shows (typically an `A` record for `@` and a `CNAME` for `www`).
4. Wait until both domains show **Valid**. Prefer one canonical host (`www` → apex, or the reverse).

## 2. Vercel — environment variables

Set these for **Production** (and Preview if you send real mail from previews):

| Variable | Notes |
|---|---|
| `NEXTAUTH_URL` | Full site origin, e.g. `https://your-domain.com` |
| `NEXT_PUBLIC_SITE_URL` | Same public origin (no trailing slash) |
| `NEXT_PUBLIC_STUDIO_EMAIL` | Public studio contact address |
| `RESEND_FROM_EMAIL` | Address used as From for transactional mail |
| `ORDER_NOTIFY_EMAILS` | Inbox(es) for new-order / support alerts (comma-separated) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Studio admin login — keep private |
| `RESEND_API_KEY` | From Resend dashboard |
| `DATABASE_URL` / `NEXTAUTH_SECRET` | Already required for orders and auth |

Also keep bank fields and WhatsApp number configured as needed.

Redeploy after saving env vars so URLs and Auth.js callbacks take effect.

## 3. Inbox provider + Resend sending

**Split of roles**

| Role | Provider |
|---|---|
| Receive / reply in webmail | Your mailbox host (MX records) |
| Site auto-sends (orders, status, alerts) | **Resend**, From your studio address |

Platform alerts go to whatever you set in `ORDER_NOTIFY_EMAILS`.

### Receiving — leave MX alone

1. Confirm the studio mailbox exists and webmail works at your email host.
2. Do **not** remove **MX** records when adding Resend DNS. MX controls receiving.
3. Website DNS (`A` / `CNAME` for the site) can live on the same domain; MX stays on the mail host.

### Resend (sending)

1. Sign up at [resend.com](https://resend.com) → **API Keys** → create a key → set `RESEND_API_KEY` on Vercel (and local `.env`).
2. **Domains** → add your domain.
3. In your DNS panel, add **only** the records Resend shows (DKIM, and SPF — merge into a single SPF TXT if one already exists). Optional DMARC on `_dmarc`.
4. Wait until Resend shows the domain **Verified**.
5. Confirm `RESEND_FROM_EMAIL` matches a verified address on that domain.
6. Place a test order and confirm customer + studio copies arrive.

Until the domain is verified, Resend will reject sends from that domain’s addresses.

## 4. Quick checks after go-live

- [ ] Production domain loads the store
- [ ] `/api/health/db` → `ok` / `demoMode: false`
- [ ] Checkout confirmation email From your studio address
- [ ] Pay / advance links use the production host (not `*.vercel.app`)
- [ ] Contact page shows the studio email from env
