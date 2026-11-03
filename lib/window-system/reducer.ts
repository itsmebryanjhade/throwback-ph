import {
  calculateCascadeBounds,
  clampBounds,
  DEFAULT_MIN_SIZE,
} from "./geometry";
import type {
  DesktopArea,
  WindowManagerAction,
  WindowManagerState,
  WindowRegistration,
  WindowRuntimeState,
} from "./types";

export const DEFAULT_DESKTOP_AREA: DesktopArea = {
  width: 1024,
  height: 722, // 768 - 46 (taskbar)
};

export const INITIAL_Z_INDEX = 10;

export function createInitialWindowManagerState(
  registrations: WindowRegistration[] = [],
  desktopArea: DesktopArea = DEFAULT_DESKTOP_AREA,
): WindowManagerState {
  const windows: Record<string, WindowRuntimeState> = {};

  for (const reg of registrations) {
    windows[reg.id] = {
      id: reg.id,
      title: reg.title,
      icon: reg.icon,
      room: reg.room,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 0,
      bounds: { ...reg.defaultBounds },
      minSize: reg.minSize ?? DEFAULT_MIN_SIZE,
      defaultBounds: { ...reg.defaultBounds },
      persistenceVersion: reg.persistenceVersion,
    };
  }

  return {
    windows,
    windowOrder: [],
    activeWindowId: null,
    desktopArea,
    nextZIndex: INITIAL_Z_INDEX,
  };
}

