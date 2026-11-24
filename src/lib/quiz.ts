// Playbook quiz content. Meanings are short, kid-friendly versions of the
// definitions in playbookGlossary.ts. Levels go from easiest to hardest.
// Keep 8 terms and 4 true/false statements in every level.

export type Term = { term: string; meaning: string };
export type TrueFalse = { statement: string; answer: boolean; why: string };
export type Level = { id: string; rank: string; theme: string; terms: Term[]; trueFalse: TrueFalse[] };

export const levels: Level[] = [
  {
    id: "rookie",
    rank: "Rookie",
    theme: "The floor and the basics",
    terms: [
      { term: "Baseline", meaning: "The end line of the court, under the basket." },
      { term: "Corner", meaning: "Where the baseline meets the 3-point line." },
      { term: "Wing", meaning: "The area between the corner and the top of the key." },
      { term: "Elbow", meaning: "Where the free-throw line meets the lane line." },
      { term: "Lob", meaning: "A high pass thrown to a teammate near the rim." },
      { term: "Drive", meaning: "Attack the basket with the dribble." },
      { term: "Cut", meaning: "A quick move without the ball to get open." },
      { term: "Screen", meaning: "A legal position set to free a teammate." },
    ],
    trueFalse: [
      { statement: "A drive means attacking the basket with the dribble.", answer: true, why: "Drive: attack the basket with the dribble." },
      { statement: "The corner is at the top of the key.", answer: false, why: "The corner is where the baseline meets the 3-point line." },
      { statement: "You need the ball in your hands to make a cut.", answer: false, why: "A cut is a quick move without the ball." },
      { statement: "A lob is a low bounce pass.", answer: false, why: "A lob is a high pass thrown to a teammate near the rim." },
    ],
  },
  {
    id: "sixth-man",
    rank: "Sixth Man",
    theme: "Moving without the ball",
    terms: [
      { term: "Backcut", meaning: "A cut behind the defender toward the rim when they overplay the pass." },
      { term: "Give-and-Go", meaning: "Pass to a teammate, then cut to the basket for a return pass." },
      { term: "Fill", meaning: "Move into the open spot a teammate just left." },
      { term: "Flash", meaning: "A quick cut to an open area, often the high post, to catch a pass." },
      { term: "Curl", meaning: "A cut around a screen that bends toward the basket." },
      { term: "Kick", meaning: "Pass out to a shooter after your drive draws help." },
      { term: "Fake", meaning: "A move that makes the defender react the wrong way." },
      { term: "Pivot", meaning: "Footwork that lets you turn while one foot stays planted." },
    ],
    trueFalse: [
      { statement: "On a give-and-go, you pass and then stand still.", answer: false, why: "Give-and-go: pass, then cut to the basket for a return pass." },
      { statement: "A backcut goes behind the defender toward the rim.", answer: true, why: "Backcut: cut behind the defender when they overplay the pass." },
      { statement: "A kick is a pass out to a shooter after a drive.", answer: true, why: "Kick: pass out to a shooter after your drive draws help." },
      { statement: "When you pivot, both feet can move anywhere.", answer: false, why: "On a pivot, one foot stays planted." },
    ],
  },
  {
    id: "starter",
    rank: "Starter",
    theme: "Screens and the two-player game",
    terms: [
      { term: "Ball Screen", meaning: "A screen set for the player who has the ball." },
      { term: "Roll", meaning: "The screener cuts to the basket after a ball screen." },
      { term: "Pop", meaning: "The screener steps out to the perimeter for a catch-and-shoot look." },
      { term: "Slip", meaning: "Fake a screen, then cut to the basket before contact." },
      { term: "DHO", meaning: "One player hands the ball to a teammate moving past them." },
      { term: "Pindown", meaning: "An off-ball screen that brings a player up from the baseline." },
      { term: "Flare", meaning: "An off-ball screen that sends a shooter away from the ball." },
      { term: "Rejection", meaning: "Change direction before using the screen." },
    ],
    trueFalse: [
      { statement: "On a roll, the screener cuts to the basket.", answer: true, why: "Roll: the screener cuts to the basket after a ball screen." },
      { statement: "On a pop, the screener dives to the rim.", answer: false, why: "On a pop, the screener steps out to the perimeter." },
      { statement: "DHO stands for dribble hand-off.", answer: true, why: "DHO: one player hands the ball to a teammate moving past." },
      { statement: "A slip means you set a hard screen and hold it.", answer: false, why: "Slip: fake the screen, then cut before contact." },
    ],
  },
  {
    id: "captain",
    rank: "Captain",
    theme: "Defense talk",
    terms: [
      { term: "Closeout", meaning: "A controlled sprint to contest a shooter without giving up a straight drive." },
      { term: "Contest", meaning: "Challenge a shot with body control and hands, without fouling." },
      { term: "Denial", meaning: "Positioning that takes away an easy pass to a player." },
      { term: "Help", meaning: "A rotation that supports a teammate who has been beaten." },
      { term: "Switch", meaning: "Defenders trade assignments, usually on a screen." },
      { term: "Double Team", meaning: "Two defenders converge on one offensive player." },
      { term: "Dig", meaning: "A quick stab at the ball in the paint or post, then recover." },
      { term: "Drop", meaning: "Pick-and-roll coverage where the big stays back near the paint." },
    ],
    trueFalse: [
      { statement: "On a switch, defenders trade who they are guarding.", answer: true, why: "Switch: defenders trade assignments, usually on a screen." },
      { statement: "A closeout means running at the shooter out of control.", answer: false, why: "A closeout is a controlled sprint. You contest without giving up the drive." },
      { statement: "A double team uses two defenders on one offensive player.", answer: true, why: "Double team: two defenders converge on one player." },
      { statement: "In drop coverage, the big steps out past the 3-point line.", answer: false, why: "In drop, the big stays back near the paint." },
    ],
  },
  {
    id: "floor-general",
    rank: "All-Star",
    theme: "Spacing and seeing the floor",
    terms: [
      { term: "Strongside", meaning: "The side of the floor where the ball is." },
      { term: "Weakside", meaning: "The side of the floor away from the ball." },
      { term: "Five-Out", meaning: "All five offensive players spaced on the perimeter." },
      { term: "Ball Reversal", meaning: "Moving the ball from one side to the other to shift the defense." },
      { term: "Isolation", meaning: "Clear space for one player to attack 1-on-1." },
      { term: "Mismatch", meaning: "An advantage in size, speed, skill, or strength." },
      { term: "Outlet", meaning: "The first pass after a defensive rebound that starts transition." },
      { term: "Horns", meaning: "Two players at the elbows with the ballhandler up top." },
    ],
    trueFalse: [
      { statement: "The weakside is the side of the floor where the ball is.", answer: false, why: "Weakside is away from the ball. Strongside is where the ball is." },
      { statement: "Five-out puts all five offensive players on the perimeter.", answer: true, why: "Five-out: all five spaced on the perimeter." },
      { statement: "The outlet is the first pass after a defensive rebound.", answer: true, why: "Outlet: the first pass after a defensive rebound. It starts transition." },
      { statement: "A ball reversal keeps the ball on one side of the floor.", answer: false, why: "A ball reversal moves the ball from one side to the other." },
    ],
  },
  {
    id: "coach",
    rank: "Hall of Fame",
    theme: "Advanced actions",
    terms: [
      { term: "Stagger", meaning: "Two or more off-ball screens set in a row for one cutter." },
      { term: "Elevator", meaning: "Two screeners open like doors for a cutter, then close behind them." },
      { term: "Spain", meaning: "A pick-and-roll with an extra backscreen on the rolling screener." },
      { term: "Double Drag", meaning: "Two ball screens back to back, often in transition." },
      { term: "Hammer", meaning: "A weakside screen for a corner shooter while the ball drives baseline." },
      { term: "Ghost", meaning: "Fake a ball screen, then slip or pop away before contact." },
      { term: "Zipper", meaning: "A down screen that brings a player from the low block up to the perimeter." },
      { term: "Hedge", meaning: "The screener's defender steps out to slow the ballhandler, then recovers." },
    ],
    trueFalse: [
      { statement: "A stagger uses two or more screens in a row for one cutter.", answer: true, why: "Stagger: two or more off-ball screens in a row for one cutter." },
      { statement: "Spain pick-and-roll adds a backscreen on the roller.", answer: true, why: "Spain: a pick-and-roll with an extra backscreen on the rolling screener." },
      { statement: "On a ghost screen, the screener makes hard contact and holds it.", answer: false, why: "Ghost: fake the ball screen and leave before contact." },
      { statement: "A hedge is an offensive move.", answer: false, why: "A hedge is defense. The screener's defender steps out, then recovers." },
    ],
  },
];
