import React, { useState } from "react";
import type {
  CafeActivity,
  PrintJob,
  SessionTariff,
  SnackItem,
  Terminal,
} from "@/lib/apps/netcafe/types";
import { formatTimeRemaining } from "./TerminalCard";
import styles from "./netcafe.module.css";

type ActiveSessionPanelProps = {
  terminals: Terminal[];
  selectedTerminalId: string | null;
  tariffs: SessionTariff[];
  activities: CafeActivity[];
  snacks: SnackItem[];
  printJobs?: PrintJob[];
  onSelectTerminal: (terminalId: string) => void;
  onStartSession: (
    terminalId: string,
    customerName: string,
    tariffId: string,
    activityId: string,
  ) => void;
  onExtendSession: (
    terminalId: string,
    additionalMinutes: number,
    costPesos: number,
  ) => void;
  onChangeActivity: (terminalId: string, activityId: string) => void;
  onOrderSnack: (terminalId: string, snack: SnackItem) => void;
  onPauseSession: (terminalId: string) => void;
  onResumeSession: (terminalId: string) => void;
  onEndSession: (terminalId: string) => void;
  onDismissWarning: (terminalId: string) => void;
  onFastForwardLowTime?: (terminalId: string) => void;
};

export function ActiveSessionPanel({
  terminals,
  selectedTerminalId,
  tariffs,
  activities,
  snacks,
  printJobs = [],
  onSelectTerminal,
  onStartSession,
  onExtendSession,
  onChangeActivity,
  onOrderSnack,
  onPauseSession,
  onResumeSession,
  onEndSession,
  onDismissWarning,
}: ActiveSessionPanelProps) {
  const currentTerminal =
    terminals.find((t) => t.id === selectedTerminalId) || terminals[0];

  // New rental form state
  const [customerName, setCustomerName] = useState("Player_1");
  const [selectedTariffId, setSelectedTariffId] = useState(tariffs[1]?.id || tariffs[0]?.id);
  const [selectedActivityId, setSelectedActivityId] = useState(activities[0]?.id || "");

  const session = currentTerminal.session;
  const isOccupied = !!session;
  const remaining = session?.remainingSeconds ?? 0;
  const isLowTime = isOccupied && remaining > 0 && remaining <= 300;
  const isExpired = currentTerminal.status === "expired" || (isOccupied && remaining === 0);
  const isPaused = currentTerminal.status === "paused";

  const handleStartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartSession(
      currentTerminal.id,
      customerName,
      selectedTariffId,
      selectedActivityId,
    );
  };

  const currentActivity = activities.find((a) => a.id === session?.activityId);
  const sessionPrints = printJobs.filter((pj) => session?.printJobIds?.includes(pj.id));
  const printTotal = sessionPrints.reduce((sum, pj) => sum + pj.costPesos, 0);
  const snacksTotal = session?.snacks.reduce((sum, s) => sum + s.pricePesos, 0) ?? 0;
  const currentBillTotal = (session?.sessionFeePesos ?? 0) + snacksTotal + printTotal;

  return (
    <div className={styles.panelCard} aria-label="Terminal session management">
      {/* Terminal Picker Dropdown */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #334155", paddingBottom: "10px" }}>
        <div>
          <span style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", fontWeight: "700" }}>
            Active Desk Focus:
          </span>
          <div style={{ fontSize: "16px", fontWeight: "800", color: "#f8fafc" }}>
            {currentTerminal.name} ({currentTerminal.osName})
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label htmlFor="terminal-switcher" style={{ fontSize: "12px", color: "#94a3b8" }}>
            Switch PC:
          </label>
          <select
            id="terminal-switcher"
            className={styles.formSelect}
            value={currentTerminal.id}
            onChange={(e) => onSelectTerminal(e.target.value)}
            aria-label="Switch selected terminal"
          >
            {terminals.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} [{t.status.toUpperCase()}]
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Available Terminal: New Rental Form */}
      {!isOccupied && (
        <form onSubmit={handleStartSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ fontSize: "14px", fontWeight: "700", color: "#4ade80" }}>
            ⚡ Terminal is Available · Start New Rental Session
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="customer-name-input">
              Customer Name / Gamer Tag:
            </label>
            <input
              id="customer-name-input"
              type="text"
              className={styles.formInput}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Kuya_Mark, DotaMaster, Bea"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Select Session Tariff & Rate{" "}
              <span style={{ fontSize: "11px", fontWeight: "normal", color: "#94a3b8" }}>
                (Fictional period-inspired simulation values)
              </span>:
            </label>
            <div className={styles.tariffGrid} role="radiogroup" aria-label="Session Tariffs">
              {tariffs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  aria-checked={selectedTariffId === t.id}
                  className={`${styles.tariffCard} ${
                    selectedTariffId === t.id ? styles.tariffCardSelected : ""
                  }`}
                  onClick={() => setSelectedTariffId(t.id)}
                >
                  <div className={styles.tariffName}>{t.name}</div>
                  <div className={styles.tariffPrice}>₱{t.pricePesos.toFixed(2)}</div>
                  <div className={styles.tariffDesc}>{t.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="activity-select">
              Primary Starting Activity:
            </label>
            <select
              id="activity-select"
              className={styles.formSelect}
              value={selectedActivityId}
              onChange={(e) => setSelectedActivityId(e.target.value)}
            >
              {activities.map((act) => (
                <option key={act.id} value={act.id}>
                  {act.icon} {act.name} ({act.genre})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className={styles.actionBtn}
            style={{ padding: "10px", fontSize: "14px", marginTop: "6px" }}
            aria-label={`Confirm Rental & Start Session on ${currentTerminal.name}`}
          >
            ✓ Confirm Rental & Start Session on {currentTerminal.name}
          </button>
        </form>
      )}

      {/* Occupied / Expired Terminal: Active Session Monitoring */}
      {isOccupied && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Low-time or expired warning alert */}
          {isExpired ? (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid #ef4444",
                borderRadius: "6px",
                padding: "10px 14px",
                color: "#f87171",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>🔒 Time Expired — Terminal Locked</strong>
                <div style={{ fontSize: "12px", marginTop: "2px" }}>
                  Customer has run out of prepaid time. Please extend session or checkout.
                </div>
              </div>
            </div>
          ) : isLowTime ? (
            <div className={styles.warningBanner}>
              <div>
                <strong>⚠️ Low-Time Warning (&lt; 5 Minutes Left)</strong>
                <div style={{ fontSize: "12px", marginTop: "2px" }}>
                  Tell customer to save game progress or add time at the counter.
                </div>
              </div>
              {!session?.lowTimeWarned && (
                <button
                  type="button"
                  className={styles.simBtn}
                  onClick={() => onDismissWarning(currentTerminal.id)}
                  aria-label="Acknowledge low time warning"
                >
                  Dismiss Alert
                </button>
              )}
            </div>
          ) : null}

          {/* Large Digital Timer & Customer Info */}
          <div
            style={{
              background: "#090d16",
              border: "1px solid #334155",
              borderRadius: "8px",
              padding: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <span style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>
                Remaining Session Time:
              </span>
              <div
                className={`${styles.timerDisplay} ${isLowTime ? styles.timerLow : ""} ${
                  isExpired ? styles.timerExpired : ""
                }`}
                style={{ fontSize: "28px" }}
              >
                {formatTimeRemaining(remaining)}
              </div>
              <div style={{ fontSize: "12px", color: "#cbd5e1", marginTop: "4px" }}>
                Status:{" "}
                <span style={{ fontWeight: "700", color: isExpired ? "#f87171" : "#38bdf8" }}>
                  {isPaused ? "PAUSED" : isExpired ? "LOCKED (TIME OUT)" : "ACTIVE"}
                </span>
                {" · Started at: "}
                {session?.startTime}
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#f8fafc" }}>
                User: {session?.customerName}
              </div>
              <div style={{ fontSize: "12px", color: "#38bdf8" }}>
                {currentActivity ? `${currentActivity.icon} ${currentActivity.name}` : "General"}
              </div>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#4ade80", marginTop: "4px", fontFamily: "monospace" }}>
                Current Bill: ₱{currentBillTotal.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Time Extension Controls */}
          <div>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "#f1f5f9", marginBottom: "6px" }}>
              ⏱ Add / Extend Prepaid Time{" "}
              <span style={{ fontSize: "11px", fontWeight: "normal", color: "#94a3b8" }}>
                (Fictional period-inspired simulation values)
              </span>:
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                type="button"
                className={styles.secondaryActionBtn}
                onClick={() => onExtendSession(currentTerminal.id, 30, 15)}
                aria-label="Add 30 minutes for 15 pesos"
              >
                +30 Mins (₱15.00)
              </button>
              <button
                type="button"
                className={styles.secondaryActionBtn}
                onClick={() => onExtendSession(currentTerminal.id, 60, 20)}
                aria-label="Add 1 hour for 20 pesos"
              >
                +1 Hour (₱20.00)
              </button>
              <button
                type="button"
                className={styles.secondaryActionBtn}
                onClick={() => onExtendSession(currentTerminal.id, 120, 35)}
                aria-label="Add 2 hours for 35 pesos"
              >
                +2 Hours (₱35.00)
              </button>
            </div>
          </div>

          {/* Switch Activity */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="change-activity-select">
              Switch Game / Desktop Activity:
            </label>
            <select
              id="change-activity-select"
              className={styles.formSelect}
              value={session?.activityId}
              onChange={(e) => onChangeActivity(currentTerminal.id, e.target.value)}
              aria-label="Switch game or desktop activity"
            >
              {activities.map((act) => (
                <option key={act.id} value={act.id}>
                  {act.icon} {act.name}
                </option>
              ))}
            </select>
          </div>

          {/* Canteen & Snacks Section */}
          <div>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "#f1f5f9", marginBottom: "6px" }}>
              🍜 Order Canteen Snacks & Drinks to PC{" "}
              <span style={{ fontSize: "11px", fontWeight: "normal", color: "#94a3b8" }}>
                (Fictional period-inspired simulation values)
              </span>:
            </div>
            <div className={styles.snackGrid}>
              {snacks.map((snk) => (
                <button
                  key={snk.id}
                  type="button"
                  className={styles.snackBtn}
                  onClick={() => onOrderSnack(currentTerminal.id, snk)}
                  aria-label={`Order ${snk.name} for ${snk.pricePesos} pesos`}
                >
                  <span className={styles.snackIcon}>{snk.icon}</span>
                  <span className={styles.snackName}>{snk.name}</span>
                  <span className={styles.snackPrice}>₱{snk.pricePesos.toFixed(2)}</span>
                </button>
              ))}
            </div>

            {session && session.snacks.length > 0 && (
              <div style={{ marginTop: "8px", fontSize: "11px", color: "#cbd5e1" }}>
                <strong>Ordered Items ({session.snacks.length}): </strong>
                {session.snacks.map((s, idx) => (
                  <span key={idx}>
                    {s.name} (₱{s.pricePesos}){idx < session.snacks.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            )}

            {session && sessionPrints.length > 0 && (
              <div style={{ marginTop: "6px", fontSize: "11px", color: "#93c5fd" }}>
                <strong>Linked Network Prints ({sessionPrints.length}): </strong>
                {sessionPrints.map((p, idx) => (
                  <span key={p.id}>
                    {p.documentName} (₱{p.costPesos.toFixed(2)}){idx < sessionPrints.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Session Footer Control Buttons */}
          <div style={{ display: "flex", gap: "10px", marginTop: "10px", borderTop: "1px solid #334155", paddingTop: "14px" }}>
            {isPaused ? (
              <button
                type="button"
                className={styles.secondaryActionBtn}
                style={{ flex: 1 }}
                onClick={() => onResumeSession(currentTerminal.id)}
                aria-label={`Resume session for ${currentTerminal.name}`}
              >
                ▶ Resume Session
              </button>
            ) : (
              <button
                type="button"
                className={styles.secondaryActionBtn}
                style={{ flex: 1 }}
                onClick={() => onPauseSession(currentTerminal.id)}
                aria-label={`Pause session for ${currentTerminal.name}`}
              >
                ⏸ Pause Session
              </button>
            )}

            <button
              type="button"
              className={styles.actionBtn}
              style={{ flex: 2, background: "#dc2626" }}
              onClick={() => onEndSession(currentTerminal.id)}
              aria-label={`End session and checkout for ${currentTerminal.name}`}
            >
              🔒 End Session & Checkout (₱{currentBillTotal.toFixed(2)})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
