import type { ReactNode } from "react";
import styles from "./desktop.module.css";

type DesktopIconProps = {
  label: string;
  glyph: ReactNode;
  onOpen: () => void;
  ariaLabel?: string;
  /** Tooltip shown on hover, like the XP "info tip". */
  tip?: string;
};

export function DesktopIcon({ label, glyph, onOpen, ariaLabel, tip }: DesktopIconProps) {
  return (
    <button
      className={styles.desktopIcon}
      type="button"
      onClick={onOpen}
      aria-label={ariaLabel || `Open ${label}`}
      title={tip}
    >
      <span className={styles.iconGlyph}>{glyph}</span>
      <span className={styles.iconLabel}>{label}</span>
    </button>
  );
}
