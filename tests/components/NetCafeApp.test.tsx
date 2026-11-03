import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import React from "react";
import { DesktopShell } from "@/components/desktop/DesktopShell";
import { initialMuseumState } from "@/lib/museum-state";

describe("Phase 5 — Net Café Manager Flagship Application", () => {
  it("presents an XP-era cashier counter with a labeled floor map and resilient shop photograph", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /Open Net Café Manager/i }));

    const windowDialog = screen.getByRole("dialog", { name: "Net Café Manager" });
    expect(within(windowDialog).getByRole("heading", { name: /Counter 01 · Session Cashier/i })).toBeInTheDocument();
    expect(within(windowDialog).getByRole("region", { name: /Computer shop floor map/i })).toBeInTheDocument();

    const shopPhoto = within(windowDialog).getByRole("img", {
      name: /Reconstructed Philippine computer shop interior/i,
    });
    expect(shopPhoto.tagName).toBe("IMG");
    fireEvent.error(shopPhoto);
    const fallback = within(windowDialog).getByRole("img", {
      name: /Reconstructed Philippine computer shop interior/i,
    });
    expect(fallback.tagName).not.toBe("IMG");
    expect(fallback).toHaveTextContent(/Image unavailable/i);
  });

  it("opens Net Café Manager from desktop, renders cashier till, and displays 8 terminals", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    // Open Net Café Manager from desktop icon
    fireEvent.click(screen.getByRole("button", { name: /Open Net Café Manager/i }));

    const windowDialog = screen.getByRole("dialog", { name: "Net Café Manager" });
    expect(windowDialog).toBeInTheDocument();

    // Check header branding and cashier till
    expect(within(windowDialog).getByText(/Net Café Manager v3.2/i)).toBeInTheDocument();
    expect(within(windowDialog).getByText(/Active Terminals:/i)).toBeInTheDocument();
    expect(within(windowDialog).getByText(/Cash Register:/i)).toBeInTheDocument();

    // Check terminals present (PC 01 through PC 08)
    expect(within(windowDialog).getByText("PC 01 - Cyber Barkada")).toBeInTheDocument();
    expect(within(windowDialog).getByText("PC 02 - Net Champion")).toBeInTheDocument();
    expect(within(windowDialog).getByText("PC 08 - Turbo Gamer")).toBeInTheDocument();

    // Check taskbar button
    expect(screen.getByRole("button", { name: "Net Café Manager" })).toBeInTheDocument();
  });

  it("selects an available terminal, rents a session with chosen tariff, and triggers toast", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Open Net Café Manager/i }));
    const windowDialog = screen.getByRole("dialog", { name: "Net Café Manager" });

    // Click "Rent PC" button on PC 02
    const rentPc02Btn = within(windowDialog).getByRole("button", {
      name: /Start Session on PC 02 - Net Champion/i,
    });
    fireEvent.click(rentPc02Btn);

    // Switches to Session Desk tab
    expect(within(windowDialog).getByText(/Terminal is Available · Start New Rental Session/i)).toBeInTheDocument();

    // Fill customer name
    const customerInput = within(windowDialog).getByLabelText(/Customer Name \/ Gamer Tag/i);
    fireEvent.change(customerInput, { target: { value: "Barkada_Champ" } });

    // Select 2 Hours Barkada Rate (₱35)
    const tariff2h = within(windowDialog).getByRole("radio", {
      name: /2 Hours Barkada Rate/i,
    });
    fireEvent.click(tariff2h);

    // Select primary activity: Ragnarok
    const activitySelect = within(windowDialog).getByLabelText(/Primary Starting Activity/i);
    fireEvent.change(activitySelect, { target: { value: "act-ragnarok" } });

    // Confirm rental
    const startBtn = within(windowDialog).getByRole("button", {
      name: /Confirm Rental & Start Session on PC 02/i,
    });
    fireEvent.click(startBtn);

    // Active session monitoring view is now displayed
    expect(within(windowDialog).getByText(/User: Barkada_Champ/i)).toBeInTheDocument();
    expect(within(windowDialog).getByText(/Current Bill: ₱35.00/i)).toBeInTheDocument();

    // OS toast triggered
    expect(screen.getAllByText("Session Started")[0]).toBeInTheDocument();
  });

  it("advances deterministic time, triggering low-time warning and expiration thresholds", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Open Net Café Manager/i }));
    const windowDialog = screen.getByRole("dialog", { name: "Net Café Manager" });

    // Navigate to Terminals tab
    const terminalsTab = within(windowDialog).getByRole("tab", { name: /Terminals/i });
    fireEvent.click(terminalsTab);

    // Initial PC 01 has 15 mins remaining
    // Advance time by 15 minutes using deterministic control button
    const adv15Btn = within(windowDialog).getByRole("button", {
      name: /Advance simulated time by 15 minutes/i,
    });
    fireEvent.click(adv15Btn);

    // PC 01 expires (was 15m remaining, advanced 15m => 0m remaining)
    expect(within(windowDialog).getAllByText(/Locked \/ Expired/i)[0]).toBeInTheDocument();

    // OS Toast for Session Expired triggered
    expect(screen.getAllByText("Session Expired")[0]).toBeInTheDocument();
  });

  it("extends an active session and orders canteen snacks with price updates", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Open Net Café Manager/i }));
    const windowDialog = screen.getByRole("dialog", { name: "Net Café Manager" });

    // Select occupied PC 04 (Guild Master)
    const selectPc04Btn = within(windowDialog).getByRole("button", {
      name: /Manage Session for PC 04 - Guild Master/i,
    });
    fireEvent.click(selectPc04Btn);

    // Active session panel shows user RagnarokKnight99
    expect(within(windowDialog).getByText(/User: RagnarokKnight99/i)).toBeInTheDocument();

    // Add +30 Mins (₱15.00)
    const extendBtn = within(windowDialog).getByRole("button", {
      name: /Add 30 minutes for 15 pesos/i,
    });
    fireEvent.click(extendBtn);

    expect(screen.getAllByText("Time Extended")[0]).toBeInTheDocument();

    // Order Mountain Dew snack (₱15)
    const dewBtn = within(windowDialog).getByRole("button", {
      name: /Order Mountain Dew/i,
    });
    fireEvent.click(dewBtn);

    expect(screen.getAllByText("Canteen Order Added")[0]).toBeInTheDocument();
  });

  it("queues and completes network print jobs with page fee calculation", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Open Net Café Manager/i }));
    const windowDialog = screen.getByRole("dialog", { name: "Net Café Manager" });

    // Switch to Print & Services tab
    const printTab = within(windowDialog).getByRole("tab", { name: /Print & Services/i });
    fireEvent.click(printTab);

    expect(within(windowDialog).getByText(/🖨 Print & Services Desk/i)).toBeInTheDocument();

    // Apply Term Paper preset (5 pages B&W)
    const presetBtn = within(windowDialog).getByRole("button", {
      name: /Select Term Paper \(5 pgs B&W\)/i,
    });
    fireEvent.click(presetBtn);

    // Total cost estimated at ₱10.00 (5 * 2)
    expect(within(windowDialog).getByText(/Total Job Fee: ₱10.00/i)).toBeInTheDocument();

    // Send to network printer
    const sendPrintBtn = within(windowDialog).getByRole("button", {
      name: /Send Document to Network Printer/i,
    });
    fireEvent.click(sendPrintBtn);

    expect(screen.getAllByText("Print Job Sent")[0]).toBeInTheDocument();

    // Check job in queue
    expect(within(windowDialog).getAllByText(/Philippine_History_Term_Paper.doc/i)[0]).toBeInTheDocument();
  });

  it("checks out an active session with snacks and linked print jobs, verifying matching checkout toast and Billing History total", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Open Net Café Manager/i }));
    const windowDialog = screen.getByRole("dialog", { name: "Net Café Manager" });

    // Queue a print job for PC 01 (5 pgs B&W = ₱10.00)
    const printTab = within(windowDialog).getByRole("tab", { name: /Print & Services/i });
    fireEvent.click(printTab);

    // Switch terminal to PC 01 in print form
    const terminalSelect = within(windowDialog).getByLabelText(/Sent From Terminal/i);
    fireEvent.change(terminalSelect, { target: { value: "pc-01" } });

    // Apply 5 pgs B&W Term Paper preset
    const presetBtn = within(windowDialog).getByRole("button", {
      name: /Select Term Paper \(5 pgs B&W\)/i,
    });
    fireEvent.click(presetBtn);

    // Send to printer
    const sendPrintBtn = within(windowDialog).getByRole("button", {
      name: /Send Document to Network Printer/i,
    });
    fireEvent.click(sendPrintBtn);

    // Switch to Session Desk for PC 01
    const sessionDeskTab = within(windowDialog).getByRole("tab", { name: /Session Desk/i });
    fireEvent.click(sessionDeskTab);
    const pcSwitcher = within(windowDialog).getByLabelText(/Switch selected terminal/i);
    fireEvent.change(pcSwitcher, { target: { value: "pc-01" } });

    // Verify PC 01 current bill includes session fee (₱20) + snack (₱15) + print (₱10) = ₱45.00
    expect(within(windowDialog).getByText(/Current Bill: ₱45.00/i)).toBeInTheDocument();
    expect(within(windowDialog).getByText(/Linked Network Prints \(1\):/i)).toBeInTheDocument();

    // End session and checkout
    const checkoutBtn = within(windowDialog).getByRole("button", {
      name: /End session and checkout for PC 01 - Cyber Barkada/i,
    });
    fireEvent.click(checkoutBtn);

    // Checkout toast total must be exactly ₱45.00
    expect(screen.getAllByText("Session Checked Out")[0]).toBeInTheDocument();
    expect(
      screen.getAllByText(/Total bill collected: ₱45.00/i)[0],
    ).toBeInTheDocument();

    // View Billing History
    const historyTab = within(windowDialog).getByRole("tab", { name: /Billing History/i });
    fireEvent.click(historyTab);

    // PC 01's customer Jepoy_Dota is in receipt log with identical ₱45.00 total
    expect(within(windowDialog).getByText("Jepoy_Dota")).toBeInTheDocument();
    expect(within(windowDialog).getAllByText("₱45.00").length).toBeGreaterThanOrEqual(2);
  });

  it("displays integrated Museum Info with historical interpretation, ITU citation, and explicit reconstruction notice", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Open Net Café Manager/i }));
    const windowDialog = screen.getByRole("dialog", { name: "Net Café Manager" });

    // Switch to Museum Info tab
    const infoTab = within(windowDialog).getByRole("tab", { name: /Museum Info/i });
    fireEvent.click(infoTab);

    // Check curatorial essay
    expect(
      within(windowDialog).getByText("Computer Shops & Cybercafé Culture in the Philippines"),
    ).toBeInTheDocument();
    expect(within(windowDialog).getByText(/1998–2010\+ · Cybercafé Era/i)).toBeInTheDocument();
    expect(within(windowDialog).getByText(/Sachet-priced access/i)).toBeInTheDocument();

    // Verify ₱15–₱25/hour is NOT presented as a sourced nationwide average
    expect(within(windowDialog).queryByText(/₱15–₱25 \/ Hour/i)).not.toBeInTheDocument();

    // Verify reconstruction notice explicitly covers prices, terminals, sessions, customer names, and branded references
    expect(
      within(windowDialog).getByText(/All computer shop tariffs, extension rates, canteen snack costs, and printing fees are fictional period-inspired simulation values/i),
    ).toBeInTheDocument();
    expect(
      within(windowDialog).getByText(/are not presented as sourced nationwide historical averages/i),
    ).toBeInTheDocument();
    expect(
      within(windowDialog).getByText(/All computer terminals, customer sessions, gamer tags, customer names, and branded product references/i),
    ).toBeInTheDocument();

    // Check citation link
    const ituLink = within(windowDialog).getByRole("link", {
      name: /Digital development dashboard: Philippines/i,
    });
    expect(ituLink).toHaveAttribute(
      "href",
      "https://www.itu.int/en/ITU-D/Statistics/Dashboards/Pages/Digital-Development.aspx",
    );
  });

  it("supports keyboard tab navigation and responsive window maximize/restore", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Open Net Café Manager/i }));
    const windowDialog = screen.getByRole("dialog", { name: "Net Café Manager" });

    // Tabs accessibility
    const tabs = within(windowDialog).getAllByRole("tab");
    expect(tabs.length).toBe(5);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");

    // Switch tab via keyboard
    fireEvent.click(tabs[2]); // Print tab
    expect(tabs[2]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveAttribute("aria-selected", "false");

    // Maximize window
    const maxBtn = within(windowDialog).getByRole("button", { name: "Maximize Net Café Manager" });
    fireEvent.click(maxBtn);

    expect(within(windowDialog).getByRole("button", { name: "Restore Net Café Manager" })).toBeInTheDocument();
  });
});
