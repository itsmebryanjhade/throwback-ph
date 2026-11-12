import type {
  ActiveSession,
  CompletedSession,
  NetCafeAction,
  NetCafeState,
  PrintJob,
} from "./types";
import { INITIAL_NETCAFE_STATE } from "./data";

const STAT_FOR_ACTION: Partial<Record<NetCafeAction["type"], keyof NetCafeState["stats"]>> = {
  START_SESSION: "seated",
  ORDER_SNACK: "snacksSold",
  EXTEND_SESSION: "extensions",
  QUEUE_PRINT_JOB: "prints",
  END_SESSION: "checkouts",
};

/** Applies an action, then counts it toward the Missions checklist if it changed anything. */
export function netCafeReducer(state: NetCafeState, action: NetCafeAction): NetCafeState {
  const next = applyAction(state, action);
  const stat = STAT_FOR_ACTION[action.type];
  if (!stat || next === state) return next;
  const stats = next.stats ?? INITIAL_NETCAFE_STATE.stats;
  return { ...next, stats: { ...stats, [stat]: stats[stat] + 1 } };
}

function applyAction(
  state: NetCafeState,
  action: NetCafeAction,
): NetCafeState {
  switch (action.type) {
    case "SET_VIEW": {
      return {
        ...state,
        activeView: action.view,
      };
    }

    case "SELECT_TERMINAL": {
      return {
        ...state,
        selectedTerminalId: action.terminalId,
      };
    }

    case "START_SESSION": {
      const tariff = state.tariffs.find((t) => t.id === action.tariffId) || state.tariffs[0];
      const customerName = action.customerName.trim() || "Visitor_Gamer";

      const newSession: ActiveSession = {
        terminalId: action.terminalId,
        customerName,
        tariffId: tariff.id,
        activityId: action.activityId || state.activities[0].id,
        initialMinutes: tariff.minutes,
        extendedMinutes: 0,
        remainingSeconds: tariff.minutes * 60,
        sessionFeePesos: tariff.pricePesos,
        snacks: [],
        printJobIds: [],
        startTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        lowTimeWarned: false,
        isPaused: false,
      };

      const updatedTerminals = state.terminals.map((term) => {
        if (term.id === action.terminalId) {
          return {
            ...term,
            status: "occupied" as const,
            session: newSession,
          };
        }
        return term;
      });

      return {
        ...state,
        terminals: updatedTerminals,
        selectedTerminalId: action.terminalId,
        cashierRegister: {
          ...state.cashierRegister,
          cashOnHand: state.cashierRegister.cashOnHand + tariff.pricePesos,
          totalSessionRevenue: state.cashierRegister.totalSessionRevenue + tariff.pricePesos,
        },
      };
    }

    case "EXTEND_SESSION": {
      const updatedTerminals = state.terminals.map((term) => {
        if (term.id === action.terminalId && term.session) {
          const addedSec = action.additionalMinutes * 60;
          const newRemaining = term.session.remainingSeconds + addedSec;
          return {
            ...term,
            status: "occupied" as const,
            session: {
              ...term.session,
              extendedMinutes: term.session.extendedMinutes + action.additionalMinutes,
              remainingSeconds: newRemaining,
              sessionFeePesos: term.session.sessionFeePesos + action.costPesos,
              lowTimeWarned: newRemaining <= 300 ? term.session.lowTimeWarned : false,
            },
          };
        }
        return term;
      });

      return {
        ...state,
        terminals: updatedTerminals,
        cashierRegister: {
          ...state.cashierRegister,
          cashOnHand: state.cashierRegister.cashOnHand + action.costPesos,
          totalSessionRevenue: state.cashierRegister.totalSessionRevenue + action.costPesos,
        },
      };
    }

    case "CHANGE_ACTIVITY": {
      const updatedTerminals = state.terminals.map((term) => {
        if (term.id === action.terminalId && term.session) {
          return {
            ...term,
            session: {
              ...term.session,
              activityId: action.activityId,
            },
          };
        }
        return term;
      });

      return {
        ...state,
        terminals: updatedTerminals,
      };
    }

    case "ORDER_SNACK": {
      const updatedTerminals = state.terminals.map((term) => {
        if (term.id === action.terminalId && term.session) {
          return {
            ...term,
            session: {
              ...term.session,
              snacks: [
                ...term.session.snacks,
                { name: action.snack.name, pricePesos: action.snack.pricePesos },
              ],
            },
          };
        }
        return term;
      });

      return {
        ...state,
        terminals: updatedTerminals,
        cashierRegister: {
          ...state.cashierRegister,
          cashOnHand: state.cashierRegister.cashOnHand + action.snack.pricePesos,
          totalSnackRevenue: state.cashierRegister.totalSnackRevenue + action.snack.pricePesos,
        },
      };
    }

    case "PAUSE_SESSION": {
      const updatedTerminals = state.terminals.map((term) => {
        if (term.id === action.terminalId && term.session) {
          return {
            ...term,
            status: "paused" as const,
            session: {
              ...term.session,
              isPaused: true,
            },
          };
        }
        return term;
      });

      return {
        ...state,
        terminals: updatedTerminals,
      };
    }

    case "RESUME_SESSION": {
      const updatedTerminals = state.terminals.map((term) => {
        if (term.id === action.terminalId && term.session) {
          return {
            ...term,
            status: "occupied" as const,
            session: {
              ...term.session,
              isPaused: false,
            },
          };
        }
        return term;
      });

      return {
        ...state,
        terminals: updatedTerminals,
      };
    }

    case "END_SESSION": {
      const term = state.terminals.find((t) => t.id === action.terminalId);
      if (!term || !term.session) return state;

      const session = term.session;
      const activity = state.activities.find((a) => a.id === session.activityId);

      const terminalPrints = state.printJobs.filter((pj) =>
        session.printJobIds.includes(pj.id),
      );
      const printCost = terminalPrints.reduce((sum, pj) => sum + pj.costPesos, 0);
      const snackCost = session.snacks.reduce((sum, s) => sum + s.pricePesos, 0);
      const totalBill = session.sessionFeePesos + snackCost + printCost;

      const completedRecord: CompletedSession = {
        id: `sess-comp-${Date.now()}-${term.id}`,
        terminalId: term.id,
        terminalName: term.name,
        customerName: session.customerName,
        durationMinutes: session.initialMinutes + session.extendedMinutes,
        activityName: activity?.name || "General Browsing",
        sessionCostPesos: session.sessionFeePesos,
        snackCostPesos: snackCost,
        printCostPesos: printCost,
        totalBillPesos: totalBill,
        completedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const updatedTerminals = state.terminals.map((t) => {
        if (t.id === action.terminalId) {
          return {
            ...t,
            status: "available" as const,
            session: undefined,
          };
        }
        return t;
      });

      return {
        ...state,
        terminals: updatedTerminals,
        completedSessions: [completedRecord, ...state.completedSessions],
      };
    }

    case "DISMISS_WARNING": {
      const updatedTerminals = state.terminals.map((term) => {
        if (term.id === action.terminalId && term.session) {
          return {
            ...term,
            session: {
              ...term.session,
              lowTimeWarned: true,
            },
          };
        }
        return term;
      });

      return {
        ...state,
        terminals: updatedTerminals,
      };
    }

    case "TICK_TIME": {
      const seconds = action.seconds;
      let hasChanges = false;

      const updatedTerminals = state.terminals.map((term) => {
        if (term.session && !term.session.isPaused && (term.status === "occupied" || term.status === "expired")) {
          const newRemaining = Math.max(0, term.session.remainingSeconds - seconds);
          const isExpired = newRemaining === 0;
          const isLowTime = newRemaining > 0 && newRemaining <= 300;

          if (
            newRemaining !== term.session.remainingSeconds ||
            (isExpired && term.status !== "expired")
          ) {
            hasChanges = true;
            return {
              ...term,
              status: isExpired ? ("expired" as const) : term.status,
              session: {
                ...term.session,
                remainingSeconds: newRemaining,
                lowTimeWarned: isLowTime ? true : term.session.lowTimeWarned,
              },
            };
          }
        }
        return term;
      });

      if (!hasChanges) return state;

      return {
        ...state,
        terminals: updatedTerminals,
      };
    }

    case "SIMULATE_TIME_PASS": {
      const seconds = action.minutes * 60;
      return netCafeReducer(state, { type: "TICK_TIME", seconds });
    }

    case "SET_TIMER_RUNNING": {
      return {
        ...state,
        isTimerRunning: action.isRunning,
      };
    }

    case "QUEUE_PRINT_JOB": {
      const costPerPg = action.isColor ? 5 : 2;
      const totalCost = action.pageCount * costPerPg;

      const newJob: PrintJob = {
        id: `print-${Date.now()}`,
        terminalId: action.terminalId,
        documentName: action.documentName.trim() || "Untitled_Document.doc",
        pageCount: action.pageCount,
        isColor: action.isColor,
        costPesos: totalCost,
        status: "printing",
        createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const updatedTerminals = state.terminals.map((term) => {
        if (term.id === action.terminalId && term.session) {
          return {
            ...term,
            session: {
              ...term.session,
              printJobIds: [...term.session.printJobIds, newJob.id],
            },
          };
        }
        return term;
      });

      return {
        ...state,
        terminals: updatedTerminals,
        printJobs: [newJob, ...state.printJobs],
        cashierRegister: {
          ...state.cashierRegister,
          cashOnHand: state.cashierRegister.cashOnHand + totalCost,
          totalPrintRevenue: state.cashierRegister.totalPrintRevenue + totalCost,
        },
      };
    }

    case "PROCESS_PRINT_JOB": {
      const updatedJobs = state.printJobs.map((pj) => {
        if (pj.id === action.jobId) {
          return { ...pj, status: "completed" as const };
        }
        return pj;
      });

      return {
        ...state,
        printJobs: updatedJobs,
      };
    }

    case "CLEAR_COMPLETED_PRINTS": {
      return {
        ...state,
        printJobs: state.printJobs.filter((pj) => pj.status !== "completed"),
      };
    }

    case "RESET_TERMINAL": {
      const updatedTerminals = state.terminals.map((t) => {
        if (t.id === action.terminalId) {
          return {
            ...t,
            status: "available" as const,
            session: undefined,
          };
        }
        return t;
      });

      return {
        ...state,
        terminals: updatedTerminals,
      };
    }

    default:
      return state;
  }
}

export { INITIAL_NETCAFE_STATE };
