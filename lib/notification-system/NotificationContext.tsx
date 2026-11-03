"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
} from "react";
import {
  DEFAULT_TOAST_DURATION,
  initialNotificationState,
  notificationReducer,
} from "./reducer";
import type {
  NotificationAction,
  NotificationState,
  NotificationType,
  NotifyOptions,
  ToastNotification,
} from "./types";

export type NotifyFn = {
  (
    params: {
      type: NotificationType;
      title: string;
      message: string;
    } & NotifyOptions,
  ): string;
  success: (title: string, message: string, options?: NotifyOptions) => string;
  info: (title: string, message: string, options?: NotifyOptions) => string;
  warning: (title: string, message: string, options?: NotifyOptions) => string;
  error: (title: string, message: string, options?: NotifyOptions) => string;
};

export type NotificationContextValue = {
  state: NotificationState;
  dispatch: React.Dispatch<NotificationAction>;
  notify: NotifyFn;
  dismissToast: (id: string) => void;
  dismissHistoryItem: (id: string) => void;
  clearHistory: () => void;
  clearAll: () => void;
  toggleHistory: () => void;
  setHistoryOpen: (open: boolean) => void;
  announcement: { text: string; priority: "polite" | "assertive" } | null;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

let notificationCounter = 0;

export function NotificationProvider({
  children,
  initialState = initialNotificationState,
}: {
  children: React.ReactNode;
  initialState?: NotificationState;
}) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const [announcement, setAnnouncement] = useState<{
    text: string;
    priority: "polite" | "assertive";
  } | null>(null);

  const notifyBase = useCallback(
    ({
      type,
      title,
      message,
      appId,
      appName,
      duration = DEFAULT_TOAST_DURATION,
    }: {
      type: NotificationType;
      title: string;
      message: string;
    } & NotifyOptions) => {
      notificationCounter += 1;
      const id = `notif-${Date.now()}-${notificationCounter}`;
      const notification: ToastNotification = {
        id,
        type,
        title,
        message,
        appId,
        appName,
        timestamp: Date.now(),
        duration,
        isRead: false,
      };

      dispatch({ type: "ADD_NOTIFICATION", notification });

      setAnnouncement({
        text: `${type.toUpperCase()}: ${title}. ${message}`,
        priority: type === "error" || type === "warning" ? "assertive" : "polite",
      });

      return id;
    },
    [],
  );

  const notify = useMemo<NotifyFn>(() => {
    return Object.assign(
      (params: {
        type: NotificationType;
        title: string;
        message: string;
      } & NotifyOptions) => notifyBase(params),
      {
        success: (title: string, message: string, options?: NotifyOptions) =>
          notifyBase({ type: "success", title, message, ...options }),
        info: (title: string, message: string, options?: NotifyOptions) =>
          notifyBase({ type: "info", title, message, ...options }),
        warning: (title: string, message: string, options?: NotifyOptions) =>
          notifyBase({ type: "warning", title, message, ...options }),
        error: (title: string, message: string, options?: NotifyOptions) =>
          notifyBase({ type: "error", title, message, ...options }),
      },
    );
  }, [notifyBase]);

  const dismissToast = useCallback((id: string) => {
    dispatch({ type: "DISMISS_TOAST", id });
  }, []);

  const dismissHistoryItem = useCallback((id: string) => {
    dispatch({ type: "DISMISS_HISTORY_ITEM", id });
  }, []);

  const clearHistory = useCallback(() => {
    dispatch({ type: "CLEAR_HISTORY" });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: "CLEAR_ALL" });
  }, []);

  const toggleHistory = useCallback(() => {
    dispatch({ type: "TOGGLE_HISTORY" });
  }, []);

  const setHistoryOpen = useCallback((open: boolean) => {
    dispatch({ type: "SET_HISTORY_OPEN", open });
  }, []);

  const value = useMemo<NotificationContextValue>(
    () => ({
      state,
      dispatch,
      notify,
      dismissToast,
      dismissHistoryItem,
      clearHistory,
      clearAll,
      toggleHistory,
      setHistoryOpen,
      announcement,
    }),
    [
      state,
      notify,
      dismissToast,
      dismissHistoryItem,
      clearHistory,
      clearAll,
      toggleHistory,
      setHistoryOpen,
      announcement,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useToast(): NotificationContextValue {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useToast must be used within a NotificationProvider");
  }
  return context;
}
