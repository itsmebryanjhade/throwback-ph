import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import React from "react";
import { DesktopShell } from "@/components/desktop/DesktopShell";
import { initialMuseumState } from "@/lib/museum-state";
import { formatClock } from "@/components/apps/netcafe/ShopFloor";

function openCafe() {
  render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);
  fireEvent.click(screen.getByRole("button", { name: /Open Net Café Manager/i }));
  const win = screen.getByRole("dialog", { name: "Net Café Manager" });
  const press = (name: string | RegExp) => fireEvent.click(within(win).getByRole("button", { name }));
  return { win, press };
}

describe("Net Café Manager — Ikaw ang bantay", () => {
  it("formats session clocks", () => {
    expect(formatClock(900)).toBe("15:00");
    expect(formatClock(3725)).toBe("1:02:05");
    expect(formatClock(-4)).toBe("00:00");
  });

  it("shows the shop sign, rates, cash drawer, and 8 CRT monitors on the floor", () => {
    const { win } = openCafe();
    expect(within(win).getByText("KANTO CYBER CAFÉ")).toBeInTheDocument();
    expect(within(win).getByText(/Net Café Manager v3.2/)).toBeInTheDocument();
    expect(within(win).getByLabelText("Price board")).toHaveTextContent("1 hr ₱20");
    expect(within(win).getByTestId("cash-drawer")).toHaveTextContent("₱105.00");
    const floor = within(win).getByRole("region", { name: /Computer shop floor map/i });
    expect(within(floor).getAllByRole("button")).toHaveLength(8);
    expect(within(floor).getByRole("button", { name: /PC 01 Cyber Barkada: 15:00 left, Jepoy_Dota/ })).toBeInTheDocument();
    expect(within(floor).getByRole("button", { name: /PC 02 Net Champion: vacant/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Net Café Manager" })).toBeInTheDocument();
  });

  it("seats the waiting customer on a glowing PC and moves the line along", () => {
    const { win, press } = openCafe();
    expect(within(win).getByRole("region", { name: "Waiting at the counter" })).toHaveTextContent(/Kuya, isang oras po. DotA kami!/);
    press("Seat Jun-Jun");
    press(/PC 05 Lan Striker: vacant/);

    expect(within(win).getByRole("button", { name: /PC 05 Lan Striker: 1:00:00 left, Jun-Jun/ })).toBeInTheDocument();
    expect(screen.getAllByText("Session Started")[0]).toBeInTheDocument();
    expect(within(win).getByTestId("cash-drawer")).toHaveTextContent("₱125.00");
    expect(within(win).getByRole("button", { name: "Seat Ate Liza" })).toBeInTheDocument();
    expect(within(win).getByText("1 of 5 done")).toBeInTheDocument();
  });

  it("rents a free PC to a walk-in with a chosen rate", () => {
    const { win, press } = openCafe();
    press(/PC 03 Research Station: vacant/);
    fireEvent.change(within(win).getByLabelText("Customer name"), { target: { value: "Barkada_Champ" } });
    fireEvent.click(within(win).getByRole("radio", { name: /2 hr/ }));
    press("Start time on PC 03");
    expect(within(win).getByRole("button", { name: /PC 03 Research Station: 2:00:00 left, Barkada_Champ/ })).toBeInTheDocument();
    expect(within(win).getByLabelText("Bill so far")).toHaveTextContent("₱35.00");
  });

  it("sells snacks, prints, and adds time from the counter, with a running bill", () => {
    const { win, press } = openCafe();
    press(/PC 01 Cyber Barkada/);
    expect(within(win).getByTestId("counter-timer")).toHaveTextContent("15:00");

    press(/Sell Pancit Canton/);
    expect(screen.getAllByText("Canteen Order Added")[0]).toBeInTheDocument();
    press(/Print school project/);
    expect(screen.getAllByText("Print Job Sent")[0]).toBeInTheDocument();
    press("+30 min · ₱15");
    expect(screen.getAllByText("Time Extended")[0]).toBeInTheDocument();
    expect(within(win).getByTestId("counter-timer")).toHaveTextContent("45:00");

    // ₱20 time + ₱15 extension, ₱15 Dew + ₱25 canton, ₱10 print
    expect(within(win).getByLabelText("Bill so far")).toHaveTextContent("Bill so far₱85.00");
    expect(within(win).getByText("3 of 5 done")).toBeInTheDocument();
  });

  it("skips time until a session runs out, then logs out and collects", () => {
    const { win, press } = openCafe();
    press(/PC 01 Cyber Barkada/);
    press("Skip ahead 15 minutes");
    expect(within(win).getByRole("button", { name: /PC 01 Cyber Barkada: time's up/ })).toBeInTheDocument();
    expect(within(win).getByText(/Time's up! Add more time/)).toBeInTheDocument();
    expect(screen.getAllByText("Session Expired")[0]).toBeInTheDocument();

    press("Log out & collect ₱35.00");
    expect(screen.getAllByText(/Total bill collected: ₱35.00/i)[0]).toBeInTheDocument();
    expect(within(win).getByRole("button", { name: /PC 01 Cyber Barkada: vacant/ })).toBeInTheDocument();

    fireEvent.click(within(win).getByRole("tab", { name: /Ledger/ }));
    expect(within(win).getByText("Jepoy_Dota")).toBeInTheDocument();
  });

  it("pauses and resumes the shop clock and a PC", () => {
    const { win, press } = openCafe();
    press("⏸ Pause clock");
    expect(within(win).getByText(/Shop clock ⏸ paused/)).toBeInTheDocument();
    press(/PC 04 Guild Master/);
    press("⏸ Pause (bio break)");
    expect(within(win).getByRole("button", { name: /PC 04 Guild Master: paused/ })).toBeInTheDocument();
    press("▶ Resume time");
    expect(within(win).getByRole("button", { name: /PC 04 Guild Master: 45:00 left/ })).toBeInTheDocument();
  });

  it("keeps the printer queue, ledger, and museum info tabs", () => {
    const { win } = openCafe();
    const tabs = within(win).getAllByRole("tab");
    expect(tabs).toHaveLength(4);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");

    fireEvent.click(within(win).getByRole("tab", { name: /Printer/ }));
    expect(within(win).getByText(/🖨 Print & Services Desk/i)).toBeInTheDocument();
    fireEvent.click(within(win).getByRole("button", { name: /Select Term Paper \(5 pgs B&W\)/i }));
    expect(within(win).getByText(/Total Job Fee: ₱10.00/i)).toBeInTheDocument();

    fireEvent.click(within(win).getByRole("tab", { name: /Museum Info/i }));
    expect(within(win).getByText("Computer Shops & Cybercafé Culture in the Philippines")).toBeInTheDocument();
    expect(within(win).getByText(/Sachet-priced access/i)).toBeInTheDocument();
    expect(
      within(win).getByText(/All computer shop tariffs, extension rates, canteen snack costs, and printing fees are fictional/i),
    ).toBeInTheDocument();
    expect(within(win).getByRole("link", { name: /Digital development dashboard: Philippines/i })).toHaveAttribute(
      "href",
      "https://www.itu.int/en/ITU-D/Statistics/Dashboards/Pages/Digital-Development.aspx",
    );

    fireEvent.click(within(win).getByRole("button", { name: "Maximize Net Café Manager" }));
    expect(within(win).getByRole("button", { name: "Restore Net Café Manager" })).toBeInTheDocument();
  });
});
