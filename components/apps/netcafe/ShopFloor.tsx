"use client";

import { useState } from "react";
import type { NetCafeState, SnackItem, Terminal } from "@/lib/apps/netcafe/types";
import styles from "./floor.module.css";

/** Fictional walk-in customers who line up at the counter, in order. */
export const WALK_INS = [
  { name: "Jun-Jun", avatar: "🧢", tariffId: "tariff-1h", activityId: "act-dota", line: "Kuya, isang oras po. DotA kami!" },
  { name: "Ate Liza", avatar: "🎒", tariffId: "tariff-30m", activityId: "act-research", line: "30 minutes lang, magpi-print ng project." },
  { name: "Paolo", avatar: "🗡️", tariffId: "tariff-2h", activityId: "act-ragnarok", line: "Dalawang oras, mag-level up sa Ragnarok." },
  { name: "Mika", avatar: "💬", tariffId: "tariff-30m", activityId: "act-social", line: "Friendster lang po, saka YM." },
  { name: "Carlo", avatar: "💣", tariffId: "tariff-3h-promo", activityId: "act-cs", line: "Happy hour po! CS buong barkada." },
  { name: "Bea", avatar: "🎵", tariffId: "tariff-1h", activityId: "act-mp3", line: "Isang oras, magda-download ng kanta." },
] as const;

export type WalkIn = (typeof WALK_INS)[number];

export type FloorHandlers = {
  select: (terminalId: string) => void;
  start: (terminalId: string, name: string, tariffId: string, activityId: string) => void;
  extend: (terminalId: string, minutes: number, cost: number) => void;
  snack: (terminalId: string, snack: SnackItem) => void;
  print: (terminalId: string, documentName: string, pages: number, isColor: boolean) => void;
  end: (terminalId: string) => void;
  pause: (terminalId: string) => void;
  resume: (terminalId: string) => void;
  changeActivity: (terminalId: string, activityId: string) => void;
};

