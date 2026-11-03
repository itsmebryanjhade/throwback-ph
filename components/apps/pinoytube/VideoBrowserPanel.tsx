import React from "react";
import type {
  PinoyTubeAction,
  PinoyTubeState,
  VideoCategory,
} from "@/lib/apps/pinoytube/types";
import { CATEGORY_LABELS } from "@/lib/apps/pinoytube/data";
import styles from "./pinoytube.module.css";

type VideoBrowserPanelProps = {
  state: PinoyTubeState;
  dispatch: React.Dispatch<PinoyTubeAction>;
  favoritesOnly?: boolean;
};

export function VideoBrowserPanel({
  state,
  dispatch,
  favoritesOnly = false,
}: VideoBrowserPanelProps) {
  const categories: VideoCategory[] = [
    "all",
    "campus-dance",
    "acoustic-opm",
    "netcafe-comedy",
    "comedy-sketch",
    "grassroots-music",
  ];

  let displayedVideos = state.videos;
  if (favoritesOnly) {
    displayedVideos = displayedVideos.filter((v) => v.isFavorite);
  } else if (state.filterCategory !== "all") {
    displayedVideos = displayedVideos.filter(
      (v) => v.category === state.filterCategory,
    );
  }

  const handleSelect = (videoId: string) => {
    dispatch({ type: "SELECT_VIDEO", videoId });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {!favoritesOnly && (
        <div className={styles.filterBar} role="toolbar" aria-label="Filter videos by category">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`${styles.filterChip} ${
                state.filterCategory === cat ? styles.filterChipActive : ""
              }`}
              onClick={() => dispatch({ type: "SET_FILTER_CATEGORY", category: cat })}
              aria-pressed={state.filterCategory === cat}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      )}

      {displayedVideos.length === 0 ? (
        <div
          style={{
            padding: "32px",
            textAlign: "center",
            background: "#ffffff",
            borderRadius: "4px",
            border: "1px dashed #cccccc",
            color: "#666666",
            fontSize: "13px",
          }}
        >
          {favoritesOnly
            ? "No favorites saved yet. Click 'Favorite' on any video to bookmark it here!"
            : "No videos found in this category."}
        </div>
      ) : (
        <div className={styles.browseGrid}>
          {displayedVideos.map((video) => (
            <div
              key={video.id}
              className={styles.browseCard}
              onClick={() => handleSelect(video.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelect(video.id);
                }
              }}
              aria-label={`Watch ${video.title} by ${video.author}`}
            >
              <div className={styles.browseThumb} aria-hidden="true">
                <span>▶</span>
                <span className={styles.browseDuration}>
                  {video.durationFormatted}
                </span>
              </div>
              <div className={styles.browseInfo}>
                <h4 className={styles.browseTitle}>{video.title}</h4>
                <p className={styles.browseAuthor}>{video.author}</p>
                <div className={styles.browseMeta}>
                  <span>{video.views.toLocaleString()} views</span>
                  <span>★ {video.starRating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
