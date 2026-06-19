import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AnimatedButtonBorder } from "./animated-button-border";

describe("AnimatedButtonBorder", () => {
  it("renders an inert visual border layer", () => {
    render(<AnimatedButtonBorder />);

    const borderLayer = screen.getByTestId("animated-button-border");

    expect(borderLayer).toHaveAttribute("aria-hidden", "true");
    expect(borderLayer).toHaveClass("pointer-events-none");
    expect(borderLayer).toHaveClass("absolute");
  });
});
