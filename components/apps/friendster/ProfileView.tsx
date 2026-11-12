"use client";

import { useState } from "react";
import { FICTIONAL_PROFILES, FRIENDSTER_THEMES } from "@/lib/apps/friendster/data";
import { getStarterTasks, ProfilePortrait, type PageProps } from "./shared";
import styles from "./friendster.module.css";

const TOP_FRIEND_SLOTS = 8;

function StarterChecklist({ state, actions }: PageProps) {
  const [hidden, setHidden] = useState(false);
  const tasks = getStarterTasks(state);
  const doneCount = tasks.filter((task) => task.done).length;

  if (hidden) {
    return (
      <button type="button" className={styles.linkButton} onClick={() => setHidden(false)}>
        Show “Bago ka dito?” tips ({doneCount}/{tasks.length} done)
      </button>
    );
  }

  const go = (id: (typeof tasks)[number]["id"]) => {
    const { dispatch } = actions;
    if (id === "skin") actions.focusSkins();
    if (id === "approve") dispatch({ type: "SET_TAB", tab: "testimonials" });
    if (id === "friend") dispatch({ type: "SET_TAB", tab: "friends" });
    if (id === "write") actions.writeTestimonialFor(state.friendIds[0] ?? FICTIONAL_PROFILES[0].id);
    if (id === "bulletin") dispatch({ type: "SET_TAB", tab: "bulletins" });
  };

  return (
    <section className={styles.starter} aria-labelledby="friendster-starter-title">
      <div className={styles.starterHead}>
        <h3 id="friendster-starter-title">Bago ka dito? Try these! ✨</h3>
        <span className={styles.starterCount}>
          {doneCount} of {tasks.length} done
        </span>
        <button type="button" className={styles.linkButton} onClick={() => setHidden(true)}>
          Hide
        </button>
      </div>
      <span className={styles.starterTrack} aria-hidden="true">
        <span style={{ width: `${(doneCount / tasks.length) * 100}%` }} />
      </span>
      <ul className={styles.starterList}>
        {tasks.map((task) => (
          <li key={task.id} data-done={task.done}>
            <span className={styles.starterCheck} aria-hidden="true">
              {task.done ? "✓" : ""}
            </span>
            <span className={styles.starterText}>
              <strong>{task.label}</strong>
              <small>{task.hint}</small>
            </span>
            {task.done ? (
              <span className={styles.starterDone}>Done!</span>
            ) : (
              <button
                type="button"
                className={styles.smallButton}
                onClick={() => go(task.id)}
                aria-label={`Do it: ${task.label}`}
              >
                Do it →
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ProfileView({ state, actions, skinsRef }: PageProps & { skinsRef: React.RefObject<HTMLElement | null> }) {
  const { dispatch } = actions;
  const viewingFriend = state.viewingFriendId
    ? FICTIONAL_PROFILES.find((friend) => friend.id === state.viewingFriendId) ?? null
    : null;
  const me = state.userProfile;
  const activeTheme = FRIENDSTER_THEMES.find((theme) => theme.id === me.themeId) ?? FRIENDSTER_THEMES[0];

  const name = viewingFriend ? viewingFriend.name : me.displayName;
  const firstName = name.split(" ")[0];
  const pendingForMe = state.testimonials.filter((t) => t.recipientId === "user" && t.status === "pending");
  const testimonials = state.testimonials.filter((t) =>
    viewingFriend ? t.recipientId === viewingFriend.id : t.recipientId === "user" && t.status === "approved",
  );
  const topFriends = state.friendIds
    .map((id) => FICTIONAL_PROFILES.find((friend) => friend.id === id))
    .filter((friend): friend is (typeof FICTIONAL_PROFILES)[number] => Boolean(friend))
    .filter((friend) => friend.id !== viewingFriend?.id);
  const isFriend = viewingFriend ? state.friendIds.includes(viewingFriend.id) : false;

  const details: [string, string][] = viewingFriend
    ? [
        ["Member Since", "April 2004"],
        ["Location", viewingFriend.location],
        ["Relationship", viewingFriend.relationshipStatus],
        ["Profile Views", "942"],
      ]
    : [
        ["Member Since", me.memberSince],
        ["Location", me.location],
        ["Relationship", me.relationshipStatus],
        ["Profile Views", me.profileViews.toLocaleString()],
      ];

  const interests = viewingFriend ? viewingFriend.interests : me.interests;

  return (
    <div className={styles.profilePage}>
      {viewingFriend && (
        <button type="button" className={styles.backLink} onClick={() => dispatch({ type: "VIEW_MY_PROFILE" })}>
          ← Back to My Profile
        </button>
      )}

      {!viewingFriend && <StarterChecklist state={state} actions={actions} />}

      <div className={styles.profileLayout}>
        {/* ---------- Left column ---------- */}
        <aside className={styles.sidebarColumn}>
          <figure className={styles.polaroid}>
            <div className={styles.avatarFrame}>
              <ProfilePortrait
                src={viewingFriend ? viewingFriend.portraitSrc : me.portraitSrc}
                name={name}
                avatar={viewingFriend ? viewingFriend.avatar : me.avatar}
              />
            </div>
            <figcaption className={styles.photoCaption}>Primary Photo</figcaption>
          </figure>

          <section className={styles.box} aria-label={`${firstName}'s details`}>
            <h3 className={styles.boxTitle}>{firstName}&apos;s Details</h3>
            <dl className={styles.detailTable}>
              {details.map(([label, value]) => (
                <div key={label} className={styles.detailRow}>
                  <dt className={styles.detailLabel}>{label}</dt>
                  <dd className={styles.detailValue}>{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {!viewingFriend && (
            <section className={styles.box} ref={skinsRef} tabIndex={-1} aria-labelledby="friendster-skins-title">
              <h3 className={styles.boxTitle} id="friendster-skins-title">
                Profile Skins
              </h3>
              <p className={styles.boxHint}>Pick a look for your page. Your barkada will see it!</p>
              <div className={styles.themeList}>
                {FRIENDSTER_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    className={`${styles.themeOption} ${activeTheme.id === theme.id ? styles.themeOptionActive : ""}`}
                    aria-pressed={activeTheme.id === theme.id}
                    onClick={() => actions.selectTheme(theme.id)}
                  >
                    <span className={styles.themeSwatch} style={{ background: theme.pattern }} aria-hidden="true">
                      <span style={{ background: theme.primary }} />
                    </span>
                    <span>{theme.name}</span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </aside>

        {/* ---------- Main column ---------- */}
        <div className={styles.mainColumn}>
          <header className={styles.profileHero}>
            <div className={styles.profileHeroText}>
              <h2 className={styles.displayName}>
                {viewingFriend ? `${viewingFriend.name} (${viewingFriend.handle})` : me.displayName}
              </h2>
              <p className={styles.statusQuote}>“{viewingFriend ? viewingFriend.tagline : me.status}”</p>
              {!viewingFriend && (
                <p className={styles.profileSong}>
                  <span className={styles.eq} aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className={styles.marquee}>
                    <span>♪ Now playing on my profile: {me.profileSong} ♪</span>
                  </span>
                </p>
              )}
            </div>
            <div className={styles.heroActions}>
              {viewingFriend ? (
                <>
                  {isFriend ? (
                    <button
                      type="button"
                      className={`${styles.btnToggleFriend} ${styles.btnRemoveFriend}`}
                      onClick={() => actions.removeFriend(viewingFriend.id)}
                    >
                      ✕ Remove Friend
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={`${styles.btnToggleFriend} ${styles.btnAddFriend}`}
                      onClick={() => actions.addFriend(viewingFriend.id)}
                    >
                      + Add to Friends
                    </button>
                  )}
                  <button
                    type="button"
                    className={styles.actionButtonPrimary}
                    onClick={() => actions.writeTestimonialFor(viewingFriend.id)}
                  >
                    Write Testimonial
                  </button>
                </>
              ) : (
                !state.isEditingProfile && (
                  <button
                    type="button"
                    className={styles.actionButtonPrimary}
                    onClick={() => dispatch({ type: "START_EDIT_PROFILE" })}
                  >
                    ✎ Edit My Profile
                  </button>
                )
              )}
            </div>
          </header>

          {state.isEditingProfile && !viewingFriend && (
            <form
              className={styles.editForm}
              onSubmit={(event) => {
                event.preventDefault();
                actions.saveProfile();
              }}
            >
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="edit-display-name">
                  Display Name
                </label>
                <input
                  id="edit-display-name"
                  type="text"
                  className={styles.formInput}
                  value={state.editFormData.displayName}
                  onChange={(event) =>
                    dispatch({ type: "UPDATE_EDIT_FIELD", field: "displayName", value: event.target.value })
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="edit-status">
                  Current Status
                </label>
                <input
                  id="edit-status"
                  type="text"
                  className={styles.formInput}
                  value={state.editFormData.status}
                  placeholder="e.g. nag-aaral daw · may exam bukas"
                  onChange={(event) => dispatch({ type: "UPDATE_EDIT_FIELD", field: "status", value: event.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="edit-about-me">
                  About Me
                </label>
                <textarea
                  id="edit-about-me"
                  className={styles.formTextarea}
                  value={state.editFormData.aboutMe}
                  onChange={(event) => dispatch({ type: "UPDATE_EDIT_FIELD", field: "aboutMe", value: event.target.value })}
                  rows={4}
                  required
                />
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.actionButtonSecondary} onClick={() => dispatch({ type: "CANCEL_EDIT_PROFILE" })}>
                  Cancel
                </button>
                <button type="submit" className={styles.actionButtonPrimary}>
                  Save Profile
                </button>
              </div>
            </form>
          )}

          <section className={styles.box} aria-label="About Me">
            <h3 className={styles.boxTitle}>About Me</h3>
            <p className={styles.aboutContent}>{viewingFriend ? viewingFriend.aboutMe : me.aboutMe}</p>
            <dl className={styles.infoTable}>
              <div>
                <dt>Interests</dt>
                <dd>
                  {interests.map((interest) => (
                    <span key={interest} className={styles.interestTag}>
                      {interest}
                    </span>
                  ))}
                </dd>
              </div>
              {!viewingFriend && (
                <>
                  <div>
                    <dt>Favorite Music</dt>
                    <dd>{me.favoriteMusic}</dd>
                  </div>
                  <div>
                    <dt>Who I Want to Meet</dt>
                    <dd>{me.whoIWantToMeet}</dd>
                  </div>
                </>
              )}
            </dl>
          </section>

          <section className={styles.box} aria-labelledby="friendster-top-friends">
            <div className={styles.boxTitleRow}>
              <h3 className={styles.boxTitle} id="friendster-top-friends">
                {viewingFriend ? `${firstName}'s Friends` : `Top Friends (${state.friendIds.length})`}
              </h3>
              <button type="button" className={styles.linkButton} onClick={() => dispatch({ type: "SET_TAB", tab: "friends" })}>
                View all friends →
              </button>
            </div>
            <ul className={styles.topFriends}>
              {topFriends.slice(0, TOP_FRIEND_SLOTS).map((friend) => (
                <li key={friend.id}>
                  <button
                    type="button"
                    className={styles.topFriend}
                    onClick={() => dispatch({ type: "VIEW_FRIEND", friendId: friend.id })}
                    aria-label={`View ${friend.name}'s profile`}
                  >
                    <ProfilePortrait src={friend.portraitSrc} name={friend.name} avatar={friend.avatar} compact />
                    <span>{friend.name.split(" ")[0]}</span>
                  </button>
                </li>
              ))}
              {!viewingFriend &&
                Array.from({ length: Math.max(0, Math.min(2, TOP_FRIEND_SLOTS - topFriends.length)) }).map((_, index) => (
                  <li key={`empty-${index}`}>
                    <button
                      type="button"
                      className={`${styles.topFriend} ${styles.topFriendEmpty}`}
                      onClick={() => dispatch({ type: "SET_TAB", tab: "friends" })}
                      aria-label="Find more friends"
                    >
                      <span className={styles.emptySlot} aria-hidden="true">
                        +
                      </span>
                      <span>Add</span>
                    </button>
                  </li>
                ))}
            </ul>
          </section>

          <section className={styles.box} aria-label="Testimonials">
            <div className={styles.boxTitleRow}>
              <h3 className={styles.boxTitle}>
                {viewingFriend ? `Testimonials for ${firstName}` : "Testimonials"} ({testimonials.length})
              </h3>
              <button type="button" className={styles.linkButton} onClick={() => dispatch({ type: "SET_TAB", tab: "testimonials" })}>
                View All →
              </button>
            </div>
            {!viewingFriend && pendingForMe.length > 0 && (
              <p className={styles.pendingNudge}>
                ⏳ {pendingForMe.length} new testimonial{pendingForMe.length > 1 ? "s" : ""} waiting for your approval.{" "}
                <button type="button" className={styles.linkButton} onClick={() => dispatch({ type: "SET_TAB", tab: "testimonials" })}>
                  Review now
                </button>
              </p>
            )}
            {testimonials.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No testimonials for {firstName} yet.</p>
                {viewingFriend && (
                  <button type="button" className={styles.actionButtonPrimary} onClick={() => actions.writeTestimonialFor(viewingFriend.id)}>
                    Be the first! Write a testi
                  </button>
                )}
              </div>
            ) : (
              <div className={styles.testiList}>
                {testimonials.slice(0, 3).map((testi) => (
                  <article key={testi.id} className={styles.testiCard}>
                    <div className={styles.testiAvatar} aria-hidden="true">
                      {testi.authorAvatar}
                    </div>
                    <div className={styles.testiContent}>
                      <div className={styles.testiHeader}>
                        <span className={styles.testiAuthor}>{testi.authorName}</span>
                        <time className={styles.testiDate}>{testi.date}</time>
                      </div>
                      <p className={styles.testiQuote}>“{testi.content}”</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
