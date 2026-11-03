import { describe, expect, it } from "vitest";
import { tvTambayanReducer } from "@/lib/apps/tvtambayan/reducer";
import { INITIAL_TV_TAMBAYAN_STATE } from "@/lib/apps/tvtambayan/data";

describe("TV Tambayan State Reducer", () => {
  it("initializes with Channel 02 Asianovela Prime and power on", () => {
    expect(INITIAL_TV_TAMBAYAN_STATE.currentChannelId).toBe("ch-02");
    expect(INITIAL_TV_TAMBAYAN_STATE.isPoweredOn).toBe(true);
    expect(INITIAL_TV_TAMBAYAN_STATE.localizationMode).toBe("tagalog-dub");
    expect(INITIAL_TV_TAMBAYAN_STATE.channels.length).toBe(4);
  });

  it("maps each TV channel to its matching supplied local feature", () => {
    expect(
      INITIAL_TV_TAMBAYAN_STATE.channels.map((channel) => channel.mediaAssetId),
    ).toEqual([
      "tv-meteor-garden",
      "tv-tagalized-anime",
      "tv-videoke",
      "tv-mall-variety",
    ]);
  });

  it("changes channels directly and cycles with CHANNEL_UP / CHANNEL_DOWN", () => {
    let state = tvTambayanReducer(INITIAL_TV_TAMBAYAN_STATE, {
      type: "CHANGE_CHANNEL",
      channelId: "ch-07",
    });
    expect(state.currentChannelId).toBe("ch-07");
    expect(state.selectedProgramId).toBe("prog-voltech-guardians");

    // Channel UP: 07 -> 23
    state = tvTambayanReducer(state, { type: "CHANNEL_UP" });
    expect(state.currentChannelId).toBe("ch-23");

    // Channel UP: 23 -> 41
    state = tvTambayanReducer(state, { type: "CHANNEL_UP" });
    expect(state.currentChannelId).toBe("ch-41");

    // Channel UP wraps: 41 -> 02
    state = tvTambayanReducer(state, { type: "CHANNEL_UP" });
    expect(state.currentChannelId).toBe("ch-02");

    // Channel DOWN wraps: 02 -> 41
    state = tvTambayanReducer(state, { type: "CHANNEL_DOWN" });
    expect(state.currentChannelId).toBe("ch-41");
  });

  it("toggles CRT power state", () => {
    let state = tvTambayanReducer(INITIAL_TV_TAMBAYAN_STATE, { type: "TOGGLE_POWER" });
    expect(state.isPoweredOn).toBe(false);

    state = tvTambayanReducer(state, { type: "TOGGLE_POWER" });
    expect(state.isPoweredOn).toBe(true);
  });

  it("adjusts volume and mute states", () => {
    let state = tvTambayanReducer(INITIAL_TV_TAMBAYAN_STATE, {
      type: "SET_VOLUME",
      volume: 90,
    });
    expect(state.volume).toBe(90);

    state = tvTambayanReducer(state, { type: "TOGGLE_MUTE" });
    expect(state.isMuted).toBe(true);

    state = tvTambayanReducer(state, { type: "TOGGLE_MUTE" });
    expect(state.isMuted).toBe(false);
  });

  it("updates localization mode", () => {
    let state = tvTambayanReducer(INITIAL_TV_TAMBAYAN_STATE, {
      type: "SET_LOCALIZATION_MODE",
      mode: "taglish-sub",
    });
    expect(state.localizationMode).toBe("taglish-sub");

    state = tvTambayanReducer(state, {
      type: "SET_LOCALIZATION_MODE",
      mode: "orig-sub",
    });
    expect(state.localizationMode).toBe("orig-sub");
  });

  it("toggles favorite show state", () => {
    const progId = "prog-palasyo-puso";
    const state = tvTambayanReducer(INITIAL_TV_TAMBAYAN_STATE, {
      type: "TOGGLE_FAVORITE_SHOW",
      programId: progId,
    });

    let found = false;
    for (const ch of state.channels) {
      const p = ch.programs.find((x) => x.id === progId);
      if (p) {
        found = p.isFavorite;
        break;
      }
    }
    expect(found).toBe(true);
  });

  it("selects a program, switches active channel, and brings view to tv tab", () => {
    const progId = "prog-voltech-guardians"; // on ch-07
    const state = tvTambayanReducer(INITIAL_TV_TAMBAYAN_STATE, {
      type: "SELECT_PROGRAM",
      programId: progId,
    });

    expect(state.selectedProgramId).toBe(progId);
    expect(state.currentChannelId).toBe("ch-07");
    expect(state.activeTab).toBe("tv");
  });
});
