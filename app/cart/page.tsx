import CartView from "@/components/cart/CartView";

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-medium text-charcoal">
          Shopping Cart
        </h1>
        <p className="mt-2 text-sm text-charcoal-light">
          Review your selections before checkout.
        </p>
      </div>

      <CartView />
    </div>
  );
}
