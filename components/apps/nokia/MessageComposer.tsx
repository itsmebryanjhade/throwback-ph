import React from "react";
import type { Contact } from "@/lib/apps/nokia/types";
import { PRESET_QUICK_REPLIES } from "@/lib/apps/nokia/data";
import styles from "./nokia.module.css";

type MessageComposerProps = {
  recipient: string;
  body: string;
  contacts: Contact[];
  prepaidBalance: number;
  costPerSms: number;
  onChangeRecipient: (val: string) => void;
  onChangeBody: (val: string) => void;
  onSend: () => void;
  onSaveDraft: () => void;
  onCancel: () => void;
};

export function MessageComposer({
  recipient,
  body,
  contacts,
  prepaidBalance,
  costPerSms,
  onChangeRecipient,
  onChangeBody,
  onSend,
  onSaveDraft,
  onCancel,
}: MessageComposerProps) {
  const isOutOfLoad = prepaidBalance < costPerSms;
  const charsUsed = body.length;
  const smsSegments = Math.max(1, Math.ceil(charsUsed / 160));
  const totalCost = smsSegments * costPerSms;

  const handleSelectContact = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = contacts.find((c) => c.name === e.target.value);
    if (selected) {
      onChangeRecipient(`${selected.name} (${selected.number})`);
    } else if (e.target.value) {
      onChangeRecipient(e.target.value);
    }
  };

  const handleAddPreset = (preset: string) => {
    onChangeBody(body ? `${body} ${preset}` : preset);
  };

  return (
    <div className={styles.formCard} aria-label="Compose SMS">
      <div>
        <label htmlFor="sms-recipient" className={styles.formLabel}>
          To / Recipient:
        </label>
        <div style={{ display: "flex", gap: "6px" }}>
          <input
            id="sms-recipient"
            type="text"
            className={styles.formInput}
            placeholder="Type contact name or 0917..."
            value={recipient}
            onChange={(e) => onChangeRecipient(e.target.value)}
          />
          <select
            className={styles.formInput}
            style={{ width: "160px" }}
            onChange={handleSelectContact}
            aria-label="Pick from contacts"
            defaultValue=""
          >
            <option value="" disabled>
              Pick Contact…
            </option>
            {contacts.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={styles.formLabel}>Quick Reply Presets:</label>
        <div className={styles.presetContainer}>
          {PRESET_QUICK_REPLIES.map((preset) => (
            <button
              key={preset}
              type="button"
              className={styles.presetBtn}
              onClick={() => handleAddPreset(preset)}
            >
              + &ldquo;{preset}&rdquo;
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="sms-body" className={styles.formLabel}>
          Message Body:
        </label>
        <textarea
          id="sms-body"
          className={styles.formTextarea}
          placeholder="Type message here or use phone keypad below..."
          rows={4}
          value={body}
          onChange={(e) => onChangeBody(e.target.value)}
        />
        <div className={styles.charCounter}>
          <span>
            {charsUsed} / 160 characters · {smsSegments} SMS (₱{totalCost.toFixed(2)})
          </span>
          <span style={{ color: isOutOfLoad ? "#ef4444" : "#16a34a" }}>
            Balance: ₱{prepaidBalance.toFixed(2)}
          </span>
        </div>
      </div>

      {isOutOfLoad && (
        <div className={styles.reconstructionNotice} style={{ background: "#fee2e2", borderColor: "#fca5a5", color: "#991b1b" }}>
          ⚠️ Insufficient prepaid load (₱{prepaidBalance.toFixed(2)}). You need at least ₱{costPerSms.toFixed(2)} to send an SMS. Visit <strong>Profiles & Load</strong> to top up!
        </div>
      )}

      <div className={styles.buttonGroup}>
        <button
          type="button"
          className={styles.primaryBtn}
          disabled={!body.trim() || isOutOfLoad}
          onClick={onSend}
          aria-label={`Send SMS to ${recipient || "recipient"}`}
        >
          Send SMS (₱{costPerSms.toFixed(2)})
        </button>
        <button
          type="button"
          className={styles.secondaryBtn}
          disabled={!body.trim()}
          onClick={onSaveDraft}
          aria-label="Save current text as draft"
        >
          💾 Save as Draft
        </button>
        <button
          type="button"
          className={styles.secondaryBtn}
          onClick={onCancel}
          aria-label="Cancel composing"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
