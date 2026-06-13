import { describe, expect, it } from "vitest";

import { generateMetadata } from "./layout";

describe("generateMetadata", () => {
  it("sets Chinese metadata base, canonical URL, and language alternates", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "zh" })
    });

    expect(metadata.metadataBase?.toString()).toBe("https://cursivegenerator.pro/");
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
          alt: "Cursive Generator - Copy and Paste Cursive Text Fonts"
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

  it("uses the English canonical URL for unsupported locale fallback", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "fr" })
    });

    expect(metadata.alternates?.canonical).toBe("https://cursivegenerator.pro");
  });
});
