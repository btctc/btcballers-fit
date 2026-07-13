import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/siteConfig";

export default function Hero() {
  return (
    <section className="hero-section relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero.jpg"
          alt="Coach T on the home court with kids"
          fill
          quality={55}
          sizes="100vw"
          className="hero-bg bg-btc-black object-contain opacity-35 md:object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-btc-black/30 via-btc-black/75 to-btc-black" />
        <div className="absolute inset-0 grid-bg opacity-60" />
      </div>

      <div className="hero-content relative max-w-6xl mx-auto px-5 pt-20 pb-20 sm:pt-24 sm:pb-28 md:pt-36 md:pb-40">
        <div className="hero-kicker flex items-center gap-3 mb-6 md:mb-8">
          <div className="w-2 h-2 bg-emerald-400 rounded-full status-pulse" aria-hidden="true"></div>
          <span className="label">Fall 2026 - Dallas, TX</span>
        </div>

        <h1 className="hero-title display">
          Believe.<br />Train.<br />Compete.
        </h1>

        <p className="hero-copy mt-7 md:mt-10 max-w-xl text-lg md:text-xl text-btc-white/85 leading-relaxed">
          Basketball training in Dallas.<br />
          It&apos;s bigger than basketball.
        </p>

        <div className="hero-actions mt-8 md:mt-12 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4">
          <Link
            href="/programs"
            className="hero-action col-span-2 bg-btc-orange text-btc-black px-6 py-3 text-center font-semibold tracking-tight hover:bg-btc-white transition sm:col-auto"
          >
            See Fall 2026
          </Link>
          <a
            href={`mailto:${site.email}`}
            className="hero-action border border-white/30 px-6 py-3 text-center font-semibold hover:border-btc-orange hover:text-btc-orange transition"
          >
            Email Coach T
          </a>
          <a
            href={site.storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-action border border-btc-orange px-6 py-3 text-center font-semibold text-btc-orange hover:bg-btc-orange hover:text-btc-black transition"
          >
            Shop BTC Gear
          </a>
        </div>
      </div>
    </section>
  );
}
