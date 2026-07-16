"use client";

import { useMemo, useState } from "react";
import { fallSessions, fallPackages, type FallSession, type FallPackage } from "@/lib/programs";
import { site } from "@/lib/siteConfig";

const MONTH_ORDER = ["08", "09", "10", "11", "12"] as const;
const MONTH_NAMES: Record<string, string> = {
  "08": "August",
  "09": "September",
  "10": "October",
  "11": "November",
  "12": "December",
};

type QuickGroup = { label: string; detail: string; match: (s: FallSession) => boolean };

const QUICK_GROUPS: QuickGroup[] = [
  { label: "Tuesdays", detail: "5:15-7:00P · Home", match: (s) => s.label.startsWith("Tue") },
  { label: "Thursdays", detail: "5:15-7:00P · Home", match: (s) => !s.mm && s.label.startsWith("Thu") },
  { label: "Saturdays", detail: "10:00-11:45A · Home", match: (s) => s.label.startsWith("Sat") },
  { label: "Sun - SandersFit", detail: "11:15A-12:45P", match: (s) => s.label.startsWith("Sun") && !s.yemi },
  { label: "Sun - Yemi", detail: "1:00-2:30P · Life School OC", match: (s) => !!s.yemi },
  { label: "Midnight Madness", detail: "Fri 4:00-9:00P · Home", match: (s) => !!s.mm },
];

function groupByMonth(sessions: FallSession[]) {
  const groups: Record<string, FallSession[]> = {};
  for (const s of sessions) {
    const m = s.dateKey.slice(5, 7);
    (groups[m] ||= []).push(s);
  }
  return groups;
}

