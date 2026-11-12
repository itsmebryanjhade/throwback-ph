"use client";

import React, { useRef, useState } from "react";
import { useToast } from "@/lib/notification-system/NotificationContext";
import { useWindowManager } from "@/lib/window-system/WindowContext";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import { FRIENDSTER_THEMES, FICTIONAL_PROFILES } from "@/lib/apps/friendster/data";
import { friendsterReducer, initialFriendsterState } from "@/lib/apps/friendster/reducer";
import type { FriendsterTab } from "@/lib/apps/friendster/types";
import { matchesStateShape, usePersistentReducer } from "@/lib/persistence/usePersistentReducer";
import { ProfileView } from "./ProfileView";
import { FriendsView } from "./FriendsView";
import { TestimonialsView } from "./TestimonialsView";
import { BulletinsView } from "./BulletinsView";
import { MuseumInfoView } from "./MuseumInfoView";
import type { FriendsterActions } from "./shared";
import styles from "./friendster.module.css";

const TOAST_SOURCE = { appId: "friendster", appName: "Friendster PH" };
const SITE = "http://www.friendster-ph.asl";

export function FriendsterApp() {
  const [state, dispatch] = usePersistentReducer(friendsterReducer, initialFriendsterState, {
    // v4: profile gained interests, favorite music, who-I-want-to-meet, and a profile song.
    key: "throwback-ph:app:friendster",
    version: 4,
    validate: matchesStateShape(initialFriendsterState),
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [testiRecipientId, setTestiRecipientId] = useState<string | null>(null);
  const skinsRef = useRef<HTMLElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const windowManager = useWindowManager();
  const toast = useToast();

  const runtimeWin = windowManager.state.windows["friendster"];
  const bounds = runtimeWin?.bounds ?? { x: 70, y: 30, width: 940, height: 640 };
  const isMinimized = runtimeWin?.isMinimized ?? false;
  const isMaximized = runtimeWin?.isMaximized ?? false;
  const isActive = runtimeWin ? windowManager.state.activeWindowId === "friendster" : true;
  const zIndex = runtimeWin?.zIndex ?? 10;

  const activeTheme = FRIENDSTER_THEMES.find((theme) => theme.id === state.userProfile.themeId) ?? FRIENDSTER_THEMES[0];
  const approvedCount = state.testimonials.filter((t) => t.recipientId === "user" && t.status === "approved").length;
  const pendingCount = state.testimonials.filter((t) => t.recipientId === "user" && t.status === "pending").length;
  const unread = state.notifications.filter((notification) => !notification.isRead);
  const viewingFriend = state.viewingFriendId
    ? FICTIONAL_PROFILES.find((friend) => friend.id === state.viewingFriendId)
    : null;
  const firstName = state.userProfile.displayName.split(" ")[0];

  const goTo = (tab: FriendsterTab) => {
    if (tab === "profile") dispatch({ type: "VIEW_MY_PROFILE" });
    else dispatch({ type: "SET_TAB", tab });
    scrollRef.current?.scrollTo?.({ top: 0 });
  };

  const actions: FriendsterActions = {
    dispatch,
    saveProfile: () => {
      dispatch({ type: "SAVE_PROFILE" });
      toast.notify.success("Profile Updated", "Your new status and About Me have been saved.", TOAST_SOURCE);
    },
    selectTheme: (themeId) => {
      dispatch({ type: "SET_THEME", themeId });
      const theme = FRIENDSTER_THEMES.find((candidate) => candidate.id === themeId);
      toast.notify.info("Profile Skin Changed", `Switched theme to ${theme?.name ?? themeId}.`, TOAST_SOURCE);
    },
    addFriend: (friendId) => {
      dispatch({ type: "ADD_FRIEND", friendId });
      const friend = FICTIONAL_PROFILES.find((candidate) => candidate.id === friendId);
      toast.notify.success("Barkada Added", `${friend?.name ?? "Friend"} has been added to your Friendster network.`, TOAST_SOURCE);
    },
    removeFriend: (friendId) => {
      dispatch({ type: "REMOVE_FRIEND", friendId });
      const friend = FICTIONAL_PROFILES.find((candidate) => candidate.id === friendId);
      toast.notify.warning("Friend Removed", `${friend?.name ?? "Friend"} was removed from your friends list.`, TOAST_SOURCE);
    },
    approveTestimonial: (testimonialId) => {
      dispatch({ type: "APPROVE_TESTIMONIAL", testimonialId });
      toast.notify.success("Testimonial Approved", "The testimonial is now visible on your public Friendster profile.", TOAST_SOURCE);
    },
    rejectTestimonial: (testimonialId) => {
      dispatch({ type: "REJECT_TESTIMONIAL", testimonialId });
      toast.notify.info("Testimonial Declined", "The testimonial was declined and will not appear on your profile.", TOAST_SOURCE);
    },
    submitTestimonial: (recipientId, content) => {
      dispatch({ type: "WRITE_TESTIMONIAL", recipientId, content });
      const friend = FICTIONAL_PROFILES.find((candidate) => candidate.id === recipientId);
      toast.notify.success("Testimonial Sent", `Your testimonial for ${friend?.name ?? "your friend"} was submitted.`, TOAST_SOURCE);
    },
    postBulletin: (title, content) => {
      dispatch({ type: "POST_BULLETIN", title, content });
      toast.notify.success("Bulletin Posted", `Shared "${title}" with your Friendster friends.`, TOAST_SOURCE);
    },
    writeTestimonialFor: (friendId) => {
      setTestiRecipientId(friendId);
      goTo("testimonials");
    },
    focusSkins: () => {
      goTo("profile");
      window.setTimeout(() => {
        skinsRef.current?.scrollIntoView?.({ behavior: "smooth", block: "center" });
        skinsRef.current?.focus({ preventScroll: true });
      }, 0);
    },
  };

  const path =
    state.activeTab === "profile"
      ? viewingFriend
        ? `/${viewingFriend.handle}`
        : `/${firstName.toLowerCase()}`
      : `/${state.activeTab === "museum-info" ? "about" : state.activeTab}`;

  const tabs: { id: FriendsterTab; label: string; count?: string; selected: boolean }[] = [
    { id: "profile", label: "My Profile", selected: state.activeTab === "profile" && !state.viewingFriendId },
    { id: "friends", label: "Friends", count: String(state.friendIds.length), selected: state.activeTab === "friends" },
    {
      id: "testimonials",
      label: "Testimonials",
      count: `${approvedCount}${pendingCount > 0 ? ` (+${pendingCount})` : ""}`,
      selected: state.activeTab === "testimonials",
    },
    { id: "bulletins", label: "Bulletins", count: String(state.bulletins.length), selected: state.activeTab === "bulletins" },
    { id: "museum-info", label: "Museum Info", selected: state.activeTab === "museum-info" },
  ];

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
            "--friendster-pattern": activeTheme.pattern,
          } as React.CSSProperties
        }
      >
        {/* Old-school browser chrome */}
        <div className={styles.browserBar} aria-hidden="true">
          <span className={styles.browserBtn}>←</span>
          <span className={styles.browserBtn}>→</span>
          <span className={styles.browserBtn}>⟳</span>
          <span className={styles.browserBtn}>⌂</span>
          <span className={styles.addressLabel}>Address</span>
          <span className={styles.addressField}>
            <span className={styles.addressIcon}>e</span>
            {SITE}
            {path}
          </span>
          <span className={styles.goBtn}>Go</span>
        </div>

        {/* Site header */}
        <header className={styles.headerBar}>
          <div className={styles.brandArea}>
            <h1 className={styles.brandTitle}>
              <span className={styles.srOnly}>Friendster PH</span>
              <span aria-hidden="true" className={styles.wordmark}>
                friendster<sup>PH</sup>
              </span>
            </h1>
            <span className={styles.brandTagline}>Ang barkada mo, online.</span>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.hello}>Hi, {firstName}!</span>
            <button
              type="button"
              className={styles.notifButton}
              onClick={() => {
                setShowNotifications((value) => !value);
                if (unread.length > 0) dispatch({ type: "MARK_NOTIFICATIONS_READ" });
              }}
              aria-label={`Friendster notifications (${unread.length} unread)`}
              aria-expanded={showNotifications}
            >
              ✉ Inbox
              {unread.length > 0 && <span className={styles.notifBadge}>{unread.length}</span>}
            </button>
          </div>
        </header>

        <nav className={styles.subNavBar} role="tablist" aria-label="Friendster sections">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={tab.selected}
              className={`${styles.tabButton} ${tab.selected ? styles.tabButtonActive : ""}`}
              onClick={() => goTo(tab.id)}
            >
              {tab.label}
              {tab.count !== undefined && <span className={styles.tabPill}>{tab.count}</span>}
            </button>
          ))}
        </nav>

        <div className={styles.scrollArea} ref={scrollRef}>
          {showNotifications && (
            <section className={styles.inboxDrawer} role="region" aria-label="Recent activity notifications">
              <div className={styles.boxTitleRow}>
                <h2 className={styles.boxTitle}>Notifications & Activity</h2>
                <button type="button" className={styles.linkButton} onClick={() => setShowNotifications(false)}>
                  ✕ Close
                </button>
              </div>
              <ul className={styles.inboxList}>
                {state.notifications.map((notification) => (
                  <li key={notification.id}>
                    <span className={styles.inboxTime}>{notification.time}</span>
                    <span>{notification.message}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {state.activeTab === "profile" && <ProfileView state={state} actions={actions} skinsRef={skinsRef} />}
          {state.activeTab === "friends" && <FriendsView state={state} actions={actions} />}
          {state.activeTab === "testimonials" && (
            <TestimonialsView
              state={state}
              actions={actions}
              recipientId={testiRecipientId}
              onRecipientChange={setTestiRecipientId}
            />
          )}
          {state.activeTab === "bulletins" && <BulletinsView state={state} actions={actions} />}
          {state.activeTab === "museum-info" && <MuseumInfoView />}

          <footer className={styles.siteFooter}>
            About · Help · Privacy · Invite friends · © 2005 Friendster PH (a museum recreation)
          </footer>
        </div>

        <footer className={styles.statusBar} aria-label="Status bar">
          <div className={styles.statusPane}>
            <span>● Connected · DSL 384 kbps</span>
            <span>·</span>
            <span>Theme: {activeTheme.name}</span>
          </div>
          <div className={styles.statusPane}>
            <span>{state.friendIds.length} Friends Online</span>
            <span>·</span>
            <span>Internet zone</span>
          </div>
        </footer>
      </div>
    </WindowFrame>
  );
}
