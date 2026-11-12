"use client";

import { useState } from "react";
import styles from "./story.module.css";

const INFLUENCES = [
  { id: "kpop", label: "K-pop choreography", phrase: "K-pop choreography", from: "Korea" },
  { id: "jpop", label: "J-pop & anime songs", phrase: "J-pop and anime-song hooks", from: "Japan" },
  { id: "rnb", label: "R&B harmonies", phrase: "R&B harmonies", from: "USA" },
  { id: "hiphop", label: "Hip-hop beats", phrase: "hip-hop beats", from: "USA" },
  { id: "latin", label: "Latin dance rhythms", phrase: "Latin dance rhythms", from: "Latin America" },
] as const;

const TWISTS = [
  { id: "taglish", label: "Taglish lyrics", phrase: "Taglish lyrics" },
  { id: "ballad", label: "OPM ballad belting", phrase: "OPM ballad belting" },
  { id: "barkada", label: "Barkada humor", phrase: "barkada humor" },
  { id: "fiesta", label: "Fiesta & mall-show energy", phrase: "fiesta and mall-show energy" },
  { id: "regional", label: "Regional languages", phrase: "regional languages" },
] as const;

const GROUP_NAMES = ["Bituin", "Sinag", "Alon", "Tala", "Kidlat", "Bagwis"] as const;
const MAX_PICKS = 2;

export function groupConcept(influenceIds: readonly string[], twistIds: readonly string[]) {
  const influences = INFLUENCES.filter((item) => influenceIds.includes(item.id));
  const twists = TWISTS.filter((item) => twistIds.includes(item.id));
  const seed = [...influenceIds, ...twistIds].join("").length;
  const name = GROUP_NAMES[seed % GROUP_NAMES.length];
  const join = (items: readonly string[]) =>
    items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
  return {
    name,
    line: `${name} mixes ${join(influences.map((item) => item.phrase))} with ${join(
      twists.map((item) => item.phrase),
    )}, and sounds like nowhere else but home.`,
    stampsIn: influences.map((item) => item.from),
  };
}

function toggle(list: readonly string[], id: string): string[] {
  if (list.includes(id)) return list.filter((item) => item !== id);
  return list.length < MAX_PICKS ? [...list, id] : [...list];
}

export function MixSoundToy() {
  const [influences, setInfluences] = useState<string[]>(["kpop"]);
  const [twists, setTwists] = useState<string[]>(["taglish"]);
  const [stamped, setStamped] = useState(false);
  const ready = influences.length > 0 && twists.length > 0;
  const concept = ready ? groupConcept(influences, twists) : null;

  return (
    <div className={styles.mixToy}>
      <div className={styles.mixPickers}>
        <fieldset className={styles.chipSet}>
          <legend>Arriving influences (up to {MAX_PICKS})</legend>
          {INFLUENCES.map((item) => {
            const on = influences.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={on}
                disabled={!on && influences.length >= MAX_PICKS}
                onClick={() => {
                  setStamped(false);
                  setInfluences((list) => toggle(list, item.id));
                }}
              >
                ✈ {item.label}
              </button>
            );
          })}
        </fieldset>
        <fieldset className={styles.chipSet}>
          <legend>Filipino twist (up to {MAX_PICKS})</legend>
          {TWISTS.map((item) => {
            const on = twists.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={on}
                disabled={!on && twists.length >= MAX_PICKS}
                onClick={() => {
                  setStamped(false);
                  setTwists((list) => toggle(list, item.id));
                }}
              >
                ★ {item.label}
              </button>
            );
          })}
        </fieldset>
        <button type="button" className={styles.forwardButton} disabled={!ready} onClick={() => setStamped(true)}>
          Stamp the passport
        </button>
      </div>

      <div className={styles.passportPage} data-stamped={stamped}>
        <p className={styles.passportHead}>REPUBLIKA NG PILIPINAS · PASSPORT · P-POP</p>
        {stamped && concept ? (
          <>
            <div className={styles.stampRow}>
              {concept.stampsIn.map((from) => (
                <span key={from} className={styles.stampIn}>
                  ARRIVED
                  <b>{from}</b>
                </span>
              ))}
              <span className={styles.stampOut}>
                EXPORT
                <b>PH → WORLD</b>
              </span>
            </div>
            <p className={styles.passportName} data-testid="group-name">
              {concept.name}
            </p>
            <p className={styles.passportLine}>{concept.line}</p>
          </>
        ) : (
          <p className={styles.passportEmpty}>Pick your mix, then stamp it to create your group&apos;s sound.</p>
        )}
      </div>
    </div>
  );
}
