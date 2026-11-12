"use client";

import React, { useEffect, useRef, useState } from "react";
import { useToast } from "@/lib/notification-system/NotificationContext";
import { useWindowManager } from "@/lib/window-system/WindowContext";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import { nokiaReducer, INITIAL_NOKIA_STATE } from "@/lib/apps/nokia/reducer";
import { PRESET_QUICK_REPLIES, RINGTONES } from "@/lib/apps/nokia/data";
import { playRingtoneMelody } from "@/lib/apps/nokia/audio";
import type { MessageFolder, PhoneProfile } from "@/lib/apps/nokia/types";
import { matchesStateShape, usePersistentReducer } from "@/lib/persistence/usePersistentReducer";
import { PhoneDevice } from "./PhoneDevice";
import { SnakeGame, type Direction, type SnakeApi, type SnakeStatus } from "./SnakeGame";
import { EdsaSequenceModal } from "./EdsaSequenceModal";
import { NokiaMuseumInfo } from "./NokiaMuseumInfo";
import styles from "./nokia.module.css";

const TOAST_SOURCE = { appId: "nokia-messages", appName: "Nokia Messages" };
const SMS_LIMIT = 160;
const LOAD_CARDS = [30, 50, 100] as const;

type Screen =
  | { id: "home" }
  | { id: "menu" }
  | { id: "messages" }
  | { id: "folder"; folder: MessageFolder }
  | { id: "read"; messageId: string }
  | { id: "read-options"; messageId: string }
  | { id: "compose" }
  | { id: "compose-options" }
  | { id: "pick-recipient" }
  | { id: "contacts" }
  | { id: "profiles" }
  | { id: "tones" }
  | { id: "load" }
  | { id: "games" }
  | { id: "snake" }
  | { id: "notice"; title: string; text: string };

type ListItem = { key: string; label: string; detail?: string; marker?: string; ariaLabel?: string; onSelect: () => void };
type SideTab = "guide" | "edsa" | "museum-info";

const PROFILES: { id: PhoneProfile; label: string }[] = [
  { id: "general", label: "General" },
  { id: "silent", label: "Silent" },
  { id: "meeting", label: "Meeting" },
];

