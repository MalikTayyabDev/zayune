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
2. **Sitemaps** → submit **only** `https://zayune.com/sitemap.xml` (robots.txt lists this single URL).
3. While **Coming soon**: URL Inspection → Request indexing for `/`, `/shop`, `/shop/crochet-flowers`, `/shop/jewelry`, `/shop/keychains`, `/custom`, `/about`, `/contact`. Do **not** request product URLs (they redirect to `/shop`).
4. When products are ready: Admin → fill **Meta title** / **Meta description** → Publish → **Settings → Live** → wait for sitemap refresh → Request indexing for each `/product/...` URL.

### Fix crawling / “not indexed” faster

- Sitemap always returns **200** with brand (+ category) URLs even if the database is slow.
- Category pages stay **200** during Coming soon with keyword copy (not redirects) so Google can index collection intent.
- HTML sitemap: `https://zayune.com/site-map` (linked in footer).
- Soft-404 risk: Coming soon boxes include real collection links + copy — do not strip that content.

## What we index

**Coming soon:** home, shop, custom, about, contact, shipping/returns, privacy, cookies.  
**Live:** same + published categories (`/shop/...`) and products (`/product/...`).

Excluded / noindex: `/admin`, `/api`, `/checkout`, `/cart`, `/account`, `/order`, `/wishlist`, `/track`, `/journal` (until editorial content ships). Footer account/wishlist/track links use `rel="nofollow"`.

## Catalog & store mode

Admin → **Settings → Store status**:

- **Coming soon** — shop & home show “Products coming soon”; sitemap lists **brand URLs only** (no `/product/*`, avoids “Page with redirect” in GSC)
- **Live** — catalog visible; sitemap auto-includes published products + categories

Saving products or switching store mode revalidates `/sitemap.xml` immediately.

Default after seed / clear is **Coming soon**. Placeholder products are not seeded.

Wipe leftover demo rows:

```bash
npx prisma db push
npm run db:clear-products
```

Also set Vercel Production: `NEXT_PUBLIC_WHATSAPP_NUMBER=923055282964`.

## Vercel domains (canonical host)

In Vercel → Domains for this project:

- Primary: **`https://zayune.com`** (apex)
- Add **`www.zayune.com`** and set redirect **www → apex** (must issue a valid SSL cert for www)
- Ensure **HTTP → HTTPS**

If `https://www.zayune.com` fails TLS / certificate trust, Google may keep reporting host / crawl issues — fix the www domain certificate in Vercel Domains (re-add domain or refresh SSL), then force redirect to apex.

GSC Domain property covers both hosts; still pick one public canonical.

## Product meta (admin)

When adding products:

1. Fill **Meta title** (~50–60 chars) and **Meta description** (~150–160 chars) in the “Search engine listing” panel.
2. If left empty, the storefront falls back to product name + one-liner / story snippet.
3. Publish the product, then set Settings to **Live** so URLs appear in the sitemap and Product JSON-LD is served.
4. In GSC, request indexing for each new product URL.

## Ongoing

- Keep product meta title/description filled before going Live.
- Ship real journal posts before re-adding `/journal` to the footer or sitemap.
- Prefer a ~1200×630 brand share image later (replace default `/logo.png` in OG).
- Monitor Pages in GSC for soft 404s; resubmit the sitemap after switching from Coming soon → Live.
