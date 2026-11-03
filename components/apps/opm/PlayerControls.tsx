"use client";

import React from "react";
import Image from "next/image";
import type { PlaybackState, Track } from "@/lib/apps/opm/types";
import styles from "./opm.module.css";

interface PlayerControlsProps {
  currentTrack: Track;
  playbackState: PlaybackState;
  currentTimeSeconds: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  isRepeat: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onToggleFavorite: (trackId: string) => void;
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  currentTrack,
  playbackState,
  currentTimeSeconds,
  volume,
  isMuted,
  isShuffle,
  isRepeat,
  onPlay,
  onPause,
  onStop,
  onNext,
  onPrev,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleShuffle,
  onToggleRepeat,
  onToggleFavorite,
}) => {
  const remainingSeconds = Math.max(0, currentTrack.durationSeconds - currentTimeSeconds);

  return (
    <div className={styles.playerDeck}>
      {/* LCD Phosphor Screen */}
      <div className={styles.lcdScreen} aria-label="Media Player Display">
        <div className={styles.lcdHeader}>
          <span>{currentTrack.bitrate} STEREO</span>
          <div className={styles.lcdIndicators}>
            <span
              className={`${styles.indicator} ${
                playbackState === "playing" ? styles.indicatorActive : ""
              }`}
            >
              PLAY
            </span>
            <span
              className={`${styles.indicator} ${
                playbackState === "paused" ? styles.indicatorActive : ""
              }`}
            >
              PAUSE
            </span>
            <span
              className={`${styles.indicator} ${
                isShuffle ? styles.indicatorActive : ""
              }`}
            >
              SHUF
            </span>
            <span
              className={`${styles.indicator} ${
                isRepeat ? styles.indicatorActive : ""
              }`}
            >
              RPT
            </span>
            <span
              className={`${styles.indicator} ${
                isMuted ? styles.indicatorActive : ""
              }`}
            >
              MUTE
            </span>
          </div>
        </div>

        {/* Marquee Title */}
        <div className={styles.marqueeContainer}>
          <div className={styles.marqueeText} data-testid="lcd-track-title">
            {currentTrack.artist} - {currentTrack.title} ({currentTrack.album},{" "}
            {currentTrack.year}) • [{currentTrack.genre}]
          </div>
        </div>

        {/* Status and Time Row */}
        <div className={styles.lcdStatusRow}>
          <span className={styles.timeDisplay} data-testid="lcd-time-display">
            {formatTime(currentTimeSeconds)}
          </span>
          <span>KEY: {currentTrack.musicalKey}</span>
          <span>REMAIN: -{formatTime(remainingSeconds)}</span>
        </div>
      </div>

      {/* Progress / Seek Bar */}
      <div className={styles.seekbarContainer}>
        <span style={{ fontSize: "11px", color: "#94a3b8" }}>
          {formatTime(currentTimeSeconds)}
        </span>
        <input
          type="range"
          min={0}
          max={currentTrack.durationSeconds}
          value={currentTimeSeconds}
          onChange={(e) => onSeek(Number(e.target.value))}
          className={styles.seekBar}
          aria-label="Seek track position"
        />
        <span style={{ fontSize: "11px", color: "#94a3b8" }}>
          {formatTime(currentTrack.durationSeconds)}
        </span>
      </div>

      {/* Transport Buttons */}
      <div className={styles.transportPanel}>
        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={styles.transportBtn}
            onClick={onPrev}
            title="Previous Track"
            aria-label="Previous Track"
          >
            ⏮
          </button>
          <button
            type="button"
            className={`${styles.transportBtn} ${
              playbackState === "playing" ? styles.transportBtnActive : ""
            }`}
            onClick={onPlay}
            title="Play"
            aria-label="Play"
          >
            ⏵
          </button>
          <button
            type="button"
            className={`${styles.transportBtn} ${
              playbackState === "paused" ? styles.transportBtnActive : ""
            }`}
            onClick={onPause}
            title="Pause"
            aria-label="Pause"
          >
            ⏸
          </button>
          <button
            type="button"
            className={`${styles.transportBtn} ${
              playbackState === "stopped" ? styles.transportBtnActive : ""
            }`}
            onClick={onStop}
            title="Stop"
            aria-label="Stop"
          >
            ⏹
          </button>
          <button
            type="button"
            className={styles.transportBtn}
            onClick={onNext}
            title="Next Track"
            aria-label="Next Track"
          >
            ⏭
          </button>
        </div>

        {/* Playback Mode Toggles */}
        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={`${styles.transportBtn} ${
              isShuffle ? styles.transportBtnActive : ""
            }`}
            onClick={onToggleShuffle}
            title="Toggle Shuffle"
            aria-label="Toggle Shuffle"
          >
            🔀 Shuf
          </button>
          <button
            type="button"
            className={`${styles.transportBtn} ${
              isRepeat ? styles.transportBtnActive : ""
            }`}
            onClick={onToggleRepeat}
            title="Toggle Repeat"
            aria-label="Toggle Repeat"
          >
            🔁 Rpt
          </button>
        </div>

        {/* Volume & Mute */}
        <div className={styles.volumeControl}>
          <button
            type="button"
            className={styles.transportBtn}
            onClick={onToggleMute}
            title={isMuted ? "Unmute" : "Mute"}
            aria-label={isMuted ? "Unmute" : "Mute"}
            style={{ minWidth: "30px", height: "26px", fontSize: "11px" }}
          >
            {isMuted || volume === 0 ? "🔇" : "🔊"}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className={styles.volSlider}
            aria-label="Volume Slider"
          />
          <span>{isMuted ? "0%" : `${Math.round(volume * 100)}%`}</span>
        </div>
      </div>

      {/* Quick Track Summary Card */}
      <div className={styles.trackSummaryCard}>
        {currentTrack.coverSrc ? (
          <Image
            className={styles.albumCover}
            src={currentTrack.coverSrc}
            alt={`${currentTrack.album} album cover`}
            width={62}
            height={62}
          />
        ) : (
          <div
            className={`${styles.cdArtPlaceholder} ${
              playbackState === "playing" ? styles.cdPlaying : ""
            }`}
            title="Burned CD-R listening copy"
          >
            💿
          </div>
        )}
        <div className={styles.trackSummaryMeta}>
          <h3 className={styles.trackSummaryTitle}>{currentTrack.title}</h3>
          <div className={styles.trackSummaryArtist}>
            {currentTrack.artist} — {currentTrack.album} ({currentTrack.year})
          </div>
          <div className={styles.trackSummaryLyrics}>
            &ldquo;{currentTrack.lyricsExcerpt}&rdquo;
          </div>
        </div>
        <button
          type="button"
          className={`${styles.favoriteBtn} ${
            currentTrack.isFavorite ? styles.favoriteActive : ""
          }`}
          onClick={() => onToggleFavorite(currentTrack.id)}
          title={
            currentTrack.isFavorite
              ? "Remove from favorites"
              : "Mark as favorite track"
          }
          aria-label={
            currentTrack.isFavorite
              ? "Remove from favorites"
              : "Mark as favorite track"
          }
        >
          {currentTrack.isFavorite ? "❤️" : "🤍"}
        </button>
      </div>
    </div>
  );
};
