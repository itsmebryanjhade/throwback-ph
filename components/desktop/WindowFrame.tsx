"use client";

import React, { useCallback, useRef } from "react";
import { resizeFromHandle } from "@/lib/window-system/geometry";
import type {
  DesktopArea,
  ResizeHandle,
  WindowBounds,
  WindowPosition,
  WindowSize,
} from "@/lib/window-system/types";
import styles from "./window-frame.module.css";

export type WindowFrameProps = {
  id: string;
  title: string;
  icon?: string | React.ReactNode;
  bounds: WindowBounds;
  zIndex?: number;
  isActive?: boolean;
  isMinimized?: boolean;
  isMaximized?: boolean;
  minSize?: WindowSize;
  desktopArea?: DesktopArea;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  className?: string;
  style?: React.CSSProperties;
  onFocus?: () => void;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onRestore?: () => void;
  onToggleMaximize?: () => void;
  onMove?: (position: WindowPosition) => void;
  onResize?: (bounds: WindowBounds) => void;
  minimizeLabel?: string;
  maximizeLabel?: string;
  restoreLabel?: string;
  closeLabel?: string;
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
};

export function WindowFrame({
  id,
  title,
  icon = "ðŸ—”",
  bounds,
  zIndex = 1,
  isActive = true,
  isMinimized = false,
  isMaximized = false,
  minSize = { width: 320, height: 200 },
  desktopArea = { width: 1024, height: 722 },
  ariaLabel,
  ariaLabelledBy,
  className = "",
  style = {},
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onRestore,
  onToggleMaximize,
  onMove,
  onResize,
  minimizeLabel,
  maximizeLabel,
  restoreLabel,
  closeLabel,
  headerExtra,
  children,
}: WindowFrameProps) {
  // Phones can't juggle floating windows: below 768px every window fills the
  // screen like a phone app, with no dragging or resizing.
  const isPhone = desktopArea.width > 0 && desktopArea.width < 768;
  const fillsScreen = isMaximized || isPhone;

  const dragRef = useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
  } | null>(null);

  const resizeRef = useRef<{
    handle: ResizeHandle;
    startX: number;
    startY: number;
    initialBounds: WindowBounds;
  } | null>(null);

  // Dragging logic
  const handleTitlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only drag with primary mouse button / touch
    if (e.button !== 0 || fillsScreen) return;
    if ((e.target as HTMLElement).closest("button")) return;

    onFocus?.();

    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: bounds.x,
      initialY: bounds.y,
    };
  };

  const handleTitlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || !onMove) return;

    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;

    onMove({
      x: dragRef.current.initialX + deltaX,
      y: dragRef.current.initialY + deltaY,
    });
  };

  const handleTitlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture was already lost
    }
    dragRef.current = null;
  };

  // Keyboard navigation for moving window
  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isMaximized || !onMove) return;

    const step = e.shiftKey ? 30 : 10;
    let newX = bounds.x;
    let newY = bounds.y;

    if (e.key === "ArrowLeft") {
      newX -= step;
      e.preventDefault();
    } else if (e.key === "ArrowRight") {
      newX += step;
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      newY -= step;
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      newY += step;
      e.preventDefault();
    } else {
      return;
    }

    onMove({ x: newX, y: newY });
  };

  // Resizing logic
  const handleResizePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (e.button !== 0 || isMaximized) return;

    const handle = e.currentTarget.dataset.handle as ResizeHandle | undefined;
    if (!handle) return;

    e.stopPropagation();
    onFocus?.();

    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);

    resizeRef.current = {
      handle,
      startX: e.clientX,
      startY: e.clientY,
      initialBounds: { ...bounds },
    };
  };

  const handleResizePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!resizeRef.current || !onResize) return;

    const { handle, startX, startY, initialBounds } = resizeRef.current;
    const delta = {
      x: e.clientX - startX,
      y: e.clientY - startY,
    };

    const newBounds = resizeFromHandle(
      initialBounds,
      handle,
      delta,
      minSize,
      desktopArea,
    );

    onResize(newBounds);
  };

  const handleResizePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!resizeRef.current) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
    resizeRef.current = null;
  };

  const handleTitleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      // Ignore if double clicking a control button inside titlebar
      if ((e.target as HTMLElement).closest("button")) return;
      if (onToggleMaximize) {
        onToggleMaximize();
      } else if (isMaximized) {
        onRestore?.();
      } else {
        onMaximize?.();
      }
    },
    [isMaximized, onToggleMaximize, onMaximize, onRestore],
  );

  const windowStyle: React.CSSProperties = {
    ...style,
    zIndex,
    display: isMinimized ? "none" : undefined,
    left: fillsScreen ? 0 : bounds.x,
    top: fillsScreen ? 0 : bounds.y,
    width: fillsScreen ? "100%" : bounds.width,
    // Stop above the taskbar so Start and open apps stay reachable.
    height: isMaximized ? "100%" : isPhone ? desktopArea.height : bounds.height,
  };

  const handles: ResizeHandle[] = [
    "n",
    "s",
    "e",
    "w",
    "ne",
    "nw",
    "se",
    "sw",
  ];

  return (
    <section
      id={`window-${id}`}
      role="dialog"
      aria-label={ariaLabelledBy ? undefined : (ariaLabel || title)}
      aria-labelledby={ariaLabelledBy}
      data-window-mode={isMaximized ? "maximized" : isPhone ? "phone" : "standard"}
      data-window-active={isActive ? "true" : "false"}
      hidden={isMinimized}
      className={`${styles.windowFrame} ${
        isActive ? styles.windowFrameActive : styles.windowFrameInactive
      } ${fillsScreen ? styles.windowFrameMaximized : ""} ${className}`}
      style={windowStyle}
      onPointerDownCapture={() => {
        if (!isActive) onFocus?.();
      }}
    >
      <header
        className={`${styles.titleBar} ${
          isActive ? "" : styles.titleBarInactive
        }`}
        tabIndex={0}
        onPointerDown={handleTitlePointerDown}
        onPointerMove={handleTitlePointerMove}
        onPointerUp={handleTitlePointerUp}
        onPointerCancel={handleTitlePointerUp}
        onDoubleClick={handleTitleDoubleClick}
        onKeyDown={handleTitleKeyDown}
        aria-label={`${title} title bar. Double click to ${
          isMaximized ? "restore" : "maximize"
        }. Use arrow keys to move.`}
      >
        <div className={styles.titleLeft}>
          <span className={styles.titleIcon} aria-hidden="true">
            {icon}
          </span>
          <span className={styles.titleText}>{title}</span>
        </div>

        <div
          className={styles.windowControls}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {headerExtra}

          {onMinimize && (
            <button
              type="button"
              className={styles.controlButton}
              aria-label={minimizeLabel || `Minimize ${title}`}
              onClick={(e) => {
                e.stopPropagation();
                onMinimize();
              }}
            >
              _
            </button>
          )}

          {!isPhone && (onMaximize || onRestore || onToggleMaximize) && (
            <button
              type="button"
              className={styles.controlButton}
              aria-label={
                isMaximized
                  ? restoreLabel || `Restore ${title}`
                  : maximizeLabel || `Maximize ${title}`
              }
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleMaximize) {
                  onToggleMaximize();
                } else if (isMaximized) {
                  onRestore?.();
                } else {
                  onMaximize?.();
                }
              }}
            >
              {isMaximized ? "â" : "â–¡"}
            </button>
          )}

          {onClose && (
            <button
              type="button"
              className={`${styles.controlButton} ${styles.closeButton}`}
              aria-label={closeLabel || `Close ${title}`}
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              Ã—
            </button>
          )}
        </div>
      </header>

      <div className={styles.windowBody}>{children}</div>

      {/* Resize handles - only active when not maximized */}
      {!fillsScreen &&
        onResize &&
        handles.map((h) => {
          const classNameKey = `handle${h.toUpperCase()}` as keyof typeof styles;
          return (
            <div
              key={h}
              data-handle={h}
              data-testid={`resize-handle-${h}`}
              className={`${styles.handle} ${styles[classNameKey]}`}
              onPointerDown={handleResizePointerDown}
              onPointerMove={handleResizePointerMove}
              onPointerUp={handleResizePointerUp}
              onPointerCancel={handleResizePointerUp}
              aria-hidden="true"
            />
          );
        })}
    </section>
  );
}
