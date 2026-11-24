"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { sayings } from "@/lib/sayings";

const HOLD_MS = 5000;

export default function Sayings() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setI((n) => (n + 1) % sayings.length), HOLD_MS);
    return () => clearTimeout(t);
  }, [i, paused]);

  return (
    <section
      id="coach-t-says"
      className="border-y border-white/5 bg-btc-black scanline scroll-mt-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-6xl mx-auto px-5 py-20 md:py-28 text-center">
        <div className="label text-btc-orange">In Coach T&apos;s words</div>

        <button
          type="button"
          onClick={() => setI((n) => (n + 1) % sayings.length)}
          aria-label="Next saying"
          className="mt-6 flex w-full items-center justify-center min-h-[15rem] sm:min-h-[13rem] md:min-h-[16rem]"
        >
          <span key={i} aria-live="polite" className="saying-in display block max-w-4xl text-4xl sm:text-5xl md:text-7xl">
            {sayings[i]}
          </span>
        </button>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {sayings.map((s, n) => (
            <button
              key={s}
              type="button"
              onClick={() => setI(n)}
              aria-label={`Saying ${n + 1} of ${sayings.length}`}
              aria-current={n === i}
              className="p-1.5"
            >
              <span className={`block h-1.5 transition-all ${n === i ? "w-6 bg-btc-orange" : "w-1.5 bg-white/25"}`} />
            </button>
          ))}
        </div>

        <Link
          href="/programs"
          className="mt-10 inline-block bg-btc-orange text-btc-black px-5 py-3 font-semibold hover:bg-btc-white transition"
        >
          Train With Coach T
        </Link>
      </div>
    </section>
  );
}
