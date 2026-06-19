import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "./accordion";

describe("Accordion", () => {
  it("opens and collapses an item with accessible trigger state", () => {
    render(
      <Accordion collapsible type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>Question one</AccordionTrigger>
          <AccordionContent>Answer one</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByRole("button", { name: "Question one" });

    expect(trigger).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("targets only the wrapper-owned trailing chevron for rotation", () => {
    const { container } = render(
      <Accordion collapsible type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <svg aria-hidden="true" data-testid="custom-icon" />
            Question one
          </AccordionTrigger>
          <AccordionContent>Answer one</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByRole("button", { name: "Question one" });
    const triggerSvgs = container.querySelectorAll("button > svg");

    expect(trigger).toHaveClass("[&[data-state=open]>svg:last-child]:rotate-180");
    expect(triggerSvgs).toHaveLength(2);
    expect(triggerSvgs[0]).toHaveAttribute("data-testid", "custom-icon");
    expect(triggerSvgs[1]).not.toHaveAttribute("data-testid", "custom-icon");
  });

  it("applies custom content classes to the Radix content root", () => {
    render(
      <Accordion defaultValue="item-1" type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>Question one</AccordionTrigger>
          <AccordionContent className="custom-root-class">
            Answer one
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const contentInner = screen.getByText("Answer one");
    const contentRoot = contentInner.closest("[data-state]");

    expect(contentRoot).toHaveClass(
      "overflow-hidden",
      "text-sm",
      "custom-root-class"
    );
    expect(contentInner).toHaveClass("pb-5", "pt-0");
    expect(contentInner).not.toHaveClass("custom-root-class");
  });
});
