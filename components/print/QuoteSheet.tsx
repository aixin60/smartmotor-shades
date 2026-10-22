import { formatDimensions, hardwareLabel } from "@/lib/cart";
import { siteConfig } from "@/lib/site";

export interface QuoteLine {
  name: string;
  category: string;
  color: string;
  width: string;
  height: string;
  hardware?: string;
  motor: string;
  mountType?: string;
  roomName?: string;
  quantity: number;
  price: number;
}

function money(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

function mountLabel(mountType?: string): string {
  if (mountType === "inside") return "Inside Mount";
  if (mountType === "outside") return "Outside Mount";
  return mountType?.trim() || "—";
}

export default function QuoteSheet({
  items,
  total,
}: {
  items: QuoteLine[];
  total: number;
}) {
  const issued = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(new Date());

  return (
    <section className="hidden bg-white px-8 py-10 text-black print:block">
      <header className="flex items-end justify-between border-b border-black pb-4">
        <div>
          <p className="text-2xl font-medium tracking-wide">{siteConfig.brandName}</p>
          <p className="mt-1 text-sm">Custom shade quote</p>
        </div>
        <p className="text-sm">{issued}</p>
      </header>

      <table className="mt-6 w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-black text-xs uppercase tracking-wider">
            <th className="py-2 pr-3 font-semibold">Item</th>
            <th className="py-2 pr-3 font-semibold">Category</th>
            <th className="py-2 pr-3 font-semibold">Width × Height</th>
            <th className="py-2 pr-3 font-semibold">Color</th>
            <th className="py-2 pr-3 font-semibold">Hardware</th>
            <th className="py-2 pr-3 font-semibold">Motor</th>
            <th className="py-2 pr-3 font-semibold">Mount</th>
            <th className="py-2 pr-3 font-semibold">Room</th>
            <th className="py-2 pr-3 text-right font-semibold">Qty</th>
            <th className="py-2 text-right font-semibold">Unit price</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={`${item.name}-${index}`} className="border-b border-neutral-300">
              <td className="py-2 pr-3 font-medium">{item.name}</td>
              <td className="py-2 pr-3">{item.category}</td>
              <td className="py-2 pr-3">
                {formatDimensions(item.width.replace(/"$/, ""), item.height.replace(/"$/, ""))}
              </td>
              <td className="py-2 pr-3">{item.color}</td>
              <td className="py-2 pr-3">{hardwareLabel(item.hardware) ?? "Standard"}</td>
              <td className="py-2 pr-3">{item.motor}</td>
              <td className="py-2 pr-3">{mountLabel(item.mountType)}</td>
              <td className="py-2 pr-3">{item.roomName?.trim() || "—"}</td>
              <td className="py-2 pr-3 text-right tabular-nums">{item.quantity}</td>
              <td className="py-2 text-right tabular-nums">{money(item.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-4 text-right text-base font-semibold">
        Estimated total {money(total)}
      </p>
      <p className="mt-6 max-w-xl text-xs leading-relaxed">
        Shipping and tax are calculated at checkout. Custom shades are
        manufactured to the dimensions on this quote.
      </p>
    </section>
  );
}
