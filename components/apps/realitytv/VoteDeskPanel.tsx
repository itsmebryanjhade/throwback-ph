import React from "react";
import type { Nominee } from "@/lib/apps/realitytv/types";
import { NomineePortrait } from "./NomineePortrait";
import { NomineeCard } from "./NomineeCard";
import styles from "./realitytv.module.css";

type VoteDeskPanelProps = {
  nominees: Nominee[];
  selectedNomineeId: string | null;
  prepaidLoad: number;
  costPerVote: number;
  shortcode: string;
  totalVotes: number;
  onSelectNominee: (id: string) => void;
  onCastVote: (nomineeId: string, count: number) => void;
  onReloadPrepaid: (amount: number) => void;
  onNavigateToStandings: () => void;
};

export function VoteDeskPanel({
  nominees,
  selectedNomineeId,
  prepaidLoad,
  costPerVote,
  shortcode,
  totalVotes,
  onSelectNominee,
  onCastVote,
  onReloadPrepaid,
  onNavigateToStandings,
}: VoteDeskPanelProps) {
  const currentNominee =
    nominees.find((n) => n.id === selectedNomineeId) || nominees[0];
  const isNominated = currentNominee.status === "nominated";
  const percentage =
    totalVotes > 0
      ? ((currentNominee.currentVotes / totalVotes) * 100).toFixed(1)
      : "0.0";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }} aria-label="Reality TV SMS voting console">
      {/* Educational Simulation Notice */}
      <div
        style={{
          background: "#1e1b4b",
          border: "1px solid #4338ca",
          borderRadius: "6px",
          padding: "8px 12px",
          fontSize: "11px",
          color: "#c7d2fe",
          lineHeight: 1.4,
        }}
      >
        <strong>Educational Simulation Notice:</strong> Shortcode {shortcode}, the simulated ₱{costPerVote.toFixed(2)} tariff per vote, housemate profiles, vote counts, and standings are fictional period-inspired simulation values.
      </div>

      {/* Broadcast Alert Banner */}
      <div
        style={{
          background: "linear-gradient(90deg, #1e1b4b 0%, #312e81 100%)",
          border: "1px solid #4338ca",
          borderRadius: "8px",
          padding: "12px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className={styles.liveDot} aria-hidden="true" />
            <strong style={{ fontSize: "14px", color: "#f8fafc" }}>
              WEEK 7 EVICTION NIGHT IS LIVE!
            </strong>
          </div>
          <div style={{ fontSize: "12px", color: "#cbd5e1", marginTop: "2px" }}>
            Voting lines are OPEN in this educational simulation. Send your favorite housemate&apos;s keyword to fictional shortcode{" "}
            <strong style={{ color: "#38bdf8" }}>{shortcode}</strong> to simulate saving them from elimination.
          </div>
        </div>

        <button
          type="button"
          className={styles.secondaryActionBtn}
          onClick={onNavigateToStandings}
          aria-label="View live percentage standings"
        >
          📊 Live Standings ({percentage}%)
        </button>
      </div>

      {/* Selected Housemate Voting Console */}
      <div className={styles.panelCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div
              className={styles.avatarBox}
              style={{ width: "64px", height: "80px", fontSize: "28px", borderColor: currentNominee.colorAccent }}
            >
              <NomineePortrait nominee={currentNominee} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "#f8fafc" }}>
                  {currentNominee.name} ({currentNominee.nickname})
                </h3>
                <span
                  className={`${styles.statusPill} ${
                    currentNominee.status === "nominated"
                      ? styles.statusNominated
                      : currentNominee.status === "immune"
                      ? styles.statusImmune
                      : styles.statusSafe
                  }`}
                >
                  {currentNominee.status === "nominated"
                    ? "Nominated"
                    : currentNominee.status === "immune"
                    ? "Immune"
                    : "Safe"}
                </span>
              </div>
              <div style={{ fontSize: "12px", color: "#a5b4fc", marginTop: "2px" }}>
                {currentNominee.hometown} · Age {currentNominee.age} · {currentNominee.archetype}
              </div>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "11px", color: "#94a3b8" }}>Simulated Prepaid Balance:</div>
            <div style={{ fontSize: "15px", fontWeight: "800", color: "#38bdf8", fontFamily: "monospace" }}>
              ₱{prepaidLoad.toFixed(2)}
            </div>
            <button
              type="button"
              className={styles.secondaryActionBtn}
              style={{ padding: "3px 8px", fontSize: "11px", marginTop: "4px" }}
              onClick={() => onReloadPrepaid(30)}
              aria-label="Reload prepaid balance by 30 pesos"
            >
              + ₱30 Scratch Card
            </button>
          </div>
        </div>

        <p style={{ margin: 0, fontSize: "12px", color: "#cbd5e1", lineHeight: 1.5 }}>
          {currentNominee.bio}
        </p>

        {/* Voting Action Section */}
        <div
          style={{
            background: "#1e1b4b",
            border: "2px solid #3730a3",
            borderRadius: "6px",
            padding: "14px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#e0e7ff" }}>
                📱 Cast SMS Vote for {currentNominee.name}:
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                Text <strong style={{ color: "#f8fafc" }}>{currentNominee.voteKeyword}</strong> and send to{" "}
                <strong style={{ color: "#38bdf8" }}>{shortcode}</strong> (₱{costPerVote.toFixed(2)} / vote · Fictional period-inspired simulation values).
              </div>
            </div>

            <div style={{ fontSize: "12px", color: "#a5b4fc", fontFamily: "monospace" }}>
              Current: <strong>{currentNominee.currentVotes.toLocaleString()}</strong> votes ({percentage}%)
            </div>
          </div>

          {isNominated ? (
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "4px" }}>
              <button
                type="button"
                className={styles.actionBtn}
                style={{ flex: 1, padding: "10px" }}
                disabled={prepaidLoad < costPerVote}
                onClick={() => onCastVote(currentNominee.id, 1)}
                aria-label={`Cast 1 vote for ${currentNominee.name} costing 2.50 pesos`}
              >
                🗳 Cast 1 Vote (₱{costPerVote.toFixed(2)})
              </button>

              <button
                type="button"
                className={styles.actionBtn}
                style={{ flex: 1, padding: "10px", background: "linear-gradient(180deg, #8b5cf6 0%, #6d28d9 100%)", borderColor: "#a78bfa" }}
                disabled={prepaidLoad < costPerVote * 5}
                onClick={() => onCastVote(currentNominee.id, 5)}
                aria-label={`Cast 5 votes for ${currentNominee.name} costing 12.50 pesos`}
              >
                ⚡ 5 Votes (₱{(costPerVote * 5).toFixed(2)})
              </button>

              <button
                type="button"
                className={styles.actionBtn}
                style={{ flex: 1, padding: "10px", background: "linear-gradient(180deg, #ec4899 0%, #be185d 100%)", borderColor: "#f472b6" }}
                disabled={prepaidLoad < costPerVote * 10}
                onClick={() => onCastVote(currentNominee.id, 10)}
                aria-label={`Cast 10 votes for ${currentNominee.name} costing 25.00 pesos`}
              >
                🔥 10 Votes (₱{(costPerVote * 10).toFixed(2)})
              </button>
            </div>
          ) : (
            <div
              style={{
                padding: "10px",
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid #10b981",
                borderRadius: "6px",
                color: "#34d399",
                fontSize: "12px",
                textAlign: "center",
              }}
            >
              ✓ {currentNominee.name} is not nominated for eviction this week. Voting is only active for nominated housemates.
            </div>
          )}

          {prepaidLoad < costPerVote && (
            <div style={{ fontSize: "11px", color: "#f87171", textAlign: "center" }}>
              ⚠️ Insufficient prepaid balance. Click &ldquo;+ ₱30 Scratch Card&rdquo; above to reload simulated load.
            </div>
          )}
        </div>
      </div>

      {/* Housemate Fleet Cards */}
      <div>
        <div className={styles.nomineeGridHeader}>
          <h4 style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#e0e7ff" }}>
            All Housemates & Nominees ({nominees.length}):
          </h4>
          <span style={{ fontSize: "11px", color: "#94a3b8" }}>
            Click any nominee card to view details or cast votes.
          </span>
        </div>

        <div className={styles.nomineeGrid}>
          {nominees.map((nom) => (
            <NomineeCard
              key={nom.id}
              nominee={nom}
              isSelected={nom.id === currentNominee.id}
              totalVotes={totalVotes}
              onSelect={onSelectNominee}
              onQuickVote={(id) => {
                onSelectNominee(id);
                onCastVote(id, 1);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
