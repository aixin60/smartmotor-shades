"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";

export default function ClearCartOnSuccess() {
  const { clearCart, isHydrated } = useCart();
  const didClear = useRef(false);

  useEffect(() => {
    if (!isHydrated || didClear.current) return;
    didClear.current = true;
    clearCart();
  }, [clearCart, isHydrated]);

  return null;
}
