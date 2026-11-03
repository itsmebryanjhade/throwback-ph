import React from "react";
import { sourceCredits } from "@/content/sources";
import styles from "./chatarchives.module.css";

export function ChatArchivesMuseumInfo() {
  const ymSource = sourceCredits.find((s) => s.id === "yahoo-messenger");
  const mircSource = sourceCredits.find((s) => s.id === "mirc-history");

  return (
    <div className={styles.scrollablePanel}>
      <div className={styles.museumCard} aria-label="Museum interpretation and citations">
        <h3 className={styles.museumTitle}>
          Instant Presence & Global Barkadas: The Early Filipino Chat Era
        </h3>
        <span className={styles.museumYears}>2000–2008 · Globalization Room</span>

        <p style={{ fontSize: "12px", lineHeight: 1.5, color: "#334155", margin: 0 }}>
          At the dawn of the 21st century, the rise of desktop instant messaging transformed how Filipinos
          communicated across physical boundaries. Before algorithmic social feeds, synchronous chat tools—principally
          mIRC in the late 1990s and Yahoo! Messenger in the 2000s—established online identity through custom
          nicknames, presence indicators, text emoticons, and screen-shaking BUZZ alerts.
        </p>

        <div className={styles.museumBlockquote}>
          &ldquo;Instant messaging opened a virtual tambayan for Filipino youth. In neighborhood computer shops
          and campus computer labs, students balanced Friendster browsing with fast-paced Yahoo Messenger banter
          and multi-city mIRC chat channels. For many transnational families with Overseas Filipino Workers (OFWs),
          these platforms provided an accessible, affordable communication channel alongside international calling cards and SMS.&rdquo;
        </div>

        <p style={{ fontSize: "12px", lineHeight: 1.5, color: "#334155", margin: 0 }}>
          Chat platforms nurtured distinctive linguistic codes: Taglish abbreviations, ASCII art, and status lines
          broadcasting Winamp playlists. Synchronous presence turned digital spaces into living communal rooms,
          paving the way for contemporary social networks.
        </p>

        <div className={styles.reconstructionNotice}>
          <strong>Educational Reconstruction Notice:</strong> Chat Archives is an original educational simulation
          created for the Throwback PH Virtual Museum. All usernames, contact lists, channel logs, status messages,
          conversation threads, and interface themes are fictional period-inspired simulation values. Chat transcripts,
          BUZZ interactions, and community recollections are educational reconstructions illustrating 2000s cyberculture
          rather than verified transcripts or proprietary Yahoo! and mIRC software assets.
        </div>

        <div style={{ marginTop: "8px", borderTop: "1px solid #cbd5e1", paddingTop: "10px" }}>
          <strong style={{ fontSize: "12px", color: "#1e293b" }}>Curatorial Citations & Reference Sources:</strong>
          <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0 0", fontSize: "12px" }}>
            {ymSource && (
              <li style={{ marginBottom: "4px" }}>
                •{" "}
                <a
                  href={ymSource.url}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.sourceLink}
                >
                  {ymSource.title} — {ymSource.creator}
                </a>
              </li>
            )}
            {mircSource && (
              <li>
                •{" "}
                <a
                  href={mircSource.url}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.sourceLink}
                >
                  {mircSource.title} — {mircSource.creator}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
