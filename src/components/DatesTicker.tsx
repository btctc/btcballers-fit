import { watchList } from "@/lib/watchList";

export default function DatesTicker() {
  return (
    <section id="watchlist" className="border-y border-white/5 bg-btc-black overflow-hidden scanline scroll-mt-24">
      <div className="max-w-6xl mx-auto px-5 py-16 md:py-20">
        <div className="grid lg:grid-cols-[0.7fr_1.3fr] gap-8 items-end">
          <div>
            <div className="label text-btc-orange">Elite circuit watchlist</div>
            <h2 className="display text-5xl md:text-6xl mt-3">Know what is coming.</h2>
          </div>
          <p className="text-base md:text-lg leading-relaxed text-btc-white/85">
            A curated calendar for kids and parents tracking Nike EYBL, adidas 3SSB, PUMA PRO16/NXTPRO, the draft, and summer league. Not a live feed yet, but every card points to where to watch or follow.
          </p>
        </div>
      </div>

      <div className="ticker-viewport border-t border-white/5 pb-16">
        <div className="ticker-track py-6">
          {watchList.map((item) => (
            <a
              key={`${item.circuit}-${item.title}-${item.date}`}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-[18rem] md:w-[24rem] shrink-0 snap-start border border-white/10 bg-btc-dim p-5 hover:border-btc-orange transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="mono text-btc-orange text-lg">{item.date}</div>
                <div className="label group-hover:text-btc-orange transition">{item.circuit}</div>
              </div>
              <h3 className="mt-5 text-xl md:text-2xl font-bold leading-tight text-btc-white tracking-tight">{item.title}</h3>
              <div className="mt-2 mono text-sm text-btc-white/62">{item.location}</div>
              <p className="mt-3 text-base leading-relaxed text-btc-white/76 group-hover:text-btc-white/90 transition">
                {item.note}
              </p>
              <div className="mt-5 label text-btc-orange">Watch: {item.watch}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
