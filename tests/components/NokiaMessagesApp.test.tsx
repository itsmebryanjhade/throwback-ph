import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import React from "react";
import { DesktopShell } from "@/components/desktop/DesktopShell";
import { initialMuseumState } from "@/lib/museum-state";
import { advanceSnake, SNAKE_COLS } from "@/components/apps/nokia/SnakeGame";

function openPhone() {
  render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);
  fireEvent.click(screen.getByRole("button", { name: /Open Nokia Messages/i }));
  const win = screen.getByRole("dialog", { name: "Nokia Messages" });
  const lcd = within(win).getByTestId("nokia-lcd");
  const press = (name: string | RegExp) => fireEvent.click(within(win).getByRole("button", { name }));
  return { win, lcd, press };
}

describe("Nokia Messages — playable phone", () => {
  it("presents the phone as the exhibit in standard and maximized layouts", () => {
    const { win } = openPhone();
    expect(within(win).getByTestId("nokia-handset-exhibit")).toBeInTheDocument();
    expect(within(win).getByTestId("app-shell-nokia-messages")).toHaveAttribute("data-layout-mode", "standard");
    fireEvent.click(within(win).getByRole("button", { name: "Maximize Nokia Messages" }));
    expect(within(win).getByTestId("app-shell-nokia-messages")).toHaveAttribute("data-layout-mode", "maximized");
  });

  it("boots to a home screen with carrier, load, and new-message alert", () => {
    const { win, lcd } = openPhone();
    expect(within(win).getByText(/Retro SMS Handset · 3310 Series/i)).toBeInTheDocument();
    expect(within(win).getByText(/Load: ₱35.00/i)).toBeInTheDocument();
    expect(within(lcd).getAllByText("SMART").length).toBeGreaterThan(0);
    expect(within(lcd).getByText("Load ₱35.00")).toBeInTheDocument();
    expect(within(lcd).getByText(/2 messages/)).toBeInTheDocument();
    expect(within(win).getByRole("button", { name: "Select: Read" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nokia Messages" })).toBeInTheDocument();
  });

  it("reads an unread message from the inbox and ticks the mission", () => {
    const { win, lcd, press } = openPhone();
    press("Select: Read");
    expect(within(lcd).getByRole("heading", { name: "Inbox (5)" })).toBeInTheDocument();
    press(/Unread message from Nanay/);
    expect(within(lcd).getByRole("heading", { name: "From: Nanay" })).toBeInTheDocument();
    expect(within(lcd).getByText(/GM lang, no reply needed :\)/i)).toBeInTheDocument();

    press("C: back or delete");
    expect(within(lcd).getByRole("button", { name: /^Message from Nanay/ })).toBeInTheDocument();
    expect(within(win).getByText("1 of 6 done")).toBeInTheDocument();
  });

  it("composes from a classic text, sends it via Options, and deducts load", () => {
    const { win, lcd, press } = openPhone();
    press("+ “Wer u na? D2 na me.”");
    expect(within(win).getByLabelText(/Message Body/i)).toHaveValue("Wer u na? D2 na me.");
    fireEvent.change(within(win).getByLabelText(/To \/ Recipient/i), { target: { value: "Kiko Reyes" } });

    press("Select: Options");
    press("Send SMS to Kiko Reyes");
    expect(within(lcd).getByRole("heading", { name: "Message sent ✓" })).toBeInTheDocument();
    expect(within(win).getByText(/Load: ₱34.00/i)).toBeInTheDocument();
    expect(screen.getAllByText("SMS Sent")[0]).toBeInTheDocument();
  });

  it("asks who to send to when no recipient is set", () => {
    const { win, lcd, press } = openPhone();
    press("+ “Copy, kita-kits later!”");
    press("Select: Options");
    press("Send SMS to recipient");
    expect(within(lcd).getByRole("heading", { name: "Send to:" })).toBeInTheDocument();
    press("Send to Bea Gonzales");
    expect(within(lcd).getByRole("heading", { name: "Message sent ✓" })).toBeInTheDocument();
    expect(within(lcd).getByText("To: Bea Gonzales")).toBeInTheDocument();
    expect(within(win).getByText(/Load: ₱34.00/i)).toBeInTheDocument();
  });

  it("types with multi-tap: tapping 2 twice makes a 'b'", () => {
    const { win, press } = openPhone();
    press("Select: Read");
    press("C: back or delete");
    press("Write message");
    press(/Key 8 T U V/);
    press(/Key 2 A B C/);
    press(/Key 2 A B C/);
    expect(within(win).getByLabelText(/Message Body/i)).toHaveValue("tb");
    press("C: back or delete");
    expect(within(win).getByLabelText(/Message Body/i)).toHaveValue("t");
  });

  it("saves a draft and deletes a message through Options", () => {
    const { win, lcd, press } = openPhone();
    press("+ “Pass load 5 pls, emergency lang po.”");
    press("Select: Options");
    press("Save current text as draft");
    expect(within(lcd).getByRole("heading", { name: "Drafts (2)" })).toBeInTheDocument();
    expect(screen.getAllByText("Draft Saved")[0]).toBeInTheDocument();

    press(/Message to Unaddressed/);
    press("Select: Options");
    press("Delete message");
    expect(screen.getAllByText("Message Deleted")[0]).toBeInTheDocument();
    expect(within(lcd).getByRole("heading", { name: "Drafts (1)" })).toBeInTheDocument();
    expect(within(lcd).queryByText(/Pass load 5/)).not.toBeInTheDocument();
  });

  it("changes profile, ringtone, and buys load from the Menu", () => {
    const { win, lcd, press } = openPhone();
    press("or open Menu");
    press("🔔 Profiles");
    press("Set profile Silent");
    expect(screen.getAllByText("Profile Updated")[0]).toBeInTheDocument();

    press("C: back or delete");
    press("♪ Tones");
    press("Select ringtone Pinoy Rock Riff");
    expect(screen.getAllByText("Ringtone Selected")[0]).toBeInTheDocument();

    press("C: back or delete");
    press("₱ Prepaid load");
    press("Load scratch card ₱30");
    expect(screen.getAllByText("Prepaid Load Added")[0]).toBeInTheDocument();
    expect(within(win).getByText(/Load: ₱65.00/i)).toBeInTheDocument();
    expect(within(lcd).getByRole("heading", { name: "Load added!" })).toBeInTheDocument();
  });

  it("navigates menus with the keyboard like the hardware keys", () => {
    const { win, lcd } = openPhone();
    const phone = within(win).getByTestId("nokia-handset-exhibit");
    fireEvent.click(within(lcd).getByRole("button", { name: "or open Menu" }));
    fireEvent.keyDown(phone, { key: "ArrowDown" });
    fireEvent.keyDown(phone, { key: "Enter" });
    expect(within(lcd).getByRole("heading", { name: "Contacts" })).toBeInTheDocument();
    fireEvent.keyDown(phone, { key: "Escape" });
    expect(within(lcd).getByRole("heading", { name: "Menu" })).toBeInTheDocument();
  });

  it("jumps the phone to the right screen from a mission's Show me button", () => {
    const { lcd, press } = openPhone();
    press("Show me: Buy a ₱30 scratch card");
    expect(within(lcd).getByRole("heading", { name: "Load ₱35.00" })).toBeInTheDocument();
    press("Show me: Eat 1 dot in Snake II");
    expect(within(lcd).getByRole("img", { name: /Snake game board/ })).toBeInTheDocument();
    expect(within(lcd).getByText(/Press Start/)).toBeInTheDocument();
  });

  it("makes Snake steering obvious: arrow hints on 2/4/6/8, keyboard arrows from anywhere, and pause", () => {
    const { win, lcd, press } = openPhone();
    press("Show me: Eat 1 dot in Snake II");
    expect(within(lcd).getByText(/Steer: ◀ 4/)).toBeInTheDocument();
    expect(within(win).getByRole("button", { name: /Key 4 G H I \(steer left\)/ })).toBeInTheDocument();
    expect(within(win).getByRole("button", { name: /Key 6 M N O \(steer right\)/ })).toBeInTheDocument();

    // An arrow key pressed anywhere on the page starts the game.
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(within(win).getByRole("button", { name: "Select: Pause" })).toBeInTheDocument();
    press("Select: Pause");
    expect(within(lcd).getByText("Paused")).toBeInTheDocument();
    fireEvent.keyDown(window, { key: " " });
    expect(within(win).getByRole("button", { name: "Select: Pause" })).toBeInTheDocument();
  });

  it("explores the EDSA II sequence and receives the text on the phone", () => {
    const { win, lcd } = openPhone();
    fireEvent.click(within(win).getByRole("tab", { name: /EDSA II/i }));
    expect(within(win).getByText(/The World’s First “Coup de Text”/i)).toBeInTheDocument();
    expect(within(win).getByText(/Step 1 of 4/i)).toBeInTheDocument();
    expect(within(win).getByText("Reconstructed educational context")).toBeInTheDocument();

    fireEvent.click(within(win).getByRole("button", { name: "Next timeline step" }));
    expect(within(win).getByText(/Step 2 of 4/i)).toBeInTheDocument();
    expect(within(win).getByText("★ Widely Reported SMS Wording")).toBeInTheDocument();
    expect(within(win).getAllByText(/Go 2 EDSA Wear blk/i)[0]).toBeInTheDocument();

    fireEvent.click(within(win).getByRole("button", { name: /Receive Historical Broadcast in Phone Inbox/i }));
    expect(screen.getAllByText("Urgent SMS Broadcast")[0]).toBeInTheDocument();
    expect(within(lcd).getByRole("heading", { name: "From: Forwarded Broadcast" })).toBeInTheDocument();
    expect(within(win).getByText("Widely Reported SMS Wording:")).toBeInTheDocument();
    expect(within(win).getByText("Reconstructed educational context:")).toBeInTheDocument();
  });

  it("displays integrated Museum Info with interpretation and source citations", () => {
    const { win } = openPhone();
    fireEvent.click(within(win).getByRole("tab", { name: /Museum Info/i }));
    expect(within(win).getByText("Nokia & SMS Culture in the Philippines")).toBeInTheDocument();
    expect(within(win).getByText("2000–2010")).toBeInTheDocument();
    expect(within(win).getByText(/internationally recognized texting hub/i)).toBeInTheDocument();
    expect(within(win).getByText(/Educational Reconstruction Notice:/i)).toBeInTheDocument();
    expect(within(win).getByRole("link", { name: /Digital development dashboard/i })).toBeInTheDocument();
  });
});

describe("Snake II rules", () => {
  it("wraps around the edges, grows when eating, and crashes into itself", () => {
    const edge = [{ x: SNAKE_COLS - 1, y: 2 }, { x: SNAKE_COLS - 2, y: 2 }];
    const wrapped = advanceSnake(edge, "right", { x: 9, y: 9 });
    expect(wrapped.snake[0]).toEqual({ x: 0, y: 2 });
    expect(wrapped.snake).toHaveLength(2);

    const eat = advanceSnake([{ x: 3, y: 3 }, { x: 2, y: 3 }], "right", { x: 4, y: 3 });
    expect(eat.ate).toBe(true);
    expect(eat.snake).toHaveLength(3);

    const loop = [{ x: 5, y: 5 }, { x: 5, y: 6 }, { x: 4, y: 6 }, { x: 4, y: 5 }, { x: 4, y: 4 }];
    expect(advanceSnake(loop, "left", { x: 0, y: 0 }).crashed).toBe(true);
  });
});
