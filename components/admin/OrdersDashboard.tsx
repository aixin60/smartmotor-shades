"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setOrderFulfillment } from "@/app/admin/orders/actions";
import {
  FULFILLMENT_STATUSES,
  formatOrderMoney,
  type FulfillmentStatus,
  type Order,
} from "@/lib/order-model";
import WorkOrderSheet from "@/components/print/WorkOrderSheet";

const FILTERS: { id: "all" | FulfillmentStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "paid", label: "Paid" },
  { id: "in_production", label: "In Production" },
  { id: "shipped", label: "Shipped" },
];

const STATUS_LABEL: Record<FulfillmentStatus, string> = {
  paid: "Paid",
  in_production: "In Production",
  shipped: "Shipped",
};

function mountLabel(mountType?: string): string {
  if (mountType === "inside") return "Inside Mount";
  if (mountType === "outside") return "Outside Mount";
  return mountType?.trim() || "—";
}

function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatPaymentStatus(status: string): string {
  if (status === "paid") return "Paid";
  if (status === "unpaid") return "Unpaid";
  if (status === "no_payment_required") return "No payment required";
  return status;
}

function formatAddress(order: Order): string[] {
  const address = order.shippingAddress;
  const cityLine = [address.city, address.state].filter(Boolean).join(", ");
  const region = [cityLine, address.postalCode].filter(Boolean).join(" ");
  return [
    address.name && address.name !== order.customerName ? address.name : "",
    address.line1,
    address.line2,
    region,
    address.country,
  ].filter(Boolean);
}

