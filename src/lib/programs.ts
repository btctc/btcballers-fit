export type Package = {
  id: string;
  sessions: number;
  price: string;
  perSession: string;
  label: string;
  terms: string[];
  badge?: string;
  highlight?: boolean;
};

export const season = {
  name: "Spring 2027",
  window: "Jan 10 - May 1, 2027",
  sessionsOffered: 25,
  intro:
    "Every package is the same training. Pick your number of sessions and come to any workout on the calendar - 25 offered, including both Midnight Madness nights. Every workout counts as one session.",
  schedule: [
    { day: "Tuesdays", time: "5:15P - 7:00P", where: "Home court" },
    { day: "Select Thursdays", time: "5:15P - 7:00P", where: "Home court" },
    { day: "Select Saturdays", time: "10:00A - 11:45A", where: "Home court" },
    { day: "Sundays (Jan 10, Jan 24, Feb 7)", time: "12:00P - 1:30P", where: "Faith Family" },
  ],
  noTraining:
    "No training: MLK weekend (Jan 15-18), Feb 12-15, spring break (Mar 12-22), and Easter weekend (Mar 26-29).",
  finale:
    "Season finale: Sat, May 1. Training 10:00A - 11:45A, then the End of Year Party until 3:30P. The party is free for package families.",
  weather:
    "Weather issue? That session gets a makeup day - you never lose a session you paid for.",
  policy: "No refunds - packages may be upgraded at any time by paying the difference.",
  payments:
    "Packages are paid in full at registration by Zelle or check. Need to split it up? Contact Coach T. Need my Zelle info? Email overtimeincorporated@gmail.com.",
  locations:
    "Private home court (address shared at registration) and Faith Family.",
};

const payUpFront = ["Paid in full at registration.", "Need to split it up? Contact Coach T."];

export const packages: Package[] = [
  {
    id: "12",
    sessions: 12,
    price: "$1,200",
    perSession: "$100 / session",
    label: "12-Session Package",
    terms: payUpFront,
  },
  {
    id: "16",
    sessions: 16,
    price: "$1,500",
    perSession: "$94 / session",
    label: "16-Session Package",
    terms: payUpFront,
  },
  {
    id: "20",
    sessions: 20,
    price: "$1,850",
    perSession: "$93 / session",
    label: "20-Session Package",
    terms: payUpFront,
  },
];

export const midnightMadness = {
  title: "Midnight Madness",
  nights: ["Friday, Mar 5", "Friday, Apr 9"],
  time: "4:00P - 9:00P",
  blurb:
    "Small-group training, dinner together, film, books, board games, and competitive play. We train. We compete. We hang out. Family style.",
  note: "Midnight Madness nights count as sessions from your package.",
};

export type Session = {
  key: string; // unique id
  dateKey: string; // YYYY-MM-DD - every workout counts as its own session
  label: string; // e.g. "Tue, Jan 26"
  time: string;
  where: "Home court" | "Faith Family";
  mm?: boolean; // Midnight Madness - counts as a session from your package
  partyUntil?: string; // End of Year Party runs after training until this time
};

const TUE_THU = "5:15P - 7:00P";
const SAT = "10:00A - 11:45A";
const SUN = "12:00P - 1:30P";
const MM = "4:00P - 9:00P";

export const sessions: Session[] = [
  { key: "2027-01-10", dateKey: "2027-01-10", label: "Sun, Jan 10", time: SUN, where: "Faith Family" },
  { key: "2027-01-24", dateKey: "2027-01-24", label: "Sun, Jan 24", time: SUN, where: "Faith Family" },
  { key: "2027-01-26", dateKey: "2027-01-26", label: "Tue, Jan 26", time: TUE_THU, where: "Home court" },
  { key: "2027-02-07", dateKey: "2027-02-07", label: "Sun, Feb 7", time: SUN, where: "Faith Family" },
  { key: "2027-02-16", dateKey: "2027-02-16", label: "Tue, Feb 16", time: TUE_THU, where: "Home court" },
  { key: "2027-02-18", dateKey: "2027-02-18", label: "Thu, Feb 18", time: TUE_THU, where: "Home court" },
  { key: "2027-02-20", dateKey: "2027-02-20", label: "Sat, Feb 20", time: SAT, where: "Home court" },
  { key: "2027-02-23", dateKey: "2027-02-23", label: "Tue, Feb 23", time: TUE_THU, where: "Home court" },
  { key: "2027-02-25", dateKey: "2027-02-25", label: "Thu, Feb 25", time: TUE_THU, where: "Home court" },
  { key: "2027-02-27", dateKey: "2027-02-27", label: "Sat, Feb 27", time: SAT, where: "Home court" },
  { key: "2027-03-02", dateKey: "2027-03-02", label: "Tue, Mar 2", time: TUE_THU, where: "Home court" },
  { key: "2027-03-05", dateKey: "2027-03-05", label: "Fri, Mar 5", time: MM, where: "Home court", mm: true },
  { key: "2027-03-09", dateKey: "2027-03-09", label: "Tue, Mar 9", time: TUE_THU, where: "Home court" },
  { key: "2027-03-23", dateKey: "2027-03-23", label: "Tue, Mar 23", time: TUE_THU, where: "Home court" },
  { key: "2027-03-30", dateKey: "2027-03-30", label: "Tue, Mar 30", time: TUE_THU, where: "Home court" },
  { key: "2027-04-01", dateKey: "2027-04-01", label: "Thu, Apr 1", time: TUE_THU, where: "Home court" },
  { key: "2027-04-03", dateKey: "2027-04-03", label: "Sat, Apr 3", time: SAT, where: "Home court" },
  { key: "2027-04-06", dateKey: "2027-04-06", label: "Tue, Apr 6", time: TUE_THU, where: "Home court" },
  { key: "2027-04-09", dateKey: "2027-04-09", label: "Fri, Apr 9", time: MM, where: "Home court", mm: true },
  { key: "2027-04-13", dateKey: "2027-04-13", label: "Tue, Apr 13", time: TUE_THU, where: "Home court" },
  { key: "2027-04-15", dateKey: "2027-04-15", label: "Thu, Apr 15", time: TUE_THU, where: "Home court" },
  { key: "2027-04-20", dateKey: "2027-04-20", label: "Tue, Apr 20", time: TUE_THU, where: "Home court" },
  { key: "2027-04-27", dateKey: "2027-04-27", label: "Tue, Apr 27", time: TUE_THU, where: "Home court" },
  { key: "2027-04-29", dateKey: "2027-04-29", label: "Thu, Apr 29", time: TUE_THU, where: "Home court" },
  { key: "2027-05-01", dateKey: "2027-05-01", label: "Sat, May 1", time: SAT, where: "Home court", partyUntil: "3:30P" },
];

export const privateTraining = {
  title: "Private & Semi-Private",
  blurb:
    "Private and semi-private sessions (1-3 players) at the home court. Reach out to Coach T for availability and details.",
  walkIn: "Single group session (walk-in): $125, subject to availability. Package members receive priority.",
};
