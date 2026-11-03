import { describe, expect, it } from "vitest";
import { ppopPassportReducer } from "@/lib/apps/ppoppassport/reducer";
import { INITIAL_PPOP_PASSPORT_STATE } from "@/lib/apps/ppoppassport/data";

describe("P-pop Passport State Reducer", () => {
  it("initializes with default passport tab, traveler name, and initial welcome stamp", () => {
    const state = INITIAL_PPOP_PASSPORT_STATE;
    expect(state.activeTab).toBe("passport");
    expect(state.travelerName).toBe("Museum Visitor");
    expect(state.stamps.length).toBe(6);
    expect(state.stamps.filter((s) => s.isCollected).length).toBe(1);
    expect(state.routes.length).toBe(3);
  });

  it("handles changing tabs and updating traveler name", () => {
    let state = ppopPassportReducer(INITIAL_PPOP_PASSPORT_STATE, {
      type: "SET_TAB",
      tab: "timeline",
    });
    expect(state.activeTab).toBe("timeline");

    state = ppopPassportReducer(state, {
      type: "SET_TRAVELER_NAME",
      name: "Miguel Santos",
    });
    expect(state.travelerName).toBe("Miguel Santos");
  });

  it("selects era and stamp", () => {
    let state = ppopPassportReducer(INITIAL_PPOP_PASSPORT_STATE, {
      type: "SELECT_ERA",
      eraId: "era-birit",
    });
    expect(state.selectedEraId).toBe("era-birit");

    state = ppopPassportReducer(state, {
      type: "SELECT_STAMP",
      stampId: "stamp-chinovela-ost",
    });
    expect(state.selectedStampId).toBe("stamp-chinovela-ost");
    expect(state.selectedEraId).toBe("era-asianovela");
  });

  it("collects a passport stamp and updates route completion status", () => {
    let state = ppopPassportReducer(INITIAL_PPOP_PASSPORT_STATE, {
      type: "COLLECT_STAMP",
      stampId: "stamp-chinovela-ost",
    });
    const chinovela = state.stamps.find((s) => s.id === "stamp-chinovela-ost");
    expect(chinovela?.isCollected).toBe(true);

    // Complete a route
    state = ppopPassportReducer(state, {
      type: "COMPLETE_ROUTE",
      routeId: "route-rhythm",
    });
    const rhythmRoute = state.routes.find((r) => r.id === "route-rhythm");
    expect(rhythmRoute?.isCompleted).toBe(true);
    // All stamps in route-rhythm should now be collected
    expect(state.stamps.find((s) => s.id === "stamp-street-dance")?.isCollected).toBe(true);
    expect(state.stamps.find((s) => s.id === "stamp-pinoy-idols")?.isCollected).toBe(true);
    expect(state.stamps.find((s) => s.id === "stamp-modern-ppop")?.isCollected).toBe(true);
  });

  it("resets passport stamps to default welcome state", () => {
    let state = ppopPassportReducer(INITIAL_PPOP_PASSPORT_STATE, {
      type: "COMPLETE_ROUTE",
      routeId: "route-rhythm",
    });
    expect(state.stamps.filter((s) => s.isCollected).length).toBeGreaterThanOrEqual(3);

    state = ppopPassportReducer(state, { type: "RESET_PASSPORT" });
    expect(state.stamps.filter((s) => s.isCollected).length).toBe(1);
    expect(state.routes.every((r) => !r.isCompleted)).toBe(true);
  });
});
