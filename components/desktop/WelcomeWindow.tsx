"use client";

import Image from "next/image";
import type { MuseumAction } from "@/lib/museum-state";
import { useWindowManager } from "@/lib/window-system/WindowContext";
import { WindowFrame } from "./WindowFrame";
import styles from "./desktop.module.css";

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

  const bounds = runtimeWin?.bounds ?? {
    x: 160,
    y: 60,
    width: 720,
    height: 430,
  };

  const isMinimized = runtimeWin?.isMinimized ?? false;
  const isMaximized = runtimeWin?.isMaximized ?? false;
  const isActive = runtimeWin
    ? windowManager?.state.activeWindowId === "welcome"
    : true;
  const zIndex = runtimeWin?.zIndex ?? 5;

  return (
    <WindowFrame
      id="welcome"
      title="Welcome to Throwback PH"
      ariaLabelledBy="welcome-title"
      icon="🇵🇭"
      bounds={bounds}
      zIndex={zIndex}
      isActive={isActive}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      minSize={{ width: 480, height: 350 }}
      desktopArea={windowManager?.state.desktopArea}
      onFocus={() => windowManager?.focusWindow("welcome")}
      onMove={(pos) => windowManager?.moveWindow("welcome", pos)}
      onResize={(newBounds) => windowManager?.resizeWindow("welcome", newBounds)}
      onMinimize={() => windowManager?.minimizeWindow("welcome")}
      onMaximize={() => windowManager?.maximizeWindow("welcome")}
      onRestore={() => windowManager?.restoreWindow("welcome")}
      onToggleMaximize={() => windowManager?.toggleMaximize("welcome")}
      onClose={() => {
        dispatch({ type: "EXPLORE_FREELY" });
        windowManager?.closeWindow("welcome");
      }}
      closeLabel="Close welcome"
    >
      <div className={styles.welcomeBody}>
        <div className={styles.postcard} aria-hidden="true">
          <Image src="/museum/boot-www.png" alt="" fill sizes="300px" priority />
          <span className={styles.postcardStamp}>PH · 2000–2010</span>
        </div>
        <div>
          <p className={styles.introLine}>Isang dekadang naka-save.</p>
          <h2 id="welcome-title">Welcome to Throwback PH</h2>
          <p className={styles.museumKicker}>
            A desktop museum of Filipino life from 2000–2010.
          </p>
          <p>
            Explore how technology, performance, and globalization changed
            Filipino popular culture from 2000 to 2010.
          </p>
          <div className={styles.welcomeActions}>
            <button
              className={styles.primaryButton}
              type="button"
              onClick={() => {
                dispatch({ type: "START_TOUR" });
                windowManager?.closeWindow("welcome");
              }}
            >
              Start Tour
            </button>
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={() => {
                dispatch({ type: "EXPLORE_FREELY" });
                windowManager?.closeWindow("welcome");
              }}
            >
              Explore Freely
            </button>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}
