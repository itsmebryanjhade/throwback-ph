"use client";

import React, { useEffect, useState } from "react";
import { museumRooms } from "@/content/museum";
import type { MuseumAction, MuseumState } from "@/lib/museum-state";
import {
  useWindowManager,
  WindowManagerProvider,
} from "@/lib/window-system/WindowContext";
import { NotificationProvider } from "@/lib/notification-system/NotificationContext";
import {
  allAppRegistrations,
  APP_LIST,
  getAppsForRoom,
  getRoomFolder,
  ROOM_FOLDER_LIST,
} from "@/lib/apps/catalog";
import { DesktopIcon } from "./DesktopIcon";
import { DesktopGlyph, ROOM_COLORS } from "./DesktopGlyph";
import { Taskbar } from "./Taskbar";
import { WelcomeWindow } from "./WelcomeWindow";
import { MuseumWindow } from "@/components/museum/MuseumWindow";
import { RoomFolderWindow } from "@/components/apps/RoomFolderWindow";
import { RegisteredAppShell } from "@/components/apps/RegisteredAppShell";
import { FriendsterApp } from "@/components/apps/friendster/FriendsterApp";
import { NokiaMessagesApp } from "@/components/apps/nokia/NokiaMessagesApp";
import { NetCafeApp } from "@/components/apps/netcafe/NetCafeApp";
import { RealityTvVoteApp } from "@/components/apps/realitytv/RealityTvVoteApp";
import { OpmMediaPlayerApp } from "@/components/apps/opm/OpmMediaPlayerApp";
import { PinoyTubeApp } from "@/components/apps/pinoytube/PinoyTubeApp";
import { TvTambayanApp } from "@/components/apps/tvtambayan/TvTambayanApp";
import { ChatArchivesApp } from "@/components/apps/chatarchives/ChatArchivesApp";
import { PpopPassportApp } from "@/components/apps/ppoppassport/PpopPassportApp";
import { ToastContainer } from "./ToastContainer";
import { NotificationHistory } from "./NotificationHistory";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { MUSEUM_STORAGE_KEYS } from "@/lib/persistence/keys";
import { removeMuseumRecords, removeRecord } from "@/lib/persistence/storage";
import styles from "./desktop.module.css";

