import React from "react";
import type { CompletedSession } from "@/lib/apps/netcafe/types";
import styles from "./netcafe.module.css";

type SessionHistoryPanelProps = {
  completedSessions: CompletedSession[];
  cashierRegister: {
    cashOnHand: number;
    totalSessionRevenue: number;
    totalPrintRevenue: number;
    totalSnackRevenue: number;
  };
};

export function SessionHistoryPanel({
  completedSessions,
  cashierRegister,
}: SessionHistoryPanelProps) {
  return (
    <div className={styles.panelCard} aria-label="Computer shop billing and session history">
      {/* Till Financial Summary */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h3 className={styles.panelTitle}>📜 Cashier Ledger & Session Receipts</h3>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>
            Shift record of completed rentals, snacks, and print transactions (fictional period-inspired simulation values).
          </span>
        </div>

        <div className={styles.tillBadgeArea}>
          <div className={styles.tillBadge}>
            <span>Session Rentals:</span>
            <span className={styles.cashAmount}>₱{cashierRegister.totalSessionRevenue.toFixed(2)}</span>
          </div>
          <div className={styles.tillBadge}>
            <span>Snacks:</span>
            <span className={styles.cashAmount}>₱{cashierRegister.totalSnackRevenue.toFixed(2)}</span>
          </div>
          <div className={styles.tillBadge}>
            <span>Prints:</span>
            <span className={styles.cashAmount}>₱{cashierRegister.totalPrintRevenue.toFixed(2)}</span>
          </div>
          <div className={styles.tillBadge} style={{ borderColor: "#4ade80", background: "#052e16" }}>
            <span>Total Till Cash:</span>
            <span className={styles.cashAmount} style={{ fontSize: "14px" }}>
              ₱{cashierRegister.cashOnHand.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Receipts Table */}
      {completedSessions.length === 0 ? (
        <div style={{ padding: "24px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>
          No completed sessions recorded yet. Start and check out a session from the Terminals tab.
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className={styles.dataTable} aria-label="Completed sessions log">
            <thead>
              <tr>
                <th>Receipt ID</th>
                <th>Time</th>
                <th>Terminal</th>
                <th>Customer</th>
                <th>Duration</th>
                <th>Primary Activity</th>
                <th>Session Fee</th>
                <th>Snacks</th>
                <th>Prints</th>
                <th>Total Paid</th>
              </tr>
            </thead>
            <tbody>
              {completedSessions.map((sess) => (
                <tr key={sess.id}>
                  <td style={{ fontFamily: "monospace", fontSize: "11px" }}>{sess.id.slice(-8)}</td>
                  <td>{sess.completedAt}</td>
                  <td style={{ fontWeight: "700" }}>{sess.terminalName}</td>
                  <td>{sess.customerName}</td>
                  <td>{sess.durationMinutes} mins</td>
                  <td style={{ color: "#38bdf8" }}>{sess.activityName}</td>
                  <td style={{ fontFamily: "monospace" }}>₱{sess.sessionCostPesos.toFixed(2)}</td>
                  <td style={{ fontFamily: "monospace" }}>
                    {sess.snackCostPesos > 0 ? `₱${sess.snackCostPesos.toFixed(2)}` : "—"}
                  </td>
                  <td style={{ fontFamily: "monospace" }}>
                    {sess.printCostPesos > 0 ? `₱${sess.printCostPesos.toFixed(2)}` : "—"}
                  </td>
                  <td style={{ fontWeight: "800", color: "#4ade80", fontFamily: "monospace" }}>
                    ₱{sess.totalBillPesos.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
