"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES, categoryToSlug } from "@/lib/products";

export default function CategoryNav() {
  const pathname = usePathname();
  const activeCategory = pathname.includes("/collections/")
    ? pathname.split("/collections/")[1]?.split("/")[0]
    : null;

  return (
    <nav className="border-b border-border bg-cream">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-1 px-6 py-3 lg:px-8">
        {CATEGORIES.map((category) => {
          const slug = categoryToSlug(category);
          const isActive = activeCategory === slug;
          
          // 判断是否是需要下拉菜单的大类
          const hasDropdown = category === "Roller" || category === "Cellular";

          return (
            <div key={category} className="group relative">
              <Link
                href={`/collections/${slug}`}
                className={`inline-flex items-center rounded-sm px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "border border-charcoal/20 bg-beige text-charcoal"
                    : "text-charcoal-light hover:bg-cream-dark hover:text-charcoal"
                }`}
              >
                {category}
                {/* 如果有下拉，添加一个小小的向下箭头 */}
                {hasDropdown && (
                  <span className="ml-1 text-[10px] opacity-70">▼</span>
                )}
              </Link>

              {/* 悬停时显示的下拉菜单区块 */}
              {hasDropdown && (
                <div className="absolute left-0 top-full z-10 hidden min-w-[140px] pt-1 group-hover:block">
                  <div className="flex flex-col overflow-hidden rounded-md border border-border bg-white shadow-lg">
                    <Link
                      href={`/collections/${slug}/single`}
                      className="px-4 py-2.5 text-sm text-charcoal-light transition-colors hover:bg-cream hover:text-charcoal"
                    >
                      Single {category}
                    </Link>
                    <Link
                      href={`/collections/${slug}/dual`}
                      className="px-4 py-2.5 text-sm text-charcoal-light transition-colors hover:bg-cream hover:text-charcoal"
                    >
                      Dual {category}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
