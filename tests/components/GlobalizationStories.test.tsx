import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MuseumApp } from "@/components/museum/MuseumApp";
import { formatClock, raceVerdict } from "@/components/museum/story/RaceHomeToy";
import { screenNames } from "@/components/museum/story/ScreenNameToy";
import { groupConcept } from "@/components/museum/story/MixSoundToy";

async function openGlobalization() {
  const user = userEvent.setup();
  render(<MuseumApp />);
  await user.click(screen.getByRole("button", { name: /skip intro/i }));
  await user.click(screen.getByRole("button", { name: /explore freely/i }));
  await user.click(screen.getByRole("button", { name: /open globalization exhibit/i }));
  return user;
}

describe("Globalization exhibit stories", () => {
  it("formats the after-school clock and judges the race home", () => {
    expect(formatClock(16 * 60 + 30)).toBe("4:30 PM");
    expect(formatClock(17 * 60 + 1)).toBe("5:01 PM");
    expect(raceVerdict(16 * 60 + 50).tone).toBe("early");
    expect(raceVerdict(17 * 60 + 1).tone).toBe("ok");
    expect(raceVerdict(17 * 60 + 20).tone).toBe("late");
  });

  it("builds 2000s screen names from a first name", () => {
    expect(screenNames("Ana Marie")).toContain("xX_anamarie_Xx");
    expect(screenNames("")).toContain("miguel_08");
  });

  it("describes a P-pop concept from influences and Filipino twists", () => {
    const concept = groupConcept(["kpop", "rnb"], ["taglish"]);
    expect(concept.line).toMatch(/K-pop choreography and R&B harmonies with Taglish lyrics/);
    expect(concept.stampsIn).toEqual(["Korea", "USA"]);
  });

  it("dubs the Asianovela scene line by line and fills the kilig meter", async () => {
    const user = await openGlobalization();
    expect(screen.getByRole("heading", { level: 2, name: "Asianovela Craze" })).toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: "Kilig mode" }));
    await user.click(screen.getByRole("button", { name: /Play scene/ }));
    expect(screen.getByText(/sa tabi ko\?/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Next line/ }));
    await user.click(screen.getByRole("button", { name: /Next line/ }));
    expect(screen.getByTestId("kilig")).toHaveTextContent("100%");
    expect(screen.getByText(/Abangan/)).toBeInTheDocument();
  });

  it("races home for the 5 PM anime", async () => {
    const user = await openGlobalization();
    await user.click(screen.getByRole("button", { name: /View exhibit: Anime on Philippine TV/ }));
    await user.click(screen.getByRole("button", { name: /Chika with barkada/ }));
    await user.click(screen.getByRole("button", { name: /Jeepney/ }));
    await user.click(screen.getByRole("button", { name: /Straight to the TV/ }));
    expect(screen.getByTestId("race-clock")).toHaveTextContent("5:01 PM");
    expect(screen.getByRole("status")).toHaveTextContent(/Just in time!/);
  });

  it("makes a screen name, sets status, and sends a BUZZ", async () => {
    const user = await openGlobalization();
    await user.click(screen.getByRole("button", { name: /View exhibit: Chat Archives/ }));
    await user.type(screen.getByLabelText(/Your first name/), "Rica");
    await user.click(screen.getByRole("radio", { name: "xX_rica_Xx" }));
    expect(screen.getByTestId("ym-handle")).toHaveTextContent("xX_rica_Xx");
    await user.click(screen.getByRole("button", { name: "BUZZ!" }));
    expect(screen.getByText("BUZZ!!!")).toBeInTheDocument();
    // The recreated chat archive remains on the page as the exhibit object.
    expect(screen.getByRole("tab", { name: "mIRC" })).toBeInTheDocument();
  });

  it("stamps a P-pop passport and links to the app", async () => {
    const user = await openGlobalization();
    await user.click(screen.getByRole("button", { name: /View exhibit: From Foreign Influence to P-pop/ }));
    await user.click(screen.getByRole("button", { name: /R&B harmonies/ }));
    await user.click(screen.getByRole("button", { name: "Stamp the passport" }));
    expect(screen.getByTestId("group-name")).not.toBeEmptyDOMElement();
    expect(screen.getByText("PH → WORLD")).toBeInTheDocument();

    const museum = screen.getByRole("dialog", { name: /globalization museum room/i });
    await user.click(within(museum).getByRole("button", { name: /Open P-pop Passport/ }));
    expect(screen.getByRole("dialog", { name: "P-pop Passport" })).toBeInTheDocument();
  });
});
