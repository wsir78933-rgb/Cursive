export type Locale = "en" | "zh";

type Dictionary = {
  title: string;
  brand: string;
  inputLabel: string;
  inputCharacterCount: {
    suggestedPrefix: string;
    suggestedSuffix: string;
  };
  hero: {
    eyebrow: string;
    description: string;
  };
  workbench: {
    selectedStyleTitle: string;
    settingsTitle: string;
    previewOnlyHint: string;
    copyableHint: string;
  };
  contentSections: {
    howItWorks: {
      title: string;
      steps: string[];
    };
    useCases: {
      title: string;
      description: string;
      items: string[];
    };
    copyableVsPreview: {
      title: string;
      description: string;
    };
  };
  controls: {
    size: string;
    color: string;
    transparent: string;
    customColor: string;
  };
  actions: {
    clear: string;
    copy: string;
    copied: string;
    copyFailed: string;
    save: string;
    preview: string;
  };
  filters: {
    all: string;
    social: string;
    googleDocsDefault: string;
    googleDocsInstallable: string;
    msWord: string;
  };
  filtersShort: {
    all: string;
    social: string;
    googleDocsDefault: string;
    googleDocsInstallable: string;
    msWord: string;
  };
  styleStatus: {
    selectedLabel: string;
    copyable: string;
    previewOnly: string;
    bestForSocial: string;
    bestForGoogleDocs: string;
    bestForInstallable: string;
    bestForWord: string;
    bestForGeneral: string;
    cardCopy: string;
    cardCopied: string;
  };
  preview: {
    title: string;
    description: string;
  };
  faq: {
    title: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
};

export function normalizeLocale(locale: string | undefined): Locale {
  return locale === "zh" ? "zh" : "en";
}

const dictionaries: Record<Locale, Dictionary> = {
  en: {
    title: "Cursive Text Generator",
    brand: "Cursive Generator",
    inputLabel: "Your text",
    inputCharacterCount: {
      suggestedPrefix: "Suggested",
      suggestedSuffix: "characters or fewer"
    },
    hero: {
      eyebrow: "Online cursive font generator",
      description:
        "Use this cursive generator to create cursive text fonts you can copy and paste into social bios, messages, documents, signatures, invitations, and images."
    },
    workbench: {
      selectedStyleTitle: "Selected style",
      settingsTitle: "Text settings",
      previewOnlyHint: "Save as PNG to keep this font style looking identical everywhere.",
      copyableHint: "Copy this Unicode cursive text for social apps, bios, and messages."
    },
    contentSections: {
      howItWorks: {
        title: "How to use the cursive generator",
        steps: [
          "Type the text you want to style.",
          "Choose a copyable cursive style or preview-only font from the library.",
          "Copy and paste the generated cursive text, or save the preview as a PNG."
        ]
      },
      useCases: {
        title: "Where to use copy and paste cursive text",
        description:
          "Use cursive text for social bios, short messages, document headings, names, signature-style text, invitations, image graphics, and decorative details.",
        items: ["Social bios", "Messages", "Documents", "Names", "Signatures", "Images"]
      },
      copyableVsPreview: {
        title: "Copyable cursive text vs font preview",
        description:
          "The cursive generator includes Unicode styles that copy as decorative characters. Google, system, and Word fonts preview the visual style, so saving a PNG is the reliable way to preserve their exact look."
      }
    },
    controls: {
      size: "Size",
      color: "Color",
      transparent: "Transparent background",
      customColor: "Custom color"
    },
    actions: {
      clear: "Clear",
      copy: "Copy",
      copied: "Copied",
      copyFailed: "Copy failed",
      save: "Save",
      preview: "Preview"
    },
    filters: {
      all: "All",
      social: "Instagram/TikTok/Youtube",
      googleDocsDefault: "Google Docs (Default)",
      googleDocsInstallable: "Google Docs (Installable)",
      msWord: "MS Word"
    },
    filtersShort: {
      all: "All",
      social: "Social",
      googleDocsDefault: "Docs",
      googleDocsInstallable: "Install",
      msWord: "Word"
    },
    styleStatus: {
      selectedLabel: "Selected style",
      copyable: "Copyable",
      previewOnly: "Preview only",
      bestForSocial: "Best for Instagram/TikTok/Youtube",
      bestForGoogleDocs: "Best for Google Docs",
      bestForInstallable: "Installable Google font",
      bestForWord: "Best for MS Word",
      bestForGeneral: "General preview style",
      cardCopy: "Copy this style",
      cardCopied: "Copied"
    },
    preview: {
      title: "Style preview",
      description: "Preview uses the selected text, font, size, color, and background setting."
    },
    faq: {
      title: "Compatibility guide for cursive text",
      items: [
        {
          question: "Which cursive text styles can I copy and paste?",
          answer:
            "Unicode styles copy as decorative cursive characters and work best across social apps, messages, and bios."
        },
        {
          question: "Which styles are preview-only?",
          answer:
            "Google Fonts, system fonts, and Word fonts copy the original text. Use Preview or Save PNG to keep their exact look."
        },
        {
          question: "When should I save cursive text as a PNG?",
          answer:
            "Save a PNG when you need the style to look identical everywhere, especially for non-Unicode font styles."
        }
      ]
    }
  },
  zh: {
    title: "花体英文生成器",
    brand: "花体生成器",
    inputLabel: "输入文本",
    inputCharacterCount: {
      suggestedPrefix: "建议",
      suggestedSuffix: "字以内"
    },
    hero: {
      eyebrow: "在线花体字体生成器",
      description: "生成适合社交资料、文档、邀请函和图片的花体文字。"
    },
    workbench: {
      selectedStyleTitle: "当前样式",
      settingsTitle: "文本设置",
      previewOnlyHint: "保存为 PNG 可以让这个字体样式在不同平台保持一致。",
      copyableHint: "复制 Unicode 花体字符，适合社媒简介、消息和昵称。"
    },
    contentSections: {
      howItWorks: {
        title: "使用方法",
        steps: ["输入要转换的文字。", "从字体库选择花体样式。", "复制 Unicode 花体，或保存预览 PNG。"]
      },
      useCases: {
        title: "花体文字可以用在哪里？",
        description: "花体文字适合社媒简介、短消息、文档标题、邀请函、图片文字和签名风格装饰。",
        items: ["社媒简介", "消息", "文档", "邀请函", "图片"]
      },
      copyableVsPreview: {
        title: "可复制花体与字体预览的区别",
        description:
          "Unicode 样式会复制成装饰字符。Google 字体、系统字体和 Word 字体主要用于视觉预览，保存 PNG 才能稳定保留它们的外观。"
      }
    },
    controls: {
      size: "字号",
      color: "颜色",
      transparent: "透明背景",
      customColor: "自定义颜色"
    },
    actions: {
      clear: "清空",
      copy: "复制",
      copied: "已复制",
      copyFailed: "复制失败",
      save: "保存",
      preview: "预览"
    },
    filters: {
      all: "全部",
      social: "Instagram/TikTok/Youtube",
      googleDocsDefault: "Google Docs（默认字体）",
      googleDocsInstallable: "Google Docs（可安装字体）",
      msWord: "MS Word"
    },
    filtersShort: {
      all: "全部",
      social: "社媒",
      googleDocsDefault: "文档",
      googleDocsInstallable: "安装",
      msWord: "Word"
    },
    styleStatus: {
      selectedLabel: "当前样式",
      copyable: "可复制花体",
      previewOnly: "仅预览保真",
      bestForSocial: "适合 Instagram/TikTok/Youtube",
      bestForGoogleDocs: "适合 Google Docs",
      bestForInstallable: "Google 可安装字体",
      bestForWord: "适合 MS Word",
      bestForGeneral: "通用预览样式",
      cardCopy: "复制这个样式",
      cardCopied: "已复制"
    },
    preview: {
      title: "样式预览",
      description: "预览会使用当前文本、字体、字号、颜色和背景设置。"
    },
    faq: {
      title: "兼容性说明",
      items: [
        {
          question: "哪些样式复制后还是花体？",
          answer: "Unicode 样式会复制成真正的装饰字符，适合社媒简介、消息、昵称和评论。"
        },
        {
          question: "哪些样式只是预览保真？",
          answer:
            "Google 字体、系统字体和 Word 字体复制的是原文，需要预览或保存 PNG 才能保留视觉效果。"
        },
        {
          question: "什么时候应该保存 PNG？",
          answer: "当你需要不同平台显示完全一致时，尤其是非 Unicode 字体样式，应该直接保存 PNG。"
        }
      ]
    }
  }
};

export function getDictionary(locale: string | undefined): Dictionary {
  return dictionaries[normalizeLocale(locale)];
}
