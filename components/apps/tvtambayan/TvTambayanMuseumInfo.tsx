import React from "react";
import { sourceCredits } from "@/content/sources";
import styles from "./tvtambayan.module.css";

export function TvTambayanMuseumInfo() {
  const koficeSource = sourceCredits.find((s) => s.id === "korean-wave");
  const jfmoSource = sourceCredits.find((s) => s.id === "japan-foundation-anime");

  return (
    <div className={styles.museumInfoCard} aria-label="Museum interpretation and citations">
      <h3 className={styles.infoTitle}>
        The Asianovela Craze & Tagalized Television: Global Media in the Filipino Living Room
      </h3>
      <span className={styles.infoYears}>2001–2008 · Globalization Room</span>

      <p className={styles.infoParagraph}>
        Around the turn of the millennium, Philippine broadcast schedules expanded beyond Western programming
        to feature imported Asian television. Through late-1990s afternoon Japanese animation blocks and the
        2003 popularity of Taiwanese drama <em>Meteor Garden</em> alongside subsequent Korean period and modern
        dramas, local viewers widely welcomed serialized Asian narratives.
      </p>

      <div className={styles.infoBlockquote}>
        &ldquo;A central element of this television era was localization. Local dubbing studios and Filipino
        voice actors translated and adapted dialogue into conversational Tagalog, incorporating familiar
        humor and emotional cadence. Tagalization helped foreign productions resonate broadly across
        socioeconomic backgrounds without relying on English subtitles.&rdquo;
      </div>

      <p className={styles.infoParagraph}>
        Television viewing often formed a shared household and neighborhood activity around shared CRT sets.
        Broadcast programming frequently punctuated daily schedules, from after-school anime blocks to
        early-evening dramas and weekend mall variety tours.
      </p>

      <div className={styles.reconstructionNotice}>
        <strong>Educational Reconstruction Notice:</strong> TV Tambayan is an original educational simulation
        created for the ASL Virtual Museum. All television channels (Asianovela Prime, Hapon Anime Block,
        Karaoke Tambayan, Weekend Mall Tour), program titles (such as &ldquo;Pag-ibig sa Tag-ulan&rdquo; and
        &ldquo;Voltech Guardians&rdquo;), character names, voice artist references, broadcast timeslots, and dialogue
        excerpts are fictional period-inspired reconstructions. They are designed to illustrate localization and
        viewing culture without reproducing copyrighted television broadcasts or proprietary network trademarks.
      </div>

      <div style={{ marginTop: "8px", borderTop: "1px solid #3f3f46", paddingTop: "10px" }}>
        <strong style={{ fontSize: "12px", color: "#f4f4f5" }}>Curatorial Citations & Reference Sources:</strong>
        <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0 0", fontSize: "12px" }}>
          {koficeSource && (
            <li style={{ marginBottom: "4px" }}>
              •{" "}
              <a
                href={koficeSource.url}
                target="_blank"
                rel="noreferrer"
                className={styles.sourceLink}
              >
                {koficeSource.title} — {koficeSource.creator}
              </a>
            </li>
          )}
          {jfmoSource && (
            <li>
              •{" "}
              <a
                href={jfmoSource.url}
                target="_blank"
                rel="noreferrer"
                className={styles.sourceLink}
              >
                {jfmoSource.title} — {jfmoSource.creator}
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
