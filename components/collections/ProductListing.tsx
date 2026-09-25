import ProductCard from "./ProductCard";
import { Product } from "@/lib/products";

interface ProductListingProps {
  title?: string;
  products?: Product[];
}

export default function ProductListing({
  title = "All Window Treatments",
  products = [],
}: ProductListingProps) {
  return (
    <div className="py-10">
      <h1 className="mb-2 font-serif text-3xl capitalize text-charcoal">
        {title}
      </h1>
      <p className="mb-8 text-sm text-charcoal-light">
        {products.length} products
      </p>

      {/* 核心修复：lg:grid-cols-3 让大屏幕下一排精准展示 3 个产品 */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
