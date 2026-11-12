"use client";

import { useEffect, useRef } from "react";
import type { MuseumAction } from "@/lib/museum-state";
import { useWindowManager } from "@/lib/window-system/WindowContext";
import { centerBounds } from "@/lib/window-system/geometry";
import { WindowFrame } from "./WindowFrame";
import styles from "./welcome.module.css";

export const WELCOME_PREFERRED_SIZE = { width: 760, height: 580 };
export const WELCOME_MIN_SIZE = { width: 360, height: 320 };

const rooms = [
  {
    symbol: "TXT",
    name: "Technology",
    examples: "Texting, net cafés, Friendster",
    tone: styles.toneTechnology,
  },
  {
    symbol: "PLAY",
    name: "Performance",
    examples: "Reality TV, OPM bands, early YouTube",
    tone: styles.tonePerformance,
  },
  {
    symbol: "WWW",
    name: "Globalization",
    examples: "Asianovelas, anime, chat rooms, P-pop",
    tone: styles.toneGlobalization,
  },
];

function useSafeWindowManager() {
  try {
    return useWindowManager();
  } catch {
    return null;
  }
}

export function WelcomeWindow({ dispatch }: { dispatch: React.Dispatch<MuseumAction> }) {
  const windowManager = useSafeWindowManager();
  const runtimeWin = windowManager?.state.windows["welcome"];
  const desktopArea = windowManager?.state.desktopArea;
  const resizeWindow = windowManager?.resizeWindow;

  const bounds = runtimeWin?.bounds ?? {
    x: 160,
    y: 60,
    ...WELCOME_PREFERRED_SIZE,
  };

  const isOpen = runtimeWin?.isOpen ?? false;
  const isMinimized = runtimeWin?.isMinimized ?? false;
  const isMaximized = runtimeWin?.isMaximized ?? false;
  const isActive = runtimeWin
    ? windowManager?.state.activeWindowId === "welcome"
    : true;
  const zIndex = runtimeWin?.zIndex ?? 5;

  // Keep the welcome window centred on the desktop (including when the browser
  // is resized) until the visitor drags or resizes it themselves.
  const placedByVisitor = useRef(false);
  const areaWidth = desktopArea?.width;
  const areaHeight = desktopArea?.height;

  useEffect(() => {
    if (!resizeWindow || !isOpen || isMaximized || placedByVisitor.current) return;
    if (!areaWidth || !areaHeight) return;
    resizeWindow(
      "welcome",
      centerBounds(
        WELCOME_PREFERRED_SIZE,
        { width: areaWidth, height: areaHeight },
        WELCOME_MIN_SIZE,
      ),
    );
  }, [resizeWindow, isOpen, isMaximized, areaWidth, areaHeight]);

  const startTour = () => {
    dispatch({ type: "START_TOUR" });
    windowManager?.closeWindow("welcome");
  };

  const exploreFreely = () => {
    dispatch({ type: "EXPLORE_FREELY" });
    windowManager?.closeWindow("welcome");
  };

  return (
    <WindowFrame
      id="welcome"
      title="Welcome to ASL"
      ariaLabelledBy="welcome-title"
      icon="🇵🇭"
      bounds={bounds}
      zIndex={zIndex}
      isActive={isActive}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      minSize={WELCOME_MIN_SIZE}
      desktopArea={desktopArea}
      onFocus={() => windowManager?.focusWindow("welcome")}
      onMove={(pos) => {
        placedByVisitor.current = true;
        windowManager?.moveWindow("welcome", pos);
      }}
      onResize={(newBounds) => {
        placedByVisitor.current = true;
        windowManager?.resizeWindow("welcome", newBounds);
      }}
      onMinimize={() => windowManager?.minimizeWindow("welcome")}
      onMaximize={() => windowManager?.maximizeWindow("welcome")}
      onRestore={() => windowManager?.restoreWindow("welcome")}
      onToggleMaximize={() => windowManager?.toggleMaximize("welcome")}
      onClose={exploreFreely}
      closeLabel="Close welcome"
    >
      <div className={styles.scroller}>
        <div className={styles.content}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>Archive · Share · Learn — Isang dekadang naka-save</p>
            <h2 id="welcome-title" className={styles.title}>
              Welcome to ASL
            </h2>
            <p className={styles.subtitle}>
              A desktop museum of Filipino life from 2000–2010.
            </p>
          </header>

          <section aria-labelledby="welcome-rooms-heading">
            <h3 id="welcome-rooms-heading" className={styles.sectionLabel}>
              Three rooms · 12 exhibits · 9 interactive apps
            </h3>
            <ul className={styles.rooms}>
              {rooms.map((room) => (
                <li key={room.name} className={styles.room}>
                  <span className={`${styles.roomSymbol} ${room.tone}`} aria-hidden="true">
                    {room.symbol}
                  </span>
                  <span className={styles.roomText}>
                    <strong>{room.name}</strong>
                    <span>{room.examples}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="welcome-start-heading">
            <h3 id="welcome-start-heading" className={styles.sectionLabel}>
              How do you want to begin?
            </h3>
            <div className={styles.choices}>
              <div className={styles.choice}>
                <button
                  className={styles.primaryButton}
                  type="button"
                  onClick={startTour}
                  aria-describedby="welcome-tour-hint"
                >
                  Start Tour
                </button>
                <p id="welcome-tour-hint" className={styles.hint}>
                  Recommended for first visits. Walk through every exhibit in order.
                </p>
              </div>
              <div className={styles.choice}>
                <button
                  className={styles.secondaryButton}
                  type="button"
                  onClick={exploreFreely}
                  aria-describedby="welcome-explore-hint"
                >
                  Explore Freely
                </button>
                <p id="welcome-explore-hint" className={styles.hint}>
                  Open any room or app from the desktop, in any order.
                </p>
              </div>
            </div>
          </section>

          <p className={styles.footnote}>
            Your progress saves in this browser. Reopen this window anytime from{" "}
            <strong>Start → Museum welcome</strong>.
          </p>
        </div>
      </div>
    </WindowFrame>
  );
}
