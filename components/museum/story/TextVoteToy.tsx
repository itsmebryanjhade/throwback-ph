"use client";

import { useState } from "react";
import styles from "./story.module.css";

/** Fictional housemates. Nobody here is a real contestant. */
const HOUSEMATES = [
  { code: "BIANCA", name: "Bianca", from: "Davao", color: "#d6247a", start: 31 },
  { code: "JOJO", name: "Jojo", from: "Pampanga", color: "#1d5fbf", start: 34 },
  { code: "ELLA", name: "Ella", from: "Iloilo", color: "#2f9e44", start: 35 },
] as const;

type Code = (typeof HOUSEMATES)[number]["code"];

// The rest of the country votes too: each of your texts brings a wave of
// other votes, which slowly favors whoever is behind (it is a close race).
const NATION_WAVE: Record<Code, number> = { BIANCA: 3, JOJO: 2, ELLA: 2 };
const MAX_VOTES = 8;

export function TextVoteToy() {
  const [choice, setChoice] = useState<Code>("BIANCA");
  const [votes, setVotes] = useState<Record<Code, number>>(() =>
    Object.fromEntries(HOUSEMATES.map((h) => [h.code, h.start])) as Record<Code, number>,
  );
  const [sent, setSent] = useState(0);
  const [lastSent, setLastSent] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const total = Object.values(votes).reduce((sum, value) => sum + value, 0);
  const ranked = [...HOUSEMATES].sort((a, b) => votes[a.code] - votes[b.code]);
  const evicted = ranked[0];

  const sendVote = () => {
    setVotes((current) => {
      const next = { ...current };
      for (const housemate of HOUSEMATES) next[housemate.code] += NATION_WAVE[housemate.code];
      next[choice] += 4;
      return next;
    });
    setSent((value) => value + 1);
    setLastSent(`PBB SAVE ${choice}`);
    setRevealed(false);
  };

  return (
    <div className={styles.voteToy}>
      <div className={styles.voteScreen}>
        <div className={styles.voteLive}>
          <span className={styles.liveDot} aria-hidden="true" /> LIVE · Eviction night
        </div>
        <ul className={styles.voteBars} aria-label="Live standings">
          {HOUSEMATES.map((housemate) => {
            const share = Math.round((votes[housemate.code] / total) * 100);
            const isOut = revealed && housemate.code === evicted.code;
            return (
              <li key={housemate.code} data-out={isOut}>
                <span className={styles.voteFace} style={{ background: housemate.color }} aria-hidden="true">
                  {housemate.name[0]}
                </span>
                <span className={styles.voteName}>
                  <strong>{housemate.name}</strong>
                  <small>{housemate.from}</small>
                </span>
                <span className={styles.voteTrack}>
                  <span style={{ width: `${share}%`, background: housemate.color }} />
                </span>
                <span className={styles.voteShare}>{share}%</span>
              </li>
            );
          })}
        </ul>
        {revealed && (
          <p className={styles.voteVerdict} role="status">
            {evicted.name}, you must now leave the house.
            {evicted.code !== choice && sent > 0 ? ` Your texts helped save ${HOUSEMATES.find((h) => h.code === choice)?.name}!` : ""}
          </p>
        )}
      </div>

      <div className={styles.votePhone}>
        <fieldset className={styles.voteChoice}>
          <legend>Save which housemate?</legend>
          {HOUSEMATES.map((housemate) => (
            <label key={housemate.code} data-checked={choice === housemate.code}>
              <input
                type="radio"
                name="housemate"
                value={housemate.code}
                checked={choice === housemate.code}
                onChange={() => setChoice(housemate.code)}
              />
              {housemate.name}
            </label>
          ))}
        </fieldset>
        <div className={styles.voteSms} aria-live="polite">
          <span>To: 23XX · SMS</span>
          <strong>PBB SAVE {choice}</strong>
          {lastSent && <small>✓ Sent! Each vote used one text.</small>}
        </div>
        <div className={styles.forwardActions}>
          <button type="button" className={styles.forwardButton} onClick={sendVote} disabled={sent >= MAX_VOTES}>
            {sent >= MAX_VOTES ? "Out of load!" : `Send vote (${sent}/${MAX_VOTES})`}
          </button>
          <button type="button" className={styles.resetLink} onClick={() => setRevealed(true)} disabled={sent === 0}>
            Reveal the evictee
          </button>
        </div>
        <p className={styles.forwardNote}>Housemates are fictional. The other votes are simulated.</p>
      </div>
    </div>
  );
}
