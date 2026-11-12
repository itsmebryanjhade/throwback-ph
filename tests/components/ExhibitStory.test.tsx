import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MuseumApp } from "@/components/museum/MuseumApp";
import { toTextspeak } from "@/components/museum/story/TextSpeakToy";
import { reachAfter } from "@/components/museum/story/ForwardChainToy";

async function openTechnology() {
  const user = userEvent.setup();
  render(<MuseumApp />);
  await user.click(screen.getByRole("button", { name: /skip intro/i }));
  await user.click(screen.getByRole("button", { name: /explore freely/i }));
  await user.click(screen.getByRole("button", { name: /open technology exhibit/i }));
  return user;
}

describe("Technology exhibit stories", () => {
  it("converts messages into 2000s textspeak", () => {
    expect(toTextspeak("Good morning! See you later at the computer shop, okay?")).toBe(
      "gud am! cu l8r at the comp shop, ok?",
    );
    expect(toTextspeak("Thank you for the load")).toBe("tnx 4 the load");
  });

  it("counts forwarded-message reach by rounds of five", () => {
    expect(reachAfter(0)).toBe(1);
    expect(reachAfter(1)).toBe(6);
    expect(reachAfter(3)).toBe(156);
  });

  it("opens Nokia & SMS as a story with a try-it toy, facts, and next steps", async () => {
    await openTechnology();
    expect(screen.getByRole("heading", { level: 2, name: "Nokia & SMS Culture" })).toBeInTheDocument();
    expect(screen.getByText(/Naalala mo pa\?/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Type like it's 2003" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Did you know\?/ })).toBeInTheDocument();
    expect(screen.getByText(/Explored 1 of 4/)).toBeInTheDocument();
    const museum = screen.getByRole("dialog", { name: /technology museum room/i });
    expect(within(museum).getByRole("button", { name: /Open Nokia Messages/ })).toBeInTheDocument();
  });

  it("moves to the next exhibit and marks progress", async () => {
    const user = await openTechnology();
    await user.click(screen.getByRole("button", { name: /Next in this room.*Internet Café Life/ }));
    expect(screen.getByRole("heading", { level: 2, name: "Internet Café Life" })).toBeInTheDocument();
    expect(screen.getByText(/Explored 2 of 4/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /View exhibit: Nokia & SMS Culture \(explored\)/ })).toBeInTheDocument();
  });

  it("lets visitors rent café time with coins", async () => {
    const user = await openTechnology();
    await user.click(screen.getByRole("button", { name: /View exhibit: Internet Café Life/ }));
    await user.click(screen.getByRole("button", { name: "Insert 10 pesos" }));
    await user.click(screen.getByRole("button", { name: "Insert 5 pesos" }));
    expect(screen.getByTestId("cafe-time")).toHaveTextContent("01:00:00");
  });

  it("approves Friendster testimonials and forwards the EDSA text", async () => {
    const user = await openTechnology();
    await user.click(screen.getByRole("button", { name: /View exhibit: Friendster Era/ }));
    await user.click(screen.getAllByRole("button", { name: "Approve" })[0]);
    expect(screen.getByText(/Testimonials \(1\)/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /View exhibit: Power of Text/ }));
    await user.click(screen.getByRole("button", { name: /Forward to 5 friends/ }));
    expect(screen.getByText(/phones have the message/).textContent).toMatch(/^6 phones/);
  });

  it("opens the related app from the exhibit", async () => {
    const user = await openTechnology();
    const museum = screen.getByRole("dialog", { name: /technology museum room/i });
    await user.click(within(museum).getByRole("button", { name: /Open Nokia Messages/ }));
    const phone = screen.getByRole("dialog", { name: "Nokia Messages" });
    expect(within(phone).getAllByText(/Nokia/i).length).toBeGreaterThan(0);
  });
});
