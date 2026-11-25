"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CourtStage, { makeStageRefs, paintPlay, sampleRoutes } from "@/components/CourtStage";
import { categories, plays, stepsFor, toStage, type Category, type Play } from "@/lib/plays";

// The Chalkboard: 5 on 5 plays that run one step at a time, the way a coach draws them.

const SPEEDS = {
  teach: { name: "Teaching speed", move: 2300, hold: 1500 },
  game: { name: "Game speed", move: 1100, hold: 350 },
} as const;
type Speed = keyof typeof SPEEDS;

const LEVEL = { 1: "Level 1", 2: "Level 2", 3: "Level 3" } as const;
const KEY = "btc-chalkboard-v1";
const ORDER = Object.keys(categories) as Category[];

function loadSolved(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function shuffled(n: number): number[] {
  const list = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

// A "what is open?" test: the play runs with one coverage and freezes when the defense shows it.
type Quiz = { order: number[]; frozen: boolean; pick: number | null };

function Board({ play, solved, onSolved }: { play: Play; solved: boolean; onSolved: () => void }) {
  const [option, setOption] = useState(0); // which read is on the board
  const stage = useMemo(() => toStage(play, option), [play, option]);
  const steps = useMemo(() => stepsFor(play, option), [play, option]);
  const routes = useMemo(() => {
    const all = sampleRoutes(stage.actors);
    // only the offense leaves lines on the board, the way a coach draws it
    for (const a of stage.actors) if (a.team === "defense") all[a.id] = [];
    return all;
  }, [stage]);
  const refs = useRef(makeStageRefs()).current;
  const n = steps.length;
  const reads = play.reads;

  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);
  const [speed, setSpeed] = useState<Speed>("teach");
  const [guess, setGuess] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  const clock = useRef(0); // ms into the play, counting each step's move and hold
  const speedRef = useRef(speed);
  speedRef.current = speed;
  const board = useRef<HTMLDivElement>(null);
  // Bring the court to the top of the screen so the play and the question are seen together.
  const toBoard = () => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    board.current?.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
  };
  const pendingRun = useRef(false); // run from the top once the new read is on the board
  const stopStep = useRef<number | null>(null); // freeze after this step, for the test
  const bag = useRef<number[]>([]); // coverages still to come, so none repeats until all have been seen
  const lastTest = useRef(-1);

  // Draw the play at the clock's position and report which step that is.
  const paint = useCallback(() => {
    const { move, hold } = SPEEDS[speedRef.current];
    const period = move + hold;
    const k = Math.min(n - 1, Math.floor(clock.current / period));
    const u = Math.min(1, (clock.current - k * period) / move);
    paintPlay(stage, refs, routes, (k + u) / n);
    return k;
  }, [n, refs, routes, stage]);

  useEffect(() => {
    clock.current = 0;
    setStep(paint());
    if (pendingRun.current) {
      pendingRun.current = false;
      setDone(false);
      setStarted(true);
      setPlaying(true);
    }
  }, [paint]);

  useEffect(() => {
    if (!playing) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let last = 0;
    const tick = (now: number) => {
      const { move, hold } = SPEEDS[speedRef.current];
      const period = move + hold;
      const total = n * period - hold;
      if (last) clock.current += Math.min(now - last, 50);
      last = now;
      // with motion turned off, each step is shown finished instead of moving
      if (still) {
        let k = Math.floor(clock.current / period);
        if (clock.current >= k * period + move) k += 1; // this step is already shown, so show the next
        clock.current = Math.min(total, k * period + move);
      }
      const stop = stopStep.current;
      if (stop !== null && clock.current >= stop * period + move) {
        clock.current = stop * period + move;
        setStep(paint());
        setPlaying(false);
        setQuiz((q) => (q ? { ...q, frozen: true } : q));
        return;
      }
      if (clock.current >= total) {
        clock.current = total;
        setStep(paint());
        setPlaying(false);
        setDone(true);
        return;
      }
      setStep(paint());
      if (still) {
        setPlaying(false);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const onHide = () => document.hidden && setPlaying(false);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [playing, n, paint]);

  // Jump to the start of a step and run from there.
  const goTo = (k: number) => {
    const { move, hold } = SPEEDS[speedRef.current];
    clock.current = Math.max(0, Math.min(n - 1, k)) * (move + hold);
    setStep(paint());
    setDone(false);
    setStarted(true);
    setPlaying(true);
  };

  // Put one read on the board and run it from the top.
  const run = (i: number) => {
    if (i === option) goTo(0);
    else {
      pendingRun.current = true;
      setPlaying(false);
      setOption(i);
    }
  };
  const show = (i: number) => {
    stopStep.current = null;
    setQuiz(null);
    toBoard();
    run(i);
  };
  const leaveTest = () => {
    stopStep.current = null;
    setQuiz(null);
  };
  const test = () => {
    if (!reads) return;
    toBoard();
    stopStep.current = reads.from;
    setQuiz({ order: shuffled(reads.options.length), frozen: false, pick: null });
    // Deal the coverages like a deck of cards: every one comes up once before any repeats,
    // and the same one never comes up twice in a row.
    if (bag.current.length === 0) {
      bag.current = shuffled(reads.options.length);
      if (bag.current.length > 1 && bag.current[0] === lastTest.current) bag.current.push(bag.current.shift()!);
    }
    const next = bag.current.shift()!;
    lastTest.current = next;
    run(next);
  };
  const answer = (i: number) => {
    if (!quiz || quiz.pick !== null) return;
    setQuiz({ ...quiz, pick: i });
    if (i === option) onSolved();
    stopStep.current = null;
    setPlaying(true);
  };

  const changeSpeed = (next: Speed) => {
    // keep the same place in the play when the speed changes
    const from = SPEEDS[speedRef.current];
    const to = SPEEDS[next];
    const k = Math.floor(clock.current / (from.move + from.hold));
    const u = Math.min(1, (clock.current - k * (from.move + from.hold)) / from.move);
    clock.current = k * (to.move + to.hold) + u * to.move;
    setSpeed(next);
  };

  const pick = (id: string) => {
    if (guess) return;
    setGuess(id);
    if (id === play.shot) onSolved();
  };

  const testing = !!quiz && quiz.pick === null; // the answer is still hidden
  const hidden = (i: number) => testing && !!reads && i > reads.from;
  const ids = Object.keys(play.start).sort();
  const button = "border border-white/20 px-4 py-2.5 text-sm font-semibold transition hover:border-btc-orange hover:text-btc-orange disabled:opacity-30 disabled:hover:border-white/20 disabled:hover:text-inherit";
  const main = "bg-btc-orange px-5 py-2.5 text-sm font-semibold text-btc-black transition hover:bg-btc-white disabled:opacity-40 disabled:hover:bg-btc-orange";

  return (
    <div ref={board} className="grid min-w-0 scroll-mt-16 gap-x-6 gap-y-3 lg:scroll-mt-[5.5rem] lg:gap-y-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      {/* The buttons, the court and the controls are sized to fit one screen together.
          The court shrinks on a short window so nothing is pushed below the fold. */}
      <div className={`board-col min-w-0 lg:sticky lg:top-[5.5rem] lg:self-start ${quiz ? "is-test" : ""}`}>
        {quiz ? null : (
          <div className={`mb-2 grid gap-2 ${reads ? "grid-cols-2" : ""}`}>
          {!started ? (
            <button
              type="button"
              onClick={() => {
                toBoard();
                goTo(0);
              }}
              className={`${main} w-full py-3 text-sm sm:text-base`}
            >
              {reads ? "Step 1: Run the play" : "Run the play"}
            </button>
          ) : done ? (
            <button type="button" onClick={() => show(option)} className={`${main} w-full py-3 text-sm sm:text-base`}>
              {reads ? "Step 1: Run it again" : "Run it again"}
            </button>
          ) : (
            <button type="button" onClick={() => setPlaying((p) => !p)} className={`${main} w-full py-3 text-sm sm:text-base`}>
              {playing ? "Pause" : "Keep going"}
            </button>
          )}
            {reads ? (
              <button
                type="button"
                onClick={test}
                className={`w-full border-2 border-btc-orange bg-btc-orange/10 px-3 py-1.5 text-left transition hover:bg-btc-orange hover:text-btc-black ${done ? "answer-pulse" : ""}`}
              >
                <span className="block text-sm font-semibold leading-tight sm:text-base">Step 2: Test me →</span>
                <span className="block text-[0.7rem] leading-tight opacity-75">It freezes. You pick what is open.</span>
              </button>
            ) : null}
          </div>
        )}
        <figure className={`overflow-hidden border bg-[#0D1016] transition-colors ${quiz?.frozen && testing ? "border-btc-orange" : "border-white/10"}`}>
          <CourtStage play={stage} refs={refs} label={`${play.name}. ${steps.map((s) => s.say).join(" ")}`} extra={play.category === "blob" ? 30 : 0} />
          <figcaption className={`grid grid-cols-[auto_1fr] items-start gap-3 border-t border-white/10 px-4 py-3 ${quiz ? "hidden" : "min-h-[4.5rem] lg:hidden"}`}>
            <span className="mono text-sm text-btc-orange">
              {started ? step + 1 : 0}/{n}
            </span>
            <span className="text-[0.95rem] leading-snug text-btc-white">
              {!started ? "Tap Run the play. It moves one step at a time." : quiz?.frozen && testing ? "The play is frozen. Look at the defense." : steps[step].say}
            </span>
          </figcaption>
        </figure>
        <div className={`mt-2 flex-wrap items-center gap-2 ${quiz ? "hidden" : "flex"}`}>
          <button type="button" onClick={() => goTo(step - 1)} disabled={!started || step === 0 || testing} className={button}>
            Back a step
          </button>
          <button type="button" onClick={() => goTo(step + 1)} disabled={!started || step >= n - 1 || testing} className={button}>
            Next step
          </button>
          <button
            type="button"
            onClick={() => changeSpeed(speed === "teach" ? "game" : "teach")}
            aria-pressed={speed === "game"}
            className="ml-auto mono border border-white/15 px-3 py-2.5 text-xs text-btc-white/75 transition hover:border-btc-orange hover:text-btc-orange"
          >
            {SPEEDS[speed].name}
          </button>
        </div>
        {reads && !quiz ? (
          <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-btc-white/60 lg:hidden">
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-btc-orange" aria-hidden="true" /> Offense
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-full border-2 border-[#C9CED8]" aria-hidden="true" /> Defense. Each defender guards the same number.
            </span>
          </p>
        ) : null}
      </div>

      <div className="min-w-0">
        {quiz && reads ? (
          <div className={`border-2 border-btc-orange bg-btc-black px-4 py-3 sm:px-5 sm:py-5 [@media(max-height:640px)]:!py-3 ${quiz.frozen && quiz.pick === null ? "answer-pulse" : ""}`} aria-live="polite">
            <div className="flex items-center justify-between gap-3">
              <div className="label text-btc-orange">Your turn · {play.name}</div>
              <button type="button" onClick={leaveTest} className="mono text-xs text-btc-white/60 underline-offset-4 transition hover:text-btc-orange hover:underline">
                Back to the play
              </button>
            </div>
            {!quiz.frozen && quiz.pick === null ? (
              <>
                <p className="display mt-2 text-3xl leading-tight md:text-4xl">Watch the defense.</p>
                <p className="mt-2 text-base text-btc-white/70">The play will freeze. Then you make the read.</p>
              </>
            ) : (
              <>
                <p key="ask" className="quiz-pop display mt-1 text-3xl leading-tight text-btc-orange sm:mt-3 sm:text-4xl md:text-5xl [@media(max-height:640px)]:!mt-1 [@media(max-height:640px)]:!text-3xl">What is open?</p>
                {quiz.pick === null ? <p className="mt-2 hidden text-base text-btc-white/80 sm:block [@media(max-height:640px)]:!hidden">Look at where the defenders are. Tap your answer.</p> : null}
                <div className="mt-2 grid gap-2 sm:mt-4 sm:gap-3 [@media(max-height:640px)]:!mt-2 [@media(max-height:640px)]:!gap-2">
                  {quiz.order.map((i, n) => {
                    const right = quiz.pick !== null && i === option;
                    const wrong = quiz.pick === i && i !== option;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => answer(i)}
                        disabled={quiz.pick !== null}
                        className={`grid grid-cols-[2rem_1fr] items-center gap-3 border-2 px-3 py-2.5 text-left text-[0.95rem] font-semibold leading-snug transition sm:px-4 sm:py-3 sm:text-base md:py-4 md:text-lg [@media(max-height:640px)]:!py-2 [@media(max-height:640px)]:!text-[0.95rem] ${
                          right
                            ? "border-emerald-400 bg-emerald-400/15 text-emerald-300"
                            : wrong
                              ? "border-red-400 bg-red-400/10 text-red-300"
                              : "border-white/30 bg-white/5 text-btc-white hover:border-btc-orange hover:bg-btc-orange/10 disabled:opacity-40 disabled:hover:border-white/30 disabled:hover:bg-white/5"
                        }`}
                      >
                        <span className="mono text-sm opacity-60">{String.fromCharCode(65 + n)}</span>
                        <span>{reads.options[i].open}</span>
                      </button>
                    );
                  })}
                </div>
                {quiz.pick !== null ? (
                  <>
                    <p className="mt-4 text-base leading-relaxed text-btc-white/85">
                      <span className={`font-semibold ${quiz.pick === option ? "text-emerald-300" : "text-btc-orange"}`}>{quiz.pick === option ? "That is the read." : "Not this time."}</span>{" "}
                      {reads.options[option].see}, so: {reads.options[option].open.toLowerCase()}. Watch it finish.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button type="button" onClick={test} className={main}>
                        Next one
                      </button>
                      <button type="button" onClick={leaveTest} className={button}>
                        Back to the play
                      </button>
                    </div>
                  </>
                ) : null}
              </>
            )}
          </div>
        ) : (
          <>
        <div className="label text-btc-orange">
          {categories[play.category].name} · {LEVEL[play.level]} · {play.entry}
        </div>
        <h3 className="display mt-2 text-4xl md:text-5xl">{play.name}</h3>
        <p className="mt-3 text-base leading-relaxed text-btc-white/80">
          <span className="text-btc-white">What it gets you:</span> {play.goal}
        </p>

        <div className="mt-4">
          <div className="label">Built from</div>
          <ul className="mt-2 flex flex-wrap gap-2">
            {play.actions.map((a, i) => (
              <li key={i} className="mono border border-white/15 px-2.5 py-1 text-xs text-btc-white/80">
                {a}
              </li>
            ))}
          </ul>
        </div>

        <ol className="mt-5 grid gap-px border border-white/10 bg-white/10">
          {steps.map((s, i) => {
            const on = started && i === step;
            const past = started && (i < step || done);
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  disabled={testing}
                  aria-current={on ? "step" : undefined}
                  className={`grid w-full grid-cols-[1.75rem_1fr] gap-3 px-4 py-3 text-left transition ${
                    on ? "bg-btc-orange/15" : "bg-btc-black hover:bg-white/5 disabled:hover:bg-btc-black"
                  }`}
                >
                  <span className={`mono text-sm ${on ? "text-btc-orange" : past ? "text-btc-white/70" : "text-btc-white/35"}`}>{i + 1}</span>
                  <span className={`text-[0.95rem] leading-snug ${on ? "text-btc-white" : past ? "text-btc-white/75" : "text-btc-white/45"}`}>
                    {hidden(i) ? "Make the read first." : s.say}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        {reads ? (
          <div className="mt-5 border border-btc-orange/40 bg-btc-black px-4 py-4" aria-live="polite">
            <div className="label text-btc-orange">Read the defense</div>
            <p className="mt-2 text-sm leading-relaxed text-btc-white/70">Knowing the play is step one. The defense decides what is open. Tap a card to watch the defense guard it that way. When you are ready, tap Step 2: Test me above the court.</p>
            <div className={`mt-3 grid gap-2 ${testing ? "hidden" : ""}`}>
              {reads.options.map((r, i) => {
                const on = !quiz && started && i === option;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => show(i)}
                    className={`border px-3 py-2.5 text-left transition ${on ? "border-btc-orange bg-btc-orange/10" : "border-white/15 hover:border-white/40"}`}
                  >
                    <span className="mono block text-[0.7rem] text-btc-white/50">If</span>
                    <span className="block text-sm text-btc-white">{r.see}</span>
                    <span className="mono mt-1 block text-[0.7rem] text-btc-white/50">Then</span>
                    <span className="block text-sm text-btc-orange">{r.open}</span>
                  </button>
                );
              })}
            </div>

            {solved ? <p className="mono mt-3 text-xs text-emerald-300">You already made this read. Test yourself again, the defense changes.</p> : null}
          </div>
        ) : (
          <div className="mt-5 border border-white/10 bg-btc-black px-4 py-4" aria-live="polite">
            <div className="label text-btc-orange">Check yourself</div>
            {!done && !guess ? (
              <p className="mt-2 text-sm text-btc-white/60">Run the play to the end, then answer.</p>
            ) : (
              <>
                <p className="mt-2 text-base text-btc-white">Who ends up with the shot?</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ids.map((id) => {
                    const right = guess && id === play.shot;
                    const wrong = guess === id && id !== play.shot;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => pick(id)}
                        disabled={!!guess}
                        className={`mono h-11 w-11 border text-base font-semibold transition ${
                          right
                            ? "border-emerald-400 bg-emerald-400/15 text-emerald-300"
                            : wrong
                              ? "border-red-400 bg-red-400/10 text-red-300"
                              : "border-white/20 text-btc-white hover:border-btc-orange hover:text-btc-orange disabled:opacity-40 disabled:hover:border-white/20 disabled:hover:text-btc-white"
                        }`}
                      >
                        {id}
                      </button>
                    );
                  })}
                </div>
                {guess ? (
                  <p className="mt-3 text-sm leading-relaxed text-btc-white/80">
                    <span className={guess === play.shot ? "text-emerald-300" : "text-btc-orange"}>{guess === play.shot ? "That is the read." : `It is ${play.shot}.`}</span> {play.goal}
                  </p>
                ) : null}
              </>
            )}
            {solved && !guess ? <p className="mono mt-3 text-xs text-emerald-300">You already got this one.</p> : null}
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
}

export default function PlayBoard() {
  const [category, setCategory] = useState<Category>("half");
  const [playId, setPlayId] = useState(plays.find((p) => p.category === "half" && p.level === 1)!.id);
  const [solved, setSolved] = useState<string[]>([]);

  useEffect(() => setSolved(loadSolved()), []);

  const list = useMemo(() => plays.filter((p) => p.category === category).sort((a, b) => a.level - b.level), [category]);
  const play = plays.find((p) => p.id === playId) ?? list[0];

  const markSolved = (id: string) =>
    setSolved((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        // private browsing: progress just does not save
      }
      return next;
    });

  const choose = (c: Category) => {
    setCategory(c);
    setPlayId(plays.filter((p) => p.category === c).sort((a, b) => a.level - b.level)[0].id);
  };

  return (
    <div className="scanline border border-white/10 bg-btc-dim px-5 py-8 md:px-10 md:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="label text-btc-orange">5 on 5</div>
          <h2 className="display mt-2 text-4xl md:text-6xl">The Chalkboard.</h2>
        </div>
        <div className="mono text-sm text-btc-white/70">
          <span className="text-btc-orange">{solved.filter((id) => plays.some((p) => p.id === id)).length}</span> of {plays.length} plays read
        </div>
      </div>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-btc-white/80">
        When a coach draws a play in a timeout, you get about ten seconds to understand it. Every play is built from a few actions. Learn the actions and you can read any play. Watch each one a step at a time, then run it at game speed. The numbers are positions: 1 point guard, 2 shooting guard, 3 small forward, 4 power forward, 5 center.
      </p>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-btc-white/60">
        Spots on the floor used in the steps: top, slot, wing, corner, elbow, block, and dunker spot. The slot is the spot above the wing, in line with the edge of the lane.
      </p>

      <div role="tablist" aria-label="Play type" className="mt-6 grid grid-cols-2 gap-px border border-white/10 bg-white/10 md:grid-cols-5">
        {ORDER.map((c) => {
          const on = c === category;
          return (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => choose(c)}
              className={`px-4 py-3 text-left transition ${on ? "bg-btc-orange text-btc-black" : "bg-btc-black text-btc-white hover:bg-white/5"}`}
            >
              <span className="block text-sm font-semibold">{categories[c].name}</span>
              <span className={`mono block text-xs ${on ? "text-btc-black/70" : "text-btc-white/50"}`}>{plays.filter((p) => p.category === c).length} plays</span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-btc-white/60">{categories[category].about}</p>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {list.map((p) => {
          const on = p.id === play.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlayId(p.id)}
              aria-pressed={on}
              className={`shrink-0 border px-4 py-2.5 text-left transition ${
                on ? "border-btc-orange bg-btc-orange/10" : "border-white/15 bg-btc-black hover:border-white/40"
              }`}
            >
              <span className="mono block text-[0.7rem] text-btc-white/50">
                {LEVEL[p.level]}
                {p.reads ? " · reads" : ""}
                {solved.includes(p.id) ? <span className="text-emerald-300"> · done</span> : null}
              </span>
              <span className={`block text-sm font-semibold ${on ? "text-btc-orange" : "text-btc-white"}`}>{p.name}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <Board key={play.id} play={play} solved={solved.includes(play.id)} onSolved={() => markSolved(play.id)} />
      </div>
    </div>
  );
}
