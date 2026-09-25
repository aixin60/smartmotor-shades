"use client";

import Link from "next/link";
import { Bookmark, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { CartItem, SavedItem } from "@/context/CartContext";
import { formatDimensions } from "@/lib/cart";
import { categoryToSlug, type Category } from "@/lib/products";

function productHref(item: { category: string; slug: string }) {
  return `/collections/${categoryToSlug(item.category as Category)}/${item.slug}`;
}

function ItemDetails({
  item,
}: {
  item: Pick<
    CartItem,
    "name" | "category" | "color" | "width" | "height" | "structure" | "motor"
  >;
}) {
  return (
    <div className="mt-1 space-y-0.5 text-xs text-stone">
      <p>{formatDimensions(item.width, item.height)}</p>
      <p>
        {item.color}
        {item.structure ? ` · ${item.structure}` : ""} · {item.motor}
      </p>
    </div>
  );
}

function CartLineItem({ item }: { item: CartItem }) {
  const { updateQuantity, removeFromCart, saveForLater } = useCart();

  return (
    <div className="flex gap-5 py-6">
      <Link href={productHref(item)} className="shrink-0">
        <div
          className="h-28 w-24 rounded-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: item.imageColor }}
        />
      </Link>
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              href={productHref(item)}
              className="font-serif text-lg font-medium text-charcoal transition-colors hover:text-accent"
            >
              {item.name}
            </Link>
            <ItemDetails item={item} />
          </div>
          <button
            type="button"
            onClick={() => removeFromCart(item.id)}
            aria-label={`Remove ${item.name}`}
            className="text-stone transition-colors hover:text-charcoal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                aria-label="Decrease quantity"
                className="flex h-8 w-8 items-center justify-center rounded-sm border border-border text-stone transition-colors hover:border-stone hover:text-charcoal"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-6 text-center text-sm font-medium text-charcoal">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                aria-label="Increase quantity"
                className="flex h-8 w-8 items-center justify-center rounded-sm border border-border text-stone transition-colors hover:border-stone hover:text-charcoal"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => saveForLater(item.id)}
              className="text-xs font-medium text-stone underline decoration-border underline-offset-4 transition-colors hover:text-charcoal"
            >
              Save for Later
            </button>
          </div>
          <p className="text-sm font-medium text-charcoal">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

function SavedLineItem({ item }: { item: SavedItem }) {
  const { moveToCart, removeFromSaved } = useCart();

  return (
    <div className="flex gap-5 py-6">
      <div
        className="h-24 w-20 shrink-0 rounded-sm"
        style={{ backgroundColor: item.imageColor }}
      />
      <div className="flex flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-serif text-base font-medium text-charcoal">
            {item.name}
          </h3>
          <ItemDetails item={item} />
          <p className="mt-2 text-sm text-charcoal-light">
            ${item.price.toFixed(2)}
            {item.quantity > 1 ? ` × ${item.quantity}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => moveToCart(item.id)}
            className="text-xs font-medium text-charcoal underline decoration-border underline-offset-4 transition-colors hover:text-accent"
          >
            Move to Cart
          </button>
          <button
            type="button"
            onClick={() => removeFromSaved(item.id)}
            className="text-xs font-medium text-stone underline decoration-border underline-offset-4 transition-colors hover:text-charcoal"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CartView() {
  const { cart, savedItems, isHydrated } = useCart();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (!isHydrated) {
    return (
      <div className="py-24 text-center text-sm text-stone">
        Loading your cart…
      </div>
    );
  }

  const isCartEmpty = cart.length === 0;
  const hasSavedItems = savedItems.length > 0;

  if (isCartEmpty && !hasSavedItems) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-cream-dark">
          <ShoppingBag className="h-7 w-7 text-stone" />
        </div>
        <h2 className="font-serif text-2xl font-medium text-charcoal">
          Your cart is empty
        </h2>
        <p className="mt-2 max-w-sm text-sm text-charcoal-light">
          Explore our collections to find the perfect custom window treatment
          for your home.
        </p>
        <Link
          href="/collections"
          className="mt-8 rounded-sm bg-charcoal px-8 py-3 text-sm font-medium uppercase tracking-wider text-cream transition-colors hover:bg-charcoal-light"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
        <div className="lg:col-span-2">
          {isCartEmpty ? (
            <div className="rounded-sm border border-dashed border-border bg-cream-dark/50 px-6 py-12 text-center">
              <ShoppingBag className="mx-auto h-6 w-6 text-stone" />
              <p className="mt-3 font-serif text-lg font-medium text-charcoal">
                Your cart is empty
              </p>
              <p className="mt-1 text-sm text-charcoal-light">
                Move saved items back to your cart or continue shopping.
              </p>
              <Link
                href="/collections"
                className="mt-6 inline-block text-sm font-medium text-charcoal underline decoration-border underline-offset-4 transition-colors hover:text-accent"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border border-y border-border">
              {cart.map((item) => (
                <CartLineItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-sm border border-border bg-cream-dark p-6">
            <h2 className="font-serif text-xl font-medium text-charcoal">
              Order Summary
            </h2>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between text-charcoal-light">
                <span>Subtotal</span>
                <span className="font-medium text-charcoal">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-charcoal-light">
                <span>Shipping</span>
                <span className="text-stone">Calculated at checkout</span>
              </div>
            </div>
            <div className="my-6 h-px bg-border" />
            <div className="flex justify-between text-sm font-medium text-charcoal">
              <span>Estimated Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <button
              type="button"
              disabled={isCartEmpty}
              className="mt-6 w-full rounded-sm bg-charcoal py-3.5 text-sm font-medium uppercase tracking-wider text-cream transition-colors hover:bg-charcoal-light disabled:cursor-not-allowed disabled:opacity-40"
            >
              Proceed to Checkout
            </button>
            <Link
              href="/collections"
              className="mt-4 block text-center text-xs text-stone transition-colors hover:text-charcoal"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <section>
        <div className="mb-6 flex items-center gap-2">
          <Bookmark className="h-4 w-4 text-stone" />
          <h2 className="font-serif text-2xl font-medium text-charcoal">
            Saved for Later
          </h2>
        </div>

        {hasSavedItems ? (
          <div className="divide-y divide-border border-y border-border">
            {savedItems.map((item) => (
              <SavedLineItem key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-charcoal-light">
            No items saved for later. Use &ldquo;Save for Later&rdquo; on any
            cart item to store it here.
          </p>
        )}
      </section>
    </div>
  );
}
