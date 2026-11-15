import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "./db";

/** Current year, cached so it can be prerendered (Cache Components forbids raw new Date()). */
export async function getCurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function getCategories() {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");

  return db.category.findMany({
    where: { isActive: true },
    orderBy: [{ group: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
    include: {
      _count: { select: { products: { where: { isActive: true } } } },
      products: {
        where: { isActive: true },
        take: 1,
        orderBy: { createdAt: "asc" },
        select: { images: true },
      },
    },
  });
}

export async function getFeaturedProducts() {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  return db.product.findMany({
    where: { isActive: true, featured: true },
    include: { category: true },
    orderBy: { createdAt: "asc" },
    take: 8,
  });
}

export async function getProductsByCategory(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  return db.product.findMany({
    where: { isActive: true, category: { slug } },
    include: { category: true },
    orderBy: { name: "asc" },
  });
}

export async function searchProducts(query: string, categorySlug?: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const q = query.trim().toLowerCase();
  return db.product.findMany({
    where: {
      isActive: true,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { shortDescription: { contains: q } },
              { description: { contains: q } },
              { sku: { contains: q } },
              { category: { name: { contains: q } } },
            ],
          }
        : {}),
    },
    include: { category: true },
    orderBy: [{ name: "asc" }],
  });
}

export async function getProduct(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  return db.product.findUnique({
    where: { slug },
    include: { category: true },
  });
}

export async function getRelatedProducts(categoryId: string, excludeSlug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  return db.product.findMany({
    where: { isActive: true, categoryId, slug: { not: excludeSlug } },
    include: { category: true },
    take: 4,
  });
}

export async function getPublishedPosts() {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");

  return db.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getPost(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");

  return db.post.findUnique({ where: { slug } });
}
