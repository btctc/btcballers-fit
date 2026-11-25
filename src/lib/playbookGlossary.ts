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
      { term: "At the Level", definition: "Pick-and-roll coverage where the screener's defender starts even with the screen." },
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
      { term: "Blitz", definition: "Pick-and-roll coverage where the screener's defender comes above the screen and helps trap the ball." },
      { term: "Block", definition: "The low post area near the basket, or a defensive shot rejection." },
      { term: "Boomerang", definition: "Pass to a teammate and get it right back, so you have a live dribble to attack your defender." },
      { term: "Box", definition: "Four players set up on the corners of a box around the lane. Common on baseline out-of-bounds plays." },
      { term: "Box-and-1", definition: "A hybrid defense with four players in a zone and one defender denying a key scorer." },
      { term: "Brush", definition: "A cut that gets in a defender's way like a screen, without making contact." },
      { term: "Bump", definition: "A defensive redirection of a cutter or controlled contact through a screening action." },
    ],
  },
  {
    letter: "C",
    entries: [
      { term: "Chase", definition: "A defensive technique where the defender trails a cutter over or around a screen." },
      { term: "Chase Screen", definition: "A screen designed to make the defender trail and recover from behind." },
      { term: "Chin", definition: "A backscreen for a player to cut from the weakside slot to the basket." },
      { term: "Clear", definition: "Move players out of an area to open space for a drive, post-up, or isolation." },
      { term: "Closeout", definition: "A controlled defensive sprint to contest a shooter without giving up a straight-line drive." },
      { term: "Contest", definition: "Challenge a shot attempt with body control and hands without fouling." },
      { term: "Corner", definition: "The area where the baseline meets the 3-point line." },
      { term: "Cover", definition: "A defensive assignment, responsibility, or rotation." },
      { term: "Crash", definition: "Attack the glass aggressively, usually for offensive rebounds." },
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
      { term: "DHO (Dribble Hand-Off)", definition: "A player dribbles at a teammate and hands them the ball as the teammate runs past. The dribble goes to the receiver, not the other way around." },
      { term: "Dig", definition: "A quick help move into the paint or post to bother the ball and recover." },
      { term: "Dive", definition: "A hard cut to the rim, often by a screener after setting a ball screen." },
      { term: "Double Drag", definition: "Two ball screens set one after the other, usually in transition, taking the ballhandler toward the middle. Also called 77." },
      { term: "Double Gap", definition: "Your nearest teammate is two passes away. The help is farther off, so the rule is to attack a double gap off the dribble." },
      { term: "Double Screen", definition: "Two offensive players screen together for one cutter." },
      { term: "Double Team", definition: "Two defenders converge on one offensive player to force a pass or mistake." },
      { term: "Down", definition: "Short for a down screen or pindown." },
      { term: "Down Screen (Pindown)", definition: "An off-ball screen that brings a player up from the baseline toward the perimeter." },
      { term: "Drag", definition: "A ball screen set in transition by a trailing big, taking the ballhandler toward the middle." },
      { term: "Drift", definition: "Slide to the opposite corner when the ball is driven baseline, so the driver has a pass waiting behind the help." },
      { term: "Drive", definition: "Attack the basket with the dribble." },
      { term: "Drop", definition: "Pick-and-roll coverage where the big defender stays back near the paint." },
      { term: "Duck In", definition: "A quick seal into the post to receive the ball with inside position." },
      { term: "Dunker Spot", definition: "The spot along the baseline just outside the lane, where a big waits for a drop-off pass or a lob when the drive draws help." },
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
      { term: "Extra Pass", definition: "Passing up a good shot to get a teammate a better one." },
    ],
  },
  {
    letter: "F",
    entries: [
      { term: "Fake", definition: "A deceptive movement that makes the defender react the wrong way." },
      { term: "Fill", definition: "Move into an open spot after a teammate cuts, drives, or passes." },
      { term: "First Action", definition: "The first thing the offense runs in a possession to try to create an advantage." },
      { term: "Five-Out", definition: "Spacing with all five offensive players on the perimeter." },
      { term: "Flare (Fade)", definition: "An off-ball screen that sends a shooter away from the ball along the 3-point arc." },
      { term: "Flash", definition: "A quick cut to an open area, often the high post, to receive a pass." },
      { term: "Flex", definition: "A baseline screen for a cutter going from the weakside corner to the ball-side block, followed by a down screen for the screener." },
      { term: "Float", definition: "Move into open space on the perimeter, away from the help, so the passer can find you." },
      { term: "Flow", definition: "Continuous read-based movement that keeps the offense connected." },
      { term: "Forty-Five Cut (45 Cut)", definition: "A cut from the wing to the basket on a 45-degree angle." },
      { term: "Front", definition: "Defensive positioning directly in front of a post player to deny the entry pass." },
    ],
  },
  {
    letter: "G",
    entries: [
      { term: "Gap", definition: "The space between two offensive players. How big it is decides whether you pass through it or drive it. A defender in the gap sits there to discourage the drive." },
      { term: "Ghost (Ghost Screen)", definition: "Fake a ball screen, then slip or pop away before making solid contact." },
      { term: "Give-and-Go", definition: "Pass to a teammate and immediately cut to the basket for a return pass." },
      { term: "Gortat Screen", definition: "After rolling, the big stops in the paint and seals their own defender, so the ballhandler has a clear lane to the rim. A common answer to drop coverage. It has to be a seal, not a moving screen." },
      { term: "Guard", definition: "A perimeter player, usually a point guard or shooting guard." },
      { term: "Guard Your Yard", definition: "Keep the ballhandler in front of you on your own, within about a step to either side, so your teammates do not have to leave their players to help." },
    ],
  },
  {
    letter: "H",
    entries: [
      { term: "Hammer", definition: "A weakside flare screen that sends a shooter from the wing to the corner while the ball is driven baseline." },
      { term: "Hedge (Show)", definition: "The screener's defender steps out to slow the ballhandler before recovering." },
      { term: "Help", definition: "A defensive rotation that supports a teammate who has been beaten." },
      { term: "High", definition: "Positioning near the top of the key or high post." },
      { term: "Hook Pass", definition: "A one-handed pass swung over or around a defender, using the body to shield the ball." },
      { term: "Horns", definition: "An alignment with two bigs set up high, just above the elbows, a ballhandler up top, and a player in each corner." },
    ],
  },
  {
    letter: "I",
    entries: [
      { term: "Ice", definition: "Coverage on a side ball screen where the on-ball defender pushes the ballhandler toward the sideline." },
      { term: "In", definition: "Cutting, passing, or attacking toward the paint." },
      { term: "Inside", definition: "Playing or positioning in the paint or post area." },
      { term: "Isolation (Iso)", definition: "Clear space for one player to attack a defender 1-on-1." },
      { term: "Iverson (Iverson Cut)", definition: "A cut from one wing to the other across the top, usually over two bigs at the elbows." },
    ],
  },
  {
    letter: "J",
    entries: [
      { term: "Jam", definition: "Physical defensive contact to disrupt a cut, catch, or finish without fouling." },
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
      { term: "Load", definition: "Shift extra defenders toward the ball to shrink the driving lane." },
      { term: "Loop", definition: "A curving cut or repeated looping movement through the offense." },
      { term: "Low", definition: "Positioning near the low post, dunker spot, or baseline level." },
      { term: "Low Drop", definition: "Pick-and-roll coverage where the big sinks all the way back to the rim instead of meeting the ball higher." },
      { term: "Low Man", definition: "The weakside help defender closest to the baseline, who protects the rim." },
    ],
  },
  {
    letter: "M",
    entries: [
      { term: "Miami", definition: "A dribble hand-off followed right away by a ball screen for the player who took the hand-off." },
      { term: "Middle", definition: "The center of the floor, or an attack that drives through the middle." },
      { term: "Mismatch", definition: "An advantage created by size, speed, skill, strength, or defensive assignment." },
      { term: "Motion", definition: "A read-based offense built on constant spacing, cuts, screens, and decisions." },
    ],
  },
  {
    letter: "N",
    entries: [
      { term: "Nail", definition: "The middle of the free-throw line, where a help defender usually sets up." },
      { term: "North-South", definition: "Attacking vertically toward the basket instead of drifting side to side." },
    ],
  },
  {
    letter: "O",
    entries: [
      { term: "Off-Ball", definition: "Defense on a player who does not have the ball: seeing both ball and man, denying, and helping." },
      { term: "Oklahoma", definition: "A Double Drag where the second screener then screens for the first screener, who comes back toward the ball." },
      { term: "On-Ball", definition: "Defense on the player who has the ball." },
      { term: "Out", definition: "Passing, cutting, or spacing away from the paint toward the perimeter." },
      { term: "Outlet", definition: "The first pass after a defensive rebound that starts transition." },
      { term: "Over", definition: "Pick-and-roll coverage where the on-ball defender fights over the top of the screen." },
    ],
  },
  {
    letter: "P",
    entries: [
      { term: "Paint Touch", definition: "Getting the ball into the lane by pass or dribble so the defense has to collapse." },
      { term: "Peel Switch", definition: "When a defender gets beaten, a teammate takes the ball and the beaten defender peels off to the open man." },
      { term: "Pick-and-Pop", definition: "The screener steps out for a jumper after setting the ball screen." },
      { term: "Pick-and-Roll (PnR)", definition: "The ballhandler uses a screen while the screener rolls to the basket." },
      { term: "Pinch Post", definition: "A big at the weakside elbow who is used as a passing and hand-off hub." },
      { term: "Pindown", definition: "A down screen that brings a player up from the baseline toward the perimeter." },
      { term: "Pistol", definition: "An early-offense action on the wing between the ballhandler, a guard coming up from the corner, and a trailing big. Also called 21." },
      { term: "Pivot", definition: "Footwork that lets a player change direction while keeping one foot anchored." },
      { term: "Pocket Pass", definition: "A tight bounce pass to the roller through the gap between two defenders." },
      { term: "Pop", definition: "Step out to the perimeter after screening, usually for a catch-and-shoot look." },
      { term: "Post (Post-Up)", definition: "Receive the ball near the paint with the back to the basket and a defender behind." },
      { term: "Post Double", definition: "Send a second defender to trap or bother a post player." },
      { term: "Pull-Up", definition: "Stop on the dribble and rise up for a jump shot." },
      { term: "Punch", definition: "A post-up. To punch it in is to throw the ball into the post." },
    ],
  },
  {
    letter: "Q",
    entries: [
      { term: "Quick", definition: "A quick hitter. A fast action meant to get an open shot right away." },
    ],
  },
  {
    letter: "R",
    entries: [
      { term: "Ram (Ram Screen)", definition: "A player gets an off-ball screen and then goes straight into setting a ball screen." },
      { term: "Read", definition: "React to what the defense does instead of running a movement blindly." },
      { term: "Rejection", definition: "Reject a screen by changing direction before using it." },
      { term: "Relocate", definition: "Move to a new spot after passing, driving, cutting, or drawing help." },
      { term: "Reverse", definition: "Change the direction of the ball or action." },
      { term: "Rip", definition: "A back screen. The name is most often used when a guard sets it for a big." },
      { term: "Rip Through", definition: "A strong sweep of the ball through a defender's reach to get into a drive or a shot." },
      { term: "Roll", definition: "The screener cuts to the basket after setting a ball screen." },
    ],
  },
  {
    letter: "S",
    entries: [
      { term: "Scram Switch", definition: "A second, off-ball switch that fixes a mismatch created by an earlier switch, such as a small defender stuck in the post." },
      { term: "Screen", definition: "A legal position set by an offensive player to free a teammate." },
      { term: "Second Action", definition: "What the offense flows into when the first action is stopped, before the defense can reset." },
      { term: "Shake", definition: "Lift from the corner up to the wing as the roller dives, so the defender who helps on the roll cannot get back to you." },
      { term: "Short Corner", definition: "The spot close to the baseline just outside the lane. Also called the dunker spot." },
      { term: "Short Roll", definition: "The screener stops the roll near the free-throw line to catch the ball and make the next play." },
      { term: "Shuffle", definition: "A continuous cutting offense or a shuffle-style cut." },
      { term: "Side", definition: "A side of the court or a side ball screen." },
      { term: "Single Gap", definition: "Your nearest teammate is one pass away. The help defender is close, so the rule is to pass through a single gap, not drive it." },
      { term: "Skip Pass", definition: "A long pass over the defense from one side of the floor to the other." },
      { term: "Slip (Slip Screen)", definition: "Fake a screen, then cut to the basket before contact." },
      { term: "SLOB", definition: "Sideline out-of-bounds play." },
      { term: "Slot", definition: "The spot above the wing, outside the 3-point line and in line with the edge of the lane. Many actions start here." },
      { term: "Spain (Spain PnR)", definition: "A pick-and-roll with an extra backscreen on the rolling screener." },
      { term: "Specials", definition: "Special situation plays for time, score, opponent, or end-of-clock moments." },
      { term: "Stack", definition: "Another name for the Spain pick-and-roll. Some coaches also use it for players lined up one behind another on an inbounds play." },
      { term: "Stagger", definition: "Two screens set in the same direction for the same cutter, one after the other." },
      { term: "Step-Up", definition: "A side ball screen set with the screener's back to the baseline." },
      { term: "Strongside", definition: "The side of the floor where the ball is located." },
      { term: "Stunt", definition: "A quick lunge at a player who is not yours, then a jump back to your own man." },
      { term: "Switch", definition: "Defenders exchange assignments, usually on a screen." },
    ],
  },
  {
    letter: "T",
    entries: [
      { term: "Tag", definition: "A help defender bumps the roller for a moment, then sprints back out to their own man." },
      { term: "Through (Thru)", definition: "Cutting or screening directly through an area of the floor." },
      { term: "Top Lock", definition: "Standing between a shooter and the screen so they cannot use it." },
      { term: "Triple Gap", definition: "Your nearest teammate is three passes away. The biggest driving lane on the floor. Attack it." },
      { term: "Twist", definition: "The ballhandler uses two ball screens from two different teammates, set in opposite directions. Often run out of Horns." },
      { term: "Two-Out", definition: "An offensive alignment with two players positioned on the perimeter." },
    ],
  },
  {
    letter: "U",
    entries: [
      { term: "UCLA", definition: "A backscreen for a player to cut from the slot to the basket after passing to the wing." },
      { term: "Under", definition: "Pick-and-roll coverage where the on-ball defender slides underneath the screen." },
      { term: "Up", definition: "Movement or screening upward toward the top of the floor." },
    ],
  },
  {
    letter: "V",
    entries: [
      { term: "Veer", definition: "A ball screen followed by an off-ball screen from the same screener, usually a wide pindown, instead of a roll." },
    ],
  },
  {
    letter: "W",
    entries: [
      { term: "Weak", definition: "A coverage or call that pushes the ballhandler toward the weak hand or weak side." },
      { term: "Weakside", definition: "The side of the floor away from the ball." },
      { term: "Weakside I", definition: "A help-side alignment where two defenders stack in an I shape away from the ball." },
      { term: "Wedge", definition: "An angled backscreen set by a guard for a big cutting from the top of the key to the low block." },
      { term: "Wide", definition: "Another name for Away, a high cross screen for a weakside teammate." },
      { term: "Wing", definition: "The area between the corner and top of the key." },
    ],
  },
  {
    letter: "X",
    entries: [
      { term: "X-Cut", definition: "A crossing cut where players exchange paths in an X shape." },
      { term: "X-Out", definition: "Two defenders cross paths to close out on each other's shooters after a scramble." },
    ],
  },
  {
    letter: "Z",
    entries: [
      { term: "Zipper", definition: "A down screen for a player on the strongside block, who cuts straight up to the slot for a pass from the wing." },
      { term: "Zoom", definition: "A pindown that flows right into a dribble hand-off for the same player. Also called Chicago." },
    ],
  },
];

export const glossaryEntryCount = glossarySections.reduce(
  (total, section) => total + section.entries.length,
  0
);

