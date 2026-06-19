import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FaqSection } from "./faq-section";
import { getDictionary } from "@/lib/i18n";

describe("FaqSection", () => {
  it("preserves the FAQ anchor and renders English FAQ answers as visible static body copy", () => {
    const dictionary = getDictionary("en");
    const firstFaqItem = dictionary.faq.items[0];
    const { container } = render(<FaqSection dictionary={dictionary} />);

    expect(container.querySelector("#faq")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: dictionary.faq.title })).toBeInTheDocument();

    expect(screen.queryByRole("button", { name: firstFaqItem.question })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: firstFaqItem.question })).toBeInTheDocument();

    const firstAnswer = screen.getByText(firstFaqItem.answer);

    expect(firstAnswer).toBeVisible();
    expect(firstAnswer.tagName.toLowerCase()).toBe("p");
    expect(firstAnswer.closest("[data-state]")).not.toBeInTheDocument();
  });

  it("renders Chinese FAQ questions and answers from the dictionary", () => {
    const dictionary = getDictionary("zh");
    const firstFaqItem = dictionary.faq.items[0];

    render(<FaqSection dictionary={dictionary} />);

    expect(screen.getByRole("heading", { name: dictionary.faq.title })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: firstFaqItem.question })).toBeInTheDocument();
    expect(screen.getByText(firstFaqItem.answer)).toBeVisible();
  });
});
