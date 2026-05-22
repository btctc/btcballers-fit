"use client";

import { useMemo, useState } from "react";
import { site } from "@/lib/siteConfig";

type Session = {
  key: string;
  label: string;
  time: string;
};

const months = [
  { label: "June", month: 5, year: 2026 },
  { label: "July", month: 6, year: 2026 },
  { label: "August", month: 7, year: 2026 },
];

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const weekdayTimes = ["5:30P to 7P", "6:30P to 8P"];
const weekendTime = "Weekend by arrangement";
const maxSessions = 12;

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function dateLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function isInTrainingWindow(date: Date) {
  const start = new Date(2026, 5, 8, 12);
  const end = new Date(2026, 7, 6, 12);
  return date >= start && date <= end;
}

function isBookable(date: Date) {
  const day = date.getDay();
  return isInTrainingWindow(date) && day !== 5;
}

function isWeekend(date: Date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function monthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1, 12);
  const totalDays = new Date(year, month + 1, 0, 12).getDate();
  const blanks = Array.from({ length: firstDay.getDay() }, (_, index) => ({ type: "blank" as const, key: `blank-${index}` }));
  const days = Array.from({ length: totalDays }, (_, index) => {
    const date = new Date(year, month, index + 1, 12);
    return { type: "date" as const, key: dateKey(date), date };
  });
  return [...blanks, ...days];
}

