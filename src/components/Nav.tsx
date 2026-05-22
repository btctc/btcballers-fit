import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/siteConfig";

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-btc-black/85 backdrop-blur">
      <div className="max-w-6xl mx-auto px-3 sm:px-5 py-4 flex items-center justify-between gap-3 md:gap-5">
        <Link href="/" className="flex items-center gap-3 logo-sway shrink-0">
          <Image src="/logo.png" alt="BTC Ballers" width={140} height={56} priority className="h-auto w-20 sm:w-28 md:w-[140px]" />
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3 md:gap-8 text-[11px] sm:text-xs md:text-base">
          <Link href="/programs" className="whitespace-nowrap hover:text-btc-orange transition">Programs</Link>
          <Link href="/playbook" className="whitespace-nowrap hover:text-btc-orange transition">Playbook</Link>
          <Link href="/about" className="whitespace-nowrap hover:text-btc-orange transition">
            <span className="sm:hidden">Coach</span>
            <span className="hidden sm:inline">Coach T</span>
          </Link>
          <a href={site.storeUrl} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap hover:text-btc-orange transition">Shop</a>
          <Link href="/contact" className="whitespace-nowrap hover:text-btc-orange transition">Contact</Link>
        </nav>

        <Link href="/programs" className="hidden md:flex items-center gap-2 hover:text-btc-orange transition" aria-label="Summer 2026 booking">
          <div className="w-2 h-2 bg-emerald-400 rounded-full status-pulse" aria-hidden="true"></div>
          <span className="label">Summer 2026 - Booking</span>
        </Link>
      </div>
    </header>
  );
}