function useClock() {
  const [clock, setClock] = useState("12:00");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`);
    };
    tick();
    const timer = window.setInterval(tick, 30_000);
    return () => window.clearInterval(timer);
  }, []);
  return clock;
}

export function NokiaMessagesApp() {
  const [state, dispatch] = usePersistentReducer(nokiaReducer, INITIAL_NOKIA_STATE, {
    // v2: adds mission stats (reloads, Snake best score).
    key: "throwback-ph:app:nokia-messages",
    version: 2,
    validate: matchesStateShape(INITIAL_NOKIA_STATE),
  });
  const windowManager = useWindowManager();
  const toast = useToast();
  const clock = useClock();

  const [stack, setStack] = useState<Screen[]>([{ id: "home" }]);
  const [cursors, setCursors] = useState<number[]>([0]);
  const [sideTab, setSideTab] = useState<SideTab>("guide");
  const [snakeStatus, setSnakeStatus] = useState<SnakeStatus>("ready");
  const snakeApi = useRef<SnakeApi | null>(null);
  const lcdBodyRef = useRef<HTMLDivElement | null>(null);

  const screen = stack[stack.length - 1];
  const cursor = cursors[cursors.length - 1] ?? 0;
  const inbox = state.messages.filter((message) => message.folder === "inbox");
  const unread = inbox.filter((message) => !message.isRead).length;
  const isSilent = state.phoneProfile === "silent";

  // ---------- navigation helpers ----------
  const push = (next: Screen) => {
    setStack((current) => [...current, next]);
    setCursors((current) => [...current, 0]);
  };
  const reset = (next: Screen[]) => {
    setStack(next);
    setCursors(next.map(() => 0));
  };
  const back = () => {
    setStack((current) => (current.length > 1 ? current.slice(0, -1) : current));
    setCursors((current) => (current.length > 1 ? current.slice(0, -1) : current));
  };
  const moveCursor = (delta: number, length: number) => {
    if (length === 0) return;
    setCursors((current) => {
      const next = [...current];
      next[next.length - 1] = (cursor + delta + length) % length;
      return next;
    });
  };
  const notice = (title: string, text: string) => push({ id: "notice", title, text });
  const home: Screen[] = [{ id: "home" }];
  const toInbox: Screen[] = [...home, { id: "menu" }, { id: "messages" }, { id: "folder", folder: "inbox" }];

  // ---------- actions ----------
  const openCompose = (recipient = state.composeRecipient, body?: string) => {
    dispatch({ type: "PREPARE_COMPOSE", recipient, initialBody: body ?? state.composeBody });
    if (screen.id !== "compose") push({ id: "compose" });
  };

  const sendMessage = (recipientOverride?: string) => {
    const recipient = (recipientOverride ?? state.composeRecipient).trim();
    if (!state.composeBody.trim()) {
      notice("Empty", "Type a message first.");
      return;
    }
    if (!recipient) {
      push({ id: "pick-recipient" });
      return;
    }
    if (state.prepaid.balance < state.prepaid.costPerSms) {
      notice("No load", "Not enough load. Buy a scratch card in Menu → Prepaid load.");
      return;
    }
    if (recipientOverride) dispatch({ type: "SET_COMPOSE_RECIPIENT", recipient: recipientOverride });
    dispatch({ type: "SEND_MESSAGE" });
    toast.notify.success("SMS Sent", `Message sent to ${recipient} (-₱${state.prepaid.costPerSms.toFixed(2)}).`, TOAST_SOURCE);
    reset([...home, { id: "menu" }, { id: "messages" }, { id: "notice", title: "Message sent ✓", text: `To: ${recipient}` }]);
  };

  const saveDraft = () => {
    if (!state.composeBody.trim()) {
      notice("Empty", "Nothing to save yet.");
      return;
    }
    dispatch({ type: "SAVE_DRAFT" });
    toast.notify.info("Draft Saved", "Message saved to Drafts folder.", TOAST_SOURCE);
    reset([...home, { id: "menu" }, { id: "messages" }, { id: "folder", folder: "drafts" }]);
  };

  const deleteMessage = (messageId: string) => {
    dispatch({ type: "DELETE_MESSAGE", messageId });
    toast.notify.info("Message Deleted", "The message has been removed from your phone.", TOAST_SOURCE);
    setStack((current) => current.slice(0, -2));
    setCursors((current) => current.slice(0, -2));
  };

  const setProfile = (profile: PhoneProfile) => {
    dispatch({ type: "SET_PHONE_PROFILE", profile });
    toast.notify.info("Profile Updated", `Phone profile switched to ${profile.toUpperCase()}.`, TOAST_SOURCE);
  };

  const setRingtone = (ringtoneId: string) => {
    const tone = RINGTONES.find((item) => item.id === ringtoneId);
    dispatch({ type: "SET_RINGTONE", ringtoneId });
    if (tone) playRingtoneMelody(tone, isSilent);
    toast.notify.info("Ringtone Selected", `Active ringtone set to ${tone?.name ?? ringtoneId}.`, TOAST_SOURCE);
  };

  const reload = (amount: number) => {
    const newBalance = state.prepaid.balance + amount;
    dispatch({ type: "RELOAD_PREPAID", amount });
    toast.notify.success(
      "Prepaid Load Added",
      `Successfully loaded ₱${amount.toFixed(2)}. New balance: ₱${newBalance.toFixed(2)}.`,
      TOAST_SOURCE,
    );
    notice("Load added!", `₱${amount} scratch card loaded. Balance: ₱${newBalance.toFixed(2)}`);
  };

  const receiveEdsa = () => {
    dispatch({ type: "INJECT_EDSA_BROADCAST" });
    toast.notify.warning("Urgent SMS Broadcast", "Incoming broadcast received: 'Go 2 EDSA Wear blk.'", TOAST_SOURCE);
    reset([...toInbox, { id: "read", messageId: "msg-edsa-alert-live" }]);
  };

  // ---------- screens ----------
  const folderItems = (folder: MessageFolder): ListItem[] =>
    state.messages
      .filter((message) => message.folder === folder)
      .map((message) => ({
        key: message.id,
        label: folder === "inbox" ? message.sender : `To: ${message.recipient}`,
        detail: message.preview,
        marker: !message.isRead ? "✉" : undefined,
        ariaLabel: `${!message.isRead ? "Unread message" : "Message"} ${folder === "inbox" ? `from ${message.sender}` : `to ${message.recipient}`}: ${message.preview}`,
        onSelect: () => {
          dispatch({ type: "SELECT_MESSAGE", messageId: message.id });
          push({ id: "read", messageId: message.id });
        },
      }));

  let title = "";
  let softLabel = "Select";
  let items: ListItem[] | null = null;
  let content: React.ReactNode = null;
  let onSoft: () => void = () => items?.[cursor]?.onSelect();
  let onUp = () => items && moveCursor(-1, items.length);
  let onDown = () => items && moveCursor(1, items.length);
  let onDigit: (key: string) => void = () => undefined;
  let typing: React.ComponentProps<typeof PhoneDevice>["typing"];
  let onBack = back;
  let keyHints: Record<string, string> | undefined;

  const scrollLcd = (amount: number) => lcdBodyRef.current?.scrollBy?.({ top: amount });

  switch (screen.id) {
    case "home": {
      softLabel = unread > 0 ? "Read" : "Menu";
      onSoft = () => (unread > 0 ? reset(toInbox) : push({ id: "menu" }));
      onUp = () => undefined;
      onDown = () => undefined;
      content = (
        <div className={styles.homeScreen}>
          <p className={styles.homeCarrier}>{state.prepaid.simProvider.toUpperCase()}</p>
          <p className={styles.homeBalance}>Load ₱{state.prepaid.balance.toFixed(2)}</p>
          {unread > 0 ? (
            <p className={styles.homeAlert}>
              ✉ {unread} message{unread > 1 ? "s" : ""}
              <br />
              received
            </p>
          ) : (
            <p className={styles.homeHint}>Press Menu</p>
          )}
          {unread > 0 && (
            <button type="button" className={styles.lcdLink} onClick={() => push({ id: "menu" })}>
              or open Menu
            </button>
          )}
        </div>
      );
      break;
    }
    case "menu":
      title = "Menu";
      items = [
        { key: "messages", label: "✉ Messages", detail: unread > 0 ? `${unread} new` : undefined, onSelect: () => push({ id: "messages" }) },
        { key: "contacts", label: "☎ Contacts", onSelect: () => push({ id: "contacts" }) },
        { key: "profiles", label: "🔔 Profiles", detail: state.phoneProfile, onSelect: () => push({ id: "profiles" }) },
        { key: "tones", label: "♪ Tones", onSelect: () => push({ id: "tones" }) },
        { key: "load", label: "₱ Prepaid load", detail: `₱${state.prepaid.balance.toFixed(2)}`, onSelect: () => push({ id: "load" }) },
        { key: "games", label: "🐍 Games", onSelect: () => push({ id: "games" }) },
      ];
      break;
    case "messages":
      title = "Messages";
      items = [
        { key: "write", label: "Write message", onSelect: () => openCompose() },
        { key: "inbox", label: `Inbox`, detail: unread > 0 ? `${unread} new` : `${inbox.length}`, onSelect: () => push({ id: "folder", folder: "inbox" }) },
        { key: "sent", label: "Sent items", detail: String(state.messages.filter((m) => m.folder === "sent").length), onSelect: () => push({ id: "folder", folder: "sent" }) },
        { key: "drafts", label: "Drafts", detail: String(state.messages.filter((m) => m.folder === "drafts").length), onSelect: () => push({ id: "folder", folder: "drafts" }) },
      ];
      break;
    case "folder": {
      const names: Record<MessageFolder, string> = { inbox: "Inbox", sent: "Sent items", drafts: "Drafts" };
      const list = folderItems(screen.folder);
      title = `${names[screen.folder]} (${list.length})`;
      softLabel = "Open";
      items = list;
      if (list.length === 0) {
        content = <p className={styles.lcdEmpty}>Empty</p>;
        softLabel = "Back";
        onSoft = back;
      }
      break;
    }
    case "read": {
      const message = state.messages.find((item) => item.id === screen.messageId);
      if (!message) {
        content = <p className={styles.lcdEmpty}>Message deleted</p>;
        softLabel = "Back";
        onSoft = back;
        break;
      }
      const isSent = message.folder !== "inbox";
      title = isSent ? `To: ${message.recipient}` : `From: ${message.sender}`;
      softLabel = "Options";
      onSoft = () => push({ id: "read-options", messageId: message.id });
      onUp = () => scrollLcd(-40);
      onDown = () => scrollLcd(40);
      content = (
        <div className={styles.readScreen}>
          <p className={styles.readMeta}>{message.timestamp}</p>
          <p className={styles.readBody}>{message.body}</p>
        </div>
      );
      break;
    }
    case "read-options": {
      const message = state.messages.find((item) => item.id === screen.messageId);
      title = "Options";
      items = message
        ? [
            ...(message.folder === "inbox"
              ? [
                  {
                    key: "reply",
                    label: "Reply",
                    ariaLabel: `Reply to ${message.sender}`,
                    onSelect: () => {
                      dispatch({ type: "PREPARE_COMPOSE", recipient: message.sender, initialBody: "", replyToId: message.id });
                      reset([...toInbox, { id: "compose" }]);
                    },
                  },
                ]
              : []),
            {
              key: "forward",
              label: "Forward",
              ariaLabel: "Forward this message",
              onSelect: () => {
                dispatch({ type: "PREPARE_COMPOSE", recipient: "", initialBody: message.body });
                reset([...home, { id: "menu" }, { id: "messages" }, { id: "compose" }]);
              },
            },
            { key: "delete", label: "Delete", ariaLabel: "Delete message", onSelect: () => deleteMessage(message.id) },
          ]
        : [];
      break;
    }
    case "compose": {
      const length = state.composeBody.length;
      const parts = Math.max(1, Math.ceil(length / SMS_LIMIT));
      const left = parts * SMS_LIMIT - length;
      title = "Write message";
      softLabel = "Options";
      onSoft = () => push({ id: "compose-options" });
      onUp = () => undefined;
      onDown = () => undefined;
      onBack = () => (state.composeBody ? dispatch({ type: "BACKSPACE_COMPOSE" }) : back());
      typing = {
        mode: state.keypadMode,
        onAppend: (char) => dispatch({ type: "APPEND_COMPOSE_TEXT", text: char }),
        onReplaceLast: (char) => {
          dispatch({ type: "BACKSPACE_COMPOSE" });
          dispatch({ type: "APPEND_COMPOSE_TEXT", text: char });
        },
        onCycleMode: () => dispatch({ type: "CYCLE_KEYPAD_MODE" }),
      };
      content = (
        <div className={styles.composeScreen}>
          <div className={styles.composeTo}>
            <label htmlFor="sms-recipient">
              <span aria-hidden="true">To:</span>
              <span className={styles.srOnly}>To / Recipient</span>
            </label>
            <input
              id="sms-recipient"
              list="sms-contacts"
              value={state.composeRecipient}
              placeholder="name or number"
              onChange={(event) => dispatch({ type: "SET_COMPOSE_RECIPIENT", recipient: event.target.value })}
            />
            <datalist id="sms-contacts">
              {state.contacts.map((contact) => (
                <option key={contact.id} value={contact.name} />
              ))}
            </datalist>
          </div>
          <div className={styles.composeMeta}>
            <span>{state.keypadMode}</span>
            <span aria-label={`${left} characters left in message ${parts}`}>
              {left}/{parts}
            </span>
          </div>
          <label className={styles.srOnly} htmlFor="sms-body">
            Message Body
          </label>
          <textarea
            id="sms-body"
            autoFocus
            className={styles.composeBody}
            value={state.composeBody}
            placeholder="Type with the keypad or your keyboard…"
            onChange={(event) => dispatch({ type: "SET_COMPOSE_BODY", body: event.target.value })}
          />
        </div>
      );
      break;
    }
    case "compose-options": {
      const recipient = state.composeRecipient.trim();
      title = "Options";
      items = [
        { key: "send", label: "Send", detail: recipient ? `to ${recipient}` : "choose who", ariaLabel: `Send SMS to ${recipient || "recipient"}`, onSelect: () => sendMessage() },
        { key: "draft", label: "Save draft", ariaLabel: "Save current text as draft", onSelect: saveDraft },
        {
          key: "clear",
          label: "Clear text",
          onSelect: () => {
            dispatch({ type: "SET_COMPOSE_BODY", body: "" });
            back();
          },
        },
        { key: "exit", label: "Exit editor", ariaLabel: "Cancel composing", onSelect: () => reset([...home, { id: "menu" }, { id: "messages" }]) },
      ];
      break;
    }
    case "pick-recipient":
      title = "Send to:";
      items = state.contacts.map((contact) => ({
        key: contact.id,
        label: contact.name,
        detail: contact.number,
        ariaLabel: `Send to ${contact.name}`,
        onSelect: () => sendMessage(contact.name),
      }));
      break;
    case "contacts":
      title = "Contacts";
      softLabel = "Text";
      items = state.contacts.map((contact) => ({
        key: contact.id,
        label: contact.name,
        detail: contact.number,
        ariaLabel: `Text ${contact.name}`,
        onSelect: () => openCompose(contact.name, ""),
      }));
      break;
    case "profiles":
      title = "Profiles";
      items = PROFILES.map((profile) => ({
        key: profile.id,
        label: profile.label,
        marker: state.phoneProfile === profile.id ? "◉" : "○",
        ariaLabel: `Set profile ${profile.label}`,
        onSelect: () => setProfile(profile.id),
      }));
      break;
    case "tones":
      title = "Ringing tone";
      items = RINGTONES.map((tone) => ({
        key: tone.id,
        label: tone.name,
        marker: state.selectedRingtoneId === tone.id ? "◉" : "○",
        ariaLabel: `Select ringtone ${tone.name}`,
        onSelect: () => setRingtone(tone.id),
      }));
      break;
    case "load":
      title = `Load ₱${state.prepaid.balance.toFixed(2)}`;
      softLabel = "Buy";
      items = LOAD_CARDS.map((amount) => ({
        key: String(amount),
        label: `Scratch card ₱${amount}`,
        ariaLabel: `Load scratch card ₱${amount}`,
        onSelect: () => reload(amount),
      }));
      break;
    case "games":
      title = "Games";
      softLabel = "Play";
      items = [
        {
          key: "snake",
          label: "Snake II",
          detail: state.stats.snakeBest > 0 ? `best ${state.stats.snakeBest}` : "new!",
          onSelect: () => push({ id: "snake" }),
        },
      ];
      break;
    case "snake": {
      const turn = (dir: Direction) => snakeApi.current?.turn(dir);
      title = "";
      softLabel =
        snakeStatus === "playing" ? "Pause" : snakeStatus === "paused" ? "Resume" : snakeStatus === "over" ? "Again" : "Start";
      keyHints = { "2": "▲", "4": "◀", "6": "▶", "8": "▼" };
      onSoft = () => snakeApi.current?.primary();
      onUp = () => turn("up");
      onDown = () => turn("down");
      onDigit = (key) => {
        const map: Record<string, Direction> = { "2": "up", "8": "down", "4": "left", "6": "right" };
        if (map[key]) turn(map[key]);
        else if (key === "5") snakeApi.current?.primary();
      };
      content = (
        <SnakeGame
          apiRef={snakeApi}
          best={state.stats.snakeBest}
          onStatusChange={setSnakeStatus}
          onScore={(score) => dispatch({ type: "RECORD_SNAKE_SCORE", score })}
        />
      );
      break;
    }
    case "notice":
      title = screen.title;
      softLabel = "OK";
      onSoft = back;
      onUp = () => undefined;
      onDown = () => undefined;
      content = <p className={styles.noticeText}>{screen.text}</p>;
      break;
  }

  // Keep the highlighted row visible when scrolling with the rocker.
  useEffect(() => {
    lcdBodyRef.current?.querySelector?.('[data-active="true"]')?.scrollIntoView?.({ block: "nearest" });
  }, [cursor, screen]);

  // ---------- missions ----------
  const missions = [
    {
      id: "gm",
      label: "Read Nanay's GM",
      done: Boolean(state.messages.find((m) => m.id === "msg-gm")?.isRead),
      go: () => reset(toInbox),
    },
    {
      id: "reply",
      label: "Text Kiko back",
      done: state.messages.some((m) => m.id.startsWith("sent-")),
      go: () => {
        dispatch({ type: "SELECT_MESSAGE", messageId: "msg-barkada" });
        reset([...toInbox, { id: "read", messageId: "msg-barkada" }]);
      },
    },
    { id: "load", label: "Buy a ₱30 scratch card", done: state.stats.reloads > 0, go: () => reset([...home, { id: "menu" }, { id: "load" }]) },
    { id: "tone", label: "Change your ringtone", done: state.selectedRingtoneId !== INITIAL_NOKIA_STATE.selectedRingtoneId, go: () => reset([...home, { id: "menu" }, { id: "tones" }]) },
    { id: "snake", label: "Eat 1 dot in Snake II", done: state.stats.snakeBest > 0, go: () => reset([...home, { id: "menu" }, { id: "games" }, { id: "snake" }]) },
    { id: "edsa", label: "Receive the EDSA II text", done: state.messages.some((m) => m.id === "msg-edsa-alert-live"), go: () => setSideTab("edsa") },
  ];
  const missionsDone = missions.filter((mission) => mission.done).length;

  const readingMessage =
    screen.id === "read" ? state.messages.find((message) => message.id === screen.messageId) : undefined;

  const win = windowManager.state.windows["nokia-messages"];
  const bounds = win?.bounds || { x: 120, y: 20, width: 860, height: 690 };
  const zIndex = win?.zIndex || 1;
  const isActive = windowManager.state.activeWindowId === "nokia-messages";
  const isMinimized = !!win?.isMinimized;
  const isMaximized = !!win?.isMaximized;

  const sideTabs: { id: SideTab; label: string }[] = [
    { id: "guide", label: "📘 Guide" },
    { id: "edsa", label: "★ EDSA II" },
    { id: "museum-info", label: "🏛 Museum Info" },
  ];

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
      <div className={styles.nokiaContainer} data-testid="app-shell-nokia-messages" data-layout-mode={isMaximized ? "maximized" : "standard"}>
        <header className={styles.phoneHeader}>
          <span className={styles.modelBadge}>Retro SMS Handset · 3310 Series</span>
          <span className={`${styles.balanceBadge} ${state.prepaid.balance < state.prepaid.costPerSms ? styles.lowBalance : ""}`}>
            💳 Load: ₱{state.prepaid.balance.toFixed(2)}
          </span>
        </header>

        <div className={styles.scrollArea}>
          <div className={styles.mainLayout}>
            <div className={styles.phoneColumn}>
              <PhoneDevice
                carrier={state.prepaid.simProvider}
                balance={state.prepaid.balance}
                profile={state.phoneProfile}
                clock={clock}
                softLabel={softLabel}
                onSoft={onSoft}
                onBack={onBack}
                onUp={onUp}
                onDown={onDown}
                onDigit={onDigit}
                typing={typing}
                keyHints={keyHints}
                isMuted={isSilent}
              >
                {title && <h2 className={styles.lcdTitle}>{title}</h2>}
                <div className={styles.lcdScroll} ref={lcdBodyRef}>
                  {items && items.length > 0 && (
                    <ul className={styles.lcdList}>
                      {items.map((item, index) => (
                        <li key={item.key}>
                          <button
                            type="button"
                            data-active={index === cursor}
                            aria-label={item.ariaLabel ?? item.label}
                            onClick={() => {
                              setCursors((current) => {
                                const next = [...current];
                                next[next.length - 1] = index;
                                return next;
                              });
                              item.onSelect();
                            }}
                          >
                            {item.marker && <span className={styles.lcdMarker}>{item.marker}</span>}
                            <span className={styles.lcdLabel}>{item.label}</span>
                            {item.detail && <span className={styles.lcdDetail}>{item.detail}</span>}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {content}
                </div>
              </PhoneDevice>

              {readingMessage?.isHistorical && (
                <aside className={styles.exhibitLabel} aria-label="Historical message notes">
                  <strong>★ Historical Artifact Document</strong>
                  <p>
                    <b>Widely Reported SMS Wording:</b> “{readingMessage.body}”
                  </p>
                  <p>{readingMessage.historicalAttribution}</p>
                  {readingMessage.reconstructedContext && (
                    <p>
                      <b>Reconstructed educational context:</b> {readingMessage.reconstructedContext}
                    </p>
                  )}
                </aside>
              )}
            </div>

            <div className={styles.sidePanel}>
              <nav className={styles.navTabs} role="tablist" aria-label="Phone guide sections">
                {sideTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={sideTab === tab.id}
                    className={`${styles.navTab} ${sideTab === tab.id ? styles.navTabActive : ""}`}
                    onClick={() => setSideTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>

              {sideTab === "guide" && (
                <div className={styles.guide}>
                  <section className={styles.guideCard} aria-labelledby="nokia-howto">
                    <h3 id="nokia-howto">How to use the phone</h3>
                    <ul className={styles.legend}>
                      <li>
                        <span className={styles.legendNavi}>Select</span> Big middle key: does what the bottom of
                        the screen says.
                      </li>
                      <li>
                        <span className={styles.legendKey}>▲▼</span> Scroll through lists.
                      </li>
                      <li>
                        <span className={styles.legendKey}>C</span> Go back, or delete a letter.
                      </li>
                      <li>
                        <span className={styles.legendKey}>2</span> Tap once for <b>a</b>, twice for <b>b</b>, three
                        times for <b>c</b>. That&apos;s multi-tap!
                      </li>
                    </ul>
                    <p className={styles.guideTip}>Shortcut: click any line on the screen, or use your keyboard.</p>
                  </section>

                  <section className={styles.guideCard} aria-labelledby="nokia-missions">
                    <div className={styles.missionHead}>
                      <h3 id="nokia-missions">Missions</h3>
                      <span>
                        {missionsDone} of {missions.length} done
                      </span>
                    </div>
                    <span className={styles.missionTrack} aria-hidden="true">
                      <span style={{ width: `${(missionsDone / missions.length) * 100}%` }} />
                    </span>
                    <ul className={styles.missionList}>
                      {missions.map((mission) => (
                        <li key={mission.id} data-done={mission.done}>
                          <span className={styles.missionCheck} aria-hidden="true">
                            {mission.done ? "✓" : ""}
                          </span>
                          <span>{mission.label}</span>
                          {mission.done ? (
                            <span className={styles.missionDone}>Done!</span>
                          ) : (
                            <button type="button" onClick={mission.go} aria-label={`Show me: ${mission.label}`}>
                              Show me
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className={styles.guideCard} aria-labelledby="nokia-classics">
                    <h3 id="nokia-classics">Classic texts</h3>
                    <p className={styles.guideTip}>Tap one to start a message with it.</p>
                    <div className={styles.presetGrid}>
                      {PRESET_QUICK_REPLIES.map((preset) => (
                        <button key={preset} type="button" className={styles.presetBtn} onClick={() => openCompose(state.composeRecipient, preset)}>
                          + “{preset}”
                        </button>
                      ))}
                    </div>
                  </section>
                </div>
              )}

              {sideTab === "edsa" && (
                <EdsaSequenceModal
                  currentStepIndex={state.edsaStepIndex}
                  onSetStep={(index) => dispatch({ type: "SET_EDSA_STEP", stepIndex: index })}
                  onBroadcastToInbox={receiveEdsa}
                />
              )}

              {sideTab === "museum-info" && <NokiaMuseumInfo />}
            </div>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}
