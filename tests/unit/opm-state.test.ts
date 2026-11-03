import { describe, it, expect } from "vitest";
import { opmReducer } from "@/lib/apps/opm/reducer";
import { INITIAL_OPM_STATE } from "@/lib/apps/opm/data";

describe("Phase 6 — OPM Media Player State Transitions", () => {
  it("initializes with 6 tracks, track-1 loaded, and stopped playback", () => {
    expect(INITIAL_OPM_STATE.tracks.length).toBe(6);
    expect(INITIAL_OPM_STATE.currentTrackId).toBe("track-1");
    expect(INITIAL_OPM_STATE.playbackState).toBe("stopped");
    expect(INITIAL_OPM_STATE.currentTimeSeconds).toBe(0);
    expect(INITIAL_OPM_STATE.volume).toBe(0.8);
    expect(INITIAL_OPM_STATE.isMuted).toBe(false);
    expect(INITIAL_OPM_STATE.playlistTrackIds.length).toBe(6);
    expect(INITIAL_OPM_STATE.visualizerMode).toBe("bars");
  });

  it("makes every catalog track playable from a unique museum media asset", () => {
    expect(INITIAL_OPM_STATE.tracks.map((track) => track.availability)).toEqual([
      "licensed",
      "licensed",
      "licensed",
      "licensed",
      "licensed",
      "licensed",
    ]);
    expect(INITIAL_OPM_STATE.tracks.map((track) => track.mediaAssetId)).toEqual([
      "dizzy-spells-acoustic",
      "hale-day-you-said-goodnight",
      "kamikazee-narda",
      "sponge-cola-jeepney",
      "orange-lemons-hanggang-kailan",
      "moonstar88-migraine",
    ]);
  });

  it("handles play, pause, and stop playback transitions", () => {
    // Play
    let state = opmReducer(INITIAL_OPM_STATE, { type: "PLAY_TRACK" });
    expect(state.playbackState).toBe("playing");

    // Pause
    state = opmReducer(state, { type: "PAUSE_TRACK" });
    expect(state.playbackState).toBe("paused");

    // Play specific track
    state = opmReducer(state, { type: "PLAY_TRACK", trackId: "track-3" });
    expect(state.playbackState).toBe("playing");
    expect(state.currentTrackId).toBe("track-3");
    expect(state.currentTimeSeconds).toBe(0);

    // Stop
    state = opmReducer(state, { type: "STOP_TRACK" });
    expect(state.playbackState).toBe("stopped");
    expect(state.currentTimeSeconds).toBe(0);
  });

  it("handles seeking within track bounds", () => {
    let state = opmReducer(INITIAL_OPM_STATE, { type: "SEEK_TIME", seconds: 50 });
    expect(state.currentTimeSeconds).toBe(50);

    // Exceeding track duration clamps to the licensed track duration.
    state = opmReducer(state, { type: "SEEK_TIME", seconds: 999 });
    expect(state.currentTimeSeconds).toBe(238);

    // Negative clamps to 0
    state = opmReducer(state, { type: "SEEK_TIME", seconds: -10 });
    expect(state.currentTimeSeconds).toBe(0);
  });

  it("handles next and previous track navigation", () => {
    let state = opmReducer(INITIAL_OPM_STATE, { type: "NEXT_TRACK" });
    expect(state.currentTrackId).toBe("track-2");
    expect(state.playbackState).toBe("playing");

    state = opmReducer(state, { type: "NEXT_TRACK" });
    expect(state.currentTrackId).toBe("track-3");

    // Prev track when under 3 seconds goes to track-2
    state = opmReducer(state, { type: "PREV_TRACK" });
    expect(state.currentTrackId).toBe("track-2");

    // When playing more than 3 seconds in, PREV_TRACK restarts track
    state = { ...state, currentTimeSeconds: 15 };
    state = opmReducer(state, { type: "PREV_TRACK" });
    expect(state.currentTrackId).toBe("track-2");
    expect(state.currentTimeSeconds).toBe(0);
  });

  it("increments playback time on tick and handles auto-advancement", () => {
    let state = opmReducer(INITIAL_OPM_STATE, { type: "PLAY_TRACK", trackId: "track-3" });
    const duration = state.tracks.find((track) => track.id === "track-3")!.durationSeconds;
    state = { ...state, currentTimeSeconds: duration - 2 };

    state = opmReducer(state, { type: "TICK_PLAYBACK" });
    expect(state.currentTimeSeconds).toBe(duration - 1);

    // Tick reaches duration: advances to next track in playlist (track-4)
    state = opmReducer(state, { type: "TICK_PLAYBACK" });
    expect(state.currentTrackId).toBe("track-4");
    expect(state.currentTimeSeconds).toBe(0);
    expect(state.playbackState).toBe("playing");
  });

  it("loops track when repeat is enabled and song finishes", () => {
    let state = opmReducer(INITIAL_OPM_STATE, { type: "TOGGLE_REPEAT" });
    expect(state.isRepeat).toBe(true);

    state = opmReducer(state, { type: "PLAY_TRACK", trackId: "track-3" });
    const duration = state.tracks.find((track) => track.id === "track-3")!.durationSeconds;
    state = { ...state, currentTimeSeconds: duration - 1 };

    state = opmReducer(state, { type: "TICK_PLAYBACK" });
    expect(state.currentTrackId).toBe("track-3");
    expect(state.currentTimeSeconds).toBe(0);
  });

  it("manages volume and mute states", () => {
    let state = opmReducer(INITIAL_OPM_STATE, { type: "SET_VOLUME", volume: 0.5 });
    expect(state.volume).toBe(0.5);

    state = opmReducer(state, { type: "TOGGLE_MUTE" });
    expect(state.isMuted).toBe(true);

    state = opmReducer(state, { type: "TOGGLE_MUTE" });
    expect(state.isMuted).toBe(false);
  });

  it("toggles track favorites", () => {
    const track3 = INITIAL_OPM_STATE.tracks.find((t) => t.id === "track-3");
    expect(track3?.isFavorite).toBe(false);

    let state = opmReducer(INITIAL_OPM_STATE, { type: "TOGGLE_FAVORITE", trackId: "track-3" });
    let updated3 = state.tracks.find((t) => t.id === "track-3");
    expect(updated3?.isFavorite).toBe(true);

    state = opmReducer(state, { type: "TOGGLE_FAVORITE", trackId: "track-3" });
    updated3 = state.tracks.find((t) => t.id === "track-3");
    expect(updated3?.isFavorite).toBe(false);
  });

  it("manages playlist addition, removal, and visualizer mode", () => {
    let state = opmReducer(INITIAL_OPM_STATE, {
      type: "REMOVE_FROM_PLAYLIST",
      trackId: "track-6",
    });
    expect(state.playlistTrackIds).not.toContain("track-6");

    state = opmReducer(state, {
      type: "ADD_TO_PLAYLIST",
      trackId: "track-6",
    });
    expect(state.playlistTrackIds).toContain("track-6");

    // Visualizer mode
    state = opmReducer(state, { type: "SET_VISUALIZER_MODE", mode: "wave" });
    expect(state.visualizerMode).toBe("wave");
  });
});
