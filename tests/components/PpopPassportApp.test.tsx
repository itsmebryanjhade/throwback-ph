import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WindowManagerProvider } from "@/lib/window-system/WindowContext";
import { NotificationProvider } from "@/lib/notification-system/NotificationContext";
import { allAppRegistrations } from "@/lib/apps/catalog";
import { PpopPassportApp } from "@/components/apps/ppoppassport/PpopPassportApp";
import { DesktopShell } from "@/components/desktop/DesktopShell";
import { initialMuseumState } from "@/lib/museum-state";

function renderWithProviders() {
  return render(
    <WindowManagerProvider registrations={allAppRegistrations}>
      <NotificationProvider>
        <PpopPassportApp />
      </NotificationProvider>
    </WindowManagerProvider>,
  );
}

describe("Phase 8 — P-pop Passport Application", () => {
  it("renders an open paper passport with curatorial ephemera fallback in standard and maximized modes", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /Open P-pop Passport/i }));

    const passportWindow = screen.getByRole("dialog", { name: /P-pop Passport/i });
    expect(passportWindow).toHaveAttribute("data-window-mode", "standard");
    expect(screen.getByRole("document", { name: /Open P-pop cultural passport/i })).toBeInTheDocument();
    expect(screen.getByText(/CURATORIAL SCRAPBOOK · RECONSTRUCTION/i)).toBeInTheDocument();

    const ephemera = screen.getByRole("img", { name: /P-pop cultural exchange scrapbook ephemera/i });
    fireEvent.error(ephemera);
    expect(screen.getByText(/Scrapbook image unavailable/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Maximize P-pop Passport/i }));
    expect(passportWindow).toHaveAttribute("data-window-mode", "maximized");
  });

  it("renders P-pop Passport with booklet layout, traveler identity, and visa stamps", () => {
    renderWithProviders();

    expect(screen.getByTestId("app-shell-ppop-passport")).toBeInTheDocument();
    expect(screen.getByTestId("passport-booklet-panel")).toHaveAttribute("data-layout", "bento");
    expect(screen.getByText(/REPUBLIKA NG PILIPINAS/i)).toBeInTheDocument();
    expect(screen.getByText(/PASAPORTE/i)).toBeInTheDocument();
    expect(screen.getByText(/Collect stamps to trace how imported pop culture/i)).toBeInTheDocument();
    expect(screen.getByText("Street Dance & B-Boy Crews")).toBeInTheDocument();
    expect(screen.getByText("Asianovela Mandopop Wave")).toBeInTheDocument();
    expect(screen.getByText("Birit Powerhouse Vocals")).toBeInTheDocument();
  });

  it("edits traveler name on the passport ID page", () => {
    renderWithProviders();

    const nameInput = screen.getByLabelText(/TRAVELER \/ CITIZEN NAME:/i);
    fireEvent.change(nameInput, { target: { value: "Juan Dela Cruz" } });

    expect(nameInput).toHaveValue("Juan Dela Cruz");
  });

  it("selects a stamp and stamps passport, updating progress", () => {
    renderWithProviders();

    // Select Asianovela Mandopop Wave
    const stampCard = screen.getByText("Asianovela Mandopop Wave");
    fireEvent.click(stampCard);

    expect(screen.getByText(/Taipei ⇄ Manila/i)).toBeInTheDocument();
    expect(screen.getByText(/Sample Song Archetype:/i)).toBeInTheDocument();
    expect(screen.getByText(/Ulan ng Pag-asa/i)).toBeInTheDocument();

    // Stamp passport
    const stampBtn = screen.getByRole("button", {
      name: /🔖 Stamp This Landmark in My Passport/i,
    });
    fireEvent.click(stampBtn);

    // Progress updates to 2 stamps
    expect(screen.getAllByText(/2 \/ 6 Stamps/i).length).toBeGreaterThanOrEqual(1);
  });

  it("explores routes tab and completes an entire exploration trail", () => {
    renderWithProviders();

    const routesTab = screen.getByRole("tab", { name: /🧭 Exploration Trails/i });
    fireEvent.click(routesTab);

    expect(screen.getByText("The Dance & Choreography Trail")).toBeInTheDocument();
    expect(screen.getByText("The Asian Broadcast Wave")).toBeInTheDocument();
    expect(screen.getByText("The Powerhouse Voice Journey")).toBeInTheDocument();

    // Complete Dance trail
    const completeBtns = screen.getAllByRole("button", {
      name: /✨ Complete & Stamp All Trail Stops/i,
    });
    fireEvent.click(completeBtns[0]);

    expect(screen.getByText("✓ TRAIL COMPLETED")).toBeInTheDocument();
  });

  it("browses chronological evolution timeline and cultural insights", () => {
    renderWithProviders();

    // Timeline tab
    const timelineTab = screen.getByRole("tab", { name: /⏳ Evolution Timeline/i });
    fireEvent.click(timelineTab);

    expect(screen.getByText(/Stage 1: Street Dance & B-Boy Crews/i)).toBeInTheDocument();
    expect(screen.getByText(/Stage 6: Modern P-pop Renaissance/i)).toBeInTheDocument();

    // Cultural Insights tab
    const insightsTab = screen.getByRole("tab", { name: /💡 Cultural Insights/i });
    fireEvent.click(insightsTab);

    expect(screen.getByText(/Cultural Hybridity in Filipino Performance/i)).toBeInTheDocument();
    expect(screen.getByText(/The Vocal Stamina of 'Birit' in Pop Groups/i)).toBeInTheDocument();
    expect(screen.getByText(/Bayanihan Movement and Collective Rhythm/i)).toBeInTheDocument();
    expect(screen.getByText(/The Transnational Cycle: From Importer to Cultural Exporter/i)).toBeInTheDocument();
  });

  it("resets passport stamps to default welcome state", () => {
    renderWithProviders();

    const resetBtn = screen.getByRole("button", { name: /🔄 Reset Visa Stamps/i });
    fireEvent.click(resetBtn);

    expect(screen.getAllByText(/1 \/ 6 Stamps/i).length).toBeGreaterThanOrEqual(1);
  });

  it("displays Museum Info with educational reconstruction notice and valid CCP / NCCA citations", () => {
    renderWithProviders();

    const museumTab = screen.getByRole("tab", { name: /🏛️ Museum Info/i });
    fireEvent.click(museumTab);

    expect(screen.getByText(/Transnational Rhythms & Local Identity: The Genesis of P-pop/i)).toBeInTheDocument();
    expect(screen.getByText(/2000–2010\+ · Globalization Room/i)).toBeInTheDocument();
    expect(screen.getByText(/Educational Reconstruction Notice:/i)).toBeInTheDocument();
    expect(screen.getByText(/Filipino Popular Music/i)).toBeInTheDocument();
    expect(screen.getByText(/Popular Music in the Philippines/i)).toBeInTheDocument();
    expect(screen.getByText(/Marlon James S. Sales/i)).toBeInTheDocument();
    expect(screen.getByText(/Curatorial Citations & Reference Sources:/i)).toBeInTheDocument();
    expect(screen.queryByText(/primary research/i)).not.toBeInTheDocument();
  });

  it("enforces historical integrity by framing content as curatorial interpretation rather than verified fact", () => {
    renderWithProviders();

    // Check stamp drawer
    const stampCard = screen.getByText("Asianovela Mandopop Wave");
    fireEvent.click(stampCard);

    // Verify "Historical Fact" label is replaced with curatorial framing
    expect(screen.queryByText(/^Historical Fact:/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Curatorial Context & Background:/i)).toBeInTheDocument();
    expect(screen.getByText(/Cultural Significance \(Curatorial Interpretation\):/i)).toBeInTheDocument();

    // Check routes tab has curatorial mapping note
    const routesTab = screen.getByRole("tab", { name: /🧭 Exploration Trails/i });
    fireEvent.click(routesTab);
    expect(screen.getByText(/Curatorial Mapping Note:/i)).toBeInTheDocument();

    // Check Museum Info has educational reconstruction notice
    const museumTab = screen.getByRole("tab", { name: /🏛️ Museum Info/i });
    fireEvent.click(museumTab);
    expect(screen.getByText(/representing curatorial interpretations rather than verified historical facts/i)).toBeInTheDocument();
  });
});
