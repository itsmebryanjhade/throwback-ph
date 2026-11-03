"use client";

import React, { useState } from "react";
import type { MuseumMediaAsset } from "@/lib/media/types";
import styles from "./media.module.css";

export type MediaPlaybackSnapshot = {
  status: "idle" | "playing" | "paused" | "error";
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
};

type Props = {
  asset: MuseumMediaAsset;
  mediaRef?: React.RefObject<HTMLAudioElement | null>;
  onStateChange?: (state: MediaPlaybackSnapshot) => void;
};

export function LicensedAudio({ asset, mediaRef, onStateChange }: Props) {
  const [failed, setFailed] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const report = (element: HTMLAudioElement, status: MediaPlaybackSnapshot["status"]) =>
    onStateChange?.({
      status,
      currentTime: element.currentTime || 0,
      duration: Number.isFinite(element.duration) ? element.duration : 0,
      volume: element.volume,
      muted: element.muted,
    });

  return (
    <figure className={styles.frame}>
      {failed ? (
        <div className={styles.fallback} role="alert">
          <div>
            This museum audio could not be played.
            <br />
            <button className={styles.retry} type="button" onClick={() => { setFailed(false); setRetryKey((key) => key + 1); }}>
              Retry audio
            </button>
          </div>
        </div>
      ) : (
        <audio
          key={retryKey}
          ref={mediaRef}
          className={styles.media}
          controls
          preload="metadata"
          aria-label={`Play ${asset.title}`}
          src={asset.localSrc}
          onPlay={(event) => report(event.currentTarget, "playing")}
          onPause={(event) => report(event.currentTarget, "paused")}
          onTimeUpdate={(event) => report(event.currentTarget, event.currentTarget.paused ? "paused" : "playing")}
          onVolumeChange={(event) => report(event.currentTarget, event.currentTarget.paused ? "paused" : "playing")}
          onError={(event) => { setFailed(true); report(event.currentTarget, "error"); }}
        />
      )}
      <figcaption className={styles.credit}>
        <strong>{asset.title}</strong>
        <span>{asset.creator} · {asset.license}</span>
        <a href={asset.sourceUrl} target="_blank" rel="noreferrer">Source &amp; license</a>
      </figcaption>
    </figure>
  );
}
