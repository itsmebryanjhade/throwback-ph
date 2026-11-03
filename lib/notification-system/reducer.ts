import type {
  NotificationAction,
  NotificationState,
} from "./types";

export const MAX_ACTIVE_TOASTS = 4;
export const MAX_HISTORY_ITEMS = 50;
export const DEFAULT_TOAST_DURATION = 5000;

export const initialNotificationState: NotificationState = {
  activeToasts: [],
  history: [],
  unreadCount: 0,
  isHistoryOpen: false,
};

export function notificationReducer(
  state: NotificationState,
  action: NotificationAction,
): NotificationState {
  switch (action.type) {
    case "ADD_NOTIFICATION": {
      const updatedHistory = [action.notification, ...state.history].slice(
        0,
        MAX_HISTORY_ITEMS,
      );

      // Keep only up to MAX_ACTIVE_TOASTS active toasts
      const updatedActive = [...state.activeToasts, action.notification].slice(
        -MAX_ACTIVE_TOASTS,
      );

      return {
        ...state,
        activeToasts: updatedActive,
        history: updatedHistory,
        unreadCount: state.unreadCount + 1,
      };
    }

    case "DISMISS_TOAST": {
      return {
        ...state,
        activeToasts: state.activeToasts.filter((t) => t.id !== action.id),
        history: state.history.map((t) =>
          t.id === action.id ? { ...t, isRead: true } : t,
        ),
      };
    }

    case "DISMISS_HISTORY_ITEM": {
      const item = state.history.find((t) => t.id === action.id);
      const wasUnread = item ? !item.isRead : false;

      return {
        ...state,
        activeToasts: state.activeToasts.filter((t) => t.id !== action.id),
        history: state.history.filter((t) => t.id !== action.id),
        unreadCount: wasUnread
          ? Math.max(0, state.unreadCount - 1)
          : state.unreadCount,
      };
    }

    case "CLEAR_HISTORY": {
      return {
        ...state,
        history: [],
        unreadCount: 0,
      };
    }

    case "CLEAR_ALL": {
      return {
        ...state,
        activeToasts: [],
        history: [],
        unreadCount: 0,
      };
    }

    case "TOGGLE_HISTORY": {
      const willBeOpen = !state.isHistoryOpen;
      return {
        ...state,
        isHistoryOpen: willBeOpen,
        unreadCount: willBeOpen ? 0 : state.unreadCount,
        history: willBeOpen
          ? state.history.map((t) => ({ ...t, isRead: true }))
          : state.history,
      };
    }

    case "SET_HISTORY_OPEN": {
      return {
        ...state,
        isHistoryOpen: action.open,
        unreadCount: action.open ? 0 : state.unreadCount,
        history: action.open
          ? state.history.map((t) => ({ ...t, isRead: true }))
          : state.history,
      };
    }

    case "MARK_ALL_READ": {
      return {
        ...state,
        unreadCount: 0,
        history: state.history.map((t) => ({ ...t, isRead: true })),
      };
    }

    default:
      return state;
  }
}
