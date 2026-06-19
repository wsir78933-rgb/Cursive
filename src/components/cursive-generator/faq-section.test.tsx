import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FaqSection } from "./faq-section";
import { getDictionary } from "@/lib/i18n";

describe("FaqSection", () => {
  it("preserves the FAQ anchor and renders English FAQ items as accordion triggers", () => {
    const dictionary = getDictionary("en");
    const firstFaqItem = dictionary.faq.items[0];
    const { container } = render(<FaqSection dictionary={dictionary} />);

    expect(container.querySelector("#faq")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: dictionary.faq.title })).toBeInTheDocument();

    const firstQuestion = screen.getByRole("button", {
      name: firstFaqItem.question
    });
    const firstFaqPanel = firstQuestion.closest("[data-state]");

    expect(firstQuestion).toHaveAttribute("aria-expanded", "false");

    fireEvent.mouseEnter(firstFaqPanel!);

    expect(firstQuestion).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(firstFaqItem.answer)).toBeInTheDocument();

    fireEvent.mouseLeave(firstFaqPanel!);

    expect(firstQuestion).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(firstQuestion);

    expect(firstQuestion).toHaveAttribute("aria-expanded", "true");
  });

  it("renders Chinese FAQ items from the dictionary", () => {
    const dictionary = getDictionary("zh");

    render(<FaqSection dictionary={dictionary} />);

    expect(screen.getByRole("heading", { name: dictionary.faq.title })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: dictionary.faq.items[0].question })
    ).toBeInTheDocument();
  });
});
