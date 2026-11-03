"use client";

import React from "react";
import type { AppMetadata } from "@/lib/apps/types";
import { useWindowManager } from "@/lib/window-system/WindowContext";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import styles from "./app-shell.module.css";

const roomBadgeClassMap = {
  technology: styles.roomBadgeTech,
  performance: styles.roomBadgePerf,
  globalization: styles.roomBadgeGlobal,
} as const;

export function RegisteredAppShell({ app }: { app: AppMetadata }) {
  const windowManager = useWindowManager();
  const runtimeWin = windowManager.state.windows[app.id];

  const bounds = runtimeWin?.bounds ?? app.defaultBounds;
  const isMinimized = runtimeWin?.isMinimized ?? false;
  const isMaximized = runtimeWin?.isMaximized ?? false;
  const isActive = runtimeWin
    ? windowManager.state.activeWindowId === app.id
    : true;
  const zIndex = runtimeWin?.zIndex ?? 10;

  const roomTitleMap = {
    technology: "Technology Room",
    performance: "Performance Room",
    globalization: "Globalization Room",
  };

  return (
    <WindowFrame
      id={app.id}
      title={app.title}
      icon={app.icon}
      bounds={bounds}
      zIndex={zIndex}
      isActive={isActive}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      minSize={app.minSize}
      desktopArea={windowManager.state.desktopArea}
      onFocus={() => windowManager.focusWindow(app.id)}
      onMove={(pos) => windowManager.moveWindow(app.id, pos)}
      onResize={(newBounds) => windowManager.resizeWindow(app.id, newBounds)}
      onMinimize={() => windowManager.minimizeWindow(app.id)}
      onMaximize={() => windowManager.maximizeWindow(app.id)}
      onRestore={() => windowManager.restoreWindow(app.id)}
      onToggleMaximize={() => windowManager.toggleMaximize(app.id)}
      onClose={() => windowManager.closeWindow(app.id)}
      closeLabel={`Close ${app.title}`}
    >
      <div className={styles.appWindowContainer} data-testid={`app-shell-${app.id}`}>
        {/* Retro App Header Toolbar */}
        <div className={styles.appToolbar}>
          <div className={styles.toolbarLeft}>
            <span
              className={`${styles.roomBadge} ${roomBadgeClassMap[app.room]}`}
            >
              {roomTitleMap[app.room]}
            </span>
            {app.isFlagship && (
              <span className={styles.flagshipBadge}>★ Flagship Artifact</span>
            )}
          </div>
        </div>

        {/* Scrollable Content Region */}
        <div className={styles.appScrollArea}>
          {/* App Overview Card */}
          <section className={styles.appHeroCard} aria-label="Application identity">
            <div className={styles.appHeroIconWrapper} aria-hidden="true">
              {app.icon}
            </div>
            <div className={styles.appHeroContent}>
              <h2 className={styles.appHeroTitle}>{app.title}</h2>
              <p className={styles.appHeroTagline}>{app.tagline}</p>
              <p className={styles.appHeroDescription}>{app.description}</p>
            </div>
          </section>

          {/* Curatorial Museum Information */}
          <section
            className={styles.museumInfoPanel}
            aria-label="Historical interpretation"
          >
            <div className={styles.museumInfoHeader}>
              <h3 className={styles.museumInfoTitle}>
                Museum Historical Interpretation
              </h3>
              <span className={styles.museumInfoYears}>
                {app.museumContext.years}
              </span>
            </div>
            <p className={styles.museumInfoSummary}>
              {app.museumContext.summary}
            </p>
            <p className={styles.museumInfoInsight}>
              “{app.museumContext.whyItMattered}”
            </p>
            {app.museumContext.sources.length > 0 && (
              <ul className={styles.sourcesList}>
                {app.museumContext.sources.map((src) => (
                  <li key={src}>Citation: {src}</li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Classic Retro Status Bar */}
        <footer className={styles.statusBar} aria-label="Status bar">
          <div className={`${styles.statusBarPane} ${styles.statusBarPaneGrow}`}>
            {app.title} — Virtual Museum Artifact
          </div>
          <div className={styles.statusBarPane}>{roomTitleMap[app.room]}</div>
        </footer>
      </div>
    </WindowFrame>
  );
}
