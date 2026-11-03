import React from "react";
import { sourceCredits } from "@/content/sources";
import styles from "./netcafe.module.css";

export function NetCafeMuseumInfo() {
  const ituSource = sourceCredits.find((s) => s.id === "itu-philippines");

  return (
    <div className={styles.museumInfoCard} aria-label="Museum interpretation and citations">
      <h3 className={styles.infoTitle}>Computer Shops & Cybercafé Culture in the Philippines</h3>
      <span className={styles.infoYears}>1998–2010+ · Cybercafé Era</span>

      <p className={styles.infoParagraph}>
        Before ubiquitous home fiber broadband and smartphones, the internet was experienced
        collectively in the Philippines. Neighborhood &ldquo;comp shops&rdquo; and mall chains like
        Netopia bridged the infrastructural gap, democratizing access to computing and the World
        Wide Web.
      </p>

      <div className={styles.infoBlockquote}>
        &ldquo;Sachet-priced access—where students and workers could rent a terminal in flexible
        fractions of an hour—transformed computer shops into communal digital
        classrooms, multiplayer gaming arenas, and social tambayans.&rdquo;
      </div>

      <p className={styles.infoParagraph}>
        The computer shop gave rise to iconic Filipino youth rituals: barkada LAN matches of
        Defense of the Ancients (Dota) and Counter-Strike, marathon Ragnarok Online leveling
        grinds, instant noodles (Pancit Canton) ordered directly to the keyboard, and rush printing
        of school research papers.
      </p>

      <div className={styles.reconstructionNotice}>
        <strong>Educational Reconstruction Notice:</strong> This application is an original
        educational simulation created for the Throwback PH Virtual Museum. All computer shop
        tariffs, extension rates, canteen snack costs, and printing fees are fictional
        period-inspired simulation values and are not presented as sourced nationwide historical
        averages. All computer terminals, customer sessions, gamer tags, customer names, and
        branded product references (such as instant noodles, soft drinks, snacks, and games)
        are fictional dramatizations designed for cultural context and educational illustration
        without using proprietary cybercafé software code or copyrighted assets.
      </div>

      <div style={{ marginTop: "8px", borderTop: "1px solid #334155", paddingTop: "10px" }}>
        <strong style={{ fontSize: "12px", color: "#f8fafc" }}>Curatorial Citations & Research Sources:</strong>
        <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0 0", fontSize: "12px" }}>
          {ituSource && (
            <li>
              •{" "}
              <a
                href={ituSource.url}
                target="_blank"
                rel="noreferrer"
                className={styles.sourceLink}
              >
                {ituSource.title} — {ituSource.creator}
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
