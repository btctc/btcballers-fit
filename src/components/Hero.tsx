import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/siteConfig";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero.jpg"
          alt="Coach T on the home court with kids"
          fill
          quality={55}
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-btc-black/30 via-btc-black/75 to-btc-black" />
        <div className="absolute inset-0 grid-bg opacity-60" />
      </div>

      <div className="relative max-w-6xl mx-auto px-5 pt-24 pb-28 md:pt-36 md:pb-40">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-2 bg-emerald-400 rounded-full status-pulse" aria-hidden="true"></div>
          <span className="label">Summer 2026 - Dallas, TX</span>
        </div>

        <h1 className="display text-7xl md:text-9xl">
          Believe.<br />Train.<br />Compete.
        </h1>

        <p className="mt-10 max-w-xl text-lg md:text-xl text-btc-white/85 leading-relaxed">
          Basketball training in Dallas.<br />
          It&apos;s bigger than basketball.
        </p>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/programs"
            className="bg-btc-orange text-btc-black px-6 py-3 font-semibold tracking-tight hover:bg-btc-white transition"
          >
            See Summer 2026
          </Link>
          <a
            href={`mailto:${site.email}`}
            className="border border-white/30 px-6 py-3 font-semibold hover:border-btc-orange hover:text-btc-orange transition"
          >
            Email Coach T
          </a>
        </div>
      </div>
    </section>
  );
}
