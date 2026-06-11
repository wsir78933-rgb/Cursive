import { describe, expect, it } from "vitest";

import { getDictionary, normalizeLocale } from "./i18n";

describe("normalizeLocale", () => {
  it("accepts supported locale strings", () => {
    expect(normalizeLocale("en")).toBe("en");
    expect(normalizeLocale("zh")).toBe("zh");
  });

  it("falls back to English for unsupported locale strings", () => {
    expect(normalizeLocale("fr")).toBe("en");
    expect(normalizeLocale(undefined)).toBe("en");
  });
});

describe("getDictionary", () => {
  it("provides complete English labels for the generator actions", () => {
    const dictionary = getDictionary("en");

    expect(dictionary.title).toBe("Cursive Text Generator");
    expect(dictionary.actions.copy).toBe("Copy");
    expect(dictionary.filters.googleDocsInstallable).toBe("Google Docs (Installable)");
  });

  it("provides complete Chinese labels for the generator actions", () => {
    const dictionary = getDictionary("zh");

    expect(dictionary.title).toBe("花体英文生成器");
    expect(dictionary.actions.copy).toBe("复制");
    expect(dictionary.filters.googleDocsInstallable).toBe("Google Docs（可安装字体）");
  });

  it("provides English labels for the redesigned workbench", () => {
    const dictionary = getDictionary("en");

    expect(dictionary.hero.eyebrow).toBe("Online cursive font generator");
    expect(dictionary.hero.description).toBe(
      "Use this cursive generator to create cursive text fonts you can copy and paste into social bios, messages, documents, signatures, invitations, and images."
    );
    expect(dictionary.workbench.settingsTitle).toBe("Text settings");
    expect(dictionary.inputCharacterCount.suggestedPrefix).toBe("Suggested");
    expect(dictionary.inputCharacterCount.suggestedSuffix).toBe("characters or fewer");
    expect(dictionary.workbench.selectedStyleTitle).toBe("Selected style");
    expect(dictionary.contentSections.howItWorks.title).toBe(
      "How to use the cursive generator"
    );
    expect(dictionary.contentSections.copyableVsPreview.title).toBe(
      "Copyable cursive text vs font preview"
    );
  });

  it("provides Chinese labels for the redesigned workbench", () => {
    const dictionary = getDictionary("zh");

    expect(dictionary.hero.eyebrow).toBe("在线花体字体生成器");
    expect(dictionary.hero.description).toBe(
      "生成适合社交资料、文档、邀请函和图片的花体文字。"
    );
    expect(dictionary.workbench.settingsTitle).toBe("文本设置");
    expect(dictionary.inputCharacterCount.suggestedPrefix).toBe("建议");
    expect(dictionary.inputCharacterCount.suggestedSuffix).toBe("字以内");
    expect(dictionary.workbench.selectedStyleTitle).toBe("当前样式");
    expect(dictionary.contentSections.howItWorks.title).toBe("使用方法");
    expect(dictionary.contentSections.copyableVsPreview.title).toBe(
      "可复制花体与字体预览的区别"
    );
  });
});
