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

1. Property: **Domain** `zayune.com` (covers apex + www).
2. **Sitemaps** → only `https://zayune.com/sitemap.xml`.
3. After each deploy: URL Inspection → **Request indexing** for `/`, `/shop`, each `/shop/...` collection, and each `/product/...` URL in the sitemap.
4. In **Pages** report, click **Validate fix** after redirects/noindex changes ship.

### How to read GSC “issues” (not all are failures)

| Report | Meaning | Action |
|---|---|---|
| **Blocked by robots.txt** | Private routes (`/admin`, `/api`, `/account`, `/order`) | Expected — leave blocked |
| **Excluded by noindex** | Cart, wishlist, track, checkout, journal | Expected — should not rank |
| **Page with redirect** | Old category/product URLs permanently redirected | Expected after taxonomy change; validate fix |
| **Not found (404)** | Dead URLs without redirect | We 301 legacy paths; validate fix |
| **Discovered – not indexed** | Google knows the URL but hasn’t chosen to index yet | Normal for new/low-authority sites; request indexing + earn links |
| **Crawled – not indexed** | Crawled, quality/selection skipped | Improve content uniqueness; wait; don’t spam resubmit |

### Fix crawling / “not indexed” faster

- Sitemap always returns **200**; Live lists only categories with published products + all published products.
- Legacy `/shop/crochet-flowers`, `/shop/keychains`, and first-seed product slugs **301** to live collections.
- Utility pages use **noindex** (not robots-block) so Google can process the exclusion cleanly.
- HTML sitemap: `https://zayune.com/site-map`.
- **Critical ops:** Vercel Domains — apex `zayune.com` primary; `www` must have a **valid SSL** and redirect to apex. Broken www TLS causes crawl/host confusion.

## What we index

**Live:** `/`, `/shop`, live collections, published products, `/custom`, `/about`, `/contact`, shipping/returns, privacy, cookies, `/site-map`.

**noindex (not in sitemap):** `/checkout`, `/cart`, `/wishlist`, `/track`, `/journal`.  
**robots disallow:** `/admin`, `/api`, `/account`, `/order`.

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

## Product snippets vs Merchant listings

These are **two related but different** Google surfaces:

| Surface | What it is | How ZAYUNE qualifies |
|---|---|---|
| **Product snippets** | Rich result in Search (price, availability, sometimes shipping) | Product JSON-LD on each `/product/...` page |
| **Merchant listings** | Shopping-style free listings (price, store name, more commerce UI) | Same Product + `Offer` markup **and** Google Merchant Center / Seller profile eligibility |

### Already in code (product pages)

- `Product` + nested `Offer` (required for merchant listings — not AggregateOffer)
- `name`, `image` (all gallery URLs, absolute), `description`, `brand`, `sku` / `mpn`, `category`
- `offers.price`, `priceCurrency` (PKR), `availability`, `priceValidUntil`, `validFrom`
- `shippingDetails` + `hasMerchantReturnPolicy` (also on Organization)
- BreadcrumbList

### Still needed for full Merchant listings

1. **Google Merchant Center** account linked to `zayune.com` (and Business Profile / payments verification as Google asks for your country).
2. Products must be **indexable** (in sitemap, Live store, request indexing).
3. Images must be crawlable (ours are on `/products/winter/...` and Unsplash).
4. **Real reviews** for star ratings (`aggregateRating` / `review`) — optional for eligibility, recommended for appearance. Never invent them.
5. Pakistan free listings availability depends on Google’s current country support — confirm in Merchant Center for PK.

### GSC “Improve item appearance” warnings

- Missing `shippingDetails` / `hasMerchantReturnPolicy` / `validFrom` → **fixed in code**.
- Missing `aggregateRating` / `review` → expected until real reviews exist.

## Ongoing

- Keep product meta title/description filled before going Live.
- Ship real journal posts before re-adding `/journal` to the footer or sitemap.
- Prefer a ~1200×630 brand share image later (replace default `/logo.png` in OG).
- Monitor Pages in GSC for soft 404s; resubmit the sitemap after switching from Coming soon → Live.
