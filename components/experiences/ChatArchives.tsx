"use client";

import { useRef, useState } from "react";
import type { ChatThread } from "@/content/messages";
import styles from "./experiences.module.css";

export function ChatArchives({ threads }: { threads: readonly ChatThread[] }) {
  const [activeId, setActiveId] = useState<ChatThread["id"]>(threads[0]?.id ?? "yahoo");
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());
  const active = threads.find((thread) => thread.id === activeId) ?? threads[0];

  const move = (direction: number) => {
    const current = threads.findIndex((thread) => thread.id === activeId);
    const next = threads[(current + direction + threads.length) % threads.length];
    setActiveId(next.id);
    window.setTimeout(() => tabRefs.current.get(next.id)?.focus(), 0);
  };

  return (
    <div className={styles.chatStage} data-ui>
      <section className={styles.chatWindow}>
        <header><strong>Chat Archives</strong><span>read-only</span></header>
        <div className={styles.chatTabs} role="tablist" aria-label="Chat services">
          {threads.map((thread) => (
            <button key={thread.id} ref={(node) => { if (node) tabRefs.current.set(thread.id, node); }} role="tab" aria-selected={activeId === thread.id} type="button" onClick={() => setActiveId(thread.id)} onKeyDown={(event) => { if (event.key === "ArrowRight") move(1); if (event.key === "ArrowLeft") move(-1); }}>
              {thread.label}
            </button>
          ))}
        </div>
        <div className={styles.transcript} role="tabpanel" aria-label={active?.title}>
          <h3>{active?.title}</h3>
          {active?.lines.map((line, index) => (
            <p key={`${line.speaker}-${index}`}><span>{line.time ?? "•"}</span><strong>{line.speaker}</strong><em>{line.text}</em></p>
          ))}
        </div>
        <footer>This archive is preserved for viewing. Message sending is disabled.</footer>
      </section>
    </div>
  );
}
