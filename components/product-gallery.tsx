"use client";

import { useState } from "react";
import SmartImage from "@/components/smart-image";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[Math.min(active, images.length - 1)];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-ink-100 bg-ink-50 p-8 sm:p-12">
        <SmartImage
          key={current}
          src={current}
          alt={name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="animate-fade-in object-contain"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {images.slice(0, 5).map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1} of ${name}`}
              aria-pressed={i === active}
              className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-ink-50 p-2 transition ${
                i === active ? "border-brand-600" : "border-transparent hover:border-ink-200"
              }`}
            >
              <SmartImage src={img} alt="" fill sizes="10vw" className="object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
