export type FallPackage = {
  id: string;
  sessions: number;
  price: string;
  perSession: string;
  label: string;
  terms: string[];
  bestValue?: boolean;
};

export const fallSeason = {
  name: "Fall 2026",
  window: "Aug 22 - Dec 3, 2026",
  sessionsOffered: 30,
  intro:
    "Every package is the same training. Pick your number of sessions and come to any session on the calendar - 30 offered. Every package includes both Midnight Madness nights.",
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
    bestValue: true,
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
  note: "Both nights are included in every package.",
};

export const privateTraining = {
  title: "Private & Semi-Private",
  blurb:
    "Private and semi-private sessions (1-3 players) at the home court. Reach out to Coach T for availability and details.",
  walkIn: "Single group session (walk-in): $125, subject to availability. Package members receive priority.",
};
