import type { OpmAction, OpmState } from "./types";

export function opmReducer(state: OpmState, action: OpmAction): OpmState {
  switch (action.type) {
    case "SET_TAB":
      return { ...state, activeTab: action.tab };

    case "PLAY_TRACK": {
      const targetId = action.trackId || state.currentTrackId;
      const targetTrack = state.tracks.find((t) => t.id === targetId);
      if (!targetTrack) return state;

      const isNewTrack = action.trackId && action.trackId !== state.currentTrackId;
      return {
        ...state,
        currentTrackId: targetId,
        currentTimeSeconds: isNewTrack ? 0 : state.currentTimeSeconds,
        playbackState: "playing",
      };
    }

    case "PAUSE_TRACK":
      return {
        ...state,
        playbackState: state.playbackState === "playing" ? "paused" : state.playbackState,
      };

    case "STOP_TRACK":
      return {
        ...state,
        playbackState: "stopped",
        currentTimeSeconds: 0,
      };

    case "NEXT_TRACK": {
      if (state.playlistTrackIds.length === 0) {
        return { ...state, playbackState: "stopped", currentTimeSeconds: 0 };
      }

      if (state.isShuffle && state.playlistTrackIds.length > 1) {
        const remaining = state.playlistTrackIds.filter((id) => id !== state.currentTrackId);
        const randomNext = remaining[Math.floor(Math.random() * remaining.length)];
        return {
          ...state,
          currentTrackId: randomNext,
          currentTimeSeconds: 0,
          playbackState: "playing",
        };
      }

      const currentIndex = state.playlistTrackIds.indexOf(state.currentTrackId);
      if (currentIndex === -1) {
        return {
          ...state,
          currentTrackId: state.playlistTrackIds[0],
          currentTimeSeconds: 0,
          playbackState: "playing",
        };
      }

      const nextIndex = (currentIndex + 1) % state.playlistTrackIds.length;
      return {
        ...state,
        currentTrackId: state.playlistTrackIds[nextIndex],
        currentTimeSeconds: 0,
        playbackState: "playing",
      };
    }

    case "PREV_TRACK": {
      if (state.playlistTrackIds.length === 0) return state;

      // If already playing more than 3 seconds in, restart track
      if (state.currentTimeSeconds > 3) {
        return { ...state, currentTimeSeconds: 0 };
      }

      const currentIndex = state.playlistTrackIds.indexOf(state.currentTrackId);
      if (currentIndex === -1) {
        return {
          ...state,
          currentTrackId: state.playlistTrackIds[0],
          currentTimeSeconds: 0,
          playbackState: "playing",
        };
      }

      const prevIndex = (currentIndex - 1 + state.playlistTrackIds.length) % state.playlistTrackIds.length;
      return {
        ...state,
        currentTrackId: state.playlistTrackIds[prevIndex],
        currentTimeSeconds: 0,
        playbackState: "playing",
      };
    }

    case "SEEK_TIME": {
      const track = state.tracks.find((t) => t.id === state.currentTrackId);
      const maxSeconds = track ? track.durationSeconds : 300;
      return {
        ...state,
        currentTimeSeconds: Math.max(0, Math.min(action.seconds, maxSeconds)),
      };
    }

    case "TICK_PLAYBACK": {
      if (state.playbackState !== "playing") return state;

      const track = state.tracks.find((t) => t.id === state.currentTrackId);
      if (!track) return state;

      const nextTime = state.currentTimeSeconds + 1;
      if (nextTime >= track.durationSeconds) {
        if (state.isRepeat) {
          return { ...state, currentTimeSeconds: 0 };
        }

        // Auto advance to next in playlist
        const currentIndex = state.playlistTrackIds.indexOf(state.currentTrackId);
        if (currentIndex !== -1 && currentIndex + 1 < state.playlistTrackIds.length) {
          return {
            ...state,
            currentTrackId: state.playlistTrackIds[currentIndex + 1],
            currentTimeSeconds: 0,
            playbackState: "playing",
          };
        } else if (state.playlistTrackIds.length > 0) {
          // Wrapped or finished
          return {
            ...state,
            currentTrackId: state.playlistTrackIds[0],
            currentTimeSeconds: 0,
            playbackState: "stopped",
          };
        }
        return { ...state, playbackState: "stopped", currentTimeSeconds: 0 };
      }

      return { ...state, currentTimeSeconds: nextTime };
    }

    case "SET_VOLUME":
      return {
        ...state,
        volume: Math.max(0, Math.min(1, action.volume)),
        isMuted: action.volume === 0 ? true : state.isMuted,
      };

    case "TOGGLE_MUTE":
      return {
        ...state,
        isMuted: !state.isMuted,
      };

    case "TOGGLE_SHUFFLE":
      return {
        ...state,
        isShuffle: !state.isShuffle,
      };

    case "TOGGLE_REPEAT":
      return {
        ...state,
        isRepeat: !state.isRepeat,
      };

    case "TOGGLE_FAVORITE": {
      return {
        ...state,
        tracks: state.tracks.map((track) =>
          track.id === action.trackId ? { ...track, isFavorite: !track.isFavorite } : track
        ),
      };
    }

    case "ADD_TO_PLAYLIST": {
      if (state.playlistTrackIds.includes(action.trackId)) return state;
      return {
        ...state,
        playlistTrackIds: [...state.playlistTrackIds, action.trackId],
      };
    }

    case "REMOVE_FROM_PLAYLIST": {
      const nextPlaylist = state.playlistTrackIds.filter((id) => id !== action.trackId);
      let nextCurrentTrackId = state.currentTrackId;
      let nextPlayback = state.playbackState;

      if (state.currentTrackId === action.trackId) {
        if (nextPlaylist.length > 0) {
          nextCurrentTrackId = nextPlaylist[0];
          nextPlayback = "stopped";
        } else {
          nextPlayback = "stopped";
        }
      }

      return {
        ...state,
        playlistTrackIds: nextPlaylist,
        currentTrackId: nextCurrentTrackId,
        playbackState: nextPlayback,
        currentTimeSeconds: 0,
      };
    }

    case "SET_VISUALIZER_MODE":
      return {
        ...state,
        visualizerMode: action.mode,
      };

    default:
      return state;
  }
}