export default function SeasonPlanner() {
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const groups = useMemo(() => groupByMonth(fallSessions), []);

  const toggle = (key: string) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleGroup = (g: QuickGroup) => {
    const keys = fallSessions.filter(g.match).map((s) => s.key);
    setPicked((prev) => {
      const next = new Set(prev);
      const allOn = keys.every((k) => next.has(k));
      keys.forEach((k) => (allOn ? next.delete(k) : next.add(k)));
      return next;
    });
  };

  const pickedSessions = fallSessions.filter((s) => picked.has(s.key));
  const count = pickedSessions.length;

  const fits =
    count === 0
      ? null
      : fallPackages.find((p) => count <= p.sessions) ?? fallPackages[fallPackages.length - 1];

  const eighteen = fallPackages.find((p) => p.id === "18")!;
  // When the 14-pack technically covers them, lead with the 18 - it's the most popular.
  const primary: FallPackage | null = fits ? (fits.id === "14" ? eighteen : fits) : null;
  const secondary: FallPackage | null = fits && fits.id === "14" ? fits : null;
  const overCap = fits ? count > fits.sessions : false;

  const to24h = (t: string) => {
    const m = t.match(/(\d+):(\d+)(A|P)/);
    if (!m) return "0000";
    let h = Number(m[1]);
    if (m[3] === "P" && h !== 12) h += 12;
    if (m[3] === "A" && h === 12) h = 0;
    return `${String(h).padStart(2, "0")}${m[2]}`;
  };

  const downloadICS = () => {
    const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
    const events = pickedSessions
      .map((s) => {
        const [startRaw, endRaw] = s.time.split(" - ");
        const d = s.dateKey.replace(/-/g, "");
        const title = s.mm
          ? "BTC Ballers - Midnight Madness"
          : s.yemi
            ? "BTC Ballers - Coach Yemi Training"
            : "BTC Ballers Training";
        const desc = s.mm
          ? "Small-group training, dinner, film, books, and competitive play."
          : s.yemi
            ? "Ride with Coach T from SandersFit - limited space."
            : "Believe. Train. Compete.";
        return [
          "BEGIN:VEVENT",
          `UID:btc-${s.key}@btcballers.training`,
          `DTSTAMP:${stamp}`,
          `DTSTART:${d}T${to24h(startRaw)}00`,
          `DTEND:${d}T${to24h(endRaw)}00`,
          `SUMMARY:${title}`,
          `LOCATION:${s.where.replace(/,/g, "\\,")}`,
          `DESCRIPTION:${desc}`,
          "END:VEVENT",
        ].join("\r\n");
      })
      .join("\r\n");
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//BTC Ballers//Fall 2026//EN",
      "CALSCALE:GREGORIAN",
      events,
      "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "BTC_Ballers_Fall_2026.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const mailFor = (pkg: FallPackage) => {
    const dateLines = pickedSessions
      .map(
        (s) =>
          `- ${s.label}: ${s.time} ${s.where}${s.mm ? " (Midnight Madness)" : ""}${s.yemi ? " (Coach Yemi)" : ""}`
      )
      .join("\n");
    const subject = encodeURIComponent(`Fall 2026 registration - ${pkg.label}`);
    const body = encodeURIComponent(
      `Hi Coach T,\n\nI'd like to register for Fall 2026.\n\nPackage: ${pkg.label} (${pkg.price})\n\nDays we're planning to come (${count}):\n${dateLines}\n\nKid's name:\nKid's age:\nWhat we want to work on:\nAnything Coach T should know:\n\nThanks.`
    );
    return `mailto:${site.email}?subject=${subject}&body=${body}`;
  };

  const progressPct = Math.min(count / 25, 1) * 100;

  return (
    <div className="border border-white/10 bg-btc-dim p-8 md:p-10">
      <div className="label text-btc-orange mb-3">Plan your fall</div>
      <h3 className="display text-4xl mb-3">Pick your days.</h3>
      <p className="text-btc-white/85 max-w-2xl">
        Tap the sessions your kid can make - the counter shows which package fits. You&apos;re not
        locked to your picks. Sundays have two workouts (SandersFit, then Coach Yemi at Life
        School Oak Cliff); each counts as its own session, and SandersFit players can ride with
        Coach T to Yemi&apos;s - limited space.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm text-btc-white/60 mr-1">Sync the season to your calendar:</span>
        <a
          href="https://calendar.google.com/calendar/render?cid=webcal%3A%2F%2Fbtcballers.training%2Fcalendar.ics"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-white/25 px-3 py-1 text-sm hover:border-btc-orange hover:text-btc-orange transition"
        >
          Google
        </a>
        <a
          href="webcal://btcballers.training/calendar.ics"
          className="border border-white/25 px-3 py-1 text-sm hover:border-btc-orange hover:text-btc-orange transition"
        >
          Apple
        </a>
        <a
          href="https://outlook.live.com/calendar/0/addfromweb?url=webcal%3A%2F%2Fbtcballers.training%2Fcalendar.ics&name=BTC%20Ballers"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-white/25 px-3 py-1 text-sm hover:border-btc-orange hover:text-btc-orange transition"
        >
          Outlook
        </a>
        <span className="text-xs text-btc-white/40">Auto-updates if anything changes.</span>
      </div>

      <div className="mt-6 label text-btc-white/50">Quick pick</div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {QUICK_GROUPS.map((g) => {
          const keys = fallSessions.filter(g.match).map((s) => s.key);
          const allOn = keys.length > 0 && keys.every((k) => picked.has(k));
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
              <span className="block text-sm font-semibold">{g.label}</span>
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
        {MONTH_ORDER.map((m) => {
          const sessions = groups[m];
          if (!sessions?.length) return null;
          const monthPicked = sessions.filter((s) => picked.has(s.key)).length;
          return (
            <div key={m}>
              <div className="label mb-3 flex items-baseline justify-between">
                <span>{MONTH_NAMES[m]}</span>
                {monthPicked > 0 ? (
                  <span className="mono text-btc-orange normal-case">{monthPicked} picked</span>
                ) : null}
              </div>
              <ul className="space-y-2">
                {sessions.map((s) => {
                  const on = picked.has(s.key);
                  const base = "w-full text-left border px-3 py-2 transition";
                  const cls =
                    s.mm || s.yemi
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
                        <span className="mono text-sm flex items-center gap-2">
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
                          {s.yemi ? <span className="label text-btc-orange">Coach Yemi</span> : null}
                        </span>
                        <span className="block text-xs text-btc-white/60 mt-0.5 pl-5">
                          {s.time} &middot; {s.where}
                          {s.yemi ? " · Ride available - limited space" : ""}
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

      <div className="sticky bottom-0 mt-10 -mx-8 md:-mx-10 -mb-8 md:-mb-10 bg-btc-black/95 backdrop-blur border-t border-btc-orange/40">
        <div className="relative h-1 bg-white/10" aria-hidden="true">
          <div
            className="absolute inset-y-0 left-0 bg-btc-orange transition-all"
            style={{ width: `${progressPct}%` }}
          />
          {fallPackages.map((p) => (
            <span
              key={p.id}
              className={`absolute top-0 h-full w-px ${count >= p.sessions ? "bg-btc-black" : "bg-white/40"}`}
              style={{ left: `${(p.sessions / 25) * 100}%` }}
            />
          ))}
        </div>
        <div className="px-8 md:px-10 py-3 flex flex-wrap items-center gap-x-6 gap-y-2 justify-between">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 min-w-0">
            <span className="mono text-btc-orange whitespace-nowrap">{count} selected</span>
            <span className="text-sm text-btc-white/70 truncate">
              {!fits
                ? "Pick days to see your package."
                : overCap
                  ? `${fits.label} (${fits.price}) + $125 walk-ins`
                  : secondary
                    ? `${secondary.label} fits - most go 18 (+4 for $300)`
                    : `${fits.label} fits - ${fits.price}`}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            {count > 0 ? (
              <button
                type="button"
                onClick={downloadICS}
                className="border border-white/30 px-4 py-2 text-sm font-semibold hover:border-btc-orange hover:text-btc-orange transition"
              >
                Add to calendar
              </button>
            ) : null}
            {primary ? (
              <a
                href={mailFor(primary)}
                className="bg-btc-orange text-btc-black px-4 py-2 text-sm font-semibold hover:bg-btc-white transition"
              >
                Register {primary.sessions}
              </a>
            ) : (
              <span className="border border-white/20 text-btc-white/50 px-4 py-2 text-sm font-semibold">
                Register
              </span>
            )}
            {secondary ? (
              <a
                href={mailFor(secondary)}
                className="border border-white/30 px-4 py-2 text-sm font-semibold hover:border-btc-orange hover:text-btc-orange transition"
              >
                Register {secondary.sessions}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
