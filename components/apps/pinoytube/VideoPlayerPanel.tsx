import React, { useEffect, useRef, useState } from "react";
import { getMediaAsset } from "@/content/media";
import { LicensedVideo } from "@/components/shared/LicensedVideo";
import type {
  PinoyTubeAction,
  PinoyTubeState,
  PinoyTubeVideo,
  VideoResolution,
} from "@/lib/apps/pinoytube/types";
import { PRESET_COMMENTS } from "@/lib/apps/pinoytube/data";
import styles from "./pinoytube.module.css";

type VideoPlayerPanelProps = {
  state: PinoyTubeState;
  dispatch: React.Dispatch<PinoyTubeAction>;
  onRateToast: (rating: number, title: string) => void;
  onFavoriteToast: (isFav: boolean, title: string) => void;
  onCommentToast: (title: string) => void;
  onBufferingToast: () => void;
};

export function renderStageScene(theme: PinoyTubeVideo["visualTheme"]) {
  switch (theme) {
    case "dance":
      return (
        <svg
          viewBox="0 0 320 200"
          className={styles.stageCanvas}
          role="img"
          aria-label="Campus dance crew practice in school courtyard"
        >
          <rect width="320" height="200" fill="#0f172a" />
          <path d="M 0 160 Q 160 130 320 160 L 320 200 L 0 200 Z" fill="#1e293b" />
          <rect x="40" y="50" width="30" height="90" fill="#334155" opacity="0.6" />
          <rect x="85" y="40" width="40" height="100" fill="#334155" opacity="0.5" />
          <rect x="210" y="45" width="35" height="95" fill="#334155" opacity="0.5" />
          <rect x="260" y="60" width="30" height="80" fill="#334155" opacity="0.6" />
          {/* Dancer silhouettes */}
          <circle cx="120" cy="115" r="12" fill="#38bdf8" />
          <path d="M 120 127 L 120 155 M 120 135 L 100 120 M 120 135 L 140 145 M 120 155 L 105 180 M 120 155 L 135 180" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
          <circle cx="160" cy="100" r="14" fill="#fbbf24" />
          <path d="M 160 114 L 160 148 M 160 122 L 135 105 M 160 122 L 185 105 M 160 148 L 145 178 M 160 148 L 175 178" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" />
          <circle cx="200" cy="118" r="12" fill="#f43f5e" />
          <path d="M 200 130 L 200 156 M 200 138 L 180 145 M 200 138 L 220 125 M 200 156 L 190 180 M 200 156 L 215 180" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" />
          <text x="160" y="192" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">
            [REC] QC High Quadrangle · Friday Afternoon
          </text>
        </svg>
      );
    case "acoustic":
      return (
        <svg
          viewBox="0 0 320 200"
          className={styles.stageCanvas}
          role="img"
          aria-label="Acoustic bedroom musician performing cover song"
        >
          <rect width="320" height="200" fill="#1a1310" />
          <radialGradient id="lampGlow" cx="70%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#1a1310" stopOpacity="0" />
          </radialGradient>
          <rect width="320" height="200" fill="url(#lampGlow)" />
          {/* Musician silhouette */}
          <circle cx="140" cy="85" r="18" fill="#fb923c" />
          <path d="M 140 103 L 140 145 M 140 115 L 115 135 M 140 115 L 170 130" stroke="#fb923c" strokeWidth="6" strokeLinecap="round" />
          {/* Guitar */}
          <ellipse cx="170" cy="140" rx="26" ry="18" fill="#d97706" />
          <circle cx="170" cy="140" r="6" fill="#1a1310" />
          <line x1="145" y1="130" x2="195" y2="150" stroke="#78350f" strokeWidth="4" />
          {/* Microphone */}
          <line x1="110" y1="90" x2="110" y2="180" stroke="#94a3b8" strokeWidth="3" />
          <circle cx="110" cy="86" r="6" fill="#cbd5e1" />
          <text x="160" y="192" fill="#a8a29e" fontSize="10" textAnchor="middle" fontFamily="monospace">
            Webcam 320x240 · G - Em - C - D
          </text>
        </svg>
      );
    case "netcafe":
      return (
        <svg
          viewBox="0 0 320 200"
          className={styles.stageCanvas}
          role="img"
          aria-label="Computer shop LAN party gaming banter"
        >
          <rect width="320" height="200" fill="#050811" />
          {/* CRT Monitors */}
          <rect x="30" y="60" width="70" height="55" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="2" />
          <rect x="35" y="65" width="60" height="45" fill="#38bdf8" opacity="0.8" />
          <rect x="125" y="60" width="70" height="55" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="2" />
          <rect x="130" y="65" width="60" height="45" fill="#22c55e" opacity="0.8" />
          <rect x="220" y="60" width="70" height="55" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="2" />
          <rect x="225" y="65" width="60" height="45" fill="#ef4444" opacity="0.8" />
          {/* Gamers */}
          <circle cx="65" cy="140" r="14" fill="#94a3b8" />
          <circle cx="160" cy="140" r="14" fill="#cbd5e1" />
          <circle cx="255" cy="140" r="14" fill="#94a3b8" />
          <text x="160" y="192" fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="monospace">
            Morayta LAN War · de_dust2 · Tawanan sa Shop
          </text>
        </svg>
      );
    case "parody":
      return (
        <svg
          viewBox="0 0 320 200"
          className={styles.stageCanvas}
          role="img"
          aria-label="Bedroom melodrama parody sketch"
        >
          <rect width="320" height="200" fill="#1f132b" />
          <circle cx="100" cy="90" r="16" fill="#e879f9" />
          <path d="M 100 106 L 100 150 M 100 118 L 75 110 M 100 118 L 130 135" stroke="#e879f9" strokeWidth="5" strokeLinecap="round" />
          {/* Kitchen pan */}
          <circle cx="140" cy="140" r="14" fill="#94a3b8" />
          <line x1="140" y1="140" x2="160" y2="155" stroke="#64748b" strokeWidth="4" />
          {/* Sibling */}
          <circle cx="220" cy="90" r="16" fill="#c084fc" />
          <path d="M 220 106 L 220 150 M 220 118 L 195 130 M 220 118 L 245 110" stroke="#c084fc" strokeWidth="5" strokeLinecap="round" />
          <text x="160" y="192" fill="#a855f7" fontSize="10" textAnchor="middle" fontFamily="monospace">
            Dramatic Soap Opera Parody · Sandok at Kawali
          </text>
        </svg>
      );
    case "beatbox":
    default:
      return (
        <svg
          viewBox="0 0 320 200"
          className={styles.stageCanvas}
          role="img"
          aria-label="Jeepney beatbox jam and grassroots music"
        >
          <rect width="320" height="200" fill="#0d1b2a" />
          {/* Jeepney frame */}
          <path d="M 20 120 L 300 120 L 290 50 L 30 50 Z" fill="#1b263b" stroke="#e0e1dd" strokeWidth="2" />
          <rect x="50" y="65" width="50" height="40" fill="#778da9" opacity="0.5" />
          <rect x="120" y="65" width="50" height="40" fill="#778da9" opacity="0.5" />
          <rect x="190" y="65" width="50" height="40" fill="#778da9" opacity="0.5" />
          {/* Audio waves */}
          <line x1="80" y1="160" x2="80" y2="135" stroke="#e63946" strokeWidth="4" />
          <line x1="100" y1="165" x2="100" y2="125" stroke="#f1faee" strokeWidth="4" />
          <line x1="120" y1="165" x2="120" y2="140" stroke="#a8dadc" strokeWidth="4" />
          <line x1="140" y1="170" x2="140" y2="120" stroke="#457b9d" strokeWidth="4" />
          <line x1="160" y1="170" x2="160" y2="110" stroke="#e63946" strokeWidth="5" />
          <line x1="180" y1="170" x2="180" y2="125" stroke="#f1faee" strokeWidth="4" />
          <line x1="200" y1="165" x2="200" y2="135" stroke="#a8dadc" strokeWidth="4" />
          <line x1="220" y1="160" x2="220" y2="145" stroke="#457b9d" strokeWidth="4" />
          <text x="160" y="192" fill="#e0e1dd" fontSize="10" textAnchor="middle" fontFamily="monospace">
            Cubao-Katipunan Route · Beatbox Jam
          </text>
        </svg>
      );
  }
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export function VideoPlayerPanel({
  state,
  dispatch,
  onRateToast,
  onFavoriteToast,
  onCommentToast,
  onBufferingToast,
}: VideoPlayerPanelProps) {
  const [commentText, setCommentText] = useState("");
  const [selectedPreset, setSelectedPreset] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentVideo =
    state.videos.find((v) => v.id === state.selectedVideoId) || state.videos[0];
  const comments = state.comments[currentVideo.id] || [];
  const relatedVideos = state.videos.filter((v) => v.id !== currentVideo.id);
  const mediaAsset = currentVideo.mediaAssetId
    ? getMediaAsset(currentVideo.mediaAssetId)
    : undefined;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = state.volume / 100;
    video.muted = state.isMuted;
  }, [state.volume, state.isMuted, currentVideo.id]);

  const handlePlayToggle = () => {
    dispatch({ type: "TOGGLE_PLAYBACK" });
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play()?.catch(() => undefined);
    else video.pause();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    dispatch({ type: "SEEK_TIME", seconds: val });
  };

  const handleResolutionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const res = e.target.value as VideoResolution;
    dispatch({ type: "SET_RESOLUTION", resolution: res });
    // After 1.5s, resolve simulated buffer
    setTimeout(() => {
      dispatch({ type: "SET_BUFFERING", isBuffering: false, bufferPercentage: 80 });
    }, 1500);
  };

  const handleSimulateBuffering = () => {
    dispatch({ type: "SET_BUFFERING", isBuffering: true, bufferPercentage: 35 });
    onBufferingToast();
    setTimeout(() => {
      dispatch({ type: "SET_BUFFERING", isBuffering: false, bufferPercentage: 70 });
    }, 2000);
  };

  const handleRate = (stars: number) => {
    dispatch({ type: "RATE_VIDEO", videoId: currentVideo.id, rating: stars });
    onRateToast(stars, currentVideo.title);
  };

  const handleToggleFavorite = () => {
    dispatch({ type: "TOGGLE_FAVORITE", videoId: currentVideo.id });
    onFavoriteToast(!currentVideo.isFavorite, currentVideo.title);
  };

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const preset = e.target.value;
    setSelectedPreset(preset);
    if (preset) {
      setCommentText(preset);
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    dispatch({
      type: "ADD_COMMENT",
      videoId: currentVideo.id,
      text: commentText,
      author: "@MuseumVisitor_PH",
      rating: 5,
    });
    onCommentToast(currentVideo.title);
    setCommentText("");
    setSelectedPreset("");
  };

  return (
    <div className={styles.watchLayout}>
      {/* Primary Video Player and Details */}
      <div className={styles.playerColumn}>
        <div className={styles.videoScreenFrame}>
          <div
            className={styles.videoVisualArea}
            data-testid="pinoytube-video-stage"
            data-video-fit="contain-16-9"
          >
            <div className={styles.pixelOverlay} aria-hidden="true" />

            {state.isBuffering && (
              <div className={styles.bufferingOverlay} role="status" aria-live="polite">
                <div className={styles.bufferingSpinner} aria-hidden="true" />
                <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                  Buffering... {state.bufferPercentage}%
                </span>
                <span style={{ fontSize: "10px", color: "#cbd5e1" }}>
                  Simulated 2000s dial-up / early broadband stream
                </span>
              </div>
            )}

            <div className={styles.videoBadge}>
              {currentVideo.categoryLabel}
            </div>
            <div className={styles.resolutionBug}>
              {state.selectedResolution}
            </div>

            {mediaAsset ? (
              <LicensedVideo
                key={currentVideo.id}
                asset={mediaAsset}
                mediaRef={videoRef}
                className={styles.licensedVideo}
                onStateChange={(snapshot) => {
                  dispatch({ type: "SEEK_TIME", seconds: snapshot.currentTime });
                  if (snapshot.status === "playing" && state.playbackState !== "playing") {
                    dispatch({ type: "PLAY_VIDEO" });
                  } else if (snapshot.status === "paused" && state.playbackState === "playing") {
                    dispatch({ type: "PAUSE_VIDEO" });
                  }
                }}
              />
            ) : (
              <div className={styles.unavailableMedia} role="note">
                No video file was uploaded. This entry contains museum-simulation metadata only.
              </div>
            )}
          </div>

          {/* Player Transport Controls */}
          <div className={styles.playerBar} aria-label="Video Player Controls">
            <div className={styles.scrubberRow}>
              <div className={styles.progressBarContainer}>
                <div
                  className={styles.bufferBar}
                  style={{ width: `${state.bufferPercentage}%` }}
                  aria-hidden="true"
                />
                <div
                  className={styles.playBar}
                  style={{
                    width: `${
                      (state.currentTimeSeconds / currentVideo.durationSeconds) * 100
                    }%`,
                  }}
                  aria-hidden="true"
                />
                <input
                  type="range"
                  min="0"
                  max={currentVideo.durationSeconds}
                  value={state.currentTimeSeconds}
                  onChange={handleSeek}
                  className={styles.scrubberInput}
                  aria-label="Seek video position"
                />
              </div>
            </div>

            <div className={styles.controlsRow}>
              <div className={styles.leftControls}>
                <button
                  type="button"
                  className={styles.playBtn}
                  onClick={handlePlayToggle}
                  aria-label={state.playbackState === "playing" ? "Pause video" : "Play video"}
                >
                  {state.playbackState === "playing" ? "⏸ Pause" : "▶ Play"}
                </button>
                <span className={styles.timeDisplay}>
                  {formatDuration(state.currentTimeSeconds)} / {currentVideo.durationFormatted}
                </span>
              </div>

              <div className={styles.rightControls}>
                <select
                  value={state.selectedResolution}
                  onChange={handleResolutionChange}
                  className={styles.resolutionSelect}
                  aria-label="Select video resolution"
                >
                  <option value="240p">240p (Dial-up)</option>
                  <option value="360p">360p (DSL)</option>
                  <option value="480p">480p (HQ)</option>
                </select>

                <button
                  type="button"
                  className={styles.volumeBtn}
                  onClick={() => dispatch({ type: "TOGGLE_MUTE" })}
                  aria-label={state.isMuted ? "Unmute audio" : "Mute audio"}
                >
                  {state.isMuted ? "🔇" : "🔊"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Metadata & Rating */}
        <div className={styles.videoMetaCard}>
          <div className={styles.videoTitleRow}>
            <div>
              <h2 className={styles.videoTitle}>{currentVideo.title}</h2>
              <div style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>
                Uploaded by <strong>{currentVideo.author}</strong> ({currentVideo.channelName}) · {currentVideo.uploadDate}
              </div>
            </div>

            <div className={styles.actionButtonGroup}>
              <button
                type="button"
                className={`${styles.favBtn} ${currentVideo.isFavorite ? styles.favBtnActive : ""}`}
                onClick={handleToggleFavorite}
                aria-label={currentVideo.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              >
                {currentVideo.isFavorite ? "❤️ Favorited" : "🤍 Favorite"}
              </button>

              <button
                type="button"
                className={styles.bufferTestBtn}
                onClick={handleSimulateBuffering}
                title="Experience mid-2000s video buffering pause"
              >
                ⏳ Simulate Buffer
              </button>
            </div>
          </div>

          <div className={styles.videoStatsRow}>
            <div>
              <strong>{currentVideo.views.toLocaleString()}</strong> views (fictional metric)
            </div>

            <div className={styles.ratingArea}>
              <span style={{ marginRight: "4px" }}>Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`${styles.starBtn} ${
                    star <= (currentVideo.userRating || Math.round(currentVideo.starRating))
                      ? styles.starFilled
                      : ""
                  }`}
                  onClick={() => handleRate(star)}
                  aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                >
                  ★
                </button>
              ))}
              <span style={{ fontSize: "11px", marginLeft: "4px", color: "#666" }}>
                ({currentVideo.starRating} avg · {currentVideo.ratingCount} votes)
              </span>
            </div>
          </div>

          <p className={styles.videoDesc}>
            {currentVideo.description}
          </p>

          {mediaAsset && (
            <div className={styles.archiveCredit}>
              <strong>Archival context reel:</strong> {mediaAsset.title} by {mediaAsset.creator}. This licensed footage provides period atmosphere; it is not the fictional upload described above. {" "}
              <a href={mediaAsset.sourceUrl} target="_blank" rel="noreferrer">View source &amp; license</a>
            </div>
          )}

          <div className={styles.tagRow}>
            {currentVideo.tags.map((tag) => (
              <span key={tag} className={styles.videoTag}>
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Community Comments Feed */}
        <div className={styles.commentsSection}>
          <div className={styles.commentsHeader}>
            <span className={styles.commentsCount}>
              Comments ({comments.length})
            </span>
            <span style={{ fontSize: "11px", color: "#888" }}>
              Early-web visitor feedback simulation
            </span>
          </div>

          <form onSubmit={handleSubmitComment} className={styles.commentForm}>
            <div className={styles.formControls}>
              <label htmlFor="comment-preset" style={{ fontSize: "11px", color: "#444" }}>
                Quick Presets:
              </label>
              <select
                id="comment-preset"
                value={selectedPreset}
                onChange={handlePresetChange}
                className={styles.presetSelect}
              >
                <option value="">-- Choose period comment --</option>
                {PRESET_COMMENTS.map((preset, idx) => (
                  <option key={idx} value={preset}>
                    {preset}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Leave a comment or select a preset..."
              rows={2}
              className={styles.commentInput}
              aria-label="Write a comment on this video"
            />

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                disabled={!commentText.trim()}
                className={styles.postCommentBtn}
              >
                Post Comment
              </button>
            </div>
          </form>

          <ul className={styles.commentList}>
            {comments.map((c) => (
              <li key={c.id} className={styles.commentItem}>
                <div className={styles.commentAvatar} aria-hidden="true">
                  {c.avatarIcon}
                </div>
                <div className={styles.commentBody}>
                  <div className={styles.commentAuthorRow}>
                    <span className={styles.commentAuthor}>{c.author}</span>
                    <span className={styles.commentTimestamp}>{c.timestamp}</span>
                    {c.rating && (
                      <span style={{ color: "#eab308", fontSize: "10px" }}>
                        {"★".repeat(c.rating)}
                      </span>
                    )}
                  </div>
                  <p className={styles.commentText}>{c.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sidebar Recommendations */}
      <div className={styles.sidebarColumn}>
        <div className={styles.sidebarCard}>
          <h3 className={styles.sidebarTitle}>Related Videos</h3>
          <ul className={styles.recList}>
            {relatedVideos.map((v) => {
              const thumbnailAsset = v.mediaAssetId ? getMediaAsset(v.mediaAssetId) : undefined;
              return (
              <li
                key={v.id}
                className={styles.recItem}
                onClick={() => dispatch({ type: "SELECT_VIDEO", videoId: v.id })}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    dispatch({ type: "SELECT_VIDEO", videoId: v.id });
                  }
                }}
                aria-label={`Play related video: ${v.title}`}
              >
                <div className={styles.recThumb} aria-hidden="true">
                  {thumbnailAsset ? (
                    <video
                      src={thumbnailAsset.localSrc}
                      preload="metadata"
                      muted
                      playsInline
                      onLoadedMetadata={(event) => {
                        const video = event.currentTarget;
                        if (video.duration > 0) video.currentTime = Math.min(0.1, video.duration);
                      }}
                    />
                  ) : (
                    <span>▶</span>
                  )}
                  <span className={styles.recThumbDuration}>{v.durationFormatted}</span>
                </div>
                <div className={styles.recMeta}>
                  <h4 className={styles.recVideoTitle}>{v.title}</h4>
                  <p className={styles.recVideoAuthor}>{v.author}</p>
                  <span className={styles.recVideoViews}>
                    {v.views.toLocaleString()} views · {v.starRating}★
                  </span>
                </div>
              </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
