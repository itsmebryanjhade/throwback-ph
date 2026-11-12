"use client";

import { useEffect, useId, useState } from "react";
import styles from "./story.module.css";

export function screenNames(rawName: string): string[] {
  const name = rawName.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 12) || "miguel";
  return [`xX_${name}_Xx`, `${name}_08`, `iam_${name}`, `sweet_${name}14`, `${name}.rockz`, `${name}_cutie`];
}

const STATUSES = [
  { id: "online", label: "Online", dot: "#4caf50" },
  { id: "busy", label: "Busy · nag-aaral daw", dot: "#e53935" },
  { id: "invisible", label: "Invisible (pero online)", dot: "#9e9e9e" },
  { id: "away", label: "Away · nasa comp shop", dot: "#f5a623" },
] as const;

const EMOTES = [":)", ":D", ";))", "<3", ":-P", "=))"] as const;

export function ScreenNameToy() {
  const nameId = useId();
  const [name, setName] = useState("");
  const options = screenNames(name);
  const [handleIndex, setHandleIndex] = useState(0);
  const [status, setStatus] = useState<(typeof STATUSES)[number]["id"]>("online");
  const [emote, setEmote] = useState<(typeof EMOTES)[number]>(":D");
  const [buzzing, setBuzzing] = useState(false);
  const [buzzes, setBuzzes] = useState(0);
  const handle = options[handleIndex] ?? options[0];
  const statusInfo = STATUSES.find((item) => item.id === status) ?? STATUSES[0];

  useEffect(() => {
    if (!buzzing) return;
    const timer = window.setTimeout(() => setBuzzing(false), 600);
    return () => window.clearTimeout(timer);
  }, [buzzing]);

  return (
    <div className={styles.screenToy}>
      <div className={styles.screenForm}>
        <label className={styles.burnLabelInput} htmlFor={nameId}>
          Your first name (stays on this page)
        </label>
        <input
          id={nameId}
          className={styles.burnText}
          value={name}
          maxLength={12}
          placeholder="e.g. miguel"
          onChange={(event) => setName(event.target.value)}
        />
        <fieldset className={styles.handlePicker}>
          <legend>Pick a screen name</legend>
          {options.map((option, index) => (
            <label key={option} data-checked={index === handleIndex}>
              <input
                type="radio"
                name="screen-name"
                checked={index === handleIndex}
                onChange={() => setHandleIndex(index)}
              />
              {option}
            </label>
          ))}
        </fieldset>
        <div className={styles.statusRow}>
          <label className={styles.burnLabelInput}>
            Status
            <select
              className={styles.burnText}
              value={status}
              onChange={(event) => setStatus(event.target.value as typeof status)}
            >
              {STATUSES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <div className={styles.emoteRow} role="group" aria-label="Emoticon">
            {EMOTES.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={emote === item}
                aria-label={`Emoticon ${item}`}
                onClick={() => setEmote(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.ymWindow} data-buzzing={buzzing}>
        <div className={styles.ymTitle}>
          <span>Yahoo! Messenger</span>
          <span aria-hidden="true">_ □ ×</span>
        </div>
        <div className={styles.ymMe}>
          <span className={styles.ymAvatar} aria-hidden="true">
            {emote}
          </span>
          <span>
            <strong data-testid="ym-handle">{handle}</strong>
            <small>
              <i style={{ background: statusInfo.dot }} aria-hidden="true" /> {statusInfo.label}
            </small>
          </span>
        </div>
        <div className={styles.ymList}>
          <p>Friends (3)</p>
          <span>
            <i style={{ background: "#4caf50" }} aria-hidden="true" /> xX_angel_Xx · <em>galing comp shop haha</em>
          </span>
          <span>
            <i style={{ background: "#4caf50" }} aria-hidden="true" /> kuya_jun_dubai · <em>miss u all ingat kayo</em>
          </span>
          <span>
            <i style={{ background: "#9e9e9e" }} aria-hidden="true" /> crush_ko_08 · <em>offline</em>
          </span>
        </div>
        <div className={styles.ymChat} aria-live="polite">
          {buzzes > 0 ? (
            <p>
              <b>{handle}:</b> <span className={styles.ymBuzz}>BUZZ!!!</span>
              {buzzes > 1 && <small> ×{buzzes}</small>}
            </p>
          ) : (
            <p className={styles.ymHint}>Send a BUZZ! to xX_angel_Xx</p>
          )}
        </div>
        <button
          type="button"
          className={styles.forwardButton}
          onClick={() => {
            setBuzzes((value) => value + 1);
            setBuzzing(true);
          }}
        >
          BUZZ!
        </button>
      </div>
    </div>
  );
}