export default function TrainingScheduler() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMonth, setActiveMonth] = useState(0);
  const [defaultTime, setDefaultTime] = useState(weekdayTimes[0]);
  const [sessions, setSessions] = useState<Session[]>([]);

  const currentMonth = months[activeMonth];
  const cells = useMemo(() => monthDays(currentMonth.year, currentMonth.month), [currentMonth]);
  const selectedKeys = useMemo(() => new Set(sessions.map((session) => session.key)), [sessions]);
  const selectedSessions = useMemo(
    () => [...sessions].sort((a, b) => a.key.localeCompare(b.key)),
    [sessions]
  );
  const selectedCount = sessions.length;
  const remaining = maxSessions - selectedCount;

  const toggleSession = (date: Date) => {
    if (!isBookable(date)) return;

    const key = dateKey(date);
    setSessions((current) => {
      if (current.some((session) => session.key === key)) {
        return current.filter((session) => session.key !== key);
      }
      if (current.length >= maxSessions) return current;
      return [
        ...current,
        {
          key,
          label: dateLabel(date),
          time: isWeekend(date) ? weekendTime : defaultTime,
        },
      ];
    });
  };

  const updateTime = (key: string, time: string) => {
    setSessions((current) =>
      current.map((session) => (session.key === key ? { ...session, time } : session))
    );
  };

  const scheduleLines = selectedSessions
    .map((session, index) => `${index + 1}. ${session.label} - ${session.time}`)
    .join("\n");

  const mailSubject = encodeURIComponent("Summer Training 12-session schedule request");
  const mailBody = encodeURIComponent(
    `Hi Coach T,\n\nI'd like to request Summer Training approval.\n\nPackage: 12 sessions, 90 minutes each ($1,000)\n\nProposed sessions:\n${scheduleLines}\n\nKid's name:\nKid's age:\nWhat we want to work on:\nAnything Coach T should know:\n\nThanks.`
  );
  const mailHref = `mailto:${site.email}?subject=${mailSubject}&body=${mailBody}`;

  return (
    <div className="border border-white/10 bg-btc-black p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="label text-btc-orange">Propose 12 sessions</div>
          <p className="mt-2 text-sm leading-relaxed text-btc-white/72">
            Pick days and times. The final schedule is approved by Coach T.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-btc-orange px-4 py-3 text-sm font-semibold text-btc-black hover:bg-btc-white transition"
        >
          Open Calendar
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/75 p-0 sm:items-center sm:p-5">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="training-scheduler-title"
            className="max-h-[92vh] w-full max-w-5xl overflow-y-auto border border-white/12 bg-btc-dim shadow-2xl"
          >
            <div className="sticky top-0 z-10 border-b border-white/10 bg-btc-dim/95 px-5 py-4 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="label text-btc-orange">Summer Training</div>
                  <h3 id="training-scheduler-title" className="display mt-2 text-4xl md:text-5xl">
                    Build the request.
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="border border-white/15 px-3 py-2 text-sm font-semibold hover:border-btc-orange hover:text-btc-orange transition"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="grid gap-6 p-5 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="mono text-btc-orange">
                    {selectedCount} / {maxSessions} selected
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {months.map((month, index) => (
                      <button
                        key={month.label}
                        type="button"
                        onClick={() => setActiveMonth(index)}
                        className={`border px-3 py-2 text-sm font-semibold transition ${
                          activeMonth === index
                            ? "border-btc-orange bg-btc-orange text-btc-black"
                            : "border-white/15 hover:border-btc-orange hover:text-btc-orange"
                        }`}
                      >
                        {month.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5 border border-white/10 bg-btc-black p-3">
                  <div className="grid grid-cols-7 gap-1">
                    {dayLabels.map((day) => (
                      <div key={day} className="label px-1 py-2 text-center">
                        {day}
                      </div>
                    ))}
                    {cells.map((cell) => {
                      if (cell.type === "blank") {
                        return <div key={cell.key} className="aspect-square" />;
                      }

                      const day = cell.date.getDate();
                      const key = cell.key;
                      const bookable = isBookable(cell.date);
                      const selected = selectedKeys.has(key);
                      const weekend = isWeekend(cell.date);
                      const disabled = !bookable || (!selected && selectedCount >= maxSessions);

                      return (
                        <button
                          key={key}
                          type="button"
                          disabled={disabled}
                          onClick={() => toggleSession(cell.date)}
                          className={`aspect-square border p-1 text-left transition ${
                            selected
                              ? "border-btc-orange bg-btc-orange text-btc-black"
                              : bookable
                                ? "border-white/10 bg-btc-dim hover:border-btc-orange"
                                : "border-white/5 bg-black/25 text-btc-white/25"
                          } ${disabled && !selected ? "cursor-not-allowed opacity-45" : ""}`}
                        >
                          <span className="mono block text-sm md:text-base">{day}</span>
                          {bookable && (
                            <span className={`mt-1 hidden text-[0.62rem] uppercase tracking-[0.12em] md:block ${selected ? "text-btc-black/75" : "text-btc-white/45"}`}>
                              {weekend ? "arrange" : "open"}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {weekdayTimes.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setDefaultTime(time)}
                      className={`border px-3 py-2 text-sm font-semibold transition ${
                        defaultTime === time
                          ? "border-btc-orange text-btc-orange"
                          : "border-white/15 text-btc-white/75 hover:border-btc-orange hover:text-btc-orange"
                      }`}
                    >
                      New weekday picks: {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="min-w-0 border border-white/10 bg-btc-black p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="label text-btc-orange">Email request</div>
                    <p className="mt-2 text-sm text-btc-white/70">
                      {remaining > 0 ? `Select ${remaining} more session${remaining === 1 ? "" : "s"}.` : "Ready to email Coach T."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSessions([])}
                    className="border border-white/15 px-3 py-2 text-sm font-semibold hover:border-btc-orange hover:text-btc-orange transition"
                  >
                    Clear
                  </button>
                </div>

                <div className="mt-4 max-h-72 space-y-2 overflow-y-auto pr-1">
                  {selectedSessions.length === 0 ? (
                    <div className="border border-dashed border-white/15 p-4 text-sm leading-relaxed text-btc-white/55">
                      Select dates from the calendar. Fridays are blocked off. Weekends are marked for arrangement.
                    </div>
                  ) : (
                    selectedSessions.map((session, index) => (
                      <div key={session.key} className="border border-white/10 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-semibold text-btc-white">
                            {index + 1}. {session.label}
                          </div>
                          <button
                            type="button"
                            onClick={() => setSessions((current) => current.filter((item) => item.key !== session.key))}
                            className="text-xs font-semibold text-btc-white/55 hover:text-btc-orange transition"
                          >
                            Remove
                          </button>
                        </div>
                        <select
                          value={session.time}
                          onChange={(event) => updateTime(session.key, event.target.value)}
                          className="mt-3 w-full border border-white/15 bg-btc-dim px-3 py-2 text-sm text-btc-white"
                        >
                          {[...weekdayTimes, weekendTime].map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))
                  )}
                </div>

                {selectedCount === maxSessions ? (
                  <a
                    href={mailHref}
                    className="mt-5 block bg-btc-orange px-5 py-3 text-center font-semibold text-btc-black hover:bg-btc-white transition"
                  >
                    Email 12 Proposed Sessions
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="mt-5 block w-full cursor-not-allowed bg-white/10 px-5 py-3 text-center font-semibold text-btc-white/45"
                  >
                    Select 12 Sessions to Email
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
