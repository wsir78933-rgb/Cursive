import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("renders a multiline textbox and preserves custom classes", () => {
    render(
      <Textarea aria-label="Message" className="min-h-32 text-lg" defaultValue="hello" />
    );

    const textarea = screen.getByRole("textbox", { name: "Message" });

    expect(textarea.tagName).toBe("TEXTAREA");
    expect(textarea).toHaveClass("min-h-32");
    expect(textarea).toHaveClass("text-lg");
  });
});
