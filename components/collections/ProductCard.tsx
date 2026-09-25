import Link from "next/link";
import { Product, categoryToSlug } from "@/lib/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // 直接在组件内部生成跳转链接，彻底避开之前那个找不到函数的错误
  const href = `/collections/${categoryToSlug(product.category)}/${product.slug}`;

  return (
    <Link href={href} className="group flex flex-col">
      <div
        className="aspect-[4/5] w-full rounded-sm mb-4 transition-opacity group-hover:opacity-90"
        style={{ backgroundColor: product.imageColor }}
      />
      <h3 className="font-serif text-lg text-charcoal transition-colors group-hover:text-charcoal-light">
        {product.name}
      </h3>
      <p className="mt-1 text-sm text-charcoal-light">
        From ${product.price}
      </p>
    </Link>
  );
}
