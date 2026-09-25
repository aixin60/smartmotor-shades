"use client";

import { useState } from "react";

const SWATCHES = [
  { name: "Ivory", color: "#f7f3ed" },
  { name: "Linen", color: "#e8dfd2" },
  { name: "Sand", color: "#d4c8b8" },
  { name: "Stone", color: "#b5aea3" },
  { name: "Charcoal", color: "#4a4540" },
];

interface ProductGalleryProps {
  initialColor?: string;
}

export default function ProductGallery({ initialColor }: ProductGalleryProps) {
  const initialIndex = initialColor
    ? Math.max(
        0,
        SWATCHES.findIndex((s) => s.color === initialColor)
      )
    : 0;
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const activeSwatch = SWATCHES[activeIndex];

  return (
    <div className="space-y-4">
      <div
        className="aspect-square w-full rounded-sm transition-colors duration-300"
        style={{ backgroundColor: activeSwatch.color }}
      />
      <div className="flex gap-2">
        {SWATCHES.map((swatch, index) => (
          <button
            key={swatch.name}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-14 w-14 rounded-sm border-2 transition-all ${
              activeIndex === index
                ? "border-charcoal"
                : "border-border hover:border-stone"
            }`}
            style={{ backgroundColor: swatch.color }}
            aria-label={swatch.name}
            title={swatch.name}
          />
        ))}
      </div>
    </div>
  );
}
