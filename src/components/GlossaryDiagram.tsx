"use client";

import { useState } from "react";
import PlayDiagram from "@/components/PlayDiagram";
import type { DiagramKey } from "@/lib/diagrams";

// "Watch it" button under a glossary term. The diagram only loads when opened.
export default function GlossaryDiagram({ name }: { name: DiagramKey }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="label inline-flex items-center gap-2 border border-btc-orange/50 px-3 py-2 text-btc-orange transition hover:bg-btc-orange hover:text-btc-black"
      >
        <span aria-hidden="true">{open ? "✕" : "▶"}</span>
        {open ? "Hide the play" : "Watch it"}
      </button>
      {open ? (
        <div className="quiz-in mt-3 max-w-md">
          <PlayDiagram name={name} />
        </div>
      ) : null}
    </div>
  );
}
