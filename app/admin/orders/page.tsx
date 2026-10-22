import type { Metadata } from "next";
import { connection } from "next/server";
import AdminLogin from "@/components/admin/AdminLogin";
import OrdersDashboard from "@/components/admin/OrdersDashboard";
import { adminPassword, isAdminRequest } from "@/lib/admin-auth";
import { listOrders } from "@/lib/orders";
import { signOutAdmin } from "@/app/admin/orders/actions";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `Orders | ${siteConfig.brandName}`,
  robots: { index: false, follow: false },
};

export default async function AdminOrdersPage() {
  await connection();
  const signedIn = await isAdminRequest();

  if (!signedIn) {
    const { usingDefault } = adminPassword();
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center px-6 py-16">
        <AdminLogin
          hint={
            usingDefault ? "Local default password: smartmotor2026" : null
          }
        />
      </div>
    );
  }

  const orders = await listOrders();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 print:hidden">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone">
            Internal
          </p>
          <h1 className="mt-2 font-serif text-4xl font-medium text-charcoal">
            Orders
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-charcoal-light">
            Manufacturing queue for paid custom shades. Update fulfillment as
            each order moves from paid to production to shipped.
          </p>
        </div>
        <form action={signOutAdmin}>
          <button
            type="submit"
            className="rounded-sm border border-border px-3 py-2 text-xs font-medium uppercase tracking-wider text-charcoal-light transition-colors hover:border-stone hover:text-charcoal"
          >
            Sign out
          </button>
        </form>
      </div>
      <OrdersDashboard orders={orders} />
    </div>
  );
}
