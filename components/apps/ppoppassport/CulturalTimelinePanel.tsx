import React from "react";
import type {
  PpopPassportAction,
  PpopPassportState,
} from "@/lib/apps/ppoppassport/types";
import styles from "./ppoppassport.module.css";

type CulturalTimelinePanelProps = {
  state: PpopPassportState;
  dispatch: React.Dispatch<PpopPassportAction>;
};

export function CulturalTimelinePanel({ state }: CulturalTimelinePanelProps) {
  return (
    <div className={styles.scrollablePanel}>
      <div>
        <h3 style={{ margin: "0 0 4px 0", fontSize: "15px", color: "#f59e0b" }}>
          ⏳ Chronological Evolution: From Street Dance to Global P-pop
        </h3>
        <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>
          Curatorial Interpretation: Explore the chronological stages and educational musical archetypes illustrating the development of modern Philippine pop.
        </p>
      </div>

      <div className={styles.timelineGrid}>
        {state.stamps.map((stamp, idx) => (
          <article
            key={stamp.id}
            className={styles.timelineCard}
            style={{ borderLeftColor: stamp.accentColor }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "20px" }}>{stamp.icon}</span>
                <div>
                  <h4 style={{ margin: 0, fontSize: "13px", color: "#f8fafc" }}>
                    Stage {idx + 1}: {stamp.title}
                  </h4>
                  <span style={{ fontSize: "10px", color: "#f59e0b" }}>
                    {stamp.yearRange} · {stamp.genre}
                  </span>
                </div>
              </div>
              <span
                style={{
                  fontSize: "10px",
                  color: "#94a3b8",
                  background: "#0f172a",
                  padding: "2px 8px",
                  borderRadius: "4px",
                }}
              >
                Context: {stamp.originCity}
              </span>
            </div>

            <p style={{ fontSize: "11px", color: "#cbd5e1", margin: 0, lineHeight: 1.4 }}>
              {stamp.historicalFact}
            </p>

            <div className={styles.archetypeBox}>
              <strong style={{ color: "#38bdf8" }}>
                Representative Musical Archetype (Simulation):
              </strong>{" "}
              &ldquo;{stamp.sampleSongArchetype.title}&rdquo; — {stamp.sampleSongArchetype.style}.{" "}
              <em>{stamp.sampleSongArchetype.description}</em>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
