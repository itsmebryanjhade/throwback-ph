import React from "react";
import type {
  ChatArchivesAction,
  ChatArchivesState,
} from "@/lib/apps/chatarchives/types";
import styles from "./chatarchives.module.css";

type TranscriptsPanelProps = {
  state: ChatArchivesState;
  dispatch: React.Dispatch<ChatArchivesAction>;
};

export function TranscriptsPanel({ state, dispatch }: TranscriptsPanelProps) {
  const activeTranscript =
    state.curatedTranscripts.find(
      (t) => t.id === state.selectedTranscriptId,
    ) || state.curatedTranscripts[0];

  return (
    <div className={styles.scrollablePanel}>
      <div style={{ marginBottom: "6px" }}>
        <h3 style={{ margin: "0 0 4px 0", fontSize: "15px", color: "#4c1d95" }}>
          📜 Curated Chat Transcripts (2000–2008)
        </h3>
        <p style={{ margin: 0, fontSize: "11px", color: "#64748b" }}>
          Explore reconstructed chat logs documenting early Filipino cyber communication,
          dial-up chat protocols, and transnational connections.
        </p>
      </div>

      <div className={styles.transcriptsSplit}>
        {/* Transcript Selector */}
        <div className={styles.transcriptListCard}>
          {state.curatedTranscripts.map((t) => {
            const isSelected = t.id === state.selectedTranscriptId;
            return (
              <button
                key={t.id}
                type="button"
                className={`${styles.transcriptItemBtn} ${isSelected ? styles.transcriptItemBtnActive : ""}`}
                onClick={() =>
                  dispatch({ type: "SELECT_TRANSCRIPT", transcriptId: t.id })
                }
              >
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#1e293b" }}>
                  {t.title}
                </div>
                <div style={{ fontSize: "10px", color: "#64748b", marginTop: "2px" }}>
                  {t.service === "yahoo" ? "🟣 Yahoo! Messenger" : "🔵 mIRC"} · {t.year}
                </div>
              </button>
            );
          })}
        </div>

        {/* Transcript Content */}
        <div className={styles.transcriptDetailCard}>
          {activeTranscript && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <h4 style={{ margin: 0, fontSize: "14px", color: "#5b21b6" }}>
                  {activeTranscript.title}
                </h4>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "12px",
                    background: activeTranscript.service === "yahoo" ? "#ede9fe" : "#e0f2fe",
                    color: activeTranscript.service === "yahoo" ? "#6d28d9" : "#0369a1",
                  }}
                >
                  {activeTranscript.service === "yahoo" ? "Yahoo! Messenger" : "mIRC"} ({activeTranscript.year})
                </span>
              </div>

              <div style={{ fontSize: "11px", color: "#475569", marginBottom: "12px", lineHeight: 1.4 }}>
                <strong>Cultural Context:</strong> {activeTranscript.culturalContext}
              </div>

              <div style={{ fontSize: "10px", color: "#64748b", marginBottom: "8px" }}>
                <strong>Participants:</strong> {activeTranscript.participants.join(", ")}
              </div>

              <div
                style={{
                  background: activeTranscript.service === "yahoo" ? "#fbfbfe" : "#111827",
                  color: activeTranscript.service === "yahoo" ? "#1e293b" : "#f3f4f6",
                  border: "1px solid #cbd5e1",
                  borderRadius: "4px",
                  padding: "12px",
                  fontFamily: activeTranscript.service === "yahoo" ? "inherit" : "monospace",
                  fontSize: "11px",
                  lineHeight: 1.5,
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                {activeTranscript.lines.map((line, idx) => (
                  <div key={idx}>
                    <span style={{ color: "#94a3b8", fontSize: "10px", marginRight: "6px" }}>
                      [{line.time}]
                    </span>
                    <strong
                      style={{
                        color:
                          activeTranscript.service === "yahoo"
                            ? line.speaker === "System"
                              ? "#d97706"
                              : "#6d28d9"
                            : line.speaker === "System"
                              ? "#22c55e"
                              : "#38bdf8",
                        marginRight: "6px",
                      }}
                    >
                      {activeTranscript.service === "mirc" ? `<${line.speaker}>` : `${line.speaker}:`}
                    </strong>
                    <span>{line.text}</span>
                    {line.note && (
                      <div
                        style={{
                          fontSize: "10px",
                          fontStyle: "italic",
                          color: "#64748b",
                          paddingLeft: "16px",
                          marginTop: "2px",
                        }}
                      >
                        ↳ Note: {line.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
