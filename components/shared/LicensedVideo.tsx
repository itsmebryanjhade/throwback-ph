"use client";

import React, { useState } from "react";
import type { MuseumMediaAsset } from "@/lib/media/types";
import type { MediaPlaybackSnapshot } from "./LicensedAudio";
import styles from "./media.module.css";

type Props = {
  asset: MuseumMediaAsset;
  mediaRef?: React.RefObject<HTMLVideoElement | null>;
  onStateChange?: (state: MediaPlaybackSnapshot) => void;
  onLoadingChange?: (loading: boolean) => void;
  className?: string;
};

export function LicensedVideo({ asset, mediaRef, onStateChange, onLoadingChange, className }: Props) {
  const [failed, setFailed] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const report = (element: HTMLVideoElement, status: MediaPlaybackSnapshot["status"]) =>
    onStateChange?.({
      status,
      currentTime: element.currentTime || 0,
      duration: Number.isFinite(element.duration) ? element.duration : 0,
      volume: element.volume,
      muted: element.muted,
    });

  return (
    <figure className={`${styles.frame} ${className ?? ""}`}>
      {failed ? (
        <div className={styles.fallback} role="alert">
          <div>
            This archival film could not be played.
            <br />
            <button className={styles.retry} type="button" onClick={() => { setFailed(false); setRetryKey((key) => key + 1); }}>
              Retry video
            </button>
          </div>
        </div>
      ) : (
        <video
          key={retryKey}
          ref={mediaRef}
          className={`${styles.media} ${styles.video}`}
          controls
          preload="metadata"
          playsInline
          poster={asset.posterSrc}
          aria-label={`Play ${asset.title}`}
          src={asset.localSrc}
          onLoadStart={() => onLoadingChange?.(true)}
          onWaiting={() => onLoadingChange?.(true)}
          onCanPlay={() => onLoadingChange?.(false)}
          onPlay={(event) => { onLoadingChange?.(false); report(event.currentTarget, "playing"); }}
          onPause={(event) => report(event.currentTarget, "paused")}
          onTimeUpdate={(event) => report(event.currentTarget, event.currentTarget.paused ? "paused" : "playing")}
          onVolumeChange={(event) => report(event.currentTarget, event.currentTarget.paused ? "paused" : "playing")}
          onError={(event) => { onLoadingChange?.(false); setFailed(true); report(event.currentTarget, "error"); }}
        >
          {asset.captionsSrc && <track kind="captions" src={asset.captionsSrc} srcLang="en" label="Descriptive captions" default />}
        </video>
      )}
      <figcaption className={styles.credit}>
        <strong>{asset.title}</strong>
        <span>{asset.creator} · {asset.license}</span>
        <a href={asset.sourceUrl} target="_blank" rel="noreferrer">Source &amp; license</a>
      </figcaption>
    </figure>
  );
}
