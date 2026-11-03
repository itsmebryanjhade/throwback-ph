import React from "react";
import { sourceCredits } from "@/content/sources";
import styles from "./opm.module.css";

export function OpmMuseumInfo() {
  const popularMusicSource = sourceCredits.find((s) => s.id === "ncca-popular-music");
  const pinoyRockSource = sourceCredits.find((s) => s.id === "ncca-pinoy-rock");

  return (
    <div
      style={{
        background: "#181c24",
        border: "1px solid #334155",
        borderRadius: "6px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
      aria-label="Museum interpretation and citations"
    >
      <div style={{ borderBottom: "1px solid #2d3748", paddingBottom: "8px" }}>
        <h3 style={{ margin: "0 0 4px", fontSize: "16px", color: "#38bdf8" }}>
          Original Pilipino Music (OPM) & The 2000s Band Explosion
        </h3>
        <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600 }}>
          2000–2008 · Pinoy Rock, Acoustic Pop & Digital Subcultures
        </span>
      </div>

      <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.6", color: "#cbd5e1" }}>
        The mid-2000s marked a golden resurgence for Original Pilipino Music (OPM). Following the foundation laid by 1990s pioneers, a new wave of campus bands, acoustic acts, and underground rock collectives emerged. Propelled by youth-centric radio programming like DWNU (NU 107), campus battle of the bands showcases, and grass-roots word-of-mouth, Filipino alternative music became the ubiquitous soundtrack of student life.
      </p>

      <blockquote
        style={{
          margin: 0,
          padding: "10px 14px",
          background: "#0f172a",
          borderLeft: "4px solid #38bdf8",
          fontStyle: "italic",
          fontSize: "12px",
          lineHeight: "1.5",
          color: "#94a3b8",
        }}
      >
        &ldquo;The early-2000s OPM explosion bridged physical campus culture with digital sharing. Long before streaming algorithms, barkadas discovered songs on college radio, shared burned CD-Rs scribbled with marker, and crowded into small smoke-filled gig venues to sing every lyric in unison.&rdquo;
      </blockquote>

      <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.6", color: "#cbd5e1" }}>
        Desktop media players such as Winamp and Windows Media Player allowed fans to digitize their collections into MP3s, tag track information, and marvel at reactive visualizers. This digital shift coincided with jeepney audio upgrades, karaoke culture, and the widespread democratization of home recording, enabling independent musicians to record raw demos that could quickly capture nationwide resonance.
      </p>

      <div className={styles.fictionalNotice}>
        <strong>Educational Reconstruction Notice:</strong> This interactive application is an original educational museum recreation designed to illustrate early-2000s desktop audio software and Philippine youth music culture. All band names, track titles, album names, lyrics, and synthesized sound frequencies are original fictional representations created specifically for this exhibit. Any referenced door charges or gig recollections reflect period-inspired memories rather than standardized historical tariffs. No copyrighted commercial recordings, master tapes, or trademarked media player assets are reproduced.
      </div>

      <div style={{ marginTop: "4px", borderTop: "1px solid #2d3748", paddingTop: "10px" }}>
        <strong style={{ fontSize: "12px", color: "#f8fafc" }}>Curatorial Citations & Research Sources:</strong>
        <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0 0", fontSize: "12px" }}>
          {popularMusicSource && (
            <li style={{ marginBottom: "6px" }}>
              •{" "}
              <a
                href={popularMusicSource.url}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#38bdf8", textDecoration: "underline" }}
              >
                {popularMusicSource.title} — {popularMusicSource.creator}
              </a>
            </li>
          )}
          {pinoyRockSource && (
            <li>
              •{" "}
              <a
                href={pinoyRockSource.url}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#38bdf8", textDecoration: "underline" }}
              >
                {pinoyRockSource.title} — {pinoyRockSource.creator}
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
