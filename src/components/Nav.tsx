import Link from "next/link";
import Image from "next/image";

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-btc-black/85 backdrop-blur">
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between gap-5">
        <Link href="/" className="flex items-center gap-3 logo-sway shrink-0">
          <Image src="/logo.png" alt="BTC Ballers" width={140} height={56} priority className="h-auto w-28 md:w-[140px]" />
        </Link>

        <nav className="flex items-center gap-3 md:gap-8 text-sm md:text-base">
          <Link href="/programs" className="whitespace-nowrap hover:text-btc-orange transition">Programs</Link>
          <Link href="/about" className="whitespace-nowrap hover:text-btc-orange transition">Coach T</Link>
          <Link href="/contact" className="whitespace-nowrap hover:text-btc-orange transition">Contact</Link>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full status-pulse"></div>
          <span className="label">Summer 2026 - Booking</span>
        </div>
      </div>
    </header>
  );
}
