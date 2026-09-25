"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartLink() {
  const { cartCount, isHydrated } = useCart();

  return (
    <Link
      href="/cart"
      aria-label={`Shopping cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
      className="relative text-charcoal-light transition-colors hover:text-charcoal"
    >
      <ShoppingCart className="h-5 w-5" />
      {isHydrated && cartCount > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-charcoal px-1 text-[10px] font-medium leading-none text-cream">
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </Link>
  );
}
