import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import React from "react";
import { DesktopShell } from "@/components/desktop/DesktopShell";
import { initialMuseumState } from "@/lib/museum-state";
import { crowdWave, lowestNominee } from "@/components/apps/realitytv/EvictionNight";
import { INITIAL_NOMINEES } from "@/lib/apps/realitytv/data";

function openShow() {
  render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);
  fireEvent.click(screen.getByRole("button", { name: /Open Reality TV Vote/i }));
  const win = screen.getByRole("dialog", { name: "Reality TV Vote" });
  const press = (name: string | RegExp) => fireEvent.click(within(win).getByRole("button", { name }));
  return { win, press };
}

describe("Reality TV Vote — Eviction Night", () => {
  it("has deterministic crowd waves and evicts the lowest nominated housemate", () => {
    expect(crowdWave(1)).toEqual(crowdWave(1));
    expect(Object.keys(crowdWave(3))).toEqual(["nom-bea", "nom-kiko", "nom-joma"]);
    expect(lowestNominee(INITIAL_NOMINEES)?.id).toBe("nom-joma");
  });

  it("shows the broadcast TV with the three nominees and the safe housemates", () => {
    const { win } = openShow();
    const broadcast = within(win).getByRole("region", { name: /Eviction night broadcast/i });
    expect(within(broadcast).getByText(/HOUSEMATE ON THE LINE/)).toBeInTheDocument();
    expect(within(broadcast).getByText(/WEEK 7 EVICTION NIGHT IS LIVE!/)).toBeInTheDocument();
    const onTv = within(broadcast).getByRole("list", { name: "Nominated housemates" });
    expect(within(onTv).getAllByRole("img").map((img) => img.getAttribute("data-portrait"))).toEqual([
      "nom-bea",
      "nom-kiko",
      "nom-joma",
    ]);
    expect(within(broadcast).getByText(/Patty · won the task/)).toBeInTheDocument();
    expect(within(broadcast).getByText(/Kuya Chen · immunity amulet/)).toBeInTheDocument();
    expect(within(win).getAllByText("₱45.00").length).toBeGreaterThan(0);
    expect(within(win).getByText(/Educational Simulation Notice:/)).toBeInTheDocument();
  });

  it("falls back gracefully when a portrait fails to load", () => {
    const { win } = openShow();
    fireEvent.error(within(win).getAllByRole("img", { name: /Bea Valderama fictional reconstruction portrait/i })[0]);
    expect(within(win).getByText(/Portrait unavailable: Bea/i)).toBeInTheDocument();
  });

  it("opens the lines, casts text votes, and deducts load", () => {
    const { win, press } = openShow();
    expect(within(win).queryByRole("button", { name: /Cast 1 vote/ })).not.toBeInTheDocument();
    press("📺 Open the voting lines");
    expect(within(win).getByTestId("countdown")).toHaveTextContent("0:40");

    press("Cast 1 vote for Bea Valderama");
    expect(screen.getAllByRole("heading", { name: "Vote Cast" })[0]).toBeInTheDocument();
    expect(within(win).getAllByText(/₱42\.50/).length).toBeGreaterThan(0);
    expect(within(win).getByTestId("my-votes")).toHaveTextContent("1");

    fireEvent.click(within(win).getByRole("tab", { name: /My Votes/i }));
    expect(within(win).getAllByText(/VOTE BEA/i).length).toBeGreaterThan(0);
  });

  it("saves the trailing housemate with phonebook GMs and reveals the result", async () => {
    const { win, press } = openShow();
    fireEvent.click(within(win).getByRole("radio", { name: /Jomari 'Joma' Santos/ }));
    press("📺 Open the voting lines");
    expect(within(win).getByText(/Joma is in last place!/)).toBeInTheDocument();

    for (let i = 0; i < 4; i += 1) press(/GM your phonebook/);
    expect(within(win).getByRole("button", { name: /GM your phonebook/ })).toBeDisabled();
    expect(within(win).getByTestId("my-votes")).toHaveTextContent("1,000");
    expect(screen.getAllByRole("heading", { name: "GM Sent to Phonebook" }).length).toBeGreaterThan(0);

    press("Close the lines now");
    expect(within(win).getByText(/Ang housemate na lalabas ng bahay ay/)).toBeInTheDocument();
    expect(
      await within(win).findByText(/Kiko Rakista, you must now leave the house\. Your 1,000 votes helped keep Joma inside!/, undefined, {
        timeout: 5000,
      }),
    ).toBeInTheDocument();
    expect(within(win).getByText("EVICTED")).toBeInTheDocument();

    press("▶ Next week's eviction");
    expect(within(win).getByRole("button", { name: "📺 Open the voting lines" })).toBeInTheDocument();
  });

  it("reloads prepaid load via scratch card", () => {
    const { win, press } = openShow();
    press("+ ₱30 Scratch Card");
    expect(within(win).getAllByText(/₱75\.00/).length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "Prepaid Load Added" })).toBeInTheDocument();
  });

  it("keeps the TV Impact and Museum Info interpretation with citations", () => {
    const { win } = openShow();
    expect(within(win).getAllByRole("tab")).toHaveLength(4);

    fireEvent.click(within(win).getByRole("tab", { name: /TV Impact/i }));
    expect(within(win).getByText(/Micro-Democracy/i)).toBeInTheDocument();
    expect(within(win).queryByText(/10 million/i)).not.toBeInTheDocument();
    expect(
      within(win).getByText(/All vote totals, standings, ₱2\.50 tariffs, and 2366 shortcode interactions shown in this exhibit are fictional/i),
    ).toBeInTheDocument();

    fireEvent.click(within(win).getByRole("tab", { name: /Museum Info/i }));
    expect(within(win).getByText(/2005–2010 · Participatory Television/i)).toBeInTheDocument();
    expect(within(win).getAllByText(/Pinoy Big Brother/i).length).toBeGreaterThan(0);
    expect(within(win).queryByText(/StarStruck/i)).not.toBeInTheDocument();
    expect(within(win).getByText(/Educational Reconstruction Notice:/i)).toBeInTheDocument();
    expect(within(win).getByRole("link", { name: /Pinoy Big Brother Big Winners/i })).toHaveAttribute(
      "href",
      "https://www.abs-cbn.com/2015/11/2/fresh-scoops/throwback-pinoy-big-brother-big-winners-2005-to-20-121224",
    );
  });
});
