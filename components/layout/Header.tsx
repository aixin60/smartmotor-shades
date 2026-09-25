import Link from "next/link";
import { ChevronDown } from "lucide-react";
import CartLink from "@/components/layout/CartLink";

const navLinks: { href: string; label: string; hasDropdown?: boolean }[] = [
  { href: "/", label: "Home" },
  { href: "/collections", label: "Products", hasDropdown: true },
  { href: "/help", label: "Help" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        
        {/* 新的 SmartMotor Logo */}
        <Link href="/" className="flex items-center text-xl tracking-wide text-charcoal transition-opacity hover:opacity-80">
          <span className="font-bold">Smart</span>
          <span className="font-light">Motor</span>
        </Link>

        <nav className="flex items-center gap-8">
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

        <CartLink />
      </div>
    </header>
  );
}