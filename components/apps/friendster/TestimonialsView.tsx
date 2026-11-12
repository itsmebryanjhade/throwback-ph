"use client";

import { useState } from "react";
import { FICTIONAL_PROFILES, PRESET_TESTIMONIALS } from "@/lib/apps/friendster/data";
import type { Testimonial } from "@/lib/apps/friendster/types";
import type { PageProps } from "./shared";
import styles from "./friendster.module.css";

function TestiCard({ testi, children, pending = false }: { testi: Testimonial; children?: React.ReactNode; pending?: boolean }) {
  return (
    <article className={`${styles.testiCard} ${pending ? styles.testiCardPending : ""}`}>
      <div className={styles.testiAvatar} aria-hidden="true">
        {testi.authorAvatar}
      </div>
      <div className={styles.testiContent}>
        <div className={styles.testiHeader}>
          <span className={styles.testiAuthor}>{testi.authorName}</span>
          <time className={styles.testiDate}>{testi.date}</time>
        </div>
        <p className={styles.testiQuote}>“{testi.content}”</p>
        {children}
      </div>
    </article>
  );
}

export function TestimonialsView({
  state,
  actions,
  recipientId,
  onRecipientChange,
}: PageProps & { recipientId: string | null; onRecipientChange: (id: string) => void }) {
  const [draft, setDraft] = useState("");
  const pending = state.testimonials.filter((t) => t.recipientId === "user" && t.status === "pending");
  const approved = state.testimonials.filter((t) => t.recipientId === "user" && t.status === "approved");
  const sent = state.testimonials.filter((t) => t.authorId === "user");
  const recipient = recipientId ?? state.friendIds[0] ?? FICTIONAL_PROFILES[0].id;
  const recipientName = FICTIONAL_PROFILES.find((friend) => friend.id === recipient)?.name ?? "your friend";

  return (
    <div className={styles.page}>
      {pending.length > 0 && (
        <section className={`${styles.box} ${styles.boxAttention}`} aria-labelledby="testi-pending-title">
          <h2 className={styles.pageTitle} id="testi-pending-title">
            ⏳ Waiting for your approval ({pending.length})
          </h2>
          <p className={styles.boxHint}>
            On Friendster, a testimonial only appeared on your profile after you approved it. Approve the ones you
            want everyone to see.
          </p>
          <div className={styles.testiList}>
            {pending.map((testi) => (
              <TestiCard key={testi.id} testi={testi} pending>
                <div className={styles.pendingActions}>
                  <button type="button" className={styles.btnApprove} onClick={() => actions.approveTestimonial(testi.id)}>
                    ✓ Approve & Display
                  </button>
                  <button type="button" className={styles.btnReject} onClick={() => actions.rejectTestimonial(testi.id)}>
                    ✕ Reject
                  </button>
                </div>
              </TestiCard>
            ))}
          </div>
        </section>
      )}

      <section className={styles.box} aria-labelledby="testi-write-title">
        <h2 className={styles.pageTitle} id="testi-write-title">
          Write a Testimonial
        </h2>
        <p className={styles.boxHint}>Say something nice about a friend. They&apos;ll see it on their profile.</p>
        <form
          className={styles.composer}
          onSubmit={(event) => {
            event.preventDefault();
            if (!draft.trim()) return;
            actions.submitTestimonial(recipient, draft.trim());
            setDraft("");
          }}
        >
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="testi-recipient">
              Choose Barkada Member
            </label>
            <select
              id="testi-recipient"
              className={styles.formInput}
              value={recipient}
              onChange={(event) => onRecipientChange(event.target.value)}
            >
              {FICTIONAL_PROFILES.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name} ({profile.handle})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <span className={styles.formLabel}>Need ideas? Tap one to use it:</span>
            <div className={styles.presetRow}>
              {PRESET_TESTIMONIALS.map((preset, index) => (
                <button
                  key={preset}
                  type="button"
                  className={styles.presetChip}
                  aria-label={`Use example testimonial ${index + 1}`}
                  title={preset}
                  onClick={() => setDraft(preset)}
                >
                  “{preset.split(" ").slice(0, 5).join(" ")}…”
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="testi-content">
              Your Testimonial for {recipientName}
            </label>
            <textarea
              id="testi-content"
              className={styles.formTextarea}
              placeholder="Write your testi here… (wag kalimutan mag-iwan ng testi back!)"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={3}
            />
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.actionButtonPrimary} disabled={!draft.trim()}>
              Submit Testimonial
            </button>
          </div>
        </form>
      </section>

      <section className={styles.box} aria-labelledby="testi-approved-title">
        <h2 className={styles.pageTitle} id="testi-approved-title">
          On your profile ({approved.length})
        </h2>
        <div className={styles.testiList}>
          {approved.map((testi) => (
            <TestiCard key={testi.id} testi={testi} />
          ))}
        </div>
      </section>

      {sent.length > 0 && (
        <section className={styles.box} aria-labelledby="testi-sent-title">
          <h2 className={styles.pageTitle} id="testi-sent-title">
            Testis you wrote ({sent.length})
          </h2>
          <div className={styles.testiList}>
            {sent.map((testi) => (
              <TestiCard
                key={testi.id}
                testi={{
                  ...testi,
                  authorName: `To ${FICTIONAL_PROFILES.find((friend) => friend.id === testi.recipientId)?.name ?? "a friend"}`,
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
