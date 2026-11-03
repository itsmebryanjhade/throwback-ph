"use client";

import React from "react";
import type { Track } from "@/lib/apps/opm/types";
import styles from "./opm.module.css";

interface LinerNotesPanelProps {
  tracks: Track[];
  onSelectTrack: (trackId: string) => void;
}

export const LinerNotesPanel: React.FC<LinerNotesPanelProps> = ({
  tracks,
  onSelectTrack,
}) => {
  return (
    <div className={styles.linerNotesList}>
      <div className={styles.fictionalNotice}>
        <strong>Curatorial Note:</strong> These liner notes contextualize recognizable catalog entries within the real-world music ecology of the mid-2000s Philippines. Local listening copies are included for classroom presentation; lyrics are not reproduced. Referenced door charges reflect period-inspired recollections rather than standardized nationwide historical tariffs.
      </div>

      {tracks.map((track) => (
        <article key={track.id} className={styles.linerNoteCard}>
          <div className={styles.linerNoteHeader}>
            <div>
              <span className={styles.linerNoteTitle}>{track.title}</span>{" "}
              <span className={styles.linerNoteArtist}>— {track.artist}</span>
            </div>
            <span className={styles.linerNoteYear}>{track.year}</span>
          </div>
          <div style={{ fontSize: "11px", color: "#38bdf8", marginBottom: "4px" }}>
            Album: <em>{track.album}</em> • Genre: {track.genre} • Key: {track.musicalKey}
          </div>
          <p className={styles.linerNoteBody}>{track.linerNotes}</p>
          <div
            style={{
              background: "#0f172a",
              padding: "6px 10px",
              borderRadius: "4px",
              fontSize: "11px",
              fontStyle: "italic",
              color: "#94a3b8",
              marginTop: "6px",
            }}
          >
            &ldquo;{track.lyricsExcerpt}&rdquo;
          </div>
          <div style={{ marginTop: "8px", textAlign: "right" }}>
            <button
              type="button"
              style={{
                background: "#0284c7",
                color: "#ffffff",
                border: "none",
                borderRadius: "3px",
                padding: "3px 10px",
                fontSize: "10px",
                fontWeight: 700,
                cursor: "pointer",
              }}
              onClick={() => onSelectTrack(track.id)}
            >
              ▶ Play Track
            </button>
          </div>
        </article>
      ))}

      {/* Cultural Pillars of 2000s Filipino Music */}
      <section className={styles.curatorialBox}>
        <h4>1. NU 107 & The College Radio Wave</h4>
        <p>
          Throughout the 1990s and 2000s, DWNU (NU 107, &ldquo;The Home of New Rock&rdquo;) served as the primary launching pad for Filipino independent and alternative bands. Unlike mainstream pop stations, it highlighted homegrown songwriting, campus demo tapes, and annual rock awards that unified student subcultures across Metro Manila and nearby provinces.
        </p>
      </section>

      <section className={styles.curatorialBox}>
        <h4>2. Nero Burning ROM, MP3s & Burned CD-Rs</h4>
        <p>
          Before streaming platforms, music sharing in Philippine high schools and universities was physical and peer-to-peer. Barkadas passed around 700MB CD-R blanks labeled with black Sharpie markers, containing 128 kbps MP3 files or CD-DA audio tracks burned using Nero Burning ROM. Commuter jeepneys equipped with high-wattage amplifiers blasted these compilations throughout daily transit routes.
        </p>
      </section>

      <section className={styles.curatorialBox}>
        <h4>3. The Campus Gig Circuit & Legendary Venues</h4>
        <p>
          The vitality of mid-2000s OPM depended on live spaces such as Mayric&apos;s along España Boulevard, Club Dredd, 70s Bistro, and the annual UP Fair at Sunken Garden. These gigs brought acoustic acts, pop-punk bands, and rap-rock collectives together before large student crowds paying accessible, student-friendly entrance fees (often period-remembered as modest door charges of around ₱50 to ₱100).
        </p>
      </section>
    </div>
  );
};
