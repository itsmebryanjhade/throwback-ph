import { describe, it, expect } from "vitest";
import { realityTvReducer } from "@/lib/apps/realitytv/reducer";
import { INITIAL_REALITY_TV_STATE } from "@/lib/apps/realitytv/data";

describe("Phase 6 — Reality TV Vote State Transitions", () => {
  it("initializes with 5 fictional nominees, starting prepaid load, and shortcode 2366", () => {
    expect(INITIAL_REALITY_TV_STATE.nominees.length).toBe(5);
    expect(INITIAL_REALITY_TV_STATE.prepaidLoad).toBe(45.0);
    expect(INITIAL_REALITY_TV_STATE.costPerVote).toBe(2.5);
    expect(INITIAL_REALITY_TV_STATE.shortcode).toBe("2366");
    expect(INITIAL_REALITY_TV_STATE.activeTab).toBe("vote");
    expect(INITIAL_REALITY_TV_STATE.selectedNomineeId).toBe("nom-bea");
  });

  it("gives every fictional nominee local reconstruction portrait metadata", () => {
    for (const nominee of INITIAL_REALITY_TV_STATE.nominees) {
      expect(nominee.portraitSrc).toMatch(/^\/museum\/phase-9\/priority\//);
      expect(nominee.portraitAlt).toMatch(/fictional reconstruction portrait/i);
    }
  });

  it("casts a single vote, deducts ₱2.50 prepaid load, and records to history", () => {
    const state = realityTvReducer(INITIAL_REALITY_TV_STATE, {
      type: "CAST_VOTE",
      nomineeId: "nom-bea",
      voteCount: 1,
    });

    expect(state.prepaidLoad).toBe(42.5);
    const bea = state.nominees.find((n) => n.id === "nom-bea");
    expect(bea?.currentVotes).toBe(INITIAL_REALITY_TV_STATE.nominees[0].currentVotes + 1);
    expect(state.totalSimulatedVotes).toBe(INITIAL_REALITY_TV_STATE.totalSimulatedVotes + 1);
    expect(state.voteHistory.length).toBe(INITIAL_REALITY_TV_STATE.voteHistory.length + 1);
    expect(state.voteHistory[0].nomineeName).toBe("Bea Valderama");
    expect(state.voteHistory[0].keyword).toBe("VOTE BEA");
    expect(state.voteHistory[0].costPesos).toBe(2.5);
  });

  it("supports batch voting and deducts correct total load", () => {
    const state = realityTvReducer(INITIAL_REALITY_TV_STATE, {
      type: "CAST_VOTE",
      nomineeId: "nom-kiko",
      voteCount: 5,
    });

    expect(state.prepaidLoad).toBe(45.0 - 5 * 2.5); // 32.50
    const kiko = state.nominees.find((n) => n.id === "nom-kiko");
    expect(kiko?.currentVotes).toBe(INITIAL_REALITY_TV_STATE.nominees[1].currentVotes + 5);
    expect(state.voteHistory[0].voteCount).toBe(5);
    expect(state.voteHistory[0].costPesos).toBe(12.5);
  });

  it("prevents vote from being cast if prepaid load is insufficient", () => {
    // Deplete load first
    let state = { ...INITIAL_REALITY_TV_STATE, prepaidLoad: 1.0 };
    state = realityTvReducer(state, {
      type: "CAST_VOTE",
      nomineeId: "nom-joma",
      voteCount: 1,
    });

    expect(state.prepaidLoad).toBe(1.0);
    expect(state.voteHistory.length).toBe(INITIAL_REALITY_TV_STATE.voteHistory.length);
  });

  it("reloads prepaid balance correctly", () => {
    const state = realityTvReducer(INITIAL_REALITY_TV_STATE, {
      type: "RELOAD_PREPAID",
      amount: 50.0,
    });

    expect(state.prepaidLoad).toBe(95.0);
  });

  it("simulates crowd surge and updates eviction risks dynamically", () => {
    const state = realityTvReducer(INITIAL_REALITY_TV_STATE, {
      type: "SIMULATE_CROWD_SURGE",
    });

    expect(state.totalSimulatedVotes).toBeGreaterThan(INITIAL_REALITY_TV_STATE.totalSimulatedVotes);

    const nominated = state.nominees.filter((n) => n.status === "nominated");
    const hasEndangered = nominated.some((n) => n.evictionRisk === "endangered");
    expect(hasEndangered).toBe(true);
  });

  it("clears personal vote history log", () => {
    let state = realityTvReducer(INITIAL_REALITY_TV_STATE, {
      type: "CAST_VOTE",
      nomineeId: "nom-bea",
      voteCount: 1,
    });
    expect(state.voteHistory.length).toBe(INITIAL_REALITY_TV_STATE.voteHistory.length + 1);

    state = realityTvReducer(state, { type: "CLEAR_HISTORY" });
    expect(state.voteHistory.length).toBe(0);
  });
});
