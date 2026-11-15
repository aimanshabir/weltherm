"use server";

import { db } from "@/lib/db";
import { slugify, excerptFrom } from "@/lib/utils";

export type FormState = { ok: boolean; message: string } | null;

function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export async function subscribeAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = str(formData, "email").toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }

  try {
    await db.subscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });
    return { ok: true, message: "You're subscribed! Welcome to the Weltherm family." };
  } catch {
    return { ok: false, message: "Something went wrong. Please try again." };
  }
}

export async function contactAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = str(formData, "name");
  const email = str(formData, "email");
  const phone = str(formData, "phone");
  const subject = str(formData, "subject");
  const message = str(formData, "message");

  if (!name || !email || !message) {
    return { ok: false, message: "Please fill in your name, email and message." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }
  if (message.length < 10) {
    return { ok: false, message: "Please tell us a bit more (at least 10 characters)." };
  }

  try {
    await db.message.create({ data: { name, email, phone: phone || null, subject: subject || null, message } });
    return { ok: true, message: "Thanks for reaching out! Our team will get back to you shortly." };
  } catch {
    return { ok: false, message: "Something went wrong. Please try again." };
  }
}

export async function submitPostAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = str(formData, "name");
  const email = str(formData, "email");
  const title = str(formData, "title");
  const content = str(formData, "content");
  const coverImage = str(formData, "coverImage");

  if (!name || !email || !title || !content) {
    return { ok: false, message: "Please fill in all required fields." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }
  if (title.length < 8) {
    return { ok: false, message: "Title should be at least 8 characters." };
  }
  if (content.length < 100) {
    return { ok: false, message: "Your story should be at least 100 characters long." };
  }
  if (coverImage && !/^https?:\/\/.+/i.test(coverImage)) {
    return { ok: false, message: "Cover image must be a valid http(s) URL." };
  }

  try {
    let slug = slugify(title);
    if (!slug) slug = `post-${Date.now()}`;
    const existing = await db.post.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    await db.post.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerptFrom(content),
        coverImage: coverImage || null,
        status: "PENDING",
        authorName: name,
        authorEmail: email,
      },
    });
    return {
      ok: true,
      message: "Thank you! Your story has been submitted and will appear after review by our team.",
    };
  } catch {
    return { ok: false, message: "Something went wrong. Please try again." };
  }
}
