import type { DesktopArea, ResizeHandle, WindowBounds, WindowSize } from "./types";

export const TITLE_BAR_HEIGHT = 36;
export const MIN_VISIBLE_TITLEBAR_WIDTH = 100;
export const DEFAULT_MIN_SIZE: WindowSize = { width: 320, height: 200 };
export const CASCADE_OFFSET = 30;
export const CASCADE_MAX_STEPS = 6;

/**
 * Clamps window bounds within the desktop area to guarantee:
 * 1. Title bar is never lost above the screen (y >= 0)
 * 2. Title bar is reachable above the taskbar (y <= desktopHeight - TITLE_BAR_HEIGHT)
 * 3. Title bar controls remain reachable horizontally (at least 100px visible)
 * 4. Width and height satisfy minimum size and desktop dimensions
 */
export function clampBounds(
  bounds: WindowBounds,
  minSize: WindowSize = DEFAULT_MIN_SIZE,
  desktopArea: DesktopArea,
): WindowBounds {
  const safeAreaWidth = Math.max(minSize.width, desktopArea.width);
  const safeAreaHeight = Math.max(minSize.height, desktopArea.height);

  const effectiveMinWidth = Math.min(minSize.width, safeAreaWidth);
  const effectiveMinHeight = Math.min(minSize.height, safeAreaHeight);

  const width = Math.round(
    Math.max(effectiveMinWidth, Math.min(bounds.width, safeAreaWidth)),
  );
  const height = Math.round(
    Math.max(effectiveMinHeight, Math.min(bounds.height, safeAreaHeight)),
  );

  const minY = 0;
  const maxY = Math.max(0, safeAreaHeight - TITLE_BAR_HEIGHT);
  const y = Math.round(Math.min(Math.max(bounds.y, minY), maxY));

  const minX = Math.min(0, -(width - MIN_VISIBLE_TITLEBAR_WIDTH));
  const maxX = Math.max(0, safeAreaWidth - MIN_VISIBLE_TITLEBAR_WIDTH);
  const x = Math.round(Math.min(Math.max(bounds.x, minX), maxX));

  return { x, y, width, height };
}

/**
 * Calculates cascaded window position based on open window index.
 */
export function calculateCascadeBounds(
  index: number,
  defaultBounds: WindowBounds,
  desktopArea: DesktopArea,
  minSize: WindowSize = DEFAULT_MIN_SIZE,
): WindowBounds {
  const step = index % CASCADE_MAX_STEPS;
  const offset = step * CASCADE_OFFSET;

  let targetX = defaultBounds.x + offset;
  let targetY = defaultBounds.y + offset;

  // If cascading pushes it past the right or bottom of desktop, wrap around
  if (targetX + defaultBounds.width > desktopArea.width && desktopArea.width > defaultBounds.width) {
    targetX = 20 + (step * 15);
  }
  if (targetY + defaultBounds.height > desktopArea.height && desktopArea.height > defaultBounds.height) {
    targetY = 20 + (step * 15);
  }

  return clampBounds(
    {
      x: targetX,
      y: targetY,
      width: defaultBounds.width,
      height: defaultBounds.height,
    },
    minSize,
    desktopArea,
  );
}

/**
 * Resizes a window from any of the 8 resize handles while respecting minimum dimensions and desktop bounds.
 */
export function resizeFromHandle(
  currentBounds: WindowBounds,
  handle: ResizeHandle,
  delta: { x: number; y: number },
  minSize: WindowSize = DEFAULT_MIN_SIZE,
  desktopArea: DesktopArea,
): WindowBounds {
  let { x, y, width, height } = currentBounds;

  // Handle horizontal resizing
  if (handle.includes("e")) {
    width += delta.x;
  } else if (handle.includes("w")) {
    const newWidth = width - delta.x;
    if (newWidth >= minSize.width) {
      width = newWidth;
      x += delta.x;
    } else {
      x += (width - minSize.width);
      width = minSize.width;
    }
  }

  // Handle vertical resizing
  if (handle.includes("s")) {
    height += delta.y;
  } else if (handle.includes("n")) {
    const newHeight = height - delta.y;
    if (newHeight >= minSize.height) {
      height = newHeight;
      y += delta.y;
    } else {
      y += (height - minSize.height);
      height = minSize.height;
    }
  }

  // Enforce minSize
  width = Math.max(minSize.width, width);
  height = Math.max(minSize.height, height);

  return clampBounds({ x, y, width, height }, minSize, desktopArea);
}

/**
 * Returns bounds of the given size centred in the desktop area, shrinking the
 * size (never below `minSize`) so the window keeps a margin on small screens.
 */
export function centerBounds(
  preferred: WindowSize,
  desktopArea: DesktopArea,
  minSize: WindowSize = DEFAULT_MIN_SIZE,
  margin = 24,
): WindowBounds {
  const width = Math.max(
    minSize.width,
    Math.min(preferred.width, desktopArea.width - margin * 2),
  );
  const height = Math.max(
    minSize.height,
    Math.min(preferred.height, desktopArea.height - margin * 2),
  );

  return clampBounds(
    {
      x: (desktopArea.width - width) / 2,
      y: (desktopArea.height - height) / 2,
      width,
      height,
    },
    minSize,
    desktopArea,
  );
}
