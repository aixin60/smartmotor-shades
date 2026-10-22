import Link from "next/link";
import { SITE } from "@/lib/site";

const shopLinks = [
  { href: "/collections/roller", label: "Roller" },
  { href: "/collections/cellular", label: "Cellular" },
  { href: "/collections/zebra", label: "Zebra" },
  { href: "/collections/drapery", label: "Drapery" },
];

const supportLinks = [
  { href: "/help", label: "Help Center" },
  { href: "/help", label: "Measuring Guide" },
  { href: "/help", label: "Shipping & Warranty" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border print:hidden">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:grid-cols-3 lg:px-8">
        <div>
          <p className="font-serif text-xl text-charcoal">{SITE.name}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-charcoal-light">
            Motorized custom shades, made to your exact measurements.
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-stone">
            Shop
          </p>
          <ul className="mt-4 space-y-2">
            {shopLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-charcoal-light transition-colors hover:text-charcoal"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-stone">
            Support
          </p>
          <ul className="mt-4 space-y-2">
            {supportLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-charcoal-light transition-colors hover:text-charcoal"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${SITE.supportEmail}`}
                className="text-sm text-charcoal-light transition-colors hover:text-charcoal"
              >
                {SITE.supportEmail}
              </a>
            </li>
            {SITE.supportPhone ? (
              <li>
                <a
                  href={`tel:${SITE.supportPhone}`}
                  className="text-sm text-charcoal-light transition-colors hover:text-charcoal"
                >
                  {SITE.supportPhone}
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-6 py-4 text-xs text-stone lg:px-8">
          © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
