import { describe, expect, it } from "vitest";
import { chatArchivesReducer } from "@/lib/apps/chatarchives/reducer";
import { INITIAL_CHAT_ARCHIVES_STATE } from "@/lib/apps/chatarchives/data";

describe("Chat Archives State Reducer", () => {
  it("initializes with default Yahoo Messenger mode and active contact", () => {
    const state = INITIAL_CHAT_ARCHIVES_STATE;
    expect(state.serviceMode).toBe("yahoo");
    expect(state.activeTab).toBe("chat");
    expect(state.myNick).toBe("miguel_08");
    expect(state.contacts.length).toBeGreaterThanOrEqual(4);
    expect(state.activeContactId).toBe("contact-angel");
  });

  it("uses fictional chat handles instead of the project owner's personal handle", () => {
    expect(INITIAL_CHAT_ARCHIVES_STATE.myNick).toBe("miguel_08");
  });

  it("handles switching service mode between Yahoo Messenger and mIRC", () => {
    let state = chatArchivesReducer(INITIAL_CHAT_ARCHIVES_STATE, {
      type: "SET_SERVICE_MODE",
      mode: "mirc",
    });
    expect(state.serviceMode).toBe("mirc");

    state = chatArchivesReducer(state, {
      type: "SET_SERVICE_MODE",
      mode: "yahoo",
    });
    expect(state.serviceMode).toBe("yahoo");
  });

  it("handles switching tabs", () => {
    const state = chatArchivesReducer(INITIAL_CHAT_ARCHIVES_STATE, {
      type: "SET_TAB",
      tab: "transcripts",
    });
    expect(state.activeTab).toBe("transcripts");
  });

  it("updates presence status and custom status message", () => {
    let state = chatArchivesReducer(INITIAL_CHAT_ARCHIVES_STATE, {
      type: "SET_PRESENCE",
      status: "busy",
      customStatus: "Doing school project",
    });
    expect(state.myPresence).toBe("busy");
    expect(state.myCustomStatus).toBe("Doing school project");

    state = chatArchivesReducer(state, {
      type: "SET_CUSTOM_STATUS",
      customStatus: "BRB merienda",
    });
    expect(state.myCustomStatus).toBe("BRB merienda");
  });

  it("selects active contact and active channel", () => {
    let state = chatArchivesReducer(INITIAL_CHAT_ARCHIVES_STATE, {
      type: "SELECT_CONTACT",
      contactId: "contact-skater",
    });
    expect(state.activeContactId).toBe("contact-skater");

    state = chatArchivesReducer(state, {
      type: "SELECT_CHANNEL",
      channelId: "chan-opm",
    });
    expect(state.activeChannelId).toBe("chan-opm");
  });

  it("sends a message in Yahoo Messenger thread", () => {
    const state = chatArchivesReducer(INITIAL_CHAT_ARCHIVES_STATE, {
      type: "SEND_YAHOO_MESSAGE",
      contactId: "contact-angel",
      text: "Comp shop tayo mamaya!",
    });
    const msgs = state.yahooMessages["contact-angel"];
    expect(msgs[msgs.length - 1].text).toBe("Comp shop tayo mamaya!");
    expect(msgs[msgs.length - 1].isMe).toBe(true);
  });

  it("sends regular and /me action messages in mIRC channel", () => {
    let state = chatArchivesReducer(INITIAL_CHAT_ARCHIVES_STATE, {
      type: "SEND_MIRC_MESSAGE",
      channelId: "chan-tambayan",
      text: "hello sa lahat ng taga-Manila!",
    });
    let msgs = state.mircMessages["chan-tambayan"];
    expect(msgs[msgs.length - 1].text).toBe("hello sa lahat ng taga-Manila!");
    expect(msgs[msgs.length - 1].sender).toBe("miguel_ph");

    // Action /me
    state = chatArchivesReducer(state, {
      type: "SEND_MIRC_MESSAGE",
      channelId: "chan-tambayan",
      text: "/me waves to everyone",
    });
    msgs = state.mircMessages["chan-tambayan"];
    expect(msgs[msgs.length - 1].text).toBe("miguel_ph waves to everyone");
    expect(msgs[msgs.length - 1].sender).toBe("*");
  });

  it("triggers and clears BUZZ! interaction", () => {
    let state = chatArchivesReducer(INITIAL_CHAT_ARCHIVES_STATE, {
      type: "TRIGGER_BUZZ",
      contactId: "contact-angel",
    });
    expect(state.isBuzzing).toBe(true);
    const msgs = state.yahooMessages["contact-angel"];
    expect(msgs[msgs.length - 1].isBuzz).toBe(true);
    expect(msgs[msgs.length - 1].text).toContain("BUZZ!");

    state = chatArchivesReducer(state, { type: "CLEAR_BUZZ" });
    expect(state.isBuzzing).toBe(false);
  });

  it("toggles emoticon picker and selects curated transcripts", () => {
    let state = chatArchivesReducer(INITIAL_CHAT_ARCHIVES_STATE, {
      type: "TOGGLE_EMOTICON_PICKER",
    });
    expect(state.emoticonPickerOpen).toBe(true);

    state = chatArchivesReducer(state, {
      type: "SELECT_TRANSCRIPT",
      transcriptId: "transcript-ofw",
    });
    expect(state.selectedTranscriptId).toBe("transcript-ofw");
  });
});
