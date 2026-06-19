import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import { getDictionary } from "@/lib/i18n";
import type { StyleFilter } from "@/lib/text-styles";

import { StyleFilterTabs } from "./style-filter-tabs";

const filterOptions: Array<{
  value: StyleFilter;
  labelKey: "all" | "social" | "googleDocsDefault" | "googleDocsInstallable" | "msWord";
}> = [
  { value: "all", labelKey: "all" },
  { value: "social", labelKey: "social" },
  { value: "google-docs-default", labelKey: "googleDocsDefault" },
  { value: "google-docs-installable", labelKey: "googleDocsInstallable" },
  { value: "ms-word", labelKey: "msWord" }
];

describe("StyleFilterTabs", () => {
  test("renders all filter options", () => {
    render(
      <StyleFilterTabs
        dictionary={getDictionary("en")}
        filterOptions={filterOptions}
        onFilterChange={vi.fn()}
        selectedFilter="all"
      />
    );

    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Instagram/TikTok/Youtube" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Google Docs (Default)" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Google Docs (Installable)" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "MS Word" })).toBeInTheDocument();
  });

  test("calls onFilterChange with clicked value", () => {
    const handleFilterChange = vi.fn();

    render(
      <StyleFilterTabs
        dictionary={getDictionary("en")}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
        selectedFilter="all"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "MS Word" }));

    expect(handleFilterChange).toHaveBeenCalledWith("ms-word");
  });

  test("labels the style filter section", () => {
    render(
      <StyleFilterTabs
        dictionary={getDictionary("en")}
        filterOptions={filterOptions}
        onFilterChange={vi.fn()}
        selectedFilter="all"
      />
    );

    expect(screen.getByRole("region", { name: "Cursive style filters" })).toHaveClass(
      "max-w-7xl"
    );
  });
});
