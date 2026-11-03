import React from "react";
import type { CafeActivity, Terminal } from "@/lib/apps/netcafe/types";
import styles from "./netcafe.module.css";

type TerminalCardProps = {
  terminal: Terminal;
  activities: CafeActivity[];
  isSelected: boolean;
  onSelect: (terminalId: string) => void;
  onOpenSession: (terminalId: string) => void;
};

export function formatTimeRemaining(totalSeconds: number): string {
  if (totalSeconds <= 0) return "00:00:00 (Time Up)";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function TerminalCard({
  terminal,
  activities,
  isSelected,
  onSelect,
  onOpenSession,
}: TerminalCardProps) {
  const isOccupied = !!terminal.session;
  const remaining = terminal.session?.remainingSeconds ?? 0;
  const isLowTime = isOccupied && remaining > 0 && remaining <= 300;
  const isExpired = terminal.status === "expired" || (isOccupied && remaining === 0);
  const isPaused = terminal.status === "paused";

  const activity = activities.find((a) => a.id === terminal.session?.activityId);

  const getStatusClass = () => {
    if (isExpired) return styles.statusExpired;
    if (isLowTime) return styles.statusLowTime;
    if (isPaused) return styles.statusPaused;
    if (isOccupied) return styles.statusOccupied;
    return styles.statusAvailable;
  };

  const getStatusText = () => {
    if (isExpired) return "Locked / Expired";
    if (isLowTime) return "⚠️ Low Time (<5m)";
    if (isPaused) return "Paused";
    if (isOccupied) return "In Use";
    return "Available";
  };

  return (
    <div
      className={`${styles.terminalCard} ${isSelected ? styles.terminalCardSelected : ""} ${
        isLowTime ? styles.terminalCardLowTime : ""
      } ${isExpired ? styles.terminalCardExpired : ""}`}
      aria-label={`${terminal.name}: ${getStatusText()}`}
    >
      <div className={styles.terminalHeader}>
        <span className={styles.terminalNumber}>{terminal.name}</span>
        <span className={`${styles.terminalStatusBadge} ${getStatusClass()}`}>
          {getStatusText()}
        </span>
      </div>

      <div className={styles.terminalSpecs}>
        <strong>{terminal.osName}</strong> · {terminal.specs}
      </div>

      <div className={styles.screenPreviewBox}>
        {isOccupied ? (
          <>
            <div
              className={`${styles.timerDisplay} ${isLowTime ? styles.timerLow : ""} ${
                isExpired ? styles.timerExpired : ""
              }`}
            >
              {formatTimeRemaining(remaining)}
            </div>
            <div className={styles.userLabel}>User: {terminal.session?.customerName}</div>
            <div className={styles.activityLabel}>
              {activity ? `${activity.icon} ${activity.name}` : "General Surfing"}
            </div>
          </>
        ) : (
          <div style={{ color: "#4ade80", fontSize: "12px", fontWeight: "600" }}>
            Ready for rental · Fictional sim rates: ₱15/30m, ₱20/hr
          </div>
        )}
      </div>

      <div className={styles.cardFooter}>
        <button
          type="button"
          className={isSelected ? styles.actionBtn : styles.secondaryActionBtn}
          onClick={() => onSelect(terminal.id)}
          aria-label={`Select ${terminal.name}`}
        >
          {isSelected ? "Selected ✓" : "Select PC"}
        </button>

        <button
          type="button"
          className={styles.actionBtn}
          onClick={() => {
            onSelect(terminal.id);
            onOpenSession(terminal.id);
          }}
          aria-label={isOccupied ? `Manage Session for ${terminal.name}` : `Start Session on ${terminal.name}`}
        >
          {isOccupied ? "Manage ⚙" : "Rent PC ⚡"}
        </button>
      </div>
    </div>
  );
}
