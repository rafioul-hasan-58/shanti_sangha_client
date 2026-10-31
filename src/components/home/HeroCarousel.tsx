"use client";

/** Hero slider: auto-advances, pauses on hover, smooth crossfade with photography background. */
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/i18n/getDictionary";

const slideImages = [
  "/images/hero/slide1.jpg",
  "/images/hero/slide2.jpg",
  "/images/hero/slide3.jpg",
];

export default function HeroCarousel({ dict }: { dict: Dictionary["hero"] }) {
  const slides = dict.slides;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, [paused, slides.length]);

  const go = (n: number) => setIndex((n + slides.length) % slides.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    if (distance > 45) go(index + 1); // Swiped left -> next
    if (distance < -45) go(index - 1); // Swiped right -> prev
  };

  return (
    <section
      className="relative h-[480px] sm:h-[540px] md:h-[620px] overflow-hidden text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
    >
      {/* Slides */}
      {slides.map((s, i) => {
        const imageSrc = slideImages[i % slideImages.length];
        const isActive = i === index;

        return (
          <div
            key={i}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={imageSrc}
                alt={s.title}
                fill
                priority={i === 0}
                className={`object-cover object-center transition-transform duration-[6000ms] ease-out ${
                  isActive ? "scale-105" : "scale-100"
                }`}
              />
              {/* Cinematic Gradient Overlays: Darker at top for text readability, clear in center/bottom so faces are fully visible */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/30 to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
            </div>

            {/* Slide Content positioned at the TOP so faces remain clearly visible */}
            <div className="relative mx-auto flex h-full max-w-7xl items-start pt-4 sm:pt-6 md:pt-8 px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl">
                <span className="inline-block bg-[#006a4e]/90 text-white font-extrabold text-[11px] sm:text-xs uppercase px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-sm tracking-widest mb-1.5 sm:mb-2.5 border border-white/20 backdrop-blur-sm shadow-sm">
                  Shavarchala Shanti Sangha
                </span>
                <h1 className="font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl text-white drop-shadow-md">
                  {s.title}
                </h1>
                <p className="mt-1.5 sm:mt-2.5 max-w-xl text-xs sm:text-base md:text-lg text-white/95 leading-normal sm:leading-relaxed font-sans drop-shadow-sm">
                  {s.text}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows (Hidden on mobile mode, visible on tablet/desktop) */}
      <button
        type="button"
        onClick={() => go(index - 1)}
        aria-label={dict.prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden sm:flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white border border-white/20 backdrop-blur-sm hover:bg-white hover:text-[#006a4e] transition-all shadow-md focus:outline-none"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => go(index + 1)}
        aria-label={dict.next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden sm:flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white border border-white/20 backdrop-blur-sm hover:bg-white hover:text-[#006a4e] transition-all shadow-md focus:outline-none"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go(i)}
            aria-label={`${dict.goTo} ${i + 1}`}
            aria-current={i === index}
            className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none ${
              i === index ? "w-8 bg-white shadow-sm" : "w-2.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
