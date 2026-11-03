import React from "react";
import { sourceCredits } from "@/content/sources";
import styles from "./nokia.module.css";

export function NokiaMuseumInfo() {
  const ituSource = sourceCredits.find((s) => s.id === "itu-philippines");
  const edsaSource = sourceCredits.find((s) => s.id === "edsa-text");
  const cidobSource = sourceCredits.find((s) => s.id === "cidob-text-revolution");

  return (
    <div className={styles.infoCard} aria-label="Museum interpretation and citations">
      <h3 className={styles.infoTitle}>Nokia & SMS Culture in the Philippines</h3>
      <span className={styles.infoYears}>2000–2010</span>

      <p className={styles.infoParagraph}>
        At the turn of the millennium, mobile phones exploded across the Philippines. While
        fixed-line telephone penetration had remained low due to infrastructural costs,
        prepaid cellular SIM cards and affordable sachet-priced reload cards democratized
        telecommunications overnight.
      </p>

      <div className={styles.infoBlockquote}>
        &ldquo;During the early 2000s, rapid prepaid mobile adoption and millions of daily SMS
        transmissions transformed the Philippines into an internationally recognized texting hub,
        where short messaging became a vital medium for social connection, daily life, and civic
        coordination.&rdquo;
      </div>

      <p className={styles.infoParagraph}>
        SMS shaped distinct cultural rituals: the daily &ldquo;GM&rdquo; (Group Message) sent
        to one&rsquo;s entire barkada, the emergence of SMS text clans, playful ASCII picture
        messages, and the historic civic mobilization during EDSA II in January 2001.
      </p>

      <div className={styles.reconstructionNotice}>
        <strong>Educational Reconstruction Notice:</strong> This software is an educational
        historical museum artifact developed for Throwback PH. It recreates early-2000s
        candy-bar cellular phone interaction patterns (such as multi-tap keypad entry and
        monophonic beeps) without using any proprietary Nokia logos, copyrighted ringtone
        recordings, or brand-trademarked interfaces.
      </div>

      <div style={{ marginTop: "12px", borderTop: "1px solid #cbd5e1", paddingTop: "10px" }}>
        <strong style={{ fontSize: "12px", color: "#1e293b" }}>Curatorial Citations & Research Sources:</strong>
        <ul className={styles.sourceList}>
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
          {edsaSource && (
            <li>
              •{" "}
              <a
                href={edsaSource.url}
                target="_blank"
                rel="noreferrer"
                className={styles.sourceLink}
              >
                {edsaSource.title} — {edsaSource.creator}
              </a>
            </li>
          )}
          {cidobSource && (
            <li>
              •{" "}
              <a
                href={cidobSource.url}
                target="_blank"
                rel="noreferrer"
                className={styles.sourceLink}
              >
                {cidobSource.title} — {cidobSource.creator}
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
