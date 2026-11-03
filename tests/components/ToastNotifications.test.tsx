import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";
import {
  NotificationProvider,
  useToast,
} from "@/lib/notification-system/NotificationContext";
import { WindowManagerProvider } from "@/lib/window-system/WindowContext";
import { ToastContainer } from "@/components/desktop/ToastContainer";
import { NotificationHistory } from "@/components/desktop/NotificationHistory";
import { Taskbar } from "@/components/desktop/Taskbar";
import { initialMuseumState } from "@/lib/museum-state";

// Helper test trigger component
function NotificationTrigger() {
  const { notify, toggleHistory } = useToast();

  return (
    <div>
      <button
        type="button"
        onClick={() =>
          notify.success("Friendster Request", "Kiko added you as a friend!", {
            appId: "friendster",
            appName: "Friendster PH",
            duration: 3000,
          })
        }
      >
        Trigger Success
      </button>

      <button
        type="button"
        onClick={() =>
          notify.info("SMS Received", "You have 1 new text message from Ate.", {
            appId: "nokia-sms",
            appName: "Nokia Messages",
            duration: 3000,
          })
        }
      >
        Trigger Info
      </button>

      <button
        type="button"
        onClick={() =>
          notify.warning("Net Cafe Low Time", "PC 03 has 5 minutes remaining.", {
            appId: "net-cafe",
            appName: "Net Café",
            duration: 3000,
          })
        }
      >
        Trigger Warning
      </button>

      <button
        type="button"
        onClick={() =>
          notify.error("Connection Error", "Dial-up connection dropped.", {
            duration: 3000,
          })
        }
      >
        Trigger Error
      </button>

      <button type="button" onClick={toggleHistory}>
        Toggle History
      </button>
    </div>
  );
}

function TestApp() {
  return (
    <WindowManagerProvider>
      <NotificationProvider>
        <NotificationTrigger />
        <ToastContainer />
        <NotificationHistory />
        <Taskbar state={initialMuseumState} dispatch={() => {}} />
      </NotificationProvider>
    </WindowManagerProvider>
  );
}

