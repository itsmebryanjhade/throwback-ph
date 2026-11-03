import React from "react";
import { sourceCredits } from "@/content/sources";
import styles from "./ppoppassport.module.css";

export function PpopMuseumInfo() {
  const ppopSource = sourceCredits.find((s) => s.id === "p-pop");
  const nccaSource = sourceCredits.find((s) => s.id === "ncca-popular-music");
  const salesSource = sourceCredits.find((s) => s.id === "korean-wave");

  return (
    <div className={styles.scrollablePanel}>
      <div className={styles.museumCard} aria-label="Museum interpretation and citations">
        <h3 className={styles.museumTitle}>
          Transnational Rhythms & Local Identity: The Genesis of P-pop
        </h3>
        <span className={styles.museumYears}>2000–2010+ · Globalization Room</span>

        <p style={{ fontSize: "12px", lineHeight: 1.5, color: "#cbd5e1", margin: 0 }}>
          The emergence of modern Philippine Pop (P-pop) reflects a dynamic process of transnational cultural
          exchange. Throughout the late 1990s and 2000s, Filipino performers engaged deeply with regional and global
          influences—from American breakdancing and 1990s Manila dance troupes to Taiwanese Mandopop OSTs and
          early Korean idol formats.
        </p>

        <div className={styles.museumBlockquote}>
          &ldquo;Curatorial Interpretation: Rather than passively consuming foreign pop models, Filipino artists adapted them to local
          sensibilities. By pairing group synchronization with traditional vocal passion, Kundiman-influenced emotive delivery,
          and choreographic analogies to folk traditions, the Philippines developed a vibrant vernacular pop culture that informed
          the contemporary P-pop movement.&rdquo;
        </div>

        <p style={{ fontSize: "12px", lineHeight: 1.5, color: "#cbd5e1", margin: 0 }}>
          This cultural passport documents how transnational dialogue sparked homegrown innovation, illustrating
          how localization in the Philippines operated as a creative cycle of reinterpretation and artistic growth.
        </p>

        <div className={styles.reconstructionNotice}>
          <strong>Educational Reconstruction Notice:</strong> P-pop Passport is an original educational
          simulation created for the Throwback PH Virtual Museum. All passport graphics, visa stamps, cultural
          trails, musical archetypes, artist references, and influence routes are fictional period-inspired educational
          reconstructions representing curatorial interpretations rather than verified historical facts. They are designed
          to illustrate cultural exchange without reproducing copyrighted music, lyrics, sound recordings, trademarked
          agency logos, or celebrity likenesses.
        </div>

        <div style={{ marginTop: "8px", borderTop: "1px solid #334155", paddingTop: "10px" }}>
          <strong style={{ fontSize: "12px", color: "#f8fafc" }}>Curatorial Citations & Reference Sources:</strong>
          <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0 0", fontSize: "12px" }}>
            {ppopSource && (
              <li style={{ marginBottom: "4px" }}>
                •{" "}
                <a
                  href={ppopSource.url}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.sourceLink}
                >
                  {ppopSource.title} — {ppopSource.creator}
                </a>
              </li>
            )}
            {nccaSource && (
              <li style={{ marginBottom: "4px" }}>
                •{" "}
                <a
                  href={nccaSource.url}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.sourceLink}
                >
                  {nccaSource.title} — {nccaSource.creator}
                </a>
              </li>
            )}
            {salesSource && (
              <li>
                •{" "}
                <a
                  href={salesSource.url}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.sourceLink}
                >
                  {salesSource.title} — {salesSource.creator}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
