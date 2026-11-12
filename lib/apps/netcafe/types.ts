export type TerminalStatus = "available" | "occupied" | "paused" | "expired" | "maintenance";

export type SessionTariff = {
  id: string;
  name: string;
  minutes: number;
  pricePesos: number;
  description: string;
};

export type CafeActivity = {
  id: string;
  name: string;
  category: "gaming" | "social" | "productivity" | "multimedia";
  icon: string;
  genre: string;
};

export type SnackItem = {
  id: string;
  name: string;
  category: "food" | "drink";
  pricePesos: number;
  icon: string;
};

export type PrintJob = {
  id: string;
  terminalId: string;
  documentName: string;
  pageCount: number;
  isColor: boolean;
  costPesos: number;
  status: "queued" | "printing" | "completed";
  createdAt: string;
};

export type ActiveSession = {
  terminalId: string;
  customerName: string;
  tariffId: string;
  activityId: string;
  initialMinutes: number;
  extendedMinutes: number;
  remainingSeconds: number;
  sessionFeePesos: number;
  snacks: { name: string; pricePesos: number }[];
  printJobIds: string[];
  startTime: string;
  lowTimeWarned: boolean;
  isPaused: boolean;
};

export type Terminal = {
  id: string; // "pc-01" ... "pc-08"
  number: number;
  name: string;
  osName: string;
  specs: string;
  status: TerminalStatus;
  session?: ActiveSession;
};

export type CompletedSession = {
  id: string;
  terminalId: string;
  terminalName: string;
  customerName: string;
  durationMinutes: number;
  activityName: string;
  sessionCostPesos: number;
  snackCostPesos: number;
  printCostPesos: number;
  totalBillPesos: number;
  completedAt: string;
};

export type NetCafeView =
  | "terminals"
  | "active-session"
  | "print-services"
  | "history"
  | "museum-info";

export type NetCafeState = {
  activeView: NetCafeView;
  selectedTerminalId: string | null;
  terminals: Terminal[];
  tariffs: SessionTariff[];
  activities: CafeActivity[];
  snacks: SnackItem[];
  printJobs: PrintJob[];
  completedSessions: CompletedSession[];
  cashierRegister: {
    cashOnHand: number;
    totalSessionRevenue: number;
    totalPrintRevenue: number;
    totalSnackRevenue: number;
  };
  isTimerRunning: boolean;
  /** Counts the Missions checklist reads from. */
  stats: { seated: number; snacksSold: number; extensions: number; prints: number; checkouts: number };
};

export type NetCafeAction =
  | { type: "SET_VIEW"; view: NetCafeView }
  | { type: "SELECT_TERMINAL"; terminalId: string }
  | {
      type: "START_SESSION";
      terminalId: string;
      customerName: string;
      tariffId: string;
      activityId: string;
    }
  | {
      type: "EXTEND_SESSION";
      terminalId: string;
      additionalMinutes: number;
      costPesos: number;
    }
  | { type: "CHANGE_ACTIVITY"; terminalId: string; activityId: string }
  | { type: "ORDER_SNACK"; terminalId: string; snack: SnackItem }
  | { type: "PAUSE_SESSION"; terminalId: string }
  | { type: "RESUME_SESSION"; terminalId: string }
  | { type: "END_SESSION"; terminalId: string }
  | { type: "DISMISS_WARNING"; terminalId: string }
  | { type: "TICK_TIME"; seconds: number }
  | { type: "SIMULATE_TIME_PASS"; minutes: number }
  | { type: "SET_TIMER_RUNNING"; isRunning: boolean }
  | {
      type: "QUEUE_PRINT_JOB";
      terminalId: string;
      documentName: string;
      pageCount: number;
      isColor: boolean;
    }
  | { type: "PROCESS_PRINT_JOB"; jobId: string }
  | { type: "CLEAR_COMPLETED_PRINTS" }
  | { type: "RESET_TERMINAL"; terminalId: string };
