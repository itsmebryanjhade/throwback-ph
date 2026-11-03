import React, { useEffect, useRef, useState } from "react";
import { getMediaAsset } from "@/content/media";
import { LicensedVideo } from "@/components/shared/LicensedVideo";
import type {
  ChannelId,
  LocalizationMode,
  TvTambayanAction,
  TvTambayanState,
} from "@/lib/apps/tvtambayan/types";
import { LOCALIZATION_MODE_LABELS } from "@/lib/apps/tvtambayan/data";
import styles from "./tvtambayan.module.css";

type CrtScreenPanelProps = {
  state: TvTambayanState;
  dispatch: React.Dispatch<TvTambayanAction>;
  onChannelToast: (chName: string, chNum: string) => void;
  onLocalizationToast: (modeName: string) => void;
  onFavoriteToast: (isFav: boolean, title: string) => void;
};

export function renderChannelScene(channelId: ChannelId) {
  switch (channelId) {
    case "ch-02":
      // Asianovela Prime: Rainy courtyard romance
      return (
        <svg
          viewBox="0 0 320 220"
          className={styles.crtCanvas}
          role="img"
          aria-label="Asianovela romance drama in rainy garden"
        >
          <rect width="320" height="220" fill="#0f172a" />
          <path d="M 0 170 Q 160 140 320 170 L 320 220 L 0 220 Z" fill="#1e1b4b" />
          {/* Rain Streaks */}
          <line x1="40" y1="20" x2="30" y2="70" stroke="#38bdf8" strokeWidth="1" opacity="0.6" />
          <line x1="80" y1="40" x2="70" y2="90" stroke="#38bdf8" strokeWidth="1" opacity="0.5" />
          <line x1="130" y1="10" x2="120" y2="60" stroke="#38bdf8" strokeWidth="1" opacity="0.7" />
          <line x1="180" y1="30" x2="170" y2="80" stroke="#38bdf8" strokeWidth="1" opacity="0.5" />
          <line x1="230" y1="25" x2="220" y2="75" stroke="#38bdf8" strokeWidth="1" opacity="0.6" />
          <line x1="280" y1="50" x2="270" y2="100" stroke="#38bdf8" strokeWidth="1" opacity="0.6" />
          {/* Streetlamp */}
          <line x1="70" y1="70" x2="70" y2="180" stroke="#475569" strokeWidth="3" />
          <circle cx="70" cy="70" r="10" fill="#fef08a" opacity="0.9" />
          <circle cx="70" cy="70" r="30" fill="#fef08a" opacity="0.2" />
          {/* Umbrella & Lovers */}
          <path d="M 160 85 Q 195 55 230 85 Z" fill="#e11d48" />
          <circle cx="180" cy="105" r="12" fill="#fda4af" />
          <circle cx="210" cy="102" r="13" fill="#cbd5e1" />
          <rect x="174" y="117" width="14" height="40" fill="#881337" rx="4" />
          <rect x="203" y="115" width="16" height="45" fill="#1e293b" rx="4" />
          <text x="160" y="208" fill="#fda4af" fontSize="9" textAnchor="middle" fontFamily="monospace">
            CH 02 · ASIANOVELA PRIME · PRIMETIME TELESUMMER
          </text>
        </svg>
      );
    case "ch-07":
      // Afternoon Anime: Mecha robot battling invaders
      return (
        <svg
          viewBox="0 0 320 220"
          className={styles.crtCanvas}
          role="img"
          aria-label="Afternoon mecha anime robot charging laser saber"
        >
          <rect width="320" height="220" fill="#030712" />
          {/* Neon cityscape */}
          <rect x="20" y="100" width="40" height="90" fill="#1e293b" />
          <rect x="70" y="70" width="50" height="120" fill="#0f172a" />
          <rect x="200" y="80" width="45" height="110" fill="#1e293b" />
          <rect x="260" y="110" width="40" height="80" fill="#0f172a" />
          {/* Windows in buildings */}
          <circle cx="35" cy="120" r="2" fill="#38bdf8" />
          <circle cx="45" cy="140" r="2" fill="#38bdf8" />
          <circle cx="85" cy="90" r="2" fill="#fbbf24" />
          <circle cx="95" cy="110" r="2" fill="#fbbf24" />
          <circle cx="215" cy="100" r="2" fill="#38bdf8" />
          {/* Giant Robot / Mecha */}
          <rect x="135" y="60" width="50" height="50" rx="6" fill="#2563eb" stroke="#60a5fa" strokeWidth="2" />
          <circle cx="150" cy="80" r="4" fill="#facc15" />
          <circle cx="170" cy="80" r="4" fill="#facc15" />
          <polygon points="160,50 150,60 170,60" fill="#ef4444" />
          {/* Shoulders & Chest */}
          <rect x="120" y="110" width="80" height="55" rx="4" fill="#1d4ed8" stroke="#3b82f6" strokeWidth="2" />
          <circle cx="160" cy="130" r="10" fill="#38bdf8" />
          {/* Blazing energy sword */}
          <line x1="200" y1="120" x2="270" y2="40" stroke="#facc15" strokeWidth="6" strokeLinecap="round" />
          <line x1="200" y1="120" x2="270" y2="40" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <text x="160" y="208" fill="#60a5fa" fontSize="9" textAnchor="middle" fontFamily="monospace">
            CH 07 · 4:30 PM HAPON ANIME BLOCK · VOLTECH SABER
          </text>
        </svg>
      );
    case "ch-23":
      // Karaoke Tambayan: Bouncing ball across lyrics
      return (
        <svg
          viewBox="0 0 320 220"
          className={styles.crtCanvas}
          role="img"
          aria-label="Karaoke television sing-along with bouncing ball"
        >
          <rect width="320" height="220" fill="#064e3b" />
          <radialGradient id="karaokeGlow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#022c22" stopOpacity="1" />
          </radialGradient>
          <rect width="320" height="220" fill="url(#karaokeGlow)" />
          {/* Karaoke banner */}
          <rect x="40" y="30" width="240" height="35" rx="5" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
          <text x="160" y="52" fill="#713f12" fontSize="13" fontWeight="bold" textAnchor="middle">
            ★ BIRITAN SA HAPON KARAOKE ★
          </text>
          {/* Animated score box */}
          <rect x="220" y="80" width="75" height="32" rx="4" fill="#000000" stroke="#22c55e" strokeWidth="2" />
          <text x="257" y="100" fill="#22c55e" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
            98 PTS!
          </text>
          {/* Bouncing ball and lyrics */}
          <circle cx="115" cy="115" r="9" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
          <text x="160" y="150" fill="#ffffff" fontSize="15" fontWeight="bold" textAnchor="middle">
            DAHIL SA &apos;YO... AKO&apos;Y NAGBAGO...
          </text>
          <text x="160" y="175" fill="#a7f3d0" fontSize="11" textAnchor="middle">
            (Sing into mic! Follow the red bouncing ball!)
          </text>
          <text x="160" y="208" fill="#86efac" fontSize="9" textAnchor="middle" fontFamily="monospace">
            CH 23 · KARAOKE TAMBAYAN · LIVING ROOM BALLADS
          </text>
        </svg>
      );
    case "ch-41":
    default:
      // Weekend Mall Tour: Stage lights, atrium balconies, performer
      return (
        <svg
          viewBox="0 0 320 220"
          className={styles.crtCanvas}
          role="img"
          aria-label="Live weekend variety mall tour in shopping center atrium"
        >
          <rect width="320" height="220" fill="#2e1065" />
          {/* Stage spotlights */}
          <polygon points="50,0 20,180 120,180" fill="#c084fc" opacity="0.3" />
          <polygon points="270,0 200,180 300,180" fill="#f472b6" opacity="0.3" />
          {/* Multi-tier Balconies */}
          <line x1="0" y1="60" x2="320" y2="60" stroke="#581c87" strokeWidth="4" />
          <line x1="0" y1="110" x2="320" y2="110" stroke="#581c87" strokeWidth="4" />
          {/* Balcony crowd dots */}
          <circle cx="60" cy="54" r="5" fill="#d8b4fe" />
          <circle cx="85" cy="54" r="5" fill="#fbcfe8" />
          <circle cx="140" cy="54" r="5" fill="#d8b4fe" />
          <circle cx="180" cy="54" r="5" fill="#fbcfe8" />
          <circle cx="230" cy="54" r="5" fill="#d8b4fe" />
          {/* Stage floor & Performer */}
          <ellipse cx="160" cy="180" rx="90" ry="25" fill="#7e22ce" stroke="#c084fc" strokeWidth="2" />
          <circle cx="160" cy="130" r="14" fill="#fbbf24" />
          <path d="M 160 144 L 160 175 M 160 150 L 140 160 M 160 150 L 180 140" stroke="#f472b6" strokeWidth="4" strokeLinecap="round" />
          <circle cx="180" cy="140" r="4" fill="#cbd5e1" />
          <text x="160" y="208" fill="#e9d5ff" fontSize="9" textAnchor="middle" fontFamily="monospace">
            CH 41 · WEEKEND MALL ROADSHOW · LIVE FROM MEGA ATRIUM
          </text>
        </svg>
      );
  }
}

