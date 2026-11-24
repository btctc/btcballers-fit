import Link from "next/link";
import PlaybookQuiz from "@/components/PlaybookQuiz";
import { glossaryEntryCount, glossarySections } from "@/lib/playbookGlossary";
import { levels } from "@/lib/quiz";

export const metadata = {
  title: "Playbook Quiz - BTC Ballers",
  description: "Learn the language of basketball with the BTC Ballers playbook quiz. True or false, multiple choice, and matching, from Rookie to Hall of Fame.",
};

export default function PlaybookPage() {
  return (
    <div className="max-w-6xl mx-auto px-5 py-20">
      <section>
        <div className="label text-btc-orange">Basketball IQ</div>
        <h1 className="display text-6xl md:text-8xl mt-3">Learn the game.</h1>
        <p className="mt-8 max-w-2xl text-lg md:text-xl text-btc-white/85 leading-relaxed">
          The game slows down when a player can name what they see. Start at Rookie and work your way up to Hall of Fame: {levels.length} levels of true or false, multiple choice, and matching.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#quiz" className="bg-btc-orange text-btc-black px-5 py-3 font-semibold hover:bg-btc-white transition">
            Start the quiz
          </a>
          <a href="#glossary" className="border border-white/30 px-5 py-3 font-semibold hover:border-btc-orange hover:text-btc-orange transition">
            Study the terms
          </a>
        </div>
      </section>

      <section id="quiz" className="mt-14 scroll-mt-28">
        <PlaybookQuiz />
      </section>

      <div className="mt-24 border-t border-white/10 pt-16">
        <div className="label text-btc-orange">Study hall</div>
        <h2 className="display text-4xl md:text-6xl mt-3">All {glossaryEntryCount} terms.</h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-btc-white/80">
          Effort matters more when it has direction. A missed read is not just a mistake. It is information. Learn the word, see the pattern, rep it again.
        </p>
      </div>

      <section id="glossary" className="mt-12 scroll-mt-28 grid min-w-0 lg:grid-cols-[12rem_1fr] gap-8 items-start">
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
