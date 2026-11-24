"use client";

import { useEffect, useRef } from "react";
import { sayings, voices } from "@/lib/sayings";

// One slim orange bar at the bottom of the screen, on every page. It drifts on
// its own and picks up speed as the page scrolls. The page reserves room for it
// (see --ticker-h in globals.css), so it never sits on top of other content.

const DRIFT = 48; // px per second when the page is still
const PULL = 0.3; // how much of each scrolled px carries into the bar

type Item = { text: string; by?: string };

// Coach T's lines with one outside voice after every second line.
const items: Item[] = sayings.flatMap((text, n) => {
  const voice = n % 2 === 1 ? voices[((n - 1) / 2) % voices.length] : null;
  return voice ? [{ text }, voice] : [{ text }];
});

export default function QuoteTicker() {
  const trackRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const copy = copyRef.current;
    if (!track || !copy) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let width = 0;
    let offset = 0;
    let pending = 0; // scrolled px not yet eased into the bar
    let lastY = window.scrollY;
    let lastT = 0;
    let frame = 0;

    const measure = () => {
      width = copy.getBoundingClientRect().width;
    };

    const tick = (t: number) => {
      const dt = lastT ? Math.min((t - lastT) / 1000, 0.05) : 0;
      lastT = t;
      const eased = pending * (1 - Math.exp(-dt * 9)); // frame-rate independent ease
      pending -= eased;
      offset += DRIFT * dt + eased * PULL;
      if (width) {
        const x = ((offset % width) + width) % width; // always 0..width, so the loop has no seam
        track.style.transform = `translate3d(${-x}px,0,0)`;
      }
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame || document.hidden) return;
      lastT = 0;
      lastY = window.scrollY;
      pending = 0;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const onScroll = () => {
      const y = window.scrollY;
      pending += y - lastY;
      lastY = y;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    const sizes = new ResizeObserver(measure);
    sizes.observe(copy);
    measure();
    start();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      sizes.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const content = items.map((item) => (
    <span key={item.text} className="flex items-center">
      <span className="display text-base md:text-lg tracking-wide">
        {item.by ? <>&ldquo;{item.text}&rdquo;</> : item.text}
      </span>
      {item.by ? (
        <span className="mono ml-3 text-[0.65rem] uppercase tracking-[0.18em] text-btc-black/70">{item.by}</span>
      ) : null}
      <span className="mx-6 md:mx-8 block h-1.5 w-1.5 rotate-45 bg-btc-black" />
    </span>
  ));

  return (
    <div aria-hidden="true" className="quote-ticker pointer-events-none select-none">
      <div ref={trackRef} className="quote-ticker-track flex w-max h-full items-center whitespace-nowrap">
        <div ref={copyRef} className="flex shrink-0 items-center">
          {content}
        </div>
        <div className="flex shrink-0 items-center">{content}</div>
      </div>
    </div>
  );
}
