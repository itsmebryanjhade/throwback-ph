import React from "react";
import type { VoteRecord } from "@/lib/apps/realitytv/types";
import styles from "./realitytv.module.css";

type VoteHistoryPanelProps = {
  voteHistory: VoteRecord[];
  onClearHistory: () => void;
};

export function VoteHistoryPanel({
  voteHistory,
  onClearHistory,
}: VoteHistoryPanelProps) {
  const totalVotesCast = voteHistory.reduce((sum, v) => sum + v.voteCount, 0);
  const totalSpent = voteHistory.reduce((sum, v) => sum + v.costPesos, 0);

  return (
    <div className={styles.panelCard} aria-label="Personal SMS voting history log">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h3 className={styles.panelTitle}>
            📜 My Personal SMS Vote History
          </h3>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>
            Record of all simulated SMS votes cast from this device during the current museum session.
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ fontSize: "12px", color: "#c7d2fe" }}>
            Votes Sent: <strong style={{ color: "#38bdf8" }}>{totalVotesCast}</strong> · Load Spent:{" "}
            <strong style={{ color: "#4ade80", fontFamily: "monospace" }}>₱{totalSpent.toFixed(2)}</strong>
          </div>

          {voteHistory.length > 0 && (
            <button
              type="button"
              className={styles.secondaryActionBtn}
              style={{ padding: "4px 8px", fontSize: "11px" }}
              onClick={onClearHistory}
              aria-label="Clear personal voting history"
            >
              Clear Log 🗑
            </button>
          )}
        </div>
      </div>

      {voteHistory.length === 0 ? (
        <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>
          No votes submitted yet. Go to the Vote Desk to cast your vote for a nominated housemate.
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className={styles.dataTable} aria-label="Submitted votes log">
            <thead>
              <tr>
                <th>Time</th>
                <th>Housemate / Nominee</th>
                <th>Keyword Sent</th>
                <th>Votes Cast</th>
                <th>Simulated Cost</th>
                <th>Shortcode</th>
                <th>Network Status</th>
              </tr>
            </thead>
            <tbody>
              {voteHistory.map((vote) => (
                <tr key={vote.id}>
                  <td>{vote.timestamp}</td>
                  <td style={{ fontWeight: "700", color: "#f8fafc" }}>{vote.nomineeName}</td>
                  <td>
                    <code style={{ background: "#0f172a", padding: "2px 6px", borderRadius: "4px", color: "#38bdf8" }}>
                      {vote.keyword}
                    </code>
                  </td>
                  <td style={{ fontWeight: "700" }}>{vote.voteCount} vote{vote.voteCount > 1 ? "s" : ""}</td>
                  <td style={{ fontFamily: "monospace", color: "#4ade80" }}>₱{vote.costPesos.toFixed(2)}</td>
                  <td>{vote.shortcode}</td>
                  <td style={{ color: "#34d399", fontWeight: "600" }}>✓ Confirmed</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ fontSize: "11px", color: "#94a3b8", borderTop: "1px solid #312e81", paddingTop: "10px" }}>
        * All transactions, tariffs (₱2.50/vote), shortcodes (2366), and deductions are fictional period-inspired simulation values. No actual mobile carrier fees, real financial charges, or historical voting data occur.
      </div>
    </div>
  );
}
