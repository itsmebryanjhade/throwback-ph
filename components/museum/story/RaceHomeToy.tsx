"use client";

import { useState } from "react";
import styles from "./story.module.css";

const START = 16 * 60 + 30; // 4:30 PM
const SHOW = 17 * 60; // 5:00 PM
const THEME_ENDS = SHOW + 2; // opening theme lasts ~2 minutes

const STEPS = [
  {
    question: "The bell rings. What do you do?",
    options: [
      { label: "Run out the gate", minutes: 2 },
      { label: "Buy fishball sa labas", minutes: 10 },
      { label: "Chika with barkada at the gate", minutes: 15 },
    ],
  },
  {
    question: "How do you get home?",
    options: [
      { label: "Jeepney", minutes: 15 },
      { label: "Tricycle (mas mahal pero mabilis)", minutes: 8 },
      { label: "Walk", minutes: 25 },
    ],
  },
  {
    question: "You're home! Then…",
    options: [
      { label: "Straight to the TV", minutes: 1 },
      { label: "Change out of your uniform first (Nanay's rule)", minutes: 4 },
      { label: "Do homework first", minutes: 30 },
    ],
  },
] as const;

export function formatClock(total: number) {
  const hours24 = Math.floor(total / 60);
  const minutes = total % 60;
  const hours12 = ((hours24 + 11) % 12) + 1;
  return `${hours12}:${String(minutes).padStart(2, "0")} PM`;
}

export function raceVerdict(arrival: number) {
  if (arrival < SHOW) return { tone: "early", text: "Umabot ka! You even caught the commercials before the show." };
  if (arrival <= THEME_ENDS) return { tone: "ok", text: "Just in time! You're singing along to the opening theme." };
  return { tone: "late", text: "Na-miss mo ang simula… Now you'll have to ask your classmates tomorrow what happened." };
}

export function RaceHomeToy() {
  const [picks, setPicks] = useState<number[]>([]);
  const step = picks.length;
  const elapsed = picks.reduce((sum, pick, index) => sum + STEPS[index].options[pick].minutes, 0);
  const now = START + elapsed;
  const done = step === STEPS.length;
  const verdict = done ? raceVerdict(now) : null;
  const progress = Math.min(100, (elapsed / (SHOW - START)) * 100);

  return (
    <div className={styles.raceToy}>
      <div className={styles.raceBoard}>
        <div className={styles.raceClock} aria-live="polite">
          <span>Time now</span>
          <strong data-testid="race-clock">{formatClock(now)}</strong>
          <span>Show starts {formatClock(SHOW)}</span>
        </div>
        <div className={styles.raceTrack} aria-hidden="true">
          <span className={styles.raceRunner} style={{ left: `${progress}%` }}>
            🎒
          </span>
          <span className={styles.raceGoal}>📺</span>
        </div>
        {verdict && (
          <p className={styles.raceVerdict} data-tone={verdict.tone} role="status">
            {verdict.text}
          </p>
        )}
      </div>

      <div className={styles.raceChoices}>
        {done ? (
          <>
            <ol className={styles.raceLog}>
              {picks.map((pick, index) => (
                <li key={STEPS[index].question}>
                  {STEPS[index].options[pick].label} <small>+{STEPS[index].options[pick].minutes} min</small>
                </li>
              ))}
            </ol>
            <button type="button" className={styles.forwardButton} onClick={() => setPicks([])}>
              Try another route
            </button>
          </>
        ) : (
          <>
            <p className={styles.raceQuestion}>
              <small>
                Step {step + 1} of {STEPS.length}
              </small>
              {STEPS[step].question}
            </p>
            <div className={styles.raceOptions}>
              {STEPS[step].options.map((option, index) => (
                <button key={option.label} type="button" onClick={() => setPicks((list) => [...list, index])}>
                  {option.label}
                  <small>+{option.minutes} min</small>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
