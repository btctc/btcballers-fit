import { soundtrack } from "@/lib/soundtrack";

export default function Soundtrack() {
  return (
    <section id="soundtrack" className="max-w-6xl mx-auto px-5 py-20 scroll-mt-24">
      <div className="label text-btc-orange">BTC soundtrack</div>
      <div className="mt-4 grid md:grid-cols-[0.8fr_1.2fr] gap-10">
        <div>
          <h2 className="display text-5xl md:text-6xl">Music for the work.</h2>
          <p className="mt-6 text-btc-white/80 text-lg leading-relaxed">
            AI-made songs from the BTC Ballers world. Clean enough for the gym, the car, and the kids.
          </p>
        </div>
        <div className="grid gap-4">
          {soundtrack.map((track) => (
            <article key={track.src} className="border border-white/10 bg-btc-dim p-4">
              <div className="mb-3 flex items-center justify-between gap-4">
                <h3 className="mono text-btc-white">{track.title}</h3>
                <span className="label text-btc-orange">SFW</span>
              </div>
              <video
                className="aspect-video w-full bg-btc-black object-cover"
                controls
                poster={track.poster}
                preload="none"
                playsInline
              >
                <source src={track.src} type="video/mp4" />
              </video>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
