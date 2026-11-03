"use client";

import React from "react";
import { useToast } from "@/lib/notification-system/NotificationContext";
import { useWindowManager } from "@/lib/window-system/WindowContext";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import { tvTambayanReducer } from "@/lib/apps/tvtambayan/reducer";
import { INITIAL_TV_TAMBAYAN_STATE } from "@/lib/apps/tvtambayan/data";
import { CrtScreenPanel } from "./CrtScreenPanel";
import { ProgramGuidePanel } from "./ProgramGuidePanel";
import { CulturalNotesPanel } from "./CulturalNotesPanel";
import { TvTambayanMuseumInfo } from "./TvTambayanMuseumInfo";
import styles from "./tvtambayan.module.css";
import { matchesStateShape, usePersistentReducer } from "@/lib/persistence/usePersistentReducer";

export function TvTambayanApp() {
  const [state, dispatch] = usePersistentReducer(tvTambayanReducer, INITIAL_TV_TAMBAYAN_STATE, {
    key: "throwback-ph:app:tv-tambayan", version: 4, validate: matchesStateShape(INITIAL_TV_TAMBAYAN_STATE),
  });
  const windowManager = useWindowManager();
  const toast = useToast();

  const handleChannelToast = (chName: string, chNum: string) => {
    toast.notify.info(
      "Channel Tuned",
      `Switched broadcast to Channel ${chNum}: ${chName}`,
      { appId: "tv-tambayan", appName: "TV Tambayan" },
    );
  };

  const handleLocalizationToast = (modeName: string) => {
    toast.notify.success(
      "Audio / Subtitle Changed",
      `Switched broadcast localization to "${modeName}"`,
      { appId: "tv-tambayan", appName: "TV Tambayan" },
    );
  };

  const handleFavoriteToast = (isFav: boolean, title: string) => {
    toast.notify.info(
      isFav ? "Added to Watchlist" : "Removed from Watchlist",
      `"${title}" ${isFav ? "saved to" : "removed from"} your personal TV schedule.`,
      { appId: "tv-tambayan", appName: "TV Tambayan" },
    );
  };

  const handleTuneInToast = (title: string, chName: string) => {
    toast.notify.info(
      "Now Tuning In",
      `Watching "${title}" on ${chName}`,
      { appId: "tv-tambayan", appName: "TV Tambayan" },
    );
  };

  const win = windowManager.state.windows["tv-tambayan"];
  const bounds = win?.bounds || { x: 120, y: 60, width: 740, height: 530 };
  const zIndex = win?.zIndex || 1;
  const isActive = windowManager.state.activeWindowId === "tv-tambayan";
  const isMinimized = !!win?.isMinimized;
  const isMaximized = !!win?.isMaximized;

  // Count total favorites
  let totalFavorites = 0;
  for (const ch of state.channels) {
    totalFavorites += ch.programs.filter((p) => p.isFavorite).length;
  }

  return (
    <WindowFrame
      id="tv-tambayan"
      title="TV Tambayan"
      icon="📡"
      bounds={bounds}
      zIndex={zIndex}
      isActive={isActive}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      minSize={{ width: 500, height: 380 }}
      desktopArea={windowManager.state.desktopArea}
      onFocus={() => windowManager.focusWindow("tv-tambayan")}
      onMove={(pos) => windowManager.moveWindow("tv-tambayan", pos)}
      onResize={(newBounds) => windowManager.resizeWindow("tv-tambayan", newBounds)}
      onMinimize={() => windowManager.minimizeWindow("tv-tambayan")}
      onMaximize={() => windowManager.maximizeWindow("tv-tambayan")}
      onRestore={() => windowManager.restoreWindow("tv-tambayan")}
      onToggleMaximize={() => windowManager.toggleMaximize("tv-tambayan")}
      onClose={() => windowManager.closeWindow("tv-tambayan")}
    >
      <div className={styles.tvTambayanContainer} data-testid="app-shell-tv-tambayan">
        {/* TV Header Bar */}
        <header className={styles.tvHeader}>
          <div className={styles.brandArea}>
            <div className={styles.brandBadge}>
              📡 TV Tambayan
            </div>
            <div>
              <span className={styles.brandTitle}>TV Tambayan Broadcast Monitor</span>
              <span className={styles.brandSubtitle}>Asianovela, Anime & Variety Channels</span>
            </div>
          </div>

          <span className={styles.simulationTag}>
            Fictional Period Broadcast
          </span>
        </header>

        {/* Tab Navigation */}
        <nav className={styles.tabNav} aria-label="TV Tambayan Navigation Tabs">
          <button
            type="button"
            className={`${styles.tabButton} ${
              state.activeTab === "tv" ? styles.tabButtonActive : ""
            }`}
            onClick={() => dispatch({ type: "SET_TAB", tab: "tv" })}
            aria-selected={state.activeTab === "tv"}
            role="tab"
          >
            📺 CRT Television
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${
              state.activeTab === "guide" ? styles.tabButtonActive : ""
            }`}
            onClick={() => dispatch({ type: "SET_TAB", tab: "guide" })}
            aria-selected={state.activeTab === "guide"}
            role="tab"
          >
            📋 Program Guide
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${
              state.activeTab === "culture" ? styles.tabButtonActive : ""
            }`}
            onClick={() => dispatch({ type: "SET_TAB", tab: "culture" })}
            aria-selected={state.activeTab === "culture"}
            role="tab"
          >
            🌏 Cultural Insights
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
            ⭐ Watchlist ({totalFavorites})
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
        <div className={styles.scrollContent} role="tabpanel">
          {state.activeTab === "tv" && (
            <CrtScreenPanel
              state={state}
              dispatch={dispatch}
              onChannelToast={handleChannelToast}
              onLocalizationToast={handleLocalizationToast}
              onFavoriteToast={handleFavoriteToast}
            />
          )}

          {state.activeTab === "guide" && (
            <ProgramGuidePanel
              state={state}
              dispatch={dispatch}
              favoritesOnly={false}
              onFavoriteToast={handleFavoriteToast}
              onTuneInToast={handleTuneInToast}
            />
          )}

          {state.activeTab === "culture" && <CulturalNotesPanel />}

          {state.activeTab === "favorites" && (
            <ProgramGuidePanel
              state={state}
              dispatch={dispatch}
              favoritesOnly={true}
              onFavoriteToast={handleFavoriteToast}
              onTuneInToast={handleTuneInToast}
            />
          )}

          {state.activeTab === "museum-info" && <TvTambayanMuseumInfo />}
        </div>
      </div>
    </WindowFrame>
  );
}
