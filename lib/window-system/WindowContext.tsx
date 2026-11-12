"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import {
  createInitialWindowManagerState,
  DEFAULT_DESKTOP_AREA,
  windowManagerReducer,
} from "./reducer";
import type {
  DesktopArea,
  WindowManagerAction,
  WindowManagerState,
  WindowPosition,
  WindowRegistration,
  WindowBounds,
} from "./types";
import { matchesStateShape, usePersistentReducer } from "@/lib/persistence/usePersistentReducer";

export type WindowContextValue = {
  state: WindowManagerState;
  dispatch: React.Dispatch<WindowManagerAction>;
  openWindow: (id: string, bounds?: Partial<WindowBounds>) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  focusWindow: (id: string) => void;
  moveWindow: (id: string, position: WindowPosition) => void;
  resizeWindow: (id: string, bounds: WindowBounds) => void;
  restoreDefaultLayout: () => void;
  registerWindow: (registration: WindowRegistration) => void;
};

const WindowManagerContext = createContext<WindowContextValue | null>(null);

export function WindowManagerProvider({
  registrations = [],
  initialArea = DEFAULT_DESKTOP_AREA,
  children,
}: {
  registrations?: WindowRegistration[];
  initialArea?: DesktopArea;
  children: React.ReactNode;
}) {
  const initialState = useMemo(
    () => createInitialWindowManagerState(registrations, initialArea),
    [registrations, initialArea],
  );
  const [state, dispatch] = usePersistentReducer(windowManagerReducer, initialState, {
    key: "throwback-ph:windows",
    version: 1,
    validate: matchesStateShape(initialState),
    // Saved layouts keep their positions, but titles, icons, and sizes always
    // come from the current registrations (so renamed windows update for
    // returning visitors).
    hydrate: (restored) =>
      registrations.reduce(
        (next, registration) =>
          windowManagerReducer(next, { type: "REGISTER_WINDOW", registration }),
        restored,
      ),
  });

  useEffect(() => {
    const handleResize = () => {
      // 46px is the taskbar height
      const width = window.innerWidth || DEFAULT_DESKTOP_AREA.width;
      const height = Math.max(200, (window.innerHeight || 768) - 46);
      dispatch({ type: "SET_DESKTOP_AREA", width, height });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  const openWindow = useCallback(
    (id: string, bounds?: Partial<WindowBounds>) =>
      dispatch({ type: "OPEN_WINDOW", id, bounds }),
    [dispatch],
  );
  const closeWindow = useCallback(
    (id: string) => dispatch({ type: "CLOSE_WINDOW", id }),
    [dispatch],
  );
  const minimizeWindow = useCallback(
    (id: string) => dispatch({ type: "MINIMIZE_WINDOW", id }),
    [dispatch],
  );
  const maximizeWindow = useCallback(
    (id: string) => dispatch({ type: "MAXIMIZE_WINDOW", id }),
    [dispatch],
  );
  const restoreWindow = useCallback(
    (id: string) => dispatch({ type: "RESTORE_WINDOW", id }),
    [dispatch],
  );
  const toggleMaximize = useCallback(
    (id: string) => dispatch({ type: "TOGGLE_MAXIMIZE", id }),
    [dispatch],
  );
  const focusWindow = useCallback(
    (id: string) => dispatch({ type: "FOCUS_WINDOW", id }),
    [dispatch],
  );
  const moveWindow = useCallback(
    (id: string, position: WindowPosition) =>
      dispatch({ type: "MOVE_WINDOW", id, position }),
    [dispatch],
  );
  const resizeWindow = useCallback(
    (id: string, bounds: WindowBounds) =>
      dispatch({ type: "RESIZE_WINDOW", id, bounds }),
    [dispatch],
  );
  const restoreDefaultLayout = useCallback(
    () => dispatch({ type: "RESTORE_DEFAULT_LAYOUT" }),
    [dispatch],
  );
  const registerWindow = useCallback(
    (registration: WindowRegistration) =>
      dispatch({ type: "REGISTER_WINDOW", registration }),
    [dispatch],
  );

  const value = useMemo<WindowContextValue>(
    () => ({
      state,
      dispatch,
      openWindow,
      closeWindow,
      minimizeWindow,
      maximizeWindow,
      restoreWindow,
      toggleMaximize,
      focusWindow,
      moveWindow,
      resizeWindow,
      restoreDefaultLayout,
      registerWindow,
    }),
    [
      state,
      dispatch,
      openWindow,
      closeWindow,
      minimizeWindow,
      maximizeWindow,
      restoreWindow,
      toggleMaximize,
      focusWindow,
      moveWindow,
      resizeWindow,
      restoreDefaultLayout,
      registerWindow,
    ],
  );

  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager(): WindowContextValue {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error("useWindowManager must be used within a WindowManagerProvider");
  }
  return context;
}
