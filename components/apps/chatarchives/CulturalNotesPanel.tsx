import React from "react";
import { CHAT_CULTURAL_INSIGHTS } from "@/lib/apps/chatarchives/data";
import styles from "./chatarchives.module.css";

export function CulturalNotesPanel() {
  return (
    <div className={styles.scrollablePanel}>
      <div style={{ marginBottom: "6px" }}>
        <h3 style={{ margin: "0 0 4px 0", fontSize: "15px", color: "#4c1d95" }}>
          💡 Early Cyber Culture & Filipino Online Communities
        </h3>
        <p style={{ margin: 0, fontSize: "11px", color: "#64748b" }}>
          Examine how early internet messaging reshaped youth socializing, digital language,
          and transnational family connections across the Philippines.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
        {CHAT_CULTURAL_INSIGHTS.map((insight) => (
          <article key={insight.id} className={styles.insightCard}>
            <h4 className={styles.insightTitle}>{insight.title}</h4>
            <div className={styles.insightSub}>{insight.subtitle}</div>
            <p className={styles.insightText}>{insight.content}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
