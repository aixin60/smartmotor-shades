import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone">
        Checkout canceled
      </p>
      <h1 className="mt-3 font-serif text-4xl font-medium text-charcoal">
        Your cart is still here
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-charcoal-light">
        No payment was taken. You can return to your cart and check out when
        you are ready.
      </p>
      <Link
        href="/cart"
        className="mt-8 rounded-sm bg-charcoal px-8 py-3 text-sm font-medium uppercase tracking-wider text-cream transition-colors hover:bg-charcoal-light"
      >
        Return to Cart
      </Link>
    </div>
  );
}
