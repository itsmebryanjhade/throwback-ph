export type WindowPosition = {
  x: number;
  y: number;
};

export type WindowSize = {
  width: number;
  height: number;
};

export type WindowBounds = WindowPosition & WindowSize;

export type ResizeHandle =
  | "n"
  | "s"
  | "e"
  | "w"
  | "ne"
  | "nw"
  | "se"
  | "sw";

export type WindowRegistration = {
  id: string;
  title: string;
  icon?: string;
  room?: string;
  defaultBounds: WindowBounds;
  minSize: WindowSize;
  persistenceVersion?: number;
};

export type WindowRuntimeState = {
  id: string;
  title: string;
  icon?: string;
  room?: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  bounds: WindowBounds;
  previousBounds?: WindowBounds;
  minSize: WindowSize;
  defaultBounds: WindowBounds;
  persistenceVersion?: number;
};

export type DesktopArea = {
  width: number;
  height: number;
};

export type WindowManagerState = {
  windows: Record<string, WindowRuntimeState>;
  windowOrder: string[]; // Window IDs in stacking order (bottom to top)
  activeWindowId: string | null;
  desktopArea: DesktopArea;
  nextZIndex: number;
};

export type WindowManagerAction =
  | { type: "REGISTER_WINDOW"; registration: WindowRegistration }
  | { type: "OPEN_WINDOW"; id: string; bounds?: Partial<WindowBounds> }
  | { type: "CLOSE_WINDOW"; id: string }
  | { type: "MINIMIZE_WINDOW"; id: string }
  | { type: "MAXIMIZE_WINDOW"; id: string }
  | { type: "RESTORE_WINDOW"; id: string }
  | { type: "TOGGLE_MAXIMIZE"; id: string }
  | { type: "FOCUS_WINDOW"; id: string }
  | { type: "MOVE_WINDOW"; id: string; position: WindowPosition }
  | { type: "RESIZE_WINDOW"; id: string; bounds: WindowBounds }
  | { type: "RESTORE_DEFAULT_LAYOUT" }
  | { type: "SET_DESKTOP_AREA"; width: number; height: number };
