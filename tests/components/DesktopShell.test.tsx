import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MuseumApp } from "@/components/museum/MuseumApp";

describe("desktop arrival and navigation", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("finishes the boot sequence after 2500ms and opens Welcome", () => {
    render(<MuseumApp />);
    expect(screen.getByRole("button", { name: /skip intro/i })).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(2500));
    expect(screen.getByRole("dialog", { name: /welcome to ASL/i })).toBeInTheDocument();
    expect(screen.getByText(/A desktop museum of Filipino life from 2000–2010/i)).toBeInTheDocument();
  });

  it("lets a visitor skip boot and begin the guided tour", async () => {
    vi.useRealTimers();
    const user = userEvent.setup();
    render(<MuseumApp />);

    await user.click(screen.getByRole("button", { name: /skip intro/i }));
    await user.click(screen.getByRole("button", { name: /start tour/i }));

    expect(screen.getByRole("dialog", { name: /technology museum room/i })).toBeInTheDocument();
  });

  it("opens each museum room from its desktop door", async () => {
    vi.useRealTimers();
    const user = userEvent.setup();
    render(<MuseumApp />);
    await user.click(screen.getByRole("button", { name: /skip intro/i }));
    await user.click(screen.getByRole("button", { name: /explore freely/i }));

    expect(screen.getByRole("button", { name: /open technology/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /open performance/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /open globalization/i })).toBeInTheDocument();
  });

  it("toggles Start and restores a minimized museum from the taskbar", async () => {
    vi.useRealTimers();
    const user = userEvent.setup();
    render(<MuseumApp />);
    await user.click(screen.getByRole("button", { name: /skip intro/i }));
    await user.click(screen.getByRole("button", { name: /explore freely/i }));
    await user.click(screen.getByRole("button", { name: /open technology/i }));

    await user.click(screen.getByRole("button", { name: /minimize museum/i }));
    expect(screen.queryByRole("dialog", { name: /technology museum room/i })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /restore ASL/i }));
    expect(screen.getByRole("dialog", { name: /technology museum room/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^start$/i }));
    expect(screen.getByRole("menu", { name: /start menu/i })).toBeInTheDocument();
  });

  it("bypasses the timed boot for reduced-motion visitors", () => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    render(<MuseumApp />);
    fireEvent(window, new Event("load"));
    expect(screen.getByRole("dialog", { name: /welcome to ASL/i })).toBeInTheDocument();
  });
});
