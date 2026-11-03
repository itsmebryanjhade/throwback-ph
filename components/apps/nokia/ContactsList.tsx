import React from "react";
import type { Contact } from "@/lib/apps/nokia/types";
import styles from "./nokia.module.css";

type ContactsListProps = {
  contacts: Contact[];
  onComposeTo: (contact: Contact) => void;
};

export function ContactsList({ contacts, onComposeTo }: ContactsListProps) {
  return (
    <div className={styles.listContainer} aria-label="Phonebook contacts">
      <div className={styles.messageHeaderRow}>
        <span style={{ fontSize: "13px", fontWeight: "bold", color: "#334155" }}>
          Phonebook Contacts ({contacts.length})
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {contacts.map((contact) => (
          <div
            key={contact.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 14px",
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "6px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "20px" }}>{contact.avatar}</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "bold", color: "#0f172a" }}>
                  {contact.name}
                </div>
                <div style={{ fontSize: "11px", color: "#64748b" }}>
                  {contact.number} · {contact.relationship}
                </div>
              </div>
            </div>

            <button
              type="button"
              className={styles.primaryBtn}
              style={{ fontSize: "11px", padding: "4px 10px" }}
              onClick={() => onComposeTo(contact)}
              aria-label={`Send SMS to ${contact.name}`}
            >
              ✉ Text
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
