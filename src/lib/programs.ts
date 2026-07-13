export type FallPackage = {
  id: string;
  sessions: number;
  price: string;
  perSession: string;
  label: string;
  terms: string[];
  badge?: string;
  highlight?: boolean;
};

export const fallSeason = {
  name: "Fall 2026",
  window: "Aug 22 - Dec 3, 2026",
  sessionsOffered: 32,
  intro:
    "Every package is the same training. Pick your number of sessions and come to any session on the calendar - 32 offered, including both Midnight Madness nights.",
  schedule: [
    { day: "Tuesdays & Wednesdays", time: "4:00P - 5:45P", where: "Home court" },
    { day: "Thursdays", time: "5:15P - 7:00P", where: "Home court" },
    { day: "Saturdays", time: "10:00A - 11:45A", where: "Home court" },
    {
      day: "Sundays",
      time: "11:00A - 12:45P",
      where: "SandersFit, plus an optional session with Coach Yemi at Life School Oak Cliff, 1:00P - 2:30P (included)",
    },
  ],
  noTraining:
    "No training: Labor Day weekend (Sep 5-7), Oct 3-11 (fall break), Halloween (Oct 31), Nov 7-8, and Thanksgiving Break (Nov 23-29).",
  weather:
    "If weather delays, we wait until clear or reschedule. If that's not possible, we use the time for film, discussion, or SandersFit.",
  policy: "No refunds - packages may be upgraded at any time by paying the difference.",
  locations:
    "Private home court (address shared at registration), SandersFit, and Life School Oak Cliff.",
};

export const fallPackages: FallPackage[] = [
  {
    id: "12",
    sessions: 12,
    price: "$1,200",
    perSession: "$100 / session",
    label: "12-Session Package",
    terms: ["Paid in full at registration."],
  },
  {
    id: "18",
    sessions: 18,
    price: "$1,700",
    perSession: "$94 / session",
    label: "18-Session Package",
    badge: "Most popular",
    highlight: true,
    terms: [
      "Pay upfront, or half ($850) at registration + $425/month for 2 months.",
      "Payments due by the 12th (Oct 12 & Nov 12).",
    ],
  },
  {
    id: "25",
    sessions: 25,
    price: "$2,200",
    perSession: "$88 / session",
    label: "25-Session Package",
    badge: "Best value",
    terms: [
      "Pay upfront, or half ($1,100) at registration + $275/month for 4 months.",
      "Payments due by the 12th of each month (Sep 12 - Dec 12).",
    ],
  },
];

export const midnightMadness = {
  title: "Midnight Madness",
  nights: ["Friday, Sep 18", "Friday, Nov 13"],
  time: "4:00P - 9:00P",
  blurb:
    "Small-group training, dinner together, film, books, board games, and competitive play. We train. We compete. We hang out. Family style.",
  note: "Midnight Madness nights count as sessions from your package.",
};

export type FallSession = {
  dateKey: string; // YYYY-MM-DD
  label: string; // e.g. "Sat, Aug 22"
  time: string;
  where: "Home court" | "SandersFit";
  yemi?: boolean;
  mm?: boolean; // Midnight Madness - counts as a session from your package
};

export const fallSessions: FallSession[] = [
  { dateKey: "2026-08-22", label: "Sat, Aug 22", time: "10:00A - 11:45A", where: "Home court" },
  { dateKey: "2026-08-23", label: "Sun, Aug 23", time: "11:00A - 12:45P", where: "SandersFit", yemi: true },
  { dateKey: "2026-08-29", label: "Sat, Aug 29", time: "10:00A - 11:45A", where: "Home court" },
  { dateKey: "2026-09-01", label: "Tue, Sep 1", time: "4:00P - 5:45P", where: "Home court" },
  { dateKey: "2026-09-08", label: "Tue, Sep 8", time: "4:00P - 5:45P", where: "Home court" },
  { dateKey: "2026-09-10", label: "Thu, Sep 10", time: "5:15P - 7:00P", where: "Home court" },
  { dateKey: "2026-09-12", label: "Sat, Sep 12", time: "10:00A - 11:45A", where: "Home court" },
  { dateKey: "2026-09-15", label: "Tue, Sep 15", time: "4:00P - 5:45P", where: "Home court" },
  { dateKey: "2026-09-16", label: "Wed, Sep 16", time: "4:00P - 5:45P", where: "Home court" },
  { dateKey: "2026-09-18", label: "Fri, Sep 18", time: "4:00P - 9:00P", where: "Home court", mm: true },
  { dateKey: "2026-09-20", label: "Sun, Sep 20", time: "11:00A - 12:45P", where: "SandersFit", yemi: true },
  { dateKey: "2026-09-22", label: "Tue, Sep 22", time: "4:00P - 5:45P", where: "Home court" },
  { dateKey: "2026-09-24", label: "Thu, Sep 24", time: "5:15P - 7:00P", where: "Home court" },
  { dateKey: "2026-09-26", label: "Sat, Sep 26", time: "10:00A - 11:45A", where: "Home court" },
  { dateKey: "2026-10-06", label: "Tue, Oct 6", time: "4:00P - 5:45P", where: "Home court" },
  { dateKey: "2026-10-14", label: "Wed, Oct 14", time: "4:00P - 5:45P", where: "Home court" },
  { dateKey: "2026-10-18", label: "Sun, Oct 18", time: "11:00A - 12:45P", where: "SandersFit", yemi: true },
  { dateKey: "2026-10-20", label: "Tue, Oct 20", time: "4:00P - 5:45P", where: "Home court" },
  { dateKey: "2026-10-22", label: "Thu, Oct 22", time: "5:15P - 7:00P", where: "Home court" },
  { dateKey: "2026-10-24", label: "Sat, Oct 24", time: "10:00A - 11:45A", where: "Home court" },
  { dateKey: "2026-10-27", label: "Tue, Oct 27", time: "4:00P - 5:45P", where: "Home court" },
  { dateKey: "2026-10-28", label: "Wed, Oct 28", time: "4:00P - 5:45P", where: "Home court" },
  { dateKey: "2026-11-01", label: "Sun, Nov 1", time: "11:00A - 12:45P", where: "SandersFit", yemi: true },
  { dateKey: "2026-11-03", label: "Tue, Nov 3", time: "4:00P - 5:45P", where: "Home court" },
  { dateKey: "2026-11-10", label: "Tue, Nov 10", time: "4:00P - 5:45P", where: "Home court" },
  { dateKey: "2026-11-11", label: "Wed, Nov 11", time: "4:00P - 5:45P", where: "Home court" },
  { dateKey: "2026-11-13", label: "Fri, Nov 13", time: "4:00P - 9:00P", where: "Home court", mm: true },
  { dateKey: "2026-11-14", label: "Sat, Nov 14", time: "10:00A - 11:45A", where: "Home court" },
  { dateKey: "2026-11-17", label: "Tue, Nov 17", time: "4:00P - 5:45P", where: "Home court" },
  { dateKey: "2026-11-19", label: "Thu, Nov 19", time: "5:15P - 7:00P", where: "Home court" },
  { dateKey: "2026-12-02", label: "Wed, Dec 2", time: "4:00P - 5:45P", where: "Home court" },
  { dateKey: "2026-12-03", label: "Thu, Dec 3", time: "5:15P - 7:00P", where: "Home court" },
];

export const privateTraining = {
  title: "Private & Semi-Private",
  blurb:
    "Private and semi-private sessions (1-3 players) at the home court. Reach out to Coach T for availability and details.",
  walkIn: "Single group session (walk-in): $125, subject to availability. Package members receive priority.",
};
