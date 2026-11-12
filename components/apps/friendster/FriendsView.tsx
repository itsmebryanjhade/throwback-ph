"use client";

import { useState } from "react";
import { FICTIONAL_PROFILES } from "@/lib/apps/friendster/data";
import { ProfilePortrait, type PageProps } from "./shared";
import styles from "./friendster.module.css";

type Filter = "all" | "friends" | "new";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Everyone" },
  { id: "friends", label: "My barkada" },
  { id: "new", label: "Not yet friends" },
];

export function FriendsView({ state, actions }: PageProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const needle = query.trim().toLowerCase();

  const people = FICTIONAL_PROFILES.filter((friend) => {
    const isFriend = state.friendIds.includes(friend.id);
    if (filter === "friends" && !isFriend) return false;
    if (filter === "new" && isFriend) return false;
    if (!needle) return true;
    return [friend.name, friend.handle, friend.location, friend.tagline].some((field) =>
      field.toLowerCase().includes(needle),
    );
  });

  return (
    <div className={styles.page}>
      <section className={styles.box}>
        <h2 className={styles.pageTitle}>Find Barkada</h2>
        <p className={styles.boxHint}>
          You have <strong>{state.friendIds.length} friends</strong>. Search for classmates and kapitbahay, open
          their profiles, and add them to your network.
        </p>
        <div className={styles.searchRow}>
          <label className={styles.srOnly} htmlFor="friendster-search">
            Search people
          </label>
          <input
            id="friendster-search"
            type="search"
            className={styles.formInput}
            placeholder="Search by name, screen name, or city…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className={styles.filterRow} role="group" aria-label="Show">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.filterChip}
                aria-pressed={filter === item.id}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {people.length === 0 ? (
        <p className={styles.emptyState}>Walang nahanap. No one matches “{query}”.</p>
      ) : (
        <div className={styles.friendsGrid}>
          {people.map((friend) => {
            const isConnected = state.friendIds.includes(friend.id);
            return (
              <article key={friend.id} className={styles.friendCard} data-friend={isConnected}>
                {isConnected && <span className={styles.friendBadge}>✓ Friend</span>}
                <div className={styles.friendAvatar}>
                  <ProfilePortrait src={friend.portraitSrc} name={friend.name} avatar={friend.avatar} compact />
                </div>
                <h3 className={styles.friendName}>{friend.name}</h3>
                <span className={styles.friendHandle}>@{friend.handle}</span>
                <p className={styles.friendTagline}>{friend.tagline}</p>
                <span className={styles.friendLocation}>📍 {friend.location}</span>
                <div className={styles.friendCardActions}>
                  <button
                    type="button"
                    className={styles.btnViewFriend}
                    onClick={() => actions.dispatch({ type: "VIEW_FRIEND", friendId: friend.id })}
                  >
                    View Profile
                  </button>
                  {isConnected ? (
                    <button
                      type="button"
                      className={`${styles.btnToggleFriend} ${styles.btnRemoveFriend}`}
                      onClick={() => actions.removeFriend(friend.id)}
                      aria-label={`Remove ${friend.name} from friends`}
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={`${styles.btnToggleFriend} ${styles.btnAddFriend}`}
                      onClick={() => actions.addFriend(friend.id)}
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
      )}
    </div>
  );
}
