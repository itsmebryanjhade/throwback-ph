import React from "react";
import type { MessageFolder, SmsMessage } from "@/lib/apps/nokia/types";
import styles from "./nokia.module.css";

type MessageListProps = {
  folder: MessageFolder;
  messages: SmsMessage[];
  onSelectMessage: (id: string) => void;
  onMarkAllRead?: () => void;
};

export function MessageList({
  folder,
  messages,
  onSelectMessage,
  onMarkAllRead,
}: MessageListProps) {
  const folderMessages = messages.filter((m) => m.folder === folder);
  const unreadCount = folderMessages.filter((m) => !m.isRead).length;

  const folderTitle =
    folder === "inbox"
      ? "Inbox"
      : folder === "sent"
      ? "Sent Messages"
      : "Drafts";

  return (
    <div className={styles.listContainer}>
      <div className={styles.messageHeaderRow}>
        <span style={{ fontSize: "13px", fontWeight: "bold", color: "#334155" }}>
          {folderTitle} ({folderMessages.length})
        </span>
        {folder === "inbox" && unreadCount > 0 && onMarkAllRead && (
          <button
            type="button"
            className={styles.actionBtn}
            onClick={onMarkAllRead}
            style={{ fontSize: "11px", padding: "2px 8px" }}
          >
            Mark all read
          </button>
        )}
      </div>

      {folderMessages.length === 0 ? (
        <div
          style={{
            padding: "24px",
            textAlign: "center",
            color: "#64748b",
            fontSize: "13px",
            background: "#ffffff",
            borderRadius: "6px",
            border: "1px dashed #cbd5e1",
          }}
        >
          No messages in {folderTitle}.
        </div>
      ) : (
        folderMessages.map((msg) => {
          const displayName = folder === "inbox" ? msg.sender : `To: ${msg.recipient}`;
          return (
            <button
              key={msg.id}
              type="button"
              className={`${styles.messageItem} ${!msg.isRead ? styles.messageItemUnread : ""}`}
              onClick={() => onSelectMessage(msg.id)}
              aria-label={`Open message from ${displayName}: ${msg.preview}`}
            >
              <div className={styles.messageHeaderRow}>
                <span className={styles.messageSender}>{displayName}</span>
                <span className={styles.messageTime}>{msg.timestamp}</span>
              </div>
              <p className={styles.messagePreview}>{msg.preview}</p>
              {msg.isHistorical && (
                <span className={styles.historicalBadge}>★ Historical Document</span>
              )}
            </button>
          );
        })
      )}
    </div>
  );
}
