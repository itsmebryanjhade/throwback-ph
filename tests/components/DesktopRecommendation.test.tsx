import { render, screen } from "@testing-library/react";
import { DesktopRecommendation } from "@/components/shared/DesktopRecommendation";
import { describe, expect, it } from "vitest";

describe("DesktopRecommendation", () => {
  it("gives small-screen visitors an actionable desktop alternative", () => {
    render(<DesktopRecommendation />);

    expect(
      screen.getByText(/desktop or laptop/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("note")).toBeInTheDocument();
    expect(screen.queryByTestId("museum-desktop")).not.toBeInTheDocument();
  });
});