describe("Shared OS Toast Notification System", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders success, info, warning, and error notifications with proper roles", () => {
    render(<TestApp />);

    fireEvent.click(screen.getByText("Trigger Success"));
    fireEvent.click(screen.getByText("Trigger Info"));
    fireEvent.click(screen.getByText("Trigger Warning"));
    fireEvent.click(screen.getByText("Trigger Error"));

    // Check titles rendered
    expect(screen.getByText("Friendster Request")).toBeInTheDocument();
    expect(screen.getByText("SMS Received")).toBeInTheDocument();
    expect(screen.getByText("Net Cafe Low Time")).toBeInTheDocument();
    expect(screen.getByText("Connection Error")).toBeInTheDocument();

    // Success and Info have status role
    const statuses = screen.getAllByRole("status");
    expect(statuses.length).toBeGreaterThanOrEqual(2);

    // Warning and Error have alert role
    const alerts = screen.getAllByRole("alert");
    expect(alerts.length).toBeGreaterThanOrEqual(2);

    // Test IDs present
    expect(screen.getByTestId("toast-success")).toBeInTheDocument();
    expect(screen.getByTestId("toast-info")).toBeInTheDocument();
    expect(screen.getByTestId("toast-warning")).toBeInTheDocument();
    expect(screen.getByTestId("toast-error")).toBeInTheDocument();
  });

  it("automatically dismisses ordinary notifications after duration", () => {
    render(<TestApp />);

    fireEvent.click(screen.getByText("Trigger Success"));
    expect(screen.getByText("Friendster Request")).toBeInTheDocument();

    // Advance timers by duration (3000ms)
    act(() => {
      vi.advanceTimersByTime(3100);
    });

    expect(screen.queryByText("Friendster Request")).not.toBeInTheDocument();
  });

  it("pauses auto-dismiss on mouse enter / focus and resumes on mouse leave / blur", () => {
    render(<TestApp />);

    fireEvent.click(screen.getByText("Trigger Info"));
    const toast = screen.getByTestId("toast-info");

    // Advance 1500ms
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    // Hover to pause
    fireEvent.mouseEnter(toast);

    // Advance 4000ms while hovered
    act(() => {
      vi.advanceTimersByTime(4000);
    });

    // Should still be visible
    expect(screen.getByText("SMS Received")).toBeInTheDocument();

    // Leave hover
    fireEvent.mouseLeave(toast);

    // Advance remaining time (~1500ms + buffer)
    act(() => {
      vi.advanceTimersByTime(1600);
    });

    expect(screen.queryByText("SMS Received")).not.toBeInTheDocument();
  });

  it("allows manual dismissal via the close button on an individual toast", () => {
    render(<TestApp />);

    fireEvent.click(screen.getByText("Trigger Warning"));
    expect(screen.getByText("Net Cafe Low Time")).toBeInTheDocument();

    const dismissBtn = screen.getByRole("button", {
      name: /Dismiss Net Cafe Low Time notification/i,
    });
    fireEvent.click(dismissBtn);

    expect(screen.queryByText("Net Cafe Low Time")).not.toBeInTheDocument();
  });

  it("opens related app and dismisses toast when clicking Open App button", () => {
    render(<TestApp />);

    fireEvent.click(screen.getByText("Trigger Success"));
    expect(screen.getByText("Friendster Request")).toBeInTheDocument();

    const openAppBtn = screen.getByRole("button", {
      name: "Open Friendster PH",
    });
    fireEvent.click(openAppBtn);

    // Toast should be dismissed
    expect(screen.queryByText("Friendster Request")).not.toBeInTheDocument();
  });

  it("toggles notification center from system tray bell, lists history, and updates unread badge", () => {
    render(<TestApp />);

    // Trigger two notifications
    fireEvent.click(screen.getByText("Trigger Success"));
    fireEvent.click(screen.getByText("Trigger Info"));

    // Check system tray button with unread count
    const bellBtn = screen.getByRole("button", {
      name: /Notification center \(2 unread\)/i,
    });
    expect(bellBtn).toBeInTheDocument();

    // Open notification center
    fireEvent.click(bellBtn);

    const dialog = screen.getByRole("dialog", { name: "Notification center" });
    expect(dialog).toBeInTheDocument();

    // Both should be in history
    expect(screen.getAllByText("Friendster Request").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("SMS Received").length).toBeGreaterThanOrEqual(1);

    // Close via close button in header
    const closeCenterBtn = screen.getByRole("button", {
      name: "Close notification center",
    });
    fireEvent.click(closeCenterBtn);

    expect(screen.queryByRole("dialog", { name: "Notification center" })).not.toBeInTheDocument();
  });

  it("allows removing a single item or clearing all from Notification History", () => {
    render(<TestApp />);

    fireEvent.click(screen.getByText("Trigger Success"));
    fireEvent.click(screen.getByText("Trigger Info"));

    // Open history
    fireEvent.click(screen.getByText("Toggle History"));

    expect(screen.getByRole("dialog", { name: "Notification center" })).toBeInTheDocument();

    // Remove single item
    const removeBtn = screen.getByRole("button", {
      name: "Remove SMS Received from history",
    });
    fireEvent.click(removeBtn);

    // Only 1 item remains in history list
    expect(screen.queryByText("SMS Received")).not.toBeInTheDocument();
    expect(screen.getAllByText("Friendster Request").length).toBeGreaterThanOrEqual(1);

    // Clear all
    const clearAllBtn = screen.getByRole("button", { name: "Clear all" });
    fireEvent.click(clearAllBtn);

    expect(screen.getByText("No notifications")).toBeInTheDocument();
  });

  it("closes Notification History when Escape key is pressed", () => {
    render(<TestApp />);

    fireEvent.click(screen.getByText("Toggle History"));
    expect(screen.getByRole("dialog", { name: "Notification center" })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Notification center" })).not.toBeInTheDocument();
  });
});
