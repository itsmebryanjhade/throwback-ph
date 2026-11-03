import { describe, expect, it } from "vitest";
import {
  calculateCascadeBounds,
  clampBounds,
  resizeFromHandle,
} from "@/lib/window-system/geometry";
import {
  createInitialWindowManagerState,
  windowManagerReducer,
} from "@/lib/window-system/reducer";
import type {
  DesktopArea,
  WindowBounds,
  WindowRegistration,
} from "@/lib/window-system/types";

const mockDesktopArea: DesktopArea = {
  width: 1024,
  height: 722,
};

const mockRegistrations: WindowRegistration[] = [
  {
    id: "app-one",
    title: "App One",
    icon: "1️⃣",
    defaultBounds: { x: 100, y: 80, width: 600, height: 400 },
    minSize: { width: 320, height: 200 },
  },
  {
    id: "app-two",
    title: "App Two",
    icon: "2️⃣",
    defaultBounds: { x: 120, y: 90, width: 640, height: 420 },
    minSize: { width: 340, height: 220 },
  },
  {
    id: "app-three",
    title: "App Three",
    icon: "3️⃣",
    defaultBounds: { x: 140, y: 100, width: 500, height: 350 },
    minSize: { width: 300, height: 200 },
  },
];

describe("Window System — Geometry & Boundary Protection", () => {
  it("prevents title bars from being dragged off the top (y < 0)", () => {
    const clamped = clampBounds(
      { x: 50, y: -200, width: 500, height: 350 },
      { width: 300, height: 200 },
      mockDesktopArea,
    );
    expect(clamped.y).toBe(0);
  });

  it("prevents title bars from dropping below the desktop area (recoverable above taskbar)", () => {
    const clamped = clampBounds(
      { x: 50, y: 9999, width: 500, height: 350 },
      { width: 300, height: 200 },
      mockDesktopArea,
    );
    // At least 36px title bar stays inside desktopArea
    expect(clamped.y).toBeLessThanOrEqual(mockDesktopArea.height - 36);
  });

  it("ensures at least 100px of title bar remains visible horizontally", () => {
    // Dragged too far left
    const clampedFarLeft = clampBounds(
      { x: -9999, y: 50, width: 400, height: 300 },
      { width: 300, height: 200 },
      mockDesktopArea,
    );
    expect(clampedFarLeft.x).toBe(-(400 - 100));

    // Dragged too far right
    const clampedFarRight = clampBounds(
      { x: 9999, y: 50, width: 400, height: 300 },
      { width: 300, height: 200 },
      mockDesktopArea,
    );
    expect(clampedFarRight.x).toBe(mockDesktopArea.width - 100);
  });

  it("enforces minimum width and height", () => {
    const clamped = clampBounds(
      { x: 50, y: 50, width: 100, height: 50 },
      { width: 320, height: 200 },
      mockDesktopArea,
    );
    expect(clamped.width).toBe(320);
    expect(clamped.height).toBe(200);
  });

  it("resizes from handles correctly and respects minimum size", () => {
    const initialBounds: WindowBounds = { x: 100, y: 100, width: 400, height: 300 };

    // Resize East (expand width)
    const resizedE = resizeFromHandle(
      initialBounds,
      "e",
      { x: 50, y: 0 },
      { width: 300, height: 200 },
      mockDesktopArea,
    );
    expect(resizedE.width).toBe(450);
    expect(resizedE.x).toBe(100);

    // Resize West attempting to shrink below minWidth
    const resizedW = resizeFromHandle(
      initialBounds,
      "w",
      { x: 200, y: 0 },
      { width: 300, height: 200 },
      mockDesktopArea,
    );
    expect(resizedW.width).toBe(300);
    expect(resizedW.x).toBe(200);

    // Resize South-East
    const resizedSE = resizeFromHandle(
      initialBounds,
      "se",
      { x: 30, y: 40 },
      { width: 300, height: 200 },
      mockDesktopArea,
    );
    expect(resizedSE.width).toBe(430);
    expect(resizedSE.height).toBe(340);
  });

  it("calculates cascaded bounds with offset increments", () => {
    const baseBounds: WindowBounds = { x: 50, y: 50, width: 400, height: 300 };
    const cascade0 = calculateCascadeBounds(0, baseBounds, mockDesktopArea);
    const cascade1 = calculateCascadeBounds(1, baseBounds, mockDesktopArea);
    const cascade2 = calculateCascadeBounds(2, baseBounds, mockDesktopArea);

    expect(cascade0.x).toBe(50);
    expect(cascade0.y).toBe(50);
    expect(cascade1.x).toBe(80);
    expect(cascade1.y).toBe(80);
    expect(cascade2.x).toBe(110);
    expect(cascade2.y).toBe(110);
  });
});

