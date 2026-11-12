import React, { useState } from "react";
import { IMMIGRATION_QUESTIONS } from "@/lib/apps/ppoppassport/immigration";
import type {
  PassportStamp,
  PpopPassportAction,
  PpopPassportState,
} from "@/lib/apps/ppoppassport/types";
import styles from "./ppoppassport.module.css";
import { ArtifactIcon } from "@/components/shared/ArtifactIcon";

type PassportBookletPanelProps = {
  state: PpopPassportState;
  dispatch: React.Dispatch<PpopPassportAction>;
  onCollectToast: (stampTitle: string) => void;
};

export function PassportBookletPanel({
  state,
  dispatch,
  onCollectToast,
}: PassportBookletPanelProps) {
  const activeStamp =
    state.stamps.find((s) => s.id === state.selectedStampId) || state.stamps[0];

  const collectedCount = state.stamps.filter((s) => s.isCollected).length;
  const totalCount = state.stamps.length;

  // Stamps are earned at the immigration desk: answer one question about the era.
  const [checkId, setCheckId] = useState<string | null>(null);
  const [wrongAnswer, setWrongAnswer] = useState<string | null>(null);
  const [justStamped, setJustStamped] = useState<string | null>(null);
  const checkStamp = state.stamps.find((s) => s.id === checkId) ?? null;
  const checkQuestion = checkId ? IMMIGRATION_QUESTIONS[checkId] : undefined;

  const handleCollect = (stamp: PassportStamp) => {
    if (!IMMIGRATION_QUESTIONS[stamp.id]) {
      dispatch({ type: "COLLECT_STAMP", stampId: stamp.id });
      onCollectToast(stamp.title);
      return;
    }
    dispatch({ type: "SELECT_STAMP", stampId: stamp.id });
    setWrongAnswer(null);
    setCheckId(stamp.id);
  };

  const answer = (choice: string) => {
    if (!checkStamp || !checkQuestion) return;
    if (choice !== checkQuestion.answer) {
      setWrongAnswer(choice);
      return;
    }
    dispatch({ type: "COLLECT_STAMP", stampId: checkStamp.id });
    onCollectToast(checkStamp.title);
    setJustStamped(checkStamp.id);
    setCheckId(null);
    setWrongAnswer(null);
  };

  return (
    <div
      className={styles.bookletContainer}
      data-testid="passport-booklet-panel"
      data-layout="bento"
      role="document"
      aria-label="Open P-pop cultural passport"
    >
      {/* Left Page: Traveler Identity Certificate */}
      <aside className={styles.idPage}>
        <div className={styles.idCoatOfArms}>
          <div className={styles.republicTitle}>REPUBLIKA NG PILIPINAS</div>
          <div className={styles.passportLabel}>PASAPORTE</div>
          <div style={{ fontSize: "9px", color: "#94a3b8" }}>
            PHILIPPINE POP CULTURAL HERITAGE PASSPORT
          </div>
        </div>

        <div className={styles.idPhotoRow}>
          <ArtifactIcon
            src="/museum/phase-9/priority/ppop-scrapbook.png"
            alt="P-pop cultural exchange scrapbook ephemera"
            fallback="Scrapbook image unavailable"
            size={82}
            className={styles.scrapbookPhoto}
          />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
            <div className={styles.idField}>
              <span>PASSPORT NO.</span>
              <span className={styles.idValue}>PH-PPOP-2000-MUSEUM</span>
            </div>
            <div className={styles.idField}>
              <span>NATIONALITY</span>
              <span className={styles.idValue}>{state.travelerNationality}</span>
            </div>
          </div>
        </div>

        <div className={styles.idField}>
          <label htmlFor="traveler-name-input">TRAVELER / CITIZEN NAME:</label>
          <input
            id="traveler-name-input"
            type="text"
            value={state.travelerName}
            onChange={(e) =>
              dispatch({ type: "SET_TRAVELER_NAME", name: e.target.value })
            }
            className={styles.idInput}
          />
        </div>

        <div className={styles.idField}>
          <span>EXPLORER DESIGNATION</span>
          <span className={styles.idValue}>P-pop Cultural Heritage Delegate</span>
        </div>

        <div className={styles.idField}>
          <span>PASSPORT PROGRESS</span>
          <span className={styles.idValue} style={{ color: "#fbbf24" }}>
            {collectedCount} of {totalCount} Visa Stamps Collected ({Math.round((collectedCount / totalCount) * 100)}%)
          </span>
        </div>

        <button
          type="button"
          onClick={() => dispatch({ type: "RESET_PASSPORT" })}
          className={styles.resetBtn}
        >
          🔄 Reset Visa Stamps
        </button>
      </aside>

      {/* Right Page: Visa Stamp Gallery */}
      <main className={styles.stampsPage}>
        <div className={styles.curatorialTape}>CURATORIAL SCRAPBOOK · RECONSTRUCTION</div>
        <p className={styles.purposeNote}>Collect stamps to trace how imported pop culture was localized into today&apos;s Filipino P-pop identity.</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: "0 0 2px 0", fontSize: "14px", color: "#f59e0b" }}>
              VISAS & CULTURAL STAMPS
            </h3>
            <span style={{ fontSize: "10px", color: "#94a3b8" }}>
              Click a visa stamp to inspect historical context or claim your museum stamp
            </span>
          </div>
          <span className={styles.progressBadge}>
            {collectedCount} / {totalCount} Stamps
          </span>
        </div>

        {checkStamp && checkQuestion && (
          <section className={styles.immigration} aria-label="Immigration check">
            <div className={styles.officer} aria-hidden="true">
              🧑‍✈️
            </div>
            <div className={styles.immigrationBody}>
              <p className={styles.immigrationKicker}>
                IMMIGRATION · {checkStamp.icon} {checkStamp.title}
              </p>
              <p className={styles.immigrationQ}>“{checkQuestion.question}”</p>
              <div className={styles.answerRow}>
                {checkQuestion.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={styles.answerBtn}
                    data-wrong={wrongAnswer === option}
                    onClick={() => answer(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {wrongAnswer && (
                <p className={styles.immigrationHint} role="status">
                  Hmm, check your notes first. Hint: {checkQuestion.hint}
                </p>
              )}
              <button type="button" className={styles.cancelCheck} onClick={() => setCheckId(null)}>
                Not now
              </button>
            </div>
          </section>
        )}

        <div className={styles.stampsGrid} role="listbox" aria-label="Passport stamps">
          {state.stamps.map((stamp) => {
            const isSelected = stamp.id === state.selectedStampId;

            return (
              <div
                key={stamp.id}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                className={`${styles.stampCard} ${isSelected ? styles.stampCardActive : ""} ${stamp.isCollected ? styles.stampCardCollected : ""}`}
                style={{ "--stamp-ink": stamp.accentColor } as React.CSSProperties}
                onClick={() =>
                  dispatch({ type: "SELECT_STAMP", stampId: stamp.id })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    dispatch({ type: "SELECT_STAMP", stampId: stamp.id });
                  }
                }}
              >
                <div className={styles.stampTopRow}>
                  <span className={styles.stampIcon}>{stamp.icon}</span>
                  {stamp.isCollected ? (
                    <span className={styles.srOnlyText}>Collected</span>
                  ) : (
                    <span className={`${styles.stampStatusSeal} ${styles.sealUncollected}`}>NOT YET STAMPED</span>
                  )}
                </div>

                {stamp.isCollected && (
                  <span
                    className={`${styles.inkStamp} ${justStamped === stamp.id ? styles.inkStampFresh : ""}`}
                    aria-hidden="true"
                  >
                    <b>{stamp.icon}</b>
                    ADMITTED
                    <small>{stamp.yearRange}</small>
                  </span>
                )}
                <div className={styles.stampTitle}>{stamp.title}</div>
                <div className={styles.stampMeta}>{stamp.yearRange}</div>
                <div style={{ fontSize: "10px", color: "#38bdf8" }}>{stamp.genre}</div>

                {!stamp.isCollected && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCollect(stamp);
                    }}
                    className={styles.stampCollectBtn}
                  >
                    🔖 Stamp Passport
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Stamp Detailed Drawer */}
        {activeStamp && (
          <div className={styles.stampDetailDrawer} role="region" aria-label="Stamp details">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "13px", fontWeight: 800, color: "#38bdf8" }}>
                {activeStamp.icon} {activeStamp.title} ({activeStamp.yearRange})
              </div>
              <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                Cultural Flow: {activeStamp.originCity}
              </span>
            </div>

            <div style={{ fontSize: "11px", lineHeight: 1.4, color: "#cbd5e1" }}>
              <strong>Curatorial Context & Background:</strong> {activeStamp.historicalFact}
            </div>

            <div style={{ fontSize: "11px", lineHeight: 1.4, color: "#cbd5e1" }}>
              <strong>Cultural Significance (Curatorial Interpretation):</strong> {activeStamp.culturalImpact}
            </div>

            <div
              style={{
                background: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "4px",
                padding: "8px 10px",
                fontSize: "11px",
              }}
            >
              <div style={{ fontWeight: 700, color: "#fbbf24", marginBottom: "2px" }}>
                🎵 Sample Song Archetype: &ldquo;{activeStamp.sampleSongArchetype.title}&rdquo;
              </div>
              <div style={{ color: "#94a3b8" }}>
                Style: {activeStamp.sampleSongArchetype.style} — {activeStamp.sampleSongArchetype.description}
              </div>
            </div>

            {!activeStamp.isCollected && (
              <button
                type="button"
                onClick={() => handleCollect(activeStamp)}
                className={styles.stampCollectBtn}
                style={{ width: "fit-content" }}
              >
                🔖 Stamp This Landmark in My Passport
              </button>
            )}

            <div style={{ fontSize: "10px", color: "#94a3b8", fontStyle: "italic", borderTop: "1px dashed #334155", paddingTop: "6px", marginTop: "4px" }}>
              Educational Reconstruction Notice: Landmark stamps, cultural routes, and musical archetypes are simulated curatorial models illustrating transnational pop flows rather than verified historical facts.
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
