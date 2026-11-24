"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import CourtStage, { BALL_OFFSET, makeStageRefs, paintPlay, sampleRoutes, type LabelSide } from "@/components/CourtStage";
import { at, easeInOut, lerp, type Point } from "@/lib/courtMath";
import type { Read } from "@/lib/reads";

const DEVELOP_MS = 2800;
const OUTCOME_MS = 1150;

// Pick the side of a player where a name of the given width has the most open space.
function bestSide(p: Point, width: number, order: LabelSide[], obstacles: Point[]): { side: LabelSide; samples: Point[] } {
  const spots: Record<LabelSide, { ok: boolean; samples: Point[] }> = {
    right: {
      ok: p[0] + 26 + width < 508,
      samples: [0.1, 0.5, 0.9].map((f) => [p[0] + 26 + width * f, p[1]] as Point),
    },
    left: {
      ok: p[0] - 26 - width > -8,
      samples: [0.1, 0.5, 0.9].map((f) => [p[0] - 26 - width * f, p[1]] as Point),
    },
    top: {
      ok: p[1] - 34 > 112 && p[0] - width / 2 > -8 && p[0] + width / 2 < 508,
      samples: [-0.4, 0, 0.4].map((f) => [p[0] + width * f, p[1] - 30] as Point),
    },
    bottom: {
      ok: p[1] + 44 < 474 && p[0] - width / 2 > -8 && p[0] + width / 2 < 508,
      samples: [-0.4, 0, 0.4].map((f) => [p[0] + width * f, p[1] + 34] as Point),
    },
  };
  let best = order[0];
  let bestGap = -1;
  for (const side of order) {
    if (!spots[side].ok) continue;
    const gap = Math.min(
      ...spots[side].samples.flatMap((s) => obstacles.map((q) => Math.hypot(s[0] - q[0], s[1] - q[1]))),
      999
    );
    if (gap > bestGap + 4) {
      best = side;
      bestGap = gap;
    }
  }
  return { side: best, samples: spots[best].samples };
}

type Phase = "develop" | "freeze" | "outcome" | "done";

