"use client";

import React, { useEffect } from "react";
import { useToast } from "@/lib/notification-system/NotificationContext";
import { useWindowManager } from "@/lib/window-system/WindowContext";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import { pinoyTubeReducer } from "@/lib/apps/pinoytube/reducer";
import { INITIAL_PINOYTUBE_STATE } from "@/lib/apps/pinoytube/data";
import { VideoPlayerPanel } from "./VideoPlayerPanel";
import { VideoBrowserPanel } from "./VideoBrowserPanel";
import { VideoUploadPanel } from "./VideoUploadPanel";
import { PinoyTubeMuseumInfo } from "./PinoyTubeMuseumInfo";
import styles from "./pinoytube.module.css";
import { matchesStateShape, usePersistentReducer } from "@/lib/persistence/usePersistentReducer";

export function PinoyTubeApp() {
  const [state, dispatch] = usePersistentReducer(pinoyTubeReducer, INITIAL_PINOYTUBE_STATE, {
    key: "throwback-ph:app:pinoytube", version: 4, validate: matchesStateShape(INITIAL_PINOYTUBE_STATE),
  });
  const windowManager = useWindowManager();
  const toast = useToast();

  // Playback timer tick
  useEffect(() => {
    if (state.playbackState !== "playing" || state.isBuffering) return;

    const interval = setInterval(() => {
      dispatch({ type: "TICK_PLAYBACK" });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.playbackState, state.isBuffering, dispatch]);

  const handleRateToast = (rating: number, title: string) => {
    toast.notify.success(
      "Video Rated",
      `Rated ${rating} star${rating > 1 ? "s" : ""} on "${title}". Rating score updated!`,
      { appId: "pinoytube", appName: "PinoyTube" },
    );
  };

  const handleFavoriteToast = (isFav: boolean, title: string) => {
    toast.notify.info(
      isFav ? "Saved to Favorites" : "Removed from Favorites",
      `"${title}" ${isFav ? "added to" : "removed from"} your PinoyTube favorites.`,
      { appId: "pinoytube", appName: "PinoyTube" },
    );
  };

  const handleCommentToast = (title: string) => {
    toast.notify.success(
      "Comment Published",
      `Your comment on "${title}" has been posted to the community thread.`,
      { appId: "pinoytube", appName: "PinoyTube" },
    );
  };

  const handleUploadToast = (title: string) => {
    toast.notify.success(
      "Video Published",
      `"${title}" is now live on PinoyTube in 240p stream format!`,
      { appId: "pinoytube", appName: "PinoyTube" },
    );
  };

  const handleBufferingToast = () => {
    toast.notify.info(
      "Dial-Up Buffering Simulated",
      "Experiencing authentic 2000s video stream pause... Please wait while frames load.",
      { appId: "pinoytube", appName: "PinoyTube" },
    );
  };

  const win = windowManager.state.windows["pinoytube"];
  const bounds = win?.bounds || { x: 150, y: 40, width: 760, height: 540 };
  const zIndex = win?.zIndex || 1;
  const isActive = windowManager.state.activeWindowId === "pinoytube";
  const isMinimized = !!win?.isMinimized;
  const isMaximized = !!win?.isMaximized;

  return (
    <WindowFrame
      id="pinoytube"
      title="PinoyTube"
      icon="▶️"
      bounds={bounds}
      zIndex={zIndex}
      isActive={isActive}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      minSize={{ width: 500, height: 400 }}
      desktopArea={windowManager.state.desktopArea}
      onFocus={() => windowManager.focusWindow("pinoytube")}
      onMove={(pos) => windowManager.moveWindow("pinoytube", pos)}
      onResize={(newBounds) => windowManager.resizeWindow("pinoytube", newBounds)}
      onMinimize={() => windowManager.minimizeWindow("pinoytube")}
      onMaximize={() => windowManager.maximizeWindow("pinoytube")}
      onRestore={() => windowManager.restoreWindow("pinoytube")}
      onToggleMaximize={() => windowManager.toggleMaximize("pinoytube")}
      onClose={() => windowManager.closeWindow("pinoytube")}
    >
      <div className={styles.tubeContainer} data-testid="app-shell-pinoytube">
        {/* Retro Header Bar */}
        <header className={styles.tubeHeader}>
          <div className={styles.brandArea}>
            <span className={styles.logo2006} aria-label="PinoyTube">
              <span aria-hidden="true">Pinoy</span>
              <span className={styles.logoBox} aria-hidden="true">Tube</span>
            </span>
            <span className={styles.brandSubtitle}>Broadcast Yourself · PH Edition</span>
          </div>

          <div className={styles.headerMetrics}>
            <span className={styles.simulationTag}>
              Fictional Period Recreation
            </span>
          </div>
        </header>

        {/* Tab Navigation */}
        <nav className={styles.tabNav} aria-label="PinoyTube Navigation Tabs">
          <button
            type="button"
            className={`${styles.tabButton} ${
              state.activeTab === "watch" ? styles.tabButtonActive : ""
            }`}
            onClick={() => dispatch({ type: "SET_TAB", tab: "watch" })}
            aria-selected={state.activeTab === "watch"}
            role="tab"
          >
            📺 Watch Video
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${
              state.activeTab === "browse" ? styles.tabButtonActive : ""
            }`}
            onClick={() => dispatch({ type: "SET_TAB", tab: "browse" })}
            aria-selected={state.activeTab === "browse"}
            role="tab"
          >
            🔍 Browse Categories ({state.videos.length})
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${
              state.activeTab === "upload" ? styles.tabButtonActive : ""
            }`}
            onClick={() => dispatch({ type: "SET_TAB", tab: "upload" })}
            aria-selected={state.activeTab === "upload"}
            role="tab"
          >
            ⬆️ Upload Video
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${
              state.activeTab === "favorites" ? styles.tabButtonActive : ""
            }`}
            onClick={() => dispatch({ type: "SET_TAB", tab: "favorites" })}
            aria-selected={state.activeTab === "favorites"}
            role="tab"
          >
            ⭐ Favorites ({state.videos.filter((v) => v.isFavorite).length})
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${
              state.activeTab === "museum-info" ? styles.tabButtonActive : ""
            }`}
            onClick={() => dispatch({ type: "SET_TAB", tab: "museum-info" })}
            aria-selected={state.activeTab === "museum-info"}
            role="tab"
          >
            ℹ️ Museum Info
          </button>
        </nav>

        {/* Single Scroll Container */}
        <div className={styles.tubeScrollContent} role="tabpanel">
          {state.activeTab === "watch" && (
            <VideoPlayerPanel
              state={state}
              dispatch={dispatch}
              onRateToast={handleRateToast}
              onFavoriteToast={handleFavoriteToast}
              onCommentToast={handleCommentToast}
              onBufferingToast={handleBufferingToast}
            />
          )}

          {state.activeTab === "browse" && (
            <VideoBrowserPanel
              state={state}
              dispatch={dispatch}
              favoritesOnly={false}
            />
          )}

          {state.activeTab === "upload" && (
            <VideoUploadPanel
              dispatch={dispatch}
              onUploadToast={handleUploadToast}
            />
          )}

          {state.activeTab === "favorites" && (
            <VideoBrowserPanel
              state={state}
              dispatch={dispatch}
              favoritesOnly={true}
            />
          )}

          {state.activeTab === "museum-info" && <PinoyTubeMuseumInfo />}
        </div>
      </div>
    </WindowFrame>
  );
}
