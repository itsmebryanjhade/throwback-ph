import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ChatArchives } from "@/components/experiences/ChatArchives";
import { chatThreads } from "@/content/messages";

describe("ChatArchives", () => {
  it("starts in Yahoo Messenger and switches to mIRC with accessible tabs", async () => {
    const user = userEvent.setup();
    render(<ChatArchives threads={chatThreads} />);
    expect(screen.getByRole("tab", { name: "Yahoo! Messenger" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText(/sent a BUZZ/i)).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "mIRC" }));
    expect(screen.getByRole("tab", { name: "mIRC" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText(/joined #pinoytambayan/i)).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("switches views with arrow keys", async () => {
    const user = userEvent.setup();
    render(<ChatArchives threads={chatThreads} />);
    screen.getByRole("tab", { name: "Yahoo! Messenger" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "mIRC" })).toHaveAttribute("aria-selected", "true");
  });
});
