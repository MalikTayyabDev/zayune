import { getDemoCatalog, getDemoCategories } from "@/lib/demo-catalog";
import { demoSettings, isDemoMode } from "@/lib/demo-data";
import { prisma } from "@/lib/prisma";

export type ShopQuery = {
  categorySlug?: string;
  sort?: string | null;
  q?: string | null;
  availability?: string | null;
};

function sortProducts<
  T extends { featured: boolean; createdAt: Date; price: number; name: string },
>(products: T[], sort?: string | null) {
  const list = [...products];
  switch (sort) {
    case "newest":
      return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "name":
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case "best-sellers":
      return list.sort(
        (a, b) => Number(b.featured) - Number(a.featured) || a.price - b.price
      );
    default:
      return list.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}

function filterCatalog(
  products: ReturnType<typeof getDemoCatalog>,
  { categorySlug, q, availability }: ShopQuery
) {
  return products.filter((p) => {
    if (!p.published && !categorySlug) {
      /* still filter unpublished for storefront */
    }
    if (!p.published) return false;
    if (categorySlug && p.category.slug !== categorySlug) return false;
    if (q) {
      const query = q.toLowerCase();
      const hay =
        `${p.name} ${p.oneLiner} ${p.tags.join(" ")} ${p.category.name}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    if (availability === "in-stock" && p.fulfillment !== "IN_STOCK") return false;
    if (availability === "made-to-order" && p.fulfillment !== "MADE_TO_ORDER")
      return false;
    return true;
  });
}

export async function getCategories() {
  if (isDemoMode()) return getDemoCategories();
  return prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getFeaturedProducts(limit = 4) {
  if (isDemoMode()) {
    return getDemoCatalog()
      .filter((p) => p.published && p.featured)
      .slice(0, limit);
  }
  return prisma.product.findMany({
    where: { published: true, featured: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: true,
      variants: true,
    },
    orderBy: { updatedAt: "desc" },
    take: limit,
  });
}

export async function getBestSellers(limit = 4) {
  if (isDemoMode()) {
    return [...getDemoCatalog()]
      .filter((p) => p.published)
      .sort((a, b) => Number(b.featured) - Number(a.featured) || a.price - b.price)
      .slice(0, limit);
  }
  return prisma.product.findMany({
    where: { published: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: true,
      variants: true,
    },
    orderBy: [{ featured: "desc" }, { price: "asc" }],
    take: limit,
  });
}

export async function getNewestProducts(limit = 4) {
  if (isDemoMode()) {
    return [...getDemoCatalog()]
      .filter((p) => p.published)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
  return prisma.product.findMany({
    where: { published: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: true,
      variants: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getRelatedProducts(
  slug: string,
  categorySlug: string,
  limit = 4
) {
  if (isDemoMode()) {
    const catalog = getDemoCatalog().filter((p) => p.published);
    const related = catalog.filter(
      (p) => p.slug !== slug && p.category.slug === categorySlug
    );
    const fill = catalog.filter(
      (p) => p.slug !== slug && !related.some((r) => r.id === p.id)
    );
    return [...related, ...fill].slice(0, limit);
  }

  const sameCategory = await prisma.product.findMany({
    where: {
      published: true,
      slug: { not: slug },
      category: { slug: categorySlug },
    },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: true,
      variants: true,
    },
    take: limit,
  });

  if (sameCategory.length >= limit) return sameCategory;

  const more = await prisma.product.findMany({
    where: {
      published: true,
      slug: { not: slug },
      id: { notIn: sameCategory.map((p) => p.id) },
    },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: true,
      variants: true,
    },
    take: limit - sameCategory.length,
  });

  return [...sameCategory, ...more];
}

export async function getProducts(query: ShopQuery = {}) {
  if (isDemoMode()) {
    return sortProducts(filterCatalog(getDemoCatalog(), query), query.sort);
  }

  const products = await prisma.product.findMany({
    where: {
      published: true,
      ...(query.categorySlug ? { category: { slug: query.categorySlug } } : {}),
      ...(query.availability === "in-stock" ? { fulfillment: "IN_STOCK" } : {}),
      ...(query.availability === "made-to-order"
        ? { fulfillment: "MADE_TO_ORDER" }
        : {}),
      ...(query.q
        ? {
            OR: [
              { name: { contains: query.q, mode: "insensitive" } },
              { oneLiner: { contains: query.q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: true,
      variants: true,
    },
  });

  return sortProducts(products, query.sort);
}

export async function getProductBySlug(slug: string) {
  if (isDemoMode()) {
    return getDemoCatalog().find((p) => p.slug === slug && p.published) ?? null;
  }
  return prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: true,
      variants: true,
    },
  });
}

export async function getProductById(id: string) {
  if (isDemoMode()) {
    return getDemoCatalog().find((p) => p.id === id) ?? null;
  }
  return prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: true,
      variants: true,
    },
  });
}

export async function getSettings() {
  if (isDemoMode()) return demoSettings;
  return (
    (await prisma.settings.findUnique({ where: { id: "default" } })) ??
    demoSettings
  );
}

export type ProductWithRelations = NonNullable<
  Awaited<ReturnType<typeof getProductBySlug>>
>;
