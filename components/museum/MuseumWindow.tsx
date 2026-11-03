"use client";

import { getExhibit, museumRooms } from "@/content/museum";
import { getTourPosition, type MuseumAction, type MuseumState } from "@/lib/museum-state";
import { useWindowManager } from "@/lib/window-system/WindowContext";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import { ExhibitList } from "./ExhibitList";
import { ExhibitViewer } from "./ExhibitViewer";
import { RoomNavigation } from "./RoomNavigation";
import { TourComplete } from "./TourComplete";
import styles from "./museum.module.css";

function useSafeWindowManager() {
  try {
    return useWindowManager();
  } catch {
    return null;
  }
}

export function MuseumWindow({
  state,
  dispatch,
}: {
  state: MuseumState;
  dispatch: React.Dispatch<MuseumAction>;
}) {
  const room = museumRooms.find((candidate) => candidate.id === state.activeRoom);
  const exhibit = state.selectedExhibitId ? getExhibit(state.selectedExhibitId) : undefined;
  const windowManager = useSafeWindowManager();

  if (!room || state.museumVisibility === "closed") return null;
  const position = getTourPosition(state);

  const runtimeWin = windowManager?.state.windows["museum"];
  const bounds = runtimeWin?.bounds ?? {
    x: 100,
    y: 30,
    width: 880,
    height: 570,
  };

  const isMinimized = state.museumVisibility === "minimized" || Boolean(runtimeWin?.isMinimized);
  const isMaximized = runtimeWin?.isMaximized ?? false;
  const isActive = runtimeWin ? windowManager?.state.activeWindowId === "museum" : true;
  const zIndex = runtimeWin?.zIndex ?? 4;

  // Layout mode responds dynamically to the current window width
  const layoutMode: "spacious" | "medium" | "compact" =
    bounds.width >= 960 ? "spacious" : bounds.width >= 680 ? "medium" : "compact";

  return (
    <WindowFrame
      id="museum"
      title={`Throwback PH — ${room.shortTitle}`}
      ariaLabel={`${room.shortTitle} museum room`}
      icon="🏛️"
      bounds={bounds}
      zIndex={zIndex}
      isActive={isActive}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      minSize={{ width: 500, height: 380 }}
      desktopArea={windowManager?.state.desktopArea}
      style={{ "--room-color": room.color } as React.CSSProperties}
      onFocus={() => windowManager?.focusWindow("museum")}
      onMove={(pos) => windowManager?.moveWindow("museum", pos)}
      onResize={(newBounds) => windowManager?.resizeWindow("museum", newBounds)}
      onMinimize={() => {
        dispatch({ type: "MINIMIZE_MUSEUM" });
        windowManager?.minimizeWindow("museum");
      }}
      onMaximize={() => windowManager?.maximizeWindow("museum")}
      onRestore={() => {
        dispatch({ type: "RESTORE_MUSEUM" });
        windowManager?.restoreWindow("museum");
      }}
      onToggleMaximize={() => windowManager?.toggleMaximize("museum")}
      onClose={() => {
        dispatch({ type: "CLOSE_MUSEUM" });
        windowManager?.closeWindow("museum");
      }}
      minimizeLabel="Minimize museum"
      closeLabel="Close museum"
      maximizeLabel="Maximize museum"
      restoreLabel="Restore museum"
    >
      <div
        className={styles.roomContainer}
        data-layout={layoutMode}
        data-testid="museum-window-content"
      >
        <RoomNavigation state={state} dispatch={dispatch} />

        {/* Compact exhibit selector bar when window is narrow */}
        {layoutMode === "compact" && state.tourStatus !== "complete" && (
          <div className={styles.compactBar}>
            <span className={styles.compactBarLabel}>{room.shortTitle}:</span>
            <nav className={styles.compactPills} aria-label="Exhibits in this room">
              {room.exhibits.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={styles.compactPill}
                  aria-label={`View exhibit: ${item.title}`}
                  aria-current={state.selectedExhibitId === item.id ? "page" : undefined}
                  onClick={() => dispatch({ type: "SELECT_EXHIBIT", exhibitId: item.id })}
                >
                  {item.title}
                </button>
              ))}
            </nav>
          </div>
        )}

        {state.tourStatus === "complete" ? (
          <TourComplete dispatch={dispatch} />
        ) : (
          <div className={styles.roomBody}>
            {/* Column 1 in spacious and medium modes */}
            {layoutMode !== "compact" && (
              <aside className={styles.roomIntro}>
                <h2>{room.shortTitle}</h2>
                <p>{room.description}</p>
                <ExhibitList
                  exhibits={room.exhibits}
                  selectedId={state.selectedExhibitId}
                  onSelect={(exhibitId) =>
                    dispatch({ type: "SELECT_EXHIBIT", exhibitId })
                  }
                />
              </aside>
            )}

            {/* Single unified scrollable content area */}
            <div className={styles.viewerScrollArea} data-testid="museum-viewer-scroll">
              {exhibit && <ExhibitViewer exhibit={exhibit} />}
            </div>
          </div>
        )}

        {state.tourStatus === "active" && position && (
          <footer className={styles.tourBar}>
            <span>
              Exhibit {position.index + 1} of {position.total}
            </span>
            <div>
              <button
                type="button"
                disabled={position.index === 0}
                onClick={() => dispatch({ type: "PREVIOUS" })}
              >
                Previous exhibit
              </button>
              <button
                type="button"
                onClick={() => dispatch({ type: "NEXT" })}
              >
                {position.index === position.total - 1 ? "Finish tour" : "Next exhibit"}
              </button>
            </div>
          </footer>
        )}
      </div>
    </WindowFrame>
  );
}
