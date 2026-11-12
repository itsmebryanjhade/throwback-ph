"use client";

import { useEffect, useRef, useState } from "react";
import type { Nominee, RealityTvState } from "@/lib/apps/realitytv/types";
import { NomineePortrait } from "./NomineePortrait";
import styles from "./eviction.module.css";

export const VOTING_SECONDS = 40;
export const GM_BONUS_VOTES = 250;
export const GM_COST = 1;
export const MAX_GMS = 4;
const TICK_MS = 2000;
const SUSPENSE_MS = 2600;

type Phase = "intro" | "open" | "closed" | "result";

/** The nation votes too: a fixed, gently uneven pattern so every run is fair and testable. */
export function crowdWave(tick: number): Record<string, number> {
  return {
    "nom-bea": 60 + ((tick * 37) % 50),
    "nom-kiko": 70 + ((tick * 53) % 40),
    "nom-joma": 40 + ((tick * 29) % 60),
  };
}

export function lowestNominee(nominees: Nominee[]) {
  return nominees
    .filter((n) => n.status === "nominated")
    .reduce<Nominee | null>((low, n) => (!low || n.currentVotes < low.currentVotes ? n : low), null);
}

export type EvictionHandlers = {
  select: (id: string) => void;
  vote: (id: string, count: number) => void;
  gm: (id: string) => void;
  reload: (amount: number) => void;
  crowd: (votes: Record<string, number>) => void;
  newEpisode: () => void;
};

