"use client";

import React, { useEffect, useRef } from "react";
import { useToast } from "@/lib/notification-system/NotificationContext";
import { useWindowManager } from "@/lib/window-system/WindowContext";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import { opmReducer } from "@/lib/apps/opm/reducer";
import { INITIAL_OPM_STATE } from "@/lib/apps/opm/data";
import { getMediaAsset } from "@/content/media";
import { LicensedAudio } from "@/components/shared/LicensedAudio";
import { VisualizerDisplay } from "./VisualizerDisplay";
import { PlayerControls } from "./PlayerControls";
import { PlaylistPanel } from "./PlaylistPanel";
import { LinerNotesPanel } from "./LinerNotesPanel";
import { OpmMuseumInfo } from "./OpmMuseumInfo";
import styles from "./opm.module.css";
import { matchesStateShape, usePersistentReducer } from "@/lib/persistence/usePersistentReducer";

export function OpmMediaPlayerApp() {
  const [state, dispatch] = usePersistentReducer(opmReducer, INITIAL_OPM_STATE, {
    key: "throwback-ph:app:opm-media-player", version: 3, validate: matchesStateShape(INITIAL_OPM_STATE),
  });
  const windowManager = useWindowManager();
  const toast = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack =
    state.tracks.find((t) => t.id === state.currentTrackId) || state.tracks[0];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = state.volume;
    audio.muted = state.isMuted;
    if (state.playbackState === "playing") {
      const playRequest = audio.play();
      playRequest?.catch(() => undefined);
    }
    else audio.pause();
  }, [state.playbackState, state.volume, state.isMuted, state.currentTrackId]);

  const currentAsset = currentTrack.mediaAssetId
    ? getMediaAsset(currentTrack.mediaAssetId)
    : undefined;

  const handlePlay = (trackId?: string) => {
    const target = trackId ? state.tracks.find((t) => t.id === trackId) : currentTrack;
    if (!target || target.availability !== "licensed") {
      toast.notify.info("Listening Copy Unavailable", "This track does not have a local listening copy.", { appId: "opm-media-player", appName: "OPM Media Player" });
      return;
    }
    dispatch({ type: "PLAY_TRACK", trackId });
    if (target) {
      toast.notify.info(
        "Now Playing",
        `"${target.title}" by ${target.artist} (${target.genre})`,
        { appId: "opm-media-player", appName: "OPM Media Player" }
      );
    }
  };

  const handlePause = () => {
    dispatch({ type: "PAUSE_TRACK" });
  };

  const handleStop = () => {
    if (audioRef.current) audioRef.current.currentTime = 0;
    dispatch({ type: "STOP_TRACK" });
  };

  const handleSeek = (seconds: number) => {
    if (audioRef.current) audioRef.current.currentTime = seconds;
    dispatch({ type: "SEEK_TIME", seconds });
  };

  const handleNext = () => {
    dispatch({ type: "NEXT_TRACK" });
  };

  const handlePrev = () => {
    dispatch({ type: "PREV_TRACK" });
  };

  const handleToggleFavorite = (trackId: string) => {
    dispatch({ type: "TOGGLE_FAVORITE", trackId });
    const track = state.tracks.find((t) => t.id === trackId);
    if (!track) return;
    const willBeFavorite = !track.isFavorite;
    toast.notify.info(
      willBeFavorite ? "Added to Favorites" : "Removed from Favorites",
      `"${track.title}" ${willBeFavorite ? "marked with ❤️" : "unmarked"}`,
      { appId: "opm-media-player", appName: "OPM Media Player" }
    );
  };

  const handleAddToPlaylist = (trackId: string) => {
    dispatch({ type: "ADD_TO_PLAYLIST", trackId });
    const track = state.tracks.find((t) => t.id === trackId);
    if (track) {
      toast.notify.info(
        "Track Added",
        `Added "${track.title}" to playback queue`,
        { appId: "opm-media-player", appName: "OPM Media Player" }
      );
    }
  };

  const handleRemoveFromPlaylist = (trackId: string) => {
    dispatch({ type: "REMOVE_FROM_PLAYLIST", trackId });
    const track = state.tracks.find((t) => t.id === trackId);
    if (track) {
      toast.notify.info(
        "Track Removed",
        `Removed "${track.title}" from playback queue`,
        { appId: "opm-media-player", appName: "OPM Media Player" }
      );
    }
  };

  const win = windowManager.state.windows["opm-media-player"];
  const bounds = win?.bounds || { x: 210, y: 70, width: 640, height: 480 };
  const zIndex = win?.zIndex || 1;
  const isActive = windowManager.state.activeWindowId === "opm-media-player";
  const isMinimized = !!win?.isMinimized;
  const isMaximized = !!win?.isMaximized;

  return (
    <WindowFrame
      id="opm-media-player"
      title="OPM Media Player"
      icon="📻"
      bounds={bounds}
      zIndex={zIndex}
      isActive={isActive}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      minSize={{ width: 460, height: 360 }}
      desktopArea={windowManager.state.desktopArea}
      onFocus={() => windowManager.focusWindow("opm-media-player")}
      onMove={(pos) => windowManager.moveWindow("opm-media-player", pos)}
      onResize={(newBounds) =>
        windowManager.resizeWindow("opm-media-player", newBounds)
      }
      onMinimize={() => windowManager.minimizeWindow("opm-media-player")}
      onMaximize={() => windowManager.maximizeWindow("opm-media-player")}
      onRestore={() => windowManager.restoreWindow("opm-media-player")}
      onToggleMaximize={() =>
        windowManager.toggleMaximize("opm-media-player")
      }
      onClose={() => {
        audioRef.current?.pause();
        windowManager.closeWindow("opm-media-player");
      }}
    >
      <div
        className={styles.container}
        data-testid="app-shell-opm-media-player"
      >
        {/* Navigation Tabs */}
        <nav className={styles.tabBar} role="tablist" aria-label="OPM Player Navigation">
          <button
            type="button"
            role="tab"
            aria-selected={state.activeTab === "player"}
            className={`${styles.tabBtn} ${
              state.activeTab === "player" ? styles.tabBtnActive : ""
            }`}
            onClick={() => dispatch({ type: "SET_TAB", tab: "player" })}
          >
            <span>🎛️ Player</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={state.activeTab === "playlist"}
            className={`${styles.tabBtn} ${
              state.activeTab === "playlist" ? styles.tabBtnActive : ""
            }`}
            onClick={() => dispatch({ type: "SET_TAB", tab: "playlist" })}
          >
            <span>📜 Playlist</span>
            <span className={styles.badge}>{state.playlistTrackIds.length}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={state.activeTab === "linernotes"}
            className={`${styles.tabBtn} ${
              state.activeTab === "linernotes" ? styles.tabBtnActive : ""
            }`}
            onClick={() => dispatch({ type: "SET_TAB", tab: "linernotes" })}
          >
            <span>🎸 Liner Notes</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={state.activeTab === "museum-info"}
            className={`${styles.tabBtn} ${
              state.activeTab === "museum-info" ? styles.tabBtnActive : ""
            }`}
            onClick={() => dispatch({ type: "SET_TAB", tab: "museum-info" })}
          >
            <span>🏛️ Museum Info</span>
          </button>
        </nav>

        {/* Scrollable Single Region */}
        <div className={styles.scrollRegion}>
          {state.activeTab === "player" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <VisualizerDisplay
                playbackState={state.playbackState}
                visualizerMode={state.visualizerMode}
                onToggleMode={() =>
                  dispatch({
                    type: "SET_VISUALIZER_MODE",
                    mode: state.visualizerMode === "bars" ? "wave" : "bars",
                  })
                }
              />
              <PlayerControls
                currentTrack={currentTrack}
                playbackState={state.playbackState}
                currentTimeSeconds={state.currentTimeSeconds}
                volume={state.volume}
                isMuted={state.isMuted}
                isShuffle={state.isShuffle}
                isRepeat={state.isRepeat}
                onPlay={() => handlePlay()}
                onPause={handlePause}
                onStop={handleStop}
                onNext={handleNext}
                onPrev={handlePrev}
                onSeek={handleSeek}
                onVolumeChange={(vol) =>
                  dispatch({ type: "SET_VOLUME", volume: vol })
                }
                onToggleMute={() => dispatch({ type: "TOGGLE_MUTE" })}
                onToggleShuffle={() => dispatch({ type: "TOGGLE_SHUFFLE" })}
                onToggleRepeat={() => dispatch({ type: "TOGGLE_REPEAT" })}
                onToggleFavorite={handleToggleFavorite}
              />
              {currentAsset ? (
                <LicensedAudio
                  asset={currentAsset}
                  mediaRef={audioRef}
                  onStateChange={(snapshot) => {
                    if (snapshot.status !== "error") {
                      dispatch({ type: "SEEK_TIME", seconds: snapshot.currentTime });
                    }
                  }}
                />
              ) : (
                <div className={styles.unavailableNotice} role="note">
                  <strong>Museum listening copy unavailable.</strong> This catalog entry is a fictional reconstruction; no substitute audio is presented as the original.
                </div>
              )}
            </div>
          )}

          {state.activeTab === "playlist" && (
            <PlaylistPanel
              tracks={state.tracks}
              playlistTrackIds={state.playlistTrackIds}
              currentTrackId={state.currentTrackId}
              playbackState={state.playbackState}
              onSelectTrack={(id) => handlePlay(id)}
              onToggleFavorite={handleToggleFavorite}
              onRemoveFromPlaylist={handleRemoveFromPlaylist}
              onAddToPlaylist={handleAddToPlaylist}
            />
          )}

          {state.activeTab === "linernotes" && (
            <LinerNotesPanel
              tracks={state.tracks}
              onSelectTrack={(id) => {
                handlePlay(id);
                dispatch({ type: "SET_TAB", tab: "player" });
              }}
            />
          )}

          {state.activeTab === "museum-info" && <OpmMuseumInfo />}
        </div>
      </div>
    </WindowFrame>
  );
}