export default function OrdersDashboard({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [printingId, setPrintingId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const counts = useMemo(() => {
    const tally: Record<(typeof FILTERS)[number]["id"], number> = {
      all: orders.length,
      paid: 0,
      in_production: 0,
      shipped: 0,
    };
    for (const order of orders) tally[order.fulfillmentStatus] += 1;
    return tally;
  }, [orders]);

  useEffect(() => {
    const reset = () => setPrintingId(null);
    window.addEventListener("afterprint", reset);
    return () => window.removeEventListener("afterprint", reset);
  }, []);

  function printWorkOrder(sessionId: string) {
    setPrintingId(sessionId);
    window.setTimeout(() => window.print(), 50);
  }

  const visible =
    filter === "all"
      ? orders
      : orders.filter((order) => order.fulfillmentStatus === filter);

  function changeStatus(sessionId: string, status: FulfillmentStatus) {
    setError(null);
    setPendingId(sessionId);
    startTransition(async () => {
      const result = await setOrderFulfillment(sessionId, status);
      if ("error" in result) {
        setError(result.error);
        setPendingId(null);
        return;
      }
      router.refresh();
      setPendingId(null);
    });
  }

  return (
    <>
    <div className="print:hidden">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((option) => {
          const selected = filter === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setFilter(option.id)}
              className={`rounded-sm border px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                selected
                  ? "border-charcoal bg-charcoal text-cream"
                  : "border-border bg-cream text-charcoal-light hover:border-stone hover:text-charcoal"
              }`}
            >
              {option.label}
              <span className="ml-2 tabular-nums">{counts[option.id]}</span>
            </button>
          );
        })}
      </div>

      {error ? (
        <p role="alert" className="mt-4 text-sm text-charcoal">
          {error}
        </p>
      ) : null}

      {visible.length === 0 ? (
        <div className="mt-10 rounded-sm border border-dashed border-border bg-cream-dark/60 px-6 py-16 text-center">
          <p className="font-serif text-2xl font-medium text-charcoal">
            {orders.length === 0 ? "No orders yet" : "No orders in this status"}
          </p>
          <p className="mt-2 text-sm text-charcoal-light">
            {orders.length === 0
              ? "Completed checkouts will appear here with each shade’s manufacturing specs."
              : "Choose another status to see the rest of the queue."}
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {visible.map((order) => {
            const addressLines = formatAddress(order);
            const busy = isPending && pendingId === order.sessionId;
            return (
              <article
                key={order.sessionId}
                className="rounded-sm border border-border bg-cream"
              >
                <div className="grid gap-6 border-b border-border px-5 py-5 sm:px-6 lg:grid-cols-4">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-stone">
                      Order
                    </p>
                    <p className="mt-1 font-serif text-2xl font-medium text-charcoal">
                      {order.id}
                    </p>
                    <p className="mt-1 text-sm text-charcoal-light">
                      {formatWhen(order.createdAt)}
                    </p>
                    {order.specsConfirmedAt ? (
                      <p className="mt-2 inline-flex rounded-sm border border-charcoal px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-charcoal">
                        Specs Confirmed ✓
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-stone">
                      Customer
                    </p>
                    <p className="mt-1 text-sm font-medium text-charcoal">
                      {order.customerName || "—"}
                    </p>
                    <p className="mt-1 text-sm text-charcoal-light">
                      {order.email || "—"}
                    </p>
                    <p className="mt-1 text-sm text-charcoal-light">
                      {order.phone || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-stone">
                      Shipping
                    </p>
                    {addressLines.length > 0 ? (
                      <div className="mt-1 space-y-0.5 text-sm text-charcoal-light">
                        {addressLines.map((line, index) => (
                          <p key={`${order.sessionId}-address-${index}`}>{line}</p>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-charcoal-light">—</p>
                    )}
                  </div>
                  <div className="lg:text-right">
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-stone">
                      Total
                    </p>
                    <p className="mt-1 font-serif text-2xl font-medium text-charcoal">
                      {formatOrderMoney(order.totalAmount, order.currency)}
                    </p>
                    <p className="mt-1 text-sm text-charcoal-light">
                      Payment {formatPaymentStatus(order.paymentStatus)}
                    </p>
                    <button
                      type="button"
                      onClick={() => printWorkOrder(order.sessionId)}
                      className="mt-3 rounded-sm border border-charcoal px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-charcoal transition-colors hover:bg-cream"
                    >
                      Print Work Order
                    </button>
                    <label className="mt-3 flex items-center justify-end gap-2 text-xs text-stone">
                      Fulfillment
                      <select
                        value={order.fulfillmentStatus}
                        disabled={busy}
                        aria-label={`Fulfillment status for ${order.id}`}
                        onChange={(event) =>
                          changeStatus(
                            order.sessionId,
                            event.target.value as FulfillmentStatus
                          )
                        }
                        className="rounded-sm border border-border bg-cream-dark px-2 py-1.5 text-xs font-medium text-charcoal disabled:opacity-50"
                      >
                        {FULFILLMENT_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {STATUS_LABEL[status]}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>

                <div className="overflow-x-auto px-5 py-4 sm:px-6">
                  <table className="w-full min-w-[980px] text-left text-sm">
                    <thead>
                      <tr className="text-[11px] font-medium uppercase tracking-[0.14em] text-stone">
                        <th className="pb-3 pr-4 font-medium">Product</th>
                        <th className="pb-3 pr-4 font-medium">Category</th>
                        <th className="pb-3 pr-4 font-medium">Width × Height</th>
                        <th className="pb-3 pr-4 font-medium">Color</th>
                        <th className="pb-3 pr-4 font-medium">Hardware</th>
                        <th className="pb-3 pr-4 font-medium">Motor</th>
                        <th className="pb-3 pr-4 font-medium">Structure</th>
                        <th className="pb-3 pr-4 font-medium">Mount</th>
                        <th className="pb-3 pr-4 font-medium">Room</th>
                        <th className="pb-3 text-right font-medium">Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, index) => (
                        <tr
                          key={`${item.slug}-${index}`}
                          className="border-t border-border text-charcoal"
                        >
                          <td className="py-3 pr-4 font-medium">{item.name}</td>
                          <td className="py-3 pr-4 text-charcoal-light">
                            {item.category}
                          </td>
                          <td className="py-3 pr-4 text-charcoal-light">
                            {item.width}&quot; W × {item.height}&quot; H
                          </td>
                          <td className="py-3 pr-4 text-charcoal-light">
                            {item.color}
                          </td>
                          <td className="py-3 pr-4 text-charcoal-light">
                            {item.hardware}
                          </td>
                          <td className="py-3 pr-4 text-charcoal-light">
                            {item.motor}
                          </td>
                          <td className="py-3 pr-4 text-charcoal-light">
                            {item.structure || "—"}
                          </td>
                          <td className="py-3 pr-4 text-charcoal-light">
                            {mountLabel(item.mountType)}
                          </td>
                          <td className="py-3 pr-4 text-charcoal-light">
                            {item.roomName?.trim() || "—"}
                          </td>
                          <td className="py-3 text-right tabular-nums">
                            {item.quantity}
                          </td>
                        </tr>
                      ))}
                      {order.items.length === 0 ? (
                        <tr className="border-t border-border">
                          <td
                            colSpan={10}
                            className="py-4 text-sm text-charcoal-light"
                          >
                            No shade specs were stored on this checkout.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
    {orders.map((order) =>
      printingId === order.sessionId ? (
        <WorkOrderSheet key={order.sessionId} order={order} />
      ) : null
    )}
    </>
  );
}
