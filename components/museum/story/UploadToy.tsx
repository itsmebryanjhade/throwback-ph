"use client";

import { useEffect, useId, useState } from "react";
import styles from "./story.module.css";

const KINDS = [
  { id: "cover", label: "Acoustic cover", emoji: "🎸", title: "acoustic cover sa kwarto (sorry sa sound hehe)" },
  { id: "dance", label: "Dance craze", emoji: "💃", title: "dance practice ng barkada sa garahe!!" },
  { id: "comedy", label: "Comedy sketch", emoji: "😂", title: "kapag na-late ka sa klase (parody)" },
] as const;

/** Each stage: views reached, and a comment that pops in. All fictional. */
const STAGES = [
  { views: 12, comment: { user: "pinsan_ko", text: "first!! hahaha" } },
  { views: 140, comment: { user: "classmate_2B", text: "uy ikaw ba yan?? galing!" } },
  { views: 2600, comment: { user: "random_tita", text: "Very nice iha/iho, God bless" } },
  { views: 48000, comment: { user: "musiclover_88", text: "sub 4 sub? jk galing mo idol" } },
  { views: 910000, comment: { user: "TV_researcher", text: "Hi! Can we feature this on our show? 📺" } },
] as const;

type Kind = (typeof KINDS)[number]["id"];

export function UploadToy() {
  const titleId = useId();
  const [kind, setKind] = useState<Kind>("cover");
  const [title, setTitle] = useState<string>(KINDS[0].title);
  const [upload, setUpload] = useState<number | null>(null); // 0–100
  const [stage, setStage] = useState(-1);
  const uploading = upload !== null && upload < 100;
  const live = upload === 100;
  const selected = KINDS.find((item) => item.id === kind) ?? KINDS[0];

  useEffect(() => {
    if (!uploading) return;
    const timer = window.setTimeout(() => setUpload((value) => Math.min(100, (value ?? 0) + 12.5)), 160);
    return () => window.clearTimeout(timer);
  }, [uploading, upload]);

  useEffect(() => {
    if (!live || stage >= STAGES.length - 1) return;
    const timer = window.setTimeout(() => setStage((value) => value + 1), 900);
    return () => window.clearTimeout(timer);
  }, [live, stage]);

  const start = () => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    setStage(reduce ? STAGES.length - 1 : -1);
    setUpload(reduce ? 100 : 0);
  };

  const reset = () => {
    setUpload(null);
    setStage(-1);
  };

  const views = stage >= 0 ? STAGES[stage].views : 0;

  return (
    <div className={styles.uploadToy}>
      <div className={styles.uploadForm}>
        <fieldset className={styles.voteChoice}>
          <legend>What did you film?</legend>
          {KINDS.map((item) => (
            <label key={item.id} data-checked={kind === item.id}>
              <input
                type="radio"
                name="video-kind"
                value={item.id}
                checked={kind === item.id}
                disabled={upload !== null}
                onChange={() => {
                  setKind(item.id);
                  setTitle(item.title);
                }}
              />
              {item.emoji} {item.label}
            </label>
          ))}
        </fieldset>
        <label className={styles.burnLabelInput} htmlFor={titleId}>
          Video title
        </label>
        <input
          id={titleId}
          className={styles.burnText}
          value={title}
          maxLength={60}
          disabled={upload !== null}
          onChange={(event) => setTitle(event.target.value)}
        />
        <div className={styles.forwardActions}>
          {upload === null ? (
            <button type="button" className={styles.forwardButton} onClick={start} disabled={!title.trim()}>
              Upload video
            </button>
          ) : (
            <button type="button" className={styles.resetLink} onClick={reset}>
              Upload another
            </button>
          )}
        </div>
        <p className={styles.forwardNote}>Views and comments are simulated for this exhibit.</p>
      </div>

      <div className={styles.videoPage}>
        <div className={styles.videoFrame} data-live={live}>
          <span className={styles.videoEmoji} aria-hidden="true">
            {selected.emoji}
          </span>
          {uploading && (
            <span className={styles.videoOverlay}>
              Uploading over DSL… {Math.round(upload ?? 0)}%
              <span className={styles.burnTrack} aria-hidden="true">
                <span style={{ width: `${upload}%` }} />
              </span>
            </span>
          )}
          {upload === null && <span className={styles.videoOverlay}>Your video will appear here</span>}
        </div>
        <p className={styles.videoTitle}>{title || "Untitled video"}</p>
        <p className={styles.videoViews} aria-live="polite">
          <strong data-testid="video-views">{views.toLocaleString("en-US")}</strong> views
          {stage === STAGES.length - 1 && <span className={styles.featured}>★ Featured</span>}
        </p>
        <ul className={styles.comments} aria-label="Comments">
          {STAGES.slice(0, stage + 1).map((item) => (
            <li key={item.comment.user}>
              <b>{item.comment.user}</b> {item.comment.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
