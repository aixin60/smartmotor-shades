import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import HelpAccordion from "@/components/help/HelpAccordion";
import { siteConfig } from "@/lib/site";

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8 lg:py-16">
      <div className="mb-12 text-center">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-stone">
          Customer Support
        </p>
        <h1 className="font-serif text-4xl font-medium text-charcoal">
          Help Center
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-charcoal-light">
          Find answers to common questions about measuring, shipping,
          installation, and our warranty policy. Our team is here to assist you
          at every step.
        </p>
      </div>

      <HelpAccordion />

      <div className="mt-16 rounded-sm border border-border bg-cream-dark p-8">
        <h2 className="font-serif text-2xl font-medium text-charcoal">
          Still need assistance?
        </h2>
        <p className="mt-2 text-sm text-charcoal-light">
          Our North American support team is available Monday through Friday,
          9:00 AM – 6:00 PM EST.
        </p>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:gap-8">
          <a
            href={`mailto:${siteConfig.supportEmail}`}
            className="flex items-center gap-2 text-sm text-charcoal transition-colors hover:text-accent"
          >
            <Mail className="h-4 w-4 text-stone" />
            {siteConfig.supportEmail}
          </a>
          {siteConfig.supportPhone ? (
            <a
              href={`tel:${siteConfig.supportPhone}`}
              className="flex items-center gap-2 text-sm text-charcoal transition-colors hover:text-accent"
            >
              <Phone className="h-4 w-4 text-stone" />
              {siteConfig.supportPhone}
            </a>
          ) : null}
        </div>
        <Link
          href="/collections"
          className="mt-8 inline-block text-sm font-medium text-charcoal underline decoration-border underline-offset-4 transition-colors hover:text-accent"
        >
          Browse our collections
        </Link>
      </div>
    </div>
  );
}