export function formatClock(seconds: number) {
  const safe = Math.max(0, seconds);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(secs).padStart(2, "0");
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

function billFor(state: NetCafeState, terminal: Terminal) {
  const session = terminal.session;
  if (!session) return { time: 0, snacks: 0, prints: 0, total: 0 };
  const snacks = session.snacks.reduce((sum, item) => sum + item.pricePesos, 0);
  const prints = state.printJobs
    .filter((job) => session.printJobIds.includes(job.id))
    .reduce((sum, job) => sum + job.costPesos, 0);
  return { time: session.sessionFeePesos, snacks, prints, total: session.sessionFeePesos + snacks + prints };
}

function shortName(terminal: Terminal) {
  return terminal.name.replace(/^PC \d+ - /, "");
}

/* ---------------------------------------------------------------- */

function Monitor({
  terminal,
  state,
  selected,
  seating,
  onClick,
}: {
  terminal: Terminal;
  state: NetCafeState;
  selected: boolean;
  seating: boolean;
  onClick: () => void;
}) {
  const session = terminal.session;
  const activity = session ? state.activities.find((item) => item.id === session.activityId) : undefined;
  const low = Boolean(session && terminal.status === "occupied" && session.remainingSeconds <= 300);
  const free = terminal.status === "available";
  const label = `PC ${String(terminal.number).padStart(2, "0")}`;

  let mode: "free" | "busy" | "low" | "expired" | "paused" = "free";
  if (terminal.status === "expired") mode = "expired";
  else if (terminal.status === "paused") mode = "paused";
  else if (low) mode = "low";
  else if (!free) mode = "busy";

  const status =
    mode === "free" ? "vacant" : mode === "expired" ? "time's up" : mode === "paused" ? "paused" : `${formatClock(session?.remainingSeconds ?? 0)} left`;

  return (
    <button
      type="button"
      className={styles.monitor}
      data-mode={mode}
      data-selected={selected}
      data-seatable={seating && free}
      onClick={onClick}
      aria-label={`${label} ${shortName(terminal)}: ${status}${session ? `, ${session.customerName}` : ""}`}
      aria-pressed={selected}
    >
      <span className={styles.bezel}>
        <span className={styles.screen}>
          {mode === "free" && (
            <>
              <span className={styles.screenBig}>VACANT</span>
              <span className={styles.screenSmall}>{seating ? "Click to seat here" : "Click to rent"}</span>
            </>
          )}
          {(mode === "busy" || mode === "low") && session && (
            <>
              <span className={styles.screenIcon} aria-hidden="true">
                {activity?.icon ?? "🖥️"}
              </span>
              <span className={styles.timer}>{formatClock(session.remainingSeconds)}</span>
              <span className={styles.screenSmall}>{session.customerName}</span>
            </>
          )}
          {mode === "paused" && session && (
            <>
              <span className={styles.screenBig}>PAUSED</span>
              <span className={styles.screenSmall}>{session.customerName}</span>
            </>
          )}
          {mode === "expired" && session && (
            <>
              <span className={styles.screenBig}>TIME&apos;S UP!</span>
              <span className={styles.screenSmall}>{session.customerName}</span>
            </>
          )}
        </span>
        <span className={styles.led} aria-hidden="true" />
      </span>
      <span className={styles.stand} aria-hidden="true" />
      <span className={styles.pcLabel}>
        <b>{label}</b> {shortName(terminal)}
      </span>
    </button>
  );
}

/* ---------------------------------------------------------------- */

function Counter({
  state,
  terminal,
  nextCustomer,
  seatingCustomer,
  onSeatCustomer,
  handlers,
}: {
  state: NetCafeState;
  terminal: Terminal;
  nextCustomer: WalkIn | undefined;
  seatingCustomer: WalkIn | null;
  onSeatCustomer: (customer: WalkIn, terminalId: string) => void;
  handlers: FloorHandlers;
}) {
  const [walkInName, setWalkInName] = useState("Player_1");
  const [tariffId, setTariffId] = useState(state.tariffs[1]?.id ?? state.tariffs[0].id);
  const [activityId, setActivityId] = useState(state.activities[0].id);
  const session = terminal.session;
  const label = `PC ${String(terminal.number).padStart(2, "0")}`;

  if (!session || terminal.status === "available") {
    const customer = seatingCustomer ?? nextCustomer;
    const customerTariff = customer ? state.tariffs.find((tariff) => tariff.id === customer.tariffId) : undefined;
    return (
      <section className={styles.counter} aria-label={`Counter: ${terminal.name}`}>
        <header className={styles.counterHead}>
          <h3>{terminal.name}</h3>
          <span className={styles.chipFree}>Vacant</span>
        </header>
        <p className={styles.specs}>
          {terminal.osName} · {terminal.specs}
        </p>

        {customer && customerTariff && (
          <div className={styles.seatBox}>
            <p>
              <span aria-hidden="true">{customer.avatar}</span> <b>{customer.name}</b> is waiting: “{customer.line}”
            </p>
            <button
              type="button"
              className={styles.bigButton}
              onClick={() => onSeatCustomer(customer, terminal.id)}
            >
              Seat {customer.name} on {label} · {customerTariff.minutes >= 60 ? `${customerTariff.minutes / 60} hr` : `${customerTariff.minutes} min`} · ₱{customerTariff.pricePesos}
            </button>
          </div>
        )}

        <details className={styles.walkIn} open={!customer}>
          <summary>Rent to someone else</summary>
          <form
            className={styles.walkInForm}
            onSubmit={(event) => {
              event.preventDefault();
              handlers.start(terminal.id, walkInName, tariffId, activityId);
            }}
          >
            <label htmlFor={`walkin-${terminal.id}`}>Customer name</label>
            <input
              id={`walkin-${terminal.id}`}
              value={walkInName}
              onChange={(event) => setWalkInName(event.target.value)}
            />
            <fieldset className={styles.rateRow}>
              <legend>How long?</legend>
              {state.tariffs.map((tariff) => (
                <label key={tariff.id} data-checked={tariffId === tariff.id}>
                  <input
                    type="radio"
                    name={`rate-${terminal.id}`}
                    checked={tariffId === tariff.id}
                    onChange={() => setTariffId(tariff.id)}
                  />
                  <span>{tariff.minutes >= 60 ? `${tariff.minutes / 60} hr` : `${tariff.minutes} min`}</span>
                  <b>₱{tariff.pricePesos}</b>
                </label>
              ))}
            </fieldset>
            <label htmlFor={`activity-${terminal.id}`}>Playing / doing</label>
            <select id={`activity-${terminal.id}`} value={activityId} onChange={(event) => setActivityId(event.target.value)}>
              {state.activities.map((activity) => (
                <option key={activity.id} value={activity.id}>
                  {activity.icon} {activity.name}
                </option>
              ))}
            </select>
            <button type="submit" className={styles.primaryButton}>
              Start time on {label}
            </button>
          </form>
        </details>
      </section>
    );
  }

  const bill = billFor(state, terminal);
  const expired = terminal.status === "expired";
  const paused = terminal.status === "paused";
  const low = !expired && session.remainingSeconds <= 300;

  return (
    <section className={styles.counter} aria-label={`Counter: ${terminal.name}`}>
      <header className={styles.counterHead}>
        <h3>{terminal.name}</h3>
        <span className={expired ? styles.chipExpired : paused ? styles.chipPaused : styles.chipBusy}>
          {expired ? "Time's up" : paused ? "Paused" : "In use"}
        </span>
      </header>

      <div className={styles.timerPanel} data-low={low} data-expired={expired}>
        <span>Time left</span>
        <strong data-testid="counter-timer">{formatClock(session.remainingSeconds)}</strong>
        <span>
          {session.customerName} · since {session.startTime}
        </span>
      </div>

      {expired && <p className={styles.alert}>⏰ Time&apos;s up! Add more time or log them out and collect.</p>}
      {low && <p className={styles.warn}>⚠ Less than 5 minutes left. Offer an extension!</p>}

      <label className={styles.inlineLabel} htmlFor={`playing-${terminal.id}`}>
        Playing
      </label>
      <select
        id={`playing-${terminal.id}`}
        value={session.activityId}
        onChange={(event) => handlers.changeActivity(terminal.id, event.target.value)}
      >
        {state.activities.map((activity) => (
          <option key={activity.id} value={activity.id}>
            {activity.icon} {activity.name}
          </option>
        ))}
      </select>

      <div className={styles.group}>
        <h4>Add time</h4>
        <div className={styles.buttonRow}>
          <button type="button" className={styles.timeButton} onClick={() => handlers.extend(terminal.id, 30, 15)}>
            +30 min · ₱15
          </button>
          <button type="button" className={styles.timeButton} onClick={() => handlers.extend(terminal.id, 60, 20)}>
            +1 hour · ₱20
          </button>
        </div>
      </div>

      <div className={styles.group}>
        <h4>Canteen</h4>
        <div className={styles.snackRow}>
          {state.snacks.map((snack) => (
            <button
              key={snack.id}
              type="button"
              className={styles.snackButton}
              onClick={() => handlers.snack(terminal.id, snack)}
              aria-label={`Sell ${snack.name} for ₱${snack.pricePesos}`}
              title={snack.name}
            >
              <span aria-hidden="true">{snack.icon}</span>
              <small>₱{snack.pricePesos}</small>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <h4>Printer</h4>
        <button
          type="button"
          className={styles.timeButton}
          onClick={() => handlers.print(terminal.id, "Science_Project_Final.doc", 5, false)}
        >
          🖨 Print school project (5 pages B&amp;W · ₱10)
        </button>
      </div>

      <div className={styles.receipt} aria-label="Bill so far">
        <div>
          <span>Time</span>
          <span>₱{bill.time.toFixed(2)}</span>
        </div>
        <div>
          <span>Snacks ({session.snacks.length})</span>
          <span>₱{bill.snacks.toFixed(2)}</span>
        </div>
        <div>
          <span>Prints</span>
          <span>₱{bill.prints.toFixed(2)}</span>
        </div>
        <div className={styles.receiptTotal}>
          <span>Bill so far</span>
          <span>₱{bill.total.toFixed(2)}</span>
        </div>
      </div>

      <div className={styles.buttonRow}>
        {!expired &&
          (paused ? (
            <button type="button" className={styles.ghostButton} onClick={() => handlers.resume(terminal.id)}>
              ▶ Resume time
            </button>
          ) : (
            <button type="button" className={styles.ghostButton} onClick={() => handlers.pause(terminal.id)}>
              ⏸ Pause (bio break)
            </button>
          ))}
        <button type="button" className={styles.bigButton} onClick={() => handlers.end(terminal.id)}>
          Log out &amp; collect ₱{bill.total.toFixed(2)}
        </button>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */

export function ShopFloor({
  state,
  handlers,
  queueIndex,
  onCustomerSeated,
}: {
  state: NetCafeState;
  handlers: FloorHandlers;
  queueIndex: number;
  onCustomerSeated: () => void;
}) {
  const [seating, setSeating] = useState(false);
  const queue = [0, 1].map((offset) => WALK_INS[(queueIndex + offset) % WALK_INS.length]);
  const selected = state.terminals.find((terminal) => terminal.id === state.selectedTerminalId) ?? state.terminals[0];
  const vacant = state.terminals.filter((terminal) => terminal.status === "available").length;
  const stats = state.stats;

  const seat = (customer: WalkIn, terminalId: string) => {
    handlers.start(terminalId, customer.name, customer.tariffId, customer.activityId);
    setSeating(false);
    onCustomerSeated();
  };

  const firstBusy = state.terminals.find((terminal) => terminal.session && terminal.status !== "available");
  const lowest = [...state.terminals]
    .filter((terminal) => terminal.session && terminal.status !== "available")
    .sort((a, b) => (a.session?.remainingSeconds ?? 0) - (b.session?.remainingSeconds ?? 0))[0];

  const missions = [
    {
      id: "seat",
      label: "Seat a customer from the line",
      done: stats.seated > 0,
      go: () => setSeating(true),
    },
    { id: "snack", label: "Sell a snack (Pancit Canton!)", done: stats.snacksSold > 0, go: () => firstBusy && handlers.select(firstBusy.id) },
    { id: "extend", label: "Add time for someone running low", done: stats.extensions > 0, go: () => lowest && handlers.select(lowest.id) },
    { id: "print", label: "Print a school project", done: stats.prints > 0, go: () => firstBusy && handlers.select(firstBusy.id) },
    { id: "checkout", label: "Log someone out and collect", done: stats.checkouts > 0, go: () => lowest && handlers.select(lowest.id) },
  ];
  const doneCount = missions.filter((mission) => mission.done).length;

  return (
    <div className={styles.floorLayout}>
      <div className={styles.floorMain}>
        <section className={styles.queue} aria-labelledby="netcafe-queue-title">
          <h3 id="netcafe-queue-title">Waiting at the counter</h3>
          <ol>
            {queue.map((customer, index) => (
              <li key={`${customer.name}-${queueIndex + index}`} data-next={index === 0}>
                <span className={styles.avatar} aria-hidden="true">
                  {customer.avatar}
                </span>
                <span className={styles.queueText}>
                  <b>{customer.name}</b>
                  <small>“{customer.line}”</small>
                </span>
                {index === 0 && (
                  <button
                    type="button"
                    className={styles.primaryButton}
                    aria-pressed={seating}
                    disabled={vacant === 0}
                    onClick={() => setSeating((value) => !value)}
                  >
                    {vacant === 0 ? "Full house!" : seating ? "Pick a glowing PC…" : `Seat ${customer.name}`}
                  </button>
                )}
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.floor} aria-label="Computer shop floor map">
          <div className={styles.floorGrid}>
            {state.terminals.map((terminal) => (
              <Monitor
                key={terminal.id}
                terminal={terminal}
                state={state}
                selected={terminal.id === selected.id}
                seating={seating}
                onClick={() => {
                  if (seating && terminal.status === "available") seat(queue[0], terminal.id);
                  else handlers.select(terminal.id);
                }}
              />
            ))}
          </div>
          <p className={styles.legend}>
            <span data-mode="free">Vacant</span>
            <span data-mode="busy">In use</span>
            <span data-mode="low">Under 5 min</span>
            <span data-mode="expired">Time&apos;s up</span>
          </p>
        </section>
      </div>

      <div className={styles.side}>
        <Counter
          key={selected.id}
          state={state}
          terminal={selected}
          nextCustomer={queue[0]}
          seatingCustomer={seating ? queue[0] : null}
          onSeatCustomer={seat}
          handlers={handlers}
        />

        <section className={styles.missions} aria-labelledby="netcafe-missions">
          <div className={styles.missionHead}>
            <h3 id="netcafe-missions">Ikaw ang bantay! Missions</h3>
            <span>
              {doneCount} of {missions.length} done
            </span>
          </div>
          <ul>
            {missions.map((mission) => (
              <li key={mission.id} data-done={mission.done}>
                <span className={styles.check} aria-hidden="true">
                  {mission.done ? "✓" : ""}
                </span>
                <span>{mission.label}</span>
                {mission.done ? (
                  <span className={styles.done}>Done!</span>
                ) : (
                  <button type="button" onClick={mission.go} aria-label={`Show me: ${mission.label}`}>
                    Show me
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
