"use client";

import React, { useState } from "react";
import type { PlaybackState, Track } from "@/lib/apps/opm/types";
import { formatTime } from "./PlayerControls";
import styles from "./opm.module.css";

interface PlaylistPanelProps {
  tracks: Track[];
  playlistTrackIds: string[];
  currentTrackId: string;
  playbackState: PlaybackState;
  onSelectTrack: (trackId: string) => void;
  onToggleFavorite: (trackId: string) => void;
  onRemoveFromPlaylist: (trackId: string) => void;
  onAddToPlaylist: (trackId: string) => void;
}

export const PlaylistPanel: React.FC<PlaylistPanelProps> = ({
  tracks,
  playlistTrackIds,
  currentTrackId,
  playbackState,
  onSelectTrack,
  onToggleFavorite,
  onRemoveFromPlaylist,
  onAddToPlaylist,
}) => {
  const [filterFavoritesOnly, setFilterFavoritesOnly] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>("all");

  const playlistTracks = tracks.filter((t) => playlistTrackIds.includes(t.id));
  const nonPlaylistTracks = tracks.filter((t) => !playlistTrackIds.includes(t.id));

  const filteredPlaylist = playlistTracks.filter((track) => {
    if (filterFavoritesOnly && !track.isFavorite) return false;
    if (selectedGenre !== "all" && track.genre !== selectedGenre) return false;
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Notice */}
      <div className={styles.fictionalNotice}>
        <strong>Educational Simulation:</strong> All tracks, band names, lyrics, and audio synthesizers are original fictional works representing mid-2000s Philippine college rock and acoustic pop culture. No copyrighted recordings are used.
      </div>

      {/* Filter and stats toolbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
          background: "#181c24",
          padding: "8px 12px",
          borderRadius: "4px",
          border: "1px solid #334155",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label style={{ fontSize: "11px", color: "#94a3b8" }}>
            Genre:
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              style={{
                marginLeft: "6px",
                background: "#0f172a",
                color: "#e2e8f0",
                border: "1px solid #475569",
                borderRadius: "3px",
                padding: "2px 6px",
                fontSize: "11px",
              }}
            >
              <option value="all">All Genres</option>
              <option value="Alternative Rock">Alternative Rock</option>
              <option value="Acoustic Pop">Acoustic Pop</option>
              <option value="Pop Punk">Pop Punk</option>
              <option value="Rap Rock">Rap Rock</option>
              <option value="Indie Ballad">Indie Ballad</option>
            </select>
          </label>

          <label
            style={{
              fontSize: "11px",
              color: "#94a3b8",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={filterFavoritesOnly}
              onChange={(e) => setFilterFavoritesOnly(e.target.checked)}
            />
            Favorites Only (❤️)
          </label>
        </div>

        <div style={{ fontSize: "11px", color: "#38bdf8" }}>
          Playlist: {filteredPlaylist.length} track(s)
        </div>
      </div>

      {/* Playlist Table */}
      <div
        style={{
          background: "#0f172a",
          border: "1px solid #334155",
          borderRadius: "6px",
          overflow: "hidden",
        }}
      >
        <table className={styles.playlistTable}>
          <thead>
            <tr>
              <th style={{ width: "30px" }}>#</th>
              <th>Track Title & Artist</th>
              <th>Genre</th>
              <th>Duration</th>
              <th style={{ textAlign: "center", width: "40px" }}>Fav</th>
              <th style={{ textAlign: "right", width: "100px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlaylist.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
                  No tracks match the current filter.
                </td>
              </tr>
            ) : (
              filteredPlaylist.map((track, idx) => {
                const isCurrent = track.id === currentTrackId;
                const isPlaying = isCurrent && playbackState === "playing";

                return (
                  <tr
                    key={track.id}
                    className={isCurrent ? styles.playlistRowActive : ""}
                  >
                    <td>
                      {isPlaying ? "▶" : idx + 1}
                    </td>
                    <td>
                      <div style={{ fontWeight: isCurrent ? 700 : 500 }}>
                        {track.title}
                      </div>
                      <div style={{ fontSize: "10px", color: isCurrent ? "#7dd3fc" : "#94a3b8" }}>
                        {track.artist} • {track.album} ({track.year})
                      </div>
                    </td>
                    <td>{track.genre}</td>
                    <td>{formatTime(track.durationSeconds)}</td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        type="button"
                        className={`${styles.favoriteBtn} ${
                          track.isFavorite ? styles.favoriteActive : ""
                        }`}
                        onClick={() => onToggleFavorite(track.id)}
                        title={track.isFavorite ? "Remove favorite" : "Add favorite"}
                        aria-label={`Favorite ${track.title}`}
                      >
                        {track.isFavorite ? "❤️" : "🤍"}
                      </button>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "4px" }}>
                        <button
                          type="button"
                          style={{
                            background: isCurrent ? "#0284c7" : "#334155",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "3px",
                            padding: "2px 8px",
                            fontSize: "10px",
                            cursor: "pointer",
                          }}
                          onClick={() => onSelectTrack(track.id)}
                          title={`Play ${track.title}`}
                        >
                          {isCurrent && isPlaying ? "Playing" : "Play"}
                        </button>
                        <button
                          type="button"
                          style={{
                            background: "#475569",
                            color: "#cbd5e1",
                            border: "none",
                            borderRadius: "3px",
                            padding: "2px 6px",
                            fontSize: "10px",
                            cursor: "pointer",
                          }}
                          onClick={() => onRemoveFromPlaylist(track.id)}
                          title={`Remove ${track.title} from playlist`}
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Catalog items not yet in playlist */}
      {nonPlaylistTracks.length > 0 && (
        <div
          style={{
            background: "#181c24",
            border: "1px dashed #475569",
            borderRadius: "6px",
            padding: "10px 14px",
          }}
        >
          <h4 style={{ margin: "0 0 8px", fontSize: "11px", color: "#94a3b8" }}>
            Available Library Tracks (Not in Playlist):
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {nonPlaylistTracks.map((track) => (
              <div
                key={track.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "11px",
                  padding: "4px 0",
                  borderBottom: "1px solid #232832",
                }}
              >
                <span>
                  <strong>{track.title}</strong> — {track.artist} ({track.genre})
                </span>
                <button
                  type="button"
                  style={{
                    background: "#059669",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "3px",
                    padding: "2px 8px",
                    fontSize: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => onAddToPlaylist(track.id)}
                  title={`Add ${track.title} to playlist`}
                >
                  + Add to Playlist
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
