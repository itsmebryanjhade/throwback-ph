import React, { useEffect, useRef, useState } from "react";
import { pickMircReply } from "@/lib/apps/chatarchives/replies";
import type {
  ChatArchivesAction,
  ChatArchivesState,
} from "@/lib/apps/chatarchives/types";
import { MIRC_PRESETS } from "@/lib/apps/chatarchives/data";
import styles from "./chatarchives.module.css";

type MircViewProps = {
  state: ChatArchivesState;
  dispatch: React.Dispatch<ChatArchivesAction>;
};

export function MircView({ state, dispatch }: MircViewProps) {
  const [inputText, setInputText] = useState("");
  const logEndRef = useRef<HTMLDivElement>(null);

  const activeChannel =
    state.channels.find((ch) => ch.id === state.activeChannelId) ||
    state.channels[0];

  const messages = state.mircMessages[state.activeChannelId] || [];

  useEffect(() => {
    if (typeof logEndRef.current?.scrollIntoView === "function") {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  // The channel answers back after you speak.
  const replyCounts = useRef<Record<string, number>>({});
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const channelId = state.activeChannelId;
    dispatch({
      type: "SEND_MIRC_MESSAGE",
      channelId,
      text: inputText,
    });
    setInputText("");
    timers.current.push(
      setTimeout(() => {
        const count = replyCounts.current[channelId] ?? 0;
        replyCounts.current[channelId] = count + 1;
        const reply = pickMircReply(channelId, count);
        dispatch({ type: "RECEIVE_MESSAGE", service: "mirc", targetId: channelId, sender: reply.nick, text: reply.text });
      }, 1300),
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePresetSelect = (preset: string) => {
    if (!preset) return;
    setInputText(preset);
  };

  return (
    <div className={styles.mircContainer} data-testid="mirc-view">
      {/* Channels Sidebar */}
      <aside className={styles.mircSidebar}>
        <div className={styles.mircHeader}>mIRC Channels</div>
        <ul className={styles.mircChannelList} role="listbox" aria-label="IRC Channels">
          {state.channels.map((channel) => {
            const isSelected = channel.id === state.activeChannelId;
            return (
              <li
                key={channel.id}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                className={`${styles.mircChannelItem} ${isSelected ? styles.mircChannelItemActive : ""}`}
                onClick={() =>
                  dispatch({ type: "SELECT_CHANNEL", channelId: channel.id })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    dispatch({ type: "SELECT_CHANNEL", channelId: channel.id });
                  }
                }}
              >
                {channel.name} ({channel.userCount})
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Main Terminal Pane */}
      <section className={styles.mircMainPane}>
        {/* Topic Bar */}
        <div className={styles.mircTopicBar}>
          [{activeChannel?.name}] Topic: {activeChannel?.topic}
        </div>

        {/* Terminal Body */}
        <div className={styles.mircTerminalBody}>
          {/* Scrollable message logs */}
          <div
            className={styles.mircLogsArea}
            role="log"
            aria-label={`mIRC message log for ${activeChannel?.name}`}
          >
            {messages.map((msg) => {
              if (msg.isSystem) {
                return (
                  <div key={msg.id} className={`${styles.mircLine} ${styles.mircSystem}`}>
                    *** [{msg.timestamp}] {msg.text}
                  </div>
                );
              }

              if (msg.sender === "*") {
                return (
                  <div key={msg.id} className={`${styles.mircLine} ${styles.mircAction}`}>
                    * [{msg.timestamp}] {msg.text}
                  </div>
                );
              }

              const isMe = msg.isMe || msg.sender === "miguel_ph";

              return (
                <div key={msg.id} className={styles.mircLine}>
                  <span style={{ color: "#6b7280" }}>[{msg.timestamp}]</span>{" "}
                  <span className={isMe ? styles.mircNickMe : styles.mircNickNormal}>
                    &lt;{msg.sender}&gt;
                  </span>{" "}
                  <span>{msg.text}</span>
                </div>
              );
            })}
            <div ref={logEndRef} />
          </div>

          {/* User Nicklist */}
          <aside className={styles.mircUserList} aria-label="Channel Users">
            <div style={{ fontSize: "10px", color: "#9ca3af", padding: "2px 4px", borderBottom: "1px solid #374151" }}>
              Nicks ({activeChannel?.users.length || 0})
            </div>
            {activeChannel?.users.map((u) => {
              const roleClass =
                u.role === "@"
                  ? styles.mircOp
                  : u.role === "+"
                    ? styles.mircVoice
                    : "";
              return (
                <div key={u.nick} className={`${styles.mircUserItem} ${roleClass}`}>
                  {u.role || " "}{u.nick}
                </div>
              );
            })}
          </aside>
        </div>

        {/* Input Bar */}
        <div className={styles.mircInputBar}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Type in ${activeChannel?.name} or use /me action...`}
            className={styles.mircInput}
            aria-label="IRC command input"
          />

          <label htmlFor="mirc-preset-select" className="sr-only">
            IRC Quick Presets
          </label>
          <select
            id="mirc-preset-select"
            onChange={(e) => handlePresetSelect(e.target.value)}
            className={styles.presetSelect}
            defaultValue=""
          >
            <option value="" disabled>
              -- IRC Presets --
            </option>
            {MIRC_PRESETS.map((preset) => (
              <option key={preset} value={preset}>
                {preset}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className={styles.mircSendBtn}
          >
            Send
          </button>
        </div>
      </section>
    </div>
  );
}
