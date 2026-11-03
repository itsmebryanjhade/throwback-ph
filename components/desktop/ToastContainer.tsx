"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { useToast } from "@/lib/notification-system/NotificationContext";
import type { ToastNotification } from "@/lib/notification-system/types";
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

function ToastItem({
  toast,
  onDismiss,
  onOpenApp,
}: {
  toast: ToastNotification;
  onDismiss: (id: string) => void;
  onOpenApp?: (appId: string) => void;
}) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const remainingRef = useRef<number>(toast.duration ?? 5000);
  const startTimeRef = useRef<number>(0);

  const startTimer = useCallback(() => {
    if (!toast.duration || toast.duration <= 0) return;
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      onDismiss(toast.id);
    }, remainingRef.current);
  }, [toast.duration, toast.id, onDismiss]);

  const pauseTimer = useCallback(() => {
    if (!timerRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;
    const elapsed = Date.now() - startTimeRef.current;
    remainingRef.current = Math.max(0, remainingRef.current - elapsed);
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [startTimer]);

  const typeClassMap = {
    success: styles.toastSuccess,
    info: styles.toastInfo,
    warning: styles.toastWarning,
    error: styles.toastError,
  };

  const badgeClassMap = {
    success: styles.badgeSuccess,
    info: styles.badgeInfo,
    warning: styles.badgeWarning,
    error: styles.badgeError,
  };

  const handleCardClick = () => {
    if (toast.appId && onOpenApp) {
      onOpenApp(toast.appId);
      onDismiss(toast.id);
    }
  };

  return (
    <div
      role={toast.type === "error" || toast.type === "warning" ? "alert" : "status"}
      className={`${styles.toast} ${typeClassMap[toast.type]}`}
      onMouseEnter={pauseTimer}
      onMouseLeave={startTimer}
      onFocus={pauseTimer}
      onBlur={startTimer}
      tabIndex={0}
      data-testid={`toast-${toast.type}`}
    >
      <div className={styles.toastHeader}>
        <div className={styles.toastHeaderLeft}>
          <span
            className={`${styles.typeBadge} ${badgeClassMap[toast.type]}`}
            aria-hidden="true"
          >
            {typeIcons[toast.type]}
          </span>
          {toast.appName && (
            <span className={styles.appName}>{toast.appName}</span>
          )}
        </div>
        <button
          type="button"
          className={styles.dismissButton}
          aria-label={`Dismiss ${toast.title} notification`}
          onClick={(e) => {
            e.stopPropagation();
            onDismiss(toast.id);
          }}
        >
          ×
        </button>
      </div>

      <div
        className={styles.toastBody}
        onClick={handleCardClick}
      >
        <h4 className={styles.toastTitle}>{toast.title}</h4>
        <p className={styles.toastMessage}>{toast.message}</p>
      </div>

      {toast.appId && onOpenApp && (
        <div className={styles.toastFooter}>
          <button
            type="button"
            className={styles.openAppButton}
            onClick={(e) => {
              e.stopPropagation();
              onOpenApp(toast.appId!);
              onDismiss(toast.id);
            }}
          >
            Open {toast.appName || "App"}
          </button>
        </div>
      )}
    </div>
  );
}

export function ToastContainer() {
  const { state, dismissToast, announcement } = useToast();
  const windowManager = useSafeWindowManager();

  const handleOpenApp = (appId: string) => {
    if (!windowManager) return;
    windowManager.openWindow(appId);
    windowManager.focusWindow(appId);
  };

  return (
    <>
      {/* Screen reader live regions */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement?.priority === "polite" ? announcement.text : ""}
      </div>
      <div className="sr-only" aria-live="assertive" aria-atomic="true">
        {announcement?.priority === "assertive" ? announcement.text : ""}
      </div>

      {state.activeToasts.length > 0 && (
        <section
          className={styles.toastContainer}
          aria-label="Desktop notifications"
          role="region"
        >
          {state.activeToasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onDismiss={dismissToast}
              onOpenApp={windowManager ? handleOpenApp : undefined}
            />
          ))}
        </section>
      )}
    </>
  );
}
