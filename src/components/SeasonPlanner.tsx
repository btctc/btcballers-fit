"use client";

import { useMemo, useState } from "react";
import { sessions, packages, season, type Session, type Package } from "@/lib/programs";
import { site } from "@/lib/siteConfig";

const MONTH_NAMES: Record<string, string> = {
  "01": "January",
  "02": "February",
  "03": "March",
  "04": "April",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "August",
  "09": "September",
  "10": "October",
  "11": "November",
  "12": "December",
};

// The season feed. Phones that subscribe to it get every workout and any changes.
const FEED = "btcballers.training/calendar.ics";
const FEED_ENCODED = encodeURIComponent(`webcal://${FEED}`);

type QuickGroup = { label: string; detail: string; match: (s: Session) => boolean };

const QUICK_GROUPS: QuickGroup[] = [
  { label: "Tuesdays", detail: "5:15-7:00P · Home", match: (s) => s.label.startsWith("Tue") },
  { label: "Thursdays", detail: "5:15-7:00P · Home", match: (s) => s.label.startsWith("Thu") },
  { label: "Saturdays", detail: "10:00-11:45A · Home", match: (s) => s.label.startsWith("Sat") },
  { label: "Sundays", detail: "12:00-1:30P · Faith Family", match: (s) => s.label.startsWith("Sun") },
  { label: "Midnight Madness", detail: "Fri 4:00-9:00P · Home", match: (s) => !!s.mm },
];

// Months come from the schedule itself, so a new season never shows up blank.
function groupByMonth(list: Session[]) {
  const groups: { month: string; sessions: Session[] }[] = [];
  for (const s of list) {
    const m = s.dateKey.slice(5, 7);
    const last = groups[groups.length - 1];
    if (last && last.month === m) last.sessions.push(s);
    else groups.push({ month: m, sessions: [s] });
  }
  return groups;
}

const biggest = packages[packages.length - 1];

