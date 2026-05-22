import Link from "next/link";
import { glossaryEntryCount, glossarySections } from "@/lib/playbookGlossary";

export const metadata = {
  title: "Playbook Terminology - BTC Ballers",
  description: "Basketball playbook terminology and simple court reads from BTC Ballers.",
};

const examples = [
  {
    term: "Backcut",
    read: "If your defender jumps the passing lane, do not fight for the catch. Plant, cut behind them, and make them pay at the rim.",
    cue: "Pressure the defender's eyes.",
  },
  {
    term: "DHO",
    read: "The handoff is not a casual exchange. Sprint tight off the big, brush shoulders, and turn the corner with pace.",
    cue: "Tight path. Strong hands.",
  },
  {
    term: "Hammer",
    read: "When the ball drives baseline, the weakside screen frees the corner shooter. The pass has to arrive on time.",
    cue: "Drive low. See weakside.",
  },
  {
    term: "Spain PnR",
    read: "The first screen attacks the ball. The second screen attacks the roller's defender. That is how one action creates two problems.",
    cue: "Screen the helper.",
  },
];

const connectionGroups = [
  {
    label: "Pressure release",
    title: "Cutting answers denial.",
    signal: "Passer -> Cutter -> Rim",
    terms: ["Backcut", "Denial", "Knife", "Fill", "Relocate"],
    read: "When a defender overplays, the ball, spacing, and cutter have to talk at the same time. The pass is the message.",
  },
  {
    label: "Two-player engine",
    title: "Screens create decisions.",
    signal: "Screen -> Use -> Roll / Pop",
    terms: ["Ball Screen", "DHO", "Drag", "Ram", "Roll", "Pop", "Spain"],
    read: "The screener, handler, and spacing players are all connected. One good screen can force the whole defense to communicate.",
  },
  {
    label: "Weakside punishment",
    title: "Help opens the next pass.",
    signal: "Drive -> Help -> Weakside",
    terms: ["Hammer", "Flare", "Corner", "Kick", "Weakside", "Strongside"],
    read: "When the ball attacks one side, the opposite side cannot fall asleep. The best shot often comes from the second defender helping.",
  },
  {
    label: "Defensive chain",
    title: "Coverage is team language.",
    signal: "Ball -> Help -> Recovery",
    terms: ["Closeout", "Help", "Dig", "Switch", "Drop", "Hedge", "Weakside I"],
    read: "Defense is communication under pressure. One player contains, one helps, one covers the next pass, and everybody recovers.",
  },
  {
    label: "Time and score",
    title: "Situation changes the call.",
    signal: "Clock -> Spacing -> Shot",
    terms: ["ATO", "BLOB", "SLOB", "Late Clock", "Specials", "Quick"],
    read: "The same action feels different with six seconds left, after a timeout, or on an inbound. Smart players know the moment.",
  },
  {
    label: "Early offense",
    title: "Run before the defense settles.",
    signal: "Outlet -> Advance -> Attack",
    terms: ["Outlet", "Early", "Drag", "Double Drag", "North-South", "Crash"],
    read: "Transition is not chaos. The first pass, first sprint, and first screen tell everybody what advantage to chase.",
  },
];

function glossaryHref(term: string) {
  return `#letter-${term[0].toLowerCase()}`;
}

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
            <a href="#examples" className="border border-white/30 px-5 py-3 font-semibold hover:border-btc-orange hover:text-btc-orange transition">
              See Examples
            </a>
            <a href="#glossary" className="border border-white/30 px-5 py-3 font-semibold hover:border-btc-orange hover:text-btc-orange transition">
              Jump to Glossary
            </a>
          </div>
        </div>

        <div className="border border-white/10 bg-btc-dim p-6 scanline">
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
          <div className="lg:sticky lg:top-28">
            <div className="label text-btc-orange">Connected language</div>
            <h2 className="display text-4xl md:text-6xl mt-3">The words talk.</h2>
            <p className="mt-6 text-lg leading-relaxed text-btc-white/82">
              Basketball terminology is not a stack of flash cards. It is a communication system. One action triggers a read, the read triggers help, and the help creates the next decision.
            </p>
            <div className="mt-8 border border-white/10 bg-btc-dim p-5 scanline">
              <div className="label text-btc-orange">Communication loop</div>
              <div className="mt-4 grid gap-3">
                {["Name the action", "See the coverage", "Make the next read"].map((step, index) => (
                  <div key={step} className="grid grid-cols-[2rem_1fr] gap-3 items-center border border-white/10 bg-btc-black p-3">
                    <div className="mono text-btc-orange">{index + 1}</div>
                    <div>
                      <div className="text-sm font-semibold text-btc-white">{step}</div>
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

          <div className="border border-white/10 bg-btc-dim p-4 md:p-5 scanline">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <div className="label text-btc-orange">Live possession map</div>
                <p className="mt-2 text-sm text-btc-white/62">
                  Follow the signal from one concept to the next.
                </p>
              </div>
              <div className="mono flex items-center gap-2 text-sm text-btc-orange">
                <span className="h-2 w-2 rounded-full bg-emerald-400 status-pulse" aria-hidden="true" />
                Connected
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              {connectionGroups.map((group) => (
                <article key={group.label} className="border border-white/10 bg-btc-black p-4 md:p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="label text-btc-orange">{group.label}</div>
                      <h3 className="mt-2 text-2xl font-bold tracking-tight text-btc-white">{group.title}</h3>
                    </div>
                    <div className="mono text-sm text-btc-white/62">{group.signal}</div>
                  </div>

                  <div className="signal-stream mt-4" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>

                  <p className="mt-4 text-base leading-relaxed text-btc-white/78">{group.read}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {group.terms.map((term) => (
                      <a
                        key={term}
                        href={glossaryHref(term)}
                        className="mono border border-white/12 px-3 py-2 text-xs text-btc-white/78 hover:border-btc-orange hover:text-btc-orange transition"
                      >
                        {term}
                      </a>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="examples" className="mt-24 scroll-mt-28">
        <div className="label text-btc-orange">Simple court reads</div>
        <h2 className="display text-5xl md:text-6xl mt-3">See it. Say it. Rep it.</h2>
        <div className="mt-10 grid md:grid-cols-2 gap-5">
          {examples.map((example) => (
            <article key={example.term} className="border border-white/10 bg-btc-dim p-6 md:p-7">
              <div className="label text-btc-orange">{example.cue}</div>
              <h3 className="display text-4xl mt-3">{example.term}</h3>
              <p className="mt-4 text-base md:text-lg leading-relaxed text-btc-white/85">{example.read}</p>
            </article>
          ))}
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
              <dl className="mt-5 grid md:grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/10">
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
