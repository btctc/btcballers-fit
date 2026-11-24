// Film Room: the play runs, freezes, and the player picks the right read.
// Reads come in pairs. The play is the same and one player changes, so the answer changes.
// Players are described by type, never by a real or made-up name. "name" is the short label
// shown on the court and "trait" is the sentence on the card.

import type { Point, Stop } from "@/lib/courtMath";
import type { StageActor } from "@/components/CourtStage";

export type ReadOption = {
  label: string;
  to: Point | string; // where the arrow points: a spot on the court or a player id
  bend?: number; // how much the arrow curves, and which way
  outcome: {
    moves?: { actor: string; to: Point }[]; // players who move after the choice
    ballTo?: Point[]; // where the ball goes. Leave out and it stays with whoever has it.
    text: string; // what happened, shown on the court
    at: Point;
  };
};

export type Read = {
  id: string;
  action: string; // "Ball screen"
  side: "offense" | "defense"; // which side the player is deciding for
  ask: string;
  star: { actor: string; name: string; role: string; trait: string }; // the player who changes the answer
  you: string; // the player the viewer is deciding for
  actors: StageActor[];
  ball: { until: number; actor: string }[];
  screens?: { t: number; actor: string }[];
  options: ReadOption[];
  best: number;
  why: string;
};

const o = (id: string, path: Stop[]): StageActor => ({ id, team: "offense", path });
const x = (id: string, path: Stop[]): StageActor => ({ id, team: "defense", path });
const RIM: Point = [250, 413];

// ---------- Ball screen: where is their big? ----------

const ballScreenBase = {
  action: "Ball screen",
  side: "offense" as const,
  ask: "You have the ball coming off the screen. What is the read?",
  you: "1",
  ball: [{ until: 1, actor: "1" }],
  screens: [{ t: 0.3, actor: "5" }],
};

const ballScreenDrop: Read = {
  ...ballScreenBase,
  id: "ball-screen-drop",
  star: {
    actor: "x5",
    name: "Shot blocker",
    role: "Their big",
    trait: "A 7-footer who blocks everything. He sits back and waits at the rim.",
  },
  actors: [
    o("1", [[250, 150, 0], [250, 150, 0.3], [322, 190, 0.7], [326, 246, 1]]),
    o("5", [[315, 275, 0], [288, 168, 0.28], [288, 168, 0.55], [276, 316, 1]]),
    o("3", [[484, 420, 0], [484, 420, 1]]),
    x("x1", [[250, 182, 0], [262, 172, 0.4], [300, 186, 0.75], [312, 220, 1]]),
    x("x5", [[306, 292, 0], [302, 330, 0.6], [286, 362, 1]]),
    x("x3", [[452, 398, 0], [452, 398, 1]]),
  ],
  options: [
    {
      label: "Pull-up jumper",
      to: RIM,
      bend: 46,
      outcome: { ballTo: [RIM], text: "Bucket.", at: [250, 384] },
    },
    {
      label: "Hit the roller",
      to: "5",
      bend: -18,
      outcome: { ballTo: [[287, 326], [282, 352]], text: "Blocked.", at: [286, 338] },
    },
    {
      label: "Skip to the corner",
      to: "3",
      bend: -40,
      outcome: { moves: [{ actor: "x3", to: [470, 408] }], ballTo: [[495, 430]], text: "Covered. No shot.", at: [440, 388] },
    },
  ],
  best: 0,
  why: "The shot blocker is waiting at the rim, so the roll is covered. The pull-up is the open shot.",
};

