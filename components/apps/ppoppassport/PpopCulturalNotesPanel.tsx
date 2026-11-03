import React from "react";
import { PPOP_CULTURAL_INSIGHTS } from "@/lib/apps/ppoppassport/data";
import styles from "./ppoppassport.module.css";

export function PpopCulturalNotesPanel() {
  return (
    <div className={styles.scrollablePanel}>
      <div>
        <h3 style={{ margin: "0 0 4px 0", fontSize: "15px", color: "#f59e0b" }}>
          💡 Cultural Dynamics of Filipino Pop Identity
        </h3>
        <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>
          Curatorial Essays: Explore how local performers localized global techniques through authentic vocal emotion,
          folkloric movement analogies, and community performance traditions.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
        {PPOP_CULTURAL_INSIGHTS.map((insight) => (
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
