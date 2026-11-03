import React from "react";
import type { Nominee } from "@/lib/apps/realitytv/types";
import { NomineePortrait } from "./NomineePortrait";
import styles from "./realitytv.module.css";

type NomineeCardProps = {
  nominee: Nominee;
  isSelected: boolean;
  totalVotes: number;
  onSelect: (nomineeId: string) => void;
  onQuickVote: (nomineeId: string) => void;
};

export function NomineeCard({
  nominee,
  isSelected,
  totalVotes,
  onSelect,
  onQuickVote,
}: NomineeCardProps) {
  const percentage = totalVotes > 0 ? ((nominee.currentVotes / totalVotes) * 100).toFixed(1) : "0.0";
  const isNominated = nominee.status === "nominated";
  const isImmune = nominee.status === "immune";

  const getStatusClass = () => {
    if (isNominated) return styles.statusNominated;
    if (isImmune) return styles.statusImmune;
    return styles.statusSafe;
  };

  const getStatusLabel = () => {
    if (isNominated) return "⚠️ Nominated for Eviction";
    if (isImmune) return "🛡️ Immune from Eviction";
    return "✓ Safe This Week";
  };

  return (
    <div
      className={`${styles.nomineeCard} ${isSelected ? styles.nomineeCardSelected : ""}`}
      style={{ borderLeftColor: nominee.colorAccent }}
      aria-label={`${nominee.name}: ${getStatusLabel()}`}
    >
      <div className={styles.nomineeHeader}>
        <div className={styles.avatarBox}>
          <NomineePortrait nominee={nominee} />
        </div>
        <div className={styles.nomineeMeta}>
          <div className={styles.nomineeName}>{nominee.name}</div>
          <div className={styles.nomineeTagline}>
            {nominee.hometown} · Age {nominee.age}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className={`${styles.statusPill} ${getStatusClass()}`}>
          {getStatusLabel()}
        </span>
        <span style={{ fontSize: "11px", fontWeight: "700", color: nominee.colorAccent, fontFamily: "monospace" }}>
          {percentage}%
        </span>
      </div>

      <div style={{ fontSize: "11px", color: "#cbd5e1", lineHeight: 1.4, minHeight: "44px" }}>
        <strong>{nominee.archetype}</strong>: {nominee.tagline}. {nominee.bio.slice(0, 75)}...
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #312e81", paddingTop: "8px", marginTop: "auto" }}>
        <div style={{ fontSize: "11px", color: "#94a3b8" }}>
          SMS Keyword: <strong style={{ color: "#f8fafc" }}>{nominee.voteKeyword}</strong>
        </div>
        <span style={{ fontSize: "10px", color: "#64748b" }}>
          {nominee.currentVotes.toLocaleString()} votes
        </span>
      </div>

      <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
        <button
          type="button"
          className={isSelected ? styles.actionBtn : styles.secondaryActionBtn}
          style={{ flex: 1, padding: "6px", fontSize: "11px" }}
          onClick={() => onSelect(nominee.id)}
          aria-label={`Select ${nominee.name}`}
        >
          {isSelected ? "Selected ✓" : "View Profile"}
        </button>

        {isNominated && (
          <button
            type="button"
            className={styles.actionBtn}
            style={{ flex: 1, padding: "6px", fontSize: "11px", background: "linear-gradient(180deg, #f43f5e 0%, #be123c 100%)", borderColor: "#f43f5e" }}
            onClick={() => onQuickVote(nominee.id)}
            aria-label={`Vote to Save ${nominee.nickname}`}
          >
            Vote to Save 🗳
          </button>
        )}
      </div>
    </div>
  );
}