describe("Window System — Reducer Lifecycle & Stacking", () => {
  it("initializes registered windows in closed state", () => {
    const state = createInitialWindowManagerState(mockRegistrations, mockDesktopArea);
    expect(Object.keys(state.windows)).toHaveLength(3);
    expect(state.windows["app-one"]?.isOpen).toBe(false);
    expect(state.activeWindowId).toBeNull();
    expect(state.windowOrder).toEqual([]);
  });

  it("opens windows with cascading positions and stacking z-order", () => {
    let state = createInitialWindowManagerState(mockRegistrations, mockDesktopArea);
    state = windowManagerReducer(state, { type: "OPEN_WINDOW", id: "app-one" });

    expect(state.windows["app-one"]?.isOpen).toBe(true);
    expect(state.activeWindowId).toBe("app-one");
    expect(state.windowOrder).toEqual(["app-one"]);
    const z1 = state.windows["app-one"]?.zIndex;

    state = windowManagerReducer(state, { type: "OPEN_WINDOW", id: "app-two" });
    expect(state.windows["app-two"]?.isOpen).toBe(true);
    expect(state.activeWindowId).toBe("app-two");
    expect(state.windowOrder).toEqual(["app-one", "app-two"]);
    const z2 = state.windows["app-two"]?.zIndex;

    expect(z2).toBeGreaterThan(z1!);
    // Second window cascaded
    expect(state.windows["app-two"]?.bounds.x).toBe(mockRegistrations[1].defaultBounds.x + 30);
  });

  it("focusing a background window brings it to the top of the stacking order", () => {
    let state = createInitialWindowManagerState(mockRegistrations, mockDesktopArea);
    state = windowManagerReducer(state, { type: "OPEN_WINDOW", id: "app-one" });
    state = windowManagerReducer(state, { type: "OPEN_WINDOW", id: "app-two" });
    expect(state.activeWindowId).toBe("app-two");

    state = windowManagerReducer(state, { type: "FOCUS_WINDOW", id: "app-one" });
    expect(state.activeWindowId).toBe("app-one");
    expect(state.windowOrder).toEqual(["app-two", "app-one"]);
    const z1 = state.windows["app-one"]?.zIndex ?? 0;
    const z2 = state.windows["app-two"]?.zIndex ?? 0;
    expect(z1).toBeGreaterThan(z2);
  });

  it("minimizing an active window activates the next topmost un-minimized window", () => {
    let state = createInitialWindowManagerState(mockRegistrations, mockDesktopArea);
    state = windowManagerReducer(state, { type: "OPEN_WINDOW", id: "app-one" });
    state = windowManagerReducer(state, { type: "OPEN_WINDOW", id: "app-two" });
    state = windowManagerReducer(state, { type: "OPEN_WINDOW", id: "app-three" });

    expect(state.activeWindowId).toBe("app-three");

    state = windowManagerReducer(state, { type: "MINIMIZE_WINDOW", id: "app-three" });
    expect(state.windows["app-three"]?.isMinimized).toBe(true);
    // app-two was right under app-three
    expect(state.activeWindowId).toBe("app-two");

    // Restoring un-minimizes and focuses
    state = windowManagerReducer(state, { type: "RESTORE_WINDOW", id: "app-three" });
    expect(state.windows["app-three"]?.isMinimized).toBe(false);
    expect(state.activeWindowId).toBe("app-three");
  });

  it("maximizes within desktop area above taskbar and restores to previous bounds", () => {
    let state = createInitialWindowManagerState(mockRegistrations, mockDesktopArea);
    state = windowManagerReducer(state, { type: "OPEN_WINDOW", id: "app-one" });
    const initialBounds = { ...state.windows["app-one"]!.bounds };

    state = windowManagerReducer(state, { type: "MAXIMIZE_WINDOW", id: "app-one" });
    expect(state.windows["app-one"]?.isMaximized).toBe(true);
    expect(state.windows["app-one"]?.bounds).toEqual({
      x: 0,
      y: 0,
      width: mockDesktopArea.width,
      height: mockDesktopArea.height,
    });

    state = windowManagerReducer(state, { type: "RESTORE_WINDOW", id: "app-one" });
    expect(state.windows["app-one"]?.isMaximized).toBe(false);
    expect(state.windows["app-one"]?.bounds).toEqual(initialBounds);
  });

  it("toggles maximize state seamlessly", () => {
    let state = createInitialWindowManagerState(mockRegistrations, mockDesktopArea);
    state = windowManagerReducer(state, { type: "OPEN_WINDOW", id: "app-one" });

    state = windowManagerReducer(state, { type: "TOGGLE_MAXIMIZE", id: "app-one" });
    expect(state.windows["app-one"]?.isMaximized).toBe(true);

    state = windowManagerReducer(state, { type: "TOGGLE_MAXIMIZE", id: "app-one" });
    expect(state.windows["app-one"]?.isMaximized).toBe(false);
  });

  it("closing a window removes it from stacking order and updates active window", () => {
    let state = createInitialWindowManagerState(mockRegistrations, mockDesktopArea);
    state = windowManagerReducer(state, { type: "OPEN_WINDOW", id: "app-one" });
    state = windowManagerReducer(state, { type: "OPEN_WINDOW", id: "app-two" });

    state = windowManagerReducer(state, { type: "CLOSE_WINDOW", id: "app-two" });
    expect(state.windows["app-two"]?.isOpen).toBe(false);
    expect(state.windowOrder).toEqual(["app-one"]);
    expect(state.activeWindowId).toBe("app-one");
  });

  it("restores default layout for all open windows", () => {
    let state = createInitialWindowManagerState(mockRegistrations, mockDesktopArea);
    state = windowManagerReducer(state, { type: "OPEN_WINDOW", id: "app-one" });
    state = windowManagerReducer(state, { type: "OPEN_WINDOW", id: "app-two" });

    // Drag app-one to a custom position and maximize app-two
    state = windowManagerReducer(state, {
      type: "MOVE_WINDOW",
      id: "app-one",
      position: { x: 300, y: 250 },
    });
    state = windowManagerReducer(state, { type: "MAXIMIZE_WINDOW", id: "app-two" });

    state = windowManagerReducer(state, { type: "RESTORE_DEFAULT_LAYOUT" });

    expect(state.windows["app-two"]?.isMaximized).toBe(false);
    expect(state.windows["app-two"]?.isMinimized).toBe(false);
    expect(state.windows["app-one"]?.bounds.x).toBe(mockRegistrations[0].defaultBounds.x);
    expect(state.windows["app-one"]?.bounds.y).toBe(mockRegistrations[0].defaultBounds.y);
  });

  it("clamps windows when desktop area changes", () => {
    let state = createInitialWindowManagerState(mockRegistrations, mockDesktopArea);
    state = windowManagerReducer(state, { type: "OPEN_WINDOW", id: "app-one" });

    // Desktop area shrinks significantly
    state = windowManagerReducer(state, {
      type: "SET_DESKTOP_AREA",
      width: 500,
      height: 400,
    });

    const winBounds = state.windows["app-one"]!.bounds;
    expect(winBounds.width).toBeLessThanOrEqual(500);
    expect(winBounds.height).toBeLessThanOrEqual(400);
    expect(winBounds.y).toBeLessThanOrEqual(400 - 36);
  });
});
