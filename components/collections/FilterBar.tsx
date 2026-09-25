"use client";

export default function FilterBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6 pt-2">
      <div className="flex flex-wrap items-center gap-4">
        <button className="flex items-center gap-2 rounded-sm border border-border bg-cream px-4 py-2 text-sm text-charcoal transition-colors hover:bg-cream-dark">
          Black Level
          <span className="text-[10px]">▼</span>
        </button>
        <button className="flex items-center gap-2 rounded-sm border border-border bg-cream px-4 py-2 text-sm text-charcoal transition-colors hover:bg-cream-dark">
          Features
          <span className="text-[10px]">▼</span>
        </button>
        <button className="rounded-sm border border-border bg-cream px-4 py-2 text-sm text-charcoal transition-colors hover:bg-cream-dark">
          Price
        </button>
        <button className="rounded-sm border border-border bg-cream px-4 py-2 text-sm text-charcoal transition-colors hover:bg-cream-dark">
          Best Selling
        </button>
      </div>

      <div className="flex items-center gap-2 rounded-sm border border-border bg-cream p-1">
        <button className="rounded-sm bg-cream-dark px-2 py-1 text-charcoal">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M1 1H7V7H1V1Z" />
            <path d="M9 1H15V7H9V1Z" />
            <path d="M1 9H7V15H1V9Z" />
            <path d="M9 9H15V15H9V9Z" />
          </svg>
        </button>
        <button className="rounded-sm px-2 py-1 text-charcoal-light hover:text-charcoal">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M1 2H15V4H1V2Z" />
            <path d="M1 7H15V9H1V7Z" />
            <path d="M1 12H15V14H1V12Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
