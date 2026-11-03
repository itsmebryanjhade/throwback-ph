"use client";

import React, { useEffect, useRef } from "react";
import { useToast } from "@/lib/notification-system/NotificationContext";
import { useWindowManager } from "@/lib/window-system/WindowContext";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import { netCafeReducer, INITIAL_NETCAFE_STATE } from "@/lib/apps/netcafe/reducer";
import type { SnackItem } from "@/lib/apps/netcafe/types";
import { TerminalList } from "./TerminalList";
import { ActiveSessionPanel } from "./ActiveSessionPanel";
import { PrintServicesPanel } from "./PrintServicesPanel";
import { SessionHistoryPanel } from "./SessionHistoryPanel";
import { NetCafeMuseumInfo } from "./NetCafeMuseumInfo";
import { ArtifactIcon } from "@/components/shared/ArtifactIcon";
import styles from "./netcafe.module.css";
import { matchesStateShape, usePersistentReducer } from "@/lib/persistence/usePersistentReducer";

export function NetCafeApp() {
  const [state, dispatch] = usePersistentReducer(netCafeReducer, INITIAL_NETCAFE_STATE, {
    key: "throwback-ph:app:net-cafe", version: 1, validate: matchesStateShape(INITIAL_NETCAFE_STATE),
  });
  const windowManager = useWindowManager();
  const toast = useToast();

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

  const occupiedCount = state.terminals.filter(
    (t) => t.status === "occupied" || t.status === "expired" || t.status === "paused",
  ).length;

  const win = windowManager.state.windows["net-cafe"];
  const bounds = win?.bounds || { x: 170, y: 60, width: 760, height: 540 };
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
        {/* Cashier Till & Header Bar */}
        <header className={styles.cafeHeader}>
          <div className={styles.brandArea}>
            <ArtifactIcon
              src="/museum/phase-9/images/net-cafe-interior.jpg"
              alt="Reconstructed Philippine computer shop interior"
              fallback="Image unavailable"
              size={128}
              className={styles.cafePhoto}
            />
            <div>
              <span className={styles.cafeTitle}>Net Café Manager v3.2</span>
              <h2 className={styles.cashierHeading}>Counter 01 · Session Cashier</h2>
              <span className={styles.cafeSub}>Barangay internet café floor and receipt ledger</span>
            </div>
          </div>

          <div className={styles.tillBadgeArea}>
            <div className={styles.tillBadge}>
              <span>Active Terminals:</span>
              <span style={{ color: "#38bdf8", fontWeight: "700" }}>
                {occupiedCount} / {state.terminals.length} PCs
              </span>
            </div>

            <div className={styles.tillBadge}>
              <span>Cash Register:</span>
              <span className={styles.cashAmount}>
                ₱{state.cashierRegister.cashOnHand.toFixed(2)}
              </span>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav
          className={styles.navTabs}
          role="tablist"
          aria-label="Net Café Manager application modules"
        >
          <button
            type="button"
            role="tab"
            aria-selected={state.activeView === "terminals"}
            className={`${styles.navTab} ${
              state.activeView === "terminals" ? styles.navTabActive : ""
            }`}
            onClick={() => dispatch({ type: "SET_VIEW", view: "terminals" })}
          >
            🖥 Terminals
            <span className={styles.tabBadge}>{state.terminals.length}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={state.activeView === "active-session"}
            className={`${styles.navTab} ${
              state.activeView === "active-session" ? styles.navTabActive : ""
            }`}
            onClick={() => dispatch({ type: "SET_VIEW", view: "active-session" })}
          >
            ⏱ Session Desk
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={state.activeView === "print-services"}
            className={`${styles.navTab} ${
              state.activeView === "print-services" ? styles.navTabActive : ""
            }`}
            onClick={() => dispatch({ type: "SET_VIEW", view: "print-services" })}
          >
            🖨 Print & Services
            {state.printJobs.length > 0 && (
              <span className={styles.tabBadge}>{state.printJobs.length}</span>
            )}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={state.activeView === "history"}
            className={`${styles.navTab} ${
              state.activeView === "history" ? styles.navTabActive : ""
            }`}
            onClick={() => dispatch({ type: "SET_VIEW", view: "history" })}
          >
            📜 Billing History
            <span className={styles.tabBadge}>{state.completedSessions.length}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={state.activeView === "museum-info"}
            className={`${styles.navTab} ${
              state.activeView === "museum-info" ? styles.navTabActive : ""
            }`}
            onClick={() => dispatch({ type: "SET_VIEW", view: "museum-info" })}
          >
            🏛 Museum Info
          </button>
        </nav>

        {/* Single Scrollable Main Area */}
        <div className={styles.scrollArea}>
          {state.activeView === "terminals" && (
            <TerminalList
              terminals={state.terminals}
              activities={state.activities}
              selectedTerminalId={state.selectedTerminalId}
              isTimerRunning={state.isTimerRunning}
              onSelectTerminal={(terminalId) =>
                dispatch({ type: "SELECT_TERMINAL", terminalId })
              }
              onOpenSession={(terminalId) => {
                dispatch({ type: "SELECT_TERMINAL", terminalId });
                dispatch({ type: "SET_VIEW", view: "active-session" });
              }}
              onSimulateTimePass={(minutes) =>
                dispatch({ type: "SIMULATE_TIME_PASS", minutes })
              }
              onToggleTimer={(isRunning) =>
                dispatch({ type: "SET_TIMER_RUNNING", isRunning })
              }
            />
          )}

          {state.activeView === "active-session" && (
            <ActiveSessionPanel
              terminals={state.terminals}
              selectedTerminalId={state.selectedTerminalId}
              tariffs={state.tariffs}
              activities={state.activities}
              snacks={state.snacks}
              printJobs={state.printJobs}
              onSelectTerminal={(terminalId) =>
                dispatch({ type: "SELECT_TERMINAL", terminalId })
              }
              onStartSession={handleStartSession}
              onExtendSession={handleExtendSession}
              onChangeActivity={(terminalId, activityId) =>
                dispatch({ type: "CHANGE_ACTIVITY", terminalId, activityId })
              }
              onOrderSnack={handleOrderSnack}
              onPauseSession={(terminalId) =>
                dispatch({ type: "PAUSE_SESSION", terminalId })
              }
              onResumeSession={(terminalId) =>
                dispatch({ type: "RESUME_SESSION", terminalId })
              }
              onEndSession={handleEndSession}
              onDismissWarning={(terminalId) =>
                dispatch({ type: "DISMISS_WARNING", terminalId })
              }
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