const ballScreenUp: Read = {
  ...ballScreenBase,
  id: "ball-screen-up",
  star: {
    actor: "x5",
    name: "Quick big",
    role: "Their big",
    trait: "Quick feet. He comes all the way up to the ball.",
  },
  actors: [
    o("1", [[250, 150, 0], [250, 150, 0.3], [322, 190, 0.7], [326, 246, 1]]),
    o("5", [[315, 275, 0], [288, 168, 0.28], [288, 168, 0.55], [268, 330, 1]]),
    o("3", [[484, 420, 0], [484, 420, 1]]),
    x("x1", [[250, 182, 0], [262, 172, 0.4], [296, 182, 0.75], [300, 214, 1]]),
    x("x5", [[306, 236, 0], [304, 204, 0.3], [344, 200, 0.7], [352, 250, 1]]),
    x("x3", [[452, 398, 0], [452, 398, 1]]),
  ],
  options: [
    {
      label: "Pull-up jumper",
      to: RIM,
      bend: 46,
      outcome: { ballTo: [[306, 318]], text: "Contested. Miss.", at: [330, 290] },
    },
    {
      label: "Hit the roller",
      to: "5",
      bend: -18,
      outcome: { moves: [{ actor: "5", to: [258, 386] }], ballTo: [[279, 340], RIM], text: "Bucket.", at: [250, 384] },
    },
    {
      label: "Skip to the corner",
      to: "3",
      bend: -40,
      outcome: { moves: [{ actor: "x3", to: [470, 408] }], ballTo: [[495, 430]], text: "Covered. No shot.", at: [440, 388] },
    },
  ],
  best: 1,
  why: "Their big came up to the ball, so nobody is protecting the rim. Hit the roller behind him.",
};

// ---------- Closeout: who is catching it? ----------

const closeoutBase = {
  action: "Closeout",
  side: "defense" as const,
  ask: "The ball is on its way to the corner. How do you close out?",
  you: "x3",
  actors: [
    o("1", [[250, 150, 0], [250, 150, 1]]),
    o("3", [[484, 420, 0], [484, 420, 1]]),
    x("x1", [[250, 182, 0], [258, 190, 1]]),
    x("x3", [[318, 392, 0], [296, 362, 0.6], [296, 362, 1]]),
  ],
  ball: [{ until: 0.55, actor: "1" }, { until: 1, actor: "3" }],
};

const closeoutShooter: Read = {
  ...closeoutBase,
  id: "closeout-shooter",
  star: {
    actor: "3",
    name: "Elite shooter",
    role: "In the corner",
    trait: "The best shooter on the floor. Give him space and it is three points.",
  },
  options: [
    {
      label: "Sprint out and take away the three",
      to: [454, 408],
      bend: -40,
      outcome: { moves: [{ actor: "x3", to: [454, 408] }], text: "No three. Great closeout.", at: [420, 372] },
    },
    {
      label: "Close out short and wall off the drive",
      to: [396, 388],
      bend: 38,
      outcome: { moves: [{ actor: "x3", to: [396, 388] }], ballTo: [RIM], text: "Splash. Too much space.", at: [250, 384] },
    },
    {
      label: "Stay in the paint",
      to: [246, 386],
      bend: 0,
      outcome: { moves: [{ actor: "x3", to: [246, 386] }], ballTo: [RIM], text: "Splash. Wide open.", at: [250, 384] },
    },
  ],
  best: 0,
  why: "You never give a great shooter an open three. Take it away and make him drive into your help.",
};

const closeoutDriver: Read = {
  ...closeoutBase,
  id: "closeout-driver",
  star: {
    actor: "3",
    name: "Power driver",
    role: "In the corner",
    trait: "Big, strong, and unstoppable going to the rim. He would rather drive than shoot the three.",
  },
  options: [
    {
      label: "Sprint out and take away the three",
      to: [454, 408],
      bend: -40,
      outcome: {
        moves: [{ actor: "x3", to: [454, 408] }, { actor: "3", to: [300, 404] }],
        ballTo: [[311, 414], RIM],
        text: "He blew right by you.",
        at: [330, 372],
      },
    },
    {
      label: "Close out short and wall off the drive",
      to: [396, 388],
      bend: 38,
      outcome: { moves: [{ actor: "x3", to: [396, 388] }], text: "You stayed in front. Good.", at: [400, 356] },
    },
    {
      label: "Stay in the paint",
      to: [246, 386],
      bend: 0,
      outcome: {
        moves: [{ actor: "x3", to: [246, 386] }, { actor: "3", to: [372, 410] }],
        ballTo: [[383, 420], RIM],
        text: "Too much of a running start.",
        at: [330, 366],
      },
    },
  ],
  best: 1,
  why: "A driver wants the lane. Stay in front with your hands up and make him shoot from outside.",
};

