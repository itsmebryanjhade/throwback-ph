import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import React from "react";
import { DesktopShell } from "@/components/desktop/DesktopShell";
import { initialMuseumState } from "@/lib/museum-state";

describe("Phase 4 — Nokia Messages Flagship Application", () => {
  it("presents the functional phone as a textured exhibit in standard and maximized layouts", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /Open Nokia Messages/i }));
    const windowDialog = screen.getByRole("dialog", { name: "Nokia Messages" });
    expect(within(windowDialog).getByTestId("nokia-handset-exhibit")).toBeInTheDocument();
    expect(within(windowDialog).getByTestId("app-shell-nokia-messages")).toHaveAttribute("data-layout-mode", "standard");
    fireEvent.click(within(windowDialog).getByRole("button", { name: "Maximize Nokia Messages" }));
    expect(within(windowDialog).getByTestId("app-shell-nokia-messages")).toHaveAttribute("data-layout-mode", "maximized");
  });

  it("opens Nokia Messages from desktop, renders phone bezel, and shows prepaid load balance", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    // Open Nokia Messages from desktop icon
    fireEvent.click(screen.getByRole("button", { name: /Open Nokia Messages/i }));

    const windowDialog = screen.getByRole("dialog", { name: "Nokia Messages" });
    expect(windowDialog).toBeInTheDocument();

    // Check phone model badge and prepaid balance
    expect(within(windowDialog).getByText(/Retro SMS Handset · 3310 Series/i)).toBeInTheDocument();
    expect(within(windowDialog).getByText(/Load: ₱35.00/i)).toBeInTheDocument();

    // Verify taskbar button
    expect(screen.getByRole("button", { name: "Nokia Messages" })).toBeInTheDocument();
  });

  it("browses inbox, opens an unread message to read details, and marks it as read", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Open Nokia Messages/i }));
    const windowDialog = screen.getByRole("dialog", { name: "Nokia Messages" });

    // Initial inbox has unread GM from Nanay
    expect(within(windowDialog).getByText("Nanay")).toBeInTheDocument();
    expect(within(windowDialog).getByText(/Gud morning! Smile ka today/i)).toBeInTheDocument();

    // Open message
    fireEvent.click(
      within(windowDialog).getByRole("button", {
        name: /Open message from Nanay/i,
      })
    );

    // Detail view is open
    expect(within(windowDialog).getByText(/From: Nanay/i)).toBeInTheDocument();
    expect(within(windowDialog).getAllByText(/GM lang, no reply needed :\)/i)[0]).toBeInTheDocument();

    // Return to list
    const backBtn = within(windowDialog).getByRole("button", { name: /Back to messages list/i });
    fireEvent.click(backBtn);

    // Nanay should still be listed
    expect(within(windowDialog).getByText("Nanay")).toBeInTheDocument();
  });

  it("composes an SMS using preset quick reply, deducts prepaid load, and triggers toast notification", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Open Nokia Messages/i }));
    const windowDialog = screen.getByRole("dialog", { name: "Nokia Messages" });

    // Navigate to Write tab
    const writeTab = within(windowDialog).getByRole("tab", { name: /Write/i });
    fireEvent.click(writeTab);

    // Fill in recipient
    const recipientInput = within(windowDialog).getByLabelText(/To \/ Recipient/i);
    fireEvent.change(recipientInput, { target: { value: "Kiko Reyes" } });

    // Click preset quick reply
    const presetBtn = within(windowDialog).getByRole("button", {
      name: /\+ “Wer u na\? D2 na me\.”/i,
    });
    fireEvent.click(presetBtn);

    // Verify textarea populated
    const bodyTextarea = within(windowDialog).getByLabelText(/Message Body/i);
    expect(bodyTextarea).toHaveValue("Wer u na? D2 na me.");

    // Send SMS
    const sendBtn = within(windowDialog).getByRole("button", {
      name: /Send SMS to Kiko Reyes/i,
    });
    fireEvent.click(sendBtn);

    // Sent tab opens with the new message
    expect(within(windowDialog).getByText(/Sent Messages/i)).toBeInTheDocument();
    expect(within(windowDialog).getAllByText(/To: Kiko Reyes/i)[0]).toBeInTheDocument();

    // Balance deducted from ₱35 to ₱34
    expect(within(windowDialog).getByText(/Load: ₱34.00/i)).toBeInTheDocument();

    // OS Toast Notification triggered
    expect(screen.getAllByText("SMS Sent")[0]).toBeInTheDocument();
  });

  it("supports simplified multi-tap text entry via tactile keypad", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Open Nokia Messages/i }));
    const windowDialog = screen.getByRole("dialog", { name: "Nokia Messages" });

    // Navigate to Write tab
    fireEvent.click(within(windowDialog).getByRole("tab", { name: /Write/i }));

    // Press Key 8 (T) and Key 2 (A)
    const key8 = within(windowDialog).getByRole("button", { name: /Key 8 T U V/i });
    const key2 = within(windowDialog).getByRole("button", { name: /Key 2 A B C/i });

    fireEvent.click(key8);
    fireEvent.click(key2);

    const bodyTextarea = within(windowDialog).getByLabelText(/Message Body/i);
    expect((bodyTextarea as HTMLTextAreaElement).value.length).toBeGreaterThan(0);
  });

  it("saves a draft text and deletes an existing message", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Open Nokia Messages/i }));
    const windowDialog = screen.getByRole("dialog", { name: "Nokia Messages" });

    // Navigate to Write tab
    fireEvent.click(within(windowDialog).getByRole("tab", { name: /Write/i }));

    const bodyTextarea = within(windowDialog).getByLabelText(/Message Body/i);
    fireEvent.change(bodyTextarea, { target: { value: "Draft message to save for later." } });

    // Save as draft
    const draftBtn = within(windowDialog).getByRole("button", {
      name: /Save current text as draft/i,
    });
    fireEvent.click(draftBtn);

    // Redirects to Drafts folder
    expect(within(windowDialog).getByText("Drafts (2)")).toBeInTheDocument();
    expect(screen.getAllByText("Draft Saved")[0]).toBeInTheDocument();

    // Open existing draft
    const draftItem = within(windowDialog).getByRole("button", {
      name: /Open message from To: Bea Gonzales/i,
    });
    fireEvent.click(draftItem);

    // Delete message
    const deleteBtn = within(windowDialog).getByRole("button", { name: "Delete message" });
    fireEvent.click(deleteBtn);

    expect(screen.getAllByText("Message Deleted")[0]).toBeInTheDocument();
  });

  it("manages phone profiles, ringtones, and prepaid scratch cards", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Open Nokia Messages/i }));
    const windowDialog = screen.getByRole("dialog", { name: "Nokia Messages" });

    // Navigate to Profiles & Load tab
    const settingsTab = within(windowDialog).getByRole("tab", { name: /Profiles & Load/i });
    fireEvent.click(settingsTab);

    // Switch to Silent Profile
    const silentBtn = within(windowDialog).getByRole("button", {
      name: /Silent \(Vibrate Only\)/i,
    });
    fireEvent.click(silentBtn);

    expect(screen.getAllByText("Profile Updated")[0]).toBeInTheDocument();

    // Select Pinoy Rock Riff ringtone
    const selectToneBtn = within(windowDialog).getByRole("button", {
      name: /Select Pinoy Rock Riff as active ringtone/i,
    });
    fireEvent.click(selectToneBtn);

    expect(screen.getAllByText("Ringtone Selected")[0]).toBeInTheDocument();

    // Top up ₱30 scratch card
    const reloadBtn = within(windowDialog).getByRole("button", {
      name: /Top up 30 pesos load/i,
    });
    fireEvent.click(reloadBtn);

    expect(screen.getAllByText("Prepaid Load Added")[0]).toBeInTheDocument();
    expect(within(windowDialog).getByText(/Load: ₱65.00/i)).toBeInTheDocument();
  });

  it("explores the EDSA II historical SMS sequence and broadcasts urgent text to inbox", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Open Nokia Messages/i }));
    const windowDialog = screen.getByRole("dialog", { name: "Nokia Messages" });

    // Navigate to EDSA II tab
    const edsaTab = within(windowDialog).getByRole("tab", { name: /EDSA II/i });
    fireEvent.click(edsaTab);

    // Step 1: Senate trial walkout with Reconstructed educational context label
    expect(within(windowDialog).getByText(/The World’s First “Coup de Text”/i)).toBeInTheDocument();
    expect(within(windowDialog).getByText(/Step 1 of 4/i)).toBeInTheDocument();
    expect(within(windowDialog).getByText("Reconstructed educational context")).toBeInTheDocument();

    // Step to Step 2: The direct quote
    const nextBtn = within(windowDialog).getByRole("button", { name: "Next timeline step" });
    fireEvent.click(nextBtn);

    expect(within(windowDialog).getByText(/Step 2 of 4/i)).toBeInTheDocument();
    expect(within(windowDialog).getByText("★ Widely Reported SMS Wording")).toBeInTheDocument();
    expect(within(windowDialog).getAllByText(/Go 2 EDSA Wear blk/i)[0]).toBeInTheDocument();

    // Broadcast urgent text into phone inbox
    const broadcastBtn = within(windowDialog).getByRole("button", {
      name: /Receive Historical Broadcast in Phone Inbox/i,
    });
    fireEvent.click(broadcastBtn);

    // Toast triggered and forwarded to inbox
    expect(screen.getAllByText("Urgent SMS Broadcast")[0]).toBeInTheDocument();

    // Verify inbox message detail shows Widely Reported SMS Wording and separate Reconstructed context
    const inboxTab = within(windowDialog).getByRole("tab", { name: /Inbox/i });
    fireEvent.click(inboxTab);

    const edsaMsgItem = within(windowDialog).getAllByRole("button", {
      name: /Open message from Forwarded Broadcast/i,
    })[0];
    fireEvent.click(edsaMsgItem);

    expect(within(windowDialog).getByText("Widely Reported SMS Wording:")).toBeInTheDocument();
    expect(within(windowDialog).getByText("Reconstructed educational context:")).toBeInTheDocument();
  });

  it("displays integrated Museum Info with historical interpretation and source citations", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Open Nokia Messages/i }));
    const windowDialog = screen.getByRole("dialog", { name: "Nokia Messages" });

    // Navigate to Museum Info tab
    const infoTab = within(windowDialog).getByRole("tab", { name: /Museum Info/i });
    fireEvent.click(infoTab);

    // Check curatorial details
    expect(within(windowDialog).getByText("Nokia & SMS Culture in the Philippines")).toBeInTheDocument();
    expect(within(windowDialog).getByText("2000–2010")).toBeInTheDocument();
    expect(within(windowDialog).getByText(/internationally recognized texting hub/i)).toBeInTheDocument();
    expect(within(windowDialog).getByText(/Educational Reconstruction Notice:/i)).toBeInTheDocument();

    // Check citations
    const ituLink = within(windowDialog).getByRole("link", {
      name: /Digital development dashboard: Philippines/i,
    });
    expect(ituLink).toHaveAttribute(
      "href",
      "https://www.itu.int/en/ITU-D/Statistics/Dashboards/Pages/Digital-Development.aspx"
    );

    const edsaLink = within(windowDialog).getByRole("link", {
      name: /People Power II and the role of mobile communication/i,
    });
    expect(edsaLink).toHaveAttribute(
      "href",
      "https://www.britannica.com/place/Philippines/The-downfall-of-Estrada-and-arroyo-of-Macapagal-Arroyo"
    );

    const cidobLink = within(windowDialog).getByRole("link", {
      name: /The Text-messaging Revolutions/i,
    });
    expect(cidobLink).toHaveAttribute(
      "href",
      "https://www.cidob.org/publicaciones/text-messaging-revolutions"
    );
  });

  it("supports keyboard tab navigation and responsive layout resizing", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Open Nokia Messages/i }));
    const windowDialog = screen.getByRole("dialog", { name: "Nokia Messages" });

    // Check tab accessibility
    const tabs = within(windowDialog).getAllByRole("tab");
    expect(tabs.length).toBe(8);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");

    // Switching tab via keyboard activation
    fireEvent.click(tabs[4]); // Contacts tab
    expect(tabs[4]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveAttribute("aria-selected", "false");

    // Maximize window
    const maxBtn = within(windowDialog).getByRole("button", { name: "Maximize Nokia Messages" });
    fireEvent.click(maxBtn);

    expect(within(windowDialog).getByRole("button", { name: "Restore Nokia Messages" })).toBeInTheDocument();
  });
});
