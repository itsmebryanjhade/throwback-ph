import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import React from "react";
import { DesktopShell } from "@/components/desktop/DesktopShell";
import { initialMuseumState } from "@/lib/museum-state";

describe("Phase 6 — Reality TV Vote Application", () => {
  it("presents an eviction-night broadcast frame with resilient fictional contestant portraits", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /Open Reality TV Vote/i }));
    const windowDialog = screen.getByRole("dialog", { name: "Reality TV Vote" });

    expect(within(windowDialog).getByRole("region", { name: /Eviction night broadcast/i })).toBeInTheDocument();
    expect(within(windowDialog).getByText(/HOUSEMATE ON THE LINE/i)).toBeInTheDocument();
    const portrait = within(windowDialog).getAllByRole("img", {
      name: /Bea Valderama fictional reconstruction portrait/i,
    })[0];
    fireEvent.error(portrait);
    expect(within(windowDialog).getByText(/Portrait unavailable: Bea/i)).toBeInTheDocument();
  });

  it("shows each matching cast portrait in the cards and selected voting panel", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /Open Reality TV Vote/i }));
    const windowDialog = screen.getByRole("dialog", { name: "Reality TV Vote" });
    const portraits = within(windowDialog).getAllByRole("img", {
      name: /fictional reconstruction portrait/i,
    });

    expect(portraits.map((portrait) => portrait.getAttribute("data-portrait"))).toEqual([
      "nom-bea",
      "nom-bea",
      "nom-kiko",
      "nom-joma",
      "nom-patty",
      "nom-chen",
    ]);
    expect(
      within(windowDialog).getAllByRole("img", {
        name: "Bea Valderama fictional reconstruction portrait",
      }),
    ).toHaveLength(2);
  });

  it("opens Reality TV Vote from desktop, displays studio header, and shows 5 housemates", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    // Open Reality TV Vote from desktop icon
    fireEvent.click(screen.getByRole("button", { name: /Open Reality TV Vote/i }));

    const windowDialog = screen.getByRole("dialog", { name: "Reality TV Vote" });
    expect(windowDialog).toBeInTheDocument();

    // Broadcast branding
    expect(within(windowDialog).getByText(/Star Quest Pilipinas: Televote Live/i)).toBeInTheDocument();
    expect(within(windowDialog).getByText(/WEEK 7 EVICTION NIGHT IS LIVE!/i)).toBeInTheDocument();

    // Check housemate cards
    expect(within(windowDialog).getAllByText(/Bea Valderama/i).length).toBeGreaterThan(0);
    expect(within(windowDialog).getAllByText(/Kiko Dimaculangan/i).length).toBeGreaterThan(0);
    expect(within(windowDialog).getAllByText(/Joma/i).length).toBeGreaterThan(0);
    expect(within(windowDialog).getAllByText(/Patty/i).length).toBeGreaterThan(0);
    expect(within(windowDialog).getAllByText(/Chen/i).length).toBeGreaterThan(0);

    // Starting prepaid balance
    expect(within(windowDialog).getAllByText(/₱45\.00/).length).toBeGreaterThan(0);
  });

  it("casts an SMS vote, decrements prepaid load, and updates history", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Open Reality TV Vote/i }));
    const windowDialog = screen.getByRole("dialog", { name: "Reality TV Vote" });

    // Cast 1 vote
    const castBtn = within(windowDialog).getByRole("button", {
      name: /Cast 1 vote for Bea Valderama/i,
    });
    fireEvent.click(castBtn);

    // Balance drops from 45.00 to 42.50
    expect(within(windowDialog).getAllByText(/₱42\.50/).length).toBeGreaterThan(0);

    // Verify toast notification
    expect(screen.getByRole("heading", { name: "Vote Cast" })).toBeInTheDocument();

    // Switch to history tab
    const historyTab = within(windowDialog).getByRole("tab", { name: /My Votes/i });
    fireEvent.click(historyTab);

    // History record present
    expect(within(windowDialog).getAllByText(/Bea Valderama/i).length).toBeGreaterThan(0);
    expect(within(windowDialog).getAllByText(/VOTE BEA/i).length).toBeGreaterThan(0);
  });

  it("reloads prepaid balance via scratch card", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Open Reality TV Vote/i }));
    const windowDialog = screen.getByRole("dialog", { name: "Reality TV Vote" });

    const reloadBtn = within(windowDialog).getByRole("button", {
      name: /Reload prepaid balance by 30 pesos/i,
    });
    fireEvent.click(reloadBtn);

    // Balance increases from 45.00 to 75.00
    expect(within(windowDialog).getAllByText(/₱75\.00/).length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "Prepaid Load Added" })).toBeInTheDocument();
  });

  it("inspects live standings, triggers crowd surge, and explores TV impact & museum info", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Open Reality TV Vote/i }));
    const windowDialog = screen.getByRole("dialog", { name: "Reality TV Vote" });

    // Check simulation notice on Vote Desk
    expect(within(windowDialog).getByText(/Educational Simulation Notice:/i)).toBeInTheDocument();
    expect(within(windowDialog).getByText(/Shortcode 2366, the simulated ₱2\.50 tariff per vote/i)).toBeInTheDocument();

    // 1. Standings tab
    const standingsTab = within(windowDialog).getByRole("tab", { name: /Live Standings/i });
    fireEvent.click(standingsTab);
    expect(within(windowDialog).getByText(/Official Televoting Standings/i)).toBeInTheDocument();
    expect(within(windowDialog).getByText(/Total Simulated Votes:/i)).toBeInTheDocument();

    // Trigger surge
    const surgeBtn = within(windowDialog).getByRole("button", {
      name: /Simulate incoming crowd surge votes/i,
    });
    fireEvent.click(surgeBtn);
    expect(screen.getByRole("heading", { name: "Crowd Surge Simulated" })).toBeInTheDocument();

    // 2. TV Impact tab
    const impactTab = within(windowDialog).getByRole("tab", { name: /TV Impact/i });
    fireEvent.click(impactTab);
    expect(within(windowDialog).getByText(/Micro-Democracy/i)).toBeInTheDocument();

    // Verify unsourced "10 million" claim was removed
    expect(within(windowDialog).queryByText(/10 million/i)).not.toBeInTheDocument();
    expect(
      within(windowDialog).getByText(
        /All vote totals, standings, ₱2\.50 tariffs, and 2366 shortcode interactions shown in this exhibit are fictional period-inspired simulation values/i
      )
    ).toBeInTheDocument();

    // 3. Museum Info tab
    const museumTab = within(windowDialog).getByRole("tab", { name: /Museum Info/i });
    fireEvent.click(museumTab);
    expect(within(windowDialog).getByText(/2005–2010 · Participatory Television/i)).toBeInTheDocument();
    expect(within(windowDialog).getAllByText(/Pinoy Big Brother/i).length).toBeGreaterThan(0);
    // Non-cited shows removed to align strictly with pbb-history citation
    expect(within(windowDialog).queryByText(/StarStruck/i)).not.toBeInTheDocument();
    expect(within(windowDialog).getByText(/Educational Reconstruction Notice:/i)).toBeInTheDocument();
    expect(
      within(windowDialog).getByText(
        /the 2366 shortcode, the simulated ₱2\.50 vote fee, standings, vote tallies, and eviction outcomes are fictional period-inspired simulation values/i
      )
    ).toBeInTheDocument();

    const citationLink = within(windowDialog).getByRole("link", {
      name: /Pinoy Big Brother Big Winners/i,
    });
    expect(citationLink).toHaveAttribute(
      "href",
      "https://www.abs-cbn.com/2015/11/2/fresh-scoops/throwback-pinoy-big-brother-big-winners-2005-to-20-121224"
    );
  });
});
