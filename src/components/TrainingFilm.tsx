import Link from "next/link";
import YouTubeEmbed from "@/components/YouTubeEmbed";

export default function TrainingFilm() {
  return (
    <section id="training-film" className="border-y border-white/5 bg-btc-black scroll-mt-24">
      <div className="max-w-6xl mx-auto px-5 py-20 md:py-28 grid lg:grid-cols-[0.92fr_1.08fr] gap-10 lg:gap-12 items-center">
        <div>
          <div className="label text-btc-orange">Inside BTC Ballers</div>
          <h2 className="display text-5xl md:text-6xl mt-4">The full program.</h2>
          <div className="mt-7 space-y-5 text-lg leading-relaxed text-btc-white/84">
            <p>
              BTC Ballers is more than a workout. This is the full range: basketball reps,
              strength work, conditioning, recovery, stretching through Twister, book reads,
              board games, food, and discovery.
            </p>
            <p>
              The goal is to build players who can think, compete, recover, communicate, and
              grow. The basketball matters. The person inside the player matters just as much.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/programs"
              className="bg-btc-orange text-btc-black px-5 py-3 font-semibold hover:bg-btc-white transition"
            >
              See Programs
            </Link>
            <Link
              href="/contact"
              className="border border-white/20 px-5 py-3 font-semibold hover:border-btc-orange hover:text-btc-orange transition"
            >
              Ask Coach T
            </Link>
          </div>
        </div>

        <div className="border border-white/10 bg-btc-black p-3 md:p-4">
          <YouTubeEmbed videoId="X4NFJrl70TM" title="BTC Ballers full program training video" />
        </div>
      </div>
    </section>
  );
}