export function EvictionNight({ state, handlers }: { state: RealityTvState; handlers: EvictionHandlers }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [secondsLeft, setSecondsLeft] = useState(VOTING_SECONDS);
  const [myVotes, setMyVotes] = useState(0);
  const [gmsSent, setGmsSent] = useState(0);
  const tickRef = useRef(0);

  const nominated = state.nominees.filter((n) => n.status === "nominated");
  const safe = state.nominees.filter((n) => n.status !== "nominated");
  const poolTotal = nominated.reduce((sum, n) => sum + n.currentVotes, 0) || 1;
  const fave = nominated.find((n) => n.id === state.selectedNomineeId) ?? nominated[0];
  const evicted = lowestNominee(state.nominees);
  const leader = [...nominated].sort((a, b) => b.currentVotes - a.currentVotes)[0];

  // Countdown + the nation's votes pouring in while lines are open.
  const crowdRef = useRef(handlers.crowd);
  const secondsRef = useRef(VOTING_SECONDS);
  useEffect(() => {
    crowdRef.current = handlers.crowd;
  });

  useEffect(() => {
    if (phase !== "open") return;
    const timer = window.setInterval(() => {
      tickRef.current += 1;
      crowdRef.current(crowdWave(tickRef.current));
      secondsRef.current = Math.max(0, secondsRef.current - TICK_MS / 1000);
      setSecondsLeft(secondsRef.current);
      if (secondsRef.current <= 0) setPhase("closed");
    }, TICK_MS);
    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "closed") return;
    const timer = window.setTimeout(() => setPhase("result"), SUSPENSE_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const openLines = () => {
    tickRef.current = 0;
    secondsRef.current = VOTING_SECONDS;
    setSecondsLeft(VOTING_SECONDS);
    setMyVotes(0);
    setGmsSent(0);
    setPhase("open");
  };

  const nextWeek = () => {
    handlers.newEpisode();
    setPhase("intro");
  };

  const canVote = phase === "open";
  const voteCost = (count: number) => state.costPerVote * count;
  const ticker =
    phase === "open"
      ? `TEXT ${fave.voteKeyword} TO ${state.shortcode} · ₱${state.costPerVote.toFixed(2)}/TEXT · LINES CLOSE IN ${secondsLeft}s · `
      : phase === "result"
        ? `${evicted?.nickname.toUpperCase()} HAS BEEN EVICTED · ${state.totalSimulatedVotes.toLocaleString("en-US")} TOTAL VOTES · `
        : "SINO ANG ISE-SAVE MO? · EVICTION NIGHT LIVE NGAYONG GABI · ";

  return (
    <section className={styles.night} aria-label="Eviction night broadcast">
      <ol className={styles.steps} aria-label="How eviction night works">
        <li data-active={phase === "intro"}>
          <b>1</b> Pick who to save
        </li>
        <li data-active={phase === "open"}>
          <b>2</b> Text &amp; GM before lines close
        </li>
        <li data-active={phase === "closed" || phase === "result"}>
          <b>3</b> Watch the reveal
        </li>
      </ol>

      <div className={styles.stage}>
        {/* ---------- The TV ---------- */}
        <div className={styles.tvCabinet}>
          <div className={styles.tvScreen} data-phase={phase}>
            <div className={styles.bug}>
              <span className={styles.liveDot} aria-hidden="true" /> LIVE · STAR QUEST PILIPINAS
            </div>
            <div className={styles.lowerThird}>
              <strong>HOUSEMATE ON THE LINE</strong>
              <span>WEEK 7 EVICTION NIGHT IS LIVE!</span>
            </div>

            {phase === "closed" ? (
              <div className={styles.suspense} role="status">
                <p>Voting lines are now closed.</p>
                <p className={styles.suspenseLine}>Ang housemate na lalabas ng bahay ay…</p>
                <span className={styles.drum} aria-hidden="true">
                  🥁
                </span>
              </div>
            ) : (
              <ul className={styles.nominees} aria-label="Nominated housemates">
                {nominated.map((nominee) => {
                  const share = Math.round((nominee.currentVotes / poolTotal) * 1000) / 10;
                  const isOut = phase === "result" && evicted?.id === nominee.id;
                  return (
                    <li key={nominee.id} data-out={isOut} data-fave={nominee.id === fave.id}>
                      <span className={styles.portrait}>
                        <NomineePortrait nominee={nominee} />
                        {isOut && <span className={styles.stamp}>EVICTED</span>}
                        {phase === "result" && !isOut && <span className={styles.stampSafe}>SAFE</span>}
                      </span>
                      <strong>{nominee.nickname}</strong>
                      {phase === "intro" ? (
                        <small>{nominee.hometown}</small>
                      ) : (
                        <>
                          <span className={styles.bar} aria-hidden="true">
                            <span style={{ width: `${share}%`, background: nominee.colorAccent }} />
                          </span>
                          <small data-testid={`share-${nominee.id}`}>{share.toFixed(1)}%</small>
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}

            {phase === "open" && (
              <p className={styles.countdown} aria-live="polite">
                Lines close in <b data-testid="countdown">0:{String(secondsLeft).padStart(2, "0")}</b>
              </p>
            )}
            {phase === "result" && evicted && (
              <p className={styles.verdict} role="status">
                {evicted.nickname}, you must now leave the house.{" "}
                {evicted.id === fave.id
                  ? "Your texts weren't enough this time."
                  : `Your ${myVotes.toLocaleString("en-US")} vote${myVotes === 1 ? "" : "s"} helped keep ${fave.nickname} inside!`}
              </p>
            )}

            <div className={styles.ticker} aria-hidden="true">
              <span>{ticker.repeat(3)}</span>
            </div>
          </div>
          <div className={styles.tvControls} aria-hidden="true">
            <i />
            <i />
            <span>CH 2</span>
          </div>
        </div>

        {/* ---------- The phone / voting desk ---------- */}
        <div className={styles.desk}>
          <fieldset className={styles.pick} disabled={phase === "closed" || phase === "result"}>
            <legend>Who will you save?</legend>
            {nominated.map((nominee) => (
              <label key={nominee.id} data-checked={nominee.id === fave.id} style={{ borderColor: nominee.id === fave.id ? nominee.colorAccent : undefined }}>
                <input
                  type="radio"
                  name="fave"
                  checked={nominee.id === fave.id}
                  onChange={() => handlers.select(nominee.id)}
                />
                <span aria-hidden="true">{nominee.avatarIcon}</span>
                <span>
                  <b>{nominee.name}</b>
                  <small>{nominee.tagline}</small>
                </span>
              </label>
            ))}
          </fieldset>

          <div className={styles.phone}>
            <div className={styles.lcd}>
              <span>To: {state.shortcode}</span>
              <strong>{fave.voteKeyword}</strong>
              <span>Load ₱{state.prepaidLoad.toFixed(2)}</span>
            </div>

            {phase === "intro" && (
              <button type="button" className={styles.goButton} onClick={openLines}>
                📺 Open the voting lines
              </button>
            )}

            {canVote && (
              <>
                <div className={styles.voteRow}>
                  {[1, 5].map((count) => (
                    <button
                      key={count}
                      type="button"
                      className={styles.voteButton}
                      disabled={state.prepaidLoad < voteCost(count)}
                      onClick={() => {
                        handlers.vote(fave.id, count);
                        setMyVotes((value) => value + count);
                      }}
                      aria-label={`Cast ${count} vote${count > 1 ? "s" : ""} for ${fave.name}`}
                    >
                      Send {count} text{count > 1 ? "s" : ""}
                      <small>+{count} vote{count > 1 ? "s" : ""} · ₱{voteCost(count).toFixed(2)}</small>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className={styles.gmButton}
                  disabled={gmsSent >= MAX_GMS || state.prepaidLoad < GM_COST}
                  onClick={() => {
                    handlers.gm(fave.id);
                    setGmsSent((value) => value + 1);
                    setMyVotes((value) => value + GM_BONUS_VOTES);
                  }}
                >
                  📣 GM your phonebook: “Vote {fave.nickname} ha!”
                  <small>
                    Textmates send ~{GM_BONUS_VOTES} votes · ₱{GM_COST.toFixed(2)} · {MAX_GMS - gmsSent} left
                  </small>
                </button>
                <button type="button" className={styles.linkButton} onClick={() => setPhase("closed")}>
                  Close the lines now
                </button>
              </>
            )}

            {phase === "result" && (
              <button type="button" className={styles.goButton} onClick={nextWeek}>
                ▶ Next week&apos;s eviction
              </button>
            )}

            <p className={styles.impact}>
              Your effect tonight: <b data-testid="my-votes">{myVotes.toLocaleString("en-US")}</b> votes
            </p>
            <button type="button" className={styles.reload} onClick={() => handlers.reload(30)}>
              + ₱30 Scratch Card
            </button>
          </div>

          {phase === "open" && leader && fave.id !== leader.id && evicted?.id === fave.id && (
            <p className={styles.hint}>
              ⚠ {fave.nickname} is in last place! One text is just 1 vote. Try a GM: fans who organized their
              textmates decided evictions.
            </p>
          )}
        </div>
      </div>

      <div className={styles.safeRow}>
        <span>Safe this week:</span>
        {safe.map((nominee) => (
          <span key={nominee.id} className={styles.safeChip}>
            {nominee.avatarIcon} {nominee.nickname} · {nominee.status === "immune" ? "immunity amulet" : "won the task"}
          </span>
        ))}
      </div>

      <p className={styles.notice}>
        <strong>Educational Simulation Notice:</strong> Shortcode {state.shortcode}, the simulated ₱
        {state.costPerVote.toFixed(2)} tariff per vote, housemate profiles, vote counts, and standings are fictional
        period-inspired simulation values.
      </p>
    </section>
  );
}
