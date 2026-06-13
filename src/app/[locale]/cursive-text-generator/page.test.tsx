import React from "react";
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getDictionary } from "@/lib/i18n";

const componentCalls = vi.hoisted(() => ({
  cursiveGeneratorPageProps: [] as Array<{ dictionary: unknown; locale: string }>,
  structuredDataProps: [] as Array<{ dictionary: unknown; locale: string }>
}));

vi.mock("next/navigation", () => ({
  permanentRedirect: vi.fn(),
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

import { permanentRedirect, redirect } from "next/navigation";
import CursiveTextGeneratorRoute from "./page";

describe("CursiveTextGeneratorRoute", () => {
  beforeEach(() => {
    vi.mocked(permanentRedirect).mockReset();
    vi.mocked(redirect).mockReset();
    componentCalls.structuredDataProps.length = 0;
    componentCalls.cursiveGeneratorPageProps.length = 0;
  });

  it("permanently redirects the English locale route to the root path", async () => {
    await CursiveTextGeneratorRoute({
      params: Promise.resolve({ locale: "en" })
    });

    expect(permanentRedirect).toHaveBeenCalledTimes(1);
    expect(permanentRedirect).toHaveBeenCalledWith("/");
    expect(redirect).not.toHaveBeenCalled();
  });

  it("renders Chinese structured data and generator page in a React Fragment", async () => {
    const routeElement = await CursiveTextGeneratorRoute({
      params: Promise.resolve({ locale: "zh" })
    });

    expect(routeElement.type).toBe(React.Fragment);

    render(routeElement);

    expect(componentCalls.structuredDataProps).toEqual([
      { dictionary: getDictionary("zh"), locale: "zh" }
    ]);
    expect(componentCalls.cursiveGeneratorPageProps).toEqual([
      { dictionary: getDictionary("zh"), locale: "zh" }
    ]);
  });
});
