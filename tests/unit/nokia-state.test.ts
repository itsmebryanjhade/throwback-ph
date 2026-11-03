import { describe, it, expect } from "vitest";
import { nokiaReducer, INITIAL_NOKIA_STATE } from "@/lib/apps/nokia/reducer";

describe("Phase 4 — Nokia Messages State Transitions", () => {
  it("initializes with period inbox messages, contacts, and prepaid load", () => {
    expect(INITIAL_NOKIA_STATE.activeView).toBe("inbox");
    expect(INITIAL_NOKIA_STATE.messages.length).toBeGreaterThan(3);
    expect(INITIAL_NOKIA_STATE.contacts.length).toBe(6);
    expect(INITIAL_NOKIA_STATE.prepaid.balance).toBe(35.0);
    expect(INITIAL_NOKIA_STATE.phoneProfile).toBe("general");
    expect(INITIAL_NOKIA_STATE.selectedRingtoneId).toBe("metro-waltz");
    expect(INITIAL_NOKIA_STATE.keypadMode).toBe("abc");
  });

  it("cycles multi-tap keypad input mode between abc, ABC, and 123", () => {
    let state = nokiaReducer(INITIAL_NOKIA_STATE, { type: "CYCLE_KEYPAD_MODE" });
    expect(state.keypadMode).toBe("ABC");

    state = nokiaReducer(state, { type: "CYCLE_KEYPAD_MODE" });
    expect(state.keypadMode).toBe("123");

    state = nokiaReducer(state, { type: "CYCLE_KEYPAD_MODE" });
    expect(state.keypadMode).toBe("abc");
  });

  it("handles view switching and selecting a message to mark read", () => {
    let state = nokiaReducer(INITIAL_NOKIA_STATE, { type: "SET_VIEW", view: "contacts" });
    expect(state.activeView).toBe("contacts");

    // Select the unread GM message
    const gmMsg = state.messages.find((m) => m.id === "msg-gm");
    expect(gmMsg?.isRead).toBe(false);

    state = nokiaReducer(state, { type: "SELECT_MESSAGE", messageId: "msg-gm" });
    expect(state.activeView).toBe("detail");
    expect(state.selectedMessageId).toBe("msg-gm");

    const readMsg = state.messages.find((m) => m.id === "msg-gm");
    expect(readMsg?.isRead).toBe(true);

    // Clear selection
    state = nokiaReducer(state, { type: "CLEAR_SELECTED_MESSAGE" });
    expect(state.activeView).toBe("inbox");
    expect(state.selectedMessageId).toBeNull();
  });

  it("sends an SMS, deducts 1 peso from prepaid load, and records it in Sent items", () => {
    let state = nokiaReducer(INITIAL_NOKIA_STATE, {
      type: "PREPARE_COMPOSE",
      recipient: "Kiko Reyes",
      initialBody: "Wer u na? D2 na me comp shop.",
    });

    expect(state.activeView).toBe("compose");
    expect(state.composeRecipient).toBe("Kiko Reyes");
    expect(state.composeBody).toBe("Wer u na? D2 na me comp shop.");

    const initialBalance = state.prepaid.balance;

    state = nokiaReducer(state, { type: "SEND_MESSAGE" });
    expect(state.activeView).toBe("sent");
    expect(state.prepaid.balance).toBe(initialBalance - 1.0);

    const sentMessage = state.messages.find(
      (m) => m.folder === "sent" && m.body === "Wer u na? D2 na me comp shop."
    );
    expect(sentMessage).toBeDefined();
    expect(sentMessage?.recipient).toBe("Kiko Reyes");
  });

  it("prevents sending SMS when prepaid load is insufficient", () => {
    // Set balance to 0
    const state = {
      ...INITIAL_NOKIA_STATE,
      prepaid: { ...INITIAL_NOKIA_STATE.prepaid, balance: 0.0 },
      composeRecipient: "Nanay",
      composeBody: "Uwi na ko.",
    };

    const nextState = nokiaReducer(state, { type: "SEND_MESSAGE" });
    // State remains unchanged because balance is 0
    expect(nextState.prepaid.balance).toBe(0.0);
    expect(nextState.activeView).toBe("inbox");
  });

  it("saves drafts and deletes messages", () => {
    let state = nokiaReducer(INITIAL_NOKIA_STATE, {
      type: "PREPARE_COMPOSE",
      recipient: "Bea Gonzales",
      initialBody: "Unfinished draft text...",
    });

    state = nokiaReducer(state, { type: "SAVE_DRAFT" });
    expect(state.activeView).toBe("drafts");

    const draft = state.messages.find(
      (m) => m.folder === "drafts" && m.body === "Unfinished draft text..."
    );
    expect(draft).toBeDefined();

    // Delete the draft
    state = nokiaReducer(state, { type: "DELETE_MESSAGE", messageId: draft!.id });
    expect(state.messages.some((m) => m.id === draft!.id)).toBe(false);
  });

  it("manages phone profiles, ringtones, and prepaid reload cards", () => {
    let state = nokiaReducer(INITIAL_NOKIA_STATE, {
      type: "SET_PHONE_PROFILE",
      profile: "silent",
    });
    expect(state.phoneProfile).toBe("silent");

    state = nokiaReducer(state, {
      type: "SET_RINGTONE",
      ringtoneId: "pinoy-rock-chords",
    });
    expect(state.selectedRingtoneId).toBe("pinoy-rock-chords");

    const balanceBefore = state.prepaid.balance;
    state = nokiaReducer(state, { type: "RELOAD_PREPAID", amount: 50.0 });
    expect(state.prepaid.balance).toBe(balanceBefore + 50.0);
  });

  it("handles the historical EDSA II broadcast injection", () => {
    const state = nokiaReducer(INITIAL_NOKIA_STATE, { type: "INJECT_EDSA_BROADCAST" });
    expect(state.activeView).toBe("inbox");
    expect(state.selectedMessageId).toBe("msg-edsa-alert-live");

    const broadcast = state.messages.find((m) => m.id === "msg-edsa-alert-live");
    expect(broadcast).toBeDefined();
    expect(broadcast?.body).toBe("Go 2 EDSA Wear blk.");
    expect(broadcast?.isHistorical).toBe(true);
    expect(broadcast?.historicalAttribution).toContain("Widely Reported SMS Wording");
    expect(broadcast?.reconstructedContext).toBeDefined();
  });
});
