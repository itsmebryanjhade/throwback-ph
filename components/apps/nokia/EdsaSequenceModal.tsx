import React from "react";
import { EDSA_SEQUENCE_STEPS } from "@/lib/apps/nokia/data";
import styles from "./nokia.module.css";

type EdsaSequenceProps = {
  currentStepIndex: number;
  onSetStep: (index: number) => void;
  onBroadcastToInbox: () => void;
};

export function EdsaSequenceModal({
  currentStepIndex,
  onSetStep,
  onBroadcastToInbox,
}: EdsaSequenceProps) {
  const currentStep = EDSA_SEQUENCE_STEPS[currentStepIndex];

  return (
    <div aria-label="EDSA II historical SMS sequence">
      <div className={styles.edsaHero}>
        <h3 className={styles.edsaHeroTitle}>
          January 16–20, 2001 · The World&rsquo;s First &ldquo;Coup de Text&rdquo;
        </h3>
        <p className={styles.edsaHeroDesc}>
          Explore how a concise SMS forwarded widely helped coordinate protests, as
          thousands gathered rapidly at the EDSA Shrine and crowds grew to more than a million over the following days.
        </p>
        <button
          type="button"
          className={styles.primaryBtn}
          style={{ background: "#ca8a04", borderColor: "#a16207" }}
          onClick={onBroadcastToInbox}
          aria-label="Receive Historical Broadcast in Phone Inbox"
        >
          📥 Receive Historical Broadcast in Phone Inbox
        </button>
      </div>

      <div
        className={`${styles.edsaStepCard} ${
          currentStep.isDirectQuote ? styles.edsaDirectQuote : ""
        }`}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "12px", fontWeight: "bold", color: "#64748b" }}>
            Step {currentStepIndex + 1} of {EDSA_SEQUENCE_STEPS.length} · {currentStep.dateStr}
          </span>
          {currentStep.isDirectQuote ? (
            <span className={styles.quotePill}>★ Widely Reported SMS Wording</span>
          ) : (
            <span
              style={{
                fontSize: "11px",
                background: "#e2e8f0",
                color: "#475569",
                padding: "2px 6px",
                borderRadius: "4px",
                fontWeight: "600",
              }}
            >
              Reconstructed educational context
            </span>
          )}
        </div>

        <div style={{ marginTop: "8px" }}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>
            From: {currentStep.sender}
          </div>
          <div className={styles.edsaMessageText}>&ldquo;{currentStep.body}&rdquo;</div>
        </div>

        <div style={{ marginTop: "10px" }}>
          <strong style={{ fontSize: "12px", color: "#334155", display: "block" }}>
            Curatorial Context:
          </strong>
          <p className={styles.infoParagraph} style={{ marginTop: "4px" }}>
            {currentStep.historicalContext}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          type="button"
          className={styles.secondaryBtn}
          disabled={currentStepIndex === 0}
          onClick={() => onSetStep(Math.max(0, currentStepIndex - 1))}
          aria-label="Previous timeline step"
        >
          ← Previous
        </button>

        <div style={{ display: "flex", gap: "4px" }}>
          {EDSA_SEQUENCE_STEPS.map((step, idx) => (
            <button
              key={step.id}
              type="button"
              className={idx === currentStepIndex ? styles.primaryBtn : styles.secondaryBtn}
              style={{ padding: "4px 8px", fontSize: "11px" }}
              onClick={() => onSetStep(idx)}
              aria-label={`Go to step ${idx + 1}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <button
          type="button"
          className={styles.secondaryBtn}
          disabled={currentStepIndex === EDSA_SEQUENCE_STEPS.length - 1}
          onClick={() => onSetStep(Math.min(EDSA_SEQUENCE_STEPS.length - 1, currentStepIndex + 1))}
          aria-label="Next timeline step"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
