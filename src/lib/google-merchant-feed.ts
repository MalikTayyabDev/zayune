import { getProducts, getSettings } from "@/lib/products";
import { absoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

/** Best-fit Google Product Category IDs for Winter Special collections. */
const GPC_BY_CATEGORY: Record<string, string> = {
  "beanies-hats": "173", // Apparel & Accessories > Clothing Accessories > Hats
  "scarves-mufflers": "178", // Scarves & Shawls
  "gloves-warmers": "170", // Gloves & Mittens
  "ponchos-shrugs": "212", // Clothing > Outerwear
  "ear-warmers": "173",
  "boot-cuffs": "178",
  jewelry: "188", // Jewelry
  "hair-accessories": "171", // Hair Accessories
  "ornaments-gifts": "696", // Home & Garden > Decor > Seasonal & Holiday Decorations
  "bags-pouches": "3032", // Handbags, Wallets & Cases > Handbags
  "custom-orders": "166", // Apparel & Accessories
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function cdata(value: string) {
  return `<![CDATA[${value.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

function absoluteImage(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return absoluteUrl(url.startsWith("/") ? url : `/${url}`);
}

function formatPkr(amount: number) {
  return `${amount.toFixed(2)} PKR`;
}

function availabilityFor(product: {
  fulfillment: string;
  stock: number | null;
  variants: { stock: number | null }[];
}) {
  if (product.fulfillment === "MADE_TO_ORDER") return "preorder";
  if (product.stock != null) {
    return product.stock > 0 ? "in_stock" : "out_of_stock";
  }
  const variantStocks = product.variants
    .map((v) => v.stock)
    .filter((s): s is number => s != null);
  if (variantStocks.length === 0) return "in_stock";
  return variantStocks.some((s) => s > 0) ? "in_stock" : "out_of_stock";
}

type FeedProduct = Awaited<ReturnType<typeof getProducts>>[number];

function itemXml(args: {
  id: string;
  title: string;
  description: string;
  link: string;
  images: string[];
  price: number;
  compareAt: number | null;
  availability: string;
  brand: string;
  productType: string;
  gpc: string;
  itemGroupId?: string;
  color?: string;
  shippingFee: number;
  leadTimeDays?: number | null;
}) {
  const {
    id,
    title,
    description,
    link,
    images,
    price,
    compareAt,
    availability,
    brand,
    productType,
    gpc,
    itemGroupId,
    color,
    shippingFee,
    leadTimeDays,
  } = args;

  const listPrice =
    compareAt && compareAt > price ? compareAt : price;
  const salePrice =
    compareAt && compareAt > price ? price : null;

  const extraImages = images
    .slice(1, 10)
    .map(
      (src) =>
        `      <g:additional_image_link>${escapeXml(absoluteImage(src))}</g:additional_image_link>`
    )
    .join("\n");

  const preorderBits =
    availability === "preorder"
      ? `
      <g:availability_date>${new Date(
        Date.now() + 1000 * 60 * 60 * 24 * (leadTimeDays || 7)
      )
        .toISOString()
        .slice(0, 10)}</g:availability_date>`
      : "";

  return `    <item>
      <g:id>${escapeXml(id)}</g:id>
      <g:title>${cdata(title)}</g:title>
      <g:description>${cdata(description)}</g:description>
      <g:link>${escapeXml(link)}</g:link>
      <g:image_link>${escapeXml(absoluteImage(images[0] || `${siteConfig.url}/logo.png`))}</g:image_link>
${extraImages ? `${extraImages}\n` : ""}      <g:condition>new</g:condition>
      <g:availability>${availability}</g:availability>${preorderBits}
      <g:price>${formatPkr(listPrice)}</g:price>
${salePrice != null ? `      <g:sale_price>${formatPkr(salePrice)}</g:sale_price>\n` : ""}      <g:brand>${escapeXml(brand)}</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
${itemGroupId ? `      <g:item_group_id>${escapeXml(itemGroupId)}</g:item_group_id>\n` : ""}${
    color ? `      <g:color>${escapeXml(color)}</g:color>\n` : ""
  }      <g:product_type>${escapeXml(productType)}</g:product_type>
      <g:google_product_category>${escapeXml(gpc)}</g:google_product_category>
      <g:shipping>
        <g:country>PK</g:country>
        <g:service>Standard</g:service>
        <g:price>${formatPkr(shippingFee)}</g:price>
      </g:shipping>
    </item>`;
}

/** Build Google Merchant Center RSS 2.0 product feed XML. */
export async function buildGoogleMerchantFeedXml() {
  const [products, settings] = await Promise.all([
    getProducts(),
    getSettings(),
  ]);

  const shippingFee =
    "shippingFlatFee" in settings ? Number(settings.shippingFlatFee) : 250;
  const freeOver =
    "freeShippingOver" in settings ? Number(settings.freeShippingOver) : 5000;

  const items: string[] = [];

  for (const product of products as FeedProduct[]) {
    if (!product.published) continue;

    const images = product.images.map((img) => img.url).filter(Boolean);
    const link = absoluteUrl(`/product/${product.slug}`);
    const description =
      product.seoDescription ||
      product.oneLiner ||
      `${product.name} — handmade by ZAYUNE in Pakistan.`;
    const productType = `ZAYUNE > ${product.category.name}`;
    const gpc =
      GPC_BY_CATEGORY[product.category.slug] ||
      GPC_BY_CATEGORY["custom-orders"];
    const availability = availabilityFor(product);
    const ship =
      product.price >= freeOver ? 0 : shippingFee;
    const compareAt =
      "compareAtPrice" in product && product.compareAtPrice != null
        ? Number(product.compareAtPrice)
        : null;
    const groupId =
      ("sku" in product && product.sku ? String(product.sku) : null) ||
      product.slug;

    if (product.variants.length > 0) {
      for (const variant of product.variants) {
        const variantAvail =
          product.fulfillment === "MADE_TO_ORDER"
            ? "preorder"
            : variant.stock == null
              ? availability
              : variant.stock > 0
                ? "in_stock"
                : "out_of_stock";
        const price = product.price + (variant.priceDelta || 0);
        const id = variant.sku || `${groupId}-${variant.name}`.replace(/\s+/g, "-");

        items.push(
          itemXml({
            id,
            title: `${product.name} — ${variant.name}`,
            description,
            link,
            images,
            price,
            compareAt:
              compareAt != null ? compareAt + (variant.priceDelta || 0) : null,
            availability: variantAvail,
            brand: siteConfig.name,
            productType,
            gpc,
            itemGroupId: groupId,
            color: variant.name,
            shippingFee: price >= freeOver ? 0 : shippingFee,
            leadTimeDays: product.leadTimeDays,
          })
        );
      }
    } else {
      items.push(
        itemXml({
          id: groupId,
          title: product.name,
          description,
          link,
          images,
          price: product.price,
          compareAt,
          availability,
          brand: siteConfig.name,
          productType,
          gpc,
          shippingFee: ship,
          leadTimeDays: product.leadTimeDays,
        })
      );
    }
  }

  const title = `${siteConfig.name} product feed`;
  const link = siteConfig.url.replace(/\/$/, "");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(link)}</link>
    <description>${escapeXml(`${siteConfig.name} catalog for Google Merchant Center`)}</description>
${items.join("\n")}
  </channel>
</rss>
`;
}
