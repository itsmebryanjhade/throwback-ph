"use client";

import React, { useEffect, useRef, useState } from "react";
import { useToast } from "@/lib/notification-system/NotificationContext";
import { useWindowManager } from "@/lib/window-system/WindowContext";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import { netCafeReducer, INITIAL_NETCAFE_STATE } from "@/lib/apps/netcafe/reducer";
import type { SnackItem } from "@/lib/apps/netcafe/types";
import { ShopFloor, type FloorHandlers } from "./ShopFloor";
import { PrintServicesPanel } from "./PrintServicesPanel";
import { SessionHistoryPanel } from "./SessionHistoryPanel";
import { NetCafeMuseumInfo } from "./NetCafeMuseumInfo";
import styles from "./netcafe.module.css";
import floor from "./floor.module.css";
import { matchesStateShape, usePersistentReducer } from "@/lib/persistence/usePersistentReducer";

export function NetCafeApp() {
  const [state, dispatch] = usePersistentReducer(netCafeReducer, INITIAL_NETCAFE_STATE, {
    key: "throwback-ph:app:net-cafe", version: 2, validate: matchesStateShape(INITIAL_NETCAFE_STATE),
  });
  const windowManager = useWindowManager();
  const toast = useToast();

  const [queueIndex, setQueueIndex] = useState(0);
  const warnedTerminalsRef = useRef<Set<string>>(new Set());
  const expiredTerminalsRef = useRef<Set<string>>(new Set());

  // Deterministic 1s background timer
  useEffect(() => {
    if (!state.isTimerRunning) return;
    const interval = setInterval(() => {
      dispatch({ type: "TICK_TIME", seconds: 1 });
    }, 1000);
    return () => clearInterval(interval);
  }, [state.isTimerRunning, dispatch]);

  // Watch for low-time and expiration thresholds to emit OS notifications
  useEffect(() => {
    state.terminals.forEach((term) => {
      if (term.session && !term.session.isPaused) {
        const remaining = term.session.remainingSeconds;

        // Low-time warning (< 300s and > 0)
        if (remaining <= 300 && remaining > 0) {
          if (!warnedTerminalsRef.current.has(term.id)) {
            warnedTerminalsRef.current.add(term.id);
            toast.notify.warning(
              "Low-Time Warning",
              `${term.name} has less than 5 minutes remaining! (${term.session.customerName})`,
              { appId: "net-cafe", appName: "Net Café Manager" },
            );
          }
        }

        // Expiration notice (== 0)
        if (remaining === 0) {
          if (!expiredTerminalsRef.current.has(term.id)) {
            expiredTerminalsRef.current.add(term.id);
            toast.notify.error(
              "Session Expired",
              `${term.name} prepaid time ran out. Terminal is now locked.`,
              { appId: "net-cafe", appName: "Net Café Manager" },
            );
          }
        }
      }
    });
  }, [state.terminals, toast]);

  // Action handlers with meaningful OS Toast notifications
  const handleStartSession = (
    terminalId: string,
    customerName: string,
    tariffId: string,
    activityId: string,
  ) => {
    const tariff = state.tariffs.find((t) => t.id === tariffId) || state.tariffs[0];
    const term = state.terminals.find((t) => t.id === terminalId);

    dispatch({
      type: "START_SESSION",
      terminalId,
      customerName,
      tariffId,
      activityId,
    });

    warnedTerminalsRef.current.delete(terminalId);
    expiredTerminalsRef.current.delete(terminalId);

    toast.notify.success(
      "Session Started",
      `${term?.name || terminalId} rented to ${customerName} for ${tariff.minutes} mins (₱${tariff.pricePesos.toFixed(2)})`,
      { appId: "net-cafe", appName: "Net Café Manager" },
    );
  };

  const handleExtendSession = (
    terminalId: string,
    additionalMinutes: number,
    costPesos: number,
  ) => {
    const term = state.terminals.find((t) => t.id === terminalId);

    dispatch({
      type: "EXTEND_SESSION",
      terminalId,
      additionalMinutes,
      costPesos,
    });

    warnedTerminalsRef.current.delete(terminalId);
    expiredTerminalsRef.current.delete(terminalId);

    toast.notify.info(
      "Time Extended",
      `Added ${additionalMinutes} mins to ${term?.name || terminalId} (+₱${costPesos.toFixed(2)})`,
      { appId: "net-cafe", appName: "Net Café Manager" },
    );
  };

  const handleOrderSnack = (terminalId: string, snack: SnackItem) => {
    const term = state.terminals.find((t) => t.id === terminalId);
    dispatch({ type: "ORDER_SNACK", terminalId, snack });

    toast.notify.info(
      "Canteen Order Added",
      `${snack.name} delivered to ${term?.name || terminalId} (+₱${snack.pricePesos.toFixed(2)})`,
      { appId: "net-cafe", appName: "Net Café Manager" },
    );
  };

  const handleQueuePrint = (
    terminalId: string,
    documentName: string,
    pageCount: number,
    isColor: boolean,
  ) => {
    const cost = pageCount * (isColor ? 5 : 2);
    dispatch({
      type: "QUEUE_PRINT_JOB",
      terminalId,
      documentName,
      pageCount,
      isColor,
    });

    toast.notify.info(
      "Print Job Sent",
      `${documentName} (${pageCount} pgs) sent to network printer for ₱${cost.toFixed(2)}`,
      { appId: "net-cafe", appName: "Net Café Manager" },
    );
  };

  const handleEndSession = (terminalId: string) => {
    const term = state.terminals.find((t) => t.id === terminalId);
    const session = term?.session;
    if (!session) return;

    const terminalPrints = state.printJobs.filter((pj) =>
      session.printJobIds.includes(pj.id),
    );
    const printCost = terminalPrints.reduce((sum, pj) => sum + pj.costPesos, 0);
    const snackCost = session.snacks.reduce((a, b) => a + b.pricePesos, 0);
    const totalPaid = session.sessionFeePesos + snackCost + printCost;

    dispatch({ type: "END_SESSION", terminalId });

    warnedTerminalsRef.current.delete(terminalId);
    expiredTerminalsRef.current.delete(terminalId);

    toast.notify.success(
      "Session Checked Out",
      `${term?.name || terminalId} session concluded. Total bill collected: ₱${totalPaid.toFixed(2)}`,
      { appId: "net-cafe", appName: "Net Café Manager" },
    );
  };

  const floorHandlers: FloorHandlers = {
    select: (terminalId) => dispatch({ type: "SELECT_TERMINAL", terminalId }),
    start: handleStartSession,
    extend: handleExtendSession,
    snack: handleOrderSnack,
    print: handleQueuePrint,
    end: handleEndSession,
    pause: (terminalId) => dispatch({ type: "PAUSE_SESSION", terminalId }),
    resume: (terminalId) => dispatch({ type: "RESUME_SESSION", terminalId }),
    changeActivity: (terminalId, activityId) => dispatch({ type: "CHANGE_ACTIVITY", terminalId, activityId }),
  };

  const occupiedCount = state.terminals.filter(
    (t) => t.status === "occupied" || t.status === "expired" || t.status === "paused",
  ).length;

  const win = windowManager.state.windows["net-cafe"];
  const bounds = win?.bounds || { x: 90, y: 20, width: 1040, height: 690 };
  const zIndex = win?.zIndex || 1;
  const isActive = windowManager.state.activeWindowId === "net-cafe";
  const isMinimized = !!win?.isMinimized;
  const isMaximized = !!win?.isMaximized;

  return (
    <WindowFrame
      id="net-cafe"
      title="Net Café Manager"
      icon="🖥️"
      bounds={bounds}
      zIndex={zIndex}
      isActive={isActive}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      minSize={{ width: 500, height: 380 }}
      desktopArea={windowManager.state.desktopArea}
      onFocus={() => windowManager.focusWindow("net-cafe")}
      onMove={(pos) => windowManager.moveWindow("net-cafe", pos)}
      onResize={(newBounds) => windowManager.resizeWindow("net-cafe", newBounds)}
      onMinimize={() => windowManager.minimizeWindow("net-cafe")}
      onMaximize={() => windowManager.maximizeWindow("net-cafe")}
      onRestore={() => windowManager.restoreWindow("net-cafe")}
      onToggleMaximize={() => windowManager.toggleMaximize("net-cafe")}
      onClose={() => windowManager.closeWindow("net-cafe")}
      closeLabel="Close Net Café Manager"
    >
      <div className={styles.netcafeContainer} data-testid="app-shell-net-cafe">
        <header className={floor.shopHeader}>
          <div className={floor.sign}>
            <span className={floor.neon}>KANTO CYBER CAFÉ</span>
            <span className={floor.signSub}>Net Café Manager v3.2 · Ikaw ang bantay ngayon!</span>
          </div>
          <div className={floor.priceBoard} aria-label="Price board">
            <b>RATES</b>
            <span>30 min ₱15</span>
            <span>1 hr ₱20</span>
            <span>Print ₱2/pg</span>
          </div>
          <div className={floor.drawer}>
            <span>Cash drawer</span>
            <strong data-testid="cash-drawer">₱{state.cashierRegister.cashOnHand.toFixed(2)}</strong>
            <span>
              {occupiedCount}/{state.terminals.length} PCs in use
            </span>
          </div>
          <div className={floor.clockBox}>
            <span>Shop clock {state.isTimerRunning ? "▶ running" : "⏸ paused"}</span>
            <div>
              <button
                type="button"
                onClick={() => dispatch({ type: "SET_TIMER_RUNNING", isRunning: !state.isTimerRunning })}
              >
                {state.isTimerRunning ? "⏸ Pause clock" : "▶ Start clock"}
              </button>
              <button
                type="button"
                onClick={() => dispatch({ type: "SIMULATE_TIME_PASS", minutes: 15 })}
                aria-label="Skip ahead 15 minutes"
              >
                ⏩ +15 min
              </button>
            </div>
          </div>
        </header>

        <nav className={styles.navTabs} role="tablist" aria-label="Net Café Manager sections">
          {(
            [
              { view: "terminals", label: "🖥 Shop Floor" },
              { view: "print-services", label: "🖨 Printer", badge: state.printJobs.filter((job) => job.status !== "completed").length || undefined },
              { view: "history", label: "📒 Ledger", badge: state.completedSessions.length },
              { view: "museum-info", label: "🏛 Museum Info" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.view}
              type="button"
              role="tab"
              aria-selected={state.activeView === tab.view || (tab.view === "terminals" && state.activeView === "active-session")}
              className={`${styles.navTab} ${
                state.activeView === tab.view || (tab.view === "terminals" && state.activeView === "active-session") ? styles.navTabActive : ""
              }`}
              onClick={() => dispatch({ type: "SET_VIEW", view: tab.view })}
            >
              {tab.label}
              {"badge" in tab && tab.badge ? <span className={styles.tabBadge}>{tab.badge}</span> : null}
            </button>
          ))}
        </nav>

        <div className={styles.scrollArea}>
          {(state.activeView === "terminals" || state.activeView === "active-session") && (
            <ShopFloor
              state={state}
              handlers={floorHandlers}
              queueIndex={queueIndex}
              onCustomerSeated={() => setQueueIndex((value) => value + 1)}
            />
          )}

          {state.activeView === "print-services" && (
            <PrintServicesPanel
              terminals={state.terminals}
              printJobs={state.printJobs}
              totalPrintRevenue={state.cashierRegister.totalPrintRevenue}
              onQueuePrint={handleQueuePrint}
              onProcessPrintJob={(jobId) =>
                dispatch({ type: "PROCESS_PRINT_JOB", jobId })
              }
              onClearCompleted={() =>
                dispatch({ type: "CLEAR_COMPLETED_PRINTS" })
              }
            />
          )}

          {state.activeView === "history" && (
            <SessionHistoryPanel
              completedSessions={state.completedSessions}
              cashierRegister={state.cashierRegister}
            />
          )}

          {state.activeView === "museum-info" && <NetCafeMuseumInfo />}
        </div>
      </div>
    </WindowFrame>
  );
}