export default function SeasonPlanner() {
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const groups = useMemo(() => groupByMonth(sessions), []);

  const toggle = (key: string) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleGroup = (g: QuickGroup) => {
    const keys = sessions.filter(g.match).map((s) => s.key);
    setPicked((prev) => {
      const next = new Set(prev);
      const allOn = keys.every((k) => next.has(k));
      keys.forEach((k) => (allOn ? next.delete(k) : next.add(k)));
      return next;
    });
  };

  const pickedSessions = sessions.filter((s) => picked.has(s.key));
  const count = pickedSessions.length;

  const fits: Package | null =
    count === 0 ? null : packages.find((p) => count <= p.sessions) ?? biggest;
  const overCap = fits ? count > fits.sessions : false;

  // A normal link (not a generated file) so iPhone opens it straight in Calendar.
  const myDaysHref = `/my-calendar.ics?s=${pickedSessions.map((s) => s.key).join(",")}`;

  const mailFor = (pkg: Package) => {
    const dateLines = pickedSessions
      .map(
        (s) =>
          `- ${s.label}: ${s.time} ${s.where}${s.mm ? " (Midnight Madness)" : ""}${s.partyUntil ? " (End of Year Party after)" : ""}`
      )
      .join("\n");
    const subject = encodeURIComponent(`${season.name} registration - ${pkg.label}`);
    const body = encodeURIComponent(
      `Hi Coach T,\n\nI'd like to register for ${season.name}.\n\nPackage: ${pkg.label} (${pkg.price})\n\nDays we're planning to come (${count}):\n${dateLines}\n\nKid's name:\nKid's age:\nHow we'll pay (Zelle or check):\nWhat we want to work on:\nAnything Coach T should know:\n\nI understand packages are paid in full at registration, all sales are final (no refunds), and packages can be upgraded at any time.\n\nThanks.`
    );
    return `mailto:${site.email}?subject=${subject}&body=${body}`;
  };

  const progressPct = Math.min(count / biggest.sessions, 1) * 100;

  return (
    <div className="border border-white/10 bg-btc-dim p-5 sm:p-8 md:p-10">
      <div className="label text-btc-orange mb-3">Plan your spring</div>
      <h3 className="display text-4xl mb-3">Pick your days.</h3>
      <p className="text-btc-white/85 max-w-2xl">
        Tap the sessions your kid can make and the counter shows which package fits. You&apos;re not
        locked to your picks. Packages work for any session on the calendar.
      </p>

      <div id="calendar" className="mt-6 scroll-mt-24 border border-btc-orange/40 bg-btc-black/40 p-5">
        <div className="label text-btc-orange mb-2">Don&apos;t forget: put the season on your phone</div>
        <p className="text-sm text-btc-white/85 max-w-xl">
          One tap adds every workout to your calendar. It updates on its own if a day moves, so you
          never have to come back here to check.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-2">
          <a
            href={`webcal://${FEED}`}
            className="bg-btc-orange text-btc-black px-5 py-3 text-center font-semibold hover:bg-btc-white transition"
          >
            Add to iPhone Calendar
          </a>
          <a
            href={`https://calendar.google.com/calendar/render?cid=${FEED_ENCODED}`}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white/25 px-5 py-3 text-center font-semibold hover:border-btc-orange hover:text-btc-orange transition"
          >
            Google Calendar
          </a>
          <a
            href={`https://outlook.live.com/calendar/0/addfromweb?url=${FEED_ENCODED}&name=BTC%20Ballers`}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white/25 px-5 py-3 text-center font-semibold hover:border-btc-orange hover:text-btc-orange transition"
          >
            Outlook
          </a>
        </div>
        <p className="mt-3 text-xs text-btc-white/60">
          On iPhone: tap the orange button, tap Subscribe, then tap Add. If nothing happens, open
          this page in Safari and try again.
        </p>
      </div>

      <div className="mt-8 label text-btc-white/50">Quick pick</div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {QUICK_GROUPS.map((g) => {
          const keys = sessions.filter(g.match).map((s) => s.key);
          if (keys.length === 0) return null;
          const allOn = keys.every((k) => picked.has(k));
          return (
            <button
              key={g.label}
              type="button"
              onClick={() => toggleGroup(g)}
              aria-pressed={allOn}
              className={`px-3 py-1.5 text-left border transition ${
                allOn
                  ? "border-btc-orange bg-btc-orange/15 text-btc-white"
                  : "border-white/20 text-btc-white/70 hover:border-btc-orange/60 hover:text-btc-white"
              }`}
            >
              <span className="block text-sm font-semibold">
                {g.label} <span className="mono text-btc-orange">{keys.length}</span>
              </span>
              <span className="block text-xs text-btc-white/50">{g.detail}</span>
            </button>
          );
        })}
        {count > 0 ? (
          <button
            type="button"
            onClick={() => setPicked(new Set())}
            className="px-3 py-1.5 text-sm text-btc-white/50 hover:text-btc-orange transition"
          >
            Clear all
          </button>
        ) : null}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.map(({ month, sessions: monthSessions }) => {
          const monthPicked = monthSessions.filter((s) => picked.has(s.key)).length;
          return (
            <div key={month}>
              <div className="label mb-3 flex items-baseline justify-between">
                <span>{MONTH_NAMES[month]}</span>
                {monthPicked > 0 ? (
                  <span className="mono text-btc-orange normal-case">{monthPicked} picked</span>
                ) : null}
              </div>
              <ul className="space-y-2">
                {monthSessions.map((s) => {
                  const on = picked.has(s.key);
                  const special = s.mm || !!s.partyUntil;
                  const base = "w-full text-left border px-3 py-2 transition";
                  const cls = special
                    ? on
                      ? "border-btc-orange bg-btc-orange/20 text-btc-white"
                      : "border-btc-orange/50 text-btc-white/80 hover:border-btc-orange"
                    : on
                      ? "border-btc-orange bg-btc-orange/10 text-btc-white"
                      : "border-white/15 text-btc-white/75 hover:border-btc-orange/60";
                  return (
                    <li key={s.key}>
                      <button
                        type="button"
                        onClick={() => toggle(s.key)}
                        aria-pressed={on}
                        className={`${base} ${cls}`}
                      >
                        <span className="mono text-sm flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span
                            aria-hidden="true"
                            className={`inline-block w-3 h-3 border shrink-0 ${
                              on ? "bg-btc-orange border-btc-orange" : "border-white/30"
                            }`}
                          />
                          {s.label}
                          {s.mm ? (
                            <span className="label text-btc-orange">Midnight Madness</span>
                          ) : null}
                          {s.partyUntil ? (
                            <span className="label text-btc-orange">End of Year Party</span>
                          ) : null}
                        </span>
                        <span className="block text-xs text-btc-white/60 mt-0.5 pl-5">
                          {s.time} &middot; {s.where}
                          {s.partyUntil ? ` · Party after, until ${s.partyUntil}` : ""}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-0 mt-10 -mx-5 sm:-mx-8 md:-mx-10 -mb-5 sm:-mb-8 md:-mb-10 bg-btc-black/95 backdrop-blur border-t border-btc-orange/40">
        <div className="relative h-1 bg-white/10" aria-hidden="true">
          <div
            className="absolute inset-y-0 left-0 bg-btc-orange transition-all"
            style={{ width: `${progressPct}%` }}
          />
          {packages.map((p) => (
            <span
              key={p.id}
              className={`absolute top-0 h-full w-px ${count >= p.sessions ? "bg-btc-black" : "bg-white/40"}`}
              style={{ left: `${(p.sessions / biggest.sessions) * 100}%` }}
            />
          ))}
        </div>
        <div className="px-5 sm:px-8 md:px-10 py-3 flex flex-wrap items-center gap-x-6 gap-y-2 justify-between">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 min-w-0">
            <span className="mono text-btc-orange whitespace-nowrap">{count} selected</span>
            <span className="text-sm text-btc-white/70">
              {!fits
                ? "Pick days to see your package."
                : overCap
                  ? `${fits.label} (${fits.price}) + $125 walk-ins`
                  : `${fits.label} fits - ${fits.price}`}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            {count > 0 ? (
              <a
                href={myDaysHref}
                className="border border-white/30 px-4 py-2 text-sm font-semibold hover:border-btc-orange hover:text-btc-orange transition"
              >
                Add my days to calendar
              </a>
            ) : null}
            {fits ? (
              <a
                href={mailFor(fits)}
                className="bg-btc-orange text-btc-black px-4 py-2 text-sm font-semibold hover:bg-btc-white transition"
              >
                Register {fits.sessions}
              </a>
            ) : (
              <span className="border border-white/20 text-btc-white/50 px-4 py-2 text-sm font-semibold">
                Register
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
