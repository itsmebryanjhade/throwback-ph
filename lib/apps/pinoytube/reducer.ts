import type {
  PinoyTubeAction,
  PinoyTubeComment,
  PinoyTubeState,
  PinoyTubeVideo,
} from "./types";
import { CATEGORY_LABELS, INITIAL_PINOYTUBE_STATE } from "./data";

export function pinoyTubeReducer(
  state: PinoyTubeState,
  action: PinoyTubeAction,
): PinoyTubeState {
  switch (action.type) {
    case "SET_TAB": {
      return {
        ...state,
        activeTab: action.tab,
      };
    }

    case "SELECT_VIDEO": {
      const targetVideo = state.videos.find((v) => v.id === action.videoId);
      if (!targetVideo) return state;

      return {
        ...state,
        selectedVideoId: action.videoId,
        activeTab: "watch",
        currentTimeSeconds: 0,
        playbackState: "playing",
        isBuffering: false,
        bufferPercentage: 45,
        // Increment view count slightly to simulate active audience
        videos: state.videos.map((v) =>
          v.id === action.videoId ? { ...v, views: v.views + 1 } : v,
        ),
      };
    }

    case "PLAY_VIDEO": {
      return {
        ...state,
        playbackState: "playing",
      };
    }

    case "PAUSE_VIDEO": {
      return {
        ...state,
        playbackState: "paused",
      };
    }

    case "TOGGLE_PLAYBACK": {
      return {
        ...state,
        playbackState: state.playbackState === "playing" ? "paused" : "playing",
      };
    }

    case "SEEK_TIME": {
      const current = state.videos.find((v) => v.id === state.selectedVideoId);
      const maxDuration = current ? current.durationSeconds : 180;
      const clamped = Math.max(0, Math.min(action.seconds, maxDuration));
      return {
        ...state,
        currentTimeSeconds: clamped,
      };
    }

    case "TICK_PLAYBACK": {
      if (state.playbackState !== "playing" || state.isBuffering) return state;

      const current = state.videos.find((v) => v.id === state.selectedVideoId);
      const maxDuration = current ? current.durationSeconds : 180;

      if (state.currentTimeSeconds >= maxDuration) {
        return {
          ...state,
          currentTimeSeconds: 0,
          playbackState: "paused",
        };
      }

      // Progress buffer percentage gradually up to 100%
      const newBuffer = Math.min(100, state.bufferPercentage + 2);

      return {
        ...state,
        currentTimeSeconds: state.currentTimeSeconds + 1,
        bufferPercentage: newBuffer,
      };
    }

    case "SET_BUFFERING": {
      return {
        ...state,
        isBuffering: action.isBuffering,
        bufferPercentage:
          action.bufferPercentage !== undefined
            ? action.bufferPercentage
            : state.bufferPercentage,
      };
    }

    case "SET_RESOLUTION": {
      return {
        ...state,
        selectedResolution: action.resolution,
        // Briefly simulate buffering when changing resolution like 2000s web players
        isBuffering: true,
        bufferPercentage: 20,
      };
    }

    case "SET_VOLUME": {
      return {
        ...state,
        volume: Math.max(0, Math.min(100, action.volume)),
        isMuted: action.volume === 0 ? true : state.isMuted,
      };
    }

    case "TOGGLE_MUTE": {
      return {
        ...state,
        isMuted: !state.isMuted,
      };
    }

    case "RATE_VIDEO": {
      const target = state.videos.find((v) => v.id === action.videoId);
      if (!target) return state;

      const newRating = Math.max(1, Math.min(5, action.rating));
      const hasPriorRating = target.userRating > 0;

      let updatedCount = target.ratingCount;
      let updatedAverage = target.starRating;

      if (hasPriorRating) {
        // Adjust existing average
        const totalScore =
          target.starRating * target.ratingCount - target.userRating + newRating;
        updatedAverage = Math.round((totalScore / target.ratingCount) * 10) / 10;
      } else {
        // First time rating
        updatedCount = target.ratingCount + 1;
        const totalScore = target.starRating * target.ratingCount + newRating;
        updatedAverage = Math.round((totalScore / updatedCount) * 10) / 10;
      }

      return {
        ...state,
        videos: state.videos.map((v) =>
          v.id === action.videoId
            ? {
                ...v,
                userRating: newRating,
                starRating: updatedAverage,
                ratingCount: updatedCount,
              }
            : v,
        ),
      };
    }

    case "TOGGLE_FAVORITE": {
      return {
        ...state,
        videos: state.videos.map((v) =>
          v.id === action.videoId ? { ...v, isFavorite: !v.isFavorite } : v,
        ),
      };
    }

    case "ADD_COMMENT": {
      const trimmed = action.text.trim();
      if (!trimmed) return state;

      const newComment: PinoyTubeComment = {
        id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        author: action.author || "@MuseumVisitor_PH",
        avatarIcon: "🇵🇭",
        text: trimmed,
        timestamp: "Just now",
        rating: action.rating,
      };

      const existingComments = state.comments[action.videoId] || [];

      return {
        ...state,
        comments: {
          ...state.comments,
          [action.videoId]: [newComment, ...existingComments],
        },
      };
    }

    case "UPLOAD_VIDEO": {
      const newId = `vid-user-${Date.now()}`;
      const durationSecs = action.durationSeconds || 120;
      const minutes = Math.floor(durationSecs / 60);
      const seconds = durationSecs % 60;
      const formatted = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

      const newVideo: PinoyTubeVideo = {
        id: newId,
        title: action.title.trim() || "My New PinoyTube Video",
        author: "@MuseumVisitor_PH",
        channelName: "Museum Creator Studio",
        category: action.category,
        categoryLabel: CATEGORY_LABELS[action.category],
        durationSeconds: durationSecs,
        durationFormatted: formatted,
        uploadDate: "Just now",
        views: 1,
        starRating: 5.0,
        ratingCount: 1,
        userRating: 5,
        isFavorite: true,
        resolution: "240p",
        description: action.description.trim() || "Uploaded to PinoyTube.",
        tags: action.tags.length > 0 ? action.tags : ["pinoytube", "grassroots"],
        visualTheme: "custom",
      };

      return {
        ...state,
        videos: [newVideo, ...state.videos],
        selectedVideoId: newId,
        activeTab: "watch",
        currentTimeSeconds: 0,
        playbackState: "playing",
        bufferPercentage: 100,
        isBuffering: false,
        comments: {
          ...state.comments,
          [newId]: [
            {
              id: `c-init-${newId}`,
              author: "@PinoyTube_Bot",
              avatarIcon: "🤖",
              text: "Video metadata recorded in local educational simulation (no real video is uploaded or converted to FLV).",
              timestamp: "Just now",
              rating: 5,
            },
          ],
        },
      };
    }

    case "SET_FILTER_CATEGORY": {
      return {
        ...state,
        filterCategory: action.category,
      };
    }

    case "RESET_STATE": {
      return INITIAL_PINOYTUBE_STATE;
    }

    default:
      return state;
  }
}
