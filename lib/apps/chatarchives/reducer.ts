import type {
  ChatArchivesAction,
  ChatArchivesState,
  ChatMessage,
} from "./types";

export function chatArchivesReducer(
  state: ChatArchivesState,
  action: ChatArchivesAction,
): ChatArchivesState {
  switch (action.type) {
    case "SET_TAB": {
      return {
        ...state,
        activeTab: action.tab,
      };
    }

    case "SET_SERVICE_MODE": {
      return {
        ...state,
        serviceMode: action.mode,
      };
    }

    case "SET_PRESENCE": {
      return {
        ...state,
        myPresence: action.status,
        myCustomStatus:
          action.customStatus !== undefined
            ? action.customStatus
            : state.myCustomStatus,
      };
    }

    case "SET_CUSTOM_STATUS": {
      return {
        ...state,
        myCustomStatus: action.customStatus.trim(),
      };
    }

    case "SELECT_CONTACT": {
      return {
        ...state,
        activeContactId: action.contactId,
        contacts: state.contacts.map((c) =>
          c.id === action.contactId ? { ...c, unreadCount: 0 } : c,
        ),
      };
    }

    case "SELECT_CHANNEL": {
      return {
        ...state,
        activeChannelId: action.channelId,
        channels: state.channels.map((ch) =>
          ch.id === action.channelId ? { ...ch, unreadCount: 0 } : ch,
        ),
      };
    }

    case "SEND_YAHOO_MESSAGE": {
      const trimmed = action.text.trim();
      if (!trimmed) return state;

      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? "0" : ""}${minutes} ${hours >= 12 ? "PM" : "AM"}`;

      const newMessage: ChatMessage = {
        id: `ym-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        sender: state.myNick,
        text: trimmed,
        timestamp: formattedTime,
        isMe: true,
      };

      const existingMessages = state.yahooMessages[action.contactId] || [];

      return {
        ...state,
        yahooMessages: {
          ...state.yahooMessages,
          [action.contactId]: [...existingMessages, newMessage],
        },
      };
    }

    case "SEND_MIRC_MESSAGE": {
      const trimmed = action.text.trim();
      if (!trimmed) return state;

      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? "0" : ""}${minutes} ${hours >= 12 ? "PM" : "AM"}`;

      let sender = "miguel_ph";
      let text = trimmed;

      if (trimmed.startsWith("/me ")) {
        sender = "*";
        text = `miguel_ph ${trimmed.slice(4)}`;
      }

      const newMessage: ChatMessage = {
        id: `irc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        sender,
        text,
        timestamp: formattedTime,
        isMe: sender !== "*",
      };

      const existingMessages = state.mircMessages[action.channelId] || [];

      return {
        ...state,
        mircMessages: {
          ...state.mircMessages,
          [action.channelId]: [...existingMessages, newMessage],
        },
      };
    }

    case "TRIGGER_BUZZ": {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? "0" : ""}${minutes} ${hours >= 12 ? "PM" : "AM"}`;

      const buzzMessage: ChatMessage = {
        id: `buzz-${Date.now()}`,
        sender: "System",
        text: `*** You sent a BUZZ! to ${state.contacts.find((c) => c.id === action.contactId)?.username || "contact"}! ***`,
        timestamp: formattedTime,
        isSystem: true,
        isBuzz: true,
      };

      const existingMessages = state.yahooMessages[action.contactId] || [];

      return {
        ...state,
        isBuzzing: true,
        yahooMessages: {
          ...state.yahooMessages,
          [action.contactId]: [...existingMessages, buzzMessage],
        },
      };
    }

    case "CLEAR_BUZZ": {
      return {
        ...state,
        isBuzzing: false,
      };
    }

    case "TOGGLE_EMOTICON_PICKER": {
      return {
        ...state,
        emoticonPickerOpen: !state.emoticonPickerOpen,
      };
    }

    case "SELECT_TRANSCRIPT": {
      return {
        ...state,
        selectedTranscriptId: action.transcriptId,
      };
    }

    default:
      return state;
  }
}
