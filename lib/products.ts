export const CATEGORIES = [
  "Roller",
  "Cellular",
  "Zebra",
  "Shangri-La",
  "Drapery",
  "Roman",
  "Woven",
  "Dream",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const BLACK_LEVELS = [
  "100%",
  "85%",
  "60%-80%",
  "45%-65%",
  "10%-30%",
  "0%-85%",
] as const;

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  blackLevel: string;
  price: number;
  imageColor: string;
}

export const PLACEHOLDER_PRODUCTS: Product[] = [
  // --- Single Roller 系列 ---
  { id: "1", slug: "single-roller-standard", name: "Standard Single Roller", category: "Roller", blackLevel: "85%", price: 239, imageColor: "#e8dfd2" },
  { id: "2", slug: "single-roller-premium", name: "Premium Single Roller", category: "Roller", blackLevel: "100%", price: 249, imageColor: "#d4c8b8" },
  { id: "3", slug: "single-roller-luxury", name: "Luxury Single Roller", category: "Roller", blackLevel: "100%", price: 269, imageColor: "#b5aea3" },
  
  // --- Dual Roller 系列 ---
  { id: "4", slug: "dual-roller-standard", name: "Standard Dual Roller", category: "Roller", blackLevel: "85%", price: 359, imageColor: "#6b6560" },
  { id: "5", slug: "dual-roller-premium", name: "Premium Dual Roller", category: "Roller", blackLevel: "100%", price: 379, imageColor: "#f0ebe3" },
  { id: "6", slug: "dual-roller-luxury", name: "Luxury Dual Roller", category: "Roller", blackLevel: "100%", price: 399, imageColor: "#ddd5c8" },

  // --- Single Cellular 系列 ---
  { id: "7", slug: "single-cellular-standard", name: "Standard Single Cellular", category: "Cellular", blackLevel: "60%-80%", price: 259, imageColor: "#e8dfd2" },
  { id: "8", slug: "single-cellular-premium", name: "Premium Single Cellular", category: "Cellular", blackLevel: "85%", price: 289, imageColor: "#ede6db" },
  { id: "9", slug: "single-cellular-luxury", name: "Luxury Single Cellular", category: "Cellular", blackLevel: "100%", price: 319, imageColor: "#c4b8a8" },

  // --- Dual Cellular 系列 ---
  { id: "10", slug: "dual-cellular-standard", name: "Standard Dual Cellular", category: "Cellular", blackLevel: "60%-80%", price: 379, imageColor: "#d4c8b8" },
  { id: "11", slug: "dual-cellular-premium", name: "Premium Dual Cellular", category: "Cellular", blackLevel: "85%", price: 399, imageColor: "#b5aea3" },
  { id: "12", slug: "dual-cellular-luxury", name: "Luxury Dual Cellular", category: "Cellular", blackLevel: "100%", price: 429, imageColor: "#6b6560" },

  // --- Zebra 系列 ---
  { id: "13", slug: "zebra-standard", name: "Standard Zebra", category: "Zebra", blackLevel: "45%-65%", price: 279, imageColor: "#ede6db" },
  { id: "14", slug: "zebra-premium", name: "Premium Zebra", category: "Zebra", blackLevel: "60%-80%", price: 299, imageColor: "#c4b8a8" },
  { id: "15", slug: "zebra-luxury", name: "Luxury Zebra", category: "Zebra", blackLevel: "85%", price: 329, imageColor: "#8a8278" },

  // --- Shangri-La 系列 ---
  { id: "16", slug: "shangri-la-standard", name: "Standard Shangri-La", category: "Shangri-La", blackLevel: "60%-80%", price: 299, imageColor: "#e0d5c5" },
  { id: "17", slug: "shangri-la-premium", name: "Premium Shangri-La", category: "Shangri-La", blackLevel: "85%", price: 329, imageColor: "#a89f94" },
  { id: "18", slug: "shangri-la-luxury", name: "Luxury Shangri-La", category: "Shangri-La", blackLevel: "100%", price: 359, imageColor: "#6b6560" },

  // --- Drapery 系列 ---
  { id: "19", slug: "drapery-standard", name: "Standard Drapery", category: "Drapery", blackLevel: "60%-80%", price: 349, imageColor: "#f5f0e8" },
  { id: "20", slug: "drapery-premium", name: "Premium Drapery", category: "Drapery", blackLevel: "85%", price: 399, imageColor: "#d9cfc0" },
  { id: "21", slug: "drapery-luxury", name: "Luxury Drapery", category: "Drapery", blackLevel: "100%", price: 449, imageColor: "#b5aea3" },

  // --- Roman 系列 ---
  { id: "22", slug: "roman-standard", name: "Standard Roman", category: "Roman", blackLevel: "60%-80%", price: 289, imageColor: "#e8dfd2" },
  { id: "23", slug: "roman-premium", name: "Premium Roman", category: "Roman", blackLevel: "85%", price: 319, imageColor: "#d4c8b8" },
  { id: "24", slug: "roman-luxury", name: "Luxury Roman", category: "Roman", blackLevel: "100%", price: 349, imageColor: "#6b6560" },

  // --- Woven 系列 ---
  { id: "25", slug: "woven-standard", name: "Standard Woven", category: "Woven", blackLevel: "10%-30%", price: 269, imageColor: "#e0d5c5" },
  { id: "26", slug: "woven-premium", name: "Premium Woven", category: "Woven", blackLevel: "45%-65%", price: 299, imageColor: "#c4b8a8" },
  { id: "27", slug: "woven-luxury", name: "Luxury Woven", category: "Woven", blackLevel: "85%", price: 339, imageColor: "#8a8278" },

  // --- Dream 系列 (专属 0%-85% 遮光度) ---
  { id: "28", slug: "dream-standard", name: "Standard Dream", category: "Dream", blackLevel: "0%-85%", price: 399, imageColor: "#e5ddd2" },
  { id: "29", slug: "dream-premium", name: "Premium Dream", category: "Dream", blackLevel: "0%-85%", price: 439, imageColor: "#d4c8b8" },
  { id: "30", slug: "dream-luxury", name: "Luxury Dream", category: "Dream", blackLevel: "0%-85%", price: 479, imageColor: "#a89f94" },
];

export function categoryToSlug(category: Category): string {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export function getProductBySlug(
  categorySlug: string,
  productSlug: string
): Product | undefined {
  return PLACEHOLDER_PRODUCTS.find(
    (p) =>
      categoryToSlug(p.category) === categorySlug && p.slug === productSlug
  );
}

export function slugToCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => categoryToSlug(c) === slug);
}

export function getProductHref(product: Product): string {
  const categorySlug = categoryToSlug(product.category);
  return `/collections/${categorySlug}/${product.slug}`;
}
