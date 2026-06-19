import React from "react";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GeneratorHeader } from "./generator-header";
import { getDictionary } from "@/lib/i18n";

describe("GeneratorHeader", () => {
  it("uses the shared favicon asset for the brand icon", () => {
    render(<GeneratorHeader dictionary={getDictionary("en")} locale="en" />);

    const brandIcon = screen.getByRole("img", { name: "Cursive Generator icon" });

    expect(brandIcon).toHaveAttribute("src", "/icon.svg");
    expect(brandIcon).toHaveClass("h-9");
    expect(brandIcon).toHaveClass("w-9");
  });

  it("links English navigation directly to canonical root URLs", () => {
    render(<GeneratorHeader dictionary={getDictionary("en")} locale="en" />);

    expect(screen.getByRole("link", { name: /Cursive Generator/i })).toHaveAttribute(
      "href",
      "/"
    );
    expect(screen.getByRole("link", { name: "FAQ" })).toHaveAttribute("href", "/#faq");
    expect(screen.getByRole("link", { name: "中文" })).toHaveAttribute(
      "href",
      "/zh/cursive-text-generator"
    );
  });

  it("links the Chinese language switch directly to the English canonical root", () => {
    render(<GeneratorHeader dictionary={getDictionary("zh")} locale="zh" />);

    expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute("href", "/");
  });

  it("adds the animated border only to the language switch link", () => {
    render(<GeneratorHeader dictionary={getDictionary("en")} locale="en" />);

    const faqLink = screen.getByRole("link", { name: "FAQ" });
    const languageSwitchLink = screen.getByRole("link", { name: "中文" });

    expect(within(languageSwitchLink).getByTestId("animated-button-border")).toBeInTheDocument();
    expect(within(faqLink).queryByTestId("animated-button-border")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("animated-button-border")).toHaveLength(1);
  });

  it("keeps the Chinese header language switch link animated and semantic", () => {
    render(<GeneratorHeader dictionary={getDictionary("zh")} locale="zh" />);

    const languageSwitchLink = screen.getByRole("link", { name: "EN" });

    expect(languageSwitchLink).toHaveAttribute("href", "/");
    expect(within(languageSwitchLink).getByTestId("animated-button-border")).toBeInTheDocument();
    expect(screen.getAllByTestId("animated-button-border")).toHaveLength(1);
  });
});
