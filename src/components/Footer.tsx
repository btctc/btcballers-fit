import { site } from "@/lib/siteConfig";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-24">
      <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div>
          <div className="display text-3xl md:text-4xl">{site.tagline}</div>
          <div className="label text-btc-orange mt-3">Dallas, TX</div>
        </div>
        <div className="text-sm text-btc-white/60">
          <a href={`mailto:${site.email}`} className="hover:text-btc-orange transition">
            {site.email}
          </a>
          <div className="mt-3">
            <a href={site.storeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-btc-orange transition">
              Shop BTC Ballers gear
            </a>
          </div>
          <div className="mt-3 label">AI infrastructure by Organic AI Solutions</div>
        </div>
      </div>
    </footer>
  );
}
