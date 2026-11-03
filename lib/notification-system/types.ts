export type NotificationType = "success" | "info" | "warning" | "error";

export type ToastNotification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  appId?: string;
  appName?: string;
  timestamp: number;
  duration?: number; // In ms. If 0 or null, persistent until dismissed.
  isRead?: boolean;
};

export type NotifyOptions = {
  appId?: string;
  appName?: string;
  duration?: number;
};

export type NotificationState = {
  activeToasts: ToastNotification[];
  history: ToastNotification[];
  unreadCount: number;
  isHistoryOpen: boolean;
};

export type NotificationAction =
  | { type: "ADD_NOTIFICATION"; notification: ToastNotification }
  | { type: "DISMISS_TOAST"; id: string }
  | { type: "DISMISS_HISTORY_ITEM"; id: string }
  | { type: "CLEAR_HISTORY" }
  | { type: "CLEAR_ALL" }
  | { type: "TOGGLE_HISTORY" }
  | { type: "SET_HISTORY_OPEN"; open: boolean }
  | { type: "MARK_ALL_READ" };
