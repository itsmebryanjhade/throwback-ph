import React from "react";
import { describe, expect, it, vi } from "vitest";
import { act, render, screen, fireEvent, within } from "@testing-library/react";
import { WindowManagerProvider } from "@/lib/window-system/WindowContext";
import { NotificationProvider } from "@/lib/notification-system/NotificationContext";
import { allAppRegistrations } from "@/lib/apps/catalog";
import { ChatArchivesApp } from "@/components/apps/chatarchives/ChatArchivesApp";
import { YAHOO_CONTACTS } from "@/lib/apps/chatarchives/data";
import { DesktopShell } from "@/components/desktop/DesktopShell";
import { initialMuseumState } from "@/lib/museum-state";

function renderWithProviders() {
  return render(
    <WindowManagerProvider registrations={allAppRegistrations}>
      <NotificationProvider>
        <ChatArchivesApp />
      </NotificationProvider>
    </WindowManagerProvider>,
  );
}

describe("Phase 8 — Chat Archives Application", () => {
  it("uses labeled fictional contact portraits and a maximized multi-pane composition", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /Open Chat Archives/i }));
    const windowDialog = screen.getByRole("dialog", { name: /Chat Archives/i });
    expect(
      within(windowDialog).getByRole("img", { name: /Angelica fictional chat portrait/i }).getAttribute("src"),
    ).toContain("friendster-janine.jpg");
    expect(within(windowDialog).getByTestId("app-shell-chat-archives")).toHaveAttribute("data-layout-mode", "standard");
    fireEvent.click(within(windowDialog).getByRole("button", { name: /Maximize .*Chat Archives/i }));
    expect(within(windowDialog).getByTestId("app-shell-chat-archives")).toHaveAttribute("data-layout-mode", "maximized");
  });

  it("uses distinct contact photos centered without an artificial zoom", () => {
    expect(new Set(YAHOO_CONTACTS.map((contact) => contact.portraitSrc)).size).toBe(YAHOO_CONTACTS.length);
    renderWithProviders();
    expect(screen.getByRole("img", { name: /Angelica fictional contact portrait/i })).toHaveStyle({
      objectFit: "cover",
      objectPosition: "center",
    });
  });

  it("renders Chat Archives with Yahoo Messenger client, contact list, and active chat", () => {
    renderWithProviders();

    expect(screen.getByTestId("app-shell-chat-archives")).toBeInTheDocument();
    expect(screen.getByTestId("yahoo-messenger-view")).toBeInTheDocument();
    expect(screen.getByText(/Chat Archives: Instant Messaging Portal/i)).toBeInTheDocument();
    expect(screen.getByText(/Barkada Contacts/i)).toBeInTheDocument();
    expect(screen.getByText("xX_angel_Xx")).toBeInTheDocument();
    expect(screen.getByText(/send mo testimonial ko sa Friendster ha!/i)).toBeInTheDocument();
  });

  it("sends custom and preset messages in Yahoo Messenger", () => {
    renderWithProviders();

    const input = screen.getByLabelText(/Type a message/i);
    fireEvent.change(input, { target: { value: "Kita tayo sa comp shop!" } });

    const sendBtn = screen.getByRole("button", { name: "Send" });
    fireEvent.click(sendBtn);

    expect(screen.getByText("Kita tayo sa comp shop!")).toBeInTheDocument();

    // Preset message
    const presetSelect = screen.getByLabelText(/Quick Presets/i);
    fireEvent.change(presetSelect, {
      target: { value: "BUZZ! Sagot ka naman!" },
    });
    fireEvent.click(sendBtn);

    expect(screen.getAllByText(/BUZZ! Sagot ka naman!/i).length).toBeGreaterThanOrEqual(1);
  });

  it("triggers BUZZ! interaction and confirms screen shake alert", () => {
    renderWithProviders();

    const buzzBtn = screen.getByRole("button", { name: /⚡ BUZZ!/i });
    fireEvent.click(buzzBtn);

    // BUZZ alert line added
    expect(screen.getByText(/You sent a BUZZ! to xX_angel_Xx/i)).toBeInTheDocument();
  });

  it("updates user presence status and custom status message", () => {
    renderWithProviders();

    const statusSelect = screen.getByLabelText(/Change Yahoo status/i);
    fireEvent.change(statusSelect, { target: { value: "busy" } });
    expect(statusSelect).toHaveValue("busy");

    const customStatusInput = screen.getByLabelText(/Custom status message/i);
    fireEvent.change(customStatusInput, { target: { value: "AFK DOTA tournament" } });
    expect(customStatusInput).toHaveValue("AFK DOTA tournament");
  });

  it("switches contact in Yahoo Messenger", () => {
    renderWithProviders();

    const skaterContact = screen.getByText("manila_skater");
    fireEvent.click(skaterContact);

    expect(screen.getByText(/pre tara comp shop mamaya/i)).toBeInTheDocument();
  });

  it("switches service mode to mIRC, switches channels, and sends IRC messages", () => {
    renderWithProviders();

    const mircBtn = screen.getByRole("button", { name: /🔵 mIRC Client/i });
    fireEvent.click(mircBtn);

    expect(screen.getByTestId("mirc-view")).toBeInTheDocument();
    expect(screen.getByText(/mIRC Channels/i)).toBeInTheDocument();
    const ircChannelsList = screen.getByRole("listbox", { name: "IRC Channels" });
    expect(within(ircChannelsList).getByRole("option", { name: /#pinoytambayan/i })).toBeInTheDocument();
    expect(screen.getByText(/asl\? welcome sa channel/i)).toBeInTheDocument();

    // Switch channel to #opm-garage
    const opmChan = within(ircChannelsList).getByRole("option", { name: /#opm-garage/i });
    fireEvent.click(opmChan);

    expect(screen.getByText(/Mayric's gig sa Friday/i)).toBeInTheDocument();

    // Send IRC message
    const ircInput = screen.getByLabelText(/IRC command input/i);
    fireEvent.change(ircInput, { target: { value: "hello sa mga banda dito!" } });

    const ircSendBtn = screen.getByRole("button", { name: "Send" });
    fireEvent.click(ircSendBtn);

    expect(screen.getByText("hello sa mga banda dito!")).toBeInTheDocument();
  });

  it("browses curated historical transcripts and cultural notes", () => {
    renderWithProviders();

    // Transcripts tab
    const transcriptsTab = screen.getByRole("tab", { name: /📜 Curated Transcripts/i });
    fireEvent.click(transcriptsTab);

    expect(screen.getByText(/The ASL Protocol: Early Internet Introductions/i)).toBeInTheDocument();
    expect(screen.getAllByText(/The BUZZ! Vibration and Barkada Urgency/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Bridging the Ocean: Dial-Up to OFW Families/i)).toBeInTheDocument();

    // Cultural Insights tab
    const insightsTab = screen.getByRole("tab", { name: /💡 Cultural Insights/i });
    fireEvent.click(insightsTab);

    expect(screen.getByText(/The ASL Protocol and Early Internet Anonymity/i)).toBeInTheDocument();
    expect(screen.getByText(/The Physics of Friendship: The Yahoo Messenger BUZZ!/i)).toBeInTheDocument();
    expect(screen.getByText(/Bridging the Diaspora: Dial-Up to the Global Barkada/i)).toBeInTheDocument();
  });

  it("displays Museum Info with educational reconstruction notice and valid citations", () => {
    renderWithProviders();

    const museumTab = screen.getByRole("tab", { name: /🏛️ Museum Info/i });
    fireEvent.click(museumTab);

    expect(screen.getByText(/Instant Presence & Global Barkadas/i)).toBeInTheDocument();
    expect(screen.getByText(/2000–2008 · Globalization Room/i)).toBeInTheDocument();
    expect(screen.getByText(/Educational Reconstruction Notice:/i)).toBeInTheDocument();
    expect(screen.getByText(/Yahoo! Messenger Help and Feature Archive/i)).toBeInTheDocument();
    expect(screen.getByText(/mIRC: An Introduction and History/i)).toBeInTheDocument();
    expect(screen.getByText(/Curatorial Citations & Reference Sources:/i)).toBeInTheDocument();
    expect(screen.queryByText(/primary research/i)).not.toBeInTheDocument();
  });

  it("enforces historical integrity by qualifying unsourced assertions and labeling educational reconstructions", () => {
    renderWithProviders();

    // Check Museum Info text
    const museumTab = screen.getByRole("tab", { name: /🏛️ Museum Info/i });
    fireEvent.click(museumTab);

    // Verify unsourced "millions" claim is softened
    expect(screen.queryByText(/For millions of transnational families/i)).not.toBeInTheDocument();
    expect(screen.getByText(/For many transnational families with Overseas Filipino Workers/i)).toBeInTheDocument();

    // Check Transcripts tab
    const transcriptsTab = screen.getByRole("tab", { name: /📜 Curated Transcripts/i });
    fireEvent.click(transcriptsTab);

    // Select ASL transcript and verify "universal digital handshake" is softened
    const aslTranscript = screen.getByText(/The ASL Protocol: Early Internet Introductions/i);
    fireEvent.click(aslTranscript);
    expect(screen.queryByText(/universal digital handshake/i)).not.toBeInTheDocument();
    expect(screen.getByText(/familiar informal shorthand in text-only chat rooms/i)).toBeInTheDocument();

    // Select OFW transcript and verify softened break-time claims
    const ofwTranscript = screen.getByText(/Bridging the Ocean: Dial-Up to OFW Families/i);
    fireEvent.click(ofwTranscript);
    expect(screen.queryByText(/Families booked computer shop sessions specifically to coincide/i)).not.toBeInTheDocument();
    expect(screen.getByText(/In community recollections, internet café visits were frequently arranged/i)).toBeInTheDocument();
  });

  it("has friends type back, BUZZ you back, and mIRC channels answer", () => {
    vi.useFakeTimers();
    renderWithProviders();

    fireEvent.change(screen.getByLabelText("Type a message"), { target: { value: "uy hello!" } });
    fireEvent.keyDown(screen.getByLabelText("Type a message"), { key: "Enter" });
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(screen.getByText(/xX_angel_Xx is typing…/)).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1300);
    });
    expect(screen.queryByText(/is typing…/)).not.toBeInTheDocument();
    expect(screen.getByText(/nagda-download pa ko ng kanta sa Limewire/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /⚡ BUZZ!/i }));
    act(() => {
      vi.advanceTimersByTime(1700);
    });
    expect(screen.getByText(/xX_angel_Xx sent you a BUZZ! \*\*\* Uy! bakit\?\?/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /🔵 mIRC Client/i }));
    fireEvent.change(screen.getByLabelText("IRC command input"), { target: { value: "hello po" } });
    fireEvent.keyDown(screen.getByLabelText("IRC command input"), { key: "Enter" });
    act(() => {
      vi.advanceTimersByTime(1400);
    });
    expect(screen.getByText("asl? :)")).toBeInTheDocument();
    vi.useRealTimers();
  });
});
