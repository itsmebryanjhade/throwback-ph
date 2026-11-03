import type {
  ChannelId,
  TvTambayanAction,
  TvTambayanState,
} from "./types";
import { INITIAL_TV_TAMBAYAN_STATE } from "./data";

export function tvTambayanReducer(
  state: TvTambayanState,
  action: TvTambayanAction,
): TvTambayanState {
  switch (action.type) {
    case "SET_TAB": {
      return {
        ...state,
        activeTab: action.tab,
      };
    }

    case "CHANGE_CHANNEL": {
      const channel = state.channels.find((c) => c.id === action.channelId);
      if (!channel) return state;

      return {
        ...state,
        currentChannelId: action.channelId,
        selectedProgramId: channel.currentProgramId,
        showOsd: true,
      };
    }

    case "CHANNEL_UP": {
      const idx = state.channels.findIndex((c) => c.id === state.currentChannelId);
      const nextIdx = (idx + 1) % state.channels.length;
      const nextChannel = state.channels[nextIdx];

      return {
        ...state,
        currentChannelId: nextChannel.id,
        selectedProgramId: nextChannel.currentProgramId,
        showOsd: true,
      };
    }

    case "CHANNEL_DOWN": {
      const idx = state.channels.findIndex((c) => c.id === state.currentChannelId);
      const prevIdx = (idx - 1 + state.channels.length) % state.channels.length;
      const prevChannel = state.channels[prevIdx];

      return {
        ...state,
        currentChannelId: prevChannel.id,
        selectedProgramId: prevChannel.currentProgramId,
        showOsd: true,
      };
    }

    case "TOGGLE_POWER": {
      return {
        ...state,
        isPoweredOn: !state.isPoweredOn,
        showOsd: !state.isPoweredOn,
      };
    }

    case "SET_VOLUME": {
      const clamped = Math.max(0, Math.min(100, action.volume));
      return {
        ...state,
        volume: clamped,
        isMuted: clamped === 0 ? true : state.isMuted,
        showOsd: true,
      };
    }

    case "TOGGLE_MUTE": {
      return {
        ...state,
        isMuted: !state.isMuted,
        showOsd: true,
      };
    }

    case "SET_LOCALIZATION_MODE": {
      return {
        ...state,
        localizationMode: action.mode,
        showOsd: true,
      };
    }

    case "TOGGLE_FAVORITE_SHOW": {
      return {
        ...state,
        channels: state.channels.map((ch) => ({
          ...ch,
          programs: ch.programs.map((p) =>
            p.id === action.programId ? { ...p, isFavorite: !p.isFavorite } : p,
          ),
        })),
      };
    }

    case "SELECT_PROGRAM": {
      let targetChannelId: ChannelId = state.currentChannelId;
      for (const ch of state.channels) {
        if (ch.programs.some((p) => p.id === action.programId)) {
          targetChannelId = ch.id;
          break;
        }
      }

      return {
        ...state,
        selectedProgramId: action.programId,
        currentChannelId: targetChannelId,
        activeTab: "tv",
        showOsd: true,
      };
    }

    case "HIDE_OSD": {
      return {
        ...state,
        showOsd: false,
      };
    }

    case "RESET_STATE": {
      return INITIAL_TV_TAMBAYAN_STATE;
    }

    default:
      return state;
  }
}
