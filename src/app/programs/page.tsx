import Image from "next/image";
import ProgramCard from "@/components/ProgramCard";
import CampWeekList from "@/components/CampWeekList";
import { camp, training, openGym } from "@/lib/programs";
import { site } from "@/lib/siteConfig";

export const metadata = { title: "Programs - BTC Ballers" };

export default function ProgramsPage() {
  const trainingSubject = encodeURIComponent("Summer Training inquiry");
  const trainingBody = encodeURIComponent(
    `Hi Coach T,\n\nI'm interested in Summer Training for my kid.\n\nKid's name:\nKid's age:\nProposed dates and times:\nWhat we want to work on:\n\nThanks.`
  );
  const trainingHref = `mailto:${site.email}?subject=${trainingSubject}&body=${trainingBody}`;

  return (
    <div className="max-w-6xl mx-auto px-5 py-20">
      <div className="label text-btc-orange">Summer 2026</div>
      <h1 className="display text-6xl md:text-8xl mt-3">Programs.</h1>
      <p className="mt-6 text-lg text-btc-white/80 max-w-2xl">
        Three ways in this summer. Pick the one that fits your kid.
      </p>

      <div className="mt-16 grid md:grid-cols-2 gap-6">
        <ProgramCard
          label="Week-long immersion"
          title={camp.title}
          price={camp.price}
          blurb={camp.blurb}
          image={{ src: "/images/camp.jpg", alt: "Kids lined up for camp drills on Coach T's court" }}
        >
          <div className="label mb-2">Daily schedule</div>
          <ul className="space-y-2 mb-6">
            {camp.schedule.map((s, i) => (
              <li key={i} className="flex gap-4 text-sm">
                <span className="mono text-btc-orange w-16 shrink-0">{s.time}</span>
                <span className="text-btc-white/85">{s.what}</span>
              </li>
            ))}
          </ul>
          <div className="label mb-2">Pricing</div>
          <ul className="space-y-2 mb-6">
            {camp.dropIn.map((d, i) => (
              <li key={i} className="flex justify-between gap-4 text-sm border-b border-white/5 pb-2">
                <span className="text-btc-white/85">{d.label}</span>
                <span className="mono text-btc-orange">{d.price}</span>
              </li>
            ))}
          </ul>
          <div className="label mb-3">Pick a week</div>
          <CampWeekList />
        </ProgramCard>

        <ProgramCard
          label="12-session package"
          title={training.title}
          price={training.price}
          blurb={training.blurb}
          image={{ src: "/images/training.jpg", alt: "Young player training on Coach T's court" }}
          cta={{ href: trainingHref, text: "Reserve Training" }}
        >
          <div className="label mb-2">Window</div>
          <p className="text-btc-white/85 mb-4">{training.window}</p>
          <div className="label mb-2">Availability</div>
          <p className="text-btc-white/85 mb-6">{training.availability}</p>
          <div className="label mb-2">Includes</div>
          <ul className="space-y-2">
            {training.includes.map((it, i) => (
              <li key={i} className="text-sm text-btc-white/85">- {it}</li>
            ))}
          </ul>
        </ProgramCard>
      </div>

      <div className="mt-16 border border-white/10 bg-btc-dim p-8 md:p-10">
        <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-8 items-center">
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <Image src="/images/between-drills.jpg" alt="Kids between drills on the court" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
          </div>
          <div>
            <div className="label text-btc-orange mb-3">Free this summer</div>
            <h3 className="display text-4xl mb-3">{openGym.title}</h3>
            <p className="text-btc-white/85 max-w-2xl">{openGym.blurb}</p>
            <div className="mt-5 flex flex-wrap gap-6">
              <div>
                <div className="label">When</div>
                <div className="mt-1 text-btc-white/85">{openGym.time}</div>
              </div>
              <div>
                <div className="label">Dates</div>
                <ul className="mt-1 flex flex-wrap gap-2">
                  {openGym.dates.map((d) => (
                    <li key={d} className="mono text-sm border border-white/15 px-3 py-1">{d}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-btc-white/60 text-sm mt-4">{openGym.note}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
