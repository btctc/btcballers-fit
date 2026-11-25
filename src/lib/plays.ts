// 5 on 5 plays for the Chalkboard section of the playbook.
// Same court as the diagrams: basket at the bottom, 10 units per foot,
// sidelines at x=0 and x=500, baseline at y=462, rim at (250,413).
// Players are numbered the way a coach draws them: 1 point guard, 2 shooting guard,
// 3 small forward, 4 power forward, 5 center.
//
// ACCURACY RULE: every action named in a play must match its published definition
// (The Basketball Action Dictionary and the FIBA Europe terminology guide were used).
// If a title does not say who does what, the play is not built until there is film
// or a step by step description. Nothing here is guessed from a team's version.
//
// A play is written as steps. In each step, "go" says who moves and where:
// [x, y] is a straight line, [viaX, viaY, x, y] bends through a point on the way.

import type { StagePlay } from "@/components/CourtStage";
import type { Stop } from "@/lib/courtMath";

export type Category = "half" | "early" | "ato" | "blob" | "coverages";
export const categories: Record<Category, { name: string; about: string }> = {
  half: { name: "Half court", about: "Set plays against a defense that is back and set." },
  early: { name: "Early offense", about: "Quick actions in transition before the defense gets set." },
  ato: { name: "ATO", about: "After timeout. The play the coach draws on the board in the huddle." },
  blob: { name: "BLOB", about: "Baseline out of bounds. Inbounding the ball under your own basket." },
  coverages: { name: "Coverages", about: "The ways a defense can guard one action, and what each one gives up." },
};

type Go = [number, number] | [number, number, number, number];
export type Step = { say: string; go?: Record<string, Go>; pass?: string; screen?: string[] };
// A read is one way the defense can play it and what that leaves open.
// The first option is the play as drawn. The others replace the steps from "from" on.
// Defenders are x1 to x5. Each one guards the same number and follows that player
// unless a step moves the defender somewhere else to show a coverage.
export type Read = { see: string; open: string; steps?: Step[]; shot?: string };
export type Play = {
  id: string;
  name: string;
  category: Category;
  level: 1 | 2 | 3; // 1 = start here, 3 = most moving parts
  goal: string; // what the play is trying to get
  start: Record<string, [number, number]>;
  ball: string; // who starts with the ball
  steps: Step[];
  shot: string; // who ends up with the shot
  actions: string[]; // the building blocks, in the order they happen
  entry: "Live ball" | "BLOB" | "SLOB"; // how the ball comes into play
  checked?: boolean; // true once Coach T has confirmed it against film
  guards?: Record<string, [number, number]>; // where a defender starts, when not simply guarding their player
  reads?: { from: number; options: Read[] }; // plays with reads also show the defense
};

// Coach T: in Horns the bigs set up higher than the elbows.
const HORNS: Play["start"] = { "1": [250, 135], "2": [480, 420], "3": [20, 420], "4": [188, 226], "5": [312, 226] };
const BOX: Play["start"] = { "1": [180, 275], "2": [320, 275], "3": [310, 486], "4": [320, 392], "5": [180, 392] };

