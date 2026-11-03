import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MuseumApp } from "@/components/museum/MuseumApp";

async function enterDesktop() {
  const user = userEvent.setup();
  render(<MuseumApp />);
  await user.click(screen.getByRole("button", { name: /skip intro/i }));
  await user.click(screen.getByRole("button", { name: /explore freely/i }));
  return user;
}

describe("MuseumWindow", () => {
  it("shows one room with four selectable exhibits and complete interpretation", async () => {
    const user = await enterDesktop();
    await user.click(screen.getByRole("button", { name: /open technology/i }));

    expect(screen.getByRole("dialog", { name: /technology museum room/i })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /view exhibit/i })).toHaveLength(4);
    await user.click(screen.getByRole("button", { name: /view exhibit: friendster era/i }));
    expect(screen.getByRole("heading", { name: "Friendster Era" })).toBeInTheDocument();
    expect(screen.getByText(/Why it mattered/i)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /social-network profile recreation/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Friendster: social networking pioneer/i })).toBeInTheDocument();
  });

  it("changes rooms without showing two main rooms", async () => {
    const user = await enterDesktop();
    await user.click(screen.getByRole("button", { name: /open technology/i }));
    await user.click(screen.getByRole("tab", { name: "Performance" }));

    expect(screen.getByRole("dialog", { name: /performance museum room/i })).toBeInTheDocument();
    expect(screen.queryByRole("dialog", { name: /technology museum room/i })).not.toBeInTheDocument();
  });

  it("closes back to the desktop", async () => {
    const user = await enterDesktop();
    await user.click(screen.getByRole("button", { name: /open globalization/i }));
    await user.click(screen.getByRole("button", { name: /close museum/i }));
    expect(screen.queryByRole("dialog", { name: /museum room/i })).not.toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: /museum rooms/i })).toBeInTheDocument();
  });

  it("completes a guided tour after all twelve exhibits", async () => {
    const user = userEvent.setup();
    render(<MuseumApp />);
    await user.click(screen.getByRole("button", { name: /skip intro/i }));
    await user.click(screen.getByRole("button", { name: /start tour/i }));
    for (let index = 0; index < 12; index += 1) {
      await user.click(screen.getByRole("button", { name: index === 11 ? /finish tour/i : /next exhibit/i }));
    }
    expect(screen.getByRole("heading", { name: /the decade changed together/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /return to desktop/i })).toBeInTheDocument();
  });
});
