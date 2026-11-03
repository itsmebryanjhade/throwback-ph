import React from "react";
import type { Nominee } from "@/lib/apps/realitytv/types";
import styles from "./realitytv.module.css";

type LiveStandingsPanelProps = {
  nominees: Nominee[];
  totalVotes: number;
  onSimulateSurge: () => void;
  onSelectNominee: (id: string) => void;
};

export function LiveStandingsPanel({
  nominees,
  totalVotes,
  onSimulateSurge,
  onSelectNominee,
}: LiveStandingsPanelProps) {
  // Sort nominees by votes descending
  const sortedNominees = [...nominees].sort((a, b) => b.currentVotes - a.currentVotes);

  return (
    <div className={styles.panelCard} aria-label="Live reality TV voting standings">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h3 className={styles.panelTitle}>
            📊 Official Televoting Standings & Danger Zone
          </h3>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>
            Simulated percentage breakdown. All vote tallies, standings, and eviction risks are fictional period-inspired simulation values.
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ fontSize: "12px", color: "#a5b4fc" }}>
            Total Simulated Votes: <strong style={{ color: "#38bdf8", fontFamily: "monospace" }}>{totalVotes.toLocaleString()}</strong>
          </div>

          <button
            type="button"
            className={styles.actionBtn}
            onClick={onSimulateSurge}
            aria-label="Simulate incoming crowd surge votes"
          >
            ⚡ Simulate Crowd Surge
          </button>
        </div>
      </div>

      {/* Standings List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {sortedNominees.map((nom, index) => {
          const percentage = totalVotes > 0 ? (nom.currentVotes / totalVotes) * 100 : 0;
          const isLowestNominated = nom.status === "nominated" && nom.evictionRisk === "endangered";
          const isModerateRisk = nom.status === "nominated" && nom.evictionRisk === "moderate";

          return (
            <div key={nom.id} className={styles.standingRow} style={{ borderLeft: `4px solid ${nom.colorAccent}` }}>
              <div className={styles.standingHeader}>
                <div className={styles.standingNominee}>
                  <span style={{ color: "#94a3b8", width: "20px" }}>#{index + 1}</span>
                  <span style={{ fontSize: "18px" }}>{nom.avatarIcon}</span>
                  <div>
                    <span style={{ color: "#f8fafc" }}>{nom.name}</span>
                    <span style={{ fontSize: "11px", color: "#a5b4fc", marginLeft: "6px" }}>
                      ({nom.nickname})
                    </span>
                  </div>

                  {nom.status === "immune" ? (
                    <span className={`${styles.statusPill} ${styles.statusImmune}`}>
                      🛡️ Immune
                    </span>
                  ) : nom.status === "safe" ? (
                    <span className={`${styles.statusPill} ${styles.statusSafe}`}>
                      ✓ Safe
                    </span>
                  ) : isLowestNominated ? (
                    <span className={`${styles.statusPill} ${styles.statusNominated}`}>
                      🚨 In Danger of Eviction
                    </span>
                  ) : isModerateRisk ? (
                    <span className={`${styles.statusPill}`} style={{ background: "rgba(245, 158, 11, 0.2)", color: "#fbbf24", border: "1px solid #f59e0b" }}>
                      ⚠️ Moderate Risk
                    </span>
                  ) : (
                    <span className={`${styles.statusPill} ${styles.statusSafe}`}>
                      Nominated
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ textAlign: "right" }}>
                    <span className={styles.standingPercentage} style={{ color: nom.colorAccent }}>
                      {percentage.toFixed(1)}%
                    </span>
                    <div style={{ fontSize: "10px", color: "#64748b" }}>
                      {nom.currentVotes.toLocaleString()} votes
                    </div>
                  </div>

                  {nom.status === "nominated" && (
                    <button
                      type="button"
                      className={styles.secondaryActionBtn}
                      style={{ padding: "4px 8px", fontSize: "11px" }}
                      onClick={() => onSelectNominee(nom.id)}
                      aria-label={`Vote for ${nom.name}`}
                    >
                      Vote 🗳
                    </button>
                  )}
                </div>
              </div>

              {/* Visual Percentage Bar */}
              <div className={styles.progressBarTrack} role="progressbar" aria-valuenow={Math.round(percentage)} aria-valuemin={0} aria-valuemax={100} aria-label={`${nom.name} vote percentage`}>
                <div
                  className={styles.progressBarFill}
                  style={{
                    width: `${Math.min(100, Math.max(2, percentage))}%`,
                    background: nom.colorAccent,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: "11px", color: "#94a3b8", textAlign: "center", borderTop: "1px solid #312e81", paddingTop: "10px" }}>
        * All vote tallies, rankings, and percentages are fictional period-inspired simulation values generated for museum exploration.
      </div>
    </div>
  );
}