export const plays: Play[] = [
  // ---------- half court ----------
  {
    id: "elbow-scissors",
    name: "Elbow Scissors",
    category: "half",
    level: 1,
    goal: "A layup for a guard cutting off the big at the elbow.",
    start: { "1": [285, 150], "2": [402, 182], "3": [20, 420], "4": [480, 420], "5": [330, 272] },
    ball: "1",
    steps: [
      { say: "1 passes to 5 at the elbow.", pass: "5" },
      { say: "1 cuts first, tight off the outside of 5.", go: { "1": [364, 258, 346, 390] } },
      { say: "2 cuts right behind 1, off the other side of 5. The two cuts cross like scissors.", go: { "2": [300, 258, 266, 388], "x2": [352, 222, 304, 322] } },
      { say: "5 gives the ball to whoever is open. Here it is 2 for the layup.", pass: "2", go: { "2": [252, 398], "x2": [292, 356] } },
    ],
    shot: "2",
    actions: ["Elbow entry", "Scissors cut"],
    entry: "Live ball",
    reads: {
      from: 2,
      options: [
        { see: "The defender on 2 gets caught trailing behind 5", open: "The second cutter gets the ball for a layup" },
        {
          see: "Both cutters are covered and the defender on 5 backs off",
          open: "5 turns and shoots",
          steps: [
            { say: "2 cuts off the other side of 5. This time both cutters are covered, and the defender on 5 backs off into the lane to help.", go: { "2": [300, 258, 266, 388], "x5": [316, 326] } },
            { say: "Nobody is on 5. 5 turns, faces the basket, and shoots." },
          ],
          shot: "5",
        },
        {
          see: "The corner defender on 3 leaves the corner to help on the cutters",
          open: "The pass to 3 in the corner",
          steps: [
            { say: "2 cuts off the other side of 5. This time the defender on 3 leaves the corner and sinks into the lane to take away the layup.", go: { "2": [300, 258, 266, 388], "x3": [150, 400, 226, 384] } },
            { say: "Nobody is on 3. 5 passes to 3 for the open corner three.", pass: "3" },
          ],
          shot: "3",
        },
      ],
    },
  },
  {
    id: "post-splits",
    name: "Post Splits",
    category: "half",
    level: 1,
    goal: "An open three while the defense watches the post.",
    start: { "1": [335, 165], "2": [432, 255], "3": [20, 420], "4": [165, 168], "5": [335, 372] },
    ball: "1",
    steps: [
      { say: "1 passes to 2 on the wing.", pass: "2" },
      { say: "2 passes into 5 in the post.", pass: "5" },
      { say: "2 does not stand and watch. 2 goes and screens for 1. This is the split.", go: { "2": [362, 202] }, screen: ["2"] },
      { say: "1 cuts off the screen out to the wing. On the weak side, 3 and 4 trade places so their defenders cannot help.", go: { "1": [398, 185, 436, 262], "3": [70, 300, 150, 175], "4": [100, 260, 22, 418], "x1": [384, 214] } },
      { say: "5 passes out to 1 for the open three.", pass: "1" },
    ],
    reads: {
      from: 3,
      options: [
        { see: "The defender on 1 gets caught on the screen", open: "The cutter is open on the wing" },
        {
          see: "Both defenders go with the cutter",
          open: "The screener slips to the rim, wide open",
          steps: [
            { say: "1 cuts off the screen. This time the defender on 2 jumps out at 1, and the defender on 1 stays with 1 too. 3 and 4 still trade places on the weak side.", go: { "1": [398, 185, 436, 262], "3": [70, 300, 150, 175], "4": [100, 260, 22, 418], "x2": [416, 274], "x1": [392, 196, 410, 236] } },
            { say: "Two defenders are on 1 and nobody is on 2. 2 slips to the rim and 5 passes to 2 for the layup.", go: { "2": [332, 282, 284, 392], "x2": [418, 272] }, pass: "2" },
          ],
          shot: "2",
        },
        {
          see: "The defender on 3 leaves to trap the post",
          open: "The skip pass to 3 on the weak side",
          steps: [
            { say: "1 cuts off the screen and 3 and 4 trade places. This time the defender on 3 leaves 3 and runs at 5 to trap the post.", go: { "1": [398, 185, 436, 262], "3": [70, 300, 150, 175], "4": [100, 260, 22, 418], "x3": [230, 330, 298, 380] } },
            { say: "5 sees the trap coming. Nobody is on 3, so 5 throws the skip pass to 3 for the open three.", pass: "3" },
          ],
          shot: "3",
        },
      ],
    },
    shot: "1",
    actions: ["Post entry", "Split cut", "Weak side exchange"],
    entry: "Live ball",
  },
  {
    id: "iverson-curl",
    name: "Iverson Curl",
    category: "half",
    level: 1,
    goal: "A layup for a guard who curls when the defender trails.",
    start: { "1": [250, 138], "2": [72, 270], "3": [480, 420], "4": [170, 272], "5": [330, 272] },
    ball: "1",
    steps: [
      { say: "2 runs across the floor over the top of 4 and 5. That is an Iverson cut.", go: { "2": [250, 236, 374, 248] }, screen: ["4", "5"] },
      { say: "The defender is trailing, so 2 curls tight around 5 toward the rim.", go: { "2": [368, 304, 296, 378], "x2": [386, 262, 352, 318] } },
      { say: "1 hits 2 on the curl for the layup.", pass: "2" },
    ],
    shot: "2",
    actions: ["Iverson cut", "Curl"],
    entry: "Live ball",
    reads: {
      from: 1,
      options: [
        { see: "The defender on 2 trails behind over the screens", open: "Curl to the rim" },
        {
          see: "The defender on 2 cuts under the screens and waits in the lane",
          open: "Stop on the wing and shoot",
          steps: [
            { say: "This time the defender on 2 cut under the screens and is waiting in the lane. So 2 does not curl. 2 stops on the wing.", go: { "2": [426, 240], "x2": [358, 296] } },
            { say: "1 passes to 2 for the open shot.", pass: "2" },
          ],
          shot: "2",
        },
        {
          see: "The defender on 5 steps out to stop the curl",
          open: "5 is open rolling to the rim",
          steps: [
            { say: "2 curls around 5. This time the defender on 5 steps out and takes 2.", go: { "2": [368, 304, 310, 350], "x2": [386, 262, 356, 306], "x5": [322, 326] } },
            { say: "Nobody is on 5. 5 rolls to the rim and 1 passes to 5.", go: { "5": [286, 372], "x5": [318, 330] }, pass: "5" },
          ],
          shot: "5",
        },
      ],
    },
  },
  {
    id: "zoom",
    name: "Zoom Action",
    category: "half",
    level: 2,
    goal: "A guard catching the ball on the run, going downhill.",
    start: { "1": [165, 168], "2": [480, 420], "3": [20, 420], "4": [420, 270], "5": [300, 190] },
    ball: "1",
    steps: [
      { say: "1 passes to 5 at the top.", pass: "5" },
      { say: "4 sets a pindown for 2 in the corner.", go: { "4": [450, 358] }, screen: ["4"] },
      { say: "2 sprints off the screen, and 5 dribbles over to meet 2.", go: { "5": [322, 188], "2": [432, 300, 346, 212], "x2": [444, 318, 374, 238] } },
      { say: "5 hands the ball to 2. A pindown into a handoff is Zoom. Some coaches call it Chicago.", pass: "2" },
      { say: "2 turns the corner and attacks. 5 rolls to the rim.", go: { "2": [262, 232, 212, 342], "5": [300, 372], "x2": [262, 262] } },
    ],
    shot: "2",
    actions: ["Pindown", "Handoff", "Roll"],
    entry: "Live ball",
    reads: {
      from: 2,
      options: [
        { see: "The defender on 2 trails over the top", open: "Turn the corner and attack" },
        {
          see: "The defender on 2 cuts under the handoff",
          open: "Stop behind the handoff and shoot",
          steps: [
            { say: "2 sprints off the screen. This time the defender cuts under everything to meet 2 on the other side.", go: { "5": [322, 188], "2": [432, 300, 346, 212], "x2": [400, 330, 318, 256] } },
            { say: "5 hands the ball to 2.", pass: "2" },
            { say: "The defender is under the handoff, so nobody is on the ball. 2 stops behind 5 and shoots.", go: { "2": [322, 192], "x2": [300, 238] } },
          ],
          shot: "2",
        },
        {
          see: "The defender on 5 steps up to take 2 on the handoff",
          open: "5 fakes the handoff, keeps it, and drives",
          steps: [
            { say: "2 sprints off the screen at 5. This time the defender on 5 steps up to take 2 on the handoff.", go: { "5": [322, 188], "2": [432, 300, 346, 212], "x2": [444, 318, 374, 238], "x5": [334, 226] } },
            { say: "5 sees it, fakes the handoff, and keeps the ball. That is a keep." },
            { say: "Nobody is between 5 and the rim. 5 drives for the layup.", go: { "5": [280, 280, 268, 384], "x5": [330, 228] } },
          ],
          shot: "5",
        },
      ],
    },
  },
  {
    id: "horns-flare-dive",
    name: "Horns Flare Dive",
    category: "half",
    level: 2,
    goal: "A lob at the rim for the big.",
    start: HORNS,
    ball: "1",
    steps: [
      { say: "Horns. 4 steps up and sets a ball screen for 1.", go: { "4": [214, 182] }, screen: ["4"] },
      { say: "1 dribbles off the screen to the left wing.", go: { "1": [196, 148, 108, 216] } },
      { say: "5 sets a flare screen for 4.", go: { "5": [266, 216] }, screen: ["5"] },
      { say: "4 fades off the flare and 1 throws it back to 4.", go: { "4": [300, 172, 352, 170], "x4": [262, 226] }, pass: "4" },
      { say: "5 dives hard to the rim. 4 throws it to the front of the rim.", go: { "5": [268, 300, 262, 390], "x5": [326, 196] }, pass: "5" },
    ],
    shot: "5",
    actions: ["Horns", "Ball screen", "Flare screen", "Dive"],
    entry: "Live ball",
    reads: {
      from: 4,
      options: [
        { see: "The defender on 5 jumps out at 4 to stop the shot", open: "The lob to 5 at the rim" },
        {
          see: "The defender on 5 stays with 5 on the dive",
          open: "4 shoots the open three",
          steps: [
            { say: "5 dives to the rim. This time the defender on 5 goes with 5, and the defender on 4 is still stuck on the flare screen.", go: { "5": [268, 300, 262, 390] } },
            { say: "Nobody can get to 4. 4 shoots the open three." },
          ],
          shot: "4",
        },
        {
          see: "The corner defender on 2 leaves the corner to stop the lob",
          open: "The pass to 2 in the corner",
          steps: [
            { say: "5 dives to the rim and the defender on 5 jumps out at 4. This time the corner defender on 2 leaves the corner and takes 5.", go: { "5": [268, 300, 262, 390], "x5": [326, 196], "x2": [400, 404, 300, 378] } },
            { say: "Nobody is on 2. 4 passes to 2 for the corner three.", pass: "2" },
          ],
          shot: "2",
        },
      ],
    },
  },
  {
    id: "horns-twist",
    name: "Horns Twist",
    category: "half",
    level: 2,
    goal: "A drive off a second ball screen the defense is not ready for.",
    start: HORNS,
    ball: "1",
    steps: [
      { say: "Horns. 5 steps up and screens for 1.", go: { "5": [290, 178] }, screen: ["5"] },
      { say: "1 dribbles right off the screen and drags it out toward the sideline.", go: { "1": [318, 150, 372, 196] } },
      { say: "Twist. 4, the other big, comes from the middle and sets a second ball screen facing the other way.", go: { "4": [338, 226] }, screen: ["4"] },
      { say: "1 turns back and comes off 4 toward the middle. 4 rolls. 5, the first screener, pops out.", go: { "x1": [344, 236, 300, 296], "1": [300, 236, 236, 330], "4": [330, 310, 318, 396], "5": [300, 150] } },
      { say: "Two ball screens from two bigs in opposite directions. 1 finishes at the rim.", go: { "x1": [270, 352], "1": [240, 394] } },
    ],
    shot: "1",
    actions: ["Horns", "Ball screen", "Twist"],
    entry: "Live ball",
    reads: {
      from: 3,
      options: [
        { see: "The defender on 4 stays with 4 on the roll", open: "1 finishes at the rim" },
        {
          see: "The defender on 4 steps up to stop the ball",
          open: "The pass to 4 rolling to the rim",
          steps: [
            { say: "1 comes off 4 toward the middle and 4 rolls. This time the defender on 4 steps up to stop the ball.", go: { "1": [300, 236, 250, 300], "4": [330, 310, 318, 396], "5": [300, 150], "x1": [344, 236, 302, 282], "x4": [258, 334] } },
            { say: "Nobody is on 4. 1 drops the pass to 4 for the layup.", pass: "4" },
          ],
          shot: "4",
        },
        {
          see: "The defender on 5 leaves 5 to help in the lane",
          open: "Throw it back to 5 at the top",
          steps: [
            { say: "1 comes off 4 toward the middle and 5 pops to the top. This time the defender on 5 stays in the lane to help.", go: { "1": [300, 236, 250, 300], "4": [330, 310, 318, 396], "5": [300, 150], "x1": [344, 236, 302, 282], "x5": [264, 322] } },
            { say: "Nobody is on 5. 1 throws it back to 5 for the open three.", pass: "5" },
          ],
          shot: "5",
        },
      ],
    },
  },
  {
    id: "spain",
    name: "Spain Pick and Roll",
    category: "half",
    level: 2,
    goal: "A lob for the roller, or a three for the back screener.",
    start: { "1": [250, 135], "2": [250, 335], "3": [20, 420], "4": [480, 420], "5": [325, 265] },
    ball: "1",
    steps: [
      { say: "5 sets a high ball screen for 1.", go: { "5": [290, 176] }, screen: ["5"] },
      { say: "1 dribbles right off the screen.", go: { "1": [322, 150, 362, 202], "x5": [310, 232], "x1": [300, 150, 340, 190] } },
      { say: "2 sets a back screen on the defender guarding 5. This is what makes it Spain. Some coaches call it Stack.", go: { "2": [286, 252] }, screen: ["2"] },
      { say: "5 rolls to the rim behind that screen. 2 pops out to the top.", go: { "5": [304, 292, 264, 388], "2": [250, 160], "x5": [300, 246] } },
      { say: "1 throws the lob to 5. If the help comes, 2 is open for three.", pass: "5" },
    ],
    shot: "5",
    actions: ["Ball screen", "Back screen", "Roll", "Pop"],
    entry: "Live ball",
    reads: {
      from: 3,
      options: [
        { see: "The defender on 2 follows 2 out to the top", open: "The lob to the roller" },
        {
          see: "The defender on 2 stays in the lane to take the roller",
          open: "The back screener is open for three",
          steps: [
            { say: "5 rolls and 2 pops. This time the defender on 2 stays in the lane to stop the lob.", go: { "5": [304, 292, 264, 388], "2": [250, 160], "x5": [300, 246], "x2": [262, 356] } },
            { say: "That leaves 2 alone at the top. 1 passes to 2 for three.", pass: "2" },
          ],
          shot: "2",
        },
        {
          see: "The corner defender on 4 leaves the corner to take the roller",
          open: "The kick to 4 in the corner",
          steps: [
            { say: "5 rolls and 2 pops. This time the defender on 4 leaves the corner and steps in front of the roller.", go: { "5": [304, 292, 264, 388], "2": [250, 160], "x5": [300, 246], "x4": [360, 400, 296, 376] } },
            { say: "Nobody is on 4. 1 kicks it to 4 for the corner three.", pass: "4" },
          ],
          shot: "4",
        },
      ],
    },
  },
  {
    id: "stagger-twirl",
    name: "Stagger Twirl",
    category: "half",
    level: 3,
    goal: "A three for the first screener while the defense chases the shooter.",
    start: { "1": [165, 168], "2": [480, 420], "3": [20, 420], "4": [448, 348], "5": [404, 244] },
    ball: "1",
    steps: [
      { say: "4 and 5 set a stagger for 2. Two screens, one after the other.", go: { "4": [446, 354] }, screen: ["4", "5"] },
      { say: "2 curls tight around the first screen, the one from 4, into the lane.", go: { "x2": [456, 336, 366, 332], "x4": [398, 344], "2": [438, 316, 330, 338] } },
      { say: "Twirl. 4, the first screener, turns and comes off the second screen from 5.", go: { "x4": [376, 334], "4": [432, 268, 368, 180] }, screen: ["5"] },
      { say: "The defense chased 2. 1 passes to 4 for the open three.", pass: "4" },
    ],
    shot: "4",
    actions: ["Stagger", "Curl", "Twirl"],
    entry: "Live ball",
    reads: {
      from: 2,
      options: [
        { see: "The defender on 4 stays in the lane to help on the curl", open: "4 is open for three off the twirl" },
        {
          see: "The defender on 4 leaves the curl and chases 4",
          open: "2 is open in the lane",
          steps: [
            { say: "4 twirls off the screen from 5. This time the defender on 4 leaves the lane and chases 4.", go: { "4": [432, 268, 368, 180], "x4": [424, 300, 386, 208] }, screen: ["5"] },
            { say: "The defender on 2 is still trailing. 1 passes to 2 in the lane.", pass: "2" },
          ],
          shot: "2",
        },
        {
          see: "The defender on 5 jumps out to take 4",
          open: "5 slips to the rim",
          steps: [
            { say: "4 twirls off the screen from 5. This time the defender on 5 jumps out to take 4.", go: { "4": [432, 268, 368, 180], "x4": [376, 334], "x5": [386, 214] }, screen: ["5"] },
            { say: "Nobody is on 5. 5 slips to the rim and 1 passes to 5.", go: { "5": [372, 300, 292, 388], "x5": [384, 212] }, pass: "5" },
          ],
          shot: "5",
        },
      ],
    },
  },
  {
    id: "flare-the-flarer",
    name: "Flare the Flarer",
    category: "half",
    level: 3,
    goal: "A three for the player who just set a screen.",
    start: { "1": [165, 168], "2": [330, 232], "3": [290, 158], "4": [20, 420], "5": [300, 305] },
    ball: "1",
    steps: [
      { say: "2 sets a flare screen for 3.", go: { "2": [320, 196] }, screen: ["2"] },
      { say: "3 fades off it and runs to the right corner.", go: { "3": [402, 222, 472, 402] } },
      { say: "Now 5 flares the flarer. 5 screens for 2.", go: { "5": [352, 226] }, screen: ["5"] },
      { say: "2 fades to the right wing. Two flares in a row are hard to guard.", go: { "x2": [338, 214], "2": [382, 192, 428, 242] } },
      { say: "1 throws the skip pass to 2 for three.", pass: "2" },
    ],
    shot: "2",
    actions: ["Flare screen", "Flare screen", "Skip pass"],
    entry: "Live ball",
    reads: {
      from: 3,
      options: [
        { see: "The defender on 2 gets caught on the flare screen", open: "2 is open on the wing for three" },
        {
          see: "The defender on 5 jumps out to take 2",
          open: "5 slips to the rim",
          steps: [
            { say: "2 fades off the flare from 5. This time the defender on 5 jumps out to take 2.", go: { "2": [382, 192, 428, 242], "x2": [338, 214], "x5": [404, 254] } },
            { say: "Nobody is on 5. 5 slips to the rim and 1 passes to 5.", go: { "5": [326, 300, 296, 380], "x5": [402, 252] }, pass: "5" },
          ],
          shot: "5",
        },
        {
          see: "The corner defender on 3 runs up to take 2",
          open: "The skip pass to 3 in the corner",
          steps: [
            { say: "2 fades off the flare from 5. This time the corner defender on 3 runs up to take 2.", go: { "2": [382, 192, 428, 242], "x2": [338, 214], "x3": [446, 330, 420, 268] } },
            { say: "Nobody is on 3. 1 throws the skip pass to 3 in the corner for three.", pass: "3" },
          ],
          shot: "3",
        },
      ],
    },
  },

  {
    id: "ucla-cut",
    name: "UCLA Cut",
    category: "half",
    level: 1,
    goal: "A layup for the guard who just passed the ball.",
    start: { "1": [335, 165], "2": [432, 255], "3": [20, 420], "4": [165, 168], "5": [330, 272] },
    ball: "1",
    steps: [
      { say: "1 passes to 2 on the wing.", pass: "2" },
      { say: "5 steps up and sets a back screen for 1.", go: { "5": [338, 216] }, screen: ["5"] },
      { say: "1 cuts off the screen from the slot straight to the basket. That is a UCLA cut.", go: { "1": [364, 262, 292, 386], "x1": [352, 250, 322, 344] } },
      { say: "2 passes to 1 for the layup.", pass: "1" },
    ],
    shot: "1",
    actions: ["Wing entry", "Back screen", "UCLA cut"],
    entry: "Live ball",
    reads: {
      from: 2,
      options: [
        { see: "The defender on 1 runs into the screen", open: "The cutter is open at the rim" },
        {
          see: "The defender on 5 drops back to stop the layup",
          open: "The screener is open",
          steps: [
            { say: "1 cuts off the screen. This time the defender on 5 drops into the lane to take away the layup.", go: { "1": [364, 262, 292, 386], "x1": [352, 250, 330, 320], "x5": [300, 362] } },
            { say: "That leaves 5 alone. 5 steps toward the ball and 2 passes to 5 for the shot.", go: { "5": [370, 228], "x5": [304, 352] }, pass: "5" },
          ],
          shot: "5",
        },
        {
          see: "The weak side defender on 4 drops in to stop the cutter",
          open: "The skip pass to 4 on the weak side",
          steps: [
            { say: "1 cuts off the screen. This time the defender on 4 leaves 4 and drops into the lane to stop the layup.", go: { "1": [364, 262, 292, 386], "x1": [352, 250, 322, 344], "x4": [226, 300, 262, 366] } },
            { say: "Nobody is on 4. 2 throws the skip pass to 4 for the open three.", pass: "4" },
          ],
          shot: "4",
        },
      ],
    },
  },
  {
    id: "zipper",
    name: "Zipper",
    category: "half",
    level: 1,
    goal: "A clean catch in the slot for a guard, to start the offense or shoot.",
    start: { "1": [335, 150], "2": [330, 392], "3": [20, 420], "4": [165, 168], "5": [332, 290] },
    ball: "1",
    steps: [
      { say: "1 dribbles to the wing. 2 waits on the block on the same side.", go: { "1": [428, 250] } },
      { say: "5 sets a down screen for 2.", go: { "5": [336, 340] }, screen: ["5"] },
      { say: "2 cuts straight up to the slot, like pulling up a zipper.", go: { "x2": [322, 356, 322, 268], "2": [308, 300, 320, 172] } },
      { say: "1 passes from the wing to 2 in the slot.", pass: "2" },
    ],
    shot: "2",
    actions: ["Down screen", "Zipper cut"],
    entry: "Live ball",
    reads: {
      from: 2,
      options: [
        { see: "The defender on 2 trails behind the screen", open: "2 is open in the slot" },
        {
          see: "The defender on 5 steps out to take 2",
          open: "5 dives to the rim",
          steps: [
            { say: "2 cuts up to the slot. This time the defender on 5 steps out into the passing lane to take 2.", go: { "2": [308, 300, 320, 172], "x2": [322, 356, 322, 304], "x5": [350, 200] } },
            { say: "Nobody is on 5. 5 dives to the rim and 1 passes to 5.", go: { "5": [318, 388], "x5": [348, 198] }, pass: "5" },
          ],
          shot: "5",
        },
        {
          see: "The defender on 2 runs over the top first to beat 2 to the slot",
          open: "Stay low and cut back to the rim",
          steps: [
            { say: "This time the defender on 2 runs over the top of the screen first, to beat 2 to the slot.", go: { "2": [324, 366], "x2": [308, 330, 318, 262] } },
            { say: "2 sees it and does not follow. 2 cuts back to the rim and 1 passes to 2.", go: { "2": [292, 398] }, pass: "2" },
          ],
          shot: "2",
        },
      ],
    },
  },
  {
    id: "floppy",
    name: "Floppy",
    category: "half",
    level: 1,
    goal: "A shot for a shooter who gets to pick which screen to use.",
    start: { "1": [250, 145], "2": [250, 398], "3": [176, 358], "4": [170, 400], "5": [330, 386] },
    ball: "1",
    steps: [
      { say: "2 starts under the basket with a choice. A single screen from 5 on one side. A double screen from 3 and 4 on the other." },
      { say: "The defender leans toward the double, so 2 goes the other way off the single screen.", go: { "2": [352, 360, 426, 262], "x2": [226, 396, 330, 352] }, screen: ["5"] },
      { say: "1 passes to 2 for the shot.", pass: "2" },
    ],
    shot: "2",
    actions: ["Single screen", "Double screen"],
    entry: "Live ball",
    reads: {
      from: 1,
      options: [
        { see: "The defender leans toward the double screen", open: "Go off the single screen" },
        {
          see: "The defender jumps to the single screen side first",
          open: "Go off the double screen",
          steps: [
            { say: "This time the defender jumps to the single screen side first. So 2 goes the other way, off the double screen from 3 and 4.", go: { "2": [150, 372, 82, 262], "x2": [296, 398, 214, 380] }, screen: ["3", "4"] },
            { say: "1 passes to 2 for the shot.", pass: "2" },
          ],
          shot: "2",
        },
        {
          see: "The defender chases 2 right off the single screen",
          open: "Curl into the lane",
          steps: [
            { say: "2 goes off the single screen. This time the defender is chasing right behind.", go: { "2": [356, 356, 374, 318], "x2": [300, 398, 356, 356] }, screen: ["5"] },
            { say: "The defender is behind, so 2 curls tight around 5 into the lane. 1 passes to 2.", go: { "2": [352, 300, 296, 322], "x2": [368, 322] }, pass: "2" },
          ],
          shot: "2",
        },
      ],
    },
  },
  {
    id: "blind-pig",
    name: "Blind Pig",
    category: "half",
    level: 2,
    goal: "A backdoor layup against a defender who is denying the pass.",
    start: { "1": [220, 150], "2": [428, 250], "3": [20, 420], "4": [72, 250], "5": [330, 380] },
    ball: "1",
    steps: [
      { say: "1 wants to pass to 2, but the defender is denying it.", go: { "1": [290, 150] } },
      { say: "5 flashes up to the elbow and 1 passes to 5.", go: { "5": [336, 266] }, pass: "5" },
      { say: "The moment 5 catches it, 2 cuts backdoor.", go: { "2": [402, 332, 300, 392], "x2": [396, 262, 372, 330] } },
      { say: "5 passes to 2 for the layup. Ball to the big, big to the cutter. That is Blind Pig.", pass: "2" },
    ],
    shot: "2",
    actions: ["Flash", "Backdoor cut"],
    entry: "Live ball",
    guards: { x2: [394, 222] },
    reads: {
      from: 2,
      options: [
        { see: "The defender on 2 keeps denying on the high side", open: "The backdoor cut" },
        {
          see: "The defender on 2 drops back to protect the rim",
          open: "Come to the ball for the handoff",
          steps: [
            { say: "5 has the ball. This time the defender on 2 drops back toward the rim to take away the backdoor.", go: { "x2": [376, 312] } },
            { say: "So 2 comes up to 5, takes the handoff, and shoots.", go: { "2": [370, 246], "x2": [374, 304] }, pass: "2" },
          ],
          shot: "2",
        },
        {
          see: "The weak side defender on 4 drops to the rim",
          open: "The pass to 4 on the weak side",
          steps: [
            { say: "5 has the ball and 2 cuts backdoor. This time the defender on 4 leaves 4 and drops to the rim to take the cut away.", go: { "2": [402, 332, 300, 392], "x2": [396, 262, 372, 330], "x4": [190, 320, 258, 376] } },
            { say: "Nobody is on 4. 5 passes to 4 for the open three.", pass: "4" },
          ],
          shot: "4",
        },
      ],
    },
  },
  {
    id: "flex",
    name: "Flex",
    category: "half",
    level: 2,
    goal: "A layup off a baseline cut, or a jumper for the screener at the elbow.",
    start: { "1": [335, 168], "2": [480, 420], "3": [20, 420], "4": [165, 168], "5": [330, 392] },
    ball: "1",
    steps: [
      { say: "1 passes to 4, slot to slot.", pass: "4" },
      { say: "5 sets a flex screen on the block for 2.", go: { "5": [338, 400] }, screen: ["5"] },
      { say: "2 cuts along the baseline off the screen to the ball side block. That is the flex cut.", go: { "x2": [440, 430, 376, 420], "2": [402, 444, 212, 400] } },
      { say: "Screen the screener. 1 sets a down screen for 5.", go: { "1": [338, 330] }, screen: ["1"] },
      { say: "5 comes up to the elbow. 4 hits 2 for the layup.", go: { "5": [362, 330, 330, 268] }, pass: "2" },
    ],
    shot: "2",
    actions: ["Flex screen", "Baseline cut", "Down screen"],
    entry: "Live ball",
    reads: {
      from: 2,
      options: [
        { see: "The defender on 2 gets caught on the flex screen", open: "2 is open at the block for a layup" },
        {
          see: "The defender on 5 switches and takes the cutter",
          open: "5 is open at the elbow off the down screen",
          steps: [
            { say: "2 makes the flex cut. This time the defender on 5 switches and takes 2.", go: { "2": [402, 444, 212, 400], "x2": [440, 430, 384, 416], "x5": [300, 408, 236, 396] } },
            { say: "Screen the screener. 1 sets a down screen for 5.", go: { "1": [338, 330] }, screen: ["1"] },
            { say: "5 comes up to the elbow with nobody close. 4 passes to 5 for the jumper.", go: { "5": [362, 330, 330, 268], "x5": [234, 394], "x2": [356, 372] }, pass: "5" },
          ],
          shot: "5",
        },
        {
          see: "The corner defender on 3 slides in to take the cutter",
          open: "The pass to 3 in the corner",
          steps: [
            { say: "2 makes the flex cut. This time the corner defender on 3 slides in to take the cutter.", go: { "2": [402, 444, 212, 400], "x2": [440, 430, 376, 420], "x3": [110, 412, 186, 400] } },
            { say: "Nobody is on 3. 4 passes to 3 in the corner for three.", pass: "3" },
          ],
          shot: "3",
        },
      ],
    },
  },
  {
    id: "miami",
    name: "Miami Action",
    category: "half",
    level: 2,
    goal: "A guard coming downhill off a handoff and a ball screen back to back.",
    start: { "1": [335, 168], "2": [440, 265], "3": [20, 420], "4": [72, 250], "5": [250, 170] },
    ball: "1",
    steps: [
      { say: "1 dribbles at 2 on the wing.", go: { "1": [400, 226] } },
      { say: "1 hands the ball off to 2.", go: { "2": [432, 236, 386, 206] }, pass: "2" },
      { say: "5 comes right behind and sets a ball screen for 2. Handoff, then ball screen. That is Miami.", go: { "5": [336, 196], "1": [480, 420] }, screen: ["5"] },
      { say: "2 dribbles off the screen into the lane. 5 rolls.", go: { "x2": [344, 196, 292, 252], "2": [300, 190, 245, 292], "5": [332, 282, 302, 382] } },
    ],
    shot: "2",
    actions: ["Handoff", "Ball screen", "Roll"],
    entry: "Live ball",
    reads: {
      from: 3,
      options: [
        { see: "The defender on 5 stays back with the roller", open: "2 gets all the way into the lane" },
        {
          see: "The defender on 5 steps up to stop the ball",
          open: "The pass to 5 rolling to the rim",
          steps: [
            { say: "2 comes off the screen and 5 rolls. This time the defender on 5 steps up to stop the ball.", go: { "2": [300, 190, 262, 262], "5": [332, 282, 302, 382], "x2": [344, 196, 302, 236], "x5": [250, 300] } },
            { say: "Nobody is on 5. 2 drops the pass to 5 for the layup.", pass: "5" },
          ],
          shot: "5",
        },
        {
          see: "The big stops the ball and the corner defender on 1 pulls in to take the roller",
          open: "The kick to 1 in the corner",
          steps: [
            { say: "2 comes off the screen and 5 rolls. This time the defender on 5 stops the ball, and the corner defender on 1 pulls in to take the roller.", go: { "2": [300, 190, 262, 262], "5": [332, 282, 302, 382], "x2": [344, 196, 302, 236], "x5": [250, 300], "x1": [404, 404, 322, 372] } },
            { say: "Nobody is on 1. 2 kicks it to 1 in the corner for three.", pass: "1" },
          ],
          shot: "1",
        },
      ],
    },
  },
  {
    id: "veer",
    name: "Veer",
    category: "half",
    level: 2,
    goal: "A shot on the weak side while the defense waits for the roll.",
    start: { "1": [250, 140], "2": [25, 415], "3": [480, 420], "4": [368, 440], "5": [300, 230] },
    ball: "1",
    steps: [
      { say: "5 sets a ball screen for 1.", go: { "5": [286, 176] }, screen: ["5"] },
      { say: "1 dribbles right off the screen.", go: { "1": [320, 155, 360, 200] } },
      { say: "5 does not roll. 5 veers away to the weak side.", go: { "5": [182, 252, 70, 346] } },
      { say: "5 sets a pindown for 2, and 2 comes up to the wing.", go: { "x2": [52, 334, 70, 292], "2": [55, 300, 100, 226] }, screen: ["5"] },
      { say: "1 passes to 2 for the shot. Ball screen, then pindown by the same screener. That is Veer.", pass: "2" },
    ],
    shot: "2",
    actions: ["Ball screen", "Pindown"],
    entry: "Live ball",
    reads: {
      from: 3,
      options: [
        { see: "The defender on 2 trails behind the pindown", open: "2 is open on the wing" },
        {
          see: "The defender on 2 jumps on top, between 2 and the screen",
          open: "Backdoor cut",
          steps: [
            { say: "5 sets the pindown. This time the defender on 2 jumps on top and stands between 2 and the screen. That is a top lock.", go: { "x2": [36, 384] }, screen: ["5"] },
            { say: "2 cuts backdoor along the baseline and 1 passes to 2.", go: { "2": [80, 444, 200, 400], "x2": [60, 408, 120, 418] }, pass: "2" },
          ],
          shot: "2",
        },
        {
          see: "The defender on 5 jumps out to take 2",
          open: "5 slips to the rim",
          steps: [
            { say: "2 comes up off the pindown. This time the defender on 5 jumps out to take 2.", go: { "2": [55, 300, 100, 226], "x2": [52, 334, 70, 302], "x5": [112, 252] }, screen: ["5"] },
            { say: "Nobody is on 5. 5 slips to the rim and 1 passes to 5.", go: { "5": [150, 380, 226, 396], "x5": [110, 250] }, pass: "5" },
          ],
          shot: "5",
        },
      ],
    },
  },
  {
    id: "ram",
    name: "Ram Screen",
    category: "half",
    level: 2,
    goal: "A ball screen where the big defender arrives late.",
    start: { "1": [250, 140], "2": [330, 300], "3": [20, 420], "4": [72, 250], "5": [330, 386] },
    ball: "1",
    steps: [
      { say: "2 sets a down screen for 5.", go: { "2": [333, 336] }, screen: ["2"] },
      { say: "5 sprints up off that screen. The defender guarding 5 is now a step behind. 2 clears to the corner.", go: { "x5": [356, 336, 330, 262], "5": [362, 300, 292, 178], "2": [480, 420] } },
      { say: "5 goes straight into a ball screen for 1. Get a screen, then set a ball screen. That is Ram.", screen: ["5"] },
      { say: "1 dribbles off it and attacks before the big defender can get there.", go: { "x1": [306, 168, 344, 222], "x5": [314, 232], "1": [336, 176, 318, 302] } },
    ],
    shot: "1",
    actions: ["Down screen", "Ball screen"],
    entry: "Live ball",
    reads: {
      from: 3,
      options: [
        { see: "The defender on 5 is a step behind and cannot help", open: "1 attacks the rim" },
        {
          see: "The corner defender on 2 comes over to stop the ball",
          open: "The kick to 2 in the corner",
          steps: [
            { say: "1 attacks off the screen. This time the corner defender on 2 comes over to stop the ball.", go: { "1": [336, 176, 318, 302], "x1": [306, 168, 344, 222], "x5": [314, 232], "x2": [404, 380, 346, 332] } },
            { say: "Nobody is on 2. 1 kicks it to 2 in the corner for three.", pass: "2" },
          ],
          shot: "2",
        },
        {
          see: "The defender on 5 recovers in time and two defenders are on the ball",
          open: "The pass to 5 rolling to the rim",
          steps: [
            { say: "1 comes off the screen. This time the defender on 5 recovers in time and stops the ball, with the defender on 1 still chasing.", go: { "1": [336, 176, 332, 258], "x1": [306, 168, 350, 230], "x5": [326, 290] } },
            { say: "Two defenders are on the ball. 5 rolls to the rim and 1 passes to 5.", go: { "5": [262, 300, 268, 384], "x5": [324, 288] }, pass: "5" },
          ],
          shot: "5",
        },
      ],
    },
  },
  {
    id: "peja",
    name: "Peja (Rip Handoff)",
    category: "half",
    level: 2,
    goal: "A three for the shooter who just set a back screen.",
    start: { "1": [165, 168], "2": [335, 268], "3": [428, 250], "4": [20, 420], "5": [265, 175] },
    ball: "1",
    steps: [
      { say: "1 passes to 5 at the top.", pass: "5" },
      { say: "2, the shooter, sets a back screen at the elbow for 3.", go: { "2": [372, 262] }, screen: ["2"] },
      { say: "3 cuts off the screen to the rim and takes the help along.", go: { "3": [372, 318, 292, 394] } },
      { say: "2 pops up, 5 dribbles over to meet 2, and 2 takes the handoff.", go: { "x2": [354, 264], "5": [284, 184], "2": [310, 202] }, pass: "2" },
      { say: "The shooter was the screener, so nobody is ready to chase. 2 shoots.", go: { "2": [332, 172] } },
    ],
    shot: "2",
    actions: ["Back screen", "Handoff"],
    entry: "Live ball",
    reads: {
      from: 3,
      options: [
        { see: "Nobody chases 2 off the back screen", open: "2 shoots off the handoff" },
        {
          see: "The defender on 5 steps out to take 2",
          open: "5 fakes the handoff, keeps it, and drives",
          steps: [
            { say: "2 pops up to 5. This time the defender on 5 steps out to take 2.", go: { "5": [284, 184], "2": [310, 202], "x2": [354, 264], "x5": [312, 220] } },
            { say: "5 fakes the handoff, keeps the ball, and drives for the layup.", go: { "5": [248, 280, 262, 384], "x5": [310, 218] } },
          ],
          shot: "5",
        },
        {
          see: "The defender on 2 chases hard right behind 2",
          open: "Take the handoff and drive past",
          steps: [
            { say: "2 pops up to 5 and takes the handoff. This time the defender on 2 is chasing hard, right behind.", go: { "5": [284, 184], "2": [310, 202], "x2": [342, 238, 324, 214] }, pass: "2" },
            { say: "The defender is behind and moving fast. 2 does not shoot. 2 turns the corner and drives to the rim.", go: { "2": [262, 230, 244, 372], "x2": [300, 262] } },
          ],
          shot: "2",
        },
      ],
    },
  },
  {
    id: "exit-screen",
    name: "Exit Screen",
    category: "half",
    level: 2,
    goal: "A corner three for a shooter running the baseline.",
    start: { "1": [250, 140], "2": [215, 400], "3": [72, 250], "4": [368, 438], "5": [300, 230] },
    ball: "1",
    steps: [
      { say: "5 sets a ball screen for 1.", go: { "5": [286, 176] }, screen: ["5"] },
      { say: "1 dribbles right off the screen.", go: { "1": [320, 155, 366, 206] } },
      { say: "Down low, 4 sets an exit screen near the dunker spot.", go: { "4": [394, 430] }, screen: ["4"] },
      { say: "2 runs the baseline off the screen and exits to the corner.", go: { "x2": [300, 440, 374, 436], "2": [330, 448, 478, 425] } },
      { say: "1 passes to 2 for the corner three.", pass: "2" },
    ],
    shot: "2",
    actions: ["Ball screen", "Exit screen"],
    entry: "Live ball",
    reads: {
      from: 3,
      options: [
        { see: "The defender on 2 gets caught on the exit screen", open: "2 is open in the corner" },
        {
          see: "The defender on 4 jumps out to the corner to take 2",
          open: "4 is open right at the rim",
          steps: [
            { say: "2 exits to the corner. This time the defender on 4 jumps out to take 2.", go: { "2": [330, 448, 478, 425], "x2": [300, 440, 374, 438], "x4": [430, 420, 454, 412] } },
            { say: "Nobody is on 4 right at the rim. 4 turns to the ball and 1 passes to 4.", go: { "4": [352, 412], "x4": [452, 410] }, pass: "4" },
          ],
          shot: "4",
        },
        {
          see: "2 is covered, and both defenders up top stay with the ball",
          open: "The pass to 5 rolling to the rim",
          steps: [
            { say: "2 exits to the corner and the defender stays right with 2. This time both defenders up top stay with the ball.", go: { "2": [330, 448, 478, 425], "x2": [330, 438, 454, 410], "x5": [354, 238] } },
            { say: "Nobody is on 5. 5 rolls to the rim and 1 passes to 5.", go: { "5": [280, 300, 272, 380], "x5": [352, 236] }, pass: "5" },
          ],
          shot: "5",
        },
      ],
    },
  },

  // ---------- transition and early offense ----------
  {
    id: "double-drag",
    name: "Double Drag",
    category: "early",
    level: 1,
    goal: "A downhill drive with a roller and a shooter behind it.",
    start: { "1": [335, 122], "2": [462, 150], "3": [40, 150], "4": [262, 116], "5": [200, 116] },
    ball: "1",
    steps: [
      { say: "1 brings it up the right side. 2 and 3 sprint to the corners.", go: { "1": [345, 162], "2": [480, 420], "3": [20, 420] } },
      { say: "4 and 5 trail the play and set two screens in a row. That is Double Drag.", go: { "4": [306, 186], "5": [256, 206] }, screen: ["4", "5"] },
      { say: "1 dribbles left off both screens.", go: { "1": [282, 158, 198, 216], "x1": [300, 170, 234, 196], "x5": [206, 252] } },
      { say: "4 pops to the three-point line. 5 rolls to the rim.", go: { "4": [338, 166], "5": [252, 300, 262, 386], "x5": [212, 252] } },
      { say: "1 reads the defense. Here the roller is open, so 1 hits 5.", pass: "5" },
    ],
    shot: "5",
    actions: ["Drag screen", "Drag screen", "Pop", "Roll"],
    entry: "Live ball",
    reads: {
      from: 3,
      options: [
        { see: "The defender on 4 follows 4 out to the line", open: "The roller is open" },
        {
          see: "The defender on 4 sinks in to bump the roller",
          open: "The popper is open for three",
          steps: [
            { say: "4 pops and 5 rolls. This time the defender on 4 sinks into the lane to bump the roller.", go: { "4": [338, 166], "5": [252, 300, 262, 386], "x5": [212, 252], "x4": [272, 342] } },
            { say: "Nobody is on 4. 1 throws it back to 4 for three.", pass: "4" },
          ],
          shot: "4",
        },
        {
          see: "The corner defender on 3 pulls in to take the roller",
          open: "The kick to 3 in the corner",
          steps: [
            { say: "4 pops and 5 rolls. This time the defender on 3 leaves the corner and pulls in to take the roller.", go: { "4": [338, 166], "5": [252, 300, 262, 386], "x5": [212, 252], "x3": [150, 400, 232, 374] } },
            { say: "Nobody is on 3. 1 kicks it to 3 for the corner three.", pass: "3" },
          ],
          shot: "3",
        },
      ],
    },
  },
  {
    id: "drag-wide-pin",
    name: "Drag to Wide Pindown",
    category: "early",
    level: 2,
    goal: "A shot for your best shooter early in the clock.",
    start: { "1": [335, 122], "2": [40, 160], "3": [462, 160], "4": [150, 120], "5": [252, 114] },
    ball: "1",
    steps: [
      { say: "Everyone runs. 2 and 3 fill the corners. 5 trails and sets a drag screen for 1.", go: { "2": [25, 415], "3": [480, 420], "4": [112, 292], "5": [296, 180] }, screen: ["5"] },
      { say: "1 dribbles left off the drag.", go: { "1": [272, 150, 216, 190] } },
      { say: "On the weak side, 4 sets a wide pindown for 2.", go: { "4": [62, 352] }, screen: ["4"] },
      { say: "2 sprints up off the screen to the wing.", go: { "x2": [40, 344, 62, 294], "2": [48, 300, 96, 226] } },
      { say: "1 passes to 2 for the shot.", pass: "2" },
    ],
    shot: "2",
    actions: ["Drag screen", "Wide pindown"],
    entry: "Live ball",
    reads: {
      from: 3,
      options: [
        { see: "The defender on 2 trails behind the pindown", open: "2 is open on the wing" },
        {
          see: "The defender on 2 jumps on top, between 2 and the screen",
          open: "Backdoor cut",
          steps: [
            { say: "This time the defender on 2 jumps on top and stands between 2 and the screen. That is a top lock.", go: { "x2": [36, 384] } },
            { say: "2 cuts backdoor along the baseline and 1 passes to 2.", go: { "2": [80, 444, 200, 400], "x2": [60, 408, 120, 418] }, pass: "2" },
          ],
          shot: "2",
        },
        {
          see: "The defender on 4 jumps out to take 2",
          open: "4 slips to the rim",
          steps: [
            { say: "2 comes up off the screen. This time the defender on 4 jumps out to take 2.", go: { "2": [48, 300, 96, 226], "x2": [40, 344, 60, 314], "x4": [108, 252] } },
            { say: "Nobody is on 4. 4 slips to the rim and 1 passes to 4.", go: { "4": [140, 380, 220, 396], "x4": [106, 250] }, pass: "4" },
          ],
          shot: "4",
        },
      ],
    },
  },

  {
    id: "oklahoma",
    name: "Oklahoma",
    category: "early",
    level: 2,
    goal: "A three for the first screener coming back toward the ball.",
    start: { "1": [335, 122], "2": [462, 150], "3": [40, 150], "4": [262, 116], "5": [200, 116] },
    ball: "1",
    steps: [
      { say: "1 brings it up the right side. 2 and 3 sprint to the corners.", go: { "1": [345, 162], "2": [480, 420], "3": [20, 420] } },
      { say: "4 and 5 trail the play and set a Double Drag. 4 is the first screener, 5 is the second.", go: { "4": [306, 186], "5": [256, 206] }, screen: ["4", "5"] },
      { say: "1 dribbles left off both screens.", go: { "1": [282, 158, 190, 232] } },
      { say: "Now 5, the second screener, turns and screens for 4, the first screener.", go: { "5": [286, 196] }, screen: ["5"] },
      { say: "4 comes off that screen back toward the ball. That is Oklahoma.", go: { "x4": [314, 178], "4": [296, 160, 244, 158] } },
      { say: "1 passes to 4 for the open three.", pass: "4" },
    ],
    shot: "4",
    actions: ["Double Drag", "Screen for the first screener"],
    entry: "Live ball",
    reads: {
      from: 4,
      options: [
        { see: "The defender on 4 gets caught on the screen from 5", open: "4 is open at the top for three" },
        {
          see: "The defender on 5 jumps out to take 4",
          open: "5 rolls to the rim",
          steps: [
            { say: "4 comes off the screen. This time the defender on 5 jumps out to take 4.", go: { "4": [296, 160, 244, 158], "x4": [314, 178], "x5": [262, 182] } },
            { say: "Nobody is on 5. 5 rolls to the rim and 1 passes to 5.", go: { "5": [280, 300, 268, 384], "x5": [260, 180] }, pass: "5" },
          ],
          shot: "5",
        },
        {
          see: "The defender on 1 leaves the ball to take 4",
          open: "1 drives to the rim",
          steps: [
            { say: "4 comes off the screen. This time the defender on 1 leaves the ball and runs at 4.", go: { "4": [296, 160, 244, 158], "x4": [314, 178], "x1": [226, 186] } },
            { say: "Nobody is on the ball. 1 drives to the rim.", go: { "1": [214, 300, 236, 388] } },
          ],
          shot: "1",
        },
      ],
    },
  },

  // ---------- after timeout ----------
  {
    id: "elevator",
    name: "Elevator Doors",
    category: "ato",
    level: 1,
    goal: "An open three at the top when you need one.",
    start: { "1": [250, 140], "2": [250, 395], "3": [432, 255], "4": [190, 272], "5": [310, 272] },
    ball: "1",
    steps: [
      { say: "1 dribbles to the left wing.", go: { "1": [182, 160, 110, 226] } },
      { say: "2 runs straight up the lane, between 4 and 5.", go: { "2": [250, 192], "x2": [250, 326] } },
      { say: "4 and 5 step together and close the doors behind 2.", go: { "4": [232, 262], "5": [268, 262], "x2": [250, 298] }, screen: ["4", "5"] },
      { say: "1 passes to 2 at the top for the open three.", pass: "2" },
    ],
    shot: "2",
    actions: ["Elevator screen"],
    entry: "Live ball",
    reads: {
      from: 2,
      options: [
        { see: "The defender on 2 gets shut behind the doors", open: "2 is open at the top for three" },
        {
          see: "The defender on 5 jumps out past the doors to take 2",
          open: "5 slips to the rim",
          steps: [
            { say: "4 and 5 close the doors. This time the defender on 5 jumps out to the top to take 2.", go: { "4": [232, 262], "5": [268, 262], "x2": [250, 298], "x5": [262, 216] }, screen: ["4", "5"] },
            { say: "Nobody is on 5. 5 slips to the rim and 1 passes to 5 for the layup.", go: { "5": [280, 376], "x5": [260, 214] }, pass: "5" },
          ],
          shot: "5",
        },
        {
          see: "The wing defender on 3 leaves 3 and runs at 2",
          open: "The skip pass to 3 on the wing",
          steps: [
            { say: "4 and 5 close the doors. This time the defender on 3 leaves 3 and runs to the top to take 2.", go: { "4": [232, 262], "5": [268, 262], "x2": [250, 298], "x3": [340, 226, 276, 204] }, screen: ["4", "5"] },
            { say: "Nobody is on 3. 1 throws the skip pass to 3 for the open three.", pass: "3" },
          ],
          shot: "3",
        },
      ],
    },
  },
  {
    id: "stagger-slip",
    name: "Stagger Slip",
    category: "ato",
    level: 2,
    goal: "A layup when the defense jumps out at your shooter.",
    start: { "1": [165, 168], "2": [480, 420], "3": [20, 420], "4": [448, 348], "5": [404, 244] },
    ball: "1",
    steps: [
      { say: "4 and 5 line up a stagger for 2. The defense has seen it all game.", go: { "4": [446, 354] }, screen: ["4"] },
      { say: "2 comes off 4's screen and both defenders jump out at the shooter.", go: { "2": [434, 300, 382, 186], "x2": [446, 312, 404, 214], "x5": [362, 206] } },
      { say: "5 never sets the second screen. 5 slips to the rim.", go: { "5": [358, 304, 276, 390], "x5": [366, 204] } },
      { say: "1 passes to 5 for the layup.", pass: "5" },
    ],
    shot: "5",
    actions: ["Stagger", "Slip"],
    entry: "Live ball",
    reads: {
      from: 1,
      options: [
        { see: "Both defenders jump out at the shooter", open: "The second screener slips to the rim" },
        {
          see: "The defender on 5 stays home",
          open: "The shooter is open off the second screen",
          steps: [
            { say: "2 comes off the first screen from 4. This time the defender on 5 stays home.", go: { "2": [434, 300, 400, 232], "x2": [446, 312, 424, 268] } },
            { say: "So 5 sets the second screen and 2 keeps coming to the top.", go: { "2": [382, 186], "x2": [408, 236] }, screen: ["5"] },
            { say: "1 passes to 2 for the shot.", pass: "2" },
          ],
          shot: "2",
        },
        {
          see: "The defender on 2 stands between 2 and the screens",
          open: "The backdoor cut",
          steps: [
            { say: "This time the defender on 2 jumps on top and stands between 2 and the screens, so 2 cannot use them. That is a top lock.", go: { "x2": [468, 384] } },
            { say: "2 does not fight it. 2 cuts backdoor along the baseline.", go: { "2": [420, 442, 302, 398], "x2": [452, 404, 404, 416] } },
            { say: "1 passes to 2 for the layup.", pass: "2" },
          ],
          shot: "2",
        },
      ],
    },
  },
  {
    id: "screen-the-screener",
    name: "Cross Screen, Screen the Screener",
    category: "ato",
    level: 2,
    goal: "A three for a shooter while the defense worries about the post.",
    start: { "1": [345, 170], "2": [330, 390], "3": [20, 420], "4": [215, 200], "5": [170, 390] },
    ball: "1",
    steps: [
      { say: "2 sets a cross screen for 5 in the lane.", go: { "2": [216, 386] }, screen: ["2"] },
      { say: "5 comes across to the right block and posts up.", go: { "5": [252, 362, 326, 384] } },
      { say: "Now screen the screener. 4 sets a down screen for 2.", go: { "4": [226, 300] }, screen: ["4"] },
      { say: "2 sprints up off the screen to the top.", go: { "x2": [212, 344, 220, 294], "2": [198, 310, 226, 164] } },
      { say: "The defense is watching 5 in the post. 1 passes to 2 for three.", pass: "2" },
    ],
    shot: "2",
    actions: ["Cross screen", "Post up", "Down screen"],
    entry: "Live ball",
    reads: {
      from: 3,
      options: [
        { see: "The defender on 2 gets caught on the down screen", open: "2 is open at the top for three" },
        {
          see: "The defender on 4 jumps out to take 2",
          open: "4 dives to the rim",
          steps: [
            { say: "2 comes off the screen. This time the defender on 4 jumps out to take 2.", go: { "2": [198, 310, 226, 164], "x2": [212, 344, 216, 304], "x4": [236, 198] } },
            { say: "Nobody is on 4. 4 dives to the rim and 1 passes to 4.", go: { "4": [214, 384], "x4": [234, 196] }, pass: "4" },
          ],
          shot: "4",
        },
        {
          see: "The defender on 2 fights through and stays with 2",
          open: "Throw it inside to 5 in the post",
          steps: [
            { say: "2 comes off the screen. This time the defender on 2 fights through and stays right with 2.", go: { "2": [198, 310, 226, 164], "x2": [214, 330, 234, 196] } },
            { say: "2 is covered, but 5 has deep position on the block. 1 throws it inside to 5.", pass: "5" },
          ],
          shot: "5",
        },
      ],
    },
  },
  {
    id: "hammer",
    name: "Hammer",
    category: "ato",
    level: 2,
    goal: "A corner three on the side nobody is watching.",
    start: { "1": [250, 150], "2": [428, 250], "3": [72, 250], "4": [150, 335], "5": [330, 272] },
    ball: "2",
    steps: [
      { say: "2 drives hard toward the baseline. Every defender turns to watch the ball.", go: { "2": [452, 340, 420, 426] } },
      { say: "On the weak side, 4 sets a flare screen for 3. That screen is the hammer.", go: { "4": [72, 328] }, screen: ["4"] },
      { say: "3 slides down to the corner behind the screen.", go: { "3": [22, 420] } },
      { say: "2 fires the pass along the baseline to 3 for the corner three.", pass: "3" },
    ],
    shot: "3",
    actions: ["Baseline drive", "Hammer screen"],
    entry: "Live ball",
    reads: {
      from: 1,
      options: [
        { see: "The weak side defenders turn and watch the ball", open: "The corner three off the hammer" },
        {
          see: "The defender on 3 stays glued to 3, and the defender on 5 comes to stop the ball",
          open: "The drop off pass to 5 cutting to the rim",
          steps: [
            { say: "4 sets the hammer screen. This time the defender on 3 stays glued to 3, and the defender on 5 comes over to stop the drive.", go: { "4": [72, 328], "x3": [58, 280], "x5": [396, 398] }, screen: ["4"] },
            { say: "Nobody is on 5. 5 cuts to the rim and 2 drops the pass off to 5 for the layup.", go: { "5": [304, 380], "x5": [398, 400] }, pass: "5" },
          ],
          shot: "5",
        },
        {
          see: "The defender on 1 drops down from the top to stop the ball",
          open: "The kick out to 1 at the top",
          steps: [
            { say: "4 sets the hammer screen. This time the defender on 3 stays with 3, and the defender on 1 drops all the way down to stop the drive.", go: { "4": [72, 328], "x3": [58, 280], "x1": [330, 280, 384, 380] }, screen: ["4"] },
            { say: "Nobody is on 1. 2 kicks it out to 1 at the top for the open three.", pass: "1" },
          ],
          shot: "1",
        },
      ],
    },
  },

  // ---------- baseline out of bounds ----------
  {
    id: "line",
    name: "Line",
    category: "blob",
    level: 1,
    goal: "A quick layup, with a shooter in the corner if it is covered.",
    start: { "1": [330, 286], "2": [330, 324], "3": [330, 486], "4": [330, 362], "5": [330, 400] },
    ball: "3",
    steps: [
      { say: "Four players stand in a line in front of the ball. 3 slaps the ball and they break." },
      { say: "2 pops to the corner. 1 goes back to the top as the safety.", go: { "2": [470, 415], "1": [300, 170] } },
      { say: "4 cuts to the opposite block and takes a defender along.", go: { "4": [182, 392] } },
      { say: "5 steps to the ball and seals the defender behind.", go: { "x5": [322, 400], "5": [318, 428] } },
      { say: "3 passes to 5 for the layup.", pass: "5" },
    ],
    shot: "5",
    actions: ["Line", "Seal"],
    entry: "BLOB",
    reads: {
      from: 3,
      options: [
        { see: "The defender on 5 is sealed behind 5", open: "5 is open in front of the ball" },
        {
          see: "The defender on 5 jumps in front and the defender on 2 sinks in to help",
          open: "The pass to 2 in the corner",
          steps: [
            { say: "5 steps to the ball. This time the defender on 5 jumps in front, between 5 and the ball, and the defender on 2 sinks in to help.", go: { "5": [318, 428], "x5": [318, 454], "x2": [402, 410] } },
            { say: "Nobody is close to 2. 3 passes to 2 in the corner for three.", pass: "2" },
          ],
          shot: "2",
        },
        {
          see: "The defender on 4 leaves 4 to help on 5",
          open: "4 is open on the other block",
          steps: [
            { say: "5 steps to the ball. This time the defender on 4 leaves 4 and comes back to help on 5.", go: { "5": [318, 428], "x5": [322, 400], "x4": [270, 414] } },
            { say: "Nobody is on 4 on the other block. 3 passes to 4 for the layup.", pass: "4" },
          ],
          shot: "4",
        },
      ],
    },
  },
  {
    id: "box-cross",
    name: "Box Cross",
    category: "blob",
    level: 1,
    goal: "A layup for your big, right in front of the ball.",
    start: BOX,
    ball: "3",
    steps: [
      { say: "Box set. 1 and 2 break out high and pull their defenders away from the rim.", go: { "1": [120, 200], "2": [402, 200] } },
      { say: "4 sets a cross screen for 5.", go: { "4": [206, 396] }, screen: ["4"] },
      { say: "5 cuts across the lane to the ball.", go: { "x5": [214, 372], "5": [250, 418, 300, 416] } },
      { say: "3 passes to 5 for the layup.", pass: "5" },
    ],
    shot: "5",
    actions: ["Box", "Cross screen"],
    entry: "BLOB",
    reads: {
      from: 2,
      options: [
        { see: "The defender on 5 gets caught on the cross screen", open: "5 is open in front of the ball" },
        {
          see: "The defender on 2 drops all the way down to take 5",
          open: "The pass out to 2 for three",
          steps: [
            { say: "5 cuts across. This time the defender on 2 drops all the way down to take 5.", go: { "5": [250, 418, 300, 416], "x5": [214, 372], "x2": [360, 300, 318, 384] } },
            { say: "Nobody is on 2. 3 passes out to 2 for the open three.", pass: "2" },
          ],
          shot: "2",
        },
        {
          see: "Both defenders go with 5",
          open: "4, the screener, is open",
          steps: [
            { say: "5 cuts across. This time both defenders go with 5.", go: { "5": [250, 418, 300, 416], "x5": [240, 400, 296, 398], "x4": [254, 384] } },
            { say: "Nobody is on 4, the screener. 4 turns to the ball and 3 passes to 4 for the layup.", go: { "4": [220, 426], "x4": [256, 386] }, pass: "4" },
          ],
          shot: "4",
        },
      ],
    },
  },
  {
    id: "box-screen-the-screener",
    name: "Box Screen the Screener",
    category: "blob",
    level: 2,
    goal: "An open jumper for the player who set the first screen.",
    start: BOX,
    ball: "3",
    steps: [
      { say: "Box set. 4 sets a cross screen for 5.", go: { "4": [206, 396] }, screen: ["4"] },
      { say: "5 cuts to the ball and the defense collapses. 2 goes high as the safety.", go: { "5": [250, 418, 300, 414], "2": [405, 200] } },
      { say: "Screen the screener. 1 sets a down screen for 4.", go: { "1": [196, 334] }, screen: ["1"] },
      { say: "4 pops up to the elbow.", go: { "x4": [214, 352], "4": [164, 340, 180, 262] } },
      { say: "3 passes to 4 for the open jumper.", pass: "4" },
    ],
    shot: "4",
    actions: ["Box", "Cross screen", "Down screen"],
    entry: "BLOB",
    reads: {
      from: 3,
      options: [
        { see: "The defender on 4 gets caught on the down screen", open: "4 is open at the elbow" },
        {
          see: "The defender on 4 gets through and stays with 4",
          open: "5 is still sealed in front of the ball",
          steps: [
            { say: "4 pops to the elbow. This time the defender on 4 gets through the screen and stays with 4.", go: { "4": [164, 340, 180, 262], "x4": [180, 330, 188, 292], "x5": [296, 392] } },
            { say: "4 is covered, but 5 is right in front of the ball with the defender sealed behind. 3 passes to 5.", pass: "5" },
          ],
          shot: "5",
        },
        {
          see: "4 is covered, and the defender on 2 drops into the lane",
          open: "The pass out to 2 for three",
          steps: [
            { say: "4 pops to the elbow and the defender stays with 4. This time the defender on 2 drops into the lane to help.", go: { "4": [164, 340, 180, 262], "x4": [180, 330, 188, 292], "x2": [380, 262, 304, 336] } },
            { say: "Nobody is on 2. 3 throws it out to 2 for the open three.", pass: "2" },
          ],
          shot: "2",
        },
      ],
    },
  },
  {
    id: "box-lob",
    name: "Box Back Screen Lob",
    category: "blob",
    level: 2,
    goal: "A lob over the top when you need a quick two.",
    start: BOX,
    ball: "3",
    steps: [
      { say: "Box set. 4 comes up from the block and sets a back screen for 2.", go: { "4": [322, 306] }, screen: ["4"] },
      { say: "5 clears out to the corner and takes the help defender along.", go: { "5": [40, 415] } },
      { say: "2 cuts off the back screen to the far side of the rim.", go: { "x2": [318, 290], "2": [292, 342, 226, 398] } },
      { say: "3 throws the lob over the top to 2.", pass: "2" },
    ],
    shot: "2",
    actions: ["Box", "Back screen", "Lob"],
    entry: "BLOB",
    reads: {
      from: 2,
      options: [
        { see: "The defender on 2 gets caught on the back screen", open: "The lob to 2 at the rim" },
        {
          see: "The defender on 4 drops back to take away the lob",
          open: "4 is open for the jumper",
          steps: [
            { say: "2 cuts off the back screen. This time the defender on 4 drops back to take away the lob.", go: { "2": [292, 342, 226, 398], "x2": [318, 290], "x4": [300, 340, 250, 384] } },
            { say: "Nobody is on 4. 4 steps to the ball and 3 passes to 4 for the jumper.", go: { "4": [332, 344], "x4": [248, 386] }, pass: "4" },
          ],
          shot: "4",
        },
        {
          see: "The defender on 1 drops off the elbow to take away the lob",
          open: "1 is open at the elbow",
          steps: [
            { say: "2 cuts off the back screen. This time the defender on 1 drops off the elbow to take away the lob.", go: { "2": [292, 342, 226, 398], "x2": [318, 290], "x1": [200, 340, 234, 382] } },
            { say: "Nobody is on 1. 3 passes to 1 at the elbow for the jumper.", pass: "1" },
          ],
          shot: "1",
        },
      ],
    },
  },
  // ---------- coverages: one action, every way to guard it ----------
  {
    id: "cov-high-pnr",
    name: "High Pick and Roll",
    category: "coverages",
    level: 2,
    goal: "Know the four main ways a defense guards a ball screen, and what each one leaves open.",
    start: { "1": [250, 140], "2": [480, 420], "3": [20, 420], "4": [110, 222], "5": [300, 235] },
    ball: "1",
    steps: [
      { say: "5 sets a ball screen for 1 at the top.", go: { "5": [286, 176] }, screen: ["5"] },
      { say: "1 dribbles off the screen. The defender on 5 backs up toward the paint and stays below the screen. This is Drop.", go: { "1": [320, 155, 352, 206], "x1": [298, 158, 328, 184], "x5": [318, 298] } },
      { say: "The big is back and nobody is up on the ball. 5 rolls, and 1 pulls up for the open jumper.", go: { "5": [300, 290, 280, 372], "x5": [296, 346], "1": [342, 236] } },
    ],
    reads: {
      from: 1,
      options: [
        { see: "Drop: the big stays back below the screen", open: "Pull up for the jumper" },
        {
          see: "Blitz: the big jumps out and two defenders trap the ball",
          open: "Pass to 5 on the short roll",
          steps: [
            { say: "1 dribbles off the screen. This time the defender on 5 jumps out above the screen and two defenders trap the ball. This is a Blitz.", go: { "1": [320, 155, 352, 196], "x1": [298, 160, 326, 182], "x5": [374, 208] } },
            { say: "5 stops the roll near the free-throw line. That is a short roll. 1 passes out of the trap to 5, who now has four attackers against three defenders.", go: { "5": [300, 262], "x5": [372, 206] }, pass: "5" },
          ],
          shot: "5",
        },
        {
          see: "Switch: the two defenders trade players",
          open: "Throw it inside to 5 against the smaller defender",
          steps: [
            { say: "1 dribbles off the screen. This time the two defenders switch. The big is now on 1 and the guard is on 5.", go: { "1": [320, 155, 352, 206], "x5": [344, 238], "x1": [296, 200] } },
            { say: "5 rolls with the smaller defender behind and seals under the rim. 1 throws it inside.", go: { "5": [300, 290, 276, 384], "x1": [304, 300, 298, 352], "x5": [344, 240] }, pass: "5" },
          ],
          shot: "5",
        },
        {
          see: "Under: the defender on the ball goes under the screen",
          open: "Shoot the three behind the screen",
          steps: [
            { say: "1 comes off the screen. This time the defender on 1 slides under the screen to meet 1 on the other side.", go: { "1": [316, 152, 338, 168], "x1": [282, 214, 326, 226], "x5": [300, 236] } },
            { say: "The defender went under, so nobody is on the ball. 1 stops behind the screen and shoots the three." },
          ],
          shot: "1",
        },
      ],
    },
    shot: "1",
    actions: ["Ball screen", "Drop", "Blitz", "Switch", "Under"],
    entry: "Live ball",
  },
  {
    id: "cov-side-pnr",
    name: "Side Pick and Roll",
    category: "coverages",
    level: 2,
    goal: "Know what Ice looks like on a side ball screen and how to beat it.",
    start: { "1": [420, 215], "2": [72, 250], "3": [20, 420], "4": [165, 168], "5": [330, 300] },
    ball: "1",
    steps: [
      { say: "5 comes up and sets a ball screen on the wing, on the middle side of 1.", go: { "5": [384, 200] }, screen: ["5"] },
      { say: "1 dribbles to the middle off the screen. The defender on 5 backs up.", go: { "1": [366, 170, 316, 196], "x1": [394, 190, 350, 192], "x5": [332, 290] } },
      { say: "1 turns the corner and gets into the lane. 5 rolls behind.", go: { "1": [300, 302], "5": [390, 300, 344, 372] } },
    ],
    reads: {
      from: 1,
      options: [
        { see: "The defender on 1 lets 1 use the screen and the big backs up", open: "Turn the corner to the middle" },
        {
          see: "Ice: the defender on 1 jumps to the top side and pushes 1 to the sideline",
          open: "Throw it back to 5 in the middle",
          steps: [
            { say: "This time the defender on 1 jumps to the top side and will not let 1 use the screen. 1 is pushed toward the sideline and the big waits below. This is Ice.", go: { "1": [442, 262], "x1": [406, 188, 424, 232], "x5": [410, 292] } },
            { say: "Both defenders are below the screen. 5 pops to the middle where nobody is, and 1 throws it back to 5.", go: { "5": [330, 196], "x5": [412, 294] }, pass: "5" },
          ],
          shot: "5",
        },
        {
          see: "Under: the defender on 1 goes under the screen",
          open: "Shoot the three behind the screen",
          steps: [
            { say: "This time the defender on 1 slides under the screen to meet 1 on the other side.", go: { "1": [398, 180], "x1": [400, 236, 362, 222], "x5": [352, 262] } },
            { say: "The defender went under, so nobody is on the ball. 1 stops behind the screen and shoots the three." },
          ],
          shot: "1",
        },
      ],
    },
    shot: "1",
    actions: ["Side ball screen", "Ice"],
    entry: "Live ball",
  },
  {
    id: "cov-pindown",
    name: "Pindown",
    category: "coverages",
    level: 2,
    goal: "Know the four ways a defender guards a pindown, and the cut that beats each one.",
    start: { "1": [165, 168], "2": [480, 420], "3": [20, 420], "4": [420, 270], "5": [132, 440] },
    ball: "1",
    steps: [
      { say: "4 sets a pindown for 2 in the corner.", go: { "4": [450, 358] }, screen: ["4"] },
      { say: "2 comes off the screen. The defender follows right behind, chasing over the top. This is lock and trail.", go: { "2": [434, 304, 396, 236], "x2": [470, 376, 434, 300] } },
      { say: "The defender is behind, so 2 curls tight toward the rim. 1 passes to 2.", go: { "2": [352, 262, 318, 340], "x2": [400, 262] }, pass: "2" },
    ],
    reads: {
      from: 1,
      options: [
        { see: "Lock and trail: the defender chases over the top", open: "Curl to the rim" },
        {
          see: "Shoot the gap: the defender cuts under the screen",
          open: "Fade to the corner",
          steps: [
            { say: "This time the defender cuts under the screen to meet 2 on the other side. That is shooting the gap.", go: { "2": [472, 384], "x2": [424, 374, 406, 300] } },
            { say: "2 does not run into the defender. 2 fades back to the corner and 1 throws the skip pass for three.", go: { "2": [482, 424], "x2": [404, 298] }, pass: "2" },
          ],
          shot: "2",
        },
        {
          see: "Top lock: the defender stands between 2 and the screen",
          open: "Backdoor cut",
          steps: [
            { say: "This time the defender jumps on top and stands between 2 and the screen. That is a top lock.", go: { "x2": [468, 386] } },
            { say: "2 does not fight it. 2 cuts backdoor along the baseline and 1 passes to 2 for the layup.", go: { "2": [420, 444, 304, 398], "x2": [452, 406, 402, 418] }, pass: "2" },
          ],
          shot: "2",
        },
        {
          see: "Switch: the two defenders trade players",
          open: "The screener slips to the rim",
          steps: [
            { say: "2 comes off the screen. This time the two defenders switch.", go: { "2": [434, 304, 396, 236], "x4": [414, 262], "x2": [464, 372] } },
            { say: "The defender now on 4 is on the wrong side. 4 slips to the rim and 1 passes to 4.", go: { "4": [382, 372, 302, 392], "x2": [442, 374], "x4": [412, 258] }, pass: "4" },
          ],
          shot: "4",
        },
      ],
    },
    shot: "2",
    actions: ["Pindown", "Lock and trail", "Shoot the gap", "Top lock", "Switch"],
    entry: "Live ball",
  },
];

