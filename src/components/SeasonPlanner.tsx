"use client";

import { useMemo, useState } from "react";
import { fallSessions, fallPackages, type FallSession } from "@/lib/programs";
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

  const count = picked.size;

  const recommended =
    count === 0
      ? null
      : fallPackages.find((p) => count <= p.sessions) ?? fallPackages[fallPackages.length - 1];

  const nextTier = recommended
    ? fallPackages[fallPackages.findIndex((p) => p.id === recommended.id) + 1]
    : null;

  const overCap = recommended ? count > recommended.sessions : false;

  const pickedSessions = fallSessions.filter((s) => picked.has(s.dateKey));

  const mailHref = useMemo(() => {
    if (!recommended) return `mailto:${site.email}`;
    const dateLines = pickedSessions.map((s) => `- ${s.label} (${s.time}, ${s.where})`).join("\n");
    const subject = encodeURIComponent(`Fall 2026 registration - ${recommended.label}`);
    const body = encodeURIComponent(
      `Hi Coach T,\n\nI'd like to register for Fall 2026.\n\nPackage: ${recommended.label} (${recommended.price})\n\nDays we're planning to come (${count}):\n${dateLines}\n\nKid's name:\nKid's age:\nWhat we want to work on:\nAnything Coach T should know:\n\nThanks.`
    );
    return `mailto:${site.email}?subject=${subject}&body=${body}`;
  }, [recommended, pickedSessions, count]);

  return (
    <div className="border border-white/10 bg-btc-dim p-8 md:p-10">
      <div className="label text-btc-orange mb-3">Plan your fall</div>
      <h3 className="display text-4xl mb-3">Pick your days.</h3>
      <p className="text-btc-white/85 max-w-2xl">
        Tap the sessions your kid can make. The counter tells you which package fits. You&apos;re
        not locked to these dates - packages work for any session on the calendar.
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
                  return (
                    <li key={s.dateKey}>
                      <button
                        type="button"
                        onClick={() => toggle(s.dateKey)}
                        aria-pressed={on}
                        className={`w-full text-left border px-3 py-2 transition ${
                          on
                            ? "border-btc-orange bg-btc-orange/10 text-btc-white"
                            : "border-white/15 text-btc-white/75 hover:border-btc-orange/60"
                        }`}
                      >
                        <span className="mono text-sm">{s.label}</span>
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
          {recommended ? (
            <p className="text-btc-white/85 mt-1">
              {overCap ? (
                <>
                  That&apos;s more than the biggest package - the{" "}
                  <span className="font-semibold">{recommended.label}</span> ({recommended.price})
                  is your best value. Extra days are $125 walk-ins.
                </>
              ) : (
                <>
                  The <span className="font-semibold">{recommended.label}</span> (
                  {recommended.price}) covers you.
                  {nextTier && recommended.sessions - count <= 2 && count >= recommended.sessions - 2 ? (
                    <span className="text-btc-white/60">
                      {" "}
                      {nextTier.label} adds {nextTier.sessions - recommended.sessions} more for the
                      season.
                    </span>
                  ) : null}
                </>
              )}
            </p>
          ) : (
            <p className="text-btc-white/60 mt-1">Pick a few days to see which package fits.</p>
          )}
        </div>
        <a
          href={mailHref}
          className={`inline-block px-6 py-3 font-semibold text-center transition ${
            recommended
              ? "bg-btc-orange text-btc-black hover:bg-btc-white"
              : "border border-white/20 text-btc-white/50 pointer-events-none"
          }`}
          aria-disabled={!recommended}
        >
          {recommended ? `Register - ${recommended.label}` : "Register"}
        </a>
      </div>
    </div>
  );
}
