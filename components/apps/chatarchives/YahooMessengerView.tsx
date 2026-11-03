import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type {
  ChatArchivesAction,
  ChatArchivesState,
  UserPresenceStatus,
} from "@/lib/apps/chatarchives/types";
import { EMOTICONS, YAHOO_PRESETS } from "@/lib/apps/chatarchives/data";
import styles from "./chatarchives.module.css";

type YahooMessengerViewProps = {
  state: ChatArchivesState;
  dispatch: React.Dispatch<ChatArchivesAction>;
  onBuzzToast: (recipient: string) => void;
};

function ChatPortrait({
  name,
  src,
  context,
}: {
  name: string;
  src: string;
  context: "contact" | "chat";
}) {
  const [failed, setFailed] = useState(false);
  const firstName = name.split(/[ /]/)[0];

  return (
    <span className={styles.chatPortrait} aria-hidden={failed || undefined}>
      {failed ? (
        <span className={styles.chatPortraitFallback}>{firstName.slice(0, 1)}</span>
      ) : (
        <Image
          src={src}
          alt={`${firstName} fictional ${context} portrait`}
          fill
          sizes="36px"
          style={{ objectPosition: "center", objectFit: "cover" }}
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}

export function YahooMessengerView({
  state,
  dispatch,
  onBuzzToast,
}: YahooMessengerViewProps) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeContact =
    state.contacts.find((c) => c.id === state.activeContactId) ||
    state.contacts[0];

  const messages = state.yahooMessages[state.activeContactId] || [];

  // Scroll to bottom on new messages
  useEffect(() => {
    if (typeof messagesEndRef.current?.scrollIntoView === "function") {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  // Clear BUZZ shake after short animation
  useEffect(() => {
    if (state.isBuzzing) {
      const timer = setTimeout(() => {
        dispatch({ type: "CLEAR_BUZZ" });
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [state.isBuzzing, dispatch]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    dispatch({
      type: "SEND_YAHOO_MESSAGE",
      contactId: state.activeContactId,
      text: inputText,
    });
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBuzzClick = () => {
    if (!activeContact) return;
    dispatch({ type: "TRIGGER_BUZZ", contactId: state.activeContactId });
    onBuzzToast(activeContact.username);
  };

  const handlePresetSelect = (text: string) => {
    if (!text) return;
    setInputText(text);
  };

  const insertEmoticon = (symbol: string) => {
    setInputText((prev) => `${prev} ${symbol} `);
    dispatch({ type: "TOGGLE_EMOTICON_PICKER" });
  };

  return (
    <div
      className={`${styles.yahooContainer} ${state.isBuzzing ? styles.buzzShake : ""}`}
      data-testid="yahoo-messenger-view"
    >
      {/* Left Contacts Sidebar */}
      <aside className={styles.yahooSidebar}>
        {/* User's own status box */}
        <div className={styles.myProfileBox}>
          <div className={styles.profileTopRow}>
            <div className={styles.profileAvatar}>🇵🇭</div>
            <div className={styles.profileInfo}>
              <div className={styles.profileNick}>{state.myNick}</div>
              <label htmlFor="yahoo-presence" className="sr-only">
                Change Yahoo status
              </label>
              <select
                id="yahoo-presence"
                value={state.myPresence}
                onChange={(e) =>
                  dispatch({
                    type: "SET_PRESENCE",
                    status: e.target.value as UserPresenceStatus,
                  })
                }
                className={styles.statusSelect}
              >
                <option value="available">● Available</option>
                <option value="busy">● Busy (DND)</option>
                <option value="brb">● Be Right Back</option>
                <option value="invisible">○ Invisible</option>
              </select>
            </div>
          </div>
          <input
            type="text"
            value={state.myCustomStatus}
            onChange={(e) =>
              dispatch({
                type: "SET_CUSTOM_STATUS",
                customStatus: e.target.value,
              })
            }
            placeholder="Share status message..."
            className={styles.customStatusInput}
            aria-label="Custom status message"
          />
        </div>

        {/* Contacts Header */}
        <div className={styles.contactsHeader}>
          Barkada Contacts ({state.contacts.filter((c) => c.isOnline).length} Online)
        </div>

        {/* Contacts List */}
        <ul className={styles.contactsList} role="listbox" aria-label="Contacts list">
          {state.contacts.map((contact) => {
            const isSelected = contact.id === state.activeContactId;
            const dotClass =
              contact.status === "available"
                ? styles.dotAvailable
                : contact.status === "busy"
                  ? styles.dotBusy
                  : contact.status === "brb"
                    ? styles.dotBrb
                    : contact.status === "invisible"
                      ? styles.dotInvisible
                      : styles.dotOffline;

            return (
              <li
                key={contact.id}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                className={`${styles.contactItem} ${isSelected ? styles.contactItemActive : ""}`}
                onClick={() =>
                  dispatch({ type: "SELECT_CONTACT", contactId: contact.id })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    dispatch({ type: "SELECT_CONTACT", contactId: contact.id });
                  }
                }}
              >
                <span className={`${styles.contactPresenceDot} ${dotClass}`} />
                <ChatPortrait
                  name={contact.displayName}
                  src={contact.portraitSrc}
                  context="contact"
                />
                <div className={styles.contactMeta}>
                  <div className={styles.contactName}>{contact.username}</div>
                  <div className={styles.contactStatusMsg}>
                    {contact.customStatus || contact.displayName}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Main Chat Pane */}
      <section className={styles.yahooChatPane}>
        {/* Chat Header Bar */}
        <div className={styles.chatHeaderBar}>
          <div className={styles.chatHeaderInfo}>
            {activeContact && (
              <ChatPortrait
                name={activeContact.displayName}
                src={activeContact.portraitSrc}
                context="chat"
              />
            )}
            <div>
              <div className={styles.chatRecipientName}>
                {activeContact?.username} ({activeContact?.displayName})
              </div>
              <div className={styles.chatRecipientStatus}>
                Status: {activeContact?.customStatus}
              </div>
            </div>
          </div>

          <div className={styles.chatActionButtons}>
            <button
              type="button"
              onClick={handleBuzzClick}
              className={styles.buzzBtn}
              title="Send a BUZZ! to shake contact's screen"
            >
              ⚡ BUZZ!
            </button>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div
          className={styles.messagesScrollArea}
          role="log"
          aria-label={`Chat history with ${activeContact?.username}`}
        >
          {messages.map((msg) => {
            if (msg.isBuzz) {
              return (
                <div key={msg.id} className={styles.buzzAlertLine} role="alert">
                  ⚡ {msg.text} <span className={styles.msgTime}>({msg.timestamp})</span>
                </div>
              );
            }

            return (
              <div key={msg.id} className={styles.msgLine}>
                <span
                  className={msg.isMe ? styles.msgAuthorMe : styles.msgAuthorThem}
                >
                  {msg.sender}:
                </span>
                <span>{msg.text}</span>
                <span className={styles.msgTime}>{msg.timestamp}</span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Emoticon popup */}
        {state.emoticonPickerOpen && (
          <div className={styles.emoticonPopup} role="dialog" aria-label="Select Emoticon">
            {EMOTICONS.map((emo) => (
              <button
                key={emo.code}
                type="button"
                className={styles.emoticonBtn}
                title={`${emo.label} (${emo.code})`}
                onClick={() => insertEmoticon(emo.symbol)}
              >
                {emo.symbol}
              </button>
            ))}
          </div>
        )}

        {/* Chat Input Section */}
        <div className={styles.chatInputSection}>
          <div className={styles.toolbarRow}>
            <button
              type="button"
              className={styles.toolbarBtn}
              onClick={() => dispatch({ type: "TOGGLE_EMOTICON_PICKER" })}
              aria-label="Toggle Emoticon Picker"
            >
              😊 Emoticons
            </button>

            <label htmlFor="yahoo-preset-select" className="sr-only">
              Quick Presets
            </label>
            <select
              id="yahoo-preset-select"
              onChange={(e) => handlePresetSelect(e.target.value)}
              className={styles.presetSelect}
              defaultValue=""
            >
              <option value="" disabled>
                -- Quick Chat Presets --
              </option>
              {YAHOO_PRESETS.map((preset) => (
                <option key={preset} value={preset}>
                  {preset}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputSendRow}>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${activeContact?.username || "friend"}... (Press Enter to Send)`}
              className={styles.chatInputTextarea}
              aria-label="Type a message"
            />
            <button
              type="button"
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className={styles.sendBtn}
            >
              Send
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
