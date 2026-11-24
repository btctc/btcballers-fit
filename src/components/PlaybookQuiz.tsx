"use client";

import { useEffect, useRef, useState } from "react";
import PlayDiagram from "@/components/PlayDiagram";
import ReadCourt from "@/components/ReadCourt";
import { diagramFor, type DiagramKey } from "@/lib/diagrams";
import { levels, type Level, type Term } from "@/lib/quiz";
import type { Read } from "@/lib/reads";

// ---------- saved progress (this device only) ----------

const STORE = "btc-playbook-quiz-v1";
type Save = { stars: Record<string, number>; xp: number; bestStreak: number };
const EMPTY: Save = { stars: {}, xp: 0, bestStreak: 0 };

function loadSave(): Save {
  try {
    const raw = window.localStorage.getItem(STORE);
    if (!raw) return EMPTY;
    const p = JSON.parse(raw);
    return { stars: p.stars ?? {}, xp: Number(p.xp) || 0, bestStreak: Number(p.bestStreak) || 0 };
  } catch {
    return EMPTY;
  }
}

function writeSave(s: Save) {
  try {
    window.localStorage.setItem(STORE, JSON.stringify(s));
  } catch {
    // Private mode or storage full: the quiz still works, it just won't remember.
  }
}

// ---------- building a level ----------

type Choice = {
  kind: "choice";
  tag: string;
  prompt: string;
  focus?: string; // the term or meaning the question is about
  diagram?: DiagramKey; // an animated play to watch instead of text
  options: string[];
  answer: number;
  why: string;
};
type Match = { kind: "match"; pairs: Term[]; order: number[] };
type ReadRound = { kind: "read"; read: Read; second: boolean };
type Round = Choice | Match | ReadRound;

function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildRounds(level: Level): Round[] {
  // Film Room: the reads run in order so each pair stays back to back.
  if (level.reads) return level.reads.map((read, i) => ({ kind: "read", read, second: i % 2 === 1 }));

  const t = shuffle(level.terms);
  const tf = shuffle(level.trueFalse);
  const withThreeOthers = (x: Term) =>
    shuffle([x, ...shuffle(level.terms.filter((y) => y.term !== x.term)).slice(0, 3)]);

  const meaningOf = (x: Term): Choice => {
    const opts = withThreeOthers(x);
    return {
      kind: "choice",
      tag: "Multiple choice",
      prompt: "What does this mean?",
      focus: x.term,
      options: opts.map((o) => o.meaning),
      answer: opts.indexOf(x),
      why: `${x.term}: ${x.meaning}`,
    };
  };
  const nameOf = (x: Term): Choice => {
    const opts = withThreeOthers(x);
    return {
      kind: "choice",
      tag: "Name it",
      prompt: "Which word fits?",
      focus: x.meaning,
      options: opts.map((o) => o.term),
      answer: opts.indexOf(x),
      why: `${x.term}: ${x.meaning}`,
    };
  };
  // "Watch the play": show the animation, ask which action it is.
  // Ball Screen is left out of the choices for plays that start with one, so only one answer fits.
  const watch = (x: Term): Choice => {
    const startsWithBallScreen = ["Roll", "Pop", "Slip"].includes(x.term);
    const pool = level.terms.filter(
      (y) => y.term !== x.term && !(startsWithBallScreen && y.term === "Ball Screen")
    );
    const opts = shuffle([x, ...shuffle(pool).slice(0, 3)]);
    return {
      kind: "choice",
      tag: "Watch the play",
      prompt: "Which action is this?",
      diagram: diagramFor(x.term) ?? undefined,
      options: opts.map((o) => o.term),
      answer: opts.indexOf(x),
      why: `${x.term}: ${x.meaning}`,
    };
  };
  // Levels with animated plays swap the two "Name it" rounds for "Watch the play".
  const watchable = shuffle(level.terms.filter((y) => y.term !== "Ball Screen" && diagramFor(y.term)));
  const nameOrWatch = (n: number, fallback: Term) => (watchable[n] ? watch(watchable[n]) : nameOf(fallback));

  const trueFalse = (n: number): Choice => ({
    kind: "choice",
    tag: "True or false",
    prompt: tf[n].statement,
    options: ["True", "False"],
    answer: tf[n].answer ? 0 : 1,
    why: tf[n].why,
  });
  const match = (pairs: Term[]): Match => ({ kind: "match", pairs, order: shuffle(pairs.map((_, i) => i)) });

  return [
    meaningOf(t[0]),
    trueFalse(0),
    meaningOf(t[1]),
    match(t.slice(0, 4)),
    trueFalse(1),
    nameOrWatch(0, t[2]),
    meaningOf(t[4]),
    trueFalse(2),
    match(t.slice(4, 8)),
    nameOrWatch(1, t[5]),
    meaningOf(t[6]),
    trueFalse(3),
  ];
}

