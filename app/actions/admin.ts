"use server";

import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify, excerptFrom } from "@/lib/utils";
import { writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export type AdminFormState = { ok: boolean; message: string } | null;

function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function bool(fd: FormData, key: string): boolean {
  return fd.get(key) === "on" || fd.get(key) === "true";
}

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products");

async function saveUploadedImages(files: File[], prefix: string): Promise<string[]> {
  const saved: string[] = [];
  for (const file of files) {
    if (!file || file.size === 0) continue;
    if (file.size > 5 * 1024 * 1024) continue; // 5 MB max
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!["jpg", "jpeg", "png", "webp", "gif", "avif"].includes(ext)) continue;
    const name = `${slugify(prefix)}-${crypto.randomBytes(4).toString("hex")}.${ext === "jpeg" ? "jpg" : ext}`;
    const buf = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(UPLOAD_DIR, name), buf);
    saved.push(`/uploads/products/${name}`);
  }
  return saved;
}

/* ── Products ─────────────────────────────────────────── */

export async function saveProductAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await requireAdmin();

  const id = str(formData, "id");
  const name = str(formData, "name");
  const categoryId = str(formData, "categoryId");

  if (!name || !categoryId) {
    return { ok: false, message: "Name and category are required." };
  }

  let slug = slugify(str(formData, "slug") || name);
  const clash = await db.product.findFirst({ where: { slug, ...(id ? { id: { not: id } } : {}) } });
  if (clash) slug = `${slug}-${crypto.randomBytes(2).toString("hex")}`;

  // Combine kept existing images, uploaded files, and any pasted URL
  let images: string[] = [];
  try {
    const kept = JSON.parse(str(formData, "existingImages") || "[]");
    if (Array.isArray(kept)) images = kept.filter((i) => typeof i === "string");
  } catch {
    /* ignore */
  }
  const files = formData.getAll("imageFiles").filter((f): f is File => f instanceof File);
  images.push(...(await saveUploadedImages(files, slug)));
  const url = str(formData, "imageUrl");
  if (url && /^https?:\/\/|^\//.test(url)) images.push(url);

  const data = {
    name,
    slug,
    sku: str(formData, "sku") || null,
    categoryId,
    shortDescription: str(formData, "shortDescription") || null,
    description: str(formData, "description") || null,
    warranty: str(formData, "warranty") || null,
    amazonUrl: str(formData, "amazonUrl") || null,
    flipkartUrl: str(formData, "flipkartUrl") || null,
    featured: bool(formData, "featured"),
    isActive: bool(formData, "isActive"),
    images: JSON.stringify(images),
  };

  try {
    if (id) {
      await db.product.update({ where: { id }, data });
    } else {
      await db.product.create({ data });
    }
  } catch {
    return { ok: false, message: "Could not save the product. Please try again." };
  }

  updateTag("products");
  redirect("/admin/products?saved=1");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const product = await db.product.findUnique({ where: { id } });
  if (product) {
    await db.product.delete({ where: { id } });
    // Best-effort local image cleanup
    for (const img of JSON.parse(product.images || "[]")) {
      if (typeof img === "string" && img.startsWith("/uploads/products/")) {
        await unlink(path.join(process.cwd(), "public", img)).catch(() => undefined);
      }
    }
  }
  updateTag("products");
  redirect("/admin/products?deleted=1");
}

/* ── Categories ───────────────────────────────────────── */

export async function saveCategoryAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await requireAdmin();

  const id = str(formData, "id");
  const name = str(formData, "name");
  if (!name) return { ok: false, message: "Category name is required." };

  let slug = slugify(str(formData, "slug") || name);
  const clash = await db.category.findFirst({ where: { slug, ...(id ? { id: { not: id } } : {}) } });
  if (clash) slug = `${slug}-${crypto.randomBytes(2).toString("hex")}`;

  const data = {
    name,
    slug,
    description: str(formData, "description") || null,
    group: str(formData, "group") || "others",
    sortOrder: Number(str(formData, "sortOrder") || "0") || 0,
    isActive: bool(formData, "isActive"),
  };

  try {
    if (id) {
      await db.category.update({ where: { id }, data });
    } else {
      await db.category.create({ data });
    }
  } catch {
    return { ok: false, message: "Could not save the category." };
  }

  updateTag("categories");
  updateTag("products");
  redirect("/admin/categories?saved=1");
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const count = await db.product.count({ where: { categoryId: id } });
  if (count === 0) {
    await db.category.delete({ where: { id } }).catch(() => undefined);
  }
  updateTag("categories");
  updateTag("products");
  redirect("/admin/categories?deleted=1");
}

/* ── Posts ────────────────────────────────────────────── */

export async function savePostAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireAdmin();

  const id = str(formData, "id");
  const title = str(formData, "title");
  const content = str(formData, "content");
  const status = str(formData, "status") as "PENDING" | "PUBLISHED" | "REJECTED";

  if (!title || !content) return { ok: false, message: "Title and content are required." };

  let slug = slugify(str(formData, "slug") || title);
  const clash = await db.post.findFirst({ where: { slug, ...(id ? { id: { not: id } } : {}) } });
  if (clash) slug = `${slug}-${crypto.randomBytes(2).toString("hex")}`;

  const tags = str(formData, "tags")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const publishNow = status === "PUBLISHED";

  try {
    if (id) {
      const existing = await db.post.findUnique({ where: { id } });
      await db.post.update({
        where: { id },
        data: {
          title,
          slug,
          excerpt: str(formData, "excerpt") || excerptFrom(content),
          content,
          coverImage: str(formData, "coverImage") || null,
          tags: JSON.stringify(tags),
          status,
          publishedAt: publishNow ? (existing?.publishedAt ?? new Date()) : null,
          authorName: str(formData, "authorName") || user.name,
        },
      });
    } else {
      await db.post.create({
        data: {
          title,
          slug,
          excerpt: str(formData, "excerpt") || excerptFrom(content),
          content,
          coverImage: str(formData, "coverImage") || null,
          tags: JSON.stringify(tags),
          status,
          publishedAt: publishNow ? new Date() : null,
          authorName: str(formData, "authorName") || user.name,
          authorId: user.id,
        },
      });
    }
  } catch {
    return { ok: false, message: "Could not save the post." };
  }

  updateTag("posts");
  redirect("/admin/posts?saved=1");
}

export async function setPostStatusAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const status = str(formData, "status") as "PENDING" | "PUBLISHED" | "REJECTED";
  const post = await db.post.findUnique({ where: { id } });
  if (post) {
    await db.post.update({
      where: { id },
      data: { status, publishedAt: status === "PUBLISHED" ? (post.publishedAt ?? new Date()) : null },
    });
  }
  updateTag("posts");
  redirect("/admin/posts");
}

export async function deletePostAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  await db.post.delete({ where: { id } }).catch(() => undefined);
  updateTag("posts");
  redirect("/admin/posts?deleted=1");
}

/* ── Messages & subscribers ───────────────────────────── */

export async function toggleMessageReadAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const message = await db.message.findUnique({ where: { id } });
  if (message) {
    await db.message.update({ where: { id }, data: { isRead: !message.isRead } });
  }
}

export async function deleteMessageAction(formData: FormData) {
  await requireAdmin();
  await db.message.delete({ where: { id: str(formData, "id") } }).catch(() => undefined);
}

export async function deleteSubscriberAction(formData: FormData) {
  await requireAdmin();
  await db.subscriber.delete({ where: { id: str(formData, "id") } }).catch(() => undefined);
}