// One Film Room possession: the play runs, freezes, three arrows appear,
// the player taps one, and the court shows what happens.
export default function ReadCourt({ read, onResult }: { read: Read; onResult: (right: boolean) => void }) {
  const [phase, setPhase] = useState<Phase>("develop");
  const [pick, setPick] = useState<number | null>(null);
  const [run, setRun] = useState(0);
  const refs = useRef(makeStageRefs()).current;
  const routes = useMemo(() => sampleRoutes(read.actors), [read]);
  const report = useRef(onResult);
  report.current = onResult;

  // where everyone stands at the freeze
  const ends = useMemo(
    () => Object.fromEntries(read.actors.map((a) => [a.id, at(a.path, 1)])) as Record<string, Point>,
    [read]
  );
  const holder = read.ball[read.ball.length - 1].actor;
  // the play develops, then freezes
  useEffect(() => {
    if (phase !== "develop") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      paintPlay(read, refs, routes, 1);
      setPhase("freeze");
      return;
    }
    let frame = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / DEVELOP_MS);
      paintPlay(read, refs, routes, t);
      if (t < 1) frame = requestAnimationFrame(tick);
      else setPhase("freeze");
    };
    paintPlay(read, refs, routes, 0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, run, read, refs, routes]);

  // the choice plays out
  useEffect(() => {
    if (phase !== "outcome" || pick === null) return;
    const out = read.options[pick].outcome;
    const moves = out.moves ?? [];
    const holderMove = moves.find((m) => m.actor === holder);
    const ballStart: Point = [ends[holder][0] + BALL_OFFSET[0], ends[holder][1] + BALL_OFFSET[1]];
    const ballPath: Point[] = [ballStart, ...(out.ballTo ?? [])];

    const paint = (u: number) => {
      const m = easeInOut(Math.min(1, u / 0.7));
      for (const mv of moves) {
        const p = lerp(ends[mv.actor], mv.to, m);
        refs.nodes[mv.actor]?.setAttribute("transform", `translate(${p[0].toFixed(1)},${p[1].toFixed(1)})`);
      }
      let b: Point;
      if (ballPath.length === 1) {
        // the ball stays with whoever has it
        const h = holderMove ? lerp(ends[holder], holderMove.to, m) : ends[holder];
        b = [h[0] + BALL_OFFSET[0], h[1] + BALL_OFFSET[1]];
      } else {
        const legs = ballPath.length - 1;
        const v = easeInOut(u) * legs;
        const k = Math.min(legs - 1, Math.floor(v));
        b = lerp(ballPath[k], ballPath[k + 1], v - k);
      }
      refs.ball?.setAttribute("cx", b[0].toFixed(1));
      refs.ball?.setAttribute("cy", b[1].toFixed(1));
    };

    const finish = () => {
      setPhase("done");
      report.current(pick === read.best);
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      paint(1);
      finish();
      return;
    }
    let frame = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const u = Math.min(1, (now - start) / OUTCOME_MS);
      paint(u);
      if (u < 1) frame = requestAnimationFrame(tick);
      else finish();
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, pick, read, refs, ends, holder]);

  const choose = (i: number) => {
    if (phase !== "freeze") return;
    setPick(i);
    setPhase("outcome");
  };

  // arrows from the deciding player to each choice
  const from = ends[read.you];
  const arrows = read.options.map((opt) => {
    const target = typeof opt.to === "string" ? ends[opt.to] : opt.to;
    const dx = target[0] - from[0];
    const dy = target[1] - from[1];
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const bend = opt.bend ?? 0;
    // start at the edge of the player, stop short of the target
    const p0: Point = [from[0] + ux * 20, from[1] + uy * 20];
    const p2: Point = [target[0] - ux * (typeof opt.to === "string" ? 22 : 6), target[1] - uy * (typeof opt.to === "string" ? 22 : 6)];
    const c: Point = [(p0[0] + p2[0]) / 2 - uy * bend, (p0[1] + p2[1]) / 2 + ux * bend];
    const badge: Point = [0.25 * p0[0] + 0.5 * c[0] + 0.25 * p2[0], 0.25 * p0[1] + 0.5 * c[1] + 0.25 * p2[1]];
    return { d: `M${p0[0].toFixed(1)},${p0[1].toFixed(1)} Q${c[0].toFixed(1)},${c[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`, badge };
  });

  // Name labels go wherever there is the most room: clear of players, and of the arrows while they show.
  const moved = phase === "outcome" || phase === "done" ? read.options[pick ?? 0].outcome.moves ?? [] : [];
  const spots: Record<string, Point> = { ...ends };
  for (const m of moved) spots[m.actor] = m.to;
  const others = (id: string) => read.actors.filter((a) => a.id !== id).map((a) => spots[a.id]);
  const badges = moved.length || phase === "done" || phase === "outcome" ? [] : arrows.map((a) => a.badge);
  const starLabel = bestSide(spots[read.star.actor], read.star.name.length * 9.4, ["right", "left", "top", "bottom"], [
    ...others(read.star.actor),
    ...badges,
  ]);
  const labelSide: Record<string, LabelSide> = { [read.star.actor]: starLabel.side };
  if (read.you !== read.star.actor) {
    labelSide[read.you] = bestSide(spots[read.you], 34, ["top", "bottom", "left", "right"], [
      ...others(read.you),
      ...badges,
      ...starLabel.samples,
    ]).side;
  }

  const showArrows = phase !== "develop";
  const settled = phase === "done";
  const right = pick === read.best;
  const colorOf = (i: number) => {
    if (settled && i === read.best) return "#34D399";
    if (settled && i === pick) return "#F87171";
    return "#FFFFFF";
  };
  const opacityOf = (i: number) => {
    if (pick === null) return 1;
    if (i === pick) return 1;
    if (settled && i === read.best) return 1;
    return 0.14;
  };
  const out = pick !== null ? read.options[pick].outcome : null;

  return (
    <div>
      <div className="mb-2 flex h-8 items-center justify-between">
        {phase === "develop" ? (
          <span className="label">Watch the play</span>
        ) : (
          <span
            className={`px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] ${
              phase === "freeze" ? "quiz-pop bg-btc-orange text-btc-black" : "bg-white/10 text-btc-white/60"
            }`}
          >
            Freeze
          </span>
        )}
        {phase === "freeze" ? (
          <button
            type="button"
            onClick={() => {
              setRun((n) => n + 1);
              setPhase("develop");
            }}
            className="border border-white/25 px-3 py-1 text-xs font-semibold text-btc-white/80 transition hover:border-btc-orange hover:text-btc-orange"
          >
            Replay
          </button>
        ) : null}
      </div>
      <div className="relative overflow-hidden border border-white/10 bg-[#0D1016]">
        <CourtStage
          play={read}
          refs={refs}
          label={`${read.action}. ${read.star.role}: ${read.star.name}. ${read.ask}`}
          names={{ [read.star.actor]: read.star.name }}
          you={read.you}
          labelSide={labelSide}
          under={
            showArrows ? (
              <g aria-hidden="true">
                {arrows.map((a, i) => (
                  <path
                    key={`${run}-${i}`}
                    d={a.d}
                    pathLength={1}
                    className="read-draw"
                    fill="none"
                    stroke={colorOf(i)}
                    strokeWidth={pick === i || (settled && i === read.best) ? 5 : 3.5}
                    strokeLinecap="round"
                    strokeDasharray="1"
                    style={{ animationDelay: `${0.12 + i * 0.14}s`, opacity: opacityOf(i), transition: "opacity 0.3s, stroke 0.3s" }}
                  />
                ))}
              </g>
            ) : null
          }
          over={
            <>
              {showArrows ? (
                <g>
                  {arrows.map((a, i) => (
                    <g
                      key={`${run}-${i}`}
                      className="read-badge"
                      onClick={() => choose(i)}
                      style={{
                        animationDelay: `${0.3 + i * 0.14}s`,
                        cursor: phase === "freeze" ? "pointer" : "default",
                        opacity: opacityOf(i),
                        transition: "opacity 0.3s",
                      }}
                    >
                      {/* generous tap target along the whole arrow */}
                      <path d={a.d} fill="none" stroke="transparent" strokeWidth="34" strokeLinecap="round" />
                      <circle cx={a.badge[0]} cy={a.badge[1]} r="26" fill="transparent" />
                      <circle cx={a.badge[0]} cy={a.badge[1]} r="16" fill={colorOf(i)} stroke="#0D1016" strokeWidth="3" />
                      <text x={a.badge[0]} y={a.badge[1] + 6} textAnchor="middle" fontSize="17" fontWeight="800" fill="#0D1016">
                        {i + 1}
                      </text>
                    </g>
                  ))}
                </g>
              ) : null}
              {settled && out ? (
                <g className="read-result" aria-hidden="true">
                  <circle cx={out.at[0]} cy={out.at[1]} r="30" fill="none" stroke={right ? "#34D399" : "#F87171"} strokeWidth="3" className="read-ring" />
                  <text
                    x={Math.min(Math.max(out.at[0], out.text.length * 6.3 - 8), 508 - out.text.length * 6.3)}
                    y={out.at[1] - 40}
                    textAnchor="middle"
                    fontSize="22"
                    fontWeight="800"
                    fill={right ? "#34D399" : "#F87171"}
                    stroke="#0D1016"
                    strokeWidth="6"
                    strokeLinejoin="round"
                    paintOrder="stroke"
                  >
                    {out.text}
                  </text>
                </g>
              ) : null}
            </>
          }
        />
      </div>

      <div className="mt-3 grid gap-2">
        {read.options.map((opt, i) => {
          const state = settled
            ? i === read.best
              ? "border-emerald-400 bg-emerald-400/10 text-btc-white"
              : i === pick
                ? "border-red-400/80 bg-red-400/10 text-btc-white/80"
                : "border-white/10 text-btc-white/35"
            : pick === i
              ? "border-btc-orange bg-btc-orange/15"
              : phase === "freeze"
                ? "border-white/20 bg-btc-black hover:border-btc-orange"
                : "border-white/10 bg-btc-black text-btc-white/40";
          return (
            <button
              key={opt.label}
              type="button"
              disabled={phase !== "freeze"}
              onClick={() => choose(i)}
              className={`flex min-h-[3.25rem] items-center gap-3 border px-4 py-2 text-left text-base font-semibold leading-snug transition-colors ${state}`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-sm font-extrabold text-btc-black">
                {i + 1}
              </span>
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
