import Link from "next/link";
import PlaybookConnections from "@/components/PlaybookConnections";
import { glossaryEntryCount, glossarySections } from "@/lib/playbookGlossary";

export const metadata = {
  title: "Playbook Terminology - BTC Ballers",
  description: "Basketball playbook terminology and simple court reads from BTC Ballers.",
};

const connectionGroups = [
  {
    label: "Pressure release",
    title: "Cutting answers denial.",
    signal: "Overplay -> Cut -> Finish",
    terms: ["Backcut", "Denial", "Knife", "Fill", "Relocate"],
    read: "Read the defender cheating the pass. Adjust with a hard cut behind them. Go finish or fill the open space.",
  },
  {
    label: "Two-player engine",
    title: "Screens create decisions.",
    signal: "Screen -> Read -> Roll or Pop",
    terms: ["Ball Screen", "DHO", "Drag", "Ram", "Roll", "Pop", "Spain"],
    read: "Read how the defense guards the screen. Adjust the angle, pace, or spacing. Go attack the advantage together.",
  },
  {
    label: "Weakside punishment",
    title: "Help opens the next pass.",
    signal: "Drive -> Help -> Kick",
    terms: ["Hammer", "Flare", "Corner", "Kick", "Weakside", "Strongside"],
    read: "Read the help defender. Adjust by spacing where they left. Go make the pass before the defense recovers.",
  },
  {
    label: "Defensive chain",
    title: "Coverage is team language.",
    signal: "Ball -> Help -> Recover",
    terms: ["Closeout", "Help", "Dig", "Switch", "Drop", "Hedge", "Weakside I"],
    read: "Read the ball and your teammate. Adjust with help, a switch, or a closeout. Go back to your job after the stop.",
  },
  {
    label: "Time and score",
    title: "Situation changes the call.",
    signal: "Clock -> Call -> Shot",
    terms: ["ATO", "BLOB", "SLOB", "Late Clock", "Specials", "Quick"],
    read: "Read the clock and score. Adjust the spacing and pace. Go get the cleanest shot for that moment.",
  },
  {
    label: "Early offense",
    title: "Run before the defense settles.",
    signal: "Rebound -> Run -> Attack",
    terms: ["Outlet", "Early", "Drag", "Double Drag", "North-South", "Crash"],
    read: "Read whether the defense is set. Adjust by running wide, advancing the ball, or screening early. Go before they match up.",
  },
];

export default function PlaybookPage() {
  return (
    <div className="max-w-6xl mx-auto px-5 py-20">
      <section className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-end">
        <div>
          <div className="label text-btc-orange">Basketball IQ</div>
          <h1 className="display text-6xl md:text-8xl mt-3">Playbook language.</h1>
          <p className="mt-8 max-w-2xl text-lg md:text-xl text-btc-white/85 leading-relaxed">
            The game slows down when a player can name what they see. This page turns playbook words into reads kids can use on the court: where to cut, when to screen, how to space, and how to adjust after a mistake.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#connections" className="bg-btc-orange text-btc-black px-5 py-3 font-semibold hover:bg-btc-white transition">
              See Connections
            </a>
            <a href="#glossary" className="border border-white/30 px-5 py-3 font-semibold hover:border-btc-orange hover:text-btc-orange transition">
              Jump to Glossary
            </a>
          </div>
        </div>

        <div className="border border-white/10 bg-btc-black p-6 scanline">
          <div className="label text-btc-orange">Coach T teaching point</div>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-btc-white/85">
            Effort matters more when it has direction. A growth mindset on the court means a missed read is not just a mistake. It is information. Learn the word, see the pattern, rep it again.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
            <div>
              <div className="display text-4xl text-btc-orange">{glossaryEntryCount}</div>
              <div className="label mt-2">Terms</div>
            </div>
            <div>
              <div className="display text-4xl text-btc-orange">{connectionGroups.length}</div>
              <div className="label mt-2">Groups</div>
            </div>
            <div>
              <div className="display text-4xl text-btc-orange">A-Z</div>
              <div className="label mt-2">Index</div>
            </div>
          </div>
        </div>
      </section>

      <section id="connections" className="mt-24 scroll-mt-28">
        <div className="grid lg:grid-cols-[0.82fr_1.18fr] gap-8 items-start">
          <div>
            <div className="label text-btc-orange">Connected language</div>
            <h2 className="display text-4xl md:text-6xl mt-3">The words talk.</h2>
            <p className="mt-6 text-lg leading-relaxed text-btc-white/82">
              Basketball terms are not flash cards. They help players see the floor together. Read what is happening, adjust with your teammates, then go make the next play.
            </p>
            <div className="mt-8 border border-white/10 bg-btc-black p-5">
              <div className="label text-btc-orange">RAG on the court</div>
              <div className="mt-4 grid gap-3">
                {[
                  { name: "Read", detail: "What is the defense giving us?" },
                  { name: "Adjust", detail: "Where should I move for my teammate?" },
                  { name: "Go", detail: "Make the simple play with confidence." },
                ].map((step, index) => (
                  <div key={step.name} className="grid grid-cols-[2rem_1fr] gap-3 items-center border border-white/10 bg-btc-black p-3">
                    <div className="mono text-btc-orange">{index + 1}</div>
                    <div>
                      <div className="text-sm font-semibold text-btc-white">{step.name}</div>
                      <p className="mt-1 text-sm leading-relaxed text-btc-white/68">{step.detail}</p>
                      <div className="signal-stream mt-2" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <PlaybookConnections groups={connectionGroups} />
        </div>
      </section>

      <section id="glossary" className="mt-24 scroll-mt-28 grid min-w-0 lg:grid-cols-[12rem_1fr] gap-8 items-start">
        <aside className="min-w-0 lg:sticky lg:top-28">
          <div className="label text-btc-orange mb-4">Glossary index</div>
          <nav aria-label="Playbook glossary letters" className="flex w-full max-w-full min-w-0 lg:grid lg:grid-cols-4 gap-2 overflow-x-auto pb-2">
            {glossarySections.map((section) => (
              <a
                key={section.letter}
                href={`#letter-${section.letter.toLowerCase()}`}
                className="mono shrink-0 border border-white/15 px-3 py-2 text-sm text-btc-white/80 hover:border-btc-orange hover:text-btc-orange transition"
              >
                {section.letter}
              </a>
            ))}
          </nav>
          <Link
            href="/programs"
            className="mt-6 hidden lg:inline-block border border-btc-orange px-4 py-3 text-sm font-semibold text-btc-orange hover:bg-btc-orange hover:text-btc-black transition"
          >
            Train These Reads
          </Link>
        </aside>

        <div className="min-w-0 space-y-12">
          {glossarySections.map((section) => (
            <section key={section.letter} id={`letter-${section.letter.toLowerCase()}`} className="scroll-mt-28">
              <div className="flex items-baseline gap-4 border-b border-white/10 pb-4">
                <h2 className="display text-5xl text-btc-orange">{section.letter}</h2>
                <div className="label">{section.entries.length} terms</div>
              </div>
              <dl className="mt-5 grid md:grid-cols-2 gap-px overflow-hidden border border-white/10 bg-btc-black">
                {section.entries.map((entry) => (
                  <div key={entry.term} className="bg-btc-black p-5">
                    <dt className="mono text-base text-btc-white">{entry.term}</dt>
                    <dd className="mt-3 text-base leading-relaxed text-btc-white/78">{entry.definition}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
