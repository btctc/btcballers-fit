import type { ReactNode } from "react";
import { at, type Point, type Stop } from "@/lib/courtMath";

// The court, the players and the ball. PlayDiagram and ReadCourt both draw on this
// and move the pieces by writing to the refs, so React never re-renders mid-animation.

export type StageActor = { id: string; team: "offense" | "defense"; path: Stop[] };
// A highlighted area of the floor: a circle (cx, cy, r) or a rectangle (x, y, w, h).
export type Zone = { cx: number; cy: number; r: number } | { x: number; y: number; w: number; h: number };
export type StagePlay = {
  actors: StageActor[];
  zones?: Zone[];
  ball: { until: number; actor: string }[];
  screens?: { t: number; actor: string }[];
};

export type StageRefs = {
  svg: SVGSVGElement | null;
  nodes: Record<string, SVGGElement | null>;
  trails: Record<string, SVGPolylineElement | null>;
  rings: (SVGCircleElement | null)[];
  ball: SVGCircleElement | null;
};
export const makeStageRefs = (): StageRefs => ({ svg: null, nodes: {}, trails: {}, rings: [], ball: null });

const SAMPLES = 72;
const PASS = 0.11; // share of the play a pass takes to travel
export const BALL_OFFSET: Point = [11, 10];

export type Routes = Record<string, Point[]>;
export const sampleRoutes = (actors: StageActor[]): Routes =>
  Object.fromEntries(actors.map((a) => [a.id, Array.from({ length: SAMPLES + 1 }, (_, i) => at(a.path, i / SAMPLES))]));

const fmt = (p: Point) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;

// Draw the play at time t (0 to 1).
export function paintPlay(play: StagePlay, refs: StageRefs, routes: Routes, t: number) {
  const paths: Record<string, Stop[]> = {};
  for (const a of play.actors) {
    paths[a.id] = a.path;
    const p = at(a.path, t);
    refs.nodes[a.id]?.setAttribute("transform", `translate(${fmt(p)})`);
    const pts = routes[a.id].slice(0, Math.floor(t * SAMPLES) + 1);
    pts.push(p);
    refs.trails[a.id]?.setAttribute("points", pts.map(fmt).join(" "));
  }

  // ball: sits with whoever has it, and flies between them on a pass
  const seq = play.ball;
  let n = seq.findIndex((s) => t <= s.until);
  if (n < 0) n = seq.length - 1;
  let b = at(paths[seq[n].actor], t);
  if (n > 0) {
    const u = (t - seq[n - 1].until) / PASS;
    if (u < 1) {
      const from = at(paths[seq[n - 1].actor], t);
      b = [from[0] + (b[0] - from[0]) * u, from[1] + (b[1] - from[1]) * u];
    }
  }
  refs.ball?.setAttribute("cx", (b[0] + BALL_OFFSET[0]).toFixed(1));
  refs.ball?.setAttribute("cy", (b[1] + BALL_OFFSET[1]).toFixed(1));

  // screen contact: a quick ring where the screen is set
  (play.screens ?? []).forEach((s, i) => {
    const ring = refs.rings[i];
    if (!ring) return;
    const u = (t - s.t) / 0.16;
    if (u < 0 || u > 1 || t >= 1) {
      ring.setAttribute("opacity", "0");
      return;
    }
    const p = at(paths[s.actor], t);
    ring.setAttribute("cx", p[0].toFixed(1));
    ring.setAttribute("cy", p[1].toFixed(1));
    ring.setAttribute("r", (15 + 15 * u).toFixed(1));
    ring.setAttribute("opacity", (0.9 * (1 - u)).toFixed(2));
  });
}

const LINE = "rgba(255,255,255,0.3)";

export type LabelSide = "left" | "right" | "top" | "bottom";

type Props = {
  play: StagePlay;
  refs: StageRefs;
  label: string;
  names?: Record<string, string>; // a name shown next to a player
  you?: string; // the player the viewer is deciding for
  labelSide?: Record<string, LabelSide>; // where a player's name sits
  under?: ReactNode; // drawn below the players
  over?: ReactNode; // drawn above the players
};

