"use client";

import { useState, type CSSProperties } from "react";
import styles from "./artifact-ui.module.css";

export type ArtifactIconProps = {
  src: string;
  alt: string;
  fallback: string;
  size?: number;
  className?: string;
};

export function ArtifactIcon({ src, alt, fallback, size = 40, className = "" }: ArtifactIconProps) {
  const [failed, setFailed] = useState(false);
  const style = { "--artifact-icon-size": `${size}px` } as CSSProperties;

  if (failed) {
    return (
      <span className={`${styles.artifactFallback} ${className}`} style={style} role="img" aria-label={alt}>
        {fallback}
      </span>
    );
  }

  return (
    // A native image keeps static-export paths predictable for museum assets.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`${styles.artifactIcon} ${className}`}
      style={style}
      src={src}
      alt={alt}
      width={size}
      height={size}
      onError={() => setFailed(true)}
    />
  );
}