const starsFor = (correct: number, total: number) => {
  const pct = total ? correct / total : 0;
  return pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : 1;
};

const PRAISE = ["Bucket.", "Good read.", "That's it.", "Money.", "And one."];

// ---------- small pieces ----------

function Stars({ count, size = "sm", animate = false }: { count: number; size?: "sm" | "lg"; animate?: boolean }) {
  return (
    <span className="inline-flex gap-1" aria-label={`${count} of 3 stars`}>
      {[1, 2, 3].map((n) => (
        <svg
          key={n}
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={`${size === "lg" ? "h-12 w-12 md:h-14 md:w-14" : "h-4 w-4"} ${
            n <= count ? "text-btc-orange" : "text-white/15"
          } ${animate && n <= count ? "quiz-star" : ""}`}
          style={animate ? { animationDelay: `${0.25 + n * 0.22}s` } : undefined}
        >
          <path
            fill="currentColor"
            d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.2 1.2-6.6L2.5 9.5l6.6-.9L12 2.5z"
          />
        </svg>
      ))}
    </span>
  );
}

function Confetti() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    const colors = ["#F4942A", "#FFFFFF", "#34D399", "#F4942A"];
    const bits = Array.from({ length: 90 }, (_, i) => {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.9;
      const speed = 380 + Math.random() * 520;
      return {
        x: w / 2,
        y: h * 0.42,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 5 + Math.random() * 6,
        spin: Math.random() * 6,
        vs: (Math.random() - 0.5) * 12,
        color: colors[i % colors.length],
      };
    });
    const LIFE = 2.2;
    let start = 0;
    let last = 0;
    let frame = 0;
    const tick = (t: number) => {
      if (!start) start = last = t;
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      const age = (t - start) / 1000;
      ctx.clearRect(0, 0, w, h);
      for (const b of bits) {
        b.vy += 1300 * dt;
        b.vx *= 1 - 0.9 * dt;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.spin += b.vs * dt;
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, (LIFE - age) / 0.6));
        ctx.translate(b.x, b.y);
        ctx.rotate(b.spin);
        ctx.fillStyle = b.color;
        ctx.fillRect(-b.size / 2, -b.size / 4, b.size, b.size / 2);
        ctx.restore();
      }
      if (age < LIFE) frame = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, w, h);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);
  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />;
}

// ---------- the quiz ----------

type Tally = { correct: number; total: number; xp: number; streak: number; best: number };
const ZERO: Tally = { correct: 0, total: 0, xp: 0, streak: 0, best: 0 };

