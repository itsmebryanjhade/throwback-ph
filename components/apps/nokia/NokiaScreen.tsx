import React from "react";
import type { PhoneProfile } from "@/lib/apps/nokia/types";
import styles from "./nokia.module.css";

type NokiaScreenProps = {
  title: string;
  phoneProfile: PhoneProfile;
  balance: number;
  simProvider: string;
  children: React.ReactNode;
};

export function NokiaScreen({
  title,
  phoneProfile,
  balance,
  simProvider,
  children,
}: NokiaScreenProps) {
  const profileIcon =
    phoneProfile === "silent" ? "📳" : phoneProfile === "meeting" ? "🔇" : "🔔";

  return (
    <div className={styles.screenBezel} aria-label="Nokia phone screen" data-testid="nokia-lcd">
      <div className={styles.lcdScreen}>
        <div className={styles.lcdStatusBar}>
          <div className={styles.lcdStatusItem}>
            <span>📶</span>
            <span>{simProvider.toUpperCase()}</span>
          </div>
          <div className={styles.lcdStatusItem}>
            <span title={`Profile: ${phoneProfile}`}>{profileIcon}</span>
            <span>₱{balance.toFixed(2)}</span>
            <span>🔋</span>
          </div>
        </div>

        <div className={styles.lcdBody}>
          <h2 className={styles.lcdTitle}>{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}
