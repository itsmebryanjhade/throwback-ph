"use client";

import React, { useEffect, useRef } from "react";
import { useToast } from "@/lib/notification-system/NotificationContext";
import { useWindowManager } from "@/lib/window-system/WindowContext";
import styles from "./toast.module.css";

const typeIcons = {
  success: "✓",
  info: "ℹ",
  warning: "⚠",
  error: "✖",
} as const;

function useSafeWindowManager() {
  try {
    return useWindowManager();
  } catch {
    return null;
  }
}

export function NotificationHistory() {
  const { state, setHistoryOpen, clearHistory, dismissHistoryItem } = useToast();
  const windowManager = useSafeWindowManager();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!state.isHistoryOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setHistoryOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.isHistoryOpen, setHistoryOpen]);

  if (!state.isHistoryOpen) return null;

  const handleOpenApp = (appId: string) => {
    if (!windowManager) return;
    windowManager.openWindow(appId);
    windowManager.focusWindow(appId);
    setHistoryOpen(false);
  };

  const badgeClassMap = {
    success: styles.badgeSuccess,
    info: styles.badgeInfo,
    warning: styles.badgeWarning,
    error: styles.badgeError,
  };

  return (
    <section
      ref={panelRef}
      role="dialog"
      aria-label="Notification center"
      className={styles.historyPanel}
    >
      <header className={styles.historyTitleBar}>
        <div className={styles.historyTitleLeft}>
          <span>Notification Center</span>
          {state.history.length > 0 && (
            <span className={styles.unreadBadge}>{state.history.length}</span>
          )}
        </div>
        <div className={styles.historyControls}>
          {state.history.length > 0 && (
            <button
              type="button"
              className={styles.historyHeaderAction}
              onClick={clearHistory}
            >
              Clear all
            </button>
          )}
          <button
            type="button"
            className={styles.historyCloseButton}
            aria-label="Close notification center"
            onClick={() => setHistoryOpen(false)}
          >
            ×
          </button>
        </div>
      </header>

      <div className={styles.historyList}>
        {state.history.length === 0 ? (
          <div className={styles.emptyState}>
            <span aria-hidden="true">🔔</span>
            <p>No notifications</p>
          </div>
        ) : (
          state.history.map((item) => {
            const timeStr = new Intl.DateTimeFormat("en-PH", {
              hour: "numeric",
              minute: "2-digit",
            }).format(new Date(item.timestamp));

            return (
              <div key={item.id} className={styles.historyItem}>
                <div className={styles.historyItemHeader}>
                  <div className={styles.historyItemLeft}>
                    <span
                      className={`${styles.typeBadge} ${badgeClassMap[item.type]}`}
                      aria-hidden="true"
                    >
                      {typeIcons[item.type]}
                    </span>
                    {item.appName && (
                      <span className={styles.appName}>{item.appName}</span>
                    )}
                  </div>
                  <time className={styles.historyTimestamp}>{timeStr}</time>
                </div>

                <h4 className={styles.historyItemTitle}>{item.title}</h4>
                <p className={styles.historyItemMessage}>{item.message}</p>

                <div className={styles.historyItemFooter}>
                  {item.appId && windowManager ? (
                    <button
                      type="button"
                      className={styles.openAppButton}
                      onClick={() => handleOpenApp(item.appId!)}
                    >
                      Open {item.appName || "App"}
                    </button>
                  ) : (
                    <span />
                  )}
                  <button
                    type="button"
                    className={styles.historyDismissBtn}
                    onClick={() => dismissHistoryItem(item.id)}
                    aria-label={`Remove ${item.title} from history`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
