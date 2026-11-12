"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./story.module.css";

const SKINS = [
  { id: "glitter", label: "Glitter Pink", bg: "repeating-linear-gradient(45deg,#ffb3d9 0 8px,#ffd1e8 8px 16px)", accent: "#d6247a", text: "#4a0f2b" },
  { id: "emo", label: "Emo Black", bg: "repeating-linear-gradient(90deg,#141414 0 10px,#2a2a2a 10px 20px)", accent: "#c4002b", text: "#f2f2f2" },
  { id: "sky", label: "Sky Blue", bg: "radial-gradient(circle at 20% 20%,#fff 0 6%,transparent 7%),linear-gradient(#7ec8ff,#c8ecff)", accent: "#1d5fbf", text: "#0d2a52" },
  { id: "rakista", label: "Rakista", bg: "repeating-linear-gradient(-45deg,#3b2a1a 0 12px,#5a3b20 12px 24px)", accent: "#f5a623", text: "#fff3dc" },
] as const;

const PENDING = [
  { from: "bea_glam", text: "Super bait nito! Bestfriend ko since grade 4. Add nyo na! :)" },
  { from: "kiko_rakista", text: "Pare, salamat sa pinahiram na CD. Rock on! \\m/" },
  { from: "janine.xoxo", text: "Happy happy birthday!! Miss na kita, comp shop ulit tayo!" },
] as const;

export function ProfileSkinToy() {
  const [skinId, setSkinId] = useState<(typeof SKINS)[number]["id"]>("glitter");
  const [approved, setApproved] = useState<string[]>([]);
  const skin = SKINS.find((candidate) => candidate.id === skinId) ?? SKINS[0];
  const pending = PENDING.filter((testi) => !approved.includes(testi.from));
  const shown = PENDING.filter((testi) => approved.includes(testi.from));

  return (
    <div className={styles.profileToy}>
      <div
        className={styles.miniProfile}
        style={{ background: skin.bg, color: skin.text, "--skin-accent": skin.accent } as React.CSSProperties}
        data-skin={skin.id}
      >
        <div className={styles.miniProfileHead}>
          <div className={styles.miniAvatar}>
            <Image src="/museum/phase-9/images/friendster-kiko.jpg" alt="" fill sizes="64px" style={{ objectFit: "cover", objectPosition: "50% 30%" }} />
          </div>
          <div>
            <strong>Miguel (ASL)</strong>
            <span>Quezon City · Single</span>
            <span className={styles.marquee}>♪ profile song is playing…</span>
          </div>
        </div>
        <div className={styles.miniTestis}>
          <span>Testimonials ({shown.length})</span>
          {shown.length === 0 ? (
            <p>No testimonials yet. Approve one below!</p>
          ) : (
            shown.map((testi) => (
              <p key={testi.from}>
                <b>{testi.from}:</b> {testi.text}
              </p>
            ))
          )}
        </div>
      </div>

      <div className={styles.profileControls}>
        <fieldset className={styles.skinPicker}>
          <legend>Profile skin</legend>
          {SKINS.map((option) => (
            <label key={option.id} data-checked={option.id === skinId}>
              <input
                type="radio"
                name="profile-skin"
                value={option.id}
                checked={option.id === skinId}
                onChange={() => setSkinId(option.id)}
              />
              <span className={styles.skinSwatch} style={{ background: option.bg }} aria-hidden="true" />
              {option.label}
            </label>
          ))}
        </fieldset>

        <div className={styles.pendingTestis}>
          <p>Pending testimonials ({pending.length})</p>
          {pending.length === 0 ? (
            <p className={styles.allDone}>All approved. Your page looks popular!</p>
          ) : (
            pending.map((testi) => (
              <div key={testi.from} className={styles.pendingItem}>
                <span>
                  <b>{testi.from}</b> wrote a testimonial
                </span>
                <button type="button" onClick={() => setApproved((list) => [...list, testi.from])}>
                  Approve
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
