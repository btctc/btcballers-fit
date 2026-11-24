"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { sayings, voices } from "@/lib/sayings";

// Two ribbons of type that drift on their own and pick up speed with the page
// scroll. They live inside this section only: nothing is pinned, nothing
// overlaps other content, and they never intercept a tap or a scroll.

type RowConfig = {
  dir: 1 | -1; // 1 drifts left, -1 drifts right
  drift: number; // px per second when the page is still
  pull: number; // how much of each scrolled px carries into the ribbon
};

const ROWS: RowConfig[] = [
  { dir: 1, drift: 70, pull: 0.42 },
  { dir: -1, drift: 45, pull: 0.28 },
];

export default function Sayings() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const copyRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const widths = ROWS.map(() => 0);
    const offsets = ROWS.map(() => 0);
    let pending = 0; // scrolled px not yet eased into the ribbons
    let lastY = window.scrollY;
    let lastT = 0;
    let frame = 0;
    let visible = false;

    const measure = () => {
      copyRefs.current.forEach((el, n) => {
        if (el) widths[n] = el.getBoundingClientRect().width;
      });
    };

    const paint = () => {
      ROWS.forEach((row, n) => {
        const w = widths[n];
        const track = trackRefs.current[n];
        if (!w || !track) return;
        const x = ((offsets[n] % w) + w) % w; // always 0..w, so the loop never shows a seam
        track.style.transform = `translate3d(${-x}px,0,0)`;
      });
    };

    const tick = (t: number) => {
      const dt = lastT ? Math.min((t - lastT) / 1000, 0.05) : 0;
      lastT = t;
      // Ease the scroll in over a few frames, frame-rate independent.
      const eased = pending * (1 - Math.exp(-dt * 9));
      pending -= eased;
      ROWS.forEach((row, n) => {
        offsets[n] += row.dir * (row.drift * dt + eased * row.pull);
      });
      paint();
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame || !visible || document.hidden) return;
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

    const sizes = new ResizeObserver(() => {
      measure();
      paint();
    });
    copyRefs.current.forEach((el) => el && sizes.observe(el));

    const inView = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { rootMargin: "120px 0px" }
    );
    inView.observe(section);

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      sizes.disconnect();
      inView.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const coachRow = (
    <>
      {sayings.map((s) => (
        <span key={s} className="flex items-center">
          <span className="display text-4xl sm:text-6xl md:text-8xl">{s}</span>
          <span className="mx-8 md:mx-12 block h-2.5 w-2.5 md:h-3.5 md:w-3.5 rotate-45 bg-btc-orange" />
        </span>
      ))}
    </>
  );

  const voicesRow = (
    <>
      {voices.map((v) => (
        <span key={v.text} className="flex items-baseline">
          <span className="text-xl sm:text-2xl md:text-3xl font-light tracking-tight text-btc-white/75">
            &ldquo;{v.text}&rdquo;
          </span>
          <span className="label ml-4 text-btc-orange">{v.by}</span>
          <span className="mx-8 md:mx-12 block h-px w-10 md:w-16 self-center bg-white/20" />
        </span>
      ))}
    </>
  );

  const rows = [coachRow, voicesRow];

  return (
    <section
      ref={sectionRef}
      id="coach-t-says"
      className="border-y border-white/5 bg-btc-black scanline scroll-mt-24 overflow-hidden"
    >
      <div className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-5">
          <div className="label text-btc-orange">In Coach T&apos;s words</div>
        </div>

        {/* Screen readers get the lines once, as a plain list. */}
        <ul className="sr-only">
          {sayings.map((s) => (
            <li key={s}>{s}</li>
          ))}
          {voices.map((v) => (
            <li key={v.text}>
              {v.text} {v.by}
            </li>
          ))}
        </ul>

        <div aria-hidden="true" className="sayings-ribbons pointer-events-none select-none">
          {rows.map((content, n) => (
            <div key={n} className={n === 0 ? "mt-8 md:mt-10" : "mt-8 md:mt-12"}>
              {n === 1 ? (
                <div className="max-w-6xl mx-auto px-5 mb-5">
                  <div className="label">Voices we study</div>
                </div>
              ) : null}
              <div className="sayings-row">
                <div
                  ref={(el) => {
                    trackRefs.current[n] = el;
                  }}
                  className="sayings-track flex w-max whitespace-nowrap"
                >
                  <div
                    ref={(el) => {
                      copyRefs.current[n] = el;
                    }}
                    className="flex shrink-0 items-center"
                  >
                    {content}
                  </div>
                  <div className="flex shrink-0 items-center">{content}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-6xl mx-auto px-5 mt-12 md:mt-16">
          <Link
            href="/programs"
            className="inline-block bg-btc-orange text-btc-black px-5 py-3 font-semibold hover:bg-btc-white transition"
          >
            Train With Coach T
          </Link>
        </div>
      </div>
    </section>
  );
}
