import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it } from "vitest";
import { MuseumWindow } from "@/components/museum/MuseumWindow";
import { WindowManagerProvider } from "@/lib/window-system/WindowContext";
import type { WindowRegistration } from "@/lib/window-system/types";
import { initialMuseumState, museumReducer } from "@/lib/museum-state";

function renderMuseumWithWidth(width: number, height = 600) {
  const registrations: WindowRegistration[] = [
    {
      id: "museum",
      title: "ASL — Technology",
      icon: "🏛️",
      defaultBounds: { x: 50, y: 30, width, height },
      minSize: { width: 500, height: 380 },
    },
  ];

  let state = museumReducer(initialMuseumState, { type: "SKIP_BOOT" });
  state = museumReducer(state, { type: "OPEN_ROOM", roomId: "technology" });

  return render(
    <WindowManagerProvider
      registrations={registrations}
      initialArea={{ width: 1440, height: 900 }}
    >
      <MuseumWindow state={state} dispatch={() => undefined} />
    </WindowManagerProvider>,
  );
}

describe("MuseumWindow Responsive Layout & Single Scroll Region", () => {
  it("renders a compact single-column layout at minimum supported width (<680px)", () => {
    renderMuseumWithWidth(540, 500);

    const container = screen.getByTestId("museum-window-content");
    expect(container).toHaveAttribute("data-layout", "compact");

    // In compact mode, the compact bar with pills is displayed
    const compactNav = screen.getByRole("navigation", { name: "Exhibits in this room" });
    expect(compactNav).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /view exhibit: nokia & sms culture/i })).toBeInTheDocument();

    // Exactly one content scroll region exists
    const scrollAreas = screen.getAllByTestId("museum-viewer-scroll");
    expect(scrollAreas).toHaveLength(1);

    // Title bar and controls remain visible
    expect(screen.getByRole("button", { name: /minimize museum/i })).toBeVisible();
    expect(screen.getByRole("button", { name: /maximize museum/i })).toBeVisible();
    expect(screen.getByRole("button", { name: /close museum/i })).toBeVisible();
  });

  it("renders a two-column layout at medium window width (680px–959px)", () => {
    renderMuseumWithWidth(780, 580);

    const container = screen.getByTestId("museum-window-content");
    expect(container).toHaveAttribute("data-layout", "medium");

    // Room intro column with exhibit list is rendered
    expect(screen.getByRole("complementary")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Technology" })).toBeInTheDocument();

    // Exactly one viewer scroll area
    const scrollAreas = screen.getAllByTestId("museum-viewer-scroll");
    expect(scrollAreas).toHaveLength(1);
  });

  it("renders a spacious three-column layout at large/maximized width (>=960px)", () => {
    renderMuseumWithWidth(1100, 680);

    const container = screen.getByTestId("museum-window-content");
    expect(container).toHaveAttribute("data-layout", "spacious");

    // Room intro column is rendered
    expect(screen.getByRole("complementary")).toBeInTheDocument();

    // Visual and copy are present inside the single scroll area
    expect(screen.getByRole("region", { name: /why it mattered/i })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /sms inbox/i })).toBeInTheDocument();

    // Only one content scroll area exists
    const scrollAreas = screen.getAllByTestId("museum-viewer-scroll");
    expect(scrollAreas).toHaveLength(1);
  });

  it("allows selecting exhibits seamlessly in compact layout", async () => {
    const user = userEvent.setup();
    let state = museumReducer(initialMuseumState, { type: "SKIP_BOOT" });
    state = museumReducer(state, { type: "OPEN_ROOM", roomId: "technology" });

    const registrations: WindowRegistration[] = [
      {
        id: "museum",
        title: "ASL — Technology",
        defaultBounds: { x: 50, y: 30, width: 550, height: 500 },
        minSize: { width: 500, height: 380 },
      },
    ];

    function StatefulCompactMuseum() {
      const [appState, setAppState] = React.useState(state);
      return (
        <WindowManagerProvider registrations={registrations}>
          <MuseumWindow state={appState} dispatch={(action) => setAppState((prev) => museumReducer(prev, action))} />
        </WindowManagerProvider>
      );
    }

    render(<StatefulCompactMuseum />);
    expect(screen.getByRole("heading", { name: "Nokia & SMS Culture" })).toBeInTheDocument();

    // Click Friendster Era pill in compact nav
    await user.click(screen.getByRole("button", { name: /view exhibit: friendster era/i }));
    expect(screen.getByRole("heading", { name: "Friendster Era" })).toBeInTheDocument();
  });
});