export default function CourtStage({ play, refs, label, names = {}, you, labelSide = {}, under, over }: Props) {
  return (
    <svg
      ref={(el) => {
        refs.svg = el;
      }}
      viewBox="-16 96 532 384"
      role="img"
      aria-label={label}
      className="block h-auto w-full"
    >
      {/* floor */}
      <rect x="-16" y="96" width="532" height="384" fill="#0D1016" />
      <rect x="0" y="96" width="500" height="366" fill="#141922" />
      <rect x="170" y="272" width="160" height="190" fill="rgba(244,148,42,0.12)" />

      {/* lines */}
      <g fill="none" stroke={LINE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M0,96 L0,462 L500,462 L500,96" />
        <rect x="170" y="272" width="160" height="190" />
        <path d="M30,462 L30,322 A237.5,237.5 0 0 1 470,322 L470,462" />
        <path d="M190,272 A60,60 0 0 1 310,272" />
        <path d="M190,272 A60,60 0 0 0 310,272" strokeDasharray="7 9" opacity="0.6" />
        <path d="M210,413 A40,40 0 0 1 290,413" strokeWidth="2" />
        <path d="M170,392 h-9 M330,392 h9 M170,362 h-9 M330,362 h9 M170,332 h-9 M330,332 h9" strokeWidth="2" />
      </g>
      <line x1="220" y1="424" x2="280" y2="424" stroke="rgba(255,255,255,0.55)" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="250" y1="424" x2="250" y2="421" stroke="#F4942A" strokeWidth="3" />
      <circle cx="250" cy="413" r="8" fill="none" stroke="#F4942A" strokeWidth="3" />

      {/* highlighted floor spots */}
      {(play.zones ?? []).map((z, i) =>
        "r" in z ? (
          <circle key={i} className="court-zone" cx={z.cx} cy={z.cy} r={z.r} fill="rgba(244,148,42,0.35)" stroke="#F4942A" strokeWidth="3" />
        ) : (
          <rect key={i} className="court-zone" x={z.x} y={z.y} width={z.w} height={z.h} fill="rgba(244,148,42,0.22)" stroke="#F4942A" strokeWidth="3" />
        )
      )}

      {/* routes */}
      {play.actors.map((a) => (
        <polyline
          key={a.id}
          ref={(el) => {
            refs.trails[a.id] = el;
          }}
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke={a.team === "offense" ? "rgba(244,148,42,0.6)" : "rgba(255,255,255,0.28)"}
          strokeDasharray={a.team === "offense" ? undefined : "1 8"}
        />
      ))}

      {under}

      {(play.screens ?? []).map((_, i) => (
        <circle
          key={i}
          ref={(el) => {
            refs.rings[i] = el;
          }}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3"
          opacity="0"
        />
      ))}

      {/* players: defense first so offense draws on top */}
      {[...play.actors]
        .sort((a, b) => (a.team === b.team ? 0 : a.team === "defense" ? -1 : 1))
        .map((a) => {
          const start = a.path[0];
          const name = a.id === you ? "You" : names[a.id];
          const side: LabelSide = labelSide[a.id] ?? (at(a.path, 1)[0] > 330 ? "left" : "right");
          return (
            <g
              key={a.id}
              ref={(el) => {
                refs.nodes[a.id] = el;
              }}
              transform={`translate(${start[0]},${start[1]})`}
            >
              {a.id === you ? <circle className="read-you" r="21" fill="none" stroke="#FFFFFF" strokeWidth="2" /> : null}
              {names[a.id] ? <circle r="20" fill="none" stroke="#F4942A" strokeWidth="2.5" /> : null}
              {a.team === "offense" ? (
                <>
                  <circle r="15" fill="#F4942A" stroke="#0A0A0A" strokeWidth="2" />
                  <text textAnchor="middle" dy="5.5" fontSize="16" fontWeight="800" fill="#0A0A0A">
                    {a.id}
                  </text>
                </>
              ) : (
                <>
                  <circle r="14" fill="#0D1016" stroke="#C9CED8" strokeWidth="3" />
                  <path d="M-4.5,-4.5 L4.5,4.5 M4.5,-4.5 L-4.5,4.5" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
                </>
              )}
              {name ? (
                <text
                  x={side === "left" ? -26 : side === "right" ? 26 : 0}
                  y={side === "top" ? -27 : side === "bottom" ? 38 : 5}
                  textAnchor={side === "left" ? "end" : side === "right" ? "start" : "middle"}
                  fontSize="17"
                  fontWeight="800"
                  fill={a.id === you ? "#FFFFFF" : "#F4942A"}
                  stroke="#0D1016"
                  strokeWidth="5"
                  strokeLinejoin="round"
                  paintOrder="stroke"
                >
                  {name}
                </text>
              ) : null}
            </g>
          );
        })}

      <g>
        <circle
          ref={(el) => {
            refs.ball = el;
          }}
          r="6.5"
          fill="#E8762C"
          stroke="#0A0A0A"
          strokeWidth="1.5"
        />
      </g>

      {over}
    </svg>
  );
}

export function CourtLegend() {
  return (
    <figcaption className="flex flex-wrap gap-x-5 gap-y-1 border-t border-white/10 px-4 py-2 text-xs text-btc-white/60">
      <span className="flex items-center gap-2">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-btc-orange" /> Offense
      </span>
      <span className="flex items-center gap-2">
        <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-[#C9CED8] bg-[#0D1016]" /> Defense
      </span>
      <span className="flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-[#E8762C]" /> Ball
      </span>
    </figcaption>
  );
}
