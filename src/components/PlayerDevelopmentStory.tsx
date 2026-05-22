export default function PlayerDevelopmentStory() {
  return (
    <section id="keaton-story" className="border-y border-white/5 bg-btc-black scanline scroll-mt-24">
      <div className="max-w-6xl mx-auto px-5 py-20 md:py-28 grid lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-12 items-center">
        <div>
          <div className="label text-btc-orange">Behind the work</div>
          <h2 className="display text-5xl md:text-6xl mt-4">
            Before the world knew.
          </h2>
          <div className="mt-7 space-y-5 text-lg leading-relaxed text-btc-white/84">
            <p>
              Keaton was hardly recruited as a senior. This workout happened before his freshman year
              at Illinois with Victor Williams, my Oklahoma State teammate.
            </p>
            <p>
              Keaton and Vic started working together when Keaton was in middle school. Nobody in this
              video knew the year ahead: a Final Four run, the NBA Draft process, Summer League, and the
              next stage of his career.
            </p>
            <p>
              That is the lesson for our kids. Development is quiet before it is public. The work comes
              first, then the world catches up.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#watchlist"
              className="bg-btc-orange text-btc-black px-5 py-3 font-semibold hover:bg-btc-white transition"
            >
              Follow the Watchlist
            </a>
            <a
              href="/programs"
              className="border border-white/20 px-5 py-3 font-semibold hover:border-btc-orange hover:text-btc-orange transition"
            >
              Train With Coach T
            </a>
          </div>
        </div>

        <div className="border border-white/10 bg-btc-dim p-3 md:p-4">
          <video
            className="aspect-video w-full bg-btc-black object-cover"
            controls
            poster="/videos/posters/keaton-workout.jpg"
            preload="metadata"
            playsInline
          >
            <source src="/videos/keaton-workout.m4v" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}
