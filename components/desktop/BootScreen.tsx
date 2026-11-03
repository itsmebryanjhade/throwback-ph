"use client";

import { useEffect } from "react";
import Image from "next/image";
import styles from "./desktop.module.css";

type BootScreenProps = {
  onFinish: () => void;
  onSkip: () => void;
  durationMs?: number;
};

export function BootScreen({ onFinish, onSkip, durationMs = 2500 }: BootScreenProps) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onFinish();
      return;
    }
    const timer = window.setTimeout(onFinish, durationMs);
    return () => window.clearTimeout(timer);
  }, [durationMs, onFinish]);

  return (
    <section className={styles.boot} aria-label="Throwback PH is starting">
      <div className={styles.bootComposition}>
        <div className={styles.bootMark} aria-hidden="true">
          <span>THROW</span>
          <span>BACK</span>
          <span>PH</span>
        </div>
        <div className={styles.bootObjects} aria-label="Four objects from the Filipino 2000s">
          <Image className={styles.bootObject} src="/museum/boot-txt.png" width={320} height={320} alt="A candy-bar mobile phone interface with one new text message" priority />
          <Image className={styles.bootObject} src="/museum/boot-www.png" width={320} height={320} alt="An early social profile interface with testimonials" priority />
          <Image className={styles.bootObject} src="/museum/boot-opm.png" width={320} height={320} alt="A portable OPM music player interface" priority />
          <Image className={styles.bootObject} src="/museum/boot-buzz.png" width={320} height={320} alt="An instant messenger interface showing an online status" priority />
        </div>
      </div>
      <p>Loading Philippine pop culture, 2000–2010…</p>
      <div className={styles.loadingTrack} aria-hidden="true"><span /></div>
      <button className={styles.skipBoot} type="button" onClick={onSkip}>Skip intro</button>
    </section>
  );
}
