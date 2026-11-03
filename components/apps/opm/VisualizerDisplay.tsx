"use client";

import React, { useEffect, useState } from "react";
import type { PlaybackState, VisualizerMode } from "@/lib/apps/opm/types";
import styles from "./opm.module.css";

interface VisualizerDisplayProps {
  playbackState: PlaybackState;
  visualizerMode: VisualizerMode;
  onToggleMode: () => void;
}

const BAR_COUNT = 16;
const SEGMENT_COUNT = 10;

const DEFAULT_LEVELS = Array(BAR_COUNT).fill(1);

export const VisualizerDisplay: React.FC<VisualizerDisplayProps> = ({
  playbackState,
  visualizerMode,
  onToggleMode,
}) => {
  const isPlaying = playbackState === "playing";
  const [levels, setLevels] = useState<number[]>(DEFAULT_LEVELS);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setLevels(
        Array.from({ length: BAR_COUNT }, () => {
          // Dynamic height 2 to 10
          return Math.floor(Math.random() * 8) + 3;
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const activeLevels = isPlaying ? levels : DEFAULT_LEVELS;

  return (
    <div className={styles.visualizerWrapper} aria-label="Audio Visualizer">
      <div className={styles.visualizerControls}>
        <span>VISUALIZER: {visualizerMode.toUpperCase()}</span>
        <button
          type="button"
          className={styles.modeSwitchBtn}
          onClick={onToggleMode}
          title="Switch Visualizer Mode"
        >
          Toggle: {visualizerMode === "bars" ? "Wave Mode" : "Spectrum Bars"}
        </button>
      </div>

      {visualizerMode === "bars" ? (
        <div className={styles.visualizerBarContainer} data-testid="visualizer-bars">
          {activeLevels.map((level, colIdx) => (
            <div key={colIdx} className={styles.vizBarCol}>
              {Array.from({ length: SEGMENT_COUNT }, (_, segIdx) => {
                const isActive = segIdx < level;
                let activeClass = "";
                if (isActive) {
                  if (segIdx >= 8) {
                    activeClass = styles.vizSegmentActiveHigh;
                  } else if (segIdx >= 5) {
                    activeClass = styles.vizSegmentActiveMid;
                  } else {
                    activeClass = styles.vizSegmentActiveLow;
                  }
                }
                return (
                  <div
                    key={segIdx}
                    className={`${styles.vizSegment} ${activeClass}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      ) : (
        <svg
          className={styles.waveCanvas}
          viewBox="0 0 300 64"
          data-testid="visualizer-wave"
          role="img"
          aria-label="Oscilloscope Waveform"
        >
          <path
            d={
              isPlaying
                ? `M 0 32 Q 50 ${16 + (activeLevels[0] || 5) * 2}, 100 32 T 200 ${
                    48 - (activeLevels[7] || 5) * 2
                  } T 300 32`
                : "M 0 32 L 300 32"
            }
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
};
