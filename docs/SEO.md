# SEO & Google Search Console

## Why the sitemap failed before

Common causes on this project:

1. **`robots.txt` pointed at `*.vercel.app`** instead of the production domain — Search Console property and sitemap host must match.
2. **`/sitemap.xml` returned HTTP 500** when catalog data failed — Google then reports “Couldn’t fetch”.
3. **Private URLs in the sitemap** (`/account/*`, `/wishlist`) while also disallowed in robots — creates GSC warnings.

The app now forces the public canonical host (never `vercel.app` / localhost) for sitemap, robots, and metadata.

## Vercel env (required for SEO)

Set **Production**:

| Variable | Example |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://zayune.com` |
| `NEXTAUTH_URL` | `https://zayune.com` |

Then **Redeploy**. Preview deployments may still use `*.vercel.app`; that is fine — public SEO URLs stay on the custom domain.

## Check before submitting

Open these in a browser (expect **200**, not 500):

- `https://zayune.com/robots.txt` — `Sitemap:` and `Host:` should use `zayune.com`
- `https://zayune.com/sitemap.xml` — valid XML list of public pages

## Submit in Google Search Console

1. Add property **Domain** `zayune.com` (or URL-prefix `https://zayune.com`) and verify DNS/ownership.
2. **Sitemaps** → submit exactly: `https://zayune.com/sitemap.xml`
3. If GSC still shows a cached error, wait a few hours or resubmit after redeploy (sometimes appending `?v=2` once helps force a re-fetch; prefer the clean URL long-term).
4. Use **URL Inspection** on the homepage and one product URL → Request indexing.

## What we index

Included: home, shop, categories, products, custom, about, contact, journal, shipping/returns, privacy, cookies.

Excluded (robots): `/admin`, `/api`, `/checkout`, `/cart`, `/account`, `/order`.

## Ongoing

- Keep product `seoTitle` / `seoDescription` filled in admin when possible.
- After big catalog changes, wait for sitemap revalidate (~1 hour) or redeploy.
- Monitor Coverage / Pages in GSC for soft 404s or redirect issues between `www` and apex — pick one canonical and redirect the other in Vercel Domains.
