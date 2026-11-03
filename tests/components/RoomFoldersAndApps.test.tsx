import { afterEach, describe, it, expect } from "vitest";
import { render, screen, fireEvent, within, waitFor } from "@testing-library/react";
import React from "react";
import { DesktopShell } from "@/components/desktop/DesktopShell";
import { initialMuseumState } from "@/lib/museum-state";

describe("Phase 2 — Room Folders and App Registrations Integration", () => {
  afterEach(() => localStorage.clear());
  it("restores open windows and creates isolated persistence records for every launched app", async () => {
    localStorage.clear();
    const view = render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);
    const appNames = [
      "Friendster PH", "Nokia Messages", "Net Café Manager", "Reality TV Vote",
      "OPM Media Player", "PinoyTube", "TV Tambayan", "Chat Archives", "P-pop Passport",
    ];
    for (const name of appNames) fireEvent.click(screen.getByRole("button", { name: `Open ${name}` }));

    await waitFor(() => {
      const windows = JSON.parse(localStorage.getItem("throwback-ph:windows") || "{}");
      expect(windows.value.windows.friendster.isOpen).toBe(true);
      expect(windows.value.windows["chat-archives"].isOpen).toBe(true);
      expect(Object.keys(localStorage).filter((key) => key.startsWith("throwback-ph:app:"))).toHaveLength(9);
    });

    view.unmount();
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);
    expect(screen.getByRole("dialog", { name: "Friendster PH" })).toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: /Chat Archives/i })).toBeInTheDocument();
  });

  it("exposes all 9 desktop app shortcuts and 3 room folders on the desktop", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    // Room Folders
    expect(screen.getByRole("button", { name: /Browse Technology Folder/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Browse Performance Folder/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Browse Globalization Folder/i })).toBeInTheDocument();

    // 9 Apps
    expect(screen.getByRole("button", { name: /Open Friendster PH/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Open Nokia Messages/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Open Net Café Manager/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Open Reality TV Vote/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Open OPM Media Player/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Open PinoyTube/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Open TV Tambayan/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Open Chat Archives/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Open P-pop Passport/i })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Friendster PH desktop artifact icon" })).toBeInTheDocument();
  });

  it("opens a room folder and launches an app from its curated directory", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    // Open Technology Folder
    fireEvent.click(screen.getByRole("button", { name: /Browse Technology Folder/i }));

    // Technology folder dialog is visible
    const folderDialog = screen.getByRole("dialog", { name: /Technology Folder/i });
    expect(folderDialog).toBeInTheDocument();
    expect(within(folderDialog).getByText(/Phones, computer shops, profiles/i)).toBeInTheDocument();

    // The 3 apps are visible in the folder
    expect(within(folderDialog).getByRole("heading", { name: "Friendster PH" })).toBeInTheDocument();
    expect(within(folderDialog).getByRole("img", { name: "Friendster PH artifact icon" })).toBeInTheDocument();
    expect(within(folderDialog).getByRole("heading", { name: "Nokia Messages" })).toBeInTheDocument();
    expect(within(folderDialog).getByRole("heading", { name: "Net Café Manager" })).toBeInTheDocument();

    // Launch Net Café Manager from inside the folder
    const launchBtn = within(folderDialog).getByRole("button", { name: "Open Net Café Manager" });
    fireEvent.click(launchBtn);

    // Net Café Manager window should now be open
    const appDialog = screen.getByRole("dialog", { name: "Net Café Manager" });
    expect(appDialog).toBeInTheDocument();
    expect(within(appDialog).getByTestId("app-shell-net-cafe")).toBeInTheDocument();
    expect(within(appDialog).getByText(/Net Café Manager v3.2/i)).toBeInTheDocument();

    // Verify historical curatorial information via Museum Info tab
    const infoTab = within(appDialog).getByRole("tab", { name: /Museum Info/i });
    fireEvent.click(infoTab);
    expect(within(appDialog).getByText(/Computer Shops & Cybercafé Culture/i)).toBeInTheDocument();

    // Shows individual taskbar buttons for both open windows
    expect(screen.getByRole("button", { name: "Technology Folder" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Net Café Manager" })).toBeInTheDocument();
  });

  it("opens an application directly from desktop icon with individual taskbar identity", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    // Open Nokia Messages directly
    fireEvent.click(screen.getByRole("button", { name: /Open Nokia Messages/i }));

    // Nokia Messages window opens
    expect(screen.getByRole("dialog", { name: "Nokia Messages" })).toBeInTheDocument();
    expect(screen.getByTestId("app-shell-nokia-messages")).toBeInTheDocument();

    // Verify taskbar button has correct title and accessible state
    const taskbarBtn = screen.getByRole("button", { name: "Nokia Messages" });
    expect(taskbarBtn).toBeInTheDocument();
    expect(taskbarBtn).toHaveAttribute("aria-pressed", "true");

    // Close window via close button
    const closeBtn = screen.getByRole("button", { name: "Close Nokia Messages" });
    fireEvent.click(closeBtn);

    // Dialog is closed
    expect(screen.queryByRole("dialog", { name: "Nokia Messages" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Nokia Messages" })).not.toBeInTheDocument();
  });

  it("allows opening multiple overlapping apps across different rooms", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    // Open 3 apps from different rooms
    fireEvent.click(screen.getByRole("button", { name: /Open Net Café Manager/i }));
    fireEvent.click(screen.getByRole("button", { name: /Open OPM Media Player/i }));
    fireEvent.click(screen.getByRole("button", { name: /Open Chat Archives/i }));

    // All three windows open
    expect(screen.getByRole("dialog", { name: "Net Café Manager" })).toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "OPM Media Player" })).toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "Chat Archives" })).toBeInTheDocument();

    // All 3 have individual buttons in the taskbar
    expect(screen.getByRole("button", { name: "Net Café Manager" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "OPM Media Player" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Chat Archives" })).toBeInTheDocument();
  });

  it("lists all room folders and applications in the Start menu", () => {
    const state = { ...initialMuseumState, startMenuOpen: true };
    render(<DesktopShell state={state} dispatch={() => {}} />);

    const startMenu = screen.getByRole("menu", { name: "Start menu" });
    expect(startMenu).toBeInTheDocument();

    // Room Folders in Start Menu
    expect(screen.getByRole("menuitem", { name: /Technology Folder/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /Performance Folder/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /Globalization Folder/i })).toBeInTheDocument();

    // Apps in Start Menu
    expect(screen.getByRole("menuitem", { name: /^Friendster PH$/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /^Nokia Messages$/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /^Net Café Manager$/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /^Reality TV Vote$/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /^OPM Media Player$/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /^PinoyTube$/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /^TV Tambayan$/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /^Chat Archives$/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /^P-pop Passport$/i })).toBeInTheDocument();
  });
});
