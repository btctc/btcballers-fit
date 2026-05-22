"use client";

import { useMemo, useState } from "react";
import { glossarySections } from "@/lib/playbookGlossary";

type ConnectionGroup = {
  label: string;
  title: string;
  signal: string;
  terms: string[];
  read: string;
};

type Props = {
  groups: ConnectionGroup[];
};

const fallbackDefinitions: Record<string, string> = {
  ATO: "After timeout. A play or action called by the coach after a timeout to attack a specific matchup, coverage, or late-game situation.",
  BLOB: "Baseline out-of-bounds. An inbound play run from under the basket.",
};

function findDefinition(term: string) {
  const entries = glossarySections.flatMap((section) => section.entries);
  const match = entries.find(
    (entry) =>
      entry.term === term ||
      entry.term.startsWith(`${term} (`) ||
      entry.term.includes(`(${term})`)
  );
  return match?.definition ?? fallbackDefinitions[term] ?? "A connected concept in this possession family.";
}

export default function PlaybookConnections({ groups }: Props) {
  const initialTerms = useMemo(
    () => Object.fromEntries(groups.map((group) => [group.label, group.terms[0]])),
    [groups]
  );
  const [selectedTerms, setSelectedTerms] = useState<Record<string, string>>(initialTerms);

  return (
    <div className="connection-network border border-white/10 bg-btc-dim p-4 md:p-5 scanline">
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

      <div className="relative z-10 mt-5 grid gap-4">
        {groups.map((group) => {
          const selectedTerm = selectedTerms[group.label] ?? group.terms[0];

          return (
            <article key={group.label} className="connection-node border border-white/10 bg-btc-black p-4 md:p-5">
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
                {group.terms.map((term) => {
                  const isSelected = term === selectedTerm;

                  return (
                    <button
                      key={term}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedTerms((current) => ({ ...current, [group.label]: term }))}
                      className={`mono border px-3 py-2 text-xs transition ${
                        isSelected
                          ? "border-btc-orange bg-btc-orange text-btc-black"
                          : "border-white/12 text-btc-white/78 hover:border-btc-orange hover:text-btc-orange"
                      }`}
                    >
                      {term}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 border border-white/10 bg-btc-dim p-4">
                <div className="label text-btc-orange">Selected concept</div>
                <div className="mono mt-2 text-btc-white">{selectedTerm}</div>
                <p className="mt-3 text-sm leading-relaxed text-btc-white/74">{findDefinition(selectedTerm)}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