export function windowManagerReducer(
  state: WindowManagerState,
  action: WindowManagerAction,
): WindowManagerState {
  switch (action.type) {
    case "REGISTER_WINDOW": {
      const reg = action.registration;
      const existing = state.windows[reg.id];

      const updated: WindowRuntimeState = existing
        ? {
            ...existing,
            title: reg.title,
            icon: reg.icon ?? existing.icon,
            room: reg.room ?? existing.room,
            minSize: reg.minSize ?? existing.minSize,
            defaultBounds: { ...reg.defaultBounds },
            persistenceVersion: reg.persistenceVersion ?? existing.persistenceVersion,
          }
        : {
            id: reg.id,
            title: reg.title,
            icon: reg.icon,
            room: reg.room,
            isOpen: false,
            isMinimized: false,
            isMaximized: false,
            zIndex: 0,
            bounds: { ...reg.defaultBounds },
            minSize: reg.minSize ?? DEFAULT_MIN_SIZE,
            defaultBounds: { ...reg.defaultBounds },
            persistenceVersion: reg.persistenceVersion,
          };

      return {
        ...state,
        windows: {
          ...state.windows,
          [reg.id]: updated,
        },
      };
    }

    case "OPEN_WINDOW": {
      const win = state.windows[action.id];
      if (!win) return state;

      const newZ = state.nextZIndex;
      const nextWindowOrder = [
        ...state.windowOrder.filter((id) => id !== action.id),
        action.id,
      ];

      if (win.isOpen) {
        return {
          ...state,
          windows: {
            ...state.windows,
            [action.id]: {
              ...win,
              isMinimized: false,
              zIndex: newZ,
            },
          },
          windowOrder: nextWindowOrder,
          activeWindowId: action.id,
          nextZIndex: newZ + 1,
        };
      }

      // Calculate cascaded position based on number of currently open windows
      const openCount = Object.values(state.windows).filter((w) => w.isOpen).length;
      const cascadedBounds = calculateCascadeBounds(
        openCount,
        win.defaultBounds,
        state.desktopArea,
        win.minSize,
      );

      const finalBounds = action.bounds
        ? clampBounds(
            { ...cascadedBounds, ...action.bounds },
            win.minSize,
            state.desktopArea,
          )
        : cascadedBounds;

      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: {
            ...win,
            isOpen: true,
            isMinimized: false,
            isMaximized: false,
            bounds: finalBounds,
            zIndex: newZ,
          },
        },
        windowOrder: nextWindowOrder,
        activeWindowId: action.id,
        nextZIndex: newZ + 1,
      };
    }

    case "CLOSE_WINDOW": {
      const win = state.windows[action.id];
      if (!win || !win.isOpen) return state;

      const nextWindowOrder = state.windowOrder.filter((id) => id !== action.id);
      let nextActiveId = state.activeWindowId;

      if (state.activeWindowId === action.id) {
        // Find topmost open, non-minimized window in remaining stack
        const candidate = [...nextWindowOrder]
          .reverse()
          .find((id) => state.windows[id]?.isOpen && !state.windows[id]?.isMinimized);
        nextActiveId = candidate ?? null;
      }

      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: {
            ...win,
            isOpen: false,
            isMinimized: false,
            isMaximized: false,
          },
        },
        windowOrder: nextWindowOrder,
        activeWindowId: nextActiveId,
      };
    }

    case "MINIMIZE_WINDOW": {
      const win = state.windows[action.id];
      if (!win || !win.isOpen || win.isMinimized) return state;

      let nextActiveId = state.activeWindowId;
      if (state.activeWindowId === action.id) {
        const candidate = [...state.windowOrder]
          .reverse()
          .find(
            (id) =>
              id !== action.id &&
              state.windows[id]?.isOpen &&
              !state.windows[id]?.isMinimized,
          );
        nextActiveId = candidate ?? null;
      }

      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: {
            ...win,
            isMinimized: true,
          },
        },
        activeWindowId: nextActiveId,
      };
    }

    case "MAXIMIZE_WINDOW": {
      const win = state.windows[action.id];
      if (!win || !win.isOpen || win.isMaximized) return state;

      const newZ = state.nextZIndex;
      const nextWindowOrder = [
        ...state.windowOrder.filter((id) => id !== action.id),
        action.id,
      ];

      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: {
            ...win,
            isMaximized: true,
            isMinimized: false,
            previousBounds: { ...win.bounds },
            bounds: {
              x: 0,
              y: 0,
              width: state.desktopArea.width,
              height: state.desktopArea.height,
            },
            zIndex: newZ,
          },
        },
        windowOrder: nextWindowOrder,
        activeWindowId: action.id,
        nextZIndex: newZ + 1,
      };
    }

    case "RESTORE_WINDOW": {
      const win = state.windows[action.id];
      if (!win || !win.isOpen) return state;

      const newZ = state.nextZIndex;
      const nextWindowOrder = [
        ...state.windowOrder.filter((id) => id !== action.id),
        action.id,
      ];

      const restoredBounds = win.isMaximized
        ? win.previousBounds ?? win.defaultBounds
        : win.bounds;

      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: {
            ...win,
            isMaximized: false,
            isMinimized: false,
            bounds: clampBounds(restoredBounds, win.minSize, state.desktopArea),
            zIndex: newZ,
          },
        },
        windowOrder: nextWindowOrder,
        activeWindowId: action.id,
        nextZIndex: newZ + 1,
      };
    }

    case "TOGGLE_MAXIMIZE": {
      const win = state.windows[action.id];
      if (!win || !win.isOpen) return state;
      return windowManagerReducer(state, {
        type: win.isMaximized ? "RESTORE_WINDOW" : "MAXIMIZE_WINDOW",
        id: action.id,
      });
    }

    case "FOCUS_WINDOW": {
      const win = state.windows[action.id];
      if (!win || !win.isOpen) return state;

      // If already active, topmost, and unminimized, no state mutation
      const isTopmost =
        state.windowOrder[state.windowOrder.length - 1] === action.id;
      if (state.activeWindowId === action.id && isTopmost && !win.isMinimized) {
        return state;
      }

      const newZ = state.nextZIndex;
      const nextWindowOrder = [
        ...state.windowOrder.filter((id) => id !== action.id),
        action.id,
      ];

      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: {
            ...win,
            isMinimized: false,
            zIndex: newZ,
          },
        },
        windowOrder: nextWindowOrder,
        activeWindowId: action.id,
        nextZIndex: newZ + 1,
      };
    }

    case "MOVE_WINDOW": {
      const win = state.windows[action.id];
      if (!win || !win.isOpen) return state;

      if (win.isMaximized) {
        // Restore window on drag when maximized
        const previousWidth = win.previousBounds?.width ?? win.defaultBounds.width;
        const previousHeight = win.previousBounds?.height ?? win.defaultBounds.height;
        const restored = {
          x: action.position.x - previousWidth / 2,
          y: action.position.y,
          width: previousWidth,
          height: previousHeight,
        };
        return {
          ...state,
          windows: {
            ...state.windows,
            [action.id]: {
              ...win,
              isMaximized: false,
              bounds: clampBounds(restored, win.minSize, state.desktopArea),
            },
          },
        };
      }

      const clamped = clampBounds(
        {
          x: action.position.x,
          y: action.position.y,
          width: win.bounds.width,
          height: win.bounds.height,
        },
        win.minSize,
        state.desktopArea,
      );

      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: {
            ...win,
            bounds: clamped,
          },
        },
      };
    }

    case "RESIZE_WINDOW": {
      const win = state.windows[action.id];
      if (!win || !win.isOpen || win.isMaximized) return state;

      const clamped = clampBounds(action.bounds, win.minSize, state.desktopArea);

      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: {
            ...win,
            bounds: clamped,
          },
        },
      };
    }

    case "RESTORE_DEFAULT_LAYOUT": {
      const openWindowIds = state.windowOrder.filter((id) => state.windows[id]?.isOpen);
      const updatedWindows: Record<string, WindowRuntimeState> = { ...state.windows };

      openWindowIds.forEach((id, index) => {
        const win = updatedWindows[id];
        if (!win) return;
        const cascaded = calculateCascadeBounds(
          index,
          win.defaultBounds,
          state.desktopArea,
          win.minSize,
        );
        updatedWindows[id] = {
          ...win,
          isMaximized: false,
          isMinimized: false,
          bounds: cascaded,
        };
      });

      return {
        ...state,
        windows: updatedWindows,
      };
    }

    case "SET_DESKTOP_AREA": {
      const newArea: DesktopArea = {
        width: Math.max(action.width, 320),
        height: Math.max(action.height, 200),
      };

      const updatedWindows: Record<string, WindowRuntimeState> = {};
      for (const [id, win] of Object.entries(state.windows)) {
        if (win.isMaximized) {
          updatedWindows[id] = {
            ...win,
            bounds: {
              x: 0,
              y: 0,
              width: newArea.width,
              height: newArea.height,
            },
          };
        } else {
          updatedWindows[id] = {
            ...win,
            bounds: clampBounds(win.bounds, win.minSize, newArea),
          };
        }
      }

      return {
        ...state,
        desktopArea: newArea,
        windows: updatedWindows,
      };
    }

    default:
      return state;
  }
}