// Study hall terms that are shown with a full play from this file.
const playForTerm: Record<string, string> = {
  Iverson: "iverson-curl",
  UCLA: "ucla-cut",
  Zoom: "zoom",
  Ram: "ram",
  Miami: "miami",
  Veer: "veer",
  Flex: "flex",
  Twist: "horns-twist",
  Oklahoma: "oklahoma",
};
export const playIdFor = (term: string): string | null => playForTerm[term.replace(/\s*\(.*\)\s*$/, "")] ?? null;

const PASS = 0.11; // must match the pass time in CourtStage

const RIM: [number, number] = [250, 413];

// Where a defender stands. It depends on where the ball is.
// On the ball: a step off, between the ball and the basket.
// One pass away: close, a step toward the ball and the basket.
// Far from the ball: off their player and shaded toward the lane, but close enough to get back.
// A corner defender on the far side is a few steps off, not hugged up and not buried in the paint.
// A defender only leaves their player completely when a read moves them there on purpose,
// so at the freeze there is one clear answer to "what is open?".
function guardSpot(p: [number, number], ball: [number, number], onBall: boolean): [number, number] {
  const toRim = Math.hypot(RIM[0] - p[0], RIM[1] - p[1]) || 1;
  if (onBall) {
    const off = Math.min(30, toRim * 0.6);
    return [Math.round(p[0] + ((RIM[0] - p[0]) / toRim) * off), Math.round(p[1] + ((RIM[1] - p[1]) / toRim) * off)];
  }
  // help spot: in front of the rim, shaded toward the ball
  const help: [number, number] = [RIM[0] + (ball[0] - RIM[0]) * 0.28, RIM[1] - 28 + (ball[1] - RIM[1]) * 0.28];
  const fromBall = Math.hypot(ball[0] - p[0], ball[1] - p[1]);
  const far = Math.max(0, Math.min(1, (fromBall - 150) / 270)); // 0 = one pass away, 1 = across the floor
  const dx = help[0] - p[0];
  const dy = help[1] - p[1];
  const dist = Math.hypot(dx, dy) || 1;
  const off = Math.max(Math.min(28, dist * 0.6), dist * (0.12 + 0.2 * far));
  return [Math.round(p[0] + (dx / dist) * off), Math.round(p[1] + (dy / dist) * off)];
}

