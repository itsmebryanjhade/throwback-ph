import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { NokiaInbox } from "@/components/experiences/NokiaInbox";
import { smsMessages } from "@/content/messages";

describe("NokiaInbox", () => {
  it("opens and closes a message with keyboard controls while restoring focus", async () => {
    const user = userEvent.setup();
    render(<NokiaInbox messages={smsMessages} />);
    const edsa = screen.getByRole("button", { name: /Forwarded.*EDSA update/i });
    edsa.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByText(/people are gathering at EDSA/i)).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.getByRole("button", { name: /Forwarded.*EDSA update/i })).toHaveFocus();
  });

  it("opens a message by pointer and returns with the Back control", async () => {
    const user = userEvent.setup();
    render(<NokiaInbox messages={smsMessages} />);
    await user.click(screen.getByRole("button", { name: /Barkada.*Comp shop tayo/i }));
    expect(screen.getByText(/Dala ka barya/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /back to inbox/i }));
    expect(screen.getByText(/4 messages/i)).toBeInTheDocument();
  });
});
