import React, { useState } from "react";
import type { PhoneProfile, Ringtone } from "@/lib/apps/nokia/types";
import { RINGTONES } from "@/lib/apps/nokia/data";
import { playRingtoneMelody, stopAudioPlayback } from "@/lib/apps/nokia/audio";
import styles from "./nokia.module.css";

type PhoneSettingsProps = {
  currentProfile: PhoneProfile;
  selectedRingtoneId: string;
  balance: number;
  simProvider: string;
  onSetProfile: (profile: PhoneProfile) => void;
  onSetRingtone: (ringtoneId: string) => void;
  onReload: (amount: number) => void;
};

export function PhoneSettings({
  currentProfile,
  selectedRingtoneId,
  balance,
  simProvider,
  onSetProfile,
  onSetRingtone,
  onReload,
}: PhoneSettingsProps) {
  const [isPlayingMelody, setIsPlayingMelody] = useState(false);

  const handlePreviewRingtone = (ringtone: Ringtone) => {
    if (isPlayingMelody) {
      stopAudioPlayback();
      setIsPlayingMelody(false);
      return;
    }
    setIsPlayingMelody(true);
    playRingtoneMelody(ringtone, currentProfile === "silent", () => {
      setIsPlayingMelody(false);
    });
  };

  return (
    <div className={styles.formCard} aria-label="Phone settings, profiles, and load">
      {/* Phone Profiles */}
      <div>
        <label className={styles.formLabel}>Phone Profile Mode:</label>
        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={currentProfile === "general" ? styles.primaryBtn : styles.secondaryBtn}
            onClick={() => onSetProfile("general")}
            aria-pressed={currentProfile === "general"}
          >
            🔔 General (Rings & Beeps)
          </button>
          <button
            type="button"
            className={currentProfile === "silent" ? styles.primaryBtn : styles.secondaryBtn}
            onClick={() => onSetProfile("silent")}
            aria-pressed={currentProfile === "silent"}
          >
            📳 Silent (Vibrate Only)
          </button>
          <button
            type="button"
            className={currentProfile === "meeting" ? styles.primaryBtn : styles.secondaryBtn}
            onClick={() => onSetProfile("meeting")}
            aria-pressed={currentProfile === "meeting"}
          >
            🔇 Meeting (Discreet Beep)
          </button>
        </div>
      </div>

      {/* Ringtones */}
      <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "12px" }}>
        <label className={styles.formLabel}>Ringtone Selection:</label>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {RINGTONES.map((r) => {
            const isSelected = r.id === selectedRingtoneId;
            return (
              <div
                key={r.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  background: isSelected ? "#eff6ff" : "#f8fafc",
                  border: isSelected ? "2px solid #3b82f6" : "1px solid #cbd5e1",
                  borderRadius: "6px",
                }}
              >
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "bold", color: "#1e293b" }}>
                    {r.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b", textTransform: "capitalize" }}>
                    {r.category} melody · {r.notes.length} notes
                  </div>
                </div>

                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    style={{ fontSize: "11px", padding: "4px 8px" }}
                    onClick={() => handlePreviewRingtone(r)}
                    aria-label={`Preview melody for ${r.name}`}
                  >
                    {isPlayingMelody ? "⏹ Stop" : "▶ Preview"}
                  </button>
                  <button
                    type="button"
                    className={isSelected ? styles.primaryBtn : styles.secondaryBtn}
                    style={{ fontSize: "11px", padding: "4px 8px" }}
                    disabled={isSelected}
                    onClick={() => onSetRingtone(r.id)}
                    aria-label={`Select ${r.name} as active ringtone`}
                  >
                    {isSelected ? "✓ Active" : "Select"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prepaid Load Simulation */}
      <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "12px" }}>
        <label className={styles.formLabel}>Prepaid SIM & Load Account:</label>
        <div
          style={{
            background: "#f1f5f9",
            padding: "12px",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <div>
            <div style={{ fontSize: "12px", color: "#64748b" }}>Provider: {simProvider} Prepaid</div>
            <div style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>
              ₱{balance.toFixed(2)}
            </div>
          </div>
          <div style={{ fontSize: "11px", color: "#15803d", fontWeight: "600" }}>
            ✓ SIM Active & Registered
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => onReload(30)}
            aria-label="Top up 30 pesos load"
          >
            💳 Scratch Card ₱30.00
          </button>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => onReload(50)}
            aria-label="Top up 50 pesos load"
          >
            💳 Scratch Card ₱50.00
          </button>
        </div>
      </div>
    </div>
  );
}
