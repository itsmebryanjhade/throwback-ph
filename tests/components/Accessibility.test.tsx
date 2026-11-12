import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MuseumApp } from "@/components/museum/MuseumApp";
import { ArtifactIcon } from "@/components/shared/ArtifactIcon";
import { CuratorCard } from "@/components/shared/CuratorCard";

describe("museum accessibility contract", () => {
  it("provides one main landmark and named controls throughout the desktop", async () => {
    const user = userEvent.setup();
    render(<MuseumApp />);
    await user.click(screen.getByRole("button", { name: /skip intro/i }));
    await user.click(screen.getByRole("button", { name: /explore freely/i }));
    await user.click(screen.getByRole("button", { name: /open performance/i }));

    expect(screen.getAllByRole("main")).toHaveLength(1);
    expect(screen.getByRole("link", { name: /skip to museum rooms/i })).toHaveAttribute("href", "#museum-rooms");
    expect(screen.getByRole("heading", { level: 1, name: /ASL: A tour of 2000–2010 virtual museum/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /minimize museum/i })).toHaveAccessibleName();
    expect(screen.getByRole("button", { name: /close museum/i })).toHaveAccessibleName();
    expect(screen.queryByRole("button", { name: /sound/i })).not.toBeInTheDocument();
  });

  it("keeps exhibit information available independently of its visual", async () => {
    const user = userEvent.setup();
    render(<MuseumApp />);
    await user.click(screen.getByRole("button", { name: /skip intro/i }));
    await user.click(screen.getByRole("button", { name: /start tour/i }));

    expect(screen.getByRole("heading", { name: /Nokia & SMS Culture/i })).toBeInTheDocument();
    expect(screen.getByText(/Texting made digital participation affordable/i)).toBeInTheDocument();
    expect(screen.getByText(/Sources and credits/i)).toBeInTheDocument();
  });

  it("presents compact curator context with a semantic heading", () => {
    render(
      <CuratorCard title="Reconstruction note" summary="A short museum explanation.">
        <a href="#credits">View credits</a>
      </CuratorCard>,
    );

    expect(
      screen.getByRole("heading", { level: 3, name: "Reconstruction note" }),
    ).toBeInTheDocument();
    expect(screen.getByText("A short museum explanation.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View credits" })).toBeInTheDocument();
  });

  it("keeps artifact meaning when an image cannot load", () => {
    render(
      <ArtifactIcon
        src="/museum/missing-icon.png"
        alt="Computer shop cashier terminal"
        fallback="PC"
      />,
    );

    const image = screen.getByRole("img", { name: "Computer shop cashier terminal" });
    expect(image).toBeInTheDocument();

    fireEvent.error(image);

    expect(document.querySelector("img")).not.toBeInTheDocument();
    expect(screen.getByText("PC")).toHaveAccessibleName("Computer shop cashier terminal");
  });

  it("confirms app resets, preserves unrelated data, and returns focus after cancellation", async () => {
    const user = userEvent.setup();
    localStorage.setItem("throwback-ph:app:friendster", "saved");
    localStorage.setItem("school-project-draft", "keep");
    render(<MuseumApp />);
    await user.click(screen.getByRole("button", { name: /skip intro/i }));
    await user.click(screen.getByRole("button", { name: /explore freely/i }));
    await user.click(screen.getByRole("button", { name: /^start$/i }));

    const resetButton = screen.getByRole("menuitem", { name: /reset friendster ph progress/i });
    await user.click(resetButton);
    expect(screen.getByRole("alertdialog", { name: /reset friendster ph/i })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(localStorage.getItem("throwback-ph:app:friendster")).toBe("saved");
    expect(resetButton).toHaveFocus();

    await user.click(resetButton);
    await user.click(screen.getByRole("button", { name: /reset friendster ph$/i }));
    expect(localStorage.getItem("throwback-ph:app:friendster")).toBeNull();
    expect(localStorage.getItem("school-project-draft")).toBe("keep");
  });
});
