import React from "react";
import { sourceCredits } from "@/content/sources";
import styles from "./realitytv.module.css";

export function RealityTvMuseumInfo() {
  const pbbSource = sourceCredits.find((s) => s.id === "pbb-history");

  return (
    <div className={styles.museumInfoCard} aria-label="Museum interpretation and citations">
      <h3 className={styles.infoTitle}>Reality TV Voting & Mobile Democracy in the Philippines</h3>
      <span className={styles.infoYears}>2005–2010 · Participatory Television</span>

      <p className={styles.infoParagraph}>
        In the mid-2000s, the arrival of franchise reality television—most prominently demonstrated by{" "}
        <em>Pinoy Big Brother</em> (2005)—fundamentally changed how Filipinos consumed media. By harnessing
        the country&apos;s widespread adoption of SMS, television networks transformed viewers from passive
        living-room observers into active decision-makers.
      </p>

      <div className={styles.infoBlockquote}>
        &ldquo;Televoting turned celebrity culture into a participatory drama. Through premium SMS participation
        (represented in this simulation with a fictional period-inspired ₱2.50 tariff and shortcode 2366),
        viewers felt their vote could save a humble underdog, evict an antagonist, or launch a housemate
        into national stardom.&rdquo;
      </div>

      <p className={styles.infoParagraph}>
        The cultural ritual of eviction nights brought households, school barkadas, and online fan communities together.
        Passionate voting brigades pooled prepaid load, monitored vote percentages, and created grassroots campaigns
        that foreshadowed modern digital fandom ecosystems and social media engagement.
      </p>

      <div className={styles.reconstructionNotice}>
        <strong>Educational Reconstruction Notice:</strong> This application is an original educational simulation created
        for the ASL Virtual Museum. All program formats (&ldquo;Star Quest Pilipinas&rdquo;), contestant profiles,
        hometowns, biographies, voting keywords, the 2366 shortcode, the simulated ₱2.50 vote fee, standings, vote tallies,
        and eviction outcomes are fictional period-inspired simulation values. They are not presented as historical voting data,
        real television network records, or actual telecommunication service tariffs. No copyrighted broadcast footage or
        trademarked reality show logos are reproduced.
      </div>

      <div style={{ marginTop: "8px", borderTop: "1px solid #312e81", paddingTop: "10px" }}>
        <strong style={{ fontSize: "12px", color: "#f8fafc" }}>Curatorial Citations & Research Sources:</strong>
        <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0 0", fontSize: "12px" }}>
          {pbbSource && (
            <li>
              •{" "}
              <a
                href={pbbSource.url}
                target="_blank"
                rel="noreferrer"
                className={styles.sourceLink}
              >
                {pbbSource.title} — {pbbSource.creator}
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
