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

  const pickedSessions = fallSessions.filter((s) => picked.has(s.dateKey));
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

  const mailFor = (pkg: FallPackage) => {
    const dateLines = pickedSessions
      .map((s) => `- ${s.label} (${s.time}, ${s.where})${s.mm ? " - Midnight Madness" : ""}`)
      .join("\n");
    const subject = encodeURIComponent(`Fall 2026 registration - ${pkg.label}`);
    const body = encodeURIComponent(
      `Hi Coach T,\n\nI'd like to register for Fall 2026.\n\nPackage: ${pkg.label} (${pkg.price})\n\nDays we're planning to come (${count}):\n${dateLines}\n\nKid's name:\nKid's age:\nWhat we want to work on:\nAnything Coach T should know:\n\nThanks.`
    );
    return `mailto:${site.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="border border-white/10 bg-btc-dim p-8 md:p-10">
      <div className="label text-btc-orange mb-3">Plan your fall</div>
      <h3 className="display text-4xl mb-3">Pick your days.</h3>
      <p className="text-btc-white/85 max-w-2xl">
        Tap the sessions your kid can make. The counter tells you which package fits. You&apos;re
        not locked to these dates - packages work for any session on the calendar, and Midnight
        Madness nights count as sessions.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MONTH_ORDER.map((m) => {
          const sessions = groups[m];
          if (!sessions?.length) return null;
          return (
            <div key={m}>
              <div className="label mb-3">{MONTH_NAMES[m]}</div>
              <ul className="space-y-2">
                {sessions.map((s) => {
                  const on = picked.has(s.dateKey);
                  const base = "w-full text-left border px-3 py-2 transition";
                  const cls = s.mm
                    ? on
                      ? "border-btc-orange bg-btc-orange/20 text-btc-white"
                      : "border-btc-orange/50 text-btc-white/80 hover:border-btc-orange"
                    : on
                      ? "border-btc-orange bg-btc-orange/10 text-btc-white"
                      : "border-white/15 text-btc-white/75 hover:border-btc-orange/60";
                  return (
                    <li key={s.dateKey}>
                      <button
                        type="button"
                        onClick={() => toggle(s.dateKey)}
                        aria-pressed={on}
                        className={`${base} ${cls}`}
                      >
                        <span className="mono text-sm">
                          {s.label}
                          {s.mm ? (
                            <span className="label text-btc-orange ml-2">Midnight Madness</span>
                          ) : null}
                        </span>
                        <span className="block text-xs text-btc-white/60 mt-0.5">
                          {s.time} &middot; {s.where}
                          {s.yemi ? " + Yemi (1:00P-2:30P, Life School Oak Cliff)" : ""}
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

      <div className="mt-10 border-t border-white/10 pt-6 flex flex-col md:flex-row md:items-center gap-5 md:justify-between">
        <div>
          <div className="mono text-btc-orange text-lg">
            {count} {count === 1 ? "session" : "sessions"} selected
          </div>
          {fits ? (
            <p className="text-btc-white/85 mt-1">
              {overCap ? (
                <>
                  That&apos;s more than the biggest package - the{" "}
                  <span className="font-semibold">{fits.label}</span> ({fits.price}) is your best
                  value. Extra days are $125 walk-ins.
                </>
              ) : secondary ? (
                <>
                  The {secondary.label} ({secondary.price}) covers your picks, but most families go{" "}
                  <span className="font-semibold">{eighteen.label}</span> ({eighteen.price}) - 4
                  more sessions for $300, and the season usually fills in as you go.
                </>
              ) : (
                <>
                  The <span className="font-semibold">{fits.label}</span> ({fits.price}) covers
                  you.
                </>
              )}
            </p>
          ) : (
            <p className="text-btc-white/60 mt-1">Pick a few days to see which package fits.</p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          {primary ? (
            <a
              href={mailFor(primary)}
              className="inline-block bg-btc-orange text-btc-black px-6 py-3 font-semibold text-center hover:bg-btc-white transition"
            >
              Register - {primary.label}
            </a>
          ) : (
            <span className="inline-block border border-white/20 text-btc-white/50 px-6 py-3 font-semibold text-center">
              Register
            </span>
          )}
          {secondary ? (
            <a
              href={mailFor(secondary)}
              className="inline-block border border-white/30 px-6 py-3 font-semibold text-center hover:border-btc-orange hover:text-btc-orange transition"
            >
              Register - {secondary.label}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
