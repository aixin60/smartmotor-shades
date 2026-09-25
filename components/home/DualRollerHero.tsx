"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Moon, Sun } from "lucide-react";

export default function DualRollerHero() {
  const [isDayMode, setIsDayMode] = useState(true);
  const [blackoutPosition, setBlackoutPosition] = useState(30);
  const [filterPosition, setFilterPosition] = useState(60);

  const adjustShade = (shade: "blackout" | "filter", direction: "up" | "down") => {
    const delta = direction === "up" ? -8 : 8;
    if (shade === "blackout") {
      setBlackoutPosition((prev) => Math.min(95, Math.max(5, prev + delta)));
    } else {
      setFilterPosition((prev) => Math.min(95, Math.max(5, prev + delta)));
    }
  };

  return (
    <section className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col items-center justify-center px-6 py-12">
              <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-stone">
            Signature Collection
          </p>
          <h1 className="font-serif text-4xl font-medium tracking-tight text-charcoal md:text-5xl">
            Motorized Dual Roller Shades
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-charcoal-light">
            Seamlessly switch between natural light and total privacy. Dual smart motors, ultra-quiet performance.
          </p>
        </div>

      <div className="flex w-full items-center justify-center gap-6 md:gap-10">
        {/* Day / Night Toggle */}
        <div className="flex shrink-0 flex-col items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-wider text-stone">
            Day / Night
          </span>
          <button
            type="button"
            onClick={() => setIsDayMode((prev) => !prev)}
            className="flex h-24 w-12 flex-col items-center justify-between rounded-full border border-border bg-cream-dark p-2 transition-colors hover:border-stone"
            aria-label={isDayMode ? "Switch to night mode" : "Switch to day mode"}
          >
            <Sun
              className={`h-4 w-4 transition-opacity ${
                isDayMode ? "text-accent opacity-100" : "text-stone-light opacity-40"
              }`}
            />
            <div
              className={`h-5 w-5 rounded-full transition-all duration-300 ${
                isDayMode ? "translate-y-0 bg-accent" : "translate-y-8 bg-charcoal"
              }`}
            />
            <Moon
              className={`h-4 w-4 transition-opacity ${
                !isDayMode ? "text-accent opacity-100" : "text-stone-light opacity-40"
              }`}
            />
          </button>
        </div>

        {/* Window Visualization */}
        <div className="relative aspect-[3/4] w-full max-w-md overflow-hidden rounded-sm border-2 border-charcoal/15 bg-charcoal/5 shadow-lg">
          {/* Nature View Layer */}
          <div
            className={`absolute inset-0 transition-all duration-700 ${
              isDayMode
                ? "bg-gradient-to-b from-sky-200/80 via-emerald-100/60 to-emerald-200/80"
                : "bg-gradient-to-b from-slate-800 via-indigo-950 to-slate-900"
            }`}
          >
            <div className="absolute inset-x-0 bottom-0 h-1/3">
              <div
                className={`mx-auto h-full w-3/4 rounded-t-full transition-colors duration-700 ${
                  isDayMode ? "bg-emerald-400/40" : "bg-indigo-400/20"
                }`}
              />
            </div>
            <p
              className={`absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-medium tracking-wide transition-colors duration-700 ${
                isDayMode ? "text-emerald-700" : "text-indigo-300"
              }`}
            >
              Nature View
            </p>
          </div>

          {/* Filtering Shade Layer */}
          <div
            className="absolute inset-x-0 top-0 border-b border-charcoal/10 bg-beige/70 backdrop-blur-[2px] transition-all duration-500"
            style={{ height: `${filterPosition}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-beige/90 to-beige-dark/80" />
            <p className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium uppercase tracking-wider text-charcoal-light">
              Filtering Shade
            </p>
          </div>

          {/* Blackout Shade Layer */}
          <div
            className="absolute inset-x-0 top-0 border-b border-charcoal/20 bg-charcoal/85 transition-all duration-500"
            style={{ height: `${blackoutPosition}%` }}
          >
            <p className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium uppercase tracking-wider text-cream/70">
              Blackout Shade
            </p>
          </div>

          {/* Window Frame */}
          <div className="pointer-events-none absolute inset-0 border-[3px] border-charcoal/20" />
        </div>

        {/* Remote Control */}
        <div className="flex shrink-0 flex-col items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-wider text-stone">
            Remote
          </span>
          <div className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-cream-dark px-3 py-4 shadow-sm">
            <button
              type="button"
              onClick={() => adjustShade("blackout", "up")}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-cream transition-colors hover:border-stone hover:bg-beige"
              aria-label="Raise blackout shade"
            >
              <ChevronUp className="h-4 w-4 text-charcoal" />
            </button>
            <div className="my-1 flex h-16 w-10 flex-col items-center justify-center rounded-lg border border-border bg-cream">
              <span className="text-[9px] font-medium uppercase tracking-wider text-stone">
                Up
              </span>
              <div className="my-1 h-6 w-1 rounded-full bg-border" />
              <span className="text-[9px] font-medium uppercase tracking-wider text-stone">
                Down
              </span>
            </div>
            <button
              type="button"
              onClick={() => adjustShade("blackout", "down")}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-cream transition-colors hover:border-stone hover:bg-beige"
              aria-label="Lower blackout shade"
            >
              <ChevronDown className="h-4 w-4 text-charcoal" />
            </button>
            <div className="my-2 h-px w-full bg-border" />
            <button
              type="button"
              onClick={() => adjustShade("filter", "up")}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border/60 bg-cream text-[10px] transition-colors hover:border-stone"
              aria-label="Raise filtering shade"
            >
              <ChevronUp className="h-3 w-3 text-stone" />
            </button>
            <span className="text-[8px] font-medium uppercase tracking-wider text-stone-light">
              Filter
            </span>
            <button
              type="button"
              onClick={() => adjustShade("filter", "down")}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border/60 bg-cream text-[10px] transition-colors hover:border-stone"
              aria-label="Lower filtering shade"
            >
              <ChevronDown className="h-3 w-3 text-stone" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10 flex items-center gap-2 text-stone">
        <ChevronDown className="h-4 w-4 animate-bounce" />
        <span className="text-xs font-medium uppercase tracking-wider">
          Explore the collection
        </span>
      </div>
    </section>
  );
}
