"use client";

import { useEffect, useState } from "react";
import type { MuseumAction, MuseumState } from "@/lib/museum-state";
import { useWindowManager } from "@/lib/window-system/WindowContext";
import { useToast } from "@/lib/notification-system/NotificationContext";
import { APP_LIST, ROOM_FOLDER_LIST } from "@/lib/apps/catalog";
import styles from "./desktop.module.css";
import toastStyles from "./toast.module.css";

function useSafeWindowManager() {
  try {
    return useWindowManager();
  } catch {
    return null;
  }
}

function useSafeToast() {
  try {
    return useToast();
  } catch {
    return null;
  }
}

export function Taskbar({
  state,
  dispatch,
  onRequestResetApp,
  onRequestResetAll,
  onRequestRestoreLayout,
}: {
  state: MuseumState;
  dispatch: React.Dispatch<MuseumAction>;
  onRequestResetApp?: (appId: string, appName: string) => void;
  onRequestResetAll?: () => void;
  onRequestRestoreLayout?: () => void;
}) {
  const [time, setTime] = useState("");
  const windowManager = useSafeWindowManager();
  const toast = useSafeToast();

  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat("en-PH", {
          hour: "numeric",
          minute: "2-digit",
        }).format(new Date()),
      );
    update();
    const timer = window.setInterval(update, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const openWindows = windowManager
    ? Object.values(windowManager.state.windows).filter((win) => win.isOpen)
    : [];

  const hasMuseumInWindowManager = openWindows.some(
    (win) => win.id === "museum" || win.id.startsWith("museum-"),
  );

  const handleWindowItemClick = (
    id: string,
    isActive: boolean,
    isMinimized: boolean,
  ) => {
    if (!windowManager) return;

    if (isMinimized) {
      windowManager.restoreWindow(id);
      if (id === "museum" || id.startsWith("museum-")) {
        dispatch({ type: "RESTORE_MUSEUM" });
      }
    } else if (isActive) {
      windowManager.minimizeWindow(id);
      if (id === "museum" || id.startsWith("museum-")) {
        dispatch({ type: "MINIMIZE_MUSEUM" });
      }
    } else {
      windowManager.focusWindow(id);
    }
  };

  const requestRestoreLayout = () => {
    if (onRequestRestoreLayout) onRequestRestoreLayout();
    else windowManager?.restoreDefaultLayout();
  };

  return (
    <>
      {state.startMenuOpen && (
        <div className={styles.startMenu} role="menu" aria-label="Start menu">
          <div className={styles.startMenuName}>Throwback PH</div>

          <div className={styles.startMenuSectionHeader}>Museum Experience</div>
          <button
            role="menuitem"
            type="button"
            onClick={() => {
              dispatch({ type: "OPEN_WELCOME" });
              if (windowManager) {
                windowManager.openWindow("welcome");
                windowManager.focusWindow("welcome");
              }
            }}
          >
            <span className={styles.startMenuIcon} aria-hidden="true">🇵🇭</span>
            Museum welcome
          </button>
          <button
            role="menuitem"
            type="button"
            onClick={() => {
              dispatch({ type: "OPEN_ROOM", roomId: "technology" });
              if (windowManager) {
                windowManager.openWindow("museum");
                windowManager.focusWindow("museum");
              }
            }}
          >
            <span className={styles.startMenuIcon} aria-hidden="true">🏛️</span>
            Technology
          </button>
          <button
            role="menuitem"
            type="button"
            onClick={() => {
              dispatch({ type: "OPEN_ROOM", roomId: "performance" });
              if (windowManager) {
                windowManager.openWindow("museum");
                windowManager.focusWindow("museum");
              }
            }}
          >
            <span className={styles.startMenuIcon} aria-hidden="true">🏛️</span>
            Performance
          </button>
          <button
            role="menuitem"
            type="button"
            onClick={() => {
              dispatch({ type: "OPEN_ROOM", roomId: "globalization" });
              if (windowManager) {
                windowManager.openWindow("museum");
                windowManager.focusWindow("museum");
              }
            }}
          >
            <span className={styles.startMenuIcon} aria-hidden="true">🏛️</span>
            Globalization
          </button>

          <div className={styles.startMenuDivider} />
          <div className={styles.startMenuSectionHeader}>Room Folders</div>
          {ROOM_FOLDER_LIST.map((folder) => (
            <button
              key={folder.id}
              role="menuitem"
              type="button"
              onClick={() => {
                if (windowManager) {
                  windowManager.openWindow(folder.id);
                  windowManager.focusWindow(folder.id);
                }
                dispatch({ type: "TOGGLE_START_MENU" });
              }}
            >
              <span className={styles.startMenuIcon} aria-hidden="true">📁</span>
              {folder.title}
            </button>
          ))}

          <div className={styles.startMenuDivider} />
          <div className={styles.startMenuSectionHeader}>Applications</div>
          {APP_LIST.map((app) => (
            <button
              key={app.id}
              role="menuitem"
              type="button"
              onClick={() => {
                if (windowManager) {
                  windowManager.openWindow(app.id);
                  windowManager.focusWindow(app.id);
                }
                dispatch({ type: "TOGGLE_START_MENU" });
              }}
            >
              <span className={styles.startMenuIcon} aria-hidden="true">{app.icon}</span>
              {app.title}
            </button>
          ))}

          {windowManager && (
            <>
              <div className={styles.startMenuDivider} />
              <button
                role="menuitem"
                type="button"
                onClick={requestRestoreLayout}
              >
                <span className={styles.startMenuIcon} aria-hidden="true">🗗</span>
                Restore default layout
              </button>
            </>
          )}

          <div className={styles.startMenuDivider} />
          <div className={styles.startMenuSectionHeader}>Saved Progress</div>
          {APP_LIST.map((app) => (
            <button
              key={`reset-${app.id}`}
              role="menuitem"
              type="button"
              onClick={() => onRequestResetApp?.(app.id, app.title)}
            >
              <span className={styles.startMenuIcon} aria-hidden="true">↺</span>
              Reset {app.title} progress
            </button>
          ))}
          <button role="menuitem" type="button" onClick={() => onRequestResetAll?.()}>
            <span className={styles.startMenuIcon} aria-hidden="true">⚠</span>
            Reset all museum progress
          </button>
        </div>
      )}

      <footer className={styles.taskbar}>
        <button
          className={styles.startButton}
          type="button"
          onClick={() => dispatch({ type: "TOGGLE_START_MENU" })}
          aria-expanded={state.startMenuOpen}
        >
          Start
        </button>

        <div
          className={styles.taskItems}
          role="toolbar"
          aria-label="Running applications"
        >
          {/* Individual taskbar buttons for each running window in Window Manager */}
          {openWindows.map((win) => {
            const isActive =
              win.id === windowManager?.state.activeWindowId && !win.isMinimized;
            const isMuseum = win.id === "museum" || win.id.startsWith("museum-");
            const accessibleLabel = win.isMinimized
              ? isMuseum
                ? "Restore Throwback PH"
                : `Restore ${win.title}`
              : win.title;

            return (
              <button
                key={win.id}
                type="button"
                className={`${styles.taskItem} ${
                  isActive ? styles.taskItemActive : ""
                } ${win.isMinimized ? styles.taskItemMinimized : ""}`}
                aria-pressed={isActive}
                aria-label={accessibleLabel}
                onClick={() =>
                  handleWindowItemClick(win.id, isActive, win.isMinimized)
                }
              >
                <span className={styles.taskItemIcon} aria-hidden="true">
                  {win.icon || "🗔"}
                </span>
                <span className={styles.taskItemText}>{win.title}</span>
              </button>
            );
          })}

          {/* Fallback button if museum room is active but not registered in WindowManager */}
          {!hasMuseumInWindowManager &&
            state.activeRoom &&
            state.museumVisibility !== "closed" && (
              <button
                type="button"
                aria-label="Restore Throwback PH"
                className={`${styles.taskItem} ${
                  state.museumVisibility === "open" ? styles.taskItemActive : styles.taskItemMinimized
                }`}
                onClick={() => {
                  if (state.museumVisibility === "minimized") {
                    dispatch({ type: "RESTORE_MUSEUM" });
                  } else {
                    dispatch({ type: "MINIMIZE_MUSEUM" });
                  }
                }}
              >
                <span className={styles.taskItemIcon} aria-hidden="true">🏛️</span>
                <span className={styles.taskItemText}>
                  Throwback PH — {state.activeRoom}
                </span>
              </button>
            )}
        </div>

        <div className={styles.systemTray}>
          {toast && (
            <button
              type="button"
              className={styles.trayButton}
              style={{ position: "relative" }}
              aria-label={`Notification center${
                toast.state.unreadCount > 0
                  ? ` (${toast.state.unreadCount} unread)`
                  : ""
              }`}
              title="Notification center"
              onClick={() => toast.toggleHistory()}
            >
              🔔
              {toast.state.unreadCount > 0 && (
                <span className={toastStyles.trayBadge} aria-hidden="true">
                  {toast.state.unreadCount > 9 ? "9+" : toast.state.unreadCount}
                </span>
              )}
            </button>
          )}
          {windowManager && (
            <button
              type="button"
              className={styles.trayButton}
              aria-label="Restore default window layout"
              title="Restore default window layout"
              onClick={requestRestoreLayout}
            >
              🗗
            </button>
          )}
          <time className={styles.clock}>{time}</time>
        </div>
      </footer>
    </>
  );
}
