// Animated play diagrams for the playbook.
// Court is drawn from the offense's view with the basket at the bottom.
// Units: 10 per foot. Sidelines at x=0 and x=500, baseline at y=462, rim at (250,413).
// A path is a list of [x, y, time] stops, with time running 0 to 1.

import type { Stop } from "@/lib/courtMath";

export type { Stop };
export type DiagramActor = { id: string; team: "offense" | "defense"; path: Stop[] };
export type Diagram = {
  label: string; // read by screen readers
  actors: DiagramActor[];
  ball: { until: number; actor: string }[]; // who has the ball, in order
  screens?: { t: number; actor: string }[]; // moments a screen makes contact
};

const o = (id: string, path: Stop[]): DiagramActor => ({ id, team: "offense", path });
const x = (id: string, path: Stop[]): DiagramActor => ({ id, team: "defense", path });

export const diagrams = {
  backcut: {
    label: "The defender overplays the pass, so the wing cuts behind them to the rim and catches the pass.",
    actors: [
      o("1", [[250, 150, 0], [250, 150, 1]]),
      o("2", [[428, 250, 0], [414, 228, 0.32], [300, 378, 0.8], [300, 378, 1]]),
      x("x1", [[250, 182, 0], [250, 182, 1]]),
      x("x2", [[392, 236, 0], [376, 206, 0.34], [352, 300, 1]]),
    ],
    ball: [{ until: 0.56, actor: "1" }, { until: 1, actor: "2" }],
  },
  giveAndGo: {
    label: "The guard passes to the wing, cuts hard to the basket, and gets the ball back.",
    actors: [
      o("1", [[250, 150, 0], [250, 150, 0.22], [292, 262, 0.6], [272, 378, 0.9], [272, 378, 1]]),
      o("2", [[428, 250, 0], [428, 250, 1]]),
      x("x1", [[250, 182, 0], [286, 190, 0.4], [292, 250, 0.75], [286, 330, 1]]),
      x("x2", [[400, 262, 0], [400, 262, 1]]),
    ],
    ball: [{ until: 0.2, actor: "1" }, { until: 0.66, actor: "2" }, { until: 1, actor: "1" }],
  },
  curl: {
    label: "The cutter comes off the screen tight and bends toward the basket.",
    actors: [
      o("1", [[250, 150, 0], [250, 150, 1]]),
      o("5", [[378, 262, 0], [372, 318, 0.28], [372, 318, 1]]),
      o("2", [[448, 392, 0], [448, 392, 0.15], [408, 318, 0.4], [380, 278, 0.58], [304, 332, 0.88], [304, 332, 1]]),
      x("x2", [[430, 378, 0], [430, 378, 0.22], [404, 330, 0.52], [384, 288, 0.72], [340, 304, 1]]),
      x("x5", [[360, 290, 0], [352, 300, 1]]),
    ],
    ball: [{ until: 0.78, actor: "1" }, { until: 1, actor: "2" }],
    screens: [{ t: 0.3, actor: "5" }],
  },
  chase: {
    label: "The cutter runs off a screen and the defender has to trail around it and recover from behind.",
    actors: [
      o("1", [[250, 150, 0], [250, 150, 1]]),
      o("5", [[378, 262, 0], [372, 318, 0.28], [372, 318, 1]]),
      o("2", [[448, 392, 0], [448, 392, 0.12], [412, 320, 0.4], [392, 262, 0.6], [345, 185, 0.9], [345, 185, 1]]),
      x("x2", [[436, 400, 0], [436, 400, 0.2], [414, 330, 0.56], [394, 270, 0.78], [366, 222, 1]]),
      x("x5", [[360, 290, 0], [356, 296, 1]]),
    ],
    ball: [{ until: 0.86, actor: "1" }, { until: 1, actor: "2" }],
    screens: [{ t: 0.32, actor: "5" }],
  },
  kick: {
    label: "The drive pulls in the help defender, and the ball is passed out to the open shooter in the corner.",
    actors: [
      o("1", [[335, 168, 0], [335, 168, 0.15], [330, 318, 0.58], [330, 318, 1]]),
      o("3", [[484, 420, 0], [484, 420, 1]]),
      x("x1", [[328, 198, 0], [352, 236, 0.4], [352, 300, 0.7], [348, 306, 1]]),
      x("x3", [[452, 398, 0], [452, 398, 0.25], [372, 356, 0.58], [420, 388, 1]]),
    ],
    ball: [{ until: 0.62, actor: "1" }, { until: 1, actor: "3" }],
  },
  roll: {
    label: "The big sets a ball screen, then cuts to the basket and catches the pass.",
    actors: [
      o("1", [[250, 150, 0], [250, 150, 0.28], [322, 188, 0.6], [338, 252, 1]]),
      o("5", [[315, 275, 0], [288, 168, 0.26], [288, 168, 0.48], [268, 372, 1]]),
      x("x1", [[250, 182, 0], [262, 184, 0.3], [300, 205, 0.65], [322, 236, 1]]),
      x("x5", [[308, 300, 0], [304, 318, 0.5], [298, 342, 1]]),
    ],
    ball: [{ until: 0.84, actor: "1" }, { until: 1, actor: "5" }],
    screens: [{ t: 0.27, actor: "5" }],
  },
  pop: {
    label: "The big sets a ball screen, then steps out to the perimeter for the pass.",
    actors: [
      o("1", [[250, 150, 0], [250, 150, 0.28], [330, 196, 0.6], [352, 262, 1]]),
      o("5", [[315, 275, 0], [288, 168, 0.26], [288, 168, 0.48], [212, 150, 0.9], [212, 150, 1]]),
      x("x1", [[250, 182, 0], [262, 184, 0.3], [306, 212, 0.65], [334, 246, 1]]),
      x("x5", [[308, 300, 0], [318, 300, 0.6], [330, 300, 1]]),
    ],
    ball: [{ until: 0.82, actor: "1" }, { until: 1, actor: "5" }],
    screens: [{ t: 0.27, actor: "5" }],
  },
  slip: {
    label: "The big fakes the screen and cuts to the basket before making contact.",
    actors: [
      o("1", [[250, 150, 0], [250, 150, 0.3], [232, 152, 0.6], [232, 152, 1]]),
      o("5", [[315, 275, 0], [292, 188, 0.34], [270, 376, 0.82], [270, 376, 1]]),
      x("x1", [[250, 182, 0], [240, 184, 1]]),
      x("x5", [[308, 300, 0], [296, 212, 0.34], [282, 178, 0.5], [285, 240, 1]]),
    ],
    ball: [{ until: 0.56, actor: "1" }, { until: 1, actor: "5" }],
  },
  dho: {
    label: "The big hands the ball to a teammate running past, who turns the corner.",
    actors: [
      o("5", [[250, 160, 0], [250, 160, 1]]),
      o("2", [[428, 250, 0], [292, 152, 0.52], [196, 186, 0.82], [176, 250, 1]]),
      x("x2", [[402, 238, 0], [312, 170, 0.55], [262, 178, 0.8], [214, 214, 1]]),
      x("x5", [[250, 196, 0], [264, 238, 1]]),
    ],
    ball: [{ until: 0.52, actor: "5" }, { until: 1, actor: "2" }],
    screens: [{ t: 0.56, actor: "5" }],
  },
  pindown: {
    label: "A screen set down toward the baseline lets a shooter come up to the perimeter for the pass.",
    actors: [
      o("1", [[250, 150, 0], [250, 150, 1]]),
      o("5", [[352, 250, 0], [338, 338, 0.28], [338, 338, 1]]),
      o("2", [[348, 402, 0], [348, 402, 0.2], [358, 330, 0.45], [410, 228, 0.8], [410, 228, 1]]),
      x("x2", [[332, 392, 0], [332, 392, 0.25], [338, 364, 0.55], [374, 290, 1]]),
      x("x5", [[340, 278, 0], [346, 300, 1]]),
    ],
    ball: [{ until: 0.7, actor: "1" }, { until: 1, actor: "2" }],
    screens: [{ t: 0.3, actor: "5" }],
  },
  flare: {
    label: "A screen lets the shooter fade away from the ball, and the pass is thrown over the top.",
    actors: [
      o("1", [[150, 172, 0], [150, 172, 1]]),
      o("2", [[292, 152, 0], [292, 152, 0.3], [424, 246, 0.72], [424, 246, 1]]),
      o("5", [[318, 278, 0], [330, 206, 0.3], [330, 206, 1]]),
      x("x1", [[162, 200, 0], [162, 200, 1]]),
      x("x2", [[272, 184, 0], [272, 184, 0.3], [316, 198, 0.52], [318, 200, 0.7], [378, 236, 1]]),
    ],
    ball: [{ until: 0.58, actor: "1" }, { until: 1, actor: "2" }],
    screens: [{ t: 0.36, actor: "5" }],
  },
  ghost: {
    label: "A player sprints up as if to screen, then leaves for open space before making contact.",
    actors: [
      o("1", [[250, 150, 0], [250, 150, 0.35], [205, 162, 0.75], [205, 162, 1]]),
      o("2", [[335, 285, 0], [284, 172, 0.38], [404, 205, 0.82], [404, 205, 1]]),
      x("x1", [[250, 182, 0], [232, 188, 0.75], [228, 190, 1]]),
      x("x2", [[322, 300, 0], [286, 200, 0.4], [278, 186, 0.6], [310, 196, 1]]),
    ],
    ball: [{ until: 0.7, actor: "1" }, { until: 1, actor: "2" }],
  },
  closeout: {
    label: "The ball is passed to the corner and the defender sprints out under control to contest.",
    actors: [
      o("1", [[250, 150, 0], [250, 150, 1]]),
      o("3", [[484, 420, 0], [484, 420, 1]]),
      x("x1", [[250, 182, 0], [262, 190, 1]]),
      x("x3", [[362, 352, 0], [362, 352, 0.3], [440, 400, 0.78], [456, 410, 1]]),
    ],
    ball: [{ until: 0.24, actor: "1" }, { until: 1, actor: "3" }],
  },
  switch: {
    label: "On the ball screen, the two defenders trade who they are guarding.",
    actors: [
      o("1", [[250, 150, 0], [250, 150, 0.28], [326, 186, 0.62], [352, 236, 1]]),
      o("5", [[315, 275, 0], [288, 168, 0.26], [288, 168, 0.5], [290, 292, 1]]),
      x("x1", [[250, 182, 0], [268, 186, 0.4], [276, 214, 0.7], [266, 276, 1]]),
      x("x5", [[308, 236, 0], [306, 214, 0.3], [326, 216, 0.62], [346, 262, 1]]),
    ],
    ball: [{ until: 1, actor: "1" }],
    screens: [{ t: 0.27, actor: "5" }],
  },
  drop: {
    label: "On the ball screen, the big defender stays back near the paint to protect the rim.",
    actors: [
      o("1", [[250, 150, 0], [250, 150, 0.28], [322, 190, 0.62], [326, 250, 1]]),
      o("5", [[315, 275, 0], [288, 168, 0.26], [288, 168, 0.5], [282, 322, 1]]),
      x("x1", [[250, 182, 0], [262, 172, 0.4], [300, 186, 0.7], [318, 224, 1]]),
      x("x5", [[306, 292, 0], [302, 330, 0.6], [298, 352, 1]]),
    ],
    ball: [{ until: 1, actor: "1" }],
    screens: [{ t: 0.27, actor: "5" }],
  },
  hedge: {
    label: "The screener's defender jumps out to slow the ballhandler, then recovers to the big.",
    actors: [
      o("1", [[250, 150, 0], [250, 150, 0.28], [312, 146, 0.5], [384, 160, 0.8], [384, 160, 1]]),
      o("5", [[315, 275, 0], [288, 168, 0.26], [288, 168, 0.55], [278, 286, 1]]),
      x("x1", [[250, 182, 0], [266, 188, 0.45], [352, 186, 1]]),
      x("x5", [[306, 236, 0], [300, 200, 0.28], [340, 170, 0.52], [340, 170, 0.66], [290, 306, 1]]),
    ],
    ball: [{ until: 1, actor: "1" }],
    screens: [{ t: 0.27, actor: "5" }],
  },
  stagger: {
    label: "The shooter runs off two screens in a row and catches the pass at the top.",
    actors: [
      o("1", [[335, 168, 0], [335, 168, 1]]),
      o("4", [[92, 352, 0], [92, 352, 1]]),
      o("5", [[142, 258, 0], [142, 258, 1]]),
      o("2", [[22, 420, 0], [22, 420, 0.12], [72, 338, 0.36], [122, 244, 0.6], [212, 158, 0.88], [212, 158, 1]]),
      x("x2", [[52, 408, 0], [52, 408, 0.2], [84, 372, 0.5], [128, 290, 0.78], [178, 214, 1]]),
    ],
    ball: [{ until: 0.78, actor: "1" }, { until: 1, actor: "2" }],
    screens: [{ t: 0.36, actor: "4" }, { t: 0.6, actor: "5" }],
  },
  elevator: {
    label: "The shooter runs between two screeners, who close the gap behind like elevator doors.",
    actors: [
      o("1", [[72, 250, 0], [72, 250, 1]]),
      o("4", [[214, 228, 0], [214, 228, 0.56], [237, 228, 0.7], [237, 228, 1]]),
      o("5", [[286, 228, 0], [286, 228, 0.56], [263, 228, 0.7], [263, 228, 1]]),
      o("2", [[250, 372, 0], [250, 372, 0.15], [250, 150, 0.62], [250, 150, 1]]),
      x("x2", [[250, 396, 0], [250, 396, 0.22], [250, 262, 0.7], [250, 256, 1]]),
    ],
    ball: [{ until: 0.7, actor: "1" }, { until: 1, actor: "2" }],
    screens: [{ t: 0.68, actor: "4" }, { t: 0.68, actor: "5" }],
  },
  spain: {
    label: "A pick-and-roll with a surprise backscreen on the defender guarding the roller.",
    actors: [
      o("1", [[250, 150, 0], [250, 150, 0.24], [322, 188, 0.55], [336, 244, 1]]),
      o("5", [[315, 275, 0], [288, 168, 0.22], [288, 168, 0.42], [262, 376, 0.95], [262, 376, 1]]),
      o("2", [[252, 352, 0], [252, 352, 0.3], [292, 306, 0.52], [292, 306, 0.64], [222, 150, 1]]),
      x("x1", [[250, 182, 0], [262, 184, 0.3], [298, 204, 0.6], [318, 232, 1]]),
      x("x5", [[312, 286, 0], [310, 290, 0.5], [308, 292, 1]]),
      x("x2", [[236, 378, 0], [236, 378, 0.5], [262, 344, 1]]),
    ],
    ball: [{ until: 0.84, actor: "1" }, { until: 1, actor: "5" }],
    screens: [{ t: 0.23, actor: "5" }, { t: 0.54, actor: "2" }],
  },
  doubleDrag: {
    label: "The ballhandler uses two ball screens back to back. One screener pops and the other rolls.",
    actors: [
      o("1", [[122, 150, 0], [186, 138, 0.28], [258, 142, 0.52], [338, 188, 0.8], [350, 244, 1]]),
      o("4", [[200, 170, 0], [200, 170, 0.36], [150, 168, 0.8], [150, 168, 1]]),
      o("5", [[272, 176, 0], [272, 176, 0.6], [268, 372, 1]]),
      x("x1", [[136, 180, 0], [188, 160, 0.38], [262, 172, 0.68], [320, 220, 1]]),
    ],
    ball: [{ until: 1, actor: "1" }],
    screens: [{ t: 0.3, actor: "4" }, { t: 0.54, actor: "5" }],
  },
  hammer: {
    label: "While the ball drives baseline, a weakside screen frees a shooter in the far corner.",
    actors: [
      o("1", [[428, 250, 0], [428, 250, 0.12], [424, 398, 0.6], [424, 398, 1]]),
      o("3", [[72, 250, 0], [72, 250, 0.3], [20, 418, 0.66], [20, 418, 1]]),
      o("5", [[185, 385, 0], [70, 338, 0.38], [70, 338, 1]]),
      x("x1", [[404, 268, 0], [400, 330, 0.4], [398, 392, 0.7], [398, 392, 1]]),
      x("x3", [[120, 296, 0], [120, 296, 0.34], [86, 328, 0.5], [86, 330, 0.8], [52, 386, 1]]),
    ],
    ball: [{ until: 0.66, actor: "1" }, { until: 1, actor: "3" }],
    screens: [{ t: 0.42, actor: "5" }],
  },
  zipper: {
    label: "A down screen brings a player straight up from the block to the top for the pass.",
    actors: [
      o("1", [[428, 250, 0], [428, 250, 1]]),
      o("5", [[334, 268, 0], [322, 312, 0.24], [322, 312, 1]]),
      o("2", [[320, 398, 0], [320, 398, 0.15], [300, 300, 0.42], [288, 152, 0.74], [288, 152, 1]]),
      x("x2", [[300, 386, 0], [300, 386, 0.2], [312, 338, 0.5], [304, 250, 0.8], [296, 196, 1]]),
    ],
    ball: [{ until: 0.74, actor: "1" }, { until: 1, actor: "2" }],
    screens: [{ t: 0.3, actor: "5" }],
  },
} satisfies Record<string, Diagram>;

export type DiagramKey = keyof typeof diagrams;

// Which diagram goes with which term. Terms are matched without anything in parentheses,
// so "Backcut (Backdoor)" in the glossary finds "Backcut" here.
const byTerm: Record<string, DiagramKey> = {
  Backcut: "backcut",
  "Give-and-Go": "giveAndGo",
  Curl: "curl",
  Chase: "chase",
  "Chase Screen": "chase",
  Kick: "kick",
  "Ball Screen": "roll",
  "Pick-and-Roll": "roll",
  Roll: "roll",
  "Pick-and-Pop": "pop",
  Pop: "pop",
  Slip: "slip",
  DHO: "dho",
  "Down Screen": "pindown",
  Pindown: "pindown",
  Down: "pindown",
  Flare: "flare",
  Ghost: "ghost",
  Closeout: "closeout",
  Switch: "switch",
  Drop: "drop",
  Hedge: "hedge",
  Stagger: "stagger",
  Elevator: "elevator",
  Spain: "spain",
  "Double Drag": "doubleDrag",
  Hammer: "hammer",
  Zipper: "zipper",
};

export function diagramFor(term: string): DiagramKey | null {
  return byTerm[term.replace(/\s*\(.*\)\s*$/, "")] ?? null;
}
