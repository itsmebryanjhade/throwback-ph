"use client";

import { useEffect, useId, useState } from "react";
import styles from "./story.module.css";

const TRACKS = [
  { title: "Noypi", artist: "Bamboo" },
  { title: "Narda", artist: "Kamikazee" },
  { title: "Hanggang Kailan", artist: "Orange & Lemons" },
  { title: "Migraine", artist: "Moonstar88" },
  { title: "Jeepney", artist: "Sponge Cola" },
  { title: "The Day You Said Goodnight", artist: "Hale" },
  { title: "Buloy", artist: "Parokya ni Edgar" },
] as const;

const MAX_TRACKS = 5;

export function BurnCdToy() {
  const labelId = useId();
  const [picked, setPicked] = useState<string[]>(["Noypi", "Narda"]);
  const [label, setLabel] = useState("SOUNDTRIP NG BARKADA");
  const [progress, setProgress] = useState<number | null>(null);
  const burning = progress !== null && progress < 100;
  const done = progress === 100;

  useEffect(() => {
    if (!burning) return;
    const timer = window.setTimeout(() => setProgress((value) => Math.min(100, (value ?? 0) + 10)), 140);
    return () => window.clearTimeout(timer);
  }, [burning, progress]);

  const toggle = (title: string) => {
    setProgress(null);
    setPicked((list) =>
      list.includes(title) ? list.filter((item) => item !== title) : list.length < MAX_TRACKS ? [...list, title] : list,
    );
  };

  const startBurn = () => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    setProgress(reduce ? 100 : 0);
  };

  return (
    <div className={styles.burnToy}>
      <div className={styles.burnPicker}>
        <fieldset>
          <legend>
            Tracklist ({picked.length}/{MAX_TRACKS})
          </legend>
          {TRACKS.map((track) => {
            const checked = picked.includes(track.title);
            return (
              <label key={track.title} data-checked={checked}>
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={burning || (!checked && picked.length >= MAX_TRACKS)}
                  onChange={() => toggle(track.title)}
                />
                <span>
                  <strong>{track.title}</strong> · {track.artist}
                </span>
              </label>
            );
          })}
        </fieldset>
        <label className={styles.burnLabelInput} htmlFor={labelId}>
          Marker label
        </label>
        <input
          id={labelId}
          className={styles.burnText}
          value={label}
          maxLength={28}
          disabled={burning}
          onChange={(event) => {
            setProgress(null);
            setLabel(event.target.value);
          }}
        />
        <div className={styles.forwardActions}>
          <button type="button" className={styles.forwardButton} disabled={burning || picked.length === 0} onClick={startBurn}>
            {burning ? "Burning…" : done ? "Burn another copy" : "Burn CD"}
          </button>
        </div>
        <div className={styles.burnProgress} aria-live="polite">
          {progress === null ? (
            <span>Insert a blank CD-R and press Burn.</span>
          ) : (
            <>
              <span className={styles.burnTrack} aria-hidden="true">
                <span style={{ width: `${progress}%` }} />
              </span>
              <span>{done ? "Burn complete! Ready to pass around." : `Writing track data… ${progress}%`}</span>
            </>
          )}
        </div>
      </div>

      <figure className={styles.cdStage} data-done={done}>
        <svg viewBox="0 0 200 200" role="img" aria-label={`A burned CD labeled ${label || "untitled"}`}>
          <defs>
            <radialGradient id="cd-shine" cx="35%" cy="30%" r="80%">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset=".45" stopColor="#d9e4ef" />
              <stop offset=".7" stopColor="#f4d6f0" />
              <stop offset="1" stopColor="#c5e8f7" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="96" fill="url(#cd-shine)" stroke="#9aa7b8" strokeWidth="2" />
          <circle cx="100" cy="100" r="96" fill="none" stroke="#7d8da1" strokeWidth="1" strokeDasharray={done ? "0" : "2 3"} opacity=".5" />
          <circle cx="100" cy="100" r="24" fill="#eef2f6" stroke="#9aa7b8" />
          <circle cx="100" cy="100" r="9" fill="#fffdf3" stroke="#9aa7b8" />
          <text x="100" y="52" textAnchor="middle" className={styles.cdMarker}>
            {(label || "untitled").slice(0, 22)}
          </text>
          <text x="100" y="150" textAnchor="middle" className={styles.cdMarkerSmall}>
            {done ? "burned · 2006" : "CD-R 700MB"}
          </text>
        </svg>
        <figcaption>
          <ol>
            {picked.map((title) => (
              <li key={title}>{title}</li>
            ))}
          </ol>
        </figcaption>
      </figure>
    </div>
  );
}
