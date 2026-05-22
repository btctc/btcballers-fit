import Link from "next/link";
import PlayDiagram from "@/components/PlayDiagram";
import { glossaryEntryCount, glossarySections } from "@/lib/playbookGlossary";

export const metadata = {
  title: "Playbook Terminology - BTC Ballers",
  description: "Basketball playbook terminology, examples, and simple court diagrams from BTC Ballers.",
};

const examples = [
  {
    term: "Backcut",
    kind: "backcut" as const,
    read: "If your defender jumps the passing lane, do not fight for the catch. Plant, cut behind them, and make them pay at the rim.",
    cue: "Pressure the defender's eyes.",
  },
  {
    term: "DHO",
    kind: "dho" as const,
    read: "The handoff is not a casual exchange. Sprint tight off the big, brush shoulders, and turn the corner with pace.",
    cue: "Tight path. Strong hands.",
  },
  {
    term: "Hammer",
    kind: "hammer" as const,
    read: "When the ball drives baseline, the weakside screen frees the corner shooter. The pass has to arrive on time.",
    cue: "Drive low. See weakside.",
  },
  {
    term: "Spain PnR",
    kind: "spain" as const,
    read: "The first screen attacks the ball. The second screen attacks the roller's defender. That is how one action creates two problems.",
    cue: "Screen the helper.",
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
            <a href="#examples" className="bg-btc-orange text-btc-black px-5 py-3 font-semibold hover:bg-btc-white transition">
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
              <div className="display text-4xl text-btc-orange">4</div>
              <div className="label mt-2">Examples</div>
            </div>
            <div>
              <div className="display text-4xl text-btc-orange">A-Z</div>
              <div className="label mt-2">Index</div>
            </div>
          </div>
        </div>
      </section>

      <section id="examples" className="mt-24 scroll-mt-28">
        <div className="label text-btc-orange">Simple court reads</div>
        <h2 className="display text-5xl md:text-6xl mt-3">See it. Say it. Rep it.</h2>
        <div className="mt-10 grid md:grid-cols-2 gap-5">
          {examples.map((example) => (
            <article key={example.term} className="border border-white/10 bg-btc-dim">
              <div className="aspect-[16/11]">
                <PlayDiagram kind={example.kind} title={example.term} />
              </div>
              <div className="p-6 border-t border-white/10">
                <div className="label text-btc-orange">{example.cue}</div>
                <h3 className="display text-4xl mt-3">{example.term}</h3>
                <p className="mt-4 text-base md:text-lg leading-relaxed text-btc-white/85">{example.read}</p>
              </div>
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
