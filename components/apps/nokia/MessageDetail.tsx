import React from "react";
import type { SmsMessage } from "@/lib/apps/nokia/types";
import styles from "./nokia.module.css";

type MessageDetailProps = {
  message: SmsMessage;
  onBack: () => void;
  onReply: (message: SmsMessage) => void;
  onForward: (message: SmsMessage) => void;
  onDelete: (messageId: string) => void;
};

export function MessageDetail({
  message,
  onBack,
  onReply,
  onForward,
  onDelete,
}: MessageDetailProps) {
  const isSent = message.folder === "sent";

  return (
    <div className={styles.formCard} aria-label="Message details">
      <div className={styles.messageHeaderRow}>
        <button
          type="button"
          className={styles.secondaryBtn}
          onClick={onBack}
          aria-label="Back to messages list"
        >
          ← Back to List
        </button>
        <span className={styles.messageTime}>{message.timestamp}</span>
      </div>

      <div style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
        <div style={{ fontSize: "14px", fontWeight: "bold", color: "#0f172a" }}>
          {isSent ? `To: ${message.recipient}` : `From: ${message.sender}`}
        </div>
        {(message.senderNumber || message.recipientNumber) && (
          <div style={{ fontSize: "12px", color: "#64748b" }}>
            Number: {isSent ? message.recipientNumber : message.senderNumber}
          </div>
        )}
      </div>

      {message.isHistorical && (
        <div className={styles.reconstructionNotice} style={{ margin: "4px 0" }}>
          <strong style={{ display: "block", marginBottom: "4px" }}>
            ★ Historical Artifact Document
          </strong>
          <span>{message.historicalAttribution}</span>
        </div>
      )}

      <div>
        <label className={styles.formLabel}>
          {message.isHistorical ? "Widely Reported SMS Wording:" : "Message Text:"}
        </label>
        <div className={styles.edsaMessageText}>{message.body}</div>
        <div style={{ fontSize: "11px", color: "#64748b", textAlign: "right" }}>
          Length: {message.body.length} characters (1 SMS)
        </div>
      </div>

      {message.reconstructedContext && (
        <div
          style={{
            marginTop: "10px",
            padding: "8px 12px",
            background: "#f8fafc",
            border: "1px solid #cbd5e1",
            borderRadius: "4px",
            fontSize: "12px",
            color: "#334155",
          }}
        >
          <strong style={{ display: "block", marginBottom: "4px", color: "#475569" }}>
            Reconstructed educational context:
          </strong>
          <span>{message.reconstructedContext}</span>
        </div>
      )}

      <div className={styles.buttonGroup}>
        {!isSent && (
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={() => onReply(message)}
            aria-label={`Reply to ${message.sender}`}
          >
            ↩ Reply
          </button>
        )}
        <button
          type="button"
          className={styles.secondaryBtn}
          onClick={() => onForward(message)}
          aria-label="Forward this message"
        >
          ➡ Forward
        </button>
        <button
          type="button"
          className={styles.dangerBtn}
          onClick={() => onDelete(message.id)}
          aria-label="Delete message"
        >
          🗑 Delete
        </button>
      </div>
    </div>
  );
}
