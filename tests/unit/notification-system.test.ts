import { describe, expect, it } from "vitest";
import {
  initialNotificationState,
  MAX_ACTIVE_TOASTS,
  MAX_HISTORY_ITEMS,
  notificationReducer,
} from "@/lib/notification-system/reducer";
import type { ToastNotification } from "@/lib/notification-system/types";

function createMockNotification(id: string, type: ToastNotification["type"] = "info"): ToastNotification {
  return {
    id,
    type,
    title: `Title ${id}`,
    message: `Message for ${id}`,
    timestamp: 1600000000000,
    duration: 5000,
    isRead: false,
  };
}

describe("Notification System — Reducer Unit Tests", () => {
  it("initializes with empty toasts, empty history, and zero unread count", () => {
    expect(initialNotificationState.activeToasts).toEqual([]);
    expect(initialNotificationState.history).toEqual([]);
    expect(initialNotificationState.unreadCount).toBe(0);
    expect(initialNotificationState.isHistoryOpen).toBe(false);
  });

  it("adds a notification to active toasts, history, and increments unread count", () => {
    const notif = createMockNotification("1", "success");
    const state = notificationReducer(initialNotificationState, {
      type: "ADD_NOTIFICATION",
      notification: notif,
    });

    expect(state.activeToasts).toHaveLength(1);
    expect(state.activeToasts[0].id).toBe("1");
    expect(state.history).toHaveLength(1);
    expect(state.history[0].id).toBe("1");
    expect(state.unreadCount).toBe(1);
  });

  it("caps active toasts at MAX_ACTIVE_TOASTS and keeps latest", () => {
    let state = initialNotificationState;
    for (let i = 1; i <= 6; i += 1) {
      state = notificationReducer(state, {
        type: "ADD_NOTIFICATION",
        notification: createMockNotification(`n-${i}`),
      });
    }

    expect(state.activeToasts).toHaveLength(MAX_ACTIVE_TOASTS);
    expect(state.activeToasts[state.activeToasts.length - 1].id).toBe("n-6");
    expect(state.history).toHaveLength(6);
    expect(state.unreadCount).toBe(6);
  });

  it("caps history at MAX_HISTORY_ITEMS", () => {
    let state = initialNotificationState;
    for (let i = 1; i <= MAX_HISTORY_ITEMS + 5; i += 1) {
      state = notificationReducer(state, {
        type: "ADD_NOTIFICATION",
        notification: createMockNotification(`n-${i}`),
      });
    }

    expect(state.history).toHaveLength(MAX_HISTORY_ITEMS);
  });

  it("dismisses an active toast while retaining it in history as read", () => {
    const notif = createMockNotification("test-1", "info");
    let state = notificationReducer(initialNotificationState, {
      type: "ADD_NOTIFICATION",
      notification: notif,
    });

    state = notificationReducer(state, { type: "DISMISS_TOAST", id: "test-1" });
    expect(state.activeToasts).toHaveLength(0);
    expect(state.history).toHaveLength(1);
    expect(state.history[0].isRead).toBe(true);
  });

  it("dismisses an item from history and decrements unread count if unread", () => {
    const notif = createMockNotification("test-1", "warning");
    let state = notificationReducer(initialNotificationState, {
      type: "ADD_NOTIFICATION",
      notification: notif,
    });
    expect(state.unreadCount).toBe(1);

    state = notificationReducer(state, {
      type: "DISMISS_HISTORY_ITEM",
      id: "test-1",
    });
    expect(state.history).toHaveLength(0);
    expect(state.unreadCount).toBe(0);
  });

  it("clears history and resets unread count", () => {
    let state = initialNotificationState;
    state = notificationReducer(state, {
      type: "ADD_NOTIFICATION",
      notification: createMockNotification("1"),
    });
    state = notificationReducer(state, {
      type: "ADD_NOTIFICATION",
      notification: createMockNotification("2"),
    });

    state = notificationReducer(state, { type: "CLEAR_HISTORY" });
    expect(state.history).toHaveLength(0);
    expect(state.unreadCount).toBe(0);
    // Active toasts remain until dismissed
    expect(state.activeToasts).toHaveLength(2);
  });

  it("clears all active toasts and history", () => {
    let state = initialNotificationState;
    state = notificationReducer(state, {
      type: "ADD_NOTIFICATION",
      notification: createMockNotification("1"),
    });

    state = notificationReducer(state, { type: "CLEAR_ALL" });
    expect(state.activeToasts).toHaveLength(0);
    expect(state.history).toHaveLength(0);
    expect(state.unreadCount).toBe(0);
  });

  it("toggling history open marks all notifications as read and resets unreadCount", () => {
    let state = initialNotificationState;
    state = notificationReducer(state, {
      type: "ADD_NOTIFICATION",
      notification: createMockNotification("1"),
    });
    expect(state.unreadCount).toBe(1);
    expect(state.isHistoryOpen).toBe(false);

    state = notificationReducer(state, { type: "TOGGLE_HISTORY" });
    expect(state.isHistoryOpen).toBe(true);
    expect(state.unreadCount).toBe(0);
    expect(state.history[0].isRead).toBe(true);

    state = notificationReducer(state, { type: "TOGGLE_HISTORY" });
    expect(state.isHistoryOpen).toBe(false);
  });
});
