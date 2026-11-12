"use client";

import { useEffect, useState } from "react";
import styles from "./story.module.css";

/** Song titles only. No lyrics are reproduced. Codes are fictional. */
const SONGBOOK = [
  { code: "10241", title: "Bakit Ngayon Ka Lang", artist: "Ogie Alcasid" },
  { code: "10587", title: "Narda", artist: "Kamikazee" },
  { code: "11032", title: "Hanggang Kailan", artist: "Orange & Lemons" },
  { code: "11429", title: "Total Eclipse of the Heart", artist: "Bonnie Tyler" },
  { code: "12006", title: "Migraine", artist: "Moonstar88" },
] as const;

type Phase = "idle" | "reserved" | "singing" | "scored";

export function scoreMessage(score: number) {
  if (score >= 100) return "PERFECT! Pang-champion!";
  if (score >= 90) return "Galing! Encore, encore!";
  if (score >= 80) return "Pwede na! Palakpakan!";
  return "Practice pa, pare!";
}

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "OK"] as const;

export function VideokeToy() {
  const [entry, setEntry] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const song = SONGBOOK.find((item) => item.code === entry);

  useEffect(() => {
    if (phase !== "singing") return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(
      () => {
        // Videoke scores were famously unpredictable.
        setScore(72 + Math.floor(Math.random() * 29));
        setPhase("scored");
      },
      reduce ? 0 : 2400,
    );
    return () => window.clearTimeout(timer);
  }, [phase]);

  const press = (key: (typeof KEYS)[number]) => {
    setError(null);
    if (key === "C") {
      setEntry("");
      setPhase("idle");
      setScore(null);
      return;
    }
    if (key === "OK") {
      if (song) setPhase("reserved");
      else setError("Song not found. Check the songbook!");
      return;
    }
    if (phase !== "idle") {
      setPhase("idle");
      setScore(null);
      setEntry(key);
      return;
    }
    setEntry((value) => (value + key).slice(0, 5));
  };

  return (
    <div className={styles.videokeToy}>
      <div className={styles.songbook}>
        <p>Songbook</p>
        <ul>
          {SONGBOOK.map((item) => (
            <li key={item.code}>
              <button
                type="button"
                onClick={() => {
                  setEntry(item.code);
                  setPhase("idle");
                  setScore(null);
                  setError(null);
                }}
                aria-label={`Use code ${item.code}: ${item.title}`}
              >
                <b>{item.code}</b>
                <span>
                  {item.title}
                  <small>{item.artist}</small>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.videokeMachine}>
        <div className={styles.videokeScreen} aria-live="polite" data-phase={phase}>
          {phase === "idle" && (
            <>
              <span className={styles.vkLabel}>ENTER SONG NO.</span>
              <strong className={styles.vkCode}>{entry.padEnd(5, "_")}</strong>
              {error && <span className={styles.vkError}>{error}</span>}
            </>
          )}
          {phase === "reserved" && song && (
            <>
              <span className={styles.vkLabel}>RESERVED · {song.code}</span>
              <strong className={styles.vkTitle}>{song.title}</strong>
              <span>{song.artist}</span>
            </>
          )}
          {phase === "singing" && song && (
            <>
              <span className={styles.vkLabel}>NOW SINGING</span>
              <strong className={styles.vkTitle}>{song.title}</strong>
              <span className={styles.vkLyrics} aria-hidden="true">
                ♪ la la la ♪ <i className={styles.vkBall} />
              </span>
            </>
          )}
          {phase === "scored" && score !== null && (
            <>
              <span className={styles.vkLabel}>YOUR SCORE</span>
              <strong className={styles.vkScore} data-testid="videoke-score">
                {score}
              </strong>
              <span>{scoreMessage(score)}</span>
            </>
          )}
        </div>
        <div className={styles.remote}>
          {KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => press(key)}
              aria-label={key === "C" ? "Clear" : key === "OK" ? "Reserve song" : `Key ${key}`}
              data-key={key}
            >
              {key}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={styles.forwardButton}
          disabled={phase !== "reserved"}
          onClick={() => setPhase("singing")}
        >
          🎤 Sing!
        </button>
      </div>
    </div>
  );
}
