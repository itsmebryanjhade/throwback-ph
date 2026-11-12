"use client";

import { useState } from "react";
import type { PageProps } from "./shared";
import styles from "./friendster.module.css";

const IDEAS = [
  { title: "Gig tonight sa Cubao Expo!", content: "Tara nood tayo, 8 PM. Libre daw ang unang 50. Sino sasama?" },
  { title: "Comp shop meet-up", content: "DotA 5v5 mamaya sa Netopia, 7 PM. Dala kayo pang-₱15/hr!" },
  { title: "Survey time!! (repost)", content: "Fave color? Fave OPM band? Crush ngayon? Repost with your answers hehe" },
];

export function BulletinsView({ state, actions }: PageProps) {
  const [composing, setComposing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return (
    <div className={styles.page}>
      <section className={styles.box}>
        <div className={styles.boxTitleRow}>
          <h2 className={styles.pageTitle}>Bulletin Board</h2>
          <button type="button" className={styles.actionButtonPrimary} onClick={() => setComposing((value) => !value)}>
            {composing ? "✕ Close Composer" : "✎ Post Bulletin"}
          </button>
        </div>
        <p className={styles.boxHint}>
          A bulletin went out to <strong>all {state.friendIds.length} friends</strong> at once, like a group
          announcement: gigs, meet-ups, and the famous survey reposts.
        </p>

        {composing && (
          <form
            className={styles.composer}
            onSubmit={(event) => {
              event.preventDefault();
              if (!title.trim() || !content.trim()) return;
              actions.postBulletin(title.trim(), content.trim());
              setTitle("");
              setContent("");
              setComposing(false);
            }}
          >
            <div className={styles.presetRow} role="group" aria-label="Bulletin ideas">
              {IDEAS.map((idea) => (
                <button
                  key={idea.title}
                  type="button"
                  className={styles.presetChip}
                  onClick={() => {
                    setTitle(idea.title);
                    setContent(idea.content);
                  }}
                >
                  💡 {idea.title}
                </button>
              ))}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="bulletin-title">
                Subject / Title
              </label>
              <input
                id="bulletin-title"
                type="text"
                className={styles.formInput}
                placeholder="e.g. Gig tonight sa Cubao Expo / Comp shop tournament"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="bulletin-body">
                Message
              </label>
              <textarea
                id="bulletin-body"
                className={styles.formTextarea}
                placeholder="Write a message to your network…"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                rows={3}
                required
              />
            </div>
            <div className={styles.formActions}>
              <button type="submit" className={styles.actionButtonPrimary}>
                Publish Bulletin
              </button>
            </div>
          </form>
        )}
      </section>

      <div className={styles.bulletinsList}>
        {state.bulletins.map((bulletin) => (
          <article key={bulletin.id} className={styles.bulletinCard} data-mine={bulletin.authorHandle === "me"}>
            <div className={styles.bulletinHeader}>
              <div className={styles.bulletinAvatar} aria-hidden="true">
                {bulletin.authorAvatar}
              </div>
              <div className={styles.bulletinMeta}>
                <span className={styles.bulletinAuthor}>
                  {bulletin.authorName}{" "}
                  <span className={styles.bulletinHandle}>
                    ({bulletin.authorHandle === "me" ? "you" : `@${bulletin.authorHandle}`})
                  </span>
                </span>
                <time className={styles.bulletinDate}>{bulletin.date}</time>
              </div>
            </div>
            <h3 className={styles.bulletinTitle}>{bulletin.title}</h3>
            <p className={styles.bulletinBody}>{bulletin.content}</p>
            {bulletin.authorHandle === "me" && (
              <button
                type="button"
                className={styles.bulletinDeleteBtn}
                onClick={() => actions.dispatch({ type: "DELETE_BULLETIN", bulletinId: bulletin.id })}
              >
                Delete my bulletin
              </button>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
