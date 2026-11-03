import React, { useState } from "react";
import type { PinoyTubeAction, VideoCategory } from "@/lib/apps/pinoytube/types";
import { CATEGORY_LABELS } from "@/lib/apps/pinoytube/data";
import styles from "./pinoytube.module.css";

type VideoUploadPanelProps = {
  dispatch: React.Dispatch<PinoyTubeAction>;
  onUploadToast: (title: string) => void;
};

export function VideoUploadPanel({
  dispatch,
  onUploadToast,
}: VideoUploadPanelProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<VideoCategory>("acoustic-opm");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("pinoy, garage, acoustic");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStep, setProgressStep] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isProcessing) return;

    setIsProcessing(true);
    setProgressStep("Encoding AVI to FLV (240p standard)...");

    setTimeout(() => {
      setProgressStep("Generating 3-frame animated thumbnail preview...");
    }, 800);

    setTimeout(() => {
      setProgressStep("Publishing to PinoyTube grassroots index...");
    }, 1500);

    setTimeout(() => {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      dispatch({
        type: "UPLOAD_VIDEO",
        title,
        category,
        description,
        tags,
      });

      onUploadToast(title);
      setIsProcessing(false);
    }, 2200);
  };

  return (
    <div className={styles.uploadCard}>
      <h3 className={styles.uploadTitle}>PinoyTube Creator Upload Studio</h3>
      <div className={styles.uploadDisclaimer} role="note">
        <strong>Educational Simulation Notice:</strong> This Upload Studio is a metadata-only local simulation: no real video is selected, uploaded, transmitted, or converted to FLV.
      </div>
      <p className={styles.uploadDesc}>
        Simulate sharing a homemade video listing in the 2005–2010 web era! Submitting metadata generates a period-style catalog entry with simulated low-bandwidth playback controls.
      </p>

      <form onSubmit={handleSubmit} className={styles.uploadForm}>
        <div className={styles.formGroup}>
          <label htmlFor="upload-title" className={styles.formLabel}>
            Video Title:
          </label>
          <input
            id="upload-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. My Band Practicing in Marikina Garage"
            className={styles.formInput}
            disabled={isProcessing}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="upload-category" className={styles.formLabel}>
            Category:
          </label>
          <select
            id="upload-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as VideoCategory)}
            className={styles.formSelect}
            disabled={isProcessing}
          >
            {(Object.keys(CATEGORY_LABELS) as VideoCategory[])
              .filter((k) => k !== "all")
              .map((catKey) => (
                <option key={catKey} value={catKey}>
                  {CATEGORY_LABELS[catKey]}
                </option>
              ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="upload-desc" className={styles.formLabel}>
            Description:
          </label>
          <textarea
            id="upload-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell your viewers about your video, lyrics, chords, or friend shoutouts..."
            className={styles.formTextarea}
            disabled={isProcessing}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="upload-tags" className={styles.formLabel}>
            Tags (comma separated):
          </label>
          <input
            id="upload-tags"
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="opm, barkada, cover, manila"
            className={styles.formInput}
            disabled={isProcessing}
          />
        </div>

        <button
          type="submit"
          disabled={!title.trim() || isProcessing}
          className={styles.submitUploadBtn}
        >
          {isProcessing ? "Processing Video..." : "Upload to PinoyTube (Metadata-Only Simulation)"}
        </button>

        {isProcessing && (
          <div className={styles.uploadProgressBox} role="status" aria-live="polite">
            <div style={{ fontWeight: 700, marginBottom: "4px", color: "#b31217" }}>
              ⏳ Encoding & Processing Video...
            </div>
            <div>{progressStep}</div>
          </div>
        )}
      </form>
    </div>
  );
}
