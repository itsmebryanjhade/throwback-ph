import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DesktopShell } from "@/components/desktop/DesktopShell";
import { initialMuseumState } from "@/lib/museum-state";

function openFriendster() {
  render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);
  fireEvent.click(screen.getByRole("button", { name: /Open Friendster PH/i }));
  return screen.getByRole("dialog", { name: "Friendster PH" });
}

describe("Friendster PH redesign", () => {
  it("shows a 2000s browser address and a starter checklist that ticks off tasks", () => {
    const win = openFriendster();
    expect(within(win).getByText(/friendster-ph\.asl\/miguel/)).toBeInTheDocument();
    const starter = within(win).getByRole("region", { name: /Bago ka dito\?/ });
    expect(within(starter).getByText("0 of 5 done")).toBeInTheDocument();

    fireEvent.click(within(win).getByRole("button", { name: /Cyber Café Neon/ }));
    expect(within(starter).getByText("1 of 5 done")).toBeInTheDocument();

    fireEvent.click(within(starter).getByRole("button", { name: "Do it: Approve a testimonial" }));
    expect(within(win).getByRole("tab", { name: /Testimonials/ })).toHaveAttribute("aria-selected", "true");
    fireEvent.click(within(win).getByRole("button", { name: "✓ Approve & Display" }));
    fireEvent.click(within(win).getByRole("tab", { name: /My Profile/ }));
    expect(within(win).getByText("2 of 5 done")).toBeInTheDocument();
  });

  it("shows interests, favorite music, a profile song, and Top Friends", () => {
    const win = openFriendster();
    expect(within(win).getByText("OPM gigs")).toBeInTheDocument();
    expect(within(win).getByText(/Sponge Cola, Hale, Kamikazee/)).toBeInTheDocument();
    expect(within(win).getByText(/Now playing on my profile: Jeepney – Sponge Cola/)).toBeInTheDocument();
    expect(within(win).getByRole("heading", { name: "Top Friends (4)" })).toBeInTheDocument();
    fireEvent.click(within(win).getByRole("button", { name: "View Bea Gonzales's profile" }));
    expect(within(win).getByText(/Bea Gonzales \(gLamm_bEa\)/)).toBeInTheDocument();
  });

  it("shows a friend's own testimonials and invites you to write the first one", () => {
    const win = openFriendster();
    fireEvent.click(within(win).getByRole("button", { name: "View Kiko Reyes's profile" }));
    expect(within(win).getByText("No testimonials for Kiko yet.")).toBeInTheDocument();
    fireEvent.click(within(win).getByRole("button", { name: /Be the first!/ }));
    expect(within(win).getByLabelText(/Choose Barkada Member/)).toHaveValue("kiko-reyes");

    fireEvent.change(within(win).getByLabelText(/Your Testimonial for Kiko Reyes/), {
      target: { value: "Rakista forever, pare!" },
    });
    fireEvent.click(within(win).getByRole("button", { name: "Submit Testimonial" }));
    expect(within(win).getByRole("heading", { name: "Testis you wrote (1)" })).toBeInTheDocument();

    fireEvent.click(within(win).getByRole("tab", { name: /Friends/ }));
    fireEvent.click(within(win).getAllByRole("button", { name: "View Profile" })[0]);
    expect(within(win).getByText(/Rakista forever, pare!/)).toBeInTheDocument();
  });

  it("searches and filters people on the Friends page", () => {
    const win = openFriendster();
    fireEvent.click(within(win).getByRole("tab", { name: /Friends/ }));
    fireEvent.change(within(win).getByLabelText("Search people"), { target: { value: "baguio" } });
    expect(within(win).queryByText("Kiko Reyes")).not.toBeInTheDocument();

    fireEvent.change(within(win).getByLabelText("Search people"), { target: { value: "" } });
    fireEvent.click(within(win).getByRole("button", { name: "Not yet friends" }));
    expect(within(win).getByText("Janine Santos")).toBeInTheDocument();
    expect(within(win).queryByText("Kiko Reyes")).not.toBeInTheDocument();
  });
});
