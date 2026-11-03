import React from "react";
import styles from "./realitytv.module.css";

export function TvImpactPanel() {
  const PILLARS = [
    {
      icon: "📱",
      title: "The Micro-Democracy of Text Voting",
      desc: "Through premium SMS services (simulated here with a fictional period-inspired tariff of ₱2.50 per text to shortcode 2366), viewers experienced participatory influence over television programming. Fans were no longer passive spectators; audience voting directly influenced who stayed on screen, democratizing who could attain nationwide celebrity.",
    },
    {
      icon: "👥",
      title: "The Rise of 'Text Brigades'",
      desc: "Fans formed organized grassroots 'tropa' networks, pooling their school allowances and wages to purchase prepaid scratch cards. Fandoms coordinated bulk text blitzes during critical voting windows before lines closed on eviction nights.",
    },
    {
      icon: "💰",
      title: "Televoting & Value-Added Services",
      desc: "Mobile carrier partnerships with television networks created high-margin value-added service (VAS) revenue streams. The Philippines' widespread mobile phone adoption helped finance interactive, high-engagement entertainment formats.",
    },
    {
      icon: "🌟",
      title: "From Studio Panels to Audience Arbiters",
      desc: "Traditional talent competitions relied on austere industry judges in formal suits. Reality TV inverted this authority: everyday working-class audiences rewarded authenticity, underdog narratives, and regional pride over studio-curated perfection.",
    },
  ];

  return (
    <div className={styles.panelCard} aria-label="Media impact analysis of Philippine reality TV">
      <div>
        <h3 className={styles.panelTitle}>
          📺 How Mobile Voting Transformed Philippine Television
        </h3>
        <span style={{ fontSize: "12px", color: "#94a3b8" }}>
          Explore the cultural, economic, and technological shifts driven by audience text participation in the mid-2000s.
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
        {PILLARS.map((p) => (
          <div
            key={p.title}
            style={{
              background: "#1e1b4b",
              border: "1px solid #3730a3",
              borderRadius: "6px",
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "20px" }}>{p.icon}</span>
              <strong style={{ fontSize: "13px", color: "#f8fafc" }}>{p.title}</strong>
            </div>
            <p style={{ margin: 0, fontSize: "11px", color: "#cbd5e1", lineHeight: 1.5 }}>
              {p.desc}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "rgba(49, 46, 129, 0.4)",
          border: "1px solid #6366f1",
          borderRadius: "6px",
          padding: "12px 14px",
          fontSize: "12px",
          color: "#c7d2fe",
          lineHeight: 1.5,
        }}
      >
        <strong>Curatorial Note:</strong> In 2005, the premiere of Pinoy Big Brother highlighted a major shift toward participatory entertainment in Philippine broadcast media, demonstrating how cellular connectivity and television could merge into an interactive communal spectacle. All vote totals, standings, ₱2.50 tariffs, and 2366 shortcode interactions shown in this exhibit are fictional period-inspired simulation values.
      </div>
    </div>
  );
}
