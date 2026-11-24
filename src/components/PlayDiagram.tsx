"use client";

import { useEffect, useMemo, useRef } from "react";
import CourtStage, { CourtLegend, makeStageRefs, paintPlay, sampleRoutes } from "@/components/CourtStage";
import { diagrams, type Diagram, type DiagramKey } from "@/lib/diagrams";

const PLAY_MS = 3600;
const HOLD_MS = 1300;

// A looping animated diagram of one action.
export default function PlayDiagram({ name }: { name: DiagramKey }) {
  const diagram: Diagram = diagrams[name];
  const refs = useRef(makeStageRefs()).current;
  const routes = useMemo(() => sampleRoutes(diagram.actors), [diagram]);

  useEffect(() => {
    const svg = refs.svg;
    if (!svg) return;

    // With motion turned off, show the finished play as a still diagram.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      paintPlay(diagram, refs, routes, 1);
      return;
    }

    let frame = 0;
    let last = 0;
    let clock = 0;
    let visible = false;

    const tick = (now: number) => {
      if (last) clock += Math.min(now - last, 50);
      last = now;
      paintPlay(diagram, refs, routes, Math.min(1, (clock % (PLAY_MS + HOLD_MS)) / PLAY_MS));
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (frame || !visible || document.hidden) return;
      last = 0;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    const inView = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    inView.observe(svg);
    document.addEventListener("visibilitychange", onVisibility);
    paintPlay(diagram, refs, routes, 0);

    return () => {
      stop();
      inView.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [diagram, routes, refs]);

  return (
    <figure className="overflow-hidden border border-white/10 bg-[#0D1016]">
      <CourtStage play={diagram} refs={refs} label={diagram.label} />
      <CourtLegend />
    </figure>
  );
}
