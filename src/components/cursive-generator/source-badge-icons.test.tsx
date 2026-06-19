import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SourceBadgeIcons } from "./source-badge-icons";

describe("SourceBadgeIcons", () => {
  it("renders social platform icons for Instagram, TikTok, and YouTube badges", () => {
    render(<SourceBadgeIcons badges={["IG", "TT", "YT"]} isSelected={false} />);

    expect(
      screen.getByRole("img", {
        name: "Recommended platforms: Instagram, TikTok, YouTube"
      })
    ).toHaveClass("text-ink");
    expect(screen.getByTestId("source-icon-instagram")).toBeInTheDocument();
    expect(screen.getByTestId("source-icon-tiktok")).toBeInTheDocument();
    expect(screen.getByTestId("source-icon-youtube")).toBeInTheDocument();
  });

  it("renders Google icon for Google badge", () => {
    render(<SourceBadgeIcons badges={["G"]} isSelected={false} />);

    expect(
      screen.getByRole("img", {
        name: "Recommended platforms: Google"
      })
    ).toBeInTheDocument();
    expect(screen.getByText("G")).toBeInTheDocument();
  });

  it("renders Word document icon for Word badge", () => {
    render(<SourceBadgeIcons badges={["W"]} isSelected={false} />);

    expect(
      screen.getByRole("img", {
        name: "Recommended platforms: Word"
      })
    ).toBeInTheDocument();
  });

  it("keeps icon color unchanged when selected", () => {
    render(<SourceBadgeIcons badges={["IG"]} isSelected={true} />);

    expect(
      screen.getByRole("img", {
        name: "Recommended platforms: Instagram"
      })
    ).toHaveClass("text-ink");
  });

  it("renders nothing when badges are empty", () => {
    const { container } = render(<SourceBadgeIcons badges={[]} isSelected={false} />);

    expect(container.firstChild).toBeNull();
  });

  it("throws for unsupported source badge icon", () => {
    expect(() =>
      render(<SourceBadgeIcons badges={["ABC" as never]} isSelected={false} />)
    ).toThrow("Unsupported source badge icon: ABC");
  });
});
