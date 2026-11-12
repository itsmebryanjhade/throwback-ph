"use client";

import type React from "react";
import type {
  FriendsterAction,
  FriendsterState,
  FriendsterThemeId,
} from "@/lib/apps/friendster/types";
import { initialFriendsterState } from "@/lib/apps/friendster/reducer";
import styles from "./friendster.module.css";

export function ProfilePortrait({
  src,
  name,
  avatar,
  compact = false,
}: {
  src: string;
  name: string;
  avatar: string;
  compact?: boolean;
}) {
  if (!src) {
    return (
      <span
        className={compact ? styles.portraitFallbackCompact : styles.portraitFallback}
        role="img"
        aria-label={`${name} fictional profile portrait`}
      >
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

/** Handlers shared by every Friendster page (they also raise desktop toasts). */
export type FriendsterActions = {
  dispatch: React.Dispatch<FriendsterAction>;
  saveProfile: () => void;
  selectTheme: (themeId: FriendsterThemeId) => void;
  addFriend: (friendId: string) => void;
  removeFriend: (friendId: string) => void;
  approveTestimonial: (testimonialId: string) => void;
  rejectTestimonial: (testimonialId: string) => void;
  submitTestimonial: (recipientId: string, content: string) => void;
  postBulletin: (title: string, content: string) => void;
  /** Opens the testimonial composer addressed to a friend. */
  writeTestimonialFor: (friendId: string) => void;
  /** Scrolls to the profile-skin picker on My Profile. */
  focusSkins: () => void;
};

export type PageProps = {
  state: FriendsterState;
  actions: FriendsterActions;
};

/** Starter tasks for first-time visitors. Each is derived from saved state. */
export function getStarterTasks(state: FriendsterState) {
  const initialFriendCount = initialFriendsterState.friendIds.length;
  return [
    {
      id: "skin",
      label: "Change your profile skin",
      hint: "Every 2000s profile needed its own look.",
      done: state.userProfile.themeId !== initialFriendsterState.userProfile.themeId,
    },
    {
      id: "approve",
      label: "Approve a testimonial",
      hint: "Testis only showed up after you said yes.",
      done: !state.testimonials.some((t) => t.recipientId === "user" && t.status === "pending"),
    },
    {
      id: "friend",
      label: "Add a new friend",
      hint: "Grow your barkada list.",
      done: state.friendIds.length > initialFriendCount,
    },
    {
      id: "write",
      label: "Write a testi for a friend",
      hint: "Testi-for-testi was the rule!",
      done: state.testimonials.some((t) => t.authorId === "user"),
    },
    {
      id: "bulletin",
      label: "Post a bulletin",
      hint: "Announce a gig or a comp shop meet-up.",
      done: state.bulletins.some((b) => b.authorHandle === "me"),
    },
  ] as const;
}
