export type CampWeek = {
  id: string;
  dates: string;
  spotsLeft: number;
  spotsTotal: number;
};

export const campWeeks: CampWeek[] = [
  { id: "jun-08", dates: "Jun 8 - 12", spotsLeft: 3, spotsTotal: 4 },
  { id: "jun-15", dates: "Jun 15 - 19", spotsLeft: 3, spotsTotal: 4 },
  { id: "jun-22", dates: "Jun 22 - 26", spotsLeft: 3, spotsTotal: 4 },
  { id: "jul-06", dates: "Jul 6 - 10", spotsLeft: 1, spotsTotal: 4 },
  { id: "jul-27", dates: "Jul 27 - 31", spotsLeft: 3, spotsTotal: 4 },
  { id: "aug-03", dates: "Aug 3 - 7", spotsLeft: 4, spotsTotal: 4 },
];

export const camp = {
  title: "Summer Camp",
  price: "$700 / week",
  blurb: "Week-long basketball immersion at my home court. Small groups. Four kids per week. Camp runs 9:30A to 4P.",
  hours: "9:30A to 4P",
  note: "The daily flow stays fluid for weather. We adjust court time, recovery, book reads, and character development so the day still has purpose.",
  schedule: [
    { time: "9:30A", what: "Basketball training" },
    { time: "10:30A", what: "Strength and stretch (Tue and Thu at SandersFit)" },
    { time: "12P", what: "Lunch (bring your own)" },
    { time: "1:30P", what: "Training, play, book reads, and character development" },
    { time: "3P", what: "Recovery and snack" },
    { time: "4P", what: "Pickup" },
  ],
  dropIn: [
    { label: "Full day (9:30A to 4P)", price: "$170" },
    { label: "Half day (9:30A to 12P)", price: "$100" },
    { label: "Half day (1:30P to 4P)", price: "$100" },
    { label: "Full week", price: "$700" },
  ],
};

export const training = {
  title: "Summer Training",
  price: "$1,000",
  blurb: "Twelve sessions. Ninety minutes each. Basketball, strength, recovery. Built around your kid.",
  window: "Jun 8 to Aug 6",
  availability: "Mon to Thu 5:30P to 8P. Sat and Sun by arrangement.",
  includes: [
    "Skill work and ball handling",
    "Shooting mechanics and reps",
    "Strength and conditioning",
    "Stretching and recovery",
  ],
};

export const openGym = {
  title: "Open Gym",
  price: "Free",
  blurb: "Free 5-on-5 at Alcuin. Bring friends. Just hooping.",
  time: "5P to 7P, Mon and Wed",
  dates: ["Jun 15", "Jun 17", "Jun 22", "Jun 24", "Jul 6", "Jul 8"],
  dateKeys: ["2026-06-15", "2026-06-17", "2026-06-22", "2026-06-24", "2026-07-06", "2026-07-08"],
  note: "Campers can ride with me if needed.",
};
