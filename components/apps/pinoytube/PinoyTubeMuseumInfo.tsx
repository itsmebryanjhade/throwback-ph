import React from "react";
import { sourceCredits } from "@/content/sources";
import styles from "./pinoytube.module.css";

export function PinoyTubeMuseumInfo() {
  const ytSource = sourceCredits.find((s) => s.id === "youtube-history");

  return (
    <div className={styles.museumInfoCard} aria-label="Museum interpretation and citations">
      <h3 className={styles.infoTitle}>Grassroots Video & Bedroom Stardom: The Early Web Video Boom</h3>
      <span className={styles.infoYears}>2005–2010 · Performance Room</span>

      <p className={styles.infoParagraph}>
        Between 2005 and 2010, the global expansion of digital video platforms opened a transformative
        chapter in Philippine popular culture. Prior to user-generated web video, musical discovery,
        comedy, and performance stardom were strictly governed by commercial television networks,
        talent managers, and recording studios.
      </p>

      <div className={styles.infoBlockquote}>
        &ldquo;Early web video democratized performance. With a 240p webcam, a digital camera,
        or a phone converted to video, Filipino youth turned bedrooms, school courtyards, and
        neighborhood computer shops into stages. Online audiences circulated grainy dance covers, acoustic
        serenades, and spontaneous parody sketches across dial-up and early broadband connections.&rdquo;
      </div>

      <p className={styles.infoParagraph}>
        Grassroots online sharing opened alternative creative pathways alongside traditional broadcast media.
        Filipino creators shared homemade lip-sync duos, campus dance clips, and acoustic covers, connecting
        directly with peers and communities of interest. Community features—5-star ratings, Friendster shoutouts
        in descriptions, and the patient wait of buffering progress bars—defined a formative chapter of
        participatory web culture in the Philippines.
      </p>

      <div className={styles.reconstructionNotice}>
        <strong>Educational Reconstruction Notice:</strong> PinoyTube is an original educational simulation
        created for the ASL Virtual Museum. All channel names, creator profiles, video titles,
        simulated view counts, 5-star ratings, comment threads, upload sequences, and graphic scenes are
        fictional period-inspired simulation values. The Creator Upload Studio is a metadata-only local
        simulation: no real video is selected, uploaded, transmitted, or converted to FLV. They are designed
        to illustrate mid-2000s web video culture without reproducing trademarked YouTube logos, proprietary
        player software, or copyrighted broadcast media.
      </div>

      <div style={{ marginTop: "8px", borderTop: "1px solid #e2e8f0", paddingTop: "10px" }}>
        <strong style={{ fontSize: "12px", color: "#111111" }}>Curatorial Citations & Reference Sources:</strong>
        <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0 0", fontSize: "12px" }}>
          {ytSource && (
            <li>
              •{" "}
              <a
                href={ytSource.url}
                target="_blank"
                rel="noreferrer"
                className={styles.sourceLink}
              >
                {ytSource.title} — {ytSource.creator}
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
