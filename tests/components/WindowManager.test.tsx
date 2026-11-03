import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it } from "vitest";
import { Taskbar } from "@/components/desktop/Taskbar";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import {
  useWindowManager,
  WindowManagerProvider,
} from "@/lib/window-system/WindowContext";
import type { WindowRegistration } from "@/lib/window-system/types";
import { initialMuseumState } from "@/lib/museum-state";

const testRegistrations: WindowRegistration[] = [
  {
    id: "app-alpha",
    title: "Alpha App",
    icon: "🅰️",
    defaultBounds: { x: 50, y: 50, width: 400, height: 300 },
    minSize: { width: 300, height: 200 },
  },
  {
    id: "app-beta",
    title: "Beta App",
    icon: "🅱️",
    defaultBounds: { x: 100, y: 100, width: 420, height: 320 },
    minSize: { width: 300, height: 200 },
  },
];

function TestDesktopHarness() {
  const {
    state,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    toggleMaximize,
    focusWindow,
    moveWindow,
    resizeWindow,
  } = useWindowManager();

  return (
    <div style={{ position: "relative", width: 1024, height: 768 }}>
      <div style={{ display: "flex", gap: 8, padding: 8 }}>
        <button type="button" onClick={() => openWindow("app-alpha")}>
          Launch Alpha
        </button>
        <button type="button" onClick={() => openWindow("app-beta")}>
          Launch Beta
        </button>
      </div>

      {Object.values(state.windows).map((win) => {
        if (!win.isOpen) return null;
        const isActive = state.activeWindowId === win.id;

        return (
          <WindowFrame
            key={win.id}
            id={win.id}
            title={win.title}
            icon={win.icon}
            bounds={win.bounds}
            zIndex={win.zIndex}
            isActive={isActive}
            isMinimized={win.isMinimized}
            isMaximized={win.isMaximized}
            desktopArea={state.desktopArea}
            onFocus={() => focusWindow(win.id)}
            onMove={(pos) => moveWindow(win.id, pos)}
            onResize={(newBounds) => resizeWindow(win.id, newBounds)}
            onMinimize={() => minimizeWindow(win.id)}
            onMaximize={() => maximizeWindow(win.id)}
            onRestore={() => restoreWindow(win.id)}
            onToggleMaximize={() => toggleMaximize(win.id)}
            onClose={() => closeWindow(win.id)}
          >
            <div>Content of {win.title}</div>
          </WindowFrame>
        );
      })}

      <Taskbar state={initialMuseumState} dispatch={() => undefined} />
    </div>
  );
}

