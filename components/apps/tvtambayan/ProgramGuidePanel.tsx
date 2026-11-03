import React, { useState } from "react";
import type {
  ChannelId,
  ProgramItem,
  TvTambayanAction,
  TvTambayanState,
} from "@/lib/apps/tvtambayan/types";
import styles from "./tvtambayan.module.css";

type ProgramGuidePanelProps = {
  state: TvTambayanState;
  dispatch: React.Dispatch<TvTambayanAction>;
  favoritesOnly?: boolean;
  onFavoriteToast: (isFav: boolean, title: string) => void;
  onTuneInToast: (title: string, chName: string) => void;
};

export function ProgramGuidePanel({
  state,
  dispatch,
  favoritesOnly = false,
  onFavoriteToast,
  onTuneInToast,
}: ProgramGuidePanelProps) {
  const [filterCh, setFilterCh] = useState<ChannelId | "all">("all");

  // Collect all programs
  const allPrograms: { program: ProgramItem; channelNumber: string; channelName: string }[] = [];
  for (const ch of state.channels) {
    for (const prog of ch.programs) {
      allPrograms.push({
        program: prog,
        channelNumber: ch.channelNumber,
        channelName: ch.name,
      });
    }
  }

  let displayed = allPrograms;
  if (favoritesOnly) {
    displayed = displayed.filter((item) => item.program.isFavorite);
  } else if (filterCh !== "all") {
    displayed = displayed.filter((item) => item.program.channelId === filterCh);
  }

  const handleTuneIn = (prog: ProgramItem, chName: string) => {
    dispatch({ type: "SELECT_PROGRAM", programId: prog.id });
    onTuneInToast(prog.title, chName);
  };

  const handleToggleFavorite = (prog: ProgramItem) => {
    dispatch({ type: "TOGGLE_FAVORITE_SHOW", programId: prog.id });
    onFavoriteToast(!prog.isFavorite, prog.title);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {!favoritesOnly && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }} role="toolbar" aria-label="Filter schedule by channel">
          <button
            type="button"
            className={`${styles.channelBtn} ${filterCh === "all" ? styles.channelBtnActive : ""}`}
            style={{ padding: "4px 10px", flexDirection: "row", gap: "6px" }}
            onClick={() => setFilterCh("all")}
          >
            All Channels
          </button>
          {state.channels.map((ch) => (
            <button
              key={ch.id}
              type="button"
              className={`${styles.channelBtn} ${filterCh === ch.id ? styles.channelBtnActive : ""}`}
              style={{ padding: "4px 10px", flexDirection: "row", gap: "6px" }}
              onClick={() => setFilterCh(ch.id)}
            >
              CH {ch.channelNumber} ({ch.name})
            </button>
          ))}
        </div>
      )}

      {displayed.length === 0 ? (
        <div
          style={{
            padding: "32px",
            textAlign: "center",
            background: "#27272a",
            borderRadius: "6px",
            border: "1px dashed #52525b",
            color: "#a1a1aa",
            fontSize: "13px",
          }}
        >
          {favoritesOnly
            ? "Your TV watchlist is currently empty. Star your favorite Asianovelas or anime shows to save them here!"
            : "No programs listed for this channel."}
        </div>
      ) : (
        <div className={styles.guideTableContainer}>
          <div className={styles.guideHeader}>
            <span style={{ fontWeight: 700, fontSize: "13px", color: "#f4f4f5" }}>
              {favoritesOnly ? "⭐ My TV Watchlist" : "Daily Broadcast Schedule Guide"}
            </span>
            <span style={{ fontSize: "11px", color: "#a1a1aa" }}>
              {displayed.length} programs listed
            </span>
          </div>

          <ul className={styles.guideList}>
            {displayed.map(({ program, channelNumber, channelName }) => {
              const isCurrentlyPlaying =
                state.selectedProgramId === program.id &&
                state.currentChannelId === program.channelId;

              return (
                <li
                  key={program.id}
                  className={`${styles.guideItem} ${
                    isCurrentlyPlaying ? styles.guideItemActive : ""
                  }`}
                >
                  <div className={styles.guideTimeBox}>
                    <div>{program.broadcastTime}</div>
                    <div style={{ fontSize: "10px", color: "#a1a1aa" }}>
                      CH {channelNumber} · {channelName}
                    </div>
                  </div>

                  <div className={styles.guideDetails}>
                    <h4 className={styles.guideShowTitle}>{program.title}</h4>
                    <span className={styles.guideShowGenre}>
                      {program.genre} {program.originalTitle ? `· (${program.originalTitle})` : ""}
                    </span>
                    <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: "#d4d4d8", lineHeight: 1.35 }}>
                      {program.synopsis}
                    </p>
                  </div>

                  <div className={styles.guideActions}>
                    <button
                      type="button"
                      className={styles.tuneInBtn}
                      onClick={() => handleTuneIn(program, channelName)}
                      aria-label={`Tune in to ${program.title} on Channel ${channelNumber}`}
                    >
                      📺 Tune In
                    </button>
                    <button
                      type="button"
                      className={`${styles.favShowBtn} ${
                        program.isFavorite ? styles.favShowBtnActive : ""
                      }`}
                      onClick={() => handleToggleFavorite(program)}
                      aria-label={
                        program.isFavorite
                          ? `Remove ${program.title} from watchlist`
                          : `Add ${program.title} to watchlist`
                      }
                    >
                      {program.isFavorite ? "⭐ Saved" : "☆ Watchlist"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
