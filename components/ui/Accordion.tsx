"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
}

export default function Accordion({ items }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-accent"
              aria-expanded={isOpen}
            >
              <span className="font-serif text-xl font-medium text-charcoal">
                {item.title}
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-stone transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="pb-6 text-sm leading-relaxed text-charcoal-light">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
