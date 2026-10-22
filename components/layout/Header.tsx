import Link from "next/link";
import { ChevronDown } from "lucide-react";
import CartLink from "@/components/layout/CartLink";
import { siteConfig } from "@/lib/site";

const navLinks: { href: string; label: string; hasDropdown?: boolean }[] = [
  { href: "/", label: "Home" },
  { href: "/collections", label: "Products", hasDropdown: true },
  { href: "/help", label: "Help" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-cream/95 backdrop-blur-sm print:hidden">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-6 lg:px-8">
        <Link href="/" className="justify-self-start text-xl font-medium tracking-wide text-charcoal transition-opacity hover:opacity-80">
          {siteConfig.brandName}
        </Link>

        <nav className="flex items-center justify-self-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center gap-1 text-sm font-medium text-charcoal-light transition-colors hover:text-charcoal"
            >
              {link.label}
              {link.hasDropdown && (
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              )}
            </Link>
          ))}
        </nav>

        <div className="justify-self-end flex items-center">
          <CartLink />
        </div>
      </div>
    </header>
  );
}