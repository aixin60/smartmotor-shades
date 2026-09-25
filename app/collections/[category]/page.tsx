import { notFound } from "next/navigation";
import CategoryNav from "@/components/collections/CategoryNav";
import FilterBar from "@/components/collections/FilterBar";
import ProductListing from "@/components/collections/ProductListing";
import { PLACEHOLDER_PRODUCTS, slugToCategory } from "@/lib/products";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = slugToCategory(categorySlug);

  if (!category) {
    notFound();
  }

  // 1. 筛选出属于当前大类的产品
  const categoryProducts = PLACEHOLDER_PRODUCTS.filter(
    (p) => p.category === category
  );

  return (
    <>
      <CategoryNav />
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <FilterBar />
        <div className="mt-10">
          {/* 2. 将筛选好的产品传给组件，修复报错 */}
          <ProductListing 
            title={`${category} Shades`} 
            products={categoryProducts} 
          />
        </div>
      </div>
    </>
  );
}
