import { formatOrderMoney, type Order } from "@/lib/order-model";
import { siteConfig } from "@/lib/site";

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

export default function WorkOrderSheet({ order }: { order: Order }) {
  const address = order.shippingAddress;
  const cityLine = [address.city, address.state].filter(Boolean).join(", ");
  const region = [cityLine, address.postalCode].filter(Boolean).join(" ");

  return (
    <section className="hidden bg-white px-8 py-10 text-black print:block">
      <header className="flex items-end justify-between border-b-2 border-black pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em]">
            {siteConfig.brandName} factory
          </p>
          <h1 className="mt-1 text-3xl font-bold">Work order {order.id}</h1>
        </div>
        <p className="text-sm">{formatWhen(order.createdAt)}</p>
      </header>

      <div className="mt-5 grid grid-cols-2 gap-6 text-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider">
            Ship to
          </p>
          <p className="mt-1 font-semibold">{order.customerName || address.name}</p>
          <p>{order.email}</p>
          <p>{order.phone}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider">
            Shipping address
          </p>
          <p className="mt-1">{address.line1}</p>
          {address.line2 ? <p>{address.line2}</p> : null}
          <p>{region}</p>
          <p>{address.country}</p>
        </div>
      </div>

      {order.specsConfirmedAt ? (
        <p className="mt-4 text-sm font-semibold">
          Specs confirmed {formatWhen(order.specsConfirmedAt)}
        </p>
      ) : null}

      <table className="mt-6 w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b-2 border-black text-xs uppercase tracking-wider">
            <th className="py-2 pr-3 font-bold">Width × Height</th>
            <th className="py-2 pr-3 font-bold">Category</th>
            <th className="py-2 pr-3 font-bold">Color</th>
            <th className="py-2 pr-3 font-bold">Hardware</th>
            <th className="py-2 pr-3 font-bold">Motor</th>
            <th className="py-2 pr-3 font-bold">Structure</th>
            <th className="py-2 pr-3 font-bold">Mount</th>
            <th className="py-2 pr-3 font-bold">Room / Window</th>
            <th className="py-2 text-right font-bold">Qty</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, index) => (
            <tr key={`${item.slug}-${index}`} className="border-b border-black">
              <td className="py-2 pr-3 text-base font-bold">
                {item.width}&quot; W × {item.height}&quot; H
              </td>
              <td className="py-2 pr-3 font-semibold">{item.category}</td>
              <td className="py-2 pr-3 font-semibold">{item.color}</td>
              <td className="py-2 pr-3 font-semibold">{item.hardware}</td>
              <td className="py-2 pr-3 font-semibold">{item.motor}</td>
              <td className="py-2 pr-3 font-semibold">{item.structure || "—"}</td>
              <td className="py-2 pr-3 font-semibold">{mountLabel(item.mountType)}</td>
              <td className="py-2 pr-3 text-base font-bold">
                {item.roomName?.trim() || "—"}
              </td>
              <td className="py-2 text-right text-base font-bold tabular-nums">
                {item.quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-4 text-right text-sm font-semibold">
        Order total {formatOrderMoney(order.totalAmount, order.currency)}
      </p>
    </section>
  );
}
