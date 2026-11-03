import { describe, it, expect } from "vitest";
import { netCafeReducer, INITIAL_NETCAFE_STATE } from "@/lib/apps/netcafe/reducer";

describe("Phase 5 — Net Café Manager State Transitions", () => {
  it("initializes with 8 terminals, pricing tariffs, and period cashier till", () => {
    expect(INITIAL_NETCAFE_STATE.terminals.length).toBe(8);
    expect(INITIAL_NETCAFE_STATE.tariffs.length).toBe(4);
    expect(INITIAL_NETCAFE_STATE.activities.length).toBeGreaterThan(5);
    expect(INITIAL_NETCAFE_STATE.cashierRegister.cashOnHand).toBe(105);

    const pc01 = INITIAL_NETCAFE_STATE.terminals.find((t) => t.id === "pc-01");
    expect(pc01?.status).toBe("occupied");
    expect(pc01?.session?.customerName).toBe("Jepoy_Dota");

    const pc02 = INITIAL_NETCAFE_STATE.terminals.find((t) => t.id === "pc-02");
    expect(pc02?.status).toBe("available");
  });

  it("rents an available terminal, creates active session, and records cashier revenue", () => {
    const state = netCafeReducer(INITIAL_NETCAFE_STATE, {
      type: "START_SESSION",
      terminalId: "pc-02",
      customerName: "DotaGod_01",
      tariffId: "tariff-1h",
      activityId: "act-dota",
    });

    const pc02 = state.terminals.find((t) => t.id === "pc-02");
    expect(pc02?.status).toBe("occupied");
    expect(pc02?.session).toBeDefined();
    expect(pc02?.session?.customerName).toBe("DotaGod_01");
    expect(pc02?.session?.remainingSeconds).toBe(3600); // 60 mins
    expect(pc02?.session?.sessionFeePesos).toBe(20);

    // Cashier till updated (+₱20)
    expect(state.cashierRegister.cashOnHand).toBe(125);
    expect(state.cashierRegister.totalSessionRevenue).toBe(75);
  });

  it("deterministically decrements session time and triggers low-time and expiration thresholds", () => {
    // Start session on PC 02 with 30 mins (1800s)
    let state = netCafeReducer(INITIAL_NETCAFE_STATE, {
      type: "START_SESSION",
      terminalId: "pc-02",
      customerName: "TestUser",
      tariffId: "tariff-30m",
      activityId: "act-social",
    });

    let pc02 = state.terminals.find((t) => t.id === "pc-02");
    expect(pc02?.session?.remainingSeconds).toBe(1800);
    expect(pc02?.session?.lowTimeWarned).toBe(false);

    // Deterministically advance time by 26 minutes (1560s), leaving 240s (4 mins)
    state = netCafeReducer(state, { type: "SIMULATE_TIME_PASS", minutes: 26 });
    pc02 = state.terminals.find((t) => t.id === "pc-02");
    expect(pc02?.session?.remainingSeconds).toBe(240);
    expect(pc02?.session?.lowTimeWarned).toBe(true);
    expect(pc02?.status).toBe("occupied");

    // Deterministically advance another 4 minutes (240s) to expire the session
    state = netCafeReducer(state, { type: "TICK_TIME", seconds: 240 });
    pc02 = state.terminals.find((t) => t.id === "pc-02");
    expect(pc02?.session?.remainingSeconds).toBe(0);
    expect(pc02?.status).toBe("expired");
  });

  it("extends an active session, adds time and fee, and clears low-time warning if above 5m", () => {
    // Start session on PC 02
    let state = netCafeReducer(INITIAL_NETCAFE_STATE, {
      type: "START_SESSION",
      terminalId: "pc-02",
      customerName: "GamerKid",
      tariffId: "tariff-30m",
      activityId: "act-cs",
    });

    // Advance to 2 mins remaining (low time)
    state = netCafeReducer(state, { type: "TICK_TIME", seconds: 1680 });
    let pc02 = state.terminals.find((t) => t.id === "pc-02");
    expect(pc02?.session?.remainingSeconds).toBe(120);

    // Extend by 60 mins (+₱20)
    state = netCafeReducer(state, {
      type: "EXTEND_SESSION",
      terminalId: "pc-02",
      additionalMinutes: 60,
      costPesos: 20,
    });

    pc02 = state.terminals.find((t) => t.id === "pc-02");
    expect(pc02?.session?.remainingSeconds).toBe(120 + 3600);
    expect(pc02?.session?.extendedMinutes).toBe(60);
    expect(pc02?.session?.lowTimeWarned).toBe(false); // Reset since > 300s
    expect(pc02?.session?.sessionFeePesos).toBe(35); // ₱15 initial + ₱20 extension
  });

  it("switches activities and delivers canteen snacks to an active terminal", () => {
    let state = netCafeReducer(INITIAL_NETCAFE_STATE, {
      type: "START_SESSION",
      terminalId: "pc-02",
      customerName: "Barkada_Boy",
      tariffId: "tariff-1h",
      activityId: "act-dota",
    });

    // Change activity to Ragnarok
    state = netCafeReducer(state, {
      type: "CHANGE_ACTIVITY",
      terminalId: "pc-02",
      activityId: "act-ragnarok",
    });

    let pc02 = state.terminals.find((t) => t.id === "pc-02");
    expect(pc02?.session?.activityId).toBe("act-ragnarok");

    // Order Pancit Canton (₱25)
    const cantonSnack = state.snacks.find((s) => s.id === "snack-canton")!;
    state = netCafeReducer(state, {
      type: "ORDER_SNACK",
      terminalId: "pc-02",
      snack: cantonSnack,
    });

    pc02 = state.terminals.find((t) => t.id === "pc-02");
    expect(pc02?.session?.snacks.length).toBe(1);
    expect(pc02?.session?.snacks[0].name).toContain("Pancit Canton");
    expect(state.cashierRegister.totalSnackRevenue).toBe(65); // 40 initial + 25
  });

  it("simulates network printing service, queues jobs, and processes completion", () => {
    let state = netCafeReducer(INITIAL_NETCAFE_STATE, {
      type: "QUEUE_PRINT_JOB",
      terminalId: "pc-03",
      documentName: "HighSchool_Resume.doc",
      pageCount: 3,
      isColor: true, // 3 pgs * ₱5 = ₱15
    });

    expect(state.printJobs.length).toBe(2);
    const newJob = state.printJobs.find((j) => j.documentName === "HighSchool_Resume.doc");
    expect(newJob).toBeDefined();
    expect(newJob?.costPesos).toBe(15);
    expect(newJob?.status).toBe("printing");

    // Process job to completed
    state = netCafeReducer(state, { type: "PROCESS_PRINT_JOB", jobId: newJob!.id });
    const processedJob = state.printJobs.find((j) => j.id === newJob!.id);
    expect(processedJob?.status).toBe("completed");
  });

  it("checks out an active terminal session, logs completed receipt, and resets terminal to available", () => {
    // Start session on PC 02
    let state = netCafeReducer(INITIAL_NETCAFE_STATE, {
      type: "START_SESSION",
      terminalId: "pc-02",
      customerName: "Checkout_Player",
      tariffId: "tariff-1h",
      activityId: "act-dota",
    });

    // Add snack
    const snack = state.snacks[0];
    state = netCafeReducer(state, {
      type: "ORDER_SNACK",
      terminalId: "pc-02",
      snack,
    });

    // Add print job linked to PC 02 (5 pages B&W = ₱10)
    state = netCafeReducer(state, {
      type: "QUEUE_PRINT_JOB",
      terminalId: "pc-02",
      documentName: "Thesis_Draft.doc",
      pageCount: 5,
      isColor: false,
    });

    const initialHistoryLength = state.completedSessions.length;

    // Check out session
    state = netCafeReducer(state, { type: "END_SESSION", terminalId: "pc-02" });

    // Terminal is now available
    const pc02 = state.terminals.find((t) => t.id === "pc-02");
    expect(pc02?.status).toBe("available");
    expect(pc02?.session).toBeUndefined();

    // Receipt logged in completed sessions with session + snack + print totals
    expect(state.completedSessions.length).toBe(initialHistoryLength + 1);
    const receipt = state.completedSessions[0];
    expect(receipt.customerName).toBe("Checkout_Player");
    expect(receipt.terminalId).toBe("pc-02");
    expect(receipt.sessionCostPesos).toBe(20);
    expect(receipt.snackCostPesos).toBe(snack.pricePesos);
    expect(receipt.printCostPesos).toBe(10);
    expect(receipt.totalBillPesos).toBe(20 + snack.pricePesos + 10);
  });

  it("pauses and resumes a session, preventing time deduction while paused", () => {
    let state = netCafeReducer(INITIAL_NETCAFE_STATE, {
      type: "START_SESSION",
      terminalId: "pc-02",
      customerName: "LunchBreak_User",
      tariffId: "tariff-1h",
      activityId: "act-dota",
    });

    state = netCafeReducer(state, { type: "PAUSE_SESSION", terminalId: "pc-02" });
    let pc02 = state.terminals.find((t) => t.id === "pc-02");
    expect(pc02?.status).toBe("paused");
    expect(pc02?.session?.isPaused).toBe(true);

    // Ticking time while paused does NOT deduct time
    state = netCafeReducer(state, { type: "TICK_TIME", seconds: 600 });
    pc02 = state.terminals.find((t) => t.id === "pc-02");
    expect(pc02?.session?.remainingSeconds).toBe(3600);

    // Resume session
    state = netCafeReducer(state, { type: "RESUME_SESSION", terminalId: "pc-02" });
    pc02 = state.terminals.find((t) => t.id === "pc-02");
    expect(pc02?.status).toBe("occupied");
    expect(pc02?.session?.isPaused).toBe(false);

    // Ticking now deducts
    state = netCafeReducer(state, { type: "TICK_TIME", seconds: 300 });
    pc02 = state.terminals.find((t) => t.id === "pc-02");
    expect(pc02?.session?.remainingSeconds).toBe(3300);
  });
});
