"use client";

import { useState } from "react";
import styles from "./story.module.css";

const PESOS_PER_HOUR = 15;
const MINUTES_PER_PESO = 60 / PESOS_PER_HOUR; // 4 minutes
const MAX_PESOS = 60;
const COINS = [1, 5, 10] as const;

const ACTIVITIES = [
  { label: "Check your Friendster and approve testis", minutes: 15 },
  { label: "Chat with barkada on Yahoo! Messenger", minutes: 20 },
  { label: "Print the school project", minutes: 10 },
  { label: "One DotA match", minutes: 45 },
  { label: "Level up in Ragnarok", minutes: 60 },
  { label: "Download one song (slowly)", minutes: 30 },
] as const;

function formatTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
}

export function CoinTimerToy() {
  const [pesos, setPesos] = useState(0);
  const minutes = pesos * MINUTES_PER_PESO;

  // Fill the session in list order: each activity fits if the time left after
  // the earlier fitting activities still covers it.
  const fits = ACTIVITIES.reduce<{ items: ((typeof ACTIVITIES)[number] & { ok: boolean })[]; left: number }>(
    (acc, activity) => {
      const ok = activity.minutes <= acc.left;
      return { items: [...acc.items, { ...activity, ok }], left: ok ? acc.left - activity.minutes : acc.left };
    },
    { items: [], left: minutes },
  ).items;

  return (
    <div className={styles.coinTimer}>
      <div className={styles.cafeCounter}>
        <div className={styles.priceBoard}>
          <span>INTERNET</span>
          <strong>₱{PESOS_PER_HOUR} / hour</strong>
          <span>PRINT · SCAN · BURN CD</span>
        </div>
        <div className={styles.ledPanel} aria-live="polite">
          <span>PC #7 · Time left</span>
          <strong data-testid="cafe-time">{formatTime(minutes)}</strong>
          <span>Paid: ₱{pesos}</span>
        </div>
        <div className={styles.coinRow}>
          {COINS.map((coin) => (
            <button
              key={coin}
              type="button"
              className={styles.coin}
              aria-label={`Insert ${coin} peso${coin > 1 ? "s" : ""}`}
              disabled={pesos + coin > MAX_PESOS}
              onClick={() => setPesos((value) => Math.min(MAX_PESOS, value + coin))}
            >
              ₱{coin}
            </button>
          ))}
          <button type="button" className={styles.resetLink} onClick={() => setPesos(0)} disabled={pesos === 0}>
            Log out
          </button>
        </div>
      </div>

      <div className={styles.activityList}>
        <p>{pesos === 0 ? "Insert a coin to start your session." : "Your session could fit:"}</p>
        <ul>
          {fits.map((activity) => (
            <li key={activity.label} data-fits={activity.ok}>
              <span aria-hidden="true">{activity.ok ? "✓" : "○"}</span>
              {activity.label}
              <small>{activity.minutes} min</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
