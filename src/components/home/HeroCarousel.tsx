"use client";
/** Hero slider: auto-advances, pauses on hover, has arrows and dots. */
import { useEffect, useState } from "react";
import type { Dictionary } from "@/i18n/getDictionary";

// Each slide gets its own green gradient. Swap for real photos later.
const backgrounds = [
  "from-brand-900 via-brand-700 to-brand-500",
  "from-brand-800 via-brand-600 to-lime/70",
  "from-pitch via-brand-800 to-brand-400",
];

export default function HeroCarousel({ dict }: { dict: Dictionary["hero"] }) {
  const slides = dict.slides;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [paused, slides.length]);

  const go = (n: number) => setIndex((n + slides.length) % slides.length);

  return (
    <section
      className="relative overflow-hidden text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {slides.map((s, i) => (
        <div
          key={i}
          aria-hidden={i !== index}
          className={`bg-gradient-to-br ${backgrounds[i % backgrounds.length]} px-4 py-24 md:py-32 ${
            i === index ? "block" : "hidden"
          }`}
        >
          <div className="mx-auto max-w-6xl">
            <h1 className="font-display max-w-2xl text-4xl font-bold leading-tight md:text-6xl">{s.title}</h1>
            <p className="mt-4 max-w-xl text-lg text-brand-50">{s.text}</p>
            <button className="mt-8 rounded-full bg-lime px-6 py-3 font-semibold text-pitch hover:bg-white">
              {s.cta}
            </button>
          </div>
        </div>
      ))}

      <button onClick={() => go(index - 1)} aria-label={dict.prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 px-3 py-2 hover:bg-black/50">‹</button>
      <button onClick={() => go(index + 1)} aria-label={dict.next}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 px-3 py-2 hover:bg-black/50">›</button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => go(i)} aria-label={`${dict.goTo} ${i + 1}`}
            aria-current={i === index}
            className={`h-2.5 rounded-full transition-all ${i === index ? "w-8 bg-lime" : "w-2.5 bg-white/60"}`} />
        ))}
      </div>
    </section>
  );
}