// ---------- Guarding the ball screen: over or under? ----------

const overUnderBase = {
  action: "Guarding the ball screen",
  side: "defense" as const,
  ask: "You are guarding the ball and a screen is coming. How do you get through it?",
  you: "x1",
  actors: [
    o("1", [[226, 150, 0], [226, 150, 0.5], [238, 150, 1]]),
    o("5", [[322, 280, 0], [302, 190, 0.7], [302, 190, 1]]),
    x("x1", [[226, 186, 0], [226, 186, 0.5], [238, 190, 1]]),
    x("x5", [[318, 306, 0], [312, 272, 1]]),
  ],
  ball: [{ until: 1, actor: "1" }],
  screens: [{ t: 0.74, actor: "5" }],
};

const OVER: Point = [356, 146];
const UNDER: Point = [356, 240];
const STAY: Point = [196, 262];

const overUnderShooter: Read = {
  ...overUnderBase,
  id: "over-under-shooter",
  star: {
    actor: "1",
    name: "Deep shooter",
    role: "With the ball",
    trait: "Deep range. He will pull up from way behind the line.",
  },
  options: [
    {
      label: "Go over the screen and stay attached",
      to: OVER,
      bend: -30,
      outcome: {
        moves: [{ actor: "x1", to: [348, 160] }, { actor: "1", to: [366, 190] }],
        ballTo: [[377, 200]],
        text: "No room to shoot. Good.",
        at: [362, 178],
      },
    },
    {
      label: "Go under the screen",
      to: UNDER,
      bend: 34,
      outcome: {
        moves: [{ actor: "x1", to: UNDER }, { actor: "1", to: [346, 156] }],
        ballTo: [[357, 166], RIM],
        text: "Splash. You gave him the three.",
        at: [250, 384],
      },
    },
    {
      label: "Stay where you are",
      to: STAY,
      bend: 0,
      outcome: {
        moves: [{ actor: "x1", to: STAY }, { actor: "1", to: [346, 156] }],
        ballTo: [[357, 166], RIM],
        text: "Splash. Wide open three.",
        at: [250, 384],
      },
    },
  ],
  best: 0,
  why: "He can shoot from anywhere. Fight over the screen so he never gets a clean look.",
};

const overUnderDriver: Read = {
  ...overUnderBase,
  id: "over-under-driver",
  star: {
    actor: "1",
    name: "Explosive driver",
    role: "With the ball",
    trait: "Lightning fast off the dribble. He wants the rim, not the three.",
  },
  options: [
    {
      label: "Go over the screen and stay attached",
      to: OVER,
      bend: -30,
      outcome: {
        moves: [{ actor: "x1", to: [344, 166] }, { actor: "1", to: [296, 372] }],
        ballTo: [[307, 382], RIM],
        text: "He turned the corner. Layup.",
        at: [250, 384],
      },
    },
    {
      label: "Go under the screen",
      to: UNDER,
      bend: 34,
      outcome: {
        moves: [{ actor: "x1", to: UNDER }, { actor: "1", to: [362, 196] }],
        ballTo: [[373, 206]],
        text: "You beat him to the spot.",
        at: [358, 218],
      },
    },
    {
      label: "Stay where you are",
      to: STAY,
      bend: 0,
      outcome: {
        moves: [{ actor: "x1", to: STAY }, { actor: "1", to: [300, 372] }],
        ballTo: [[311, 382], RIM],
        text: "Straight to the rim.",
        at: [250, 384],
      },
    },
  ],
  best: 1,
  why: "He wants to get downhill. Go under the screen and meet him on the other side.",
};

export const reads: Read[] = [
  ballScreenDrop,
  ballScreenUp,
  closeoutShooter,
  closeoutDriver,
  overUnderShooter,
  overUnderDriver,
];