// The steps for one read. Option 0 is the play as drawn.
export function stepsFor(play: Play, option = 0): Step[] {
  const read = play.reads?.options[option];
  return read?.steps ? [...play.steps.slice(0, play.reads!.from), ...read.steps] : play.steps;
}
export const shotFor = (play: Play, option = 0) => play.reads?.options[option]?.shot ?? play.shot;

// Turn a play's steps into timed paths. Step k runs from k/n to (k+1)/n.
export function toStage(play: Play, option = 0): StagePlay {
  const steps = stepsFor(play, option);
  const n = steps.length;
  const d = 1 / n;
  const paths: Record<string, Stop[]> = {};
  const pos: Record<string, [number, number]> = {};
  const offense = Object.keys(play.start).sort();
  for (const id of offense) {
    pos[id] = play.start[id];
    paths[id] = [[pos[id][0], pos[id][1], 0]];
  }
  const ball: StagePlay["ball"] = [];
  const screens: NonNullable<StagePlay["screens"]> = [];
  let holder = play.ball;
  const defense = play.reads ? offense.map((id) => `x${id}`) : [];
  // a defender who was put somewhere on purpose holds that coverage until their player moves
  const holding = new Set<string>();
  const spotFor = (x: string) => guardSpot(pos[x.slice(1)], pos[holder], x.slice(1) === holder);
  for (const x of defense) {
    if (play.guards?.[x]) holding.add(x);
    pos[x] = play.guards?.[x] ?? spotFor(x);
    paths[x] = [[pos[x][0], pos[x][1], 0]];
  }

  const move = (id: string, go: Go, t0: number, arrive: number) => {
    const path = paths[id];
    const last = path[path.length - 1];
    if (last[2] < t0) path.push([last[0], last[1], t0]);
    if (go.length === 4) {
      path.push([go[0], go[1], t0 + d * arrive * 0.5]);
      path.push([go[2], go[3], t0 + d * arrive]);
      pos[id] = [go[2], go[3]];
    } else {
      path.push([go[0], go[1], t0 + d * arrive]);
      pos[id] = [go[0], go[1]];
    }
  };

  steps.forEach((step, k) => {
    const t0 = k * d;
    const go = step.go ?? {};
    for (const [id, to] of Object.entries(go)) if (id in paths) move(id, to, t0, 0.85);
    if (step.pass) {
      // leave late enough to hit a cutter, early enough to land inside the step
      const leave = Math.max(0.05, Math.min(0.45, 1 - (PASS + 0.01) / d));
      ball.push({ until: t0 + d * leave, actor: holder });
      holder = step.pass;
    }
    // Defenders with no orders this step adjust to the ball and their player, a beat behind:
    // tight on the ball, sagged into help when the ball is far away.
    for (const x of defense) {
      const man = x.slice(1);
      if (x in go) {
        holding.add(x);
        continue;
      }
      if (man in go) holding.delete(x);
      if (holding.has(x)) continue;
      const to = spotFor(x);
      if (Math.hypot(to[0] - pos[x][0], to[1] - pos[x][1]) > 8) move(x, to, t0, 0.93);
    }
    for (const id of step.screen ?? []) screens.push({ t: t0 + d * 0.6, actor: id });
  });
  ball.push({ until: 1, actor: holder });

  return {
    actors: [...offense, ...defense].map((id) => {
      const path = paths[id];
      const last = path[path.length - 1];
      if (last[2] < 1) path.push([last[0], last[1], 1]);
      return { id, team: id.startsWith("x") ? ("defense" as const) : ("offense" as const), path };
    }),
    ball,
    screens,
  };
}
