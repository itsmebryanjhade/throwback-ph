"use client";

import React from "react";
import { useWindowManager } from "@/lib/window-system/WindowContext";
import { useToast } from "@/lib/notification-system/NotificationContext";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import { ppopPassportReducer } from "@/lib/apps/ppoppassport/reducer";
import { INITIAL_PPOP_PASSPORT_STATE } from "@/lib/apps/ppoppassport/data";
import { PassportBookletPanel } from "./PassportBookletPanel";
import { InfluenceRoutesPanel } from "./InfluenceRoutesPanel";
import { CulturalTimelinePanel } from "./CulturalTimelinePanel";
import { PpopCulturalNotesPanel } from "./PpopCulturalNotesPanel";
import { PpopMuseumInfo } from "./PpopMuseumInfo";
import styles from "./ppoppassport.module.css";
import { matchesStateShape, usePersistentReducer } from "@/lib/persistence/usePersistentReducer";

export function PpopPassportApp() {
  const windowManager = useWindowManager();
  const toast = useToast();
  const [state, dispatch] = usePersistentReducer(
    ppopPassportReducer,
    INITIAL_PPOP_PASSPORT_STATE,
    { key: "throwback-ph:app:ppop-passport", version: 1, validate: matchesStateShape(INITIAL_PPOP_PASSPORT_STATE) },
  );

  const handleCollectToast = (stampTitle: string) => {
    toast.notify.success(
      "🔖 Visa Stamp Claimed",
      `Passport stamped with '${stampTitle}'. Cultural journey progress updated.`,
      { appId: "ppop-passport", appName: "P-pop Passport" },
    );
  };

  const handleRouteToast = (routeTitle: string) => {
    toast.notify.success(
      "✨ Cultural Trail Completed",
      `All landmark stamps for '${routeTitle}' collected!`,
      { appId: "ppop-passport", appName: "P-pop Passport" },
    );
  };

  const win = windowManager.state.windows["ppop-passport"];
  const bounds = win?.bounds || { x: 110, y: 20, width: 1000, height: 690 };
  const zIndex = win?.zIndex || 1;
  const isActive = windowManager.state.activeWindowId === "ppop-passport";
  const isMinimized = !!win?.isMinimized;
  const isMaximized = !!win?.isMaximized;
  const collectedCount = state.stamps.filter((s) => s.isCollected).length;
  const totalCount = state.stamps.length;

  return (
    <WindowFrame
      id="ppop-passport"
      ariaLabel="P-pop Passport"
      title="P-pop Passport — Transnational Cultural Explorer"
      icon="🛂"
      bounds={bounds}
      zIndex={zIndex}
      isActive={isActive}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      minSize={{ width: 500, height: 380 }}
      desktopArea={windowManager.state.desktopArea}
      onFocus={() => windowManager.focusWindow("ppop-passport")}
      onMove={(pos) => windowManager.moveWindow("ppop-passport", pos)}
      onResize={(newBounds) => windowManager.resizeWindow("ppop-passport", newBounds)}
      onMinimize={() => windowManager.minimizeWindow("ppop-passport")}
      onMaximize={() => windowManager.maximizeWindow("ppop-passport")}
      onRestore={() => windowManager.restoreWindow("ppop-passport")}
      onToggleMaximize={() => windowManager.toggleMaximize("ppop-passport")}
      onClose={() => windowManager.closeWindow("ppop-passport")}
    >
      <div className={styles.container} data-testid="app-shell-ppop-passport">
        {/* Header Bar */}
        <header className={styles.headerBar}>
          <div className={styles.headerTitleGroup}>
            <span className={styles.passportCrest}>🛂</span>
            <div>
              <div className={styles.headerTitle}>P-pop Passport: Cultural Heritage Explorer</div>
              <div className={styles.headerSubtitle}>
                Tracing Regional Pop Roots & Localized Performance in the Philippines
              </div>
            </div>
          </div>

          <div className={styles.progressBadge}>
            Stamps: {collectedCount} / {totalCount} ({Math.round((collectedCount / totalCount) * 100)}%)
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className={styles.navTabs} role="tablist" aria-label="P-pop Passport Views">
          <button
            type="button"
            role="tab"
            aria-selected={state.activeTab === "passport"}
            className={`${styles.navTab} ${state.activeTab === "passport" ? styles.navTabActive : ""}`}
            onClick={() => dispatch({ type: "SET_TAB", tab: "passport" })}
          >
            📖 Passport Booklet
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={state.activeTab === "routes"}
            className={`${styles.navTab} ${state.activeTab === "routes" ? styles.navTabActive : ""}`}
            onClick={() => dispatch({ type: "SET_TAB", tab: "routes" })}
          >
            🧭 Exploration Trails
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={state.activeTab === "timeline"}
            className={`${styles.navTab} ${state.activeTab === "timeline" ? styles.navTabActive : ""}`}
            onClick={() => dispatch({ type: "SET_TAB", tab: "timeline" })}
          >
            ⏳ Evolution Timeline
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={state.activeTab === "cultural-notes"}
            className={`${styles.navTab} ${state.activeTab === "cultural-notes" ? styles.navTabActive : ""}`}
            onClick={() => dispatch({ type: "SET_TAB", tab: "cultural-notes" })}
          >
            💡 Cultural Insights
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={state.activeTab === "museum-info"}
            className={`${styles.navTab} ${state.activeTab === "museum-info" ? styles.navTabActive : ""}`}
            onClick={() => dispatch({ type: "SET_TAB", tab: "museum-info" })}
          >
            🏛️ Museum Info
          </button>
        </nav>

        {/* Tab Panel Content */}
        <div className={styles.mainArea}>
          {state.activeTab === "passport" && (
            <PassportBookletPanel
              state={state}
              dispatch={dispatch}
              onCollectToast={handleCollectToast}
            />
          )}

          {state.activeTab === "routes" && (
            <InfluenceRoutesPanel
              state={state}
              dispatch={dispatch}
              onRouteChangeToast={handleRouteToast}
            />
          )}

          {state.activeTab === "timeline" && (
            <CulturalTimelinePanel state={state} dispatch={dispatch} />
          )}

          {state.activeTab === "cultural-notes" && <PpopCulturalNotesPanel />}

          {state.activeTab === "museum-info" && <PpopMuseumInfo />}
        </div>
      </div>
    </WindowFrame>
  );
}
