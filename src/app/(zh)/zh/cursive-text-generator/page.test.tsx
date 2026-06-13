import React from "react";
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getDictionary } from "@/lib/i18n";

const componentCalls = vi.hoisted(() => ({
  cursiveGeneratorPageProps: [] as Array<{ dictionary: unknown; locale: string }>,
  structuredDataProps: [] as Array<{ dictionary: unknown; locale: string }>
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

import ChineseCursiveTextGeneratorPage, { metadata } from "./page";

describe("ChineseCursiveTextGeneratorPage", () => {
  beforeEach(() => {
    componentCalls.structuredDataProps.length = 0;
    componentCalls.cursiveGeneratorPageProps.length = 0;
  });

  it("renders Chinese structured data and generator page in a React Fragment", () => {
    const routeElement = ChineseCursiveTextGeneratorPage();

    expect(routeElement.type).toBe(React.Fragment);

    render(routeElement);

    expect(componentCalls.structuredDataProps).toEqual([
      { dictionary: getDictionary("zh"), locale: "zh" }
    ]);
    expect(componentCalls.cursiveGeneratorPageProps).toEqual([
      { dictionary: getDictionary("zh"), locale: "zh" }
    ]);
  });

  it("exports Chinese canonical metadata with hreflang alternates", () => {
    expect(metadata.metadataBase?.toString()).toBe("https://cursivegenerator.pro/");
    expect(metadata.title).toBe("花体英文生成器");
    expect(metadata.description).toBe("输入文本，选择花体样式，复制、预览或保存为 PNG。");
    expect(metadata.alternates?.canonical).toBe(
      "https://cursivegenerator.pro/zh/cursive-text-generator"
    );
    expect(metadata.alternates?.languages).toEqual({
      en: "https://cursivegenerator.pro",
      zh: "https://cursivegenerator.pro/zh/cursive-text-generator",
      "x-default": "https://cursivegenerator.pro"
    });
    expect(metadata.openGraph).toEqual({
      title: "花体英文生成器",
      description: "输入文本，选择花体样式，复制、预览或保存为 PNG。",
      url: "https://cursivegenerator.pro/zh/cursive-text-generator",
      siteName: "Cursive Generator",
      type: "website",
      locale: "zh_CN",
      alternateLocale: "en_US",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Cursive Generator - Create Cursive Text Online for Free"
        }
      ]
    });
    expect(metadata.twitter).toEqual({
      card: "summary_large_image",
      title: "花体英文生成器",
      description: "输入文本，选择花体样式，复制、预览或保存为 PNG。",
      images: ["/og-image.png"]
    });
  });
});
