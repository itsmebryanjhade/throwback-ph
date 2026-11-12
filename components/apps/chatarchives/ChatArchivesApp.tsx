"use client";

import React from "react";
import { useWindowManager } from "@/lib/window-system/WindowContext";
import { useToast } from "@/lib/notification-system/NotificationContext";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import { chatArchivesReducer } from "@/lib/apps/chatarchives/reducer";
import { INITIAL_CHAT_ARCHIVES_STATE } from "@/lib/apps/chatarchives/data";
import type { ChatServiceMode } from "@/lib/apps/chatarchives/types";
import { YahooMessengerView } from "./YahooMessengerView";
import { MircView } from "./MircView";
import { TranscriptsPanel } from "./TranscriptsPanel";
import { CulturalNotesPanel } from "./CulturalNotesPanel";
import { ChatArchivesMuseumInfo } from "./ChatArchivesMuseumInfo";
import styles from "./chatarchives.module.css";
import { matchesStateShape, usePersistentReducer } from "@/lib/persistence/usePersistentReducer";

export function ChatArchivesApp() {
  const windowManager = useWindowManager();
  const toast = useToast();
  const [state, dispatch] = usePersistentReducer(
    chatArchivesReducer,
    INITIAL_CHAT_ARCHIVES_STATE,
    { key: "throwback-ph:app:chat-archives", version: 3, validate: matchesStateShape(INITIAL_CHAT_ARCHIVES_STATE) },
  );

  const handleBuzzToast = (recipient: string) => {
    toast.notify.warning(
      "⚡ Yahoo! BUZZ Sent",
      `You sent a window-shaking BUZZ! alert to ${recipient}.`,
      { appId: "chat-archives", appName: "Chat Archives" },
    );
  };

  const handleServiceChange = (mode: ChatServiceMode) => {
    dispatch({ type: "SET_SERVICE_MODE", mode });
    toast.notify.info(
      mode === "yahoo" ? "Yahoo! Messenger Active" : "mIRC Client Active",
      mode === "yahoo"
        ? "Switched to Yahoo! Messenger style interface with emoticons & BUZZ! alert simulation."
        : "Switched to classic mIRC terminal with IRC channels & commands.",
      { appId: "chat-archives", appName: "Chat Archives" },
    );
  };

  const win = windowManager.state.windows["chat-archives"];
  const bounds = win?.bounds || { x: 150, y: 30, width: 900, height: 640 };
  const zIndex = win?.zIndex || 1;
  const isActive = windowManager.state.activeWindowId === "chat-archives";
  const isMinimized = !!win?.isMinimized;
  const isMaximized = !!win?.isMaximized;

  return (
    <WindowFrame
      id="chat-archives"
      ariaLabel="Chat Archives"
      title={
        state.serviceMode === "yahoo"
          ? "Yahoo! Messenger — Chat Archives"
          : "mIRC — #pinoytambayan [Chat Archives]"
      }
      icon="💬"
      bounds={bounds}
      zIndex={zIndex}
      isActive={isActive}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      minSize={{ width: 500, height: 380 }}
      desktopArea={windowManager.state.desktopArea}
      onFocus={() => windowManager.focusWindow("chat-archives")}
      onMove={(pos) => windowManager.moveWindow("chat-archives", pos)}
      onResize={(newBounds) => windowManager.resizeWindow("chat-archives", newBounds)}
      onMinimize={() => windowManager.minimizeWindow("chat-archives")}
      onMaximize={() => windowManager.maximizeWindow("chat-archives")}
      onRestore={() => windowManager.restoreWindow("chat-archives")}
      onToggleMaximize={() => windowManager.toggleMaximize("chat-archives")}
      onClose={() => windowManager.closeWindow("chat-archives")}
    >
      <div
        className={styles.container}
        data-testid="app-shell-chat-archives"
        data-layout-mode={isMaximized ? "maximized" : "standard"}
      >
        {/* Service Switcher Bar */}
        <header className={styles.serviceSwitcher}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>💬</span>
            <span style={{ fontSize: "12px", fontWeight: 700 }}>
              Chat Archives: Instant Messaging Portal
            </span>
          </div>

          <div className={styles.serviceButtons} role="toolbar" aria-label="Chat service mode">
            <button
              type="button"
              className={`${styles.serviceBtn} ${state.serviceMode === "yahoo" ? styles.serviceBtnActiveYahoo : ""}`}
              onClick={() => handleServiceChange("yahoo")}
              aria-pressed={state.serviceMode === "yahoo"}
            >
              🟣 Yahoo! Messenger
            </button>
            <button
              type="button"
              className={`${styles.serviceBtn} ${state.serviceMode === "mirc" ? styles.serviceBtnActiveMirc : ""}`}
              onClick={() => handleServiceChange("mirc")}
              aria-pressed={state.serviceMode === "mirc"}
            >
              🔵 mIRC Client
            </button>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className={styles.navTabs} role="tablist" aria-label="Chat Archives Views">
          <button
            type="button"
            role="tab"
            aria-selected={state.activeTab === "chat"}
            className={`${styles.navTab} ${state.activeTab === "chat" ? styles.navTabActive : ""}`}
            onClick={() => dispatch({ type: "SET_TAB", tab: "chat" })}
          >
            💬 Live Chat Client
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={state.activeTab === "transcripts"}
            className={`${styles.navTab} ${state.activeTab === "transcripts" ? styles.navTabActive : ""}`}
            onClick={() => dispatch({ type: "SET_TAB", tab: "transcripts" })}
          >
            📜 Curated Transcripts
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={state.activeTab === "cultural-notes"}
            className={`${styles.navTab} ${state.activeTab === "cultural-notes" ? styles.navTabActive : ""}`}
            onClick={() => dispatch({ type: "SET_TAB", tab: "cultural-notes" })}
          >
            💡 Cultural Insights
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={state.activeTab === "museum-info"}
            className={`${styles.navTab} ${state.activeTab === "museum-info" ? styles.navTabActive : ""}`}
            onClick={() => dispatch({ type: "SET_TAB", tab: "museum-info" })}
          >
            🏛️ Museum Info
          </button>
        </nav>

        {/* Tab Panel Content */}
        <div className={styles.mainArea}>
          {state.activeTab === "chat" && (
            <div className={styles.chatStack}>
              <ol className={styles.tryStrip} aria-label="Try this">
                {state.serviceMode === "yahoo" ? (
                  <>
                    <li>💬 Say hi to xX_angel_Xx and wait for her reply</li>
                    <li>⚡ Send a BUZZ!</li>
                    <li>😊 Add an emoticon</li>
                    <li>Change your status message</li>
                    <li>Switch to mIRC (top right)</li>
                  </>
                ) : (
                  <>
                    <li>Type “hello” in #pinoytambayan</li>
                    <li>Try /me waves</li>
                    <li>Join another channel on the left</li>
                    <li>Switch back to Yahoo! Messenger</li>
                  </>
                )}
              </ol>
              {state.serviceMode === "yahoo" ? (
                <YahooMessengerView
                  state={state}
                  dispatch={dispatch}
                  onBuzzToast={handleBuzzToast}
                />
              ) : (
                <MircView state={state} dispatch={dispatch} />
              )}
            </div>
          )}

          {state.activeTab === "transcripts" && (
            <TranscriptsPanel state={state} dispatch={dispatch} />
          )}

          {state.activeTab === "cultural-notes" && <CulturalNotesPanel />}

          {state.activeTab === "museum-info" && <ChatArchivesMuseumInfo />}
        </div>
      </div>
    </WindowFrame>
  );
}
