import React from "react";
import { CULTURAL_INSIGHTS } from "@/lib/apps/tvtambayan/data";
import styles from "./tvtambayan.module.css";

export function CulturalNotesPanel() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ background: "#27272a", padding: "10px 14px", borderRadius: "6px", border: "1px solid #3f3f46" }}>
        <h3 style={{ margin: "0 0 4px 0", fontSize: "14px", color: "#38bdf8" }}>
          📺 Globalization, Localization, and the Filipino Living Room
        </h3>
        <p style={{ margin: 0, fontSize: "11px", color: "#a1a1aa", lineHeight: 1.4 }}>
          Explore the cultural dynamics of how imported Asian television transformed Philippine media habits,
          vernacular language, and communal rituals between 2001 and 2008.
        </p>
      </div>

      <div className={styles.cultureGrid}>
        {CULTURAL_INSIGHTS.map((item) => (
          <article key={item.id} className={styles.cultureCard}>
            <h4 className={styles.cultureTitle}>{item.title}</h4>
            <div className={styles.cultureSubtitle}>{item.subtitle}</div>
            <p className={styles.cultureBody}>{item.content}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