export function CrtScreenPanel({
  state,
  dispatch,
  onChannelToast,
  onLocalizationToast,
  onFavoriteToast,
}: CrtScreenPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCommercialBreak, setIsCommercialBreak] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const currentChannel =
    state.channels.find((c) => c.id === state.currentChannelId) || state.channels[0];
  const currentProgram =
    currentChannel.programs.find((p) => p.id === state.selectedProgramId) ||
    currentChannel.programs[0];
  const mediaAsset = getMediaAsset(currentChannel.mediaAssetId);
  const commercialAsset = getMediaAsset("tv-pacquiao-commercial");
  const activeMediaAsset = isCommercialBreak ? commercialAsset : mediaAsset;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = state.volume / 100;
    video.muted = state.isMuted;
    if (!state.isPoweredOn) video.pause();
  }, [state.volume, state.isMuted, state.isPoweredOn, currentChannel.id]);

  const handleChannelSelect = (chId: ChannelId) => {
    setIsCommercialBreak(false);
    dispatch({ type: "CHANGE_CHANNEL", channelId: chId });
    const ch = state.channels.find((c) => c.id === chId);
    if (ch) {
      onChannelToast(ch.name, ch.channelNumber);
    }
  };

  const handleChannelUp = () => {
    setIsCommercialBreak(false);
    dispatch({ type: "CHANNEL_UP" });
    const idx = state.channels.findIndex((c) => c.id === state.currentChannelId);
    const next = state.channels[(idx + 1) % state.channels.length];
    onChannelToast(next.name, next.channelNumber);
  };

  const handleChannelDown = () => {
    setIsCommercialBreak(false);
    dispatch({ type: "CHANNEL_DOWN" });
    const idx = state.channels.findIndex((c) => c.id === state.currentChannelId);
    const prev = state.channels[(idx - 1 + state.channels.length) % state.channels.length];
    onChannelToast(prev.name, prev.channelNumber);
  };

  const handleLocalizationChange = (mode: LocalizationMode) => {
    dispatch({ type: "SET_LOCALIZATION_MODE", mode });
    onLocalizationToast(LOCALIZATION_MODE_LABELS[mode].label);
  };

  const handleToggleFavorite = () => {
    if (!currentProgram) return;
    dispatch({ type: "TOGGLE_FAVORITE_SHOW", programId: currentProgram.id });
    onFavoriteToast(!currentProgram.isFavorite, currentProgram.title);
  };

  // Dialogue text based on active localization mode
  let activeDialogueText = currentProgram?.sampleDialogue.tagalogDub;
  if (state.localizationMode === "taglish-sub") {
    activeDialogueText = currentProgram?.sampleDialogue.taglishSub;
  } else if (state.localizationMode === "orig-sub") {
    activeDialogueText = currentProgram?.sampleDialogue.origSub;
  }

  return (
    <div className={styles.tvMainLayout}>
      {/* Left Column: CRT Television Screen & Info Card */}
      <div className={styles.crtColumn}>
        <div className={styles.crtCabinet}>
          <div className={`${styles.crtScreen} ${!state.isPoweredOn ? styles.screenOff : ""}`}>
            {state.isPoweredOn ? (
              <>
                <div className={styles.scanlineOverlay} aria-hidden="true" />
                <div className={styles.vignetteGlow} aria-hidden="true" />

                {/* On-Screen Display (OSD) */}
                {state.showOsd && (
                  <div className={styles.osdOverlay}>
                    <div className={styles.osdChannelBox}>
                      CH {currentChannel.channelNumber} {currentChannel.name.toUpperCase()}
                    </div>
                    <div className={styles.osdStationBug}>
                      {currentChannel.stationBug}
                    </div>
                  </div>
                )}

                {/* Licensed archival channel footage */}
                {activeMediaAsset && (
                  <LicensedVideo
                    key={isCommercialBreak ? "commercial-break" : currentChannel.id}
                    asset={activeMediaAsset}
                    mediaRef={videoRef}
                    className={`${styles.channelFilm} ${styles[currentChannel.id.replace("-", "")]}`}
                    onLoadingChange={setIsVideoLoading}
                  />
                )}
                {activeMediaAsset && isVideoLoading && (
                  <div className={styles.loadingOverlay} role="status">
                    Loading local broadcast…
                  </div>
                )}

                {/* Subtitle / Dialogue Banner */}
                {activeDialogueText && !isCommercialBreak && (
                  <div className={styles.dialogueBanner}>
                    <div className={styles.dialogueModeTag}>
                      [{state.localizationMode.toUpperCase().replace("-", " ")}] · {currentProgram?.title}
                    </div>
                    <div>{activeDialogueText}</div>
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>📺</div>
                <div style={{ fontWeight: 700, color: "#a1a1aa" }}>
                  TELEVISION IS POWERED OFF
                </div>
                <div style={{ fontSize: "11px", color: "#71717a", marginTop: "4px" }}>
                  Click the red POWER button on the remote to turn on broadcast
                </div>
              </div>
            )}
          </div>

          {/* CRT Cabinet Bottom Bar */}
          <div className={styles.crtBottomBar}>
            <div className={styles.speakerGrille} aria-hidden="true">
              <span className={styles.speakerSlot} />
              <span className={styles.speakerSlot} />
              <span className={styles.speakerSlot} />
              <span className={styles.speakerSlot} />
              <span className={styles.speakerSlot} />
              <span className={styles.speakerSlot} />
            </div>

            <div className={styles.powerIndicator}>
              <span
                className={`${styles.powerDot} ${
                  state.isPoweredOn ? styles.powerDotActive : ""
                }`}
                aria-hidden="true"
              />
              <span>{state.isPoweredOn ? "POWER: ON" : "STANDBY"}</span>
            </div>

            <div style={{ fontSize: "10px", color: "#a1a1aa" }}>
              VOL: {state.isMuted ? "MUTED" : `${state.volume}%`}
            </div>
          </div>
        </div>

        {/* Selected Program Information Card */}
        {currentProgram && (
          <div className={styles.showInfoCard}>
            <div className={styles.showTitleRow}>
              <div>
                <h3 className={styles.showTitle}>{currentProgram.title}</h3>
                <div className={styles.showMetaRow}>
                  <span>Channel {currentChannel.channelNumber} ({currentChannel.name})</span>
                  <span>·</span>
                  <span>{currentProgram.broadcastTime}</span>
                  <span>·</span>
                  <span>{currentProgram.genre}</span>
                </div>
              </div>

              <button
                type="button"
                className={`${styles.favShowBtn} ${
                  currentProgram.isFavorite ? styles.favShowBtnActive : ""
                }`}
                onClick={handleToggleFavorite}
                aria-label={
                  currentProgram.isFavorite
                    ? "Remove from TV Watchlist"
                    : "Add to TV Watchlist"
                }
              >
                {currentProgram.isFavorite ? "⭐ On Watchlist" : "☆ Add Watchlist"}
              </button>
            </div>

            <p className={styles.showSynopsis}>{currentProgram.synopsis}</p>

            {mediaAsset && (
              <div className={styles.archiveCredit}>
                <strong>Archival context reel:</strong> {mediaAsset.title} by {mediaAsset.creator}. This licensed film supplies Philippine visual context and is not footage of the fictional program. {" "}
                <a href={mediaAsset.sourceUrl} target="_blank" rel="noreferrer">View source &amp; license</a>
              </div>
            )}

            <div className={styles.culturalCallout}>
              <strong>Cultural Localization Note:</strong> {currentProgram.culturalNote}
            </div>

            {currentProgram.voiceCast && (
              <div style={{ fontSize: "11px", color: "#a1a1aa", marginTop: "6px" }}>
                🎙️ {currentProgram.voiceCast}
              </div>
            )}
          </div>
        )}

        {/* Dubbing & Localization Preferences */}
        <div className={styles.localizationCard}>
          <h4 className={styles.localizationTitle}>
            Audio & Localization Mode
          </h4>
          <p style={{ fontSize: "11px", color: "#a1a1aa", margin: "0 0 8px 0" }}>
            Experience how foreign shows were adapted for Philippine television audiences:
          </p>

          {(
            Object.keys(LOCALIZATION_MODE_LABELS) as LocalizationMode[]
          ).map((mode) => (
            <label key={mode} className={styles.locModeOption}>
              <input
                type="radio"
                name="loc-mode"
                value={mode}
                checked={state.localizationMode === mode}
                onChange={() => handleLocalizationChange(mode)}
              />
              <div>
                <strong style={{ color: "#f4f4f5" }}>
                  {LOCALIZATION_MODE_LABELS[mode].label}
                </strong>
                <div style={{ color: "#a1a1aa", fontSize: "10px", marginTop: "2px" }}>
                  {LOCALIZATION_MODE_LABELS[mode].desc}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Right Column: Retro Television Remote Control */}
      <div className={styles.remoteColumn}>
        <div className={styles.remoteCard} aria-label="TV Remote Control">
          <h4 className={styles.remoteTitle}>TV Remote</h4>

          {/* Power Button */}
          <div className={styles.remoteRow}>
            <button
              type="button"
              className={styles.remotePowerBtn}
              onClick={() => dispatch({ type: "TOGGLE_POWER" })}
              aria-label={state.isPoweredOn ? "Turn off television" : "Turn on television"}
            >
              ⏻ POWER
            </button>
          </div>

          <div className={styles.remoteRow}>
            <button
              type="button"
              className={styles.remoteActionBtn}
              onClick={() => setIsCommercialBreak((active) => !active)}
              aria-label={isCommercialBreak ? "Return to Program" : "Commercial Break"}
            >
              {isCommercialBreak ? "↩ PROGRAM" : "📼 AD BREAK"}
            </button>
          </div>

          {/* Channel Up / Down */}
          <div className={styles.remoteRow}>
            <button
              type="button"
              className={styles.remoteActionBtn}
              onClick={handleChannelUp}
              aria-label="Channel Up"
            >
              ▲ CH +
            </button>
            <button
              type="button"
              className={styles.remoteActionBtn}
              onClick={handleChannelDown}
              aria-label="Channel Down"
            >
              ▼ CH -
            </button>
          </div>

          {/* Volume Controls */}
          <div className={styles.remoteRow}>
            <button
              type="button"
              className={styles.remoteActionBtn}
              onClick={() => dispatch({ type: "SET_VOLUME", volume: state.volume + 5 })}
              aria-label="Volume Up"
            >
              VOL +
            </button>
            <button
              type="button"
              className={styles.remoteActionBtn}
              onClick={() => dispatch({ type: "SET_VOLUME", volume: state.volume - 5 })}
              aria-label="Volume Down"
            >
              VOL -
            </button>
            <button
              type="button"
              className={styles.remoteActionBtn}
              onClick={() => dispatch({ type: "TOGGLE_MUTE" })}
              aria-label={state.isMuted ? "Unmute TV" : "Mute TV"}
            >
              {state.isMuted ? "🔇" : "MUTE"}
            </button>
          </div>

          {/* Direct Channel Selection Keypad */}
          <div style={{ marginTop: "6px" }}>
            <div style={{ fontSize: "10px", color: "#a1a1aa", marginBottom: "4px", textAlign: "center" }}>
              Direct Channels:
            </div>
            <div className={styles.channelNumberGrid}>
              {state.channels.map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  className={`${styles.channelBtn} ${
                    state.currentChannelId === ch.id ? styles.channelBtnActive : ""
                  }`}
                  onClick={() => handleChannelSelect(ch.id)}
                  aria-pressed={state.currentChannelId === ch.id}
                  aria-label={`Tune to Channel ${ch.channelNumber}: ${ch.name}`}
                >
                  <span className={styles.chNum}>CH {ch.channelNumber}</span>
                  <span className={styles.chName}>{ch.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
