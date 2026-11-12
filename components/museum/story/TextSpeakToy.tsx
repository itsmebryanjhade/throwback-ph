"use client";

import { useId, useState } from "react";
import styles from "./story.module.css";

const SMS_LIMIT = 160;

// Order matters: longer phrases first.
const TEXTSPEAK: readonly [RegExp, string][] = [
  [/\bgood morning\b/gi, "gud am"],
  [/\bgood night\b/gi, "gud nyt"],
  [/\bsee you later\b/gi, "cu l8r"],
  [/\bsee you\b/gi, "cu"],
  [/\bcomputer shop\b/gi, "comp shop"],
  [/\bthank you\b/gi, "tnx"],
  [/\bthanks\b/gi, "tnx"],
  [/\bplease\b/gi, "pls"],
  [/\blater\b/gi, "l8r"],
  [/\bgreat\b/gi, "gr8"],
  [/\btomorrow\b/gi, "2mrw"],
  [/\btonight\b/gi, "2nyt"],
  [/\btoday\b/gi, "2day"],
  [/\bbecause\b/gi, "coz"],
  [/\bbefore\b/gi, "b4"],
  [/\bmessage\b/gi, "msg"],
  [/\btext\b/gi, "txt"],
  [/\bpeople\b/gi, "ppl"],
  [/\bwhat\b/gi, "wat"],
  [/\bwhere\b/gi, "wer"],
  [/\bwith\b/gi, "w/"],
  [/\blove\b/gi, "luv"],
  [/\bokay\b/gi, "ok"],
  [/\bare\b/gi, "r"],
  [/\byou\b/gi, "u"],
  [/\byour\b/gi, "ur"],
  [/\bfor\b/gi, "4"],
  [/\bto\b/gi, "2"],
  [/\band\b/gi, "&"],
  [/\bna\b/gi, "n"],
  [/\bako\b/gi, "aq"],
];

export function toTextspeak(message: string): string {
  let result = message;
  for (const [pattern, replacement] of TEXTSPEAK) {
    result = result.replace(pattern, replacement);
  }
  return result.replace(/\s+([!?.,])/g, "$1").replace(/\s{2,}/g, " ").trim();
}

const PRESETS = [
  "Good morning! See you later at the computer shop, okay?",
  "Where are you? Please text me before you go home tonight.",
  "Thank you for the load! Love you, see you tomorrow.",
];

export function TextSpeakToy() {
  const inputId = useId();
  const [message, setMessage] = useState(PRESETS[0]);
  const converted = toTextspeak(message);
  const texts = Math.max(1, Math.ceil(converted.length / SMS_LIMIT));
  const saved = message.length - converted.length;

  return (
    <div className={styles.textspeak}>
      <div className={styles.textspeakInput}>
        <label htmlFor={inputId}>Your message</label>
        <textarea
          id={inputId}
          value={message}
          maxLength={320}
          rows={3}
          onChange={(event) => setMessage(event.target.value)}
        />
        <div className={styles.presetRow} aria-label="Example messages">
          {PRESETS.map((preset, index) => (
            <button key={preset} type="button" onClick={() => setMessage(preset)}>
              Example {index + 1}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.lcd} aria-live="polite">
        <div className={styles.lcdBar}>
          <span>✉ New message</span>
          <span>
            {converted.length}/{SMS_LIMIT}
          </span>
        </div>
        <p className={styles.lcdText}>{converted || "…"}</p>
        <div className={styles.lcdFoot}>
          <span>
            {texts === 1 ? "Fits in 1 text" : `Needs ${texts} texts`}
          </span>
          {saved > 0 && <span>Saved {saved} characters</span>}
        </div>
      </div>
    </div>
  );
}
