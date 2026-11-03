"use client";

import React from "react";
import { useToast } from "@/lib/notification-system/NotificationContext";
import { useWindowManager } from "@/lib/window-system/WindowContext";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import { realityTvReducer } from "@/lib/apps/realitytv/reducer";
import { INITIAL_REALITY_TV_STATE } from "@/lib/apps/realitytv/data";
import { VoteDeskPanel } from "./VoteDeskPanel";
import { LiveStandingsPanel } from "./LiveStandingsPanel";
import { VoteHistoryPanel } from "./VoteHistoryPanel";
import { TvImpactPanel } from "./TvImpactPanel";
import { RealityTvMuseumInfo } from "./RealityTvMuseumInfo";
import styles from "./realitytv.module.css";
import { matchesStateShape, usePersistentReducer } from "@/lib/persistence/usePersistentReducer";

export function RealityTvVoteApp() {
  const [state, dispatch] = usePersistentReducer(realityTvReducer, INITIAL_REALITY_TV_STATE, {
    key: "throwback-ph:app:reality-tv-vote", version: 3, validate: matchesStateShape(INITIAL_REALITY_TV_STATE),
  });
  const windowManager = useWindowManager();
  const toast = useToast();

  const handleCastVote = (nomineeId: string, count: number) => {
    const nominee = state.nominees.find((n) => n.id === nomineeId);
    if (!nominee) return;

    const totalCost = state.costPerVote * count;
    if (state.prepaidLoad < totalCost) {
      toast.notify.warning(
        "Low Prepaid Balance",
        `You need ₱${totalCost.toFixed(2)} to cast ${count} vote(s). Please reload simulated load.`,
        { appId: "reality-tv-vote", appName: "Reality TV Vote" },
      );
      return;
    }

    dispatch({ type: "CAST_VOTE", nomineeId, voteCount: count });

    toast.notify.success(
      "Vote Cast",
      `Sent '${nominee.voteKeyword}' (${count} vote${count > 1 ? "s" : ""}) to ${state.shortcode} (-₱${totalCost.toFixed(2)} load).`,
      { appId: "reality-tv-vote", appName: "Reality TV Vote" },
    );
  };

  const handleReloadPrepaid = (amount: number) => {
    dispatch({ type: "RELOAD_PREPAID", amount });

    toast.notify.info(
      "Prepaid Load Added",
      `Successfully loaded +₱${amount.toFixed(2)} from simulated scratch card. Current balance: ₱${(state.prepaidLoad + amount).toFixed(2)}`,
      { appId: "reality-tv-vote", appName: "Reality TV Vote" },
    );
  };

  const handleSimulateSurge = () => {
    dispatch({ type: "SIMULATE_CROWD_SURGE" });

    toast.notify.info(
      "Crowd Surge Simulated",
      "Over 1,300 simulated incoming SMS votes registered! Live rankings have updated.",
      { appId: "reality-tv-vote", appName: "Reality TV Vote" },
    );
  };

  const win = windowManager.state.windows["reality-tv-vote"];
  const bounds = win?.bounds || { x: 110, y: 50, width: 700, height: 520 };
  const zIndex = win?.zIndex || 1;
  const isActive = windowManager.state.activeWindowId === "reality-tv-vote";
  const isMinimized = !!win?.isMinimized;
  const isMaximized = !!win?.isMaximized;

  const totalUserVotes = state.voteHistory.reduce((s, v) => s + v.voteCount, 0);

  return (
    <WindowFrame
      id="reality-tv-vote"
      title="Reality TV Vote"
      icon="📺"
      bounds={bounds}
      zIndex={zIndex}
      isActive={isActive}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      minSize={{ width: 480, height: 380 }}
      desktopArea={windowManager.state.desktopArea}
      onFocus={() => windowManager.focusWindow("reality-tv-vote")}
      onMove={(pos) => windowManager.moveWindow("reality-tv-vote", pos)}
      onResize={(newBounds) => windowManager.resizeWindow("reality-tv-vote", newBounds)}
      onMinimize={() => windowManager.minimizeWindow("reality-tv-vote")}
      onMaximize={() => windowManager.maximizeWindow("reality-tv-vote")}
      onRestore={() => windowManager.restoreWindow("reality-tv-vote")}
      onToggleMaximize={() => windowManager.toggleMaximize("reality-tv-vote")}
      onClose={() => windowManager.closeWindow("reality-tv-vote")}
    >
      <div className={styles.tvContainer} data-testid="app-shell-reality-tv-vote">
        {/* Studio Broadcast Header */}
        <header className={styles.tvHeader}>
          <div className={styles.brandArea}>
            <span className={styles.tvLogo} aria-hidden="true">📺</span>
            <div>
              <span className={styles.tvTitle}>Star Quest Pilipinas: Televote Live</span>
              <span className={styles.tvSub}>Season 2 Eviction Night Nationwide Voting Console</span>
            </div>
          </div>
          <div className={styles.broadcastLowerThird}>
            <strong>HOUSEMATE ON THE LINE</strong>
            <span>WEEK 7 · FICTIONAL EVICTION-NIGHT SIMULATION</span>
          </div>

          <div className={styles.headerMetrics}>
            <div className={styles.liveBadge}>
              <span className={styles.liveDot} aria-hidden="true" />
              <span>LIVE ON AIR</span>
            </div>

            <div className={styles.loadMeter} aria-label={`Prepaid load balance: ${state.prepaidLoad} pesos`}>
              <span>Load:</span>
              <span className={styles.loadAmount}>₱{state.prepaidLoad.toFixed(2)}</span>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <nav className={styles.navTabs} role="tablist" aria-label="Reality TV voting navigation">
          <button
            type="button"
            role="tab"
            aria-selected={state.activeTab === "vote"}
            className={`${styles.navTab} ${state.activeTab === "vote" ? styles.navTabActive : ""}`}
            onClick={() => dispatch({ type: "SET_TAB", tab: "vote" })}
          >
            🗳️ Vote Desk
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={state.activeTab === "standings"}
            className={`${styles.navTab} ${state.activeTab === "standings" ? styles.navTabActive : ""}`}
            onClick={() => dispatch({ type: "SET_TAB", tab: "standings" })}
          >
            📊 Live Standings
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={state.activeTab === "history"}
            className={`${styles.navTab} ${state.activeTab === "history" ? styles.navTabActive : ""}`}
            onClick={() => dispatch({ type: "SET_TAB", tab: "history" })}
          >
            📜 My Votes
            {totalUserVotes > 0 && (
              <span className={styles.tabBadge}>{totalUserVotes}</span>
            )}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={state.activeTab === "impact"}
            className={`${styles.navTab} ${state.activeTab === "impact" ? styles.navTabActive : ""}`}
            onClick={() => dispatch({ type: "SET_TAB", tab: "impact" })}
          >
            📺 TV Impact
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={state.activeTab === "museum-info"}
            className={`${styles.navTab} ${state.activeTab === "museum-info" ? styles.navTabActive : ""}`}
            onClick={() => dispatch({ type: "SET_TAB", tab: "museum-info" })}
          >
            🏛️ Museum Info
          </button>
        </nav>

        {/* Main Content Area */}
        <div className={styles.scrollArea}>
          {state.activeTab === "vote" && (
            <section className={styles.broadcastStage} aria-label="Eviction night broadcast">
            <VoteDeskPanel
              nominees={state.nominees}
              selectedNomineeId={state.selectedNomineeId}
              prepaidLoad={state.prepaidLoad}
              costPerVote={state.costPerVote}
              shortcode={state.shortcode}
              totalVotes={state.totalSimulatedVotes}
              onSelectNominee={(id) => dispatch({ type: "SELECT_NOMINEE", nomineeId: id })}
              onCastVote={handleCastVote}
              onReloadPrepaid={handleReloadPrepaid}
              onNavigateToStandings={() => dispatch({ type: "SET_TAB", tab: "standings" })}
            />
            </section>
          )}

          {state.activeTab === "standings" && (
            <LiveStandingsPanel
              nominees={state.nominees}
              totalVotes={state.totalSimulatedVotes}
              onSimulateSurge={handleSimulateSurge}
              onSelectNominee={(id) => {
                dispatch({ type: "SELECT_NOMINEE", nomineeId: id });
                dispatch({ type: "SET_TAB", tab: "vote" });
              }}
            />
          )}

          {state.activeTab === "history" && (
            <VoteHistoryPanel
              voteHistory={state.voteHistory}
              onClearHistory={() => dispatch({ type: "CLEAR_HISTORY" })}
            />
          )}

          {state.activeTab === "impact" && <TvImpactPanel />}

          {state.activeTab === "museum-info" && <RealityTvMuseumInfo />}
        </div>
      </div>
    </WindowFrame>
  );
}
