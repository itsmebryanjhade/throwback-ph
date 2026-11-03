"use client";

import React from "react";
import { useToast } from "@/lib/notification-system/NotificationContext";
import { useWindowManager } from "@/lib/window-system/WindowContext";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import { nokiaReducer, INITIAL_NOKIA_STATE } from "@/lib/apps/nokia/reducer";
import type { Contact, NokiaView, PhoneProfile, SmsMessage } from "@/lib/apps/nokia/types";
import { RINGTONES } from "@/lib/apps/nokia/data";

import { NokiaScreen } from "./NokiaScreen";
import { NokiaKeypad } from "./NokiaKeypad";
import { MessageList } from "./MessageList";
import { MessageDetail } from "./MessageDetail";
import { MessageComposer } from "./MessageComposer";
import { ContactsList } from "./ContactsList";
import { PhoneSettings } from "./PhoneSettings";
import { EdsaSequenceModal } from "./EdsaSequenceModal";
import { NokiaMuseumInfo } from "./NokiaMuseumInfo";
import styles from "./nokia.module.css";
import { matchesStateShape, usePersistentReducer } from "@/lib/persistence/usePersistentReducer";

export function NokiaMessagesApp() {
  const [state, dispatch] = usePersistentReducer(nokiaReducer, INITIAL_NOKIA_STATE, {
    key: "throwback-ph:app:nokia-messages", version: 1, validate: matchesStateShape(INITIAL_NOKIA_STATE),
  });
  const windowManager = useWindowManager();
  const toast = useToast();

  const unreadInboxCount = state.messages.filter(
    (m) => m.folder === "inbox" && !m.isRead
  ).length;

  const selectedMessage = state.selectedMessageId
    ? state.messages.find((m) => m.id === state.selectedMessageId) || null
    : null;

  // Handlers
  const handleSelectTab = (view: NokiaView) => {
    dispatch({ type: "SET_VIEW", view });
  };

  const handleSelectMessage = (messageId: string) => {
    dispatch({ type: "SELECT_MESSAGE", messageId });
  };

  const handleReplyMessage = (message: SmsMessage) => {
    dispatch({
      type: "PREPARE_COMPOSE",
      recipient: message.sender,
      initialBody: `Re: `,
      replyToId: message.id,
    });
  };

  const handleForwardMessage = (message: SmsMessage) => {
    dispatch({
      type: "PREPARE_COMPOSE",
      recipient: "",
      initialBody: `Fwd: ${message.body}`,
    });
  };

  const handleDeleteMessage = (messageId: string) => {
    dispatch({ type: "DELETE_MESSAGE", messageId });
    toast.notify.info(
      "Message Deleted",
      "The message has been removed from your phone.",
      { appId: "nokia-messages", appName: "Nokia Messages" },
    );
  };

  const handleSendMessage = () => {
    const cost = state.prepaid.costPerSms;
    const recipient = state.composeRecipient || "recipient";
    dispatch({ type: "SEND_MESSAGE" });
    toast.notify.success(
      "SMS Sent",
      `Message sent to ${recipient} (-₱${cost.toFixed(2)}).`,
      { appId: "nokia-messages", appName: "Nokia Messages" },
    );
  };

  const handleSaveDraft = () => {
    dispatch({ type: "SAVE_DRAFT" });
    toast.notify.info(
      "Draft Saved",
      "Message saved to Drafts folder.",
      { appId: "nokia-messages", appName: "Nokia Messages" },
    );
  };

  const handleSetProfile = (profile: PhoneProfile) => {
    dispatch({ type: "SET_PHONE_PROFILE", profile });
    toast.notify.info(
      "Profile Updated",
      `Phone profile switched to ${profile.toUpperCase()}.`,
      { appId: "nokia-messages", appName: "Nokia Messages" },
    );
  };

  const handleSetRingtone = (ringtoneId: string) => {
    const found = RINGTONES.find((r) => r.id === ringtoneId);
    dispatch({ type: "SET_RINGTONE", ringtoneId });
    toast.notify.info(
      "Ringtone Selected",
      `Active ringtone set to ${found?.name || ringtoneId}.`,
      { appId: "nokia-messages", appName: "Nokia Messages" },
    );
  };

  const handleReloadPrepaid = (amount: number) => {
    dispatch({ type: "RELOAD_PREPAID", amount });
    toast.notify.success(
      "Prepaid Load Added",
      `Successfully loaded ₱${amount.toFixed(2)}. New balance: ₱${(
        state.prepaid.balance + amount
      ).toFixed(2)}.`,
      { appId: "nokia-messages", appName: "Nokia Messages" },
    );
  };

  const handleBroadcastEdsa = () => {
    dispatch({ type: "INJECT_EDSA_BROADCAST" });
    toast.notify.warning(
      "Urgent SMS Broadcast",
      "Incoming broadcast received: 'Go 2 EDSA Wear blk.'",
      { appId: "nokia-messages", appName: "Nokia Messages" },
    );
  };

  const handleComposeToContact = (contact: Contact) => {
    dispatch({
      type: "PREPARE_COMPOSE",
      recipient: `${contact.name} (${contact.number})`,
      initialBody: "",
    });
  };

  // Multi-tap Keypad helper actions
  const handleKeypadAppend = (char: string) => {
    dispatch({ type: "APPEND_COMPOSE_TEXT", text: char });
  };

  const handleKeypadReplaceLast = (char: string) => {
    dispatch({ type: "BACKSPACE_COMPOSE" });
    dispatch({ type: "APPEND_COMPOSE_TEXT", text: char });
  };

  const handleKeypadBackspace = () => {
    dispatch({ type: "BACKSPACE_COMPOSE" });
  };

  const handleKeypadCycleMode = () => {
    dispatch({ type: "CYCLE_KEYPAD_MODE" });
  };

  // LCD screen preview content
  const screenTitle =
    state.activeView === "compose"
      ? "Write SMS"
      : state.activeView === "detail" && selectedMessage
      ? selectedMessage.sender
      : state.activeView === "inbox"
      ? `Inbox (${unreadInboxCount} New)`
      : state.activeView === "sent"
      ? "Sent Items"
      : state.activeView === "drafts"
      ? "Drafts"
      : state.activeView === "contacts"
      ? "Contacts"
      : state.activeView === "edsa"
      ? "EDSA II Live"
      : state.activeView === "settings"
      ? "Profiles"
      : "Museum Info";

  const win = windowManager.state.windows["nokia-messages"];
  const bounds = win?.bounds || { x: 130, y: 50, width: 680, height: 560 };
  const zIndex = win?.zIndex || 1;
  const isActive = windowManager.state.activeWindowId === "nokia-messages";
  const isMinimized = !!win?.isMinimized;
  const isMaximized = !!win?.isMaximized;

  return (
    <WindowFrame
      id="nokia-messages"
      title="Nokia Messages"
      icon="📱"
      bounds={bounds}
      zIndex={zIndex}
      isActive={isActive}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      minSize={{ width: 480, height: 420 }}
      desktopArea={windowManager.state.desktopArea}
      onFocus={() => windowManager.focusWindow("nokia-messages")}
      onMove={(pos) => windowManager.moveWindow("nokia-messages", pos)}
      onResize={(newBounds) => windowManager.resizeWindow("nokia-messages", newBounds)}
      onMinimize={() => windowManager.minimizeWindow("nokia-messages")}
      onMaximize={() => windowManager.maximizeWindow("nokia-messages")}
      onRestore={() => windowManager.restoreWindow("nokia-messages")}
      onToggleMaximize={() => windowManager.toggleMaximize("nokia-messages")}
      onClose={() => windowManager.closeWindow("nokia-messages")}
      closeLabel="Close Nokia Messages"
    >
      <div
        className={styles.nokiaContainer}
        data-testid="app-shell-nokia-messages"
        data-layout-mode={isMaximized ? "maximized" : "standard"}
      >
        {/* Phone Bezel Header */}
        <header className={styles.phoneHeader}>
          <div className={styles.brandBrand}>
            <div className={styles.speakerGrille} aria-hidden="true" />
            <span className={styles.modelBadge}>Retro SMS Handset · 3310 Series</span>
          </div>
          <div
            className={`${styles.balanceBadge} ${
              state.prepaid.balance < state.prepaid.costPerSms ? styles.lowBalance : ""
            }`}
          >
            <span>💳 Load: ₱{state.prepaid.balance.toFixed(2)}</span>
          </div>
        </header>

        {/* Top Navigation Tabs */}
        <nav
          className={styles.navTabs}
          role="tablist"
          aria-label="Nokia phone message folders and settings"
        >
          <button
            type="button"
            role="tab"
            aria-selected={state.activeView === "inbox" || state.activeView === "detail"}
            className={`${styles.navTab} ${
              state.activeView === "inbox" || state.activeView === "detail"
                ? styles.navTabActive
                : ""
            }`}
            onClick={() => handleSelectTab("inbox")}
          >
            📥 Inbox
            {unreadInboxCount > 0 && (
              <span className={styles.navBadge}>{unreadInboxCount}</span>
            )}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={state.activeView === "compose"}
            className={`${styles.navTab} ${
              state.activeView === "compose" ? styles.navTabActive : ""
            }`}
            onClick={() => handleSelectTab("compose")}
          >
            ✎ Write
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={state.activeView === "sent"}
            className={`${styles.navTab} ${
              state.activeView === "sent" ? styles.navTabActive : ""
            }`}
            onClick={() => handleSelectTab("sent")}
          >
            📤 Sent
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={state.activeView === "drafts"}
            className={`${styles.navTab} ${
              state.activeView === "drafts" ? styles.navTabActive : ""
            }`}
            onClick={() => handleSelectTab("drafts")}
          >
            💾 Drafts
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={state.activeView === "contacts"}
            className={`${styles.navTab} ${
              state.activeView === "contacts" ? styles.navTabActive : ""
            }`}
            onClick={() => handleSelectTab("contacts")}
          >
            📖 Contacts
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={state.activeView === "settings"}
            className={`${styles.navTab} ${
              state.activeView === "settings" ? styles.navTabActive : ""
            }`}
            onClick={() => handleSelectTab("settings")}
          >
            ⚙ Profiles & Load
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={state.activeView === "edsa"}
            className={`${styles.navTab} ${
              state.activeView === "edsa" ? styles.navTabActive : ""
            }`}
            onClick={() => handleSelectTab("edsa")}
          >
            ★ EDSA II
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={state.activeView === "museum-info"}
            className={`${styles.navTab} ${
              state.activeView === "museum-info" ? styles.navTabActive : ""
            }`}
            onClick={() => handleSelectTab("museum-info")}
          >
            🏛 Museum Info
          </button>
        </nav>

        {/* Single Scrollable App Region */}
        <div className={styles.scrollArea}>
          <div className={styles.mainLayout}>
            {/* Left Column: Active Functional View */}
            <div>
              {state.activeView === "inbox" && (
                <MessageList
                  folder="inbox"
                  messages={state.messages}
                  onSelectMessage={handleSelectMessage}
                  onMarkAllRead={() => dispatch({ type: "MARK_ALL_READ" })}
                />
              )}

              {state.activeView === "sent" && (
                <MessageList
                  folder="sent"
                  messages={state.messages}
                  onSelectMessage={handleSelectMessage}
                />
              )}

              {state.activeView === "drafts" && (
                <MessageList
                  folder="drafts"
                  messages={state.messages}
                  onSelectMessage={handleSelectMessage}
                />
              )}

              {state.activeView === "detail" && selectedMessage && (
                <MessageDetail
                  message={selectedMessage}
                  onBack={() => dispatch({ type: "CLEAR_SELECTED_MESSAGE" })}
                  onReply={handleReplyMessage}
                  onForward={handleForwardMessage}
                  onDelete={handleDeleteMessage}
                />
              )}

              {state.activeView === "compose" && (
                <MessageComposer
                  recipient={state.composeRecipient}
                  body={state.composeBody}
                  contacts={state.contacts}
                  prepaidBalance={state.prepaid.balance}
                  costPerSms={state.prepaid.costPerSms}
                  onChangeRecipient={(recipient) =>
                    dispatch({ type: "SET_COMPOSE_RECIPIENT", recipient })
                  }
                  onChangeBody={(body) =>
                    dispatch({ type: "SET_COMPOSE_BODY", body })
                  }
                  onSend={handleSendMessage}
                  onSaveDraft={handleSaveDraft}
                  onCancel={() => dispatch({ type: "SET_VIEW", view: "inbox" })}
                />
              )}

              {state.activeView === "contacts" && (
                <ContactsList
                  contacts={state.contacts}
                  onComposeTo={handleComposeToContact}
                />
              )}

              {state.activeView === "settings" && (
                <PhoneSettings
                  currentProfile={state.phoneProfile}
                  selectedRingtoneId={state.selectedRingtoneId}
                  balance={state.prepaid.balance}
                  simProvider={state.prepaid.simProvider}
                  onSetProfile={handleSetProfile}
                  onSetRingtone={handleSetRingtone}
                  onReload={handleReloadPrepaid}
                />
              )}

              {state.activeView === "edsa" && (
                <EdsaSequenceModal
                  currentStepIndex={state.edsaStepIndex}
                  onSetStep={(index) =>
                    dispatch({ type: "SET_EDSA_STEP", stepIndex: index })
                  }
                  onBroadcastToInbox={handleBroadcastEdsa}
                />
              )}

              {state.activeView === "museum-info" && <NokiaMuseumInfo />}
            </div>

            {/* Right Column: Handset Screen Preview + Multi-tap Keypad */}
            <div className={styles.handsetExhibit} data-testid="nokia-handset-exhibit">
              <div className={styles.handsetLabel}>Interactive 3310-style exhibit · reconstructed controls</div>
              <NokiaScreen
                title={screenTitle}
                phoneProfile={state.phoneProfile}
                balance={state.prepaid.balance}
                simProvider={state.prepaid.simProvider}
              >
                {state.activeView === "compose" ? (
                  <p className={styles.lcdText}>
                    {state.composeBody || "Type message text…"}
                  </p>
                ) : state.activeView === "detail" && selectedMessage ? (
                  <p className={styles.lcdText}>{selectedMessage.body}</p>
                ) : state.activeView === "edsa" ? (
                  <p className={styles.lcdText}>
                    Jan 16, 2001: &ldquo;Go 2 EDSA Wear blk.&rdquo;
                  </p>
                ) : (
                  <p className={styles.lcdText}>
                    {unreadInboxCount} unread SMS. Press keys below to text.
                  </p>
                )}
              </NokiaScreen>

              <div style={{ marginTop: "12px" }}>
                <NokiaKeypad
                  mode={state.keypadMode}
                  isMuted={state.phoneProfile === "silent"}
                  onAppendChar={handleKeypadAppend}
                  onReplaceLastChar={handleKeypadReplaceLast}
                  onBackspace={handleKeypadBackspace}
                  onCycleMode={handleKeypadCycleMode}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}
