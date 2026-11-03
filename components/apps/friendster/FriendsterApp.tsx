"use client";

import React, { useState } from "react";
import { useToast } from "@/lib/notification-system/NotificationContext";
import { useWindowManager } from "@/lib/window-system/WindowContext";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import {
  FRIENDSTER_THEMES,
  FICTIONAL_PROFILES,
  PRESET_TESTIMONIALS,
} from "@/lib/apps/friendster/data";
import {
  friendsterReducer,
  initialFriendsterState,
} from "@/lib/apps/friendster/reducer";
import { sourceCredits } from "@/content/sources";
import styles from "./friendster.module.css";
import { matchesStateShape, usePersistentReducer } from "@/lib/persistence/usePersistentReducer";

function ProfilePortrait({ src, name, avatar, compact = false }: { src: string; name: string; avatar: string; compact?: boolean }) {
  if (!src) {
    return (
      <span className={styles.portraitFallback} role="img" aria-label={`${name} fictional profile portrait`}>
        {avatar}
      </span>
    );
  }

  return (
    <span
      className={compact ? styles.portraitCompact : styles.portraitImage}
      role="img"
      aria-label={`${name} fictional profile portrait`}
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
      }}
    />
  );
}

export function FriendsterApp() {
  const [state, dispatch] = usePersistentReducer(friendsterReducer, initialFriendsterState, {
    key: "throwback-ph:app:friendster", version: 3, validate: matchesStateShape(initialFriendsterState),
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [newBulletinTitle, setNewBulletinTitle] = useState("");
  const [newBulletinContent, setNewBulletinContent] = useState("");
  const [isComposingBulletin, setIsComposingBulletin] = useState(false);
  const [testiDraft, setTestiDraft] = useState("");
  const [writingTestiForId, setWritingTestiForId] = useState<string | null>(null);

  const windowManager = useWindowManager();
  const toast = useToast();

  const runtimeWin = windowManager.state.windows["friendster"];
  const bounds = runtimeWin?.bounds ?? {
    x: 70,
    y: 40,
    width: 780,
    height: 560,
  };
  const isMinimized = runtimeWin?.isMinimized ?? false;
  const isMaximized = runtimeWin?.isMaximized ?? false;
  const isActive = runtimeWin
    ? windowManager.state.activeWindowId === "friendster"
    : true;
  const zIndex = runtimeWin?.zIndex ?? 10;

  // Active theme
  const activeTheme =
    FRIENDSTER_THEMES.find((t) => t.id === state.userProfile.themeId) ||
    FRIENDSTER_THEMES[0];

  // Derived counts
  const approvedTestimonials = state.testimonials.filter(
    (t) => t.recipientId === "user" && t.status === "approved",
  );
  const pendingTestimonials = state.testimonials.filter(
    (t) => t.recipientId === "user" && t.status === "pending",
  );
  const unreadNotifications = state.notifications.filter((n) => !n.isRead);

  // Active viewing friend (if not viewing own profile)
  const viewingFriend = state.viewingFriendId
    ? FICTIONAL_PROFILES.find((f) => f.id === state.viewingFriendId)
    : null;

  // Actions with toast triggers
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SAVE_PROFILE" });
    toast.notify.success(
      "Profile Updated",
      "Your new status and About Me have been saved.",
      { appId: "friendster", appName: "Friendster PH" },
    );
  };

  const handleSelectTheme = (themeId: typeof activeTheme.id) => {
    dispatch({ type: "SET_THEME", themeId });
    const theme = FRIENDSTER_THEMES.find((t) => t.id === themeId);
    toast.notify.info(
      "Profile Skin Changed",
      `Switched theme to ${theme?.name || themeId}.`,
      { appId: "friendster", appName: "Friendster PH" },
    );
  };

  const handleAddFriend = (friendId: string) => {
    dispatch({ type: "ADD_FRIEND", friendId });
    const friend = FICTIONAL_PROFILES.find((f) => f.id === friendId);
    toast.notify.success(
      "Barkada Added",
      `${friend?.name || "Friend"} has been added to your Friendster network.`,
      { appId: "friendster", appName: "Friendster PH" },
    );
  };

  const handleRemoveFriend = (friendId: string) => {
    dispatch({ type: "REMOVE_FRIEND", friendId });
    const friend = FICTIONAL_PROFILES.find((f) => f.id === friendId);
    toast.notify.warning(
      "Friend Removed",
      `${friend?.name || "Friend"} was removed from your friends list.`,
      { appId: "friendster", appName: "Friendster PH" },
    );
  };

  const handleApproveTestimonial = (testimonialId: string) => {
    dispatch({ type: "APPROVE_TESTIMONIAL", testimonialId });
    toast.notify.success(
      "Testimonial Approved",
      "The testimonial is now visible on your public Friendster profile.",
      { appId: "friendster", appName: "Friendster PH" },
    );
  };

  const handleRejectTestimonial = (testimonialId: string) => {
    dispatch({ type: "REJECT_TESTIMONIAL", testimonialId });
    toast.notify.info(
      "Testimonial Declined",
      "The testimonial was declined and will not appear on your profile.",
      { appId: "friendster", appName: "Friendster PH" },
    );
  };

  const handleSubmitTestimonial = (recipientId: string) => {
    if (!testiDraft.trim()) return;
    dispatch({
      type: "WRITE_TESTIMONIAL",
      recipientId,
      content: testiDraft.trim(),
    });
    setTestiDraft("");
    setWritingTestiForId(null);
    const friend = FICTIONAL_PROFILES.find((f) => f.id === recipientId);
    toast.notify.success(
      "Testimonial Sent",
      `Your testimonial for ${friend?.name || "your friend"} was submitted.`,
      { appId: "friendster", appName: "Friendster PH" },
    );
  };

  const handlePostBulletin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBulletinTitle.trim() || !newBulletinContent.trim()) return;
    dispatch({
      type: "POST_BULLETIN",
      title: newBulletinTitle.trim(),
      content: newBulletinContent.trim(),
    });
    setNewBulletinTitle("");
    setNewBulletinContent("");
    setIsComposingBulletin(false);
    toast.notify.success(
      "Bulletin Posted",
      `Shared "${newBulletinTitle.trim()}" with your Friendster friends.`,
      { appId: "friendster", appName: "Friendster PH" },
    );
  };

  const friendsterArchiveSource = sourceCredits.find(
    (s) => s.id === "friendster-archive",
  );

  return (
    <WindowFrame
      id="friendster"
      title="Friendster PH"
      icon="👤"
      bounds={bounds}
      zIndex={zIndex}
      isActive={isActive}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      minSize={{ width: 520, height: 400 }}
      desktopArea={windowManager.state.desktopArea}
      onFocus={() => windowManager.focusWindow("friendster")}
      onMove={(pos) => windowManager.moveWindow("friendster", pos)}
      onResize={(newBounds) => windowManager.resizeWindow("friendster", newBounds)}
      onMinimize={() => windowManager.minimizeWindow("friendster")}
      onMaximize={() => windowManager.maximizeWindow("friendster")}
      onRestore={() => windowManager.restoreWindow("friendster")}
      onToggleMaximize={() => windowManager.toggleMaximize("friendster")}
      onClose={() => windowManager.closeWindow("friendster")}
      closeLabel="Close Friendster PH"
    >
      <div
        className={styles.friendsterRoot}
        data-testid="app-shell-friendster"
        data-layout-mode={isMaximized ? "maximized" : "standard"}
        data-theme={activeTheme.id}
        style={
          {
            "--friendster-primary": activeTheme.primary,
            "--friendster-accent": activeTheme.accent,
            "--friendster-bg": activeTheme.background,
            "--friendster-surface": activeTheme.surface,
            "--friendster-text": activeTheme.text,
            "--friendster-border": activeTheme.border,
          } as React.CSSProperties
        }
      >
        {/* Top Header */}
        <header className={styles.headerBar}>
          <div className={styles.brandArea}>
            <span className={styles.brandLogo} aria-hidden="true">
              🙂
            </span>
            <div>
              <h1 className={styles.brandTitle}>Friendster PH</h1>
              <span className={styles.brandTagline}>
                Connecting Barkada Across the Islands
              </span>
            </div>
          </div>

          <div className={styles.headerRight}>
            <button
              type="button"
              className={styles.notifButton}
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (unreadNotifications.length > 0) {
                  dispatch({ type: "MARK_NOTIFICATIONS_READ" });
                }
              }}
              aria-label={`Friendster notifications (${unreadNotifications.length} unread)`}
            >
              🔔 Inbox
              {unreadNotifications.length > 0 && (
                <span className={styles.notifBadge}>
                  {unreadNotifications.length}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Subnavigation Tabs */}
        <nav
          className={styles.subNavBar}
          role="tablist"
          aria-label="Friendster sections"
        >
          <button
            type="button"
            role="tab"
            aria-selected={state.activeTab === "profile" && !state.viewingFriendId}
            className={`${styles.tabButton} ${
              state.activeTab === "profile" && !state.viewingFriendId
                ? styles.tabButtonActive
                : ""
            }`}
            onClick={() => dispatch({ type: "VIEW_MY_PROFILE" })}
          >
            My Profile
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={state.activeTab === "friends"}
            className={`${styles.tabButton} ${
              state.activeTab === "friends" ? styles.tabButtonActive : ""
            }`}
            onClick={() => dispatch({ type: "SET_TAB", tab: "friends" })}
          >
            Friends <span className={styles.tabPill}>{state.friendIds.length}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={state.activeTab === "testimonials"}
            className={`${styles.tabButton} ${
              state.activeTab === "testimonials" ? styles.tabButtonActive : ""
            }`}
            onClick={() => dispatch({ type: "SET_TAB", tab: "testimonials" })}
          >
            Testimonials{" "}
            <span className={styles.tabPill}>
              {approvedTestimonials.length +
                (pendingTestimonials.length > 0 ? ` (+${pendingTestimonials.length})` : "")}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={state.activeTab === "bulletins"}
            className={`${styles.tabButton} ${
              state.activeTab === "bulletins" ? styles.tabButtonActive : ""
            }`}
            onClick={() => dispatch({ type: "SET_TAB", tab: "bulletins" })}
          >
            Bulletins <span className={styles.tabPill}>{state.bulletins.length}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={state.activeTab === "museum-info"}
            className={`${styles.tabButton} ${
              state.activeTab === "museum-info" ? styles.tabButtonActive : ""
            }`}
            onClick={() => dispatch({ type: "SET_TAB", tab: "museum-info" })}
          >
            Museum Info
          </button>
        </nav>

        {/* Scrollable Content Region */}
        <div className={styles.scrollArea}>
          {/* Notifications Drawer */}
          {showNotifications && (
            <div
              className={styles.cardBox}
              style={{ marginBottom: 14 }}
              role="region"
              aria-label="Recent activity notifications"
            >
              <div className={styles.cardBoxHeader}>
                <span>Notifications & Activity</span>
                <button
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    color: "inherit",
                  }}
                  onClick={() => setShowNotifications(false)}
                >
                  ✕ Close
                </button>
              </div>
              <div className={styles.cardBoxBody}>
                {state.notifications.map((n) => (
                  <div key={n.id} className={styles.detailRow}>
                    <span className={styles.detailLabel}>{n.time}</span>
                    <span className={styles.detailValue}>{n.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 1: PROFILE VIEW (OWN PROFILE OR FRIEND PROFILE) */}
          {state.activeTab === "profile" && (
            <div className={styles.profileLayout}>
              {/* Sidebar Column */}
              <aside className={styles.sidebarColumn}>
                {/* Primary Photo Card */}
                <div className={styles.cardBox}>
                  <div className={styles.photoWrapper}>
                    <div className={styles.avatarFrame}>
                      <ProfilePortrait
                        src={viewingFriend ? viewingFriend.portraitSrc : state.userProfile.portraitSrc}
                        name={viewingFriend ? viewingFriend.name : state.userProfile.displayName}
                        avatar={viewingFriend ? viewingFriend.avatar : state.userProfile.avatar}
                      />
                    </div>
                    <span className={styles.photoCaption}>Primary Photo</span>
                  </div>

                  <div className={styles.cardBoxBody}>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Member Since</span>
                      <span className={styles.detailValue}>
                        {viewingFriend ? "April 2004" : state.userProfile.memberSince}
                      </span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Location</span>
                      <span className={styles.detailValue}>
                        {viewingFriend
                          ? viewingFriend.location
                          : state.userProfile.location}
                      </span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Relationship</span>
                      <span className={styles.detailValue}>
                        {viewingFriend
                          ? viewingFriend.relationshipStatus
                          : state.userProfile.relationshipStatus}
                      </span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Profile Views</span>
                      <span className={styles.detailValue}>
                        {viewingFriend ? "942" : state.userProfile.profileViews.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Y2K Theme Picker (Only on My Profile) */}
                {!viewingFriend && (
                  <div className={styles.cardBox}>
                    <div className={styles.cardBoxHeader}>
                      <span>Profile Skins</span>
                    </div>
                    <div className={styles.cardBoxBody}>
                      <div className={styles.themeList}>
                        {FRIENDSTER_THEMES.map((theme) => (
                          <button
                            key={theme.id}
                            type="button"
                            className={`${styles.themeOption} ${
                              activeTheme.id === theme.id
                                ? styles.themeOptionActive
                                : ""
                            }`}
                            onClick={() => handleSelectTheme(theme.id)}
                          >
                            <span
                              className={styles.themeSwatch}
                              style={{ background: theme.primary }}
                              aria-hidden="true"
                            />
                            <span>{theme.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Barkada Quick Widget */}
                <div className={styles.cardBox}>
                  <div className={styles.cardBoxHeader}>
                    <span>Barkada ({state.friendIds.length})</span>
                  </div>
                  <div className={styles.cardBoxBody}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {state.friendIds.slice(0, 4).map((fId) => {
                        const f = FICTIONAL_PROFILES.find((p) => p.id === fId);
                        if (!f) return null;
                        return (
                          <button
                            key={f.id}
                            type="button"
                            title={f.name}
                            style={{
                              background: "#fef3c7",
                              border: "1px solid #fcd7b2",
                              borderRadius: 4,
                              padding: 6,
                              fontSize: 18,
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              dispatch({ type: "VIEW_FRIEND", friendId: f.id })
                            }
                          >
                            <ProfilePortrait src={f.portraitSrc} name={f.name} avatar={f.avatar} compact />
                          </button>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      className={styles.actionButtonSecondary}
                      style={{ fontSize: 11, padding: 4 }}
                      onClick={() => dispatch({ type: "SET_TAB", tab: "friends" })}
                    >
                      Browse all {state.friendIds.length} friends →
                    </button>
                  </div>
                </div>
              </aside>

              {/* Main Profile Column */}
              <main className={styles.mainColumn}>
                {/* Back button if viewing friend profile */}
                {viewingFriend && (
                  <button
                    type="button"
                    className={styles.actionButtonSecondary}
                    style={{ alignSelf: "flex-start", marginBottom: 4 }}
                    onClick={() => dispatch({ type: "VIEW_MY_PROFILE" })}
                  >
                    ← Back to My Profile
                  </button>
                )}

                {/* Profile Hero Header */}
                <header className={styles.profileHero}>
                  <div className={styles.profileHeroTop}>
                    <div>
                      <h2 className={styles.displayName}>
                        {viewingFriend
                          ? `${viewingFriend.name} (${viewingFriend.handle})`
                          : state.userProfile.displayName}
                      </h2>
                      <p className={styles.statusQuote}>
                        “{viewingFriend ? viewingFriend.tagline : state.userProfile.status}”
                      </p>
                    </div>

                    <div>
                      {viewingFriend ? (
                        <div style={{ display: "flex", gap: 8 }}>
                          {state.friendIds.includes(viewingFriend.id) ? (
                            <button
                              type="button"
                              className={`${styles.btnToggleFriend} ${styles.btnRemoveFriend}`}
                              onClick={() => handleRemoveFriend(viewingFriend.id)}
                            >
                              ✕ Remove Friend
                            </button>
                          ) : (
                            <button
                              type="button"
                              className={`${styles.btnToggleFriend} ${styles.btnAddFriend}`}
                              onClick={() => handleAddFriend(viewingFriend.id)}
                            >
                              + Add to Friends
                            </button>
                          )}
                          <button
                            type="button"
                            className={styles.actionButtonPrimary}
                            onClick={() => {
                              setWritingTestiForId(viewingFriend.id);
                              dispatch({ type: "SET_TAB", tab: "testimonials" });
                            }}
                          >
                            Write Testimonial
                          </button>
                        </div>
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
                  </div>
                </header>

                {/* Edit Profile Form (When Active) */}
                {state.isEditingProfile && !viewingFriend && (
                  <form className={styles.editForm} onSubmit={handleSaveProfile}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel} htmlFor="edit-display-name">
                        Display Name
                      </label>
                      <input
                        id="edit-display-name"
                        type="text"
                        className={styles.formInput}
                        value={state.editFormData.displayName}
                        onChange={(e) =>
                          dispatch({
                            type: "UPDATE_EDIT_FIELD",
                            field: "displayName",
                            value: e.target.value,
                          })
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
                        onChange={(e) =>
                          dispatch({
                            type: "UPDATE_EDIT_FIELD",
                            field: "status",
                            value: e.target.value,
                          })
                        }
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
                        onChange={(e) =>
                          dispatch({
                            type: "UPDATE_EDIT_FIELD",
                            field: "aboutMe",
                            value: e.target.value,
                          })
                        }
                        rows={4}
                        required
                      />
                    </div>

                    <div className={styles.formActions}>
                      <button
                        type="button"
                        className={styles.actionButtonSecondary}
                        onClick={() => dispatch({ type: "CANCEL_EDIT_PROFILE" })}
                      >
                        Cancel
                      </button>
                      <button type="submit" className={styles.actionButtonPrimary}>
                        Save Profile
                      </button>
                    </div>
                  </form>
                )}

                {/* About Me Section */}
                <section className={styles.cardBox} aria-label="About Me">
                  <div className={styles.cardBoxHeader}>
                    <span>About Me</span>
                  </div>
                  <div className={styles.cardBoxBody}>
                    <p className={styles.aboutContent}>
                      {viewingFriend ? viewingFriend.aboutMe : state.userProfile.aboutMe}
                    </p>

                    {viewingFriend && (
                      <div style={{ marginTop: 8 }}>
                        <span className={styles.detailLabel}>Interests: </span>
                        <span style={{ fontSize: 12 }}>
                          {viewingFriend.interests.join(" · ")}
                        </span>
                      </div>
                    )}
                  </div>
                </section>

                {/* Public Testimonials Highlight on Profile */}
                <section className={styles.cardBox} aria-label="Testimonials">
                  <div className={styles.cardBoxHeader}>
                    <span>
                      Testimonials (
                      {viewingFriend
                        ? "2"
                        : approvedTestimonials.length.toString()}
                      )
                    </span>
                    <button
                      type="button"
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: 11,
                        color: "inherit",
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                      onClick={() =>
                        dispatch({ type: "SET_TAB", tab: "testimonials" })
                      }
                    >
                      View All →
                    </button>
                  </div>
                  <div className={styles.cardBoxBody}>
                    {approvedTestimonials.slice(0, 2).map((testi) => (
                      <article key={testi.id} className={styles.testiCard}>
                        <div className={styles.testiAvatar} aria-hidden="true">
                          {testi.authorAvatar}
                        </div>
                        <div className={styles.testiContent}>
                          <div className={styles.testiHeader}>
                            <span className={styles.testiAuthor}>
                              {testi.authorName}
                            </span>
                            <time className={styles.testiDate}>{testi.date}</time>
                          </div>
                          <p className={styles.testiQuote}>“{testi.content}”</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </main>
            </div>
          )}

          {/* TAB 2: FRIENDS DIRECTORY */}
          {state.activeTab === "friends" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className={styles.cardBox}>
                <div className={styles.cardBoxHeader}>
                  <span>Your Barkada Network ({state.friendIds.length})</span>
                </div>
                <div className={styles.cardBoxBody}>
                  <p style={{ margin: 0, fontSize: 12 }}>
                    Browse your fictional Filipino Friendster barkada. You can
                    inspect their profiles, remove connections, or discover new
                    friends across the country.
                  </p>
                </div>
              </div>

              <div className={styles.friendsGrid}>
                {FICTIONAL_PROFILES.map((friend) => {
                  const isConnected = state.friendIds.includes(friend.id);

                  return (
                    <article key={friend.id} className={styles.friendCard}>
                      <div className={styles.friendAvatar}>
                        <ProfilePortrait src={friend.portraitSrc} name={friend.name} avatar={friend.avatar} compact />
                      </div>
                      <h3 className={styles.friendName}>{friend.name}</h3>
                      <span className={styles.friendHandle}>
                        @{friend.handle}
                      </span>
                      <p className={styles.friendTagline}>{friend.tagline}</p>
                      <span style={{ fontSize: 10, color: "#64748b" }}>
                        📍 {friend.location}
                      </span>

                      <div className={styles.friendCardActions}>
                        <button
                          type="button"
                          className={styles.btnViewFriend}
                          onClick={() =>
                            dispatch({
                              type: "VIEW_FRIEND",
                              friendId: friend.id,
                            })
                          }
                        >
                          View Profile
                        </button>

                        {isConnected ? (
                          <button
                            type="button"
                            className={`${styles.btnToggleFriend} ${styles.btnRemoveFriend}`}
                            onClick={() => handleRemoveFriend(friend.id)}
                            aria-label={`Remove ${friend.name} from friends`}
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            type="button"
                            className={`${styles.btnToggleFriend} ${styles.btnAddFriend}`}
                            onClick={() => handleAddFriend(friend.id)}
                            aria-label={`Add ${friend.name} as friend`}
                          >
                            + Add
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: TESTIMONIALS */}
          {state.activeTab === "testimonials" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Write Testimonial Composer */}
              <div className={styles.cardBox}>
                <div className={styles.cardBoxHeader}>
                  <span>Write a Testimonial</span>
                </div>
                <div className={styles.cardBoxBody}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="testi-recipient">
                      Choose Barkada Member
                    </label>
                    <select
                      id="testi-recipient"
                      className={styles.formInput}
                      value={writingTestiForId || state.friendIds[0] || ""}
                      onChange={(e) => setWritingTestiForId(e.target.value)}
                    >
                      {FICTIONAL_PROFILES.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.handle})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Period presets for quick testing and authentic flavor */}
                  <div>
                    <span className={styles.formLabel}>
                      Period Y2K Presets (Click to insert):
                    </span>
                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        flexWrap: "wrap",
                        marginTop: 4,
                      }}
                    >
                      {PRESET_TESTIMONIALS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={styles.actionButtonSecondary}
                          style={{ fontSize: 11, padding: "3px 8px" }}
                          onClick={() => setTestiDraft(preset)}
                        >
                          Preset #{idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="testi-content">
                      Your Testimonial Content
                    </label>
                    <textarea
                      id="testi-content"
                      className={styles.formTextarea}
                      placeholder="Write your genuine testimonial here... (wag kalimutan mag-iwan ng testi back!)"
                      value={testiDraft}
                      onChange={(e) => setTestiDraft(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <button
                    type="button"
                    className={styles.actionButtonPrimary}
                    style={{ alignSelf: "flex-end" }}
                    onClick={() =>
                      handleSubmitTestimonial(
                        writingTestiForId || state.friendIds[0] || "kiko-reyes",
                      )
                    }
                  >
                    Submit Testimonial
                  </button>
                </div>
              </div>

              {/* Pending Approval Section */}
              {pendingTestimonials.length > 0 && (
                <div className={styles.cardBox}>
                  <div
                    className={styles.cardBoxHeader}
                    style={{ background: "#fef3c7" }}
                  >
                    <span>
                      Pending Approval Required ({pendingTestimonials.length})
                    </span>
                  </div>
                  <div className={styles.cardBoxBody}>
                    <p style={{ margin: 0, fontSize: 12, color: "#92400e" }}>
                      In early social networks, incoming testimonials required
                      explicit approval from profile owners before becoming
                      publicly visible.
                    </p>

                    <div className={styles.testiList}>
                      {pendingTestimonials.map((testi) => (
                        <article
                          key={testi.id}
                          className={`${styles.testiCard} ${styles.testiCardPending}`}
                        >
                          <div
                            className={styles.testiAvatar}
                            aria-hidden="true"
                          >
                            {testi.authorAvatar}
                          </div>
                          <div className={styles.testiContent}>
                            <div className={styles.testiHeader}>
                              <span className={styles.testiAuthor}>
                                {testi.authorName}
                              </span>
                              <time className={styles.testiDate}>
                                {testi.date}
                              </time>
                            </div>
                            <p className={styles.testiQuote}>
                              “{testi.content}”
                            </p>
                            <span className={styles.pendingNotice}>
                              ⏳ Requires your approval
                            </span>
                            <div className={styles.pendingActions}>
                              <button
                                type="button"
                                className={styles.btnApprove}
                                onClick={() =>
                                  handleApproveTestimonial(testi.id)
                                }
                              >
                                ✓ Approve & Display
                              </button>
                              <button
                                type="button"
                                className={styles.btnReject}
                                onClick={() =>
                                  handleRejectTestimonial(testi.id)
                                }
                              >
                                ✕ Reject
                              </button>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Approved Testimonials */}
              <div className={styles.cardBox}>
                <div className={styles.cardBoxHeader}>
                  <span>Approved Testimonials ({approvedTestimonials.length})</span>
                </div>
                <div className={styles.cardBoxBody}>
                  <div className={styles.testiList}>
                    {approvedTestimonials.map((testi) => (
                      <article key={testi.id} className={styles.testiCard}>
                        <div className={styles.testiAvatar} aria-hidden="true">
                          {testi.authorAvatar}
                        </div>
                        <div className={styles.testiContent}>
                          <div className={styles.testiHeader}>
                            <span className={styles.testiAuthor}>
                              {testi.authorName}
                            </span>
                            <time className={styles.testiDate}>{testi.date}</time>
                          </div>
                          <p className={styles.testiQuote}>“{testi.content}”</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BULLETINS */}
          {state.activeTab === "bulletins" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Bulletin Composer Button / Form */}
              <div className={styles.cardBox}>
                <div className={styles.cardBoxHeader}>
                  <span>Friendster Bulletin Board</span>
                  <button
                    type="button"
                    className={styles.actionButtonPrimary}
                    style={{ fontSize: 11, padding: "3px 8px" }}
                    onClick={() => setIsComposingBulletin(!isComposingBulletin)}
                  >
                    {isComposingBulletin ? "✕ Close Composer" : "✎ Post Bulletin"}
                  </button>
                </div>
                <div className={styles.cardBoxBody}>
                  <p style={{ margin: 0, fontSize: 12 }}>
                    Bulletins were public announcements blasted to all your
                    connected friends on their homepage feeds.
                  </p>

                  {isComposingBulletin && (
                    <form
                      onSubmit={handlePostBulletin}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        marginTop: 10,
                        padding: 12,
                        background: "rgba(234, 109, 0, 0.05)",
                        borderRadius: 6,
                        border: "1px solid var(--friendster-border)",
                      }}
                    >
                      <div className={styles.formGroup}>
                        <label
                          className={styles.formLabel}
                          htmlFor="bulletin-title"
                        >
                          Subject / Title
                        </label>
                        <input
                          id="bulletin-title"
                          type="text"
                          className={styles.formInput}
                          placeholder="e.g. Gig tonight sa Cubao Expo / Comp shop tournament"
                          value={newBulletinTitle}
                          onChange={(e) => setNewBulletinTitle(e.target.value)}
                          required
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label
                          className={styles.formLabel}
                          htmlFor="bulletin-body"
                        >
                          Message
                        </label>
                        <textarea
                          id="bulletin-body"
                          className={styles.formTextarea}
                          placeholder="Write message to your network..."
                          value={newBulletinContent}
                          onChange={(e) => setNewBulletinContent(e.target.value)}
                          rows={3}
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className={styles.actionButtonPrimary}
                        style={{ alignSelf: "flex-end" }}
                      >
                        Publish Bulletin
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Bulletins Feed */}
              <div className={styles.bulletinsList}>
                {state.bulletins.map((b) => (
                  <article key={b.id} className={styles.bulletinCard}>
                    <div className={styles.bulletinHeader}>
                      <div className={styles.bulletinAvatar} aria-hidden="true">
                        {b.authorAvatar}
                      </div>
                      <div className={styles.bulletinMeta}>
                        <span className={styles.bulletinAuthor}>
                          {b.authorName}{" "}
                          <span style={{ fontWeight: 400, color: "#64748b" }}>
                            (@{b.authorHandle})
                          </span>
                        </span>
                        <time className={styles.bulletinDate}>{b.date}</time>
                      </div>
                    </div>

                    <h3 className={styles.bulletinTitle}>{b.title}</h3>
                    <p className={styles.bulletinBody}>{b.content}</p>

                    {b.authorHandle === "me" && (
                      <button
                        type="button"
                        className={styles.bulletinDeleteBtn}
                        onClick={() =>
                          dispatch({
                            type: "DELETE_BULLETIN",
                            bulletinId: b.id,
                          })
                        }
                      >
                        Delete my bulletin
                      </button>
                    )}
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: INTEGRATED MUSEUM INFO */}
          {state.activeTab === "museum-info" && (
            <div className={styles.museumInfoWrapper}>
              <div className={styles.museumHeaderRow}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>
                    EXHIBIT INTERPRETATION · TECHNOLOGY ROOM
                  </span>
                  <h2 className={styles.museumExhibitTitle}>
                    Friendster Era & Early Profile Culture
                  </h2>
                </div>
                <span className={styles.museumYearsTag}>2002–2008</span>
              </div>

              <p className={styles.museumTextBlock}>
                Between 2002 and 2008, Friendster became the undisputed center of
                Filipino online social life. Long before smartphones and algorithmic
                recommendation engines dominated digital interaction, Filipinos
                crowded into internet cafés and home dial-up connections to curate
                their profiles, rearrange their Top Friends, design custom HTML/CSS
                skins, and collect testimonials.
              </p>

              <blockquote className={styles.museumQuoteBox}>
                “Testimonials, profile skins, carefully chosen photos, and a
                visible friends list made identity something Filipinos could
                design, display, and validate in public view.”
              </blockquote>

              <p className={styles.museumTextBlock}>
                <strong>Why it mattered:</strong> The Philippines emerged as one of
                Friendster’s largest user bases globally, serving as a pioneer for
                how social networks can mediate real-world community. In the
                Philippine context, Friendster was not merely a directory of
                contacts; it was a digital extension of barkada life, campus
                reputations, and courtship rituals.
              </p>

              <div className={styles.reconstructionNoticeBox}>
                <strong>Educational Reconstruction Notice:</strong> This application
                is an original educational recreation honoring mid-2000s Filipino
                social networking culture. All profile names, photos, testimonials,
                and bulletins are fictional historical reconstructions. No
                copyrighted code, logos, or assets from Friendster Inc. are used.
              </div>

              <div>
                <h4 style={{ margin: "0 0 6px 0", fontSize: 12, fontWeight: 800 }}>
                  Sources & Citations:
                </h4>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {friendsterArchiveSource && (
                    <li className={styles.sourceLinkItem}>
                      <a
                        href={friendsterArchiveSource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {friendsterArchiveSource.title}
                      </a>{" "}
                      — {friendsterArchiveSource.creator} (
                      {friendsterArchiveSource.usageBasis})
                    </li>
                  )}
                  <li className={styles.sourceLinkItem}>
                    <a
                      href="https://www.itu.int/en/ITU-D/Statistics/Dashboards/Pages/Digital-Development.aspx"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ITU Digital Development: Philippines
                    </a>{" "}
                    — International Telecommunication Union
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <footer className={styles.statusBar} aria-label="Status bar">
          <div className={styles.statusPane}>
            <span>● Connected</span>
            <span>·</span>
            <span>Theme: {activeTheme.name}</span>
          </div>
          <div className={styles.statusPane}>
            <span>{state.friendIds.length} Friends Online</span>
            <span>·</span>
            <span>Friendster PH v1.0</span>
          </div>
        </footer>
      </div>
    </WindowFrame>
  );
}
