import { describe, expect, it } from "vitest";
import {
  getTourPosition,
  initialMuseumState,
  museumReducer,
} from "@/lib/museum-state";

describe("museumReducer", () => {
  it("lands in the same welcome state when boot finishes or is skipped", () => {
    expect(museumReducer(initialMuseumState, { type: "FINISH_BOOT" })).toEqual(
      museumReducer(initialMuseumState, { type: "SKIP_BOOT" }),
    );
  });

  it("starts the tour at the first Technology exhibit with sound off", () => {
    const state = museumReducer(
      museumReducer(initialMuseumState, { type: "SKIP_BOOT" }),
      { type: "START_TOUR" },
    );

    expect(state.activeRoom).toBe("technology");
    expect(state.selectedExhibitId).toBe("nokia-sms");
    expect(state.tourStatus).toBe("active");
    expect(state.museumVisibility).toBe("open");
    expect(state.soundEnabled).toBe(false);
    expect(getTourPosition(state)).toEqual({ index: 0, total: 12 });
  });

  it("opens a selected room at its first exhibit", () => {
    const state = museumReducer(initialMuseumState, {
      type: "OPEN_ROOM",
      roomId: "performance",
    });

    expect(state.activeRoom).toBe("performance");
    expect(state.selectedExhibitId).toBe("reality-tv");
    expect(state.tourStatus).toBe("inactive");
  });

  it("walks all twelve exhibits and completes only after the last one", () => {
    let state = museumReducer(initialMuseumState, { type: "START_TOUR" });
    for (let index = 0; index < 11; index += 1) {
      state = museumReducer(state, { type: "NEXT" });
    }
    expect(state.selectedExhibitId).toBe("foreign-to-ppop");
    expect(state.tourStatus).toBe("active");

    state = museumReducer(state, { type: "NEXT" });
    expect(state.tourStatus).toBe("complete");
    expect(state.selectedExhibitId).toBe("foreign-to-ppop");
  });

  it("keeps previous and next actions stable at invalid boundaries", () => {
    const inactive = museumReducer(initialMuseumState, { type: "PREVIOUS" });
    expect(inactive).toEqual(initialMuseumState);

    const first = museumReducer(initialMuseumState, { type: "START_TOUR" });
    expect(museumReducer(first, { type: "PREVIOUS" })).toEqual(first);
  });

  it("preserves selection through minimize and restore, then closes to desktop", () => {
    let state = museumReducer(initialMuseumState, {
      type: "OPEN_ROOM",
      roomId: "globalization",
    });
    state = museumReducer(state, { type: "SELECT_EXHIBIT", exhibitId: "chat-archives" });
    state = museumReducer(state, { type: "MINIMIZE_MUSEUM" });
    expect(state.museumVisibility).toBe("minimized");
    expect(state.selectedExhibitId).toBe("chat-archives");

    state = museumReducer(state, { type: "RESTORE_MUSEUM" });
    expect(state.museumVisibility).toBe("open");
    expect(state.selectedExhibitId).toBe("chat-archives");

    state = museumReducer(state, { type: "CLOSE_MUSEUM" });
    expect(state.museumVisibility).toBe("closed");
    expect(state.activeRoom).toBeNull();
  });

  it("toggles the Start menu without changing the active room", () => {
    const room = museumReducer(initialMuseumState, { type: "OPEN_ROOM", roomId: "technology" });
    const opened = museumReducer(room, { type: "TOGGLE_START_MENU" });
    expect(opened.startMenuOpen).toBe(true);
    expect(opened.activeRoom).toBe("technology");
    expect(museumReducer(opened, { type: "TOGGLE_START_MENU" }).startMenuOpen).toBe(false);
  });
});
