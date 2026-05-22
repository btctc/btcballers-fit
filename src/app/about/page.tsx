import Image from "next/image";
import { site } from "@/lib/siteConfig";

export const metadata = { title: "Coach T - BTC Ballers" };

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-5 py-20">
      <div className="label text-btc-orange">About</div>
      <h1 className="display text-6xl md:text-8xl mt-3">Coach T.</h1>

      <div className="mt-12 relative aspect-[4/3] w-full">
        <Image
          src="/images/coach-t.jpg"
          alt="Coach T 1-on-1 with a kid on the court"
          fill
          sizes="(min-width: 768px) 896px, 100vw"
          className="object-cover"
          priority
        />
      </div>

      <div className="mt-16 space-y-6 text-lg text-btc-white/85 leading-relaxed max-w-2xl">
        <p>My name is Terrence. The kids call me Coach T.</p>
        <p>
          I coach basketball in Dallas on my own court. Basketball has been part of my life as a player first. I know what it feels like to handle pressure, get shots up when your legs are tired, guard somebody who keeps coming at you, and stay locked in when the game gets physical.
        </p>
        <p>
          Having my own court means I can be available in a way most trainers cannot. We can train consistently, keep the groups small, and build real relationships. Small numbers mean I see your kid. I see how they move. I see what they&apos;re working on. I see what they&apos;re avoiding.
        </p>
        <p>I coach hard. I coach with love. Those are not opposites.</p>
      </div>

      <div className="mt-16 border-y border-white/10 py-12">
        <div className="label text-btc-orange mb-5">Midnight Madness</div>
        <h2 className="display text-4xl md:text-5xl mb-6">It&apos;s bigger than basketball.</h2>
        <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <Image
              src="/images/about-bench.jpg"
              alt="Coach T with players on his home court"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="space-y-6 text-lg text-btc-white/85 leading-relaxed">
            <p>
              Every now and then we do something we call Midnight Madness. Kids come over. We train. We eat. We play games. We hang out. Liz built the curriculum side of it - the part that&apos;s not basketball.
            </p>
            <p>Hard work. Love. Fellowship. Video games. Laughs. Sometimes tears. Growth.</p>
            <p>That&apos;s the part that doesn&apos;t show up in box scores. That&apos;s also the part that matters most.</p>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="label text-btc-orange mb-5">The mission</div>
        <div className="space-y-6 text-lg text-btc-white/85 leading-relaxed max-w-2xl">
          <p>Develop young men and women who can compete on the court and thrive off it.</p>
          <p>That&apos;s the whole thing.</p>
        </div>
        <a
          href={`mailto:${site.email}`}
          className="mt-12 inline-block bg-btc-orange text-btc-black px-6 py-3 font-semibold hover:bg-btc-white transition"
        >
          Email Coach T
        </a>
      </div>
    </div>
  );
}
