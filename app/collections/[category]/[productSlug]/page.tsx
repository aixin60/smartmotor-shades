import { notFound } from "next/navigation";
import CategoryNav from "@/components/collections/CategoryNav";
import FilterBar from "@/components/collections/FilterBar";
import ProductListing from "@/components/collections/ProductListing";
import ProductAccordion from "@/components/product/ProductAccordion";
import ProductConfigurator from "@/components/product/ProductConfigurator";
import ProductGallery from "@/components/product/ProductGallery";
import { getProductBySlug, slugToCategory, PLACEHOLDER_PRODUCTS } from "@/lib/products";

interface ProductDetailPageProps {
  params: Promise<{ category: string; productSlug: string }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { category: categorySlug, productSlug } = await params;
  const category = slugToCategory(categorySlug);

  if (!category) {
    notFound();
  }

  // 1. 拦截 Single 或 Dual 的筛选请求
  if (productSlug === "single" || productSlug === "dual") {
    const categoryProducts = PLACEHOLDER_PRODUCTS.filter(
      (p) => p.category === category
    );

    // 精确过滤出 slug 中包含 single 或 dual 的产品
    const filteredProducts = categoryProducts.filter((p) =>
      p.slug.includes(productSlug)
    );

    return (
      <>
        <CategoryNav />
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <FilterBar />
          <div className="mt-10">
            {/* 这里的标题会动态显示为 single Cellular Shades 或 dual Cellular Shades */}
            <ProductListing 
              title={`${productSlug} ${category} Shades`} 
              products={filteredProducts} 
            />
          </div>
        </div>
      </>
    );
  }

  // 2. 如果不是 single/dual 筛选，那就是具体的单品详情页 (PDP)
  const product = getProductBySlug(categorySlug, productSlug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <CategoryNav />
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <ProductGallery initialColor={product.imageColor} />
          <ProductConfigurator
            slug={product.slug}
            category={category}
            productName={product.name}
            basePrice={product.price}
            initialColor={product.imageColor}
          />
        </div>
        <div className="mt-20">
          <ProductAccordion />
        </div>
      </div>
    </>
  );
}
