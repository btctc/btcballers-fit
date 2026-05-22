export type GlossaryEntry = {
  term: string;
  definition: string;
};

export type GlossarySection = {
  letter: string;
  entries: GlossaryEntry[];
};

export const glossarySections: GlossarySection[] = [
  {
    letter: "A",
    entries: [
      { term: "Action", definition: "A coordinated offensive or defensive movement, read, or set play." },
      { term: "Angle", definition: "The direction and body position of a screen, cut, drive, or pass that creates the best lane." },
      { term: "Attack", definition: "To put pressure on the defense by driving, cutting, passing ahead, or going at a matchup." },
      { term: "Attack the Rim", definition: "Drive or cut straight to the basket for a layup, dunk, foul, or close finish." },
      { term: "Away", definition: "A high cross screen from the top player for a weakside teammate cutting toward the ball." },
    ],
  },
  {
    letter: "B",
    entries: [
      { term: "Backcut (Backdoor)", definition: "A cut behind the defender toward the rim when the defender overplays the passing lane." },
      { term: "Ball Reversal", definition: "Moving the ball from one side of the floor to the other to shift the defense." },
      { term: "Ball Screen", definition: "An on-ball screen set for the player with the ball." },
      { term: "Baseline", definition: "The end line of the court, and any action or spacing that happens along it." },
      { term: "Baseline Out of Bounds (BLOB)", definition: "An inbound play run from under the basket." },
      { term: "Big", definition: "A frontcourt player, usually a power forward or center." },
      { term: "Block", definition: "The low post area near the basket, or a defensive shot rejection." },
      { term: "Box", definition: "A defensive alignment or the painted key area." },
      { term: "Box-and-1", definition: "A hybrid defense with four players in a zone and one defender denying a key scorer." },
      { term: "Brush", definition: "A light screen or brief contact that helps free a teammate." },
      { term: "Bubble", definition: "A cut or spacing move that briefly opens a pocket of room in the offense." },
      { term: "Bump", definition: "A defensive redirection of a cutter or controlled contact through a screening action." },
    ],
  },
  {
    letter: "C",
    entries: [
      { term: "Chase", definition: "A defensive technique where the defender trails a cutter over or around a screen." },
      { term: "Chase Screen", definition: "A screen designed to make the defender trail and recover from behind." },
      { term: "Chin", definition: "A weakside backscreen or UCLA-style cut that often flows into a ball screen." },
      { term: "Clear", definition: "Move players out of an area to open space for a drive, post-up, or isolation." },
      { term: "Closeout", definition: "A controlled defensive sprint to contest a shooter without giving up a straight-line drive." },
      { term: "Contest", definition: "Challenge a shot attempt with body control and hands without fouling." },
      { term: "Corner", definition: "The area where the baseline meets the 3-point line." },
      { term: "Cover", definition: "A defensive assignment, responsibility, or rotation." },
      { term: "Crash", definition: "Attack the glass aggressively, usually for offensive rebounds." },
      { term: "Cross", definition: "A horizontal cut or screen across the floor." },
      { term: "Cross Screen", definition: "An off-ball screen that lets a teammate cut across the lane or court." },
      { term: "Curl", definition: "A cut around a screen that bends toward the basket." },
      { term: "Cut", definition: "A quick off-ball movement to create space, pressure, or a passing window." },
      { term: "Cutter", definition: "The player making the cut." },
    ],
  },
  {
    letter: "D",
    entries: [
      { term: "Deep", definition: "Positioning close to the basket, in the post, or near the short corner." },
      { term: "Delay", definition: "An action that slows the pace and lets the offense read the defense before attacking." },
      { term: "Denial", definition: "Defensive positioning that prevents an easy pass to a player or area." },
      { term: "Dig", definition: "A quick help move into the paint or post to bother the ball and recover." },
      { term: "Dive", definition: "A hard cut to the rim, often by a screener after setting a ball screen." },
      { term: "Double", definition: "Two screeners working together, or two defenders trapping one offensive player." },
      { term: "Double Drag", definition: "Two consecutive ball screens, often used in transition or early offense." },
      { term: "Double Screen", definition: "Two offensive players screen together for one cutter." },
      { term: "Double Team", definition: "Two defenders converge on one offensive player to force a pass or mistake." },
      { term: "Down", definition: "Short for a down screen or pindown." },
      { term: "Down Screen (Pindown)", definition: "An off-ball screen that brings a player up from the baseline toward the perimeter." },
      { term: "Drag", definition: "A ball screen set in early offense, usually before the defense is fully matched." },
      { term: "Drive", definition: "Attack the basket with the dribble." },
      { term: "Drop", definition: "Pick-and-roll coverage where the big defender stays back near the paint." },
      { term: "Duck In", definition: "A quick seal into the post to receive the ball with inside position." },
      { term: "DHO (Dribble Hand-Off)", definition: "One player hands the ball directly to a teammate moving past them." },
    ],
  },
  {
    letter: "E",
    entries: [
      { term: "Early", definition: "Actions run before the offense settles into a full half-court set." },
      { term: "Elbow", definition: "The area where the free-throw line meets the lane line." },
      { term: "Elevator (Gate)", definition: "Two screeners open like doors for a cutter, then close the gap behind the cutter." },
      { term: "Empty", definition: "No offensive player is in the corner nearest the ball screen." },
      { term: "Even Front", definition: "An offensive alignment with balanced spacing across the top and wings." },
      { term: "Exchange", definition: "Two or more players swap spots through cuts, screens, or coordinated movement." },
    ],
  },
  {
    letter: "F",
    entries: [
      { term: "Fake", definition: "A deceptive movement that makes the defender react the wrong way." },
      { term: "Fill", definition: "Move into an open spot after a teammate cuts, drives, or passes." },
      { term: "Five-Out", definition: "Spacing with all five offensive players on the perimeter." },
      { term: "Flare (Fade)", definition: "An off-ball screen that sends a shooter away from the ball along the 3-point arc." },
      { term: "Flash", definition: "A quick cut to an open area, often the high post, to receive a pass." },
      { term: "Flex", definition: "A continuous offense or cross-screen action that creates cuts near the basket." },
      { term: "Float", definition: "A soft floater shot, or a floating cut into open space." },
      { term: "Flow", definition: "Continuous read-based movement that keeps the offense connected." },
      { term: "Freeze", definition: "Hold or pause an action to create a read, timing advantage, or defensive hesitation." },
      { term: "Front", definition: "Defensive positioning directly in front of a post player to deny the entry pass." },
      { term: "FIST", definition: "A common call for a horns-style set or action family; exact meaning can vary by team." },
    ],
  },
  {
    letter: "G",
    entries: [
      { term: "Ghost (Ghost Screen)", definition: "Fake a ball screen, then slip or pop away before making solid contact." },
      { term: "Give-and-Go", definition: "Pass to a teammate and immediately cut to the basket for a return pass." },
      { term: "Guard", definition: "A perimeter player, usually a point guard or shooting guard." },
    ],
  },
  {
    letter: "H",
    entries: [
      { term: "Hammer", definition: "A weakside backscreen or flare for a corner shooter, often while the ball drives baseline." },
      { term: "Hedge (Show)", definition: "The screener's defender steps out to slow the ballhandler before recovering." },
      { term: "Help", definition: "A defensive rotation that supports a teammate who has been beaten." },
      { term: "High", definition: "Positioning near the top of the key or high post." },
      { term: "Hook", definition: "A hook pass, hook shot, or post move using the body to shield the defender." },
      { term: "Horns", definition: "An alignment with two players at the elbows, a ballhandler up top, and wings or corners spaced." },
      { term: "Hustle", definition: "Aggressive effort on loose balls, rebounds, transition, and defensive plays." },
    ],
  },
  {
    letter: "I",
    entries: [
      { term: "In", definition: "Cutting, passing, or attacking toward the paint." },
      { term: "Inside", definition: "Playing or positioning in the paint or post area." },
      { term: "Isolation (Iso)", definition: "Clear space for one player to attack a defender 1-on-1." },
      { term: "Iverson (Iverson Cut)", definition: "A wing-to-wing cut across the elbows, named after Allen Iverson." },
    ],
  },
  {
    letter: "J",
    entries: [
      { term: "Jam", definition: "Physical defensive contact to disrupt a cut, catch, or finish without fouling." },
      { term: "Jet", definition: "A fast transition cut or speed-based action; exact meaning can vary by team." },
    ],
  },
  {
    letter: "K",
    entries: [
      { term: "Kick", definition: "Pass the ball out to a shooter after drawing help with a drive." },
      { term: "Knife", definition: "A sharp, direct cut through a gap in the defense." },
    ],
  },
  {
    letter: "L",
    entries: [
      { term: "Late Clock", definition: "The part of a possession when the shot clock is low and decisions must be fast." },
      { term: "Lob", definition: "A high pass thrown to a teammate cutting or jumping near the rim." },
      { term: "Load", definition: "Shift players or the ball to one side to prepare an action or create pressure." },
      { term: "Loop", definition: "A curving cut or repeated looping movement through the offense." },
      { term: "Low", definition: "Positioning near the low post, dunker spot, or baseline level." },
    ],
  },
  {
    letter: "M",
    entries: [
      { term: "Miami", definition: "A Zoom variation that often combines a dribble hand-off with a ball screen." },
      { term: "Middle", definition: "The center of the floor, or an attack that drives through the middle." },
      { term: "Mismatch", definition: "An advantage created by size, speed, skill, strength, or defensive assignment." },
      { term: "Motion", definition: "A read-based offense built on constant spacing, cuts, screens, and decisions." },
    ],
  },
  {
    letter: "N",
    entries: [
      { term: "North-South", definition: "Attacking vertically toward the basket instead of drifting side to side." },
    ],
  },
  {
    letter: "O",
    entries: [
      { term: "Off-Ball", definition: "Movement, screens, cuts, and reads by players who do not have the ball." },
      { term: "Oklahoma", definition: "A team-specific action name; coaches may use it for a local set, cut, or coverage call." },
      { term: "On-Ball", definition: "An action directly involving the player with the ball." },
      { term: "Out", definition: "Passing, cutting, or spacing away from the paint toward the perimeter." },
      { term: "Outlet", definition: "The first pass after a defensive rebound that starts transition." },
      { term: "Over", definition: "Going over a screen on defense, or a team-specific hand-off variation." },
    ],
  },
  {
    letter: "P",
    entries: [
      { term: "Pass", definition: "Move the ball to a teammate." },
      { term: "Pick-and-Pop", definition: "The screener steps out for a jumper after setting the ball screen." },
      { term: "Pick-and-Roll (PnR)", definition: "The ballhandler uses a screen while the screener rolls to the basket." },
      { term: "Pinch", definition: "A tight defensive squeeze or an angled screen that narrows space." },
      { term: "Pindown", definition: "A down screen that brings a player up from the baseline toward the perimeter." },
      { term: "Pivot", definition: "Footwork that lets a player change direction while keeping one foot anchored." },
      { term: "Pop", definition: "Step out to the perimeter after screening, usually for a catch-and-shoot look." },
      { term: "Portugal", definition: "A team-specific set or action name; meaning depends on the playbook." },
      { term: "Post (Post-Up)", definition: "Receive the ball near the paint with the back to the basket and a defender behind." },
      { term: "Post Double", definition: "Send a second defender to trap or bother a post player." },
      { term: "Post Double Teams", definition: "A defensive plan for doubling the post, including where the second defender comes from." },
      { term: "Pull", definition: "Pull up for a jumper or move the defense out of position." },
      { term: "Punch", definition: "A strong entry pass, aggressive drive, or direct post touch." },
    ],
  },
  {
    letter: "Q",
    entries: [
      { term: "Quick", definition: "A fast action, quick hitter, or transition play meant to attack before the defense is set." },
    ],
  },
  {
    letter: "R",
    entries: [
      { term: "Ram (Ram Screen)", definition: "An off-ball screen that frees a player to immediately set a ball screen." },
      { term: "Read", definition: "React to what the defense does instead of running a movement blindly." },
      { term: "Rejection", definition: "Reject a screen by changing direction before using it." },
      { term: "Relocate", definition: "Move to a new spot after passing, driving, cutting, or drawing help." },
      { term: "Reverse", definition: "Change the direction of the ball or action." },
      { term: "Rip", definition: "A forceful move through a defender's reach, or a hard cut across the body." },
      { term: "Rocket", definition: "A fast cut, release, or team-specific action built on speed." },
      { term: "Roll", definition: "The screener cuts to the basket after setting a ball screen." },
      { term: "Run", definition: "Transition offense or a specific called action." },
    ],
  },
  {
    letter: "S",
    entries: [
      { term: "Screen", definition: "A legal position set by an offensive player to free a teammate." },
      { term: "Shadow", definition: "A shadow cut or defensive shadow technique that mirrors an offensive movement." },
      { term: "Shadow Defense", definition: "A defensive technique where a player mirrors or tracks an opponent through action." },
      { term: "Shoot", definition: "Take a shot attempt." },
      { term: "Short", definition: "Short corner positioning, or a shortened version of an action." },
      { term: "Shuffle", definition: "A continuous cutting offense or a shuffle-style cut." },
      { term: "Side", definition: "A side of the court or a side ball screen." },
      { term: "Slip (Slip Screen)", definition: "Fake a screen, then cut to the basket before contact." },
      { term: "SLOB", definition: "Sideline out-of-bounds play." },
      { term: "Spain (Spain PnR)", definition: "A pick-and-roll with an extra backscreen on the rolling screener." },
      { term: "Specials", definition: "Special situation plays for time, score, opponent, or end-of-clock moments." },
      { term: "Stack", definition: "Players aligned vertically, common in inbounds and screening actions." },
      { term: "Stagger", definition: "Two or more off-ball screens set in sequence for one cutter." },
      { term: "Step-Out", definition: "Adjust outward to create spacing, passing angle, or defensive pressure." },
      { term: "Step-Up", definition: "A big steps up to set a ball screen, often from below the ballhandler." },
      { term: "Strongside", definition: "The side of the floor where the ball is located." },
      { term: "Switch", definition: "Defenders exchange assignments, usually on a screen." },
    ],
  },
  {
    letter: "T",
    entries: [
      { term: "Through (Thru)", definition: "Cutting or screening directly through an area of the floor." },
      { term: "Twist", definition: "A twisting cut, rescreen, or defensive rotation." },
      { term: "Two-Out", definition: "An offensive alignment with two players positioned on the perimeter." },
    ],
  },
  {
    letter: "U",
    entries: [
      { term: "UCLA", definition: "A backscreen for a player to cut from the slot to the basket after passing to the wing." },
      { term: "Under", definition: "Defender goes under a screen, or a guard screens for a big in an inverted action." },
      { term: "Up", definition: "Movement or screening upward toward the top of the floor." },
      { term: "Utah", definition: "A team-specific action or defensive call; exact meaning depends on the playbook." },
    ],
  },
  {
    letter: "V",
    entries: [
      { term: "Veer", definition: "A ball screen that flows immediately into an off-ball screen, or a defensive veer technique." },
    ],
  },
  {
    letter: "W",
    entries: [
      { term: "War Cutters", definition: "A team-specific weakside cutting series built on aggressive off-ball movement." },
      { term: "Weak", definition: "A coverage or call that pushes the ballhandler toward the weak hand or weak side." },
      { term: "Weakside", definition: "The side of the floor away from the ball." },
      { term: "Weakside I", definition: "A help-side alignment where two defenders stack in an I shape away from the ball." },
      { term: "Wedge", definition: "An angled backscreen that often frees a big to cut to the low block." },
      { term: "Wide", definition: "Another name for Away, a high cross screen for a weakside teammate." },
      { term: "Wing", definition: "The area between the corner and top of the key." },
    ],
  },
  {
    letter: "X",
    entries: [
      { term: "X-Cut", definition: "A crossing cut where players exchange paths in an X shape." },
    ],
  },
  {
    letter: "Z",
    entries: [
      { term: "Zipper", definition: "A down screen that brings a player from the low block up to the slot or perimeter." },
      { term: "Zoom", definition: "A three-player action that combines a screen and a dribble hand-off." },
    ],
  },
];

export const glossaryEntryCount = glossarySections.reduce(
  (total, section) => total + section.entries.length,
  0
);

