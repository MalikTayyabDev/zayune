# SEO & Google Search Console

## Why the sitemap failed before

Common causes on this project:

1. **`robots.txt` pointed at `*.vercel.app`** instead of the production domain — Search Console property and sitemap host must match.
2. **`/sitemap.xml` returned HTTP 500** when catalog data failed — Google then reports “Couldn’t fetch”.
3. **Private URLs in the sitemap** while also disallowed in robots — creates GSC warnings.

The app forces the public canonical host (never `vercel.app` / localhost) for sitemap, robots, and metadata.

## Vercel env (required for SEO)

Set **Production**:

| Variable | Example |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://zayune.com` |
| `NEXTAUTH_URL` | `https://zayune.com` |

Then **Redeploy**. Preview deployments may still use `*.vercel.app`; that is fine — public SEO URLs stay on the custom domain.

## On-page SEO (code)

- Use `pageMetadata()` from `src/lib/seo.ts` for title, description, self-canonical, focus keywords, and OG/Twitter.
- Root layout uses `canonical: "./"` so every route auto-canonicalizes to itself; `pageMetadata()` still sets absolute URLs.
- One `<h1>` per page via `SectionHeading as="h1"` (or a bespoke h1 on product/custom/home).
- Product pages: fill `seoTitle` / `seoDescription` in admin when possible; leave `seoTitle` without a trailing brand (template adds ` · ZAYUNE`).
- Schema: Organization/OnlineStore + WebSite (root, with phone), Product + BreadcrumbList (PDP), FAQPage (custom), CollectionPage (shop when products exist).
- Studio WhatsApp / phone: `NEXT_PUBLIC_WHATSAPP_NUMBER=923055282964` (no `+` in env).

## Check before submitting

Open these in a browser (expect **200**, not 500):

- `https://zayune.com/robots.txt` — `Sitemap:` should use `zayune.com`
- `https://zayune.com/sitemap.xml` — valid XML list of public pages
- `https://zayune.com/sitemap/sitemap.xml` — same content (GSC cache bypass)

## Submit in Google Search Console

1. Add property **Domain** `zayune.com` (or URL-prefix `https://zayune.com`) and verify DNS/ownership.
2. **Sitemaps** → prefer: `https://zayune.com/sitemap/sitemap.xml`  
   (If `/sitemap.xml` still shows **Couldn't fetch**, that is often a cached failure — use the nested path.)
3. Use **URL Inspection** on the homepage and one product URL → Request indexing.

## What we index

Included: home, shop, categories, products, custom, about, contact, shipping/returns, privacy, cookies.

Excluded / noindex: `/admin`, `/api`, `/checkout`, `/cart`, `/account`, `/order`, `/wishlist`, `/track`, `/journal` (until editorial content ships).

## Catalog & store mode

Admin → **Settings → Store status**:

- **Coming soon** — shop & home show “Products coming soon” (custom/WhatsApp still open)
- **Live** — catalog visible to customers

Default after seed / clear is **Coming soon**. Placeholder products are not seeded.

Wipe leftover demo rows:

```bash
npx prisma db push
npm run db:clear-products
```

Also set Vercel Production: `NEXT_PUBLIC_WHATSAPP_NUMBER=923055282964`.

## Ongoing

- Keep product `seoTitle` / `seoDescription` filled in admin when possible.
- Ship real journal posts before re-indexing `/journal`.
- Prefer a ~1200×630 brand share image later (replace default `/logo.png` in OG).
- After big catalog changes, wait for sitemap revalidate (~1 hour) or redeploy.
- Monitor Pages in GSC for soft 404s or `www` vs apex — pick one canonical in Vercel Domains.
