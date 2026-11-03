import React, { useState } from "react";
import type { CafeActivity, Terminal } from "@/lib/apps/netcafe/types";
import { TerminalCard } from "./TerminalCard";
import styles from "./netcafe.module.css";

type TerminalListProps = {
  terminals: Terminal[];
  activities: CafeActivity[];
  selectedTerminalId: string | null;
  isTimerRunning: boolean;
  onSelectTerminal: (terminalId: string) => void;
  onOpenSession: (terminalId: string) => void;
  onSimulateTimePass: (minutes: number) => void;
  onToggleTimer: (isRunning: boolean) => void;
};

export function TerminalList({
  terminals,
  activities,
  selectedTerminalId,
  isTimerRunning,
  onSelectTerminal,
  onOpenSession,
  onSimulateTimePass,
  onToggleTimer,
}: TerminalListProps) {
  const [filter, setFilter] = useState<"all" | "available" | "occupied">("all");

  const availableCount = terminals.filter((t) => t.status === "available").length;
  const occupiedCount = terminals.filter((t) => t.status === "occupied" || t.status === "expired" || t.status === "paused").length;

  const filteredTerminals = terminals.filter((t) => {
    if (filter === "available") return t.status === "available";
    if (filter === "occupied") return t.status !== "available";
    return true;
  });

  return (
    <section className={styles.floorMap} aria-label="Computer shop floor map">
      <div className={styles.floorMapHeading}>
        <div>
          <strong>Terminal floor map</strong>
          <span>Cashier view · choose a numbered station</span>
        </div>
        <span>{availableCount} available · {occupiedCount} active</span>
      </div>
      {/* Simulation Control Bar for Deterministic Timer Testing */}
      <div className={styles.simBar}>
        <div className={styles.simLabel}>
          ⏱ Deterministic Time Controls:{" "}
          <span style={{ color: isTimerRunning ? "#4ade80" : "#fbbf24" }}>
            {isTimerRunning ? "Live Real-Time Active (1s/s)" : "Paused"}
          </span>
        </div>

        <div className={styles.simButtonGroup}>
          <button
            type="button"
            className={styles.simBtn}
            onClick={() => onSimulateTimePass(5)}
            aria-label="Advance simulated time by 5 minutes"
          >
            ⏩ +5 Mins
          </button>
          <button
            type="button"
            className={styles.simBtn}
            onClick={() => onSimulateTimePass(15)}
            aria-label="Advance simulated time by 15 minutes"
          >
            ⏩ +15 Mins
          </button>
          <button
            type="button"
            className={styles.simBtn}
            onClick={() => onSimulateTimePass(30)}
            aria-label="Advance simulated time by 30 minutes"
          >
            ⏩ +30 Mins
          </button>
          <button
            type="button"
            className={styles.simBtn}
            onClick={() => onToggleTimer(!isTimerRunning)}
            aria-label={isTimerRunning ? "Pause background timer" : "Resume background timer"}
          >
            {isTimerRunning ? "⏸ Pause Clock" : "▶ Resume Clock"}
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            type="button"
            className={filter === "all" ? styles.actionBtn : styles.secondaryActionBtn}
            style={{ padding: "4px 10px", fontSize: "11px" }}
            onClick={() => setFilter("all")}
          >
            All Terminals ({terminals.length})
          </button>
          <button
            type="button"
            className={filter === "available" ? styles.actionBtn : styles.secondaryActionBtn}
            style={{ padding: "4px 10px", fontSize: "11px" }}
            onClick={() => setFilter("available")}
          >
            Available ({availableCount})
          </button>
          <button
            type="button"
            className={filter === "occupied" ? styles.actionBtn : styles.secondaryActionBtn}
            style={{ padding: "4px 10px", fontSize: "11px" }}
            onClick={() => setFilter("occupied")}
          >
            Occupied ({occupiedCount})
          </button>
        </div>

        <span style={{ fontSize: "11px", color: "#94a3b8" }}>
          Click any PC to inspect, start session, or extend time.
        </span>
      </div>

      {/* Terminal Cards Grid */}
      <div className={styles.terminalGrid}>
        {filteredTerminals.map((term) => (
          <TerminalCard
            key={term.id}
            terminal={term}
            activities={activities}
            isSelected={term.id === selectedTerminalId}
            onSelect={onSelectTerminal}
            onOpenSession={onOpenSession}
          />
        ))}
      </div>
    </section>
  );
}
