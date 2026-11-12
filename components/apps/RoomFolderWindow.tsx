"use client";

import React from "react";
import type { RoomFolderMetadata } from "@/lib/apps/types";
import { getApp } from "@/lib/apps/catalog";
import { useWindowManager } from "@/lib/window-system/WindowContext";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import styles from "./app-shell.module.css";
import { DesktopGlyph } from "@/components/desktop/DesktopGlyph";

export function RoomFolderWindow({ folder }: { folder: RoomFolderMetadata }) {
  const windowManager = useWindowManager();
  const runtimeWin = windowManager.state.windows[folder.id];

  const bounds = runtimeWin?.bounds ?? folder.defaultBounds;
  const isMinimized = runtimeWin?.isMinimized ?? false;
  const isMaximized = runtimeWin?.isMaximized ?? false;
  const isActive = runtimeWin
    ? windowManager.state.activeWindowId === folder.id
    : true;
  const zIndex = runtimeWin?.zIndex ?? 8;

  const handleLaunchApp = (appId: string) => {
    windowManager.openWindow(appId);
    windowManager.focusWindow(appId);
  };

  const apps = folder.appIds
    .map((id) => getApp(id))
    .filter((app): app is NonNullable<typeof app> => Boolean(app));

  return (
    <WindowFrame
      id={folder.id}
      title={folder.title}
      icon={folder.icon}
      bounds={bounds}
      zIndex={zIndex}
      isActive={isActive}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      minSize={folder.minSize}
      desktopArea={windowManager.state.desktopArea}
      onFocus={() => windowManager.focusWindow(folder.id)}
      onMove={(pos) => windowManager.moveWindow(folder.id, pos)}
      onResize={(newBounds) => windowManager.resizeWindow(folder.id, newBounds)}
      onMinimize={() => windowManager.minimizeWindow(folder.id)}
      onMaximize={() => windowManager.maximizeWindow(folder.id)}
      onRestore={() => windowManager.restoreWindow(folder.id)}
      onToggleMaximize={() => windowManager.toggleMaximize(folder.id)}
      onClose={() => windowManager.closeWindow(folder.id)}
      closeLabel={`Close ${folder.title}`}
    >
      <div
        className={styles.appWindowContainer}
        data-testid={`room-folder-${folder.id}`}
        data-layout-mode={isMaximized ? "maximized" : "standard"}
      >
        {/* Scrollable Content Region */}
        <div className={styles.appScrollArea}>
          {/* Folder Theme Header */}
          <header className={styles.folderHeader}>
            <div
              className={styles.folderIconBadge}
              style={{ borderColor: folder.color }}
              aria-hidden="true"
            >
              <DesktopGlyph kind="folder" room={folder.roomId} size={40} />
            </div>
            <div className={styles.folderHeaderText}>
              <h2 className={styles.folderTitle}>{folder.title}</h2>
              <p className={styles.folderDesc}>{folder.description}</p>
            </div>
          </header>

          {/* App Directory Grid */}
          <section
            className={styles.appCardsGrid}
            aria-label={`${folder.title} applications`}
          >
            {apps.map((app) => (
              <article key={app.id} className={styles.appCard}>
                <div className={styles.appCardTop}>
                  <div className={styles.appCardIcon}>
                    <DesktopGlyph kind={app.id} room={folder.roomId} size={40} />
                  </div>
                  <div className={styles.appCardInfo}>
                    <h3 className={styles.appCardTitle}>{app.title}</h3>
                    {app.isFlagship && (
                      <span className={styles.flagshipBadge}>★ Flagship</span>
                    )}
                    <p className={styles.appCardTagline}>{app.tagline}</p>
                  </div>
                </div>

                <div className={styles.appCardFooter}>
                  <span className={styles.statusIndicator}>
                    ● Ready to open
                  </span>
                  <button
                    type="button"
                    className={styles.launchAppButton}
                    onClick={() => handleLaunchApp(app.id)}
                    aria-label={`Open ${app.title}`}
                  >
                    Open {app.title}
                  </button>
                </div>
              </article>
            ))}
          </section>
        </div>

        {/* Status Bar */}
        <footer className={styles.statusBar} aria-label="Folder status bar">
          <div className={`${styles.statusBarPane} ${styles.statusBarPaneGrow}`}>
            {apps.length} applications in this room
          </div>
          <div className={styles.statusBarPane}>Local Intranet</div>
        </footer>
      </div>
    </WindowFrame>
  );
}
