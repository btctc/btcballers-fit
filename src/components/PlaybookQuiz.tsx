"use client";

import { useEffect, useRef, useState } from "react";
import PlayDiagram from "@/components/PlayDiagram";
import ReadCourt from "@/components/ReadCourt";
import { diagramFor, diagrams, studyDiagramFor, type Diagram, type DiagramKey } from "@/lib/diagrams";
import { allTerms, levels, MASTERED, sideNames, sideOf, TERMS_PER_RUN, type Level, type Side, type Term } from "@/lib/quiz";
import type { Read } from "@/lib/reads";

// ---------- saved progress (this device only) ----------

const STORE = "btc-playbook-quiz-v1";
// terms: right answers per term. MASTERED or more = mastered, -1 = missed last time, absent = never seen.
type Save = { stars: Record<string, number>; xp: number; bestStreak: number; terms: Record<string, number> };
const EMPTY: Save = { stars: {}, xp: 0, bestStreak: 0, terms: {} };

function loadSave(): Save {
  try {
    const raw = window.localStorage.getItem(STORE);
    if (!raw) return EMPTY;
    const p = JSON.parse(raw);
    return {
      stars: p.stars ?? {},
      xp: Number(p.xp) || 0,
      bestStreak: Number(p.bestStreak) || 0,
      terms: p.terms ?? {},
    };
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

const isMastered = (save: Save, term: string) => (save.terms[term] ?? 0) >= MASTERED;
const masteredIn = (save: Save, list: Term[]) => list.filter((x) => isMastered(save, x.term)).length;

// ---------- building a level ----------

// From easiest to hardest: true or false, pick the meaning, then name it from a meaning,
// a game situation, or an animated play.
type Format = "tf" | "meaning" | "name" | "situation" | "watch";

type Choice = {
  kind: "choice";
  format: Format;
  term: Term; // the term this question gives credit for
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

// The terms for one run. Missed terms come back first, then terms never seen,
// then terms still being learned. Mastered terms only fill leftover spots.
function pickRunTerms(level: Level, save: Save): Term[] {
  const order = (x: Term) => {
    const n = save.terms[x.term];
    return n === -1 ? 0 : n === undefined ? 1 : n >= MASTERED ? 3 : 2;
  };
  const picks: Term[] = [];
  const families = new Set<string>();
  for (const x of shuffle(level.terms).sort((a, b) => order(a) - order(b))) {
    if (picks.length === TERMS_PER_RUN) break;
    // two terms that mean nearly the same thing never share a run
    if (x.like && families.has(x.like)) continue;
    if (x.like) families.add(x.like);
    picks.push(x);
  }
  return picks;
}

const canWatch = (x: Term) => x.term !== "Ball Screen" && !!diagramFor(x.term);

// The hardest kind of question this term supports.
function hardFormat(x: Term, levelIndex: number): Format {
  if (x.situation && levelIndex >= 3) return "situation";
  return canWatch(x) ? "watch" : "name";
}

function makeChoice(format: Format, x: Term, run: Term[]): Choice {
  // Ball Screen is left out of the choices for plays that start with one, so only one answer fits.
  const startsWithBallScreen = format === "watch" && ["Roll", "Pop", "Slip"].includes(x.term);
  const others = shuffle(run.filter((y) => y.term !== x.term && !(startsWithBallScreen && y.term === "Ball Screen")));
  const opts = shuffle([x, ...others.slice(0, 3)]);
  const why = `${x.term}: ${x.meaning}`;
  const base = { kind: "choice" as const, format, term: x, why };

  if (format === "tf") {
    const truth = Math.random() < 0.5;
    return {
      ...base,
      tag: "True or false",
      prompt: truth ? x.meaning : others[0].meaning,
      focus: x.term,
      options: ["True", "False"],
      answer: truth ? 0 : 1,
    };
  }
  if (format === "meaning") {
    return {
      ...base,
      tag: "Multiple choice",
      prompt: "What does this mean?",
      focus: x.term,
      options: opts.map((o) => o.meaning),
      answer: opts.indexOf(x),
    };
  }
  const named = { ...base, options: opts.map((o) => o.term), answer: opts.indexOf(x) };
  if (format === "situation") {
    return { ...named, tag: "Read the play", prompt: "Which word fills the blank?", focus: x.situation };
  }
  if (format === "watch") {
    const key = diagramFor(x.term) ?? undefined;
    const isSpot = !!key && !!(diagrams[key] as Diagram).spot;
    return {
      ...named,
      tag: isSpot ? "Know the floor" : "Watch the play",
      prompt: isSpot ? "Which spot is lit up?" : "Which action is this?",
      diagram: key,
    };
  }
  return { ...named, tag: "Name it", prompt: "Which word fits?", focus: x.meaning };
}

function buildRounds(level: Level, levelIndex: number, run: Term[]): Round[] {
  // Film Room: the reads run in order so each pair stays back to back.
  if (level.reads) return level.reads.map((read, i) => ({ kind: "read", read, second: i % 2 === 1 }));

  const t = shuffle(run);
  const watchable = shuffle(t.filter(canWatch));
  const make = (format: Format, x: Term) => makeChoice(format, x, run);
  // Ranks with animated plays use them for the two hardest questions.
  const hard = (n: number, fallback: Term) =>
    watchable[n] ? make("watch", watchable[n]) : make(hardFormat(fallback, levelIndex), fallback);
  const match = (pairs: Term[]): Match => ({ kind: "match", pairs, order: shuffle(pairs.map((_, i) => i)) });

  return [
    make("meaning", t[0]),
    make("tf", t[1]),
    make("meaning", t[2]),
    match(t.slice(0, 4)),
    make("tf", t[3]),
    hard(0, t[1]),
    make("meaning", t[4]),
    make("tf", t[5]),
    match(t.slice(4, 8)),
    hard(1, t[5]),
    make("meaning", t[6]),
    make(hardFormat(t[7], levelIndex), t[7]),
  ];
}

// Adjust the next question to how the player is doing, the way the AOS quiz engine does:
// on a hot streak an easy question becomes a hard one, and right after a miss a hard one becomes easy.
function adapt(next: Round, streak: number, levelIndex: number, run: Term[]): Round | null {
  if (next.kind !== "choice") return null;
  if (streak >= 3 && next.format === "tf") return makeChoice(hardFormat(next.term, levelIndex), next.term, run);
  if (streak === 0 && (next.format === "name" || next.format === "situation")) return makeChoice("tf", next.term, run);
  return null;
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

// bySide: [right, asked] for each side of the ball, shown after the run
type Tally = { correct: number; total: number; xp: number; streak: number; best: number; bySide: Record<Side, [number, number]> };
const ZERO: Tally = { correct: 0, total: 0, xp: 0, streak: 0, best: 0, bySide: { offense: [0, 0], defense: [0, 0] } };

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
  const [run, setRun] = useState<Term[]>([]); // the terms in this run
  const [masteredAtStart, setMasteredAtStart] = useState(0);

  const timer = useRef<ReturnType<typeof setTimeout>>();
  const armedAt = useRef(0); // a new question ignores taps until this time
  const arm = () => {
    armedAt.current = Date.now() + 550;
  };
  const armed = () => Date.now() >= armedAt.current;
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
    const picks = pickRunTerms(levels[i], save);
    setLevelIndex(i);
    setRun(picks);
    setMasteredAtStart(masteredIn(save, levels[i].terms));
    setRounds(buildRounds(levels[i], i, picks));
    setStep(0);
    setTally(ZERO);
    resetRound();
    arm();
    setView("play");
    scrollToTop();
  };

  const finish = (final: Tally) => {
    const stars = starsFor(final.correct, final.total);
    setEarnedStars(stars);
    setSave((prev) => {
      const next: Save = {
        ...prev,
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
    const swapped = adapt(rounds[step + 1], current.streak, levelIndex, run);
    if (swapped) setRounds((list) => list.map((r, n) => (n === step + 1 ? swapped : r)));
    resetRound();
    arm();
    setStep((s) => s + 1);
  };

  const score = (right: boolean, points: number, side: Side): Tally => {
    const streak = right ? tally.streak + 1 : 0;
    const bonus = right && streak >= 3 ? 5 : 0;
    const [had, asked] = tally.bySide[side];
    const next: Tally = {
      bySide: { ...tally.bySide, [side]: [had + (right ? 1 : 0), asked + 1] },
      correct: tally.correct + (right ? 1 : 0),
      total: tally.total + 1,
      xp: tally.xp + (right ? points + bonus : 0),
      streak,
      best: Math.max(tally.best, streak),
    };
    setTally(next);
    return next;
  };

  // Remember how the player did on a term. Saved right away so quitting mid-run keeps it.
  const credit = (term: string, right: boolean) => {
    setSave((prev) => {
      const had = Math.max(prev.terms[term] ?? 0, 0);
      const next: Save = { ...prev, terms: { ...prev.terms, [term]: right ? Math.min(MASTERED, had + 1) : -1 } };
      writeSave(next);
      return next;
    });
  };

  const buzz = () => {
    try {
      window.navigator.vibrate?.(12);
    } catch {
      // not supported, fine
    }
  };

  const pick = (i: number) => {
    if (!round || round.kind !== "choice" || picked !== null || !armed()) return;
    const right = i === round.answer;
    setPicked(i);
    credit(round.term.term, right);
    const next = score(right, 10, sideOf(round.term));
    if (right) {
      buzz();
      setPraise(next.streak >= 3 ? `${next.streak} in a row.` : PRAISE[Math.floor(Math.random() * PRAISE.length)]);
    } else {
      setPraise("Not yet. Here is the read.");
    }
  };

  const readDone = (right: boolean) => {
    const next = score(right, 10, round && round.kind === "read" ? round.read.side : "offense");
    if (right) buzz();
    setPraise(right ? (next.streak >= 3 ? `${next.streak} in a row.` : "Good read.") : "Not yet. Here is the read.");
    setReadRight(right);
  };

  const tapRight = (r: number) => {
    if (!round || round.kind !== "match" || left === null || wrongPair || !armed()) return;
    const pairIndex = round.order[r];
    if (matched.includes(pairIndex)) return;
    if (pairIndex === left) {
      const firstTry = !missed.includes(left);
      if (firstTry) credit(round.pairs[left].term, true);
      score(firstTry, 5, sideOf(round.pairs[left]));
      const done = [...matched, left];
      setMatched(done);
      setLeft(null);
      buzz();
    } else {
      if (!missed.includes(left)) {
        credit(round.pairs[left].term, false);
        setMissed((m) => [...m, left]);
      }
      setTally((prev) => ({ ...prev, streak: 0 }));
      setWrongPair({ l: left, r });
      timer.current = setTimeout(() => {
        setWrongPair(null);
        setLeft(null);
      }, 520);
    }
  };

  // ---------- moving on ----------
  // A right answer has no Next button: the quiz shows the result and moves on by itself.
  // A miss waits for the player to tap Next, so there is time to read why.
  const current = view === "play" ? rounds[step] : undefined;
  const finished =
    !!current &&
    (current.kind === "choice"
      ? picked !== null
      : current.kind === "read"
        ? readRight !== null
        : matched.length === current.pairs.length);
  const gotIt =
    !!current &&
    (current.kind === "choice" ? picked === current.answer : current.kind === "read" ? readRight === true : true);
  const moveOnMs = !current
    ? 0
    : gotIt
      ? current.kind === "match"
        ? 1200
        : current.kind === "read"
          ? 2400
          : 1700
      : 0;

  useEffect(() => {
    if (!finished || !gotIt) return;
    const id = setTimeout(() => advance(tally), moveOnMs);
    return () => clearTimeout(id);
    // advance and tally are read fresh from the render that finished the question
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished, gotIt, step]);

  // ---------- views ----------

  const shell = "relative overflow-hidden border border-white/10 bg-btc-dim";

  if (view === "levels") {
    const cleared = levels.filter((l) => (save.stars[l.id] ?? 0) >= 2).length;
    const totalMastered = masteredIn(save, allTerms);
    const pillars = (Object.keys(sideNames) as Side[]).map((key) => {
      const list = allTerms.filter((x) => sideOf(x) === key);
      return { key, name: sideNames[key], done: masteredIn(save, list), of: list.length };
    });
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

        <div className="mt-8 grid gap-6 border border-white/10 bg-btc-black p-5 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <span className="label text-btc-orange">Terms mastered</span>
              <span className="mono text-sm text-btc-white/80">
                <span className="text-2xl text-btc-orange">{totalMastered}</span> of {allTerms.length}
              </span>
            </div>
            <div className="mt-3 h-2 bg-white/10" aria-hidden="true">
              <div
                className="h-full origin-left bg-btc-orange transition-transform duration-700 ease-out"
                style={{ transform: `scaleX(${totalMastered / allTerms.length})` }}
              />
            </div>
            <p className="mt-3 text-sm text-btc-white/60">
              Get a term right twice and it is yours. Every run brings new words until you have them all.
            </p>
          </div>
          <dl className="grid content-center gap-4">
            {pillars.map((s) => (
              <div key={s.key} className="grid grid-cols-[5rem_1fr_auto] items-center gap-3">
                <dt className="text-sm text-btc-white/80">{s.name}</dt>
                <dd className="h-1.5 bg-white/10" aria-hidden="true">
                  <div
                    className="h-full origin-left bg-emerald-400 transition-transform duration-700 ease-out"
                    style={{ transform: `scaleX(${s.of ? s.done / s.of : 0})` }}
                  />
                </dd>
                <dd className="mono text-xs text-btc-white/60">
                  {s.done}/{s.of}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <ol className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {levels.map((l, i) => {
            const open = unlocked(i);
            const stars = save.stars[l.id] ?? 0;
            const have = masteredIn(save, l.terms);
            const allDone = l.terms.length > 0 && have === l.terms.length;
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
                  {l.terms.length ? (
                    <span className="mt-4 block">
                      <span className="flex items-baseline justify-between">
                        <span className={`label ${allDone ? "text-emerald-400" : ""}`}>
                          {allDone ? "Mastered" : "Terms mastered"}
                        </span>
                        <span className="mono text-xs">
                          {have}/{l.terms.length}
                        </span>
                      </span>
                      <span className="mt-2 block h-1 bg-white/10" aria-hidden="true">
                        <span
                          className={`block h-full origin-left transition-transform duration-700 ease-out ${
                            allDone ? "bg-emerald-400" : open ? "bg-btc-orange" : "bg-white/20"
                          }`}
                          style={{ transform: `scaleX(${have / l.terms.length})` }}
                        />
                      </span>
                    </span>
                  ) : null}
                  <span className={`mt-5 text-sm font-semibold ${open ? "text-btc-orange" : ""}`}>
                    {open
                      ? l.reads
                        ? stars
                          ? "Play again"
                          : "Start"
                        : allDone
                          ? "Play again"
                          : stars || have
                            ? "Play new terms"
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
    const rankHas = masteredIn(save, level.terms);
    const gained = Math.max(0, rankHas - masteredAtStart);
    const moreToLearn = level.terms.length > 0 && rankHas < level.terms.length;
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
          {level.terms.length ? (
            <div className="mx-auto mt-8 max-w-md border border-white/10 bg-btc-black px-4 py-4 text-left">
              <div className="flex items-baseline justify-between gap-4">
                <span className="label text-btc-orange">
                  {rankHas === level.terms.length ? `${level.rank} mastered` : `${level.rank} terms mastered`}
                </span>
                <span className="mono text-sm">
                  {gained ? <span className="mr-2 text-emerald-400">+{gained}</span> : null}
                  {rankHas}/{level.terms.length}
                </span>
              </div>
              <div className="mt-3 h-2 bg-white/10" aria-hidden="true">
                <div
                  className="h-full origin-left bg-btc-orange transition-transform duration-700 ease-out"
                  style={{ transform: `scaleX(${rankHas / level.terms.length})` }}
                />
              </div>
              <p className="mt-3 text-sm text-btc-white/60">
                {moreToLearn
                  ? `${level.terms.length - rankHas} more to go. Play again and you will get new words.`
                  : "You know every word in this rank."}
              </p>
            </div>
          ) : null}
          <div className="mx-auto mt-6 max-w-md border border-white/10 bg-btc-black px-4 py-4 text-left">
            <div className="label text-btc-orange">How you did on each side</div>
            <div className="mt-3 grid gap-3">
              {(Object.keys(sideNames) as Side[]).map((side) => {
                const [got, asked] = tally.bySide[side];
                return (
                  <div key={side} className="grid grid-cols-[5rem_1fr_auto] items-center gap-3">
                    <span className="text-sm text-btc-white/85">{sideNames[side]}</span>
                    <span className="h-2 bg-white/10" aria-hidden="true">
                      <span
                        className={`block h-full origin-left transition-transform duration-700 ease-out ${
                          asked && got / asked >= 0.7 ? "bg-emerald-400" : "bg-btc-orange"
                        }`}
                        style={{ transform: `scaleX(${asked ? got / asked : 0})` }}
                      />
                    </span>
                    <span className="mono text-sm text-btc-white/80">{asked ? `${got}/${asked}` : "none"}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <dl className="mx-auto mt-6 grid max-w-md grid-cols-3 gap-px border border-white/10 bg-white/10">
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
              {moreToLearn ? "Play new terms" : passed ? "Play again" : "Try again"}
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

      <div className="h-1 bg-transparent" aria-hidden="true">
        {finished && gotIt ? (
          <div
            key={step}
            className="quiz-countdown h-full bg-emerald-400"
            style={{ animationDuration: `${moveOnMs}ms` }}
          />
        ) : null}
      </div>
      <div key={step} className="quiz-in px-5 pb-8 pt-7 sm:px-8 md:pb-10 md:pt-9">
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
                </div>
              ) : (
                <p className="text-sm text-btc-white/50">Tap an arrow on the court, or pick below.</p>
              )}
            </div>
          </div>
        ) : round.kind === "choice" ? (
          <>
            <div className="label text-btc-orange">{round.tag}</div>
            {round.format === "tf" ? (
              <>
                <h3 className="display mt-3 text-5xl md:text-7xl">{round.focus}</h3>
                <p className="mt-4 max-w-3xl text-xl font-semibold leading-snug text-btc-white/90 md:text-2xl">
                  <span className="text-btc-white/50">means: </span>
                  {round.prompt}
                </p>
              </>
            ) : round.diagram ? (
              <>
                <h3 className="mt-3 text-2xl font-semibold leading-snug md:text-3xl">{round.prompt}</h3>
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

            {/* With a diagram, the answers sit beside the court so both are on screen together. */}
            <div className={round.diagram ? "mt-5 grid gap-5 lg:grid-cols-[minmax(0,30rem)_minmax(0,1fr)] lg:items-start" : ""}>
            {round.diagram ? (
              <div className="min-w-0">
                <PlayDiagram name={round.diagram} />
              </div>
            ) : null}
            <div className={round.diagram ? "grid content-start gap-3" : `mt-8 grid gap-3 ${round.options.length === 2 ? "grid-cols-2 max-w-xl" : "md:grid-cols-2"}`}>
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
                    {!wasRight && round.format !== "watch" && studyDiagramFor(round.term.term) ? (
                      <div className="mt-4 w-full max-w-sm">
                        <PlayDiagram name={studyDiagramFor(round.term.term)!} />
                      </div>
                    ) : null}
                  </div>
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
                      onClick={() => !wrongPair && armed() && setLeft(i)}
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
            <div className="mt-6 min-h-[5.5rem]" aria-live="polite">
              {matched.length === round.pairs.length ? (
                <div className="quiz-in flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="display text-2xl text-emerald-400">
                    {missed.length === 0 ? "Clean sweep." : "All matched."}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-btc-white/50">
                  {matched.length} of {round.pairs.length} matched
                </p>
              )}
            </div>
          </>
        )}

        {finished && !gotIt ? (
          <div className="quiz-in mt-2 flex justify-end">
            <button
              type="button"
              onClick={() => advance(tally)}
              className="w-full bg-btc-orange px-8 py-3 font-semibold text-btc-black transition hover:bg-btc-white sm:w-auto"
            >
              {step + 1 >= rounds.length ? "See results" : "Next"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
