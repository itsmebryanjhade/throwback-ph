import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MuseumApp } from "@/components/museum/MuseumApp";
import { scoreMessage } from "@/components/museum/story/VideokeToy";

async function openPerformance() {
  const user = userEvent.setup();
  render(<MuseumApp />);
  await user.click(screen.getByRole("button", { name: /skip intro/i }));
  await user.click(screen.getByRole("button", { name: /explore freely/i }));
  await user.click(screen.getByRole("button", { name: /open performance exhibit/i }));
  return user;
}

describe("Performance exhibit stories", () => {
  afterEach(() => vi.restoreAllMocks());

  it("gives classic videoke score messages", () => {
    expect(scoreMessage(100)).toMatch(/PERFECT/);
    expect(scoreMessage(93)).toMatch(/Encore/);
    expect(scoreMessage(85)).toMatch(/Pwede na/);
    expect(scoreMessage(74)).toMatch(/Practice pa/);
  });

  it("opens Reality TV as a story and lets visitors text votes and reveal the evictee", async () => {
    const user = await openPerformance();
    expect(screen.getByRole("heading", { level: 2, name: "Reality TV Participation" })).toBeInTheDocument();
    expect(screen.getByText(/Sino ang ise-save mo\?/)).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "Jojo" }));
    await user.click(screen.getByRole("button", { name: /Send vote \(0\/8\)/ }));
    expect(screen.getByText("PBB SAVE JOJO")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Reveal the evictee/ }));
    expect(screen.getByRole("status")).toHaveTextContent(/Bianca, you must now leave the house\. Your texts helped save Jojo!/);
  });

  it("burns a barkada CD with a marker label", async () => {
    const user = await openPerformance();
    await user.click(screen.getByRole("button", { name: /View exhibit: OPM Band Scene/ }));
    await user.click(screen.getByRole("checkbox", { name: /Migraine/ }));
    const label = screen.getByLabelText("Marker label");
    await user.clear(label);
    await user.type(label, "PARA SAYO");
    await user.click(screen.getByRole("button", { name: "Burn CD" }));
    expect(await screen.findByText(/Burn complete!/, undefined, { timeout: 8000 })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "A burned CD labeled PARA SAYO" })).toBeInTheDocument();
  });

  it("reserves a videoke song by code and shows a score", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99);
    const user = await openPerformance();
    await user.click(screen.getByRole("button", { name: /View exhibit: Karaoke & Mall Shows/ }));
    for (const digit of "10587") {
      await user.click(screen.getByRole("button", { name: `Key ${digit}` }));
    }
    await user.click(screen.getByRole("button", { name: "Reserve song" }));
    expect(screen.getByText(/RESERVED · 10587/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Sing!/ }));
    expect(await screen.findByTestId("videoke-score", undefined, { timeout: 8000 })).toHaveTextContent("100");
    expect(screen.getByText(/PERFECT! Pang-champion!/)).toBeInTheDocument();
  });

  it("rejects an unknown videoke code", async () => {
    const user = await openPerformance();
    await user.click(screen.getByRole("button", { name: /View exhibit: Karaoke & Mall Shows/ }));
    await user.click(screen.getByRole("button", { name: "Key 9" }));
    await user.click(screen.getByRole("button", { name: "Reserve song" }));
    expect(screen.getByText(/Song not found/)).toBeInTheDocument();
  });

  it("uploads a first video and starts collecting views and comments", async () => {
    const user = await openPerformance();
    await user.click(screen.getByRole("button", { name: /View exhibit: Early YouTube Fame/ }));
    await user.click(screen.getByRole("radio", { name: /Dance craze/ }));
    await user.click(screen.getByRole("button", { name: "Upload video" }));
    const comments = screen.getByRole("list", { name: "Comments" });
    expect(await within(comments).findByText(/first!!/, undefined, { timeout: 8000 })).toBeInTheDocument();
    expect(screen.getByTestId("video-views")).not.toHaveTextContent(/^0$/);
  });

  it("links each Performance exhibit to its app", async () => {
    const user = await openPerformance();
    const museum = screen.getByRole("dialog", { name: /performance museum room/i });
    await user.click(within(museum).getByRole("button", { name: /Open Reality TV Vote/ }));
    expect(screen.getByRole("dialog", { name: "Reality TV Vote" })).toBeInTheDocument();
  });
});