describe("WindowManager Component Integration", () => {
  it("opens multiple overlapping windows and provides individual taskbar buttons", async () => {
    const user = userEvent.setup();
    render(
      <WindowManagerProvider registrations={testRegistrations}>
        <TestDesktopHarness />
      </WindowManagerProvider>,
    );

    // Launch both apps
    await user.click(screen.getByRole("button", { name: /launch alpha/i }));
    await user.click(screen.getByRole("button", { name: /launch beta/i }));

    // Both dialogs exist simultaneously
    expect(screen.getByRole("dialog", { name: "Alpha App" })).toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "Beta App" })).toBeInTheDocument();

    // Individual taskbar buttons exist in the taskbar
    const runningApps = screen.getByRole("toolbar", { name: /running applications/i });
    expect(runningApps).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Alpha App" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Beta App" })).toBeInTheDocument();
  });

  it("drags window via title bar and updates coordinates", async () => {
    const user = userEvent.setup();
    render(
      <WindowManagerProvider registrations={testRegistrations}>
        <TestDesktopHarness />
      </WindowManagerProvider>,
    );

    await user.click(screen.getByRole("button", { name: /launch alpha/i }));
    const windowEl = screen.getByRole("dialog", { name: "Alpha App" });
    const titleBar = screen.getByLabelText(/Alpha App title bar/i);

    // Pointer down, move, and up
    fireEvent.pointerDown(titleBar, { clientX: 100, clientY: 100, button: 0, pointerId: 1 });
    fireEvent.pointerMove(titleBar, { clientX: 180, clientY: 150, pointerId: 1 });
    fireEvent.pointerUp(titleBar, { pointerId: 1 });

    // Expect window to have shifted
    expect(windowEl.style.left).toBe("130px"); // 50 + 80
    expect(windowEl.style.top).toBe("100px"); // 50 + 50
  });

  it("moves window with keyboard arrow keys when title bar is focused", async () => {
    const user = userEvent.setup();
    render(
      <WindowManagerProvider registrations={testRegistrations}>
        <TestDesktopHarness />
      </WindowManagerProvider>,
    );

    await user.click(screen.getByRole("button", { name: /launch alpha/i }));
    const windowEl = screen.getByRole("dialog", { name: "Alpha App" });
    const titleBar = screen.getByLabelText(/Alpha App title bar/i);

    titleBar.focus();
    fireEvent.keyDown(titleBar, { key: "ArrowRight" });
    fireEvent.keyDown(titleBar, { key: "ArrowDown" });

    expect(windowEl.style.left).toBe("60px");
    expect(windowEl.style.top).toBe("60px");
  });

  it("resizes window from handles while respecting minimum dimensions", async () => {
    const user = userEvent.setup();
    render(
      <WindowManagerProvider registrations={testRegistrations}>
        <TestDesktopHarness />
      </WindowManagerProvider>,
    );

    await user.click(screen.getByRole("button", { name: /launch alpha/i }));
    const windowEl = screen.getByRole("dialog", { name: "Alpha App" });
    const seHandle = screen.getByTestId("resize-handle-se");

    // Drag South-East handle
    fireEvent.pointerDown(seHandle, { clientX: 450, clientY: 350, button: 0, pointerId: 2 });
    fireEvent.pointerMove(seHandle, { clientX: 520, clientY: 410, pointerId: 2 });
    fireEvent.pointerUp(seHandle, { pointerId: 2 });

    expect(windowEl.style.width).toBe("470px"); // 400 + 70
    expect(windowEl.style.height).toBe("360px"); // 300 + 60
  });

  it("minimizes, restores via taskbar, maximizes, and restores via control button", async () => {
    const user = userEvent.setup();
    render(
      <WindowManagerProvider registrations={testRegistrations}>
        <TestDesktopHarness />
      </WindowManagerProvider>,
    );

    await user.click(screen.getByRole("button", { name: /launch alpha/i }));
    const alphaDialog = screen.getByRole("dialog", { name: "Alpha App" });

    expect(alphaDialog).toHaveAttribute("data-window-mode", "standard");
    expect(alphaDialog).toHaveAttribute("data-window-active", "true");

    // Minimize via window control
    await user.click(screen.getByRole("button", { name: "Minimize Alpha App" }));
    expect(alphaDialog).not.toBeVisible();

    // Taskbar button shows Restore label
    const restoreBtn = screen.getByRole("button", { name: "Restore Alpha App" });
    expect(restoreBtn).toBeInTheDocument();

    // Click taskbar button to restore
    await user.click(restoreBtn);
    expect(alphaDialog).toBeVisible();

    // Maximize window
    await user.click(screen.getByRole("button", { name: "Maximize Alpha App" }));
    expect(alphaDialog.style.width).toBe("100%");
    expect(alphaDialog.style.height).toBe("100%");
    expect(alphaDialog).toHaveAttribute("data-window-mode", "maximized");

    // Restore button is now present
    await user.click(screen.getByRole("button", { name: "Restore Alpha App" }));
    expect(alphaDialog.style.width).toBe("400px");
    expect(alphaDialog.style.height).toBe("300px");
    expect(alphaDialog).toHaveAttribute("data-window-mode", "standard");
  });

  it("exposes active presentation state for overlapping windows", async () => {
    const user = userEvent.setup();
    render(
      <WindowManagerProvider registrations={testRegistrations}>
        <TestDesktopHarness />
      </WindowManagerProvider>,
    );

    await user.click(screen.getByRole("button", { name: /launch alpha/i }));
    await user.click(screen.getByRole("button", { name: /launch beta/i }));

    expect(screen.getByRole("dialog", { name: "Alpha App" })).toHaveAttribute(
      "data-window-active",
      "false",
    );
    expect(screen.getByRole("dialog", { name: "Beta App" })).toHaveAttribute(
      "data-window-active",
      "true",
    );
  });

  it("click-to-focus raises window z-index", async () => {
    const user = userEvent.setup();
    render(
      <WindowManagerProvider registrations={testRegistrations}>
        <TestDesktopHarness />
      </WindowManagerProvider>,
    );

    await user.click(screen.getByRole("button", { name: /launch alpha/i }));
    await user.click(screen.getByRole("button", { name: /launch beta/i }));

    const alphaDialog = screen.getByRole("dialog", { name: "Alpha App" });
    const betaDialog = screen.getByRole("dialog", { name: "Beta App" });

    const betaZ = parseInt(betaDialog.style.zIndex, 10);
    const alphaZ1 = parseInt(alphaDialog.style.zIndex, 10);
    expect(betaZ).toBeGreaterThan(alphaZ1);

    // Click on Alpha to focus
    fireEvent.pointerDown(alphaDialog);
    const alphaZ2 = parseInt(alphaDialog.style.zIndex, 10);
    expect(alphaZ2).toBeGreaterThan(betaZ);
  });

  it("restores default layout through system tray control", async () => {
    const user = userEvent.setup();
    render(
      <WindowManagerProvider registrations={testRegistrations}>
        <TestDesktopHarness />
      </WindowManagerProvider>,
    );

    await user.click(screen.getByRole("button", { name: /launch alpha/i }));
    const alphaDialog = screen.getByRole("dialog", { name: "Alpha App" });

    // Maximize Alpha
    await user.click(screen.getByRole("button", { name: "Maximize Alpha App" }));
    expect(alphaDialog.style.width).toBe("100%");

    // Click system tray restore layout button
    await user.click(screen.getByRole("button", { name: /restore default window layout/i }));
    expect(alphaDialog.style.width).toBe("400px");
    expect(alphaDialog.style.height).toBe("300px");
  });
});
