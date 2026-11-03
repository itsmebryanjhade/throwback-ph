import type { NokiaAction, NokiaState, SmsMessage } from "./types";
import { INITIAL_NOKIA_STATE } from "./data";

export function nokiaReducer(state: NokiaState, action: NokiaAction): NokiaState {
  switch (action.type) {
    case "SET_VIEW": {
      return {
        ...state,
        activeView: action.view,
        selectedMessageId: action.view === "detail" ? state.selectedMessageId : null,
      };
    }

    case "SELECT_MESSAGE": {
      const updatedMessages = state.messages.map((msg) =>
        msg.id === action.messageId ? { ...msg, isRead: true } : msg
      );
      return {
        ...state,
        activeView: "detail",
        selectedMessageId: action.messageId,
        messages: updatedMessages,
      };
    }

    case "CLEAR_SELECTED_MESSAGE": {
      return {
        ...state,
        activeView: "inbox",
        selectedMessageId: null,
      };
    }

    case "PREPARE_COMPOSE": {
      return {
        ...state,
        activeView: "compose",
        composeRecipient: action.recipient ?? "",
        composeBody: action.initialBody ?? "",
        composeReplyToId: action.replyToId ?? null,
      };
    }

    case "SET_COMPOSE_RECIPIENT": {
      return {
        ...state,
        composeRecipient: action.recipient,
      };
    }

    case "SET_COMPOSE_BODY": {
      return {
        ...state,
        composeBody: action.body,
      };
    }

    case "APPEND_COMPOSE_TEXT": {
      return {
        ...state,
        composeBody: state.composeBody + action.text,
      };
    }

    case "BACKSPACE_COMPOSE": {
      return {
        ...state,
        composeBody: state.composeBody.slice(0, -1),
      };
    }

    case "CYCLE_KEYPAD_MODE": {
      const nextMode =
        state.keypadMode === "abc" ? "ABC" : state.keypadMode === "ABC" ? "123" : "abc";
      return {
        ...state,
        keypadMode: nextMode,
      };
    }

    case "SEND_MESSAGE": {
      const recipient = state.composeRecipient.trim() || "Unknown";
      const body = state.composeBody.trim();
      if (!body) return state;

      // Deduct load if available
      if (state.prepaid.balance < state.prepaid.costPerSms) {
        return state; // Insufficient load
      }

      const newMsg: SmsMessage = {
        id: `sent-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        sender: "Me",
        recipient,
        timestamp: "Just now",
        preview: body.length > 25 ? body.slice(0, 25) + "…" : body,
        body,
        folder: "sent",
        isRead: true,
        category: "personal",
      };

      return {
        ...state,
        activeView: "sent",
        messages: [newMsg, ...state.messages],
        composeRecipient: "",
        composeBody: "",
        composeReplyToId: null,
        prepaid: {
          ...state.prepaid,
          balance: Math.max(0, state.prepaid.balance - state.prepaid.costPerSms),
        },
      };
    }

    case "SAVE_DRAFT": {
      const body = state.composeBody.trim();
      if (!body) return state;

      const recipient = state.composeRecipient.trim() || "Unaddressed";
      const draftMsg: SmsMessage = {
        id: `draft-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        sender: "Me",
        recipient,
        timestamp: "Saved Draft",
        preview: body.length > 25 ? body.slice(0, 25) + "…" : body,
        body,
        folder: "drafts",
        isRead: true,
        category: "personal",
      };

      return {
        ...state,
        activeView: "drafts",
        messages: [draftMsg, ...state.messages],
        composeRecipient: "",
        composeBody: "",
        composeReplyToId: null,
      };
    }

    case "DELETE_MESSAGE": {
      const updatedMessages = state.messages.filter((msg) => msg.id !== action.messageId);
      const isSelected = state.selectedMessageId === action.messageId;
      return {
        ...state,
        messages: updatedMessages,
        selectedMessageId: isSelected ? null : state.selectedMessageId,
        activeView: isSelected ? "inbox" : state.activeView,
      };
    }

    case "MARK_ALL_READ": {
      return {
        ...state,
        messages: state.messages.map((msg) => ({ ...msg, isRead: true })),
      };
    }

    case "SET_PHONE_PROFILE": {
      return {
        ...state,
        phoneProfile: action.profile,
      };
    }

    case "SET_RINGTONE": {
      return {
        ...state,
        selectedRingtoneId: action.ringtoneId,
      };
    }

    case "RELOAD_PREPAID": {
      return {
        ...state,
        prepaid: {
          ...state.prepaid,
          balance: state.prepaid.balance + action.amount,
        },
      };
    }

    case "SET_EDSA_STEP": {
      return {
        ...state,
        edsaStepIndex: action.stepIndex,
      };
    }

    case "INJECT_EDSA_BROADCAST": {
      const edsaMsgId = "msg-edsa-alert-live";
      const existing = state.messages.find((m) => m.id === edsaMsgId);
      if (existing) {
        return {
          ...state,
          activeView: "inbox",
          selectedMessageId: edsaMsgId,
        };
      }

      const injected: SmsMessage = {
        id: edsaMsgId,
        sender: "Forwarded Broadcast",
        senderNumber: "URGENT",
        recipient: "Me",
        timestamp: "Jan 16, 2001 · 8:15 PM",
        preview: "Go 2 EDSA Wear blk…",
        body: "Go 2 EDSA Wear blk.",
        folder: "inbox",
        isRead: false,
        category: "edsa",
        isHistorical: true,
        historicalAttribution:
          "Widely Reported SMS Wording — Widely cited as part of the SMS mobilization during EDSA II on January 16, 2001. Punctuation and spacing vary across published accounts.",
        reconstructedContext:
          "Later forwarded variants appended instructions such as “Forward to all contacts,” “Verify the news,” and peer safety advice.",
      };

      return {
        ...state,
        activeView: "inbox",
        selectedMessageId: edsaMsgId,
        messages: [injected, ...state.messages],
      };
    }

    default:
      return state;
  }
}

export { INITIAL_NOKIA_STATE };
