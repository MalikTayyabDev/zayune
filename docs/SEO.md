# SEO & Google Search Console

## Canonical host (critical)

Always use **`https://zayune.com`** (HTTPS + apex, no `www`, no `http`).

- Env: `NEXT_PUBLIC_SITE_URL=https://zayune.com` and `NEXTAUTH_URL=https://zayune.com`
- `www.zayune.com` → 301 to `https://zayune.com` (`vercel.json` + `next.config.mjs`)
- Public SEO URLs never use `*.vercel.app` or `http://`

GSC previously showed separate impressions for `http://zayune.com/` and `https://zayune.com/` — that split must stay fixed.

## On-page SEO (code)

- `pageMetadata()` for title, description, self-canonical, keywords, OG/Twitter
- Root `canonical: "./"` + absolute canonicals on key pages
- One `<h1>` per page; copper star on eyebrows
- Schema: Organization/OnlineStore, LocalBusiness (Rawalpindi), WebSite, Product, BreadcrumbList, FAQ, CollectionPage
- HTML sitemap for crawlers: `/site-map`
- XML sitemaps: `/sitemap.xml` and `/sitemap/sitemap.xml`

## What we index

Included: home, shop, categories, products, custom, about, contact, shipping/returns, privacy, cookies, site-map.

Excluded / noindex: `/admin`, `/api`, `/checkout`, `/cart`, `/account`, `/order`, `/wishlist`, `/track`, `/journal`.

## Catalog & store mode

Admin → **Settings → Store status**:

- **Coming soon** — catalog hidden; custom/WhatsApp open
- **Live** — show products

Thin “coming soon” pages are harder to index — go **Live** once real products exist, then request indexing.

## GSC checklist after each deploy

1. Sitemaps → confirm `https://zayune.com/sitemap/sitemap.xml` is **Success**
2. URL Inspection → request indexing for:
   - `https://zayune.com/`
   - `https://zayune.com/shop`
   - `https://zayune.com/custom`
   - `https://zayune.com/about`
   - `https://zayune.com/contact`
   - top category/product URLs when live
3. Page indexing → open **404** and **Redirect** reasons; fix or 301 stray URLs
4. Leave robots/noindex private paths alone (expected “not indexed”)

## Ranking reality

Technical SEO is necessary but not enough. Ranking “on top” needs:

- Real product catalog + unique copy (titles, stories, materials)
- Consistent Google Business Profile (Satellite Town, Rawalpindi) matching NAP on site
- Reviews, Instagram/WhatsApp engagement, and backlinks over time
- Pakistan-focused keywords already in `siteConfig.focusKeywords`

## Ongoing

- Fill product `seoTitle` / `seoDescription` in admin
- Ship journal posts before indexing `/journal`
- Add a ~1200×630 OG image (replace logo-only shares)
- Monitor Coverage weekly until indexed count rises past the early 5/22 split
