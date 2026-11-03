import { describe, expect, it } from "vitest";
import { pinoyTubeReducer } from "@/lib/apps/pinoytube/reducer";
import { INITIAL_PINOYTUBE_STATE, INITIAL_VIDEOS } from "@/lib/apps/pinoytube/data";

describe("PinoyTube State Reducer", () => {
  it("initializes with default watch tab, selected video, and active playback", () => {
    expect(INITIAL_PINOYTUBE_STATE.activeTab).toBe("watch");
    expect(INITIAL_PINOYTUBE_STATE.selectedVideoId).toBe("vid-dance-otso");
    expect(INITIAL_PINOYTUBE_STATE.videos.length).toBeGreaterThanOrEqual(5);
    expect(INITIAL_PINOYTUBE_STATE.playbackState).toBe("playing");
  });

  it("maps each video entry to its matching supplied local video", () => {
    expect(INITIAL_VIDEOS.map((video) => video.mediaAssetId)).toEqual([
      "pinoytube-campus-dance",
      "pinoytube-acoustic-cover",
      "pinoytube-netcafe-gameplay",
      "pinoytube-comedy-sketch",
      "pinoytube-street-performance",
    ]);
  });

  it("selects a video, resets current time, and increments view count", () => {
    const initialTarget = INITIAL_VIDEOS.find((v) => v.id === "vid-acoustic-harana")!;
    const state = pinoyTubeReducer(INITIAL_PINOYTUBE_STATE, {
      type: "SELECT_VIDEO",
      videoId: "vid-acoustic-harana",
    });

    expect(state.selectedVideoId).toBe("vid-acoustic-harana");
    expect(state.currentTimeSeconds).toBe(0);
    expect(state.activeTab).toBe("watch");
    const updated = state.videos.find((v) => v.id === "vid-acoustic-harana")!;
    expect(updated.views).toBe(initialTarget.views + 1);
  });

  it("toggles playback state between playing and paused", () => {
    let state = pinoyTubeReducer(INITIAL_PINOYTUBE_STATE, { type: "PAUSE_VIDEO" });
    expect(state.playbackState).toBe("paused");

    state = pinoyTubeReducer(state, { type: "PLAY_VIDEO" });
    expect(state.playbackState).toBe("playing");

    state = pinoyTubeReducer(state, { type: "TOGGLE_PLAYBACK" });
    expect(state.playbackState).toBe("paused");
  });

  it("advances playback time on tick and handles seeking within bounds", () => {
    let state = pinoyTubeReducer(
      { ...INITIAL_PINOYTUBE_STATE, currentTimeSeconds: 10, isBuffering: false },
      { type: "TICK_PLAYBACK" },
    );
    expect(state.currentTimeSeconds).toBe(11);

    state = pinoyTubeReducer(state, { type: "SEEK_TIME", seconds: 50 });
    expect(state.currentTimeSeconds).toBe(50);

    // Clamps beyond duration
    state = pinoyTubeReducer(state, { type: "SEEK_TIME", seconds: 9999 });
    const currentVideo = state.videos.find((v) => v.id === state.selectedVideoId)!;
    expect(state.currentTimeSeconds).toBe(currentVideo.durationSeconds);
  });

  it("rates a video with 5 stars and recalculates rating statistics", () => {
    const targetId = "vid-dance-otso";
    const initialVideo = INITIAL_VIDEOS.find((v) => v.id === targetId)!;

    const state = pinoyTubeReducer(INITIAL_PINOYTUBE_STATE, {
      type: "RATE_VIDEO",
      videoId: targetId,
      rating: 5,
    });

    const updated = state.videos.find((v) => v.id === targetId)!;
    expect(updated.userRating).toBe(5);
    expect(updated.ratingCount).toBe(initialVideo.ratingCount + 1);
  });

  it("toggles favorite state on a video", () => {
    const targetId = "vid-dance-otso";
    let state = pinoyTubeReducer(INITIAL_PINOYTUBE_STATE, {
      type: "TOGGLE_FAVORITE",
      videoId: targetId,
    });

    let video = state.videos.find((v) => v.id === targetId)!;
    expect(video.isFavorite).toBe(true);

    state = pinoyTubeReducer(state, {
      type: "TOGGLE_FAVORITE",
      videoId: targetId,
    });
    video = state.videos.find((v) => v.id === targetId)!;
    expect(video.isFavorite).toBe(false);
  });

  it("adds a comment to the selected video thread", () => {
    const targetId = "vid-dance-otso";
    const initialCount = INITIAL_PINOYTUBE_STATE.comments[targetId]?.length || 0;

    const state = pinoyTubeReducer(INITIAL_PINOYTUBE_STATE, {
      type: "ADD_COMMENT",
      videoId: targetId,
      text: "Solid na sayaw! Lupet niyo mga idol!",
      rating: 5,
    });

    const thread = state.comments[targetId];
    expect(thread.length).toBe(initialCount + 1);
    expect(thread[0].text).toBe("Solid na sayaw! Lupet niyo mga idol!");
    expect(thread[0].author).toBe("@MuseumVisitor_PH");
  });

  it("uploads a new fictional video and switches to watch view", () => {
    const initialCount = INITIAL_PINOYTUBE_STATE.videos.length;
    const state = pinoyTubeReducer(INITIAL_PINOYTUBE_STATE, {
      type: "UPLOAD_VIDEO",
      title: "My School Band Rehearsal",
      category: "acoustic-opm",
      description: "Testing our new amplifier in the garage.",
      tags: ["band", "rehearsal", "garage"],
    });

    expect(state.videos.length).toBe(initialCount + 1);
    expect(state.videos[0].title).toBe("My School Band Rehearsal");
    expect(state.selectedVideoId).toBe(state.videos[0].id);
    expect(state.activeTab).toBe("watch");
    expect(state.comments[state.videos[0].id].length).toBe(1);
  });

  it("changes resolution, filter category, and volume", () => {
    let state = pinoyTubeReducer(INITIAL_PINOYTUBE_STATE, {
      type: "SET_RESOLUTION",
      resolution: "360p",
    });
    expect(state.selectedResolution).toBe("360p");
    expect(state.isBuffering).toBe(true);

    state = pinoyTubeReducer(state, {
      type: "SET_FILTER_CATEGORY",
      category: "campus-dance",
    });
    expect(state.filterCategory).toBe("campus-dance");

    state = pinoyTubeReducer(state, {
      type: "SET_VOLUME",
      volume: 40,
    });
    expect(state.volume).toBe(40);

    state = pinoyTubeReducer(state, {
      type: "TOGGLE_MUTE",
    });
    expect(state.isMuted).toBe(true);
  });
});
