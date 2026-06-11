import React from "react";
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getDictionary } from "@/lib/i18n";

const componentCalls = vi.hoisted(() => ({
  cursiveGeneratorPageProps: [] as Array<{ dictionary: unknown; locale: string }>,
  structuredDataProps: [] as Array<{ dictionary: unknown; locale: string }>
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn()
}));

vi.mock("@/components/seo/structured-data", () => ({
  StructuredData: vi.fn((props: { dictionary: unknown; locale: string }) => {
    componentCalls.structuredDataProps.push(props);
    return null;
  })
}));

vi.mock("@/components/cursive-generator/cursive-generator-page", () => ({
  CursiveGeneratorPage: vi.fn((props: { dictionary: unknown; locale: string }) => {
    componentCalls.cursiveGeneratorPageProps.push(props);
    return null;
  })
}));

import HomePage, { metadata } from "./page";

describe("HomePage", () => {
  beforeEach(() => {
    componentCalls.structuredDataProps.length = 0;
    componentCalls.cursiveGeneratorPageProps.length = 0;
  });

  it("renders English structured data and generator page", () => {
    render(<HomePage />);

    expect(componentCalls.structuredDataProps).toEqual([
      { dictionary: getDictionary("en"), locale: "en" }
    ]);
    expect(componentCalls.cursiveGeneratorPageProps).toEqual([
      { dictionary: getDictionary("en"), locale: "en" }
    ]);
  });

  it("exports root English canonical metadata with hreflang alternates", () => {
    expect(metadata.metadataBase?.toString()).toBe("https://cursivegenerator.pro/");
    expect(metadata.title).toBe("Cursive Generator - Copy and Paste Cursive Text Fonts");
    expect(metadata.description).toBe(
      "Use this free cursive generator to create cursive text fonts you can copy and paste for social bios, messages, documents, signatures, and images."
    );
    expect(metadata.alternates?.canonical).toBe("https://cursivegenerator.pro/");
    expect(metadata.alternates?.languages).toEqual({
      en: "https://cursivegenerator.pro/",
      zh: "https://cursivegenerator.pro/zh/cursive-text-generator",
      "x-default": "https://cursivegenerator.pro/"
    });
  });
});
