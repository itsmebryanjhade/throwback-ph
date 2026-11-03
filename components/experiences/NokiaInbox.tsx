"use client";

import { useEffect, useRef, useState } from "react";
import type { SmsMessage } from "@/content/messages";
import styles from "./experiences.module.css";

export function NokiaInbox({ messages }: { messages: readonly SmsMessage[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const selected = messages.find((message) => message.id === selectedId);

  const closeMessage = () => {
    const previousId = selectedId;
    setSelectedId(null);
    window.setTimeout(() => previousId && buttons.current.get(previousId)?.focus(), 0);
  };

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMessage();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <div className={styles.phoneStage} data-ui>
      <div className={styles.phone}>
        <div className={styles.phoneBrand}>NOKIA</div>
        <section className={styles.phoneScreen} aria-label="SMS inbox">
          {selected ? (
            <div className={styles.messageView}>
              <div><strong>{selected.sender}</strong><span>{selected.timestamp}</span></div>
              <p>{selected.body}</p>
              <button type="button" onClick={closeMessage} aria-label="Back to inbox">Back</button>
            </div>
          ) : (
            <>
              <header><strong>Inbox</strong><span>{messages.length} messages</span></header>
              <div className={styles.messageList}>
                {messages.map((message) => (
                  <button key={message.id} ref={(node) => { if (node) buttons.current.set(message.id, node); }} type="button" onClick={() => setSelectedId(message.id)} aria-label={`${message.sender}: ${message.preview}`}>
                    <strong>{message.sender}</strong><span>{message.preview}</span><small>{message.timestamp}</small>
                  </button>
                ))}
              </div>
            </>
          )}
        </section>
        <div className={styles.phoneKeys} aria-hidden="true"><i /><b>MENU</b><i /></div>
        <div className={styles.keypad} aria-hidden="true">{["1","2 abc","3 def","4 ghi","5 jkl","6 mno","7 pqrs","8 tuv","9 wxyz","*","0","#"].map((key) => <span key={key}>{key}</span>)}</div>
      </div>
    </div>
  );
}