function DesktopShellContent({
  state,
  dispatch,
  onPersistenceReset,
}: {
  state: MuseumState;
  dispatch: React.Dispatch<MuseumAction>;
  onPersistenceReset: () => void;
}) {
  const [pendingAction, setPendingAction] = useState<
    | { kind: "app"; id: string; name: string }
    | { kind: "all" }
    | { kind: "layout" }
    | null
  >(null);
  const {
    openWindow,
    closeWindow,
    minimizeWindow,
    registerWindow,
    focusWindow,
    restoreDefaultLayout,
    state: winState,
  } = useWindowManager();

  // Sync Welcome Window
  useEffect(() => {
    if (state.welcomeOpen) {
      openWindow("welcome");
    } else {
      closeWindow("welcome");
    }
  }, [state.welcomeOpen, openWindow, closeWindow]);

  // Sync Museum Room Window
  useEffect(() => {
    if (state.activeRoom && state.museumVisibility === "open") {
      const room = museumRooms.find((candidate) => candidate.id === state.activeRoom);
      const title = room ? `ASL — ${room.shortTitle}` : "ASL";

      registerWindow({
        id: "museum",
        title,
        icon: "🏛️",
        defaultBounds: { x: 90, y: 20, width: 1040, height: 660 },
        minSize: { width: 500, height: 380 },
      });
      openWindow("museum");
    } else if (state.museumVisibility === "minimized") {
      minimizeWindow("museum");
    } else if (state.museumVisibility === "closed") {
      closeWindow("museum");
    }
  }, [
    state.activeRoom,
    state.museumVisibility,
    registerWindow,
    openWindow,
    minimizeWindow,
    closeWindow,
  ]);

  const welcomeWin = winState.windows["welcome"];
  const isWelcomeOpen = state.welcomeOpen || Boolean(welcomeWin?.isOpen);

  return (
    <main className={styles.desktop} data-testid="museum-desktop">
      <a className={styles.skipLink} href="#museum-rooms">
        Skip to museum rooms
      </a>
      <h1 className="sr-only">ASL: A tour of 2000–2010 virtual museum</h1>
      <div className={styles.brandStamp} aria-hidden="true">
        <strong>ASL</strong>
        <span>Archive · Share · Learn</span>
        <span>A tour of 2000–2010</span>
      </div>

      <aside className={styles.stickyNote} aria-label="How to use this desktop">
        <p className={styles.stickyTitle}>Paano gamitin? 📌</p>
        <ol>
          <li>
            <strong>Exhibit</strong> — read the story of a room.
          </li>
          <li>
            <strong>Folder</strong> — see that room&apos;s 3 apps with notes.
          </li>
          <li>
            <strong>Apps</strong> — click to open and play.
          </li>
        </ol>
        <p className={styles.stickyFoot}>Each row is one room. Single-click opens.</p>
      </aside>

      <nav className={styles.desktopGrid} id="museum-rooms" aria-label="Museum rooms">
        <div className={styles.startRow}>
          <DesktopIcon
            label="Start Here"
            glyph={<DesktopGlyph kind="start-here" />}
            ariaLabel="Start Here: open the museum welcome"
            tip="New here? Open the welcome guide."
            onOpen={() => {
              dispatch({ type: "OPEN_WELCOME" });
              openWindow("welcome");
              focusWindow("welcome");
            }}
          />
        </div>

        {museumRooms.map((room) => {
          const folder = getRoomFolder(room.id);
          const apps = getAppsForRoom(room.id);
          const headingId = `desktop-room-${room.id}`;
          return (
            <section
              key={room.id}
              className={styles.roomRow}
              aria-labelledby={headingId}
              data-room={room.id}
            >
              <h2 id={headingId} className={styles.roomRowLabel}>
                <span
                  className={styles.roomRowSwatch}
                  style={{ background: ROOM_COLORS[room.id].main }}
                  aria-hidden="true"
                />
                {room.shortTitle} room
              </h2>
              <div className={styles.roomRowIcons}>
                <DesktopIcon
                  label={`${room.shortTitle} Exhibit`}
                  glyph={<DesktopGlyph kind="exhibit" room={room.id} />}
                  ariaLabel={`Open ${room.shortTitle} exhibit`}
                  tip={`Read the ${room.shortTitle} room exhibits`}
                  onOpen={() => dispatch({ type: "OPEN_ROOM", roomId: room.id })}
                />
                {folder && (
                  <DesktopIcon
                    label={folder.title}
                    glyph={<DesktopGlyph kind="folder" room={room.id} />}
                    ariaLabel={`Browse ${folder.title}`}
                    tip={`All ${room.shortTitle} apps in one window`}
                    onOpen={() => {
                      openWindow(folder.id);
                      focusWindow(folder.id);
                    }}
                  />
                )}
                <span className={styles.roomRowDivider} aria-hidden="true" />
                {apps.map((app) => (
                  <DesktopIcon
                    key={app.id}
                    label={app.title}
                    glyph={<DesktopGlyph kind={app.id} room={room.id} />}
                    tip={app.tagline}
                    onOpen={() => {
                      openWindow(app.id);
                      focusWindow(app.id);
                    }}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </nav>

      {/* Windows Layer */}
      {isWelcomeOpen && <WelcomeWindow dispatch={dispatch} />}
      <MuseumWindow state={state} dispatch={dispatch} />

      {ROOM_FOLDER_LIST.map((folder) =>
        winState.windows[folder.id]?.isOpen ? (
          <RoomFolderWindow key={folder.id} folder={folder} />
        ) : null,
      )}

      {APP_LIST.map((app) => {
        if (!winState.windows[app.id]?.isOpen) return null;
        if (app.id === "friendster") {
          return <FriendsterApp key="friendster" />;
        }
        if (app.id === "nokia-messages") {
          return <NokiaMessagesApp key="nokia-messages" />;
        }
        if (app.id === "net-cafe") {
          return <NetCafeApp key="net-cafe" />;
        }
        if (app.id === "reality-tv-vote") {
          return <RealityTvVoteApp key="reality-tv-vote" />;
        }
        if (app.id === "opm-media-player") {
          return <OpmMediaPlayerApp key="opm-media-player" />;
        }
        if (app.id === "pinoytube") {
          return <PinoyTubeApp key="pinoytube" />;
        }
        if (app.id === "tv-tambayan") {
          return <TvTambayanApp key="tv-tambayan" />;
        }
        if (app.id === "chat-archives") {
          return <ChatArchivesApp key="chat-archives" />;
        }
        if (app.id === "ppop-passport") {
          return <PpopPassportApp key="ppop-passport" />;
        }
        return <RegisteredAppShell key={app.id} app={app} />;
      })}

      {/* OS Toast & History System */}
      <ToastContainer />
      <NotificationHistory />

      {/* Taskbar with Running Windows and Start Menu */}
      <Taskbar
        state={state}
        dispatch={dispatch}
        onRequestResetApp={(id, name) => setPendingAction({ kind: "app", id, name })}
        onRequestResetAll={() => setPendingAction({ kind: "all" })}
        onRequestRestoreLayout={() => setPendingAction({ kind: "layout" })}
      />
      {pendingAction && (
        <ConfirmDialog
          title={
            pendingAction.kind === "app"
              ? `Reset ${pendingAction.name}?`
              : pendingAction.kind === "all"
                ? "Reset all museum progress?"
                : "Restore default window layout?"
          }
          description={
            pendingAction.kind === "app"
              ? `This removes only your saved ${pendingAction.name} progress.`
              : pendingAction.kind === "all"
                ? "This removes saved progress for all nine museum apps and your window layout. Other browser data is not touched."
                : "Open windows will return to their default positions and sizes. App progress will stay saved."
          }
          confirmLabel={
            pendingAction.kind === "app"
              ? `Reset ${pendingAction.name}`
              : pendingAction.kind === "all"
                ? "Reset all progress"
                : "Restore layout"
          }
          onCancel={() => setPendingAction(null)}
          onConfirm={() => {
            if (pendingAction.kind === "app") {
              removeRecord(`throwback-ph:app:${pendingAction.id}`);
              onPersistenceReset();
            } else if (pendingAction.kind === "all") {
              removeMuseumRecords(MUSEUM_STORAGE_KEYS);
              onPersistenceReset();
            } else {
              restoreDefaultLayout();
            }
            setPendingAction(null);
          }}
        />
      )}
    </main>
  );
}

export function DesktopShell({
  state,
  dispatch,
}: {
  state: MuseumState;
  dispatch: React.Dispatch<MuseumAction>;
}) {
  const [persistenceRevision, setPersistenceRevision] = useState(0);
  return (
    <WindowManagerProvider key={persistenceRevision} registrations={allAppRegistrations}>
      <NotificationProvider>
        <DesktopShellContent
          state={state}
          dispatch={dispatch}
          onPersistenceReset={() => setPersistenceRevision((value) => value + 1)}
        />
      </NotificationProvider>
    </WindowManagerProvider>
  );
}
