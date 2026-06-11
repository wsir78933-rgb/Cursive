import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "./button";

describe("Button", () => {
  it("does not add global translate motion that conflicts with positioned buttons", () => {
    render(<Button className="absolute top-1/2 -translate-y-1/2">Clear</Button>);

    const button = screen.getByRole("button", { name: "Clear" });

    expect(button).toHaveClass("-translate-y-1/2");
    expect(button.className).not.toContain("hover:-translate");
    expect(button.className).not.toContain("active:translate");
  });
});