export default function PlaybookQuiz() {
  const [save, setSave] = useState<Save>(EMPTY);
  const [view, setView] = useState<"levels" | "play" | "result">("levels");
  const [levelIndex, setLevelIndex] = useState(0);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [step, setStep] = useState(0);
  const [tally, setTally] = useState<Tally>(ZERO);
  const [picked, setPicked] = useState<number | null>(null);
  const [praise, setPraise] = useState("");
  // matching round
  const [left, setLeft] = useState<number | null>(null);
  const [matched, setMatched] = useState<number[]>([]);
  const [missed, setMissed] = useState<number[]>([]);
  const [wrongPair, setWrongPair] = useState<{ l: number; r: number } | null>(null);
  const [earnedStars, setEarnedStars] = useState(0);
  const [readRight, setReadRight] = useState<boolean | null>(null); // Film Room result for this round

  const timer = useRef<ReturnType<typeof setTimeout>>();
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSave(loadSave());
    return () => clearTimeout(timer.current);
  }, []);

  const level = levels[levelIndex];
  const round = rounds[step];
  const unlocked = (i: number) => i === 0 || (save.stars[levels[i - 1].id] ?? 0) >= 2;

  const scrollToTop = () => {
    const el = topRef.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: "start" });
  };

  const resetRound = () => {
    setPicked(null);
    setPraise("");
    setLeft(null);
    setMatched([]);
    setMissed([]);
    setWrongPair(null);
    setReadRight(null);
  };

  const startLevel = (i: number) => {
    clearTimeout(timer.current);
    setLevelIndex(i);
    setRounds(buildRounds(levels[i]));
    setStep(0);
    setTally(ZERO);
    resetRound();
    setView("play");
    scrollToTop();
  };

  const finish = (final: Tally) => {
    const stars = starsFor(final.correct, final.total);
    setEarnedStars(stars);
    setSave((prev) => {
      const next: Save = {
        stars: { ...prev.stars, [level.id]: Math.max(prev.stars[level.id] ?? 0, stars) },
        xp: prev.xp + final.xp,
        bestStreak: Math.max(prev.bestStreak, final.best),
      };
      writeSave(next);
      return next;
    });
    setView("result");
    scrollToTop();
  };

  const advance = (current: Tally) => {
    clearTimeout(timer.current);
    if (step + 1 >= rounds.length) {
      finish(current);
      return;
    }
    resetRound();
    setStep((s) => s + 1);
  };

  const score = (right: boolean, points: number): Tally => {
    const streak = right ? tally.streak + 1 : 0;
    const bonus = right && streak >= 3 ? 5 : 0;
    const next: Tally = {
      correct: tally.correct + (right ? 1 : 0),
      total: tally.total + 1,
      xp: tally.xp + (right ? points + bonus : 0),
      streak,
      best: Math.max(tally.best, streak),
    };
    setTally(next);
    return next;
  };

  const buzz = () => {
    try {
      window.navigator.vibrate?.(12);
    } catch {
      // not supported, fine
    }
  };

  const pick = (i: number) => {
    if (!round || round.kind !== "choice" || picked !== null) return;
    const right = i === round.answer;
    setPicked(i);
    const next = score(right, 10);
    if (right) {
      buzz();
      setPraise(next.streak >= 3 ? `${next.streak} in a row.` : PRAISE[Math.floor(Math.random() * PRAISE.length)]);
      timer.current = setTimeout(() => advance(next), 1500);
    } else {
      setPraise("Not yet. Here is the read.");
    }
  };

  const readDone = (right: boolean) => {
    const next = score(right, 10);
    if (right) buzz();
    setPraise(right ? (next.streak >= 3 ? `${next.streak} in a row.` : "Good read.") : "Not yet. Here is the read.");
    setReadRight(right);
  };

  const tapRight = (r: number) => {
    if (!round || round.kind !== "match" || left === null || wrongPair) return;
    const pairIndex = round.order[r];
    if (matched.includes(pairIndex)) return;
    if (pairIndex === left) {
      const firstTry = !missed.includes(left);
      const next = score(firstTry, 5);
      const done = [...matched, left];
      setMatched(done);
      setLeft(null);
      buzz();
      if (done.length === round.pairs.length) timer.current = setTimeout(() => advance(next), 1000);
    } else {
      if (!missed.includes(left)) setMissed((m) => [...m, left]);
      setTally((t) => ({ ...t, streak: 0 }));
      setWrongPair({ l: left, r });
      timer.current = setTimeout(() => {
        setWrongPair(null);
        setLeft(null);
      }, 520);
    }
  };

  // ---------- views ----------

  const shell = "relative overflow-hidden border border-white/10 bg-btc-dim";

  if (view === "levels") {
    const cleared = levels.filter((l) => (save.stars[l.id] ?? 0) >= 2).length;
    return (
      <div ref={topRef} className={`${shell} scroll-mt-24 p-5 sm:p-8 md:p-10`}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="label text-btc-orange">Pick a level</div>
            <h2 className="display mt-3 text-4xl md:text-5xl">Climb the depth chart.</h2>
          </div>
          <div className="flex gap-6">
            <div>
              <div className="mono text-2xl text-btc-orange">{save.xp}</div>
              <div className="label mt-1">XP</div>
            </div>
            <div>
              <div className="mono text-2xl text-btc-orange">
                {cleared}/{levels.length}
              </div>
              <div className="label mt-1">Cleared</div>
            </div>
            <div>
              <div className="mono text-2xl text-btc-orange">{save.bestStreak}</div>
              <div className="label mt-1">Best streak</div>
            </div>
          </div>
        </div>

        <ol className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {levels.map((l, i) => {
            const open = unlocked(i);
            const stars = save.stars[l.id] ?? 0;
            return (
              <li key={l.id} className={l.reads ? "md:col-span-2 lg:col-span-3" : undefined}>
                <button
                  type="button"
                  disabled={!open}
                  onClick={() => startLevel(i)}
                  className={`group flex h-full w-full flex-col border p-5 text-left transition ${
                    open
                      ? "border-white/15 bg-btc-black hover:border-btc-orange hover:-translate-y-0.5"
                      : "cursor-not-allowed border-white/5 bg-btc-black/40 text-btc-white/35"
                  }`}
                >
                  <span className="flex items-center justify-between">
                    <span className={`label ${l.reads && open ? "text-btc-orange" : ""}`}>{l.reads ? "Final level" : `Level ${i + 1}`}</span>
                    {open ? <Stars count={stars} /> : <span className="label">Locked</span>}
                  </span>
                  <span className={`display mt-4 text-3xl ${open ? "group-hover:text-btc-orange" : ""} transition`}>
                    {l.rank}
                  </span>
                  <span className={`mt-2 text-sm ${open ? "text-btc-white/70" : ""}`}>{l.theme}</span>
                  <span className={`mt-5 text-sm font-semibold ${open ? "text-btc-orange" : ""}`}>
                    {open
                      ? stars
                        ? "Play again"
                        : "Start"
                      : `Earn 2 stars on ${levels[i - 1].rank} to unlock`}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  if (view === "result") {
    const passed = earnedStars >= 2;
    const hasNext = levelIndex + 1 < levels.length;
    const pct = tally.total ? Math.round((tally.correct / tally.total) * 100) : 0;
    return (
      <div ref={topRef} className={`${shell} scroll-mt-24 px-5 py-12 text-center sm:px-8 md:py-16`}>
        {passed ? <Confetti /> : null}
        <div className="quiz-in relative">
          <div className="label text-btc-orange">
            Level {levelIndex + 1} &middot; {level.rank}
          </div>
          <h2 className="display mt-4 text-5xl md:text-7xl">
            {earnedStars === 3 ? "Perfect read." : passed ? "Level cleared." : "Run it back."}
          </h2>
          <div className="mt-6">
            <Stars count={earnedStars} size="lg" animate />
          </div>
          <p className="mx-auto mt-6 max-w-md text-btc-white/80">
            {passed
              ? hasNext
                ? `${levels[levelIndex + 1].rank} is unlocked.`
                : "You finished every level. Go use it on the court."
              : "Two stars unlocks the next level. A missed read is information. Rep it again."}
          </p>
          <dl className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-px border border-white/10 bg-white/10">
            {[
              { k: "Correct", v: `${pct}%` },
              { k: "XP earned", v: `+${tally.xp}` },
              { k: "Best streak", v: tally.best },
            ].map((s) => (
              <div key={s.k} className="bg-btc-black px-2 py-4">
                <dd className="mono text-2xl text-btc-orange">{s.v}</dd>
                <dt className="label mt-1">{s.k}</dt>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {passed && hasNext ? (
              <button
                type="button"
                onClick={() => startLevel(levelIndex + 1)}
                className="bg-btc-orange px-6 py-3 font-semibold text-btc-black transition hover:bg-btc-white"
              >
                Next level: {levels[levelIndex + 1].rank}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => startLevel(levelIndex)}
              className={
                passed && hasNext
                  ? "border border-white/30 px-6 py-3 font-semibold transition hover:border-btc-orange hover:text-btc-orange"
                  : "bg-btc-orange px-6 py-3 font-semibold text-btc-black transition hover:bg-btc-white"
              }
            >
              {passed ? "Play again" : "Try again"}
            </button>
            <button
              type="button"
              onClick={() => setView("levels")}
              className="border border-white/30 px-6 py-3 font-semibold transition hover:border-btc-orange hover:text-btc-orange"
            >
              All levels
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- play ----------

  if (!round) return null;
  const answered = round.kind === "choice" && picked !== null;
  const wasRight = round.kind === "choice" && picked === round.answer;

  return (
    <div ref={topRef} className={`${shell} scroll-mt-24`}>
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-8">
        <button
          type="button"
          onClick={() => {
            clearTimeout(timer.current);
            setView("levels");
          }}
          className="label whitespace-nowrap transition hover:text-btc-orange"
        >
          &larr; Levels
        </button>
        <div className="label hidden whitespace-nowrap text-btc-white/80 sm:block">
          Level {levelIndex + 1} &middot; {level.rank}
        </div>
        <div className="flex items-center gap-4 whitespace-nowrap">
          <span className={`mono text-sm ${tally.streak >= 3 ? "text-btc-orange" : "text-btc-white/50"}`}>
            <span key={tally.streak} className={tally.streak >= 3 ? "quiz-pop inline-block" : "inline-block"}>
              {tally.streak}
            </span>{" "}
            streak
          </span>
          <span className="mono text-sm text-btc-orange">
            <span key={tally.xp} className={tally.xp ? "quiz-pop inline-block" : "inline-block"}>
              {tally.xp}
            </span>{" "}
            XP
          </span>
        </div>
      </div>

      <div className="flex gap-1 px-5 pt-4 sm:px-8" aria-hidden="true">
        {rounds.map((_, n) => (
          <span key={n} className="h-1 flex-1 bg-white/10">
            <span
              className="block h-full origin-left bg-btc-orange transition-transform duration-500 ease-out"
              style={{ transform: `scaleX(${n < step || (n === step && (answered || readRight !== null || (round.kind === "match" && matched.length === round.pairs.length))) ? 1 : 0})` }}
            />
          </span>
        ))}
      </div>

      <div key={step} className="quiz-in px-5 pb-8 pt-8 sm:px-8 md:pb-10 md:pt-10">
        {round.kind === "read" ? (
          <div className="mx-auto max-w-2xl">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="label text-btc-orange">Film Room &middot; {round.read.action}</span>
              {round.second ? (
                <span className="quiz-pop bg-white px-2 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-btc-black">
                  Same play. New player.
                </span>
              ) : null}
            </div>
            <h3 className="mt-3 text-xl font-semibold leading-snug md:text-2xl">{round.read.ask}</h3>

            <div className="mt-4 flex items-center gap-4 border border-btc-orange/40 bg-btc-black px-4 py-3">
              <div className="min-w-0">
                <div className="label">{round.read.star.role}</div>
                <div className="display mt-1 text-2xl text-btc-orange md:text-3xl">{round.read.star.name}</div>
                <p className="mt-1 text-sm leading-snug text-btc-white/80">{round.read.star.trait}</p>
              </div>
            </div>

            <div className="mt-4">
              <ReadCourt read={round.read} onResult={readDone} />
            </div>

            <div className="mt-5 min-h-[5.5rem]" aria-live="polite">
              {readRight !== null ? (
                <div className="quiz-in flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className={`display text-2xl ${readRight ? "text-emerald-400" : "text-btc-orange"}`}>
                      {praise}
                      {readRight ? (
                        <span className="mono ml-3 text-sm text-btc-orange">+{tally.streak >= 3 ? 15 : 10} XP</span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-btc-white/75">{round.read.why}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => advance(tally)}
                    className="shrink-0 bg-btc-orange px-6 py-3 font-semibold text-btc-black transition hover:bg-btc-white"
                  >
                    {step + 1 >= rounds.length ? "See results" : "Next"}
                  </button>
                </div>
              ) : (
                <p className="text-sm text-btc-white/50">Tap an arrow on the court, or pick below.</p>
              )}
            </div>
          </div>
        ) : round.kind === "choice" ? (
          <>
            <div className="label text-btc-orange">{round.tag}</div>
            {round.diagram ? (
              <>
                <h3 className="mt-3 text-2xl font-semibold leading-snug md:text-3xl">{round.prompt}</h3>
                <div className="mt-5 max-w-lg">
                  <PlayDiagram name={round.diagram} />
                </div>
              </>
            ) : round.focus ? (
              <>
                <p className="mt-3 text-btc-white/70">{round.prompt}</p>
                <h3
                  className={
                    round.focus.length > 28
                      ? "mt-3 max-w-3xl text-2xl font-semibold leading-snug md:text-3xl"
                      : "display mt-3 text-5xl md:text-7xl"
                  }
                >
                  {round.focus}
                </h3>
              </>
            ) : (
              <h3 className="mt-4 max-w-3xl text-2xl font-semibold leading-snug md:text-4xl">{round.prompt}</h3>
            )}

            <div className={`mt-8 grid gap-3 ${round.options.length === 2 ? "grid-cols-2 max-w-xl" : "md:grid-cols-2"}`}>
              {round.options.map((opt, i) => {
                const isAnswer = i === round.answer;
                const isPicked = i === picked;
                let state = "border-white/15 bg-btc-black hover:border-btc-orange";
                if (answered) {
                  if (isAnswer) state = "quiz-pop border-emerald-400 bg-emerald-400/10 text-btc-white";
                  else if (isPicked) state = "quiz-shake border-red-400/80 bg-red-400/10 text-btc-white/80";
                  else state = "border-white/10 bg-btc-black text-btc-white/35";
                }
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={answered}
                    onClick={() => pick(i)}
                    className={`flex min-h-[3.75rem] items-center gap-3 border px-4 py-3 text-left text-base leading-snug transition-colors ${state} ${
                      round.options.length === 2 ? "justify-center text-lg font-semibold" : ""
                    }`}
                  >
                    {round.options.length > 2 ? (
                      <span className="mono shrink-0 text-xs text-btc-white/40">{"ABCD"[i]}</span>
                    ) : null}
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 min-h-[5.5rem]" aria-live="polite">
              {answered ? (
                <div className="quiz-in flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className={`display text-2xl ${wasRight ? "text-emerald-400" : "text-btc-orange"}`}>
                      {praise}
                      {wasRight ? (
                        <span className="mono ml-3 text-sm text-btc-orange">+{tally.streak >= 3 ? 15 : 10} XP</span>
                      ) : null}
                    </div>
                    <p className="mt-1 max-w-2xl text-sm text-btc-white/75">{round.why}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => advance(tally)}
                    className="shrink-0 bg-btc-orange px-6 py-3 font-semibold text-btc-black transition hover:bg-btc-white"
                  >
                    {step + 1 >= rounds.length ? "See results" : "Next"}
                  </button>
                </div>
              ) : null}
            </div>
          </>
        ) : (
          <>
            <div className="label text-btc-orange">Match up</div>
            <h3 className="mt-4 text-2xl font-semibold leading-snug md:text-4xl">Tap a word, then tap its meaning.</h3>
            <div className="mt-8 grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] gap-3 md:gap-5">
              <div className="grid gap-3">
                {round.pairs.map((p, i) => {
                  const done = matched.includes(i);
                  const wrong = wrongPair?.l === i;
                  const state = done
                    ? "quiz-pop border-emerald-400 bg-emerald-400/10"
                    : wrong
                      ? "quiz-shake border-red-400/80 bg-red-400/10"
                      : left === i
                        ? "border-btc-orange bg-btc-orange/15"
                        : "border-white/15 bg-btc-black hover:border-btc-orange";
                  return (
                    <button
                      key={p.term}
                      type="button"
                      disabled={done}
                      aria-pressed={left === i}
                      onClick={() => !wrongPair && setLeft(i)}
                      className={`flex min-h-[4.5rem] items-center border px-3 py-3 text-left transition-colors md:px-4 ${state}`}
                    >
                      <span className="display text-xl md:text-2xl">{p.term}</span>
                    </button>
                  );
                })}
              </div>
              <div className="grid gap-3">
                {round.order.map((pairIndex, r) => {
                  const done = matched.includes(pairIndex);
                  const wrong = wrongPair?.r === r;
                  const state = done
                    ? "quiz-pop border-emerald-400 bg-emerald-400/10"
                    : wrong
                      ? "quiz-shake border-red-400/80 bg-red-400/10"
                      : left !== null
                        ? "border-white/30 bg-btc-black hover:border-btc-orange"
                        : "border-white/15 bg-btc-black";
                  return (
                    <button
                      key={pairIndex}
                      type="button"
                      disabled={done || left === null}
                      onClick={() => tapRight(r)}
                      className={`flex min-h-[4.5rem] items-center border px-3 py-3 text-left text-sm leading-snug transition-colors md:px-4 md:text-base ${state} ${
                        left === null && !done ? "text-btc-white/60" : ""
                      }`}
                    >
                      {round.pairs[pairIndex].meaning}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mt-6 min-h-[2.5rem]" aria-live="polite">
              {matched.length === round.pairs.length ? (
                <div className="quiz-in display text-2xl text-emerald-400">
                  {missed.length === 0 ? "Clean sweep." : "All matched."}
                </div>
              ) : (
                <p className="text-sm text-btc-white/50">
                  {matched.length} of {round.pairs.length} matched
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
