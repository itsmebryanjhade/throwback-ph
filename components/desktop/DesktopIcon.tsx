import type { ReactNode } from "react";
import Image from "next/image";
import styles from "./desktop.module.css";

type DesktopIconProps = {
  label: string;
  symbol: ReactNode;
  onOpen: () => void;
  ariaLabel?: string;
  imageSrc?: string;
  imageAlt?: string;
};

export function DesktopIcon({
  label,
  symbol,
  onOpen,
  ariaLabel,
  imageSrc,
  imageAlt,
}: DesktopIconProps) {
  return (
    <button
      className={styles.desktopIcon}
      type="button"
      onDoubleClick={onOpen}
      onClick={onOpen}
      aria-label={ariaLabel || `Open ${label}`}
    >
      <span className={styles.iconTile} aria-hidden={imageSrc ? undefined : "true"}>
        {imageSrc ? (
          <Image src={imageSrc} alt={imageAlt || ""} fill sizes="54px" />
        ) : (
          symbol
        )}
      </span>
      <span>{label}</span>
    </button>
  );
}
