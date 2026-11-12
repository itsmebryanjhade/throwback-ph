"use client";

import { useState } from "react";
import styles from "./story.module.css";

/** An original, fictional drama scene ("Bulaklak sa Ulan"); no real show's script is used. */
const SCENE = [
  { speaker: "Rich boy", side: "left", original: "Who said you could sit here?" },
  { speaker: "Scholar girl", side: "right", original: "This seat isn't yours. It's for everyone." },
  { speaker: "Rich boy", side: "left", original: "…Fine. Then I'll sit right next to you." },
] as const;

const DUBS = {
  formal: {
    label: "Formal TV dub",
    kilig: [15, 25, 30],
    lines: [
      "Sino ang nagsabing maaari kang umupo riyan?",
      "Hindi sa iyo ang upuang ito. Para ito sa lahat.",
      "…Sige. Kung gayon, tatabi ako sa iyo.",
    ],
  },
  taglish: {
    label: "Taglish barkada",
    kilig: [20, 25, 35],
    lines: [
      "Sino nag-allow sa'yo umupo d'yan?",
      "Excuse me, hindi sa'yo 'to. Para sa lahat 'to.",
      "…Fine. Tatabi na lang ako sa'yo.",
    ],
  },
  kilig: {
    label: "Kilig mode",
    kilig: [30, 30, 40],
    lines: [
      "Sino'ng nagsabing pwede kang umupo d'yan… sa tabi ko?",
      "Hindi sa'yo 'tong upuan. Pero… pwede mo namang hiramin.",
      "…Sige na nga. Dito na lang ako. Sa tabi mo. Palagi.",
    ],
  },
} as const;

type DubId = keyof typeof DUBS;

export function DubSceneToy() {
  const [dubId, setDubId] = useState<DubId>("taglish");
  const [line, setLine] = useState(-1);
  const dub = DUBS[dubId];
  const current = line >= 0 ? SCENE[line] : null;
  const kilig = Math.min(100, dub.kilig.slice(0, line + 1).reduce((sum, value) => sum + value, 0));
  const finished = line === SCENE.length - 1;

  return (
    <div className={styles.dubToy}>
      <div className={styles.dramaTv}>
        <div className={styles.dramaScreen} aria-live="polite">
          <span className={styles.dramaBug}>Bulaklak sa Ulan · Ep. 12</span>
          <span className={styles.dramaFigure} data-side="left" data-speaking={current?.side === "left"} aria-hidden="true" />
          <span className={styles.dramaFigure} data-side="right" data-speaking={current?.side === "right"} aria-hidden="true" />
          {current ? (
            <p className={styles.dramaSub}>
              <small>{current.speaker}:</small> {dub.lines[line]}
            </p>
          ) : (
            <p className={styles.dramaSub}>Press Play to start the scene.</p>
          )}
          {finished && <span className={styles.dramaTbc}>Abangan… same time tomorrow!</span>}
        </div>
        <div className={styles.kiligMeter}>
          <span>Kilig meter</span>
          <span className={styles.kiligTrack} aria-hidden="true">
            <span style={{ width: `${kilig}%` }} />
          </span>
          <strong data-testid="kilig">{kilig}%</strong>
        </div>
      </div>

      <div className={styles.dubPanel}>
        <fieldset className={styles.voteChoice}>
          <legend>Dubbing style</legend>
          {(Object.keys(DUBS) as DubId[]).map((id) => (
            <label key={id} data-checked={dubId === id}>
              <input
                type="radio"
                name="dub-style"
                value={id}
                checked={dubId === id}
                onChange={() => {
                  setDubId(id);
                  setLine(-1);
                }}
              />
              {DUBS[id].label}
            </label>
          ))}
        </fieldset>
        <div className={styles.originalLine}>
          <span>Original audio (subtitled)</span>
          <p>{current ? `“${current.original}”` : "—"}</p>
        </div>
        <div className={styles.forwardActions}>
          <button
            type="button"
            className={styles.forwardButton}
            onClick={() => setLine((value) => (value >= SCENE.length - 1 ? 0 : value + 1))}
          >
            {line === -1 ? "▶ Play scene" : finished ? "↺ Replay" : "▶ Next line"}
          </button>
        </div>
        <p className={styles.forwardNote}>An original scene written for this exhibit, in the style of 2000s Asianovelas.</p>
      </div>
    </div>
  );
}
