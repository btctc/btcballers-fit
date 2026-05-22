import Image from "next/image";
import OpenGymSignupButton from "@/components/OpenGymSignupButton";
import { openGym } from "@/lib/programs";

export default function OpenGymCallout() {
  return (
    <section id="open-gym" className="border-y border-white/5 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-5 py-20 md:py-28 grid md:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
        <div>
          <div className="label text-btc-orange mb-3">Free this summer</div>
          <h3 className="display text-5xl md:text-6xl">Open Gym.</h3>
          <p className="mt-6 text-btc-white/85 text-lg leading-relaxed">
            The gate opens, the music is on, and the court fills up. No sales pitch. No pressure. Just free 5-on-5 for kids who want to play, compete, and be around the game.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 gap-6">
            <div>
              <div className="label">Price</div>
              <div className="mono text-btc-orange mt-2 text-lg">{openGym.price}</div>
            </div>
            <div>
              <div className="label">When</div>
              <p className="mt-2 text-btc-white/85">{openGym.time}</p>
            </div>
          </div>
          <div className="mt-7 label">Dates</div>
          <ul className="mt-3 flex flex-wrap gap-2">
            {openGym.dates.map((d) => (
              <li key={d} className="mono text-sm border border-white/15 px-3 py-1">{d}</li>
            ))}
          </ul>
          <p className="text-btc-white/60 text-sm mt-5">{openGym.note}</p>
          <div className="mt-7">
            <OpenGymSignupButton />
          </div>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-btc-black">
          <Image
            src="/images/open-gym.jpg"
            alt="Coach T with Open Gym players after basketball"
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
