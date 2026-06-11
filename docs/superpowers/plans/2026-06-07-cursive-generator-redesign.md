# Cursive Generator Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Cursive Generator page into a mature light font-workbench interface with a clear hero, main preview panel, settings panel, lightweight filter tabs, compact font library, and richer content/FAQ section.

**Architecture:** Keep `CursiveGeneratorPage` as the state coordinator and move presentation into focused components. Preserve existing text transformation, compatibility, filtering, clipboard, and PNG export behavior. Add only the UI text and components needed for the approved design; do not add new product features beyond the redesign.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Radix UI primitives, lucide-react, Vitest, Testing Library.

**Repository note:** The current project directory is not a git repository, so this plan uses local checkpoints instead of `git commit` steps. If the project is later initialized as a git repo, commit after each task using the changed files listed in that task.

---

## File Structure

### Files to modify

- `src/lib/i18n.ts`
  - Add hero, workbench, content-section, and clearer action labels in both English and Chinese dictionaries.

- `src/lib/i18n.test.ts`
  - Add tests proving the new dictionary fields exist for both locales.

- `src/app/globals.css`
  - Replace the page-wide grid/toy background with a refined light background.

- `src/components/ui/button.tsx`
  - Replace thick border and hard shadow button styling with softer production-grade button variants.

- `src/components/ui/input.tsx`
  - Replace thick input borders and hard shadow with softer input styling.

- `src/components/ui/slider.tsx`
  - Replace square heavy slider with a refined rounded slider.

- `src/components/cursive-generator/generator-toolbar.tsx`
  - Redesign as a light settings panel for size, color, background, and clear action.

- `src/components/cursive-generator/font-card.tsx`
  - Redesign card as compact font library item.

- `src/components/cursive-generator/font-grid.tsx`
  - Adjust grid width, spacing, and section wrapper.

- `src/components/cursive-generator/preview-dialog.tsx`
  - Lighten visual styling so it matches the new workbench.

- `src/components/cursive-generator/faq-section.tsx`
  - Replace thin three-card FAQ-only bottom with mature content sections plus FAQ.

- `src/components/cursive-generator/cursive-generator-page.tsx`
  - Replace old header, title block, selected style bar, and radio filter block with the new page composition.
  - Keep state and behavior intact.

### Files to create

- `src/components/cursive-generator/generator-header.tsx`
  - Header navigation and locale switch.

- `src/components/cursive-generator/style-preview-panel.tsx`
  - Main selected-style preview card with copy/save/preview actions.

- `src/components/cursive-generator/style-filter-tabs.tsx`
  - Lightweight filter tab UI replacing visually heavy radio labels.

- `src/components/cursive-generator/style-labels.ts`
  - Shared pure label helpers for copy mode and platform recommendation.

- `src/components/cursive-generator/style-labels.test.ts`
  - Tests for label helpers.

- `src/components/cursive-generator/style-preview-panel.test.tsx`
  - Component tests for the preview panel actions and visual text.

- `src/components/cursive-generator/style-filter-tabs.test.tsx`
  - Component tests for filter tab rendering and selection callback.

---

## Task 1: Expand i18n dictionary for the redesigned page

**Files:**
- Modify: `src/lib/i18n.ts`
- Modify: `src/lib/i18n.test.ts`

- [ ] **Step 1: Write failing dictionary tests**

Add these assertions to `src/lib/i18n.test.ts` inside the existing `describe("getDictionary", () => { ... })` block:

```ts
  it("provides English labels for the redesigned workbench", () => {
    const dictionary = getDictionary("en");

    expect(dictionary.hero.description).toBe(
      "Create elegant cursive text for social profiles, documents, invitations, and images."
    );
    expect(dictionary.workbench.settingsTitle).toBe("Text settings");
    expect(dictionary.workbench.selectedStyleTitle).toBe("Selected style");
    expect(dictionary.contentSections.howItWorks.title).toBe("How it works");
    expect(dictionary.contentSections.copyableVsPreview.title).toBe(
      "Copyable cursive vs font preview"
    );
  });

  it("provides Chinese labels for the redesigned workbench", () => {
    const dictionary = getDictionary("zh");

    expect(dictionary.hero.description).toBe(
      "生成适合社交资料、文档、邀请函和图片的花体文字。"
    );
    expect(dictionary.workbench.settingsTitle).toBe("文本设置");
    expect(dictionary.workbench.selectedStyleTitle).toBe("当前样式");
    expect(dictionary.contentSections.howItWorks.title).toBe("使用方法");
    expect(dictionary.contentSections.copyableVsPreview.title).toBe(
      "可复制花体与字体预览的区别"
    );
  });
```

- [ ] **Step 2: Run the failing tests**

Run:

```bash
npm run test -- src/lib/i18n.test.ts
```

Expected result: FAIL because `hero`, `workbench`, and `contentSections` do not exist on the dictionary type.

- [ ] **Step 3: Extend the Dictionary type**

In `src/lib/i18n.ts`, update `type Dictionary` by adding these fields after `inputLabel: string;`:

```ts
  hero: {
    description: string;
  };
  workbench: {
    selectedStyleTitle: string;
    settingsTitle: string;
    previewOnlyHint: string;
    copyableHint: string;
  };
```

Add this field before `faq`:

```ts
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
```

- [ ] **Step 4: Add English dictionary values**

In the English dictionary object, add this after `inputLabel: "Your text",`:

```ts
    hero: {
      description:
        "Create elegant cursive text for social profiles, documents, invitations, and images."
    },
    workbench: {
      selectedStyleTitle: "Selected style",
      settingsTitle: "Text settings",
      previewOnlyHint: "Save as PNG to keep this font style looking identical everywhere.",
      copyableHint: "Copy this Unicode cursive text for social apps, bios, and messages."
    },
```

Add this before `faq: {`:

```ts
    contentSections: {
      howItWorks: {
        title: "How it works",
        steps: [
          "Type the text you want to style.",
          "Choose a cursive style from the font library.",
          "Copy Unicode cursive text or save the preview as a PNG."
        ]
      },
      useCases: {
        title: "Where can you use cursive text?",
        description:
          "Use cursive text for social profiles, short messages, document headings, invitations, image graphics, and signature-style details.",
        items: ["Social bios", "Messages", "Documents", "Invitations", "Images"]
      },
      copyableVsPreview: {
        title: "Copyable cursive vs font preview",
        description:
          "Unicode styles copy as decorative characters. Google, system, and Word fonts preview the visual style, so saving a PNG is the reliable way to preserve their exact look."
      }
    },
```

- [ ] **Step 5: Add Chinese dictionary values**

In the Chinese dictionary object, add this after `inputLabel: "输入文本",`:

```ts
    hero: {
      description: "生成适合社交资料、文档、邀请函和图片的花体文字。"
    },
    workbench: {
      selectedStyleTitle: "当前样式",
      settingsTitle: "文本设置",
      previewOnlyHint: "保存为 PNG 可以让这个字体样式在不同平台保持一致。",
      copyableHint: "复制 Unicode 花体字符，适合社媒简介、消息和昵称。"
    },
```

Add this before `faq: {`:

```ts
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
```

- [ ] **Step 6: Run dictionary tests**

Run:

```bash
npm run test -- src/lib/i18n.test.ts
```

Expected result: PASS.

- [ ] **Step 7: Local checkpoint**

Run:

```bash
npm run lint
```

Expected result: PASS. If lint reports line-length or formatting issues, fix only the reported lines in `src/lib/i18n.ts` and `src/lib/i18n.test.ts`.

---

## Task 2: Add shared style-label helpers

**Files:**
- Create: `src/components/cursive-generator/style-labels.ts`
- Create: `src/components/cursive-generator/style-labels.test.ts`
- Modify: `src/components/cursive-generator/selected-style-bar.tsx`

- [ ] **Step 1: Write failing helper tests**

Create `src/components/cursive-generator/style-labels.test.ts`:

```ts
import { describe, expect, test } from "vitest";

import { getDictionary } from "@/lib/i18n";
import type { CopyMode, PlatformRecommendation } from "@/lib/style-compatibility";

import { getCopyModeLabel, getPlatformLabel } from "./style-labels";

describe("style label helpers", () => {
  test.each<[CopyMode, string]>([
    ["copyable", "Copyable"],
    ["preview-only", "Preview only"]
  ])("returns English copy mode label for %s", (copyMode, expectedLabel) => {
    expect(getCopyModeLabel(copyMode, getDictionary("en"))).toBe(expectedLabel);
  });

  test.each<[PlatformRecommendation, string]>([
    ["social", "Best for Instagram/TikTok/Youtube"],
    ["google-docs", "Best for Google Docs"],
    ["google-docs-installable", "Installable Google font"],
    ["ms-word", "Best for MS Word"],
    ["general", "General preview style"]
  ])("returns English platform label for %s", (platformRecommendation, expectedLabel) => {
    expect(getPlatformLabel(platformRecommendation, getDictionary("en"))).toBe(expectedLabel);
  });
});
```

- [ ] **Step 2: Run the failing helper tests**

Run:

```bash
npm run test -- src/components/cursive-generator/style-labels.test.ts
```

Expected result: FAIL because `style-labels.ts` does not exist.

- [ ] **Step 3: Create the helper file**

Create `src/components/cursive-generator/style-labels.ts`:

```ts
import type { getDictionary } from "@/lib/i18n";
import type {
  CopyMode,
  PlatformRecommendation
} from "@/lib/style-compatibility";

type Dictionary = ReturnType<typeof getDictionary>;

export function getCopyModeLabel(copyMode: CopyMode, dictionary: Dictionary): string {
  return copyMode === "copyable"
    ? dictionary.styleStatus.copyable
    : dictionary.styleStatus.previewOnly;
}

export function getPlatformLabel(
  platformRecommendation: PlatformRecommendation,
  dictionary: Dictionary
): string {
  if (platformRecommendation === "social") {
    return dictionary.styleStatus.bestForSocial;
  }

  if (platformRecommendation === "google-docs") {
    return dictionary.styleStatus.bestForGoogleDocs;
  }

  if (platformRecommendation === "google-docs-installable") {
    return dictionary.styleStatus.bestForInstallable;
  }

  if (platformRecommendation === "ms-word") {
    return dictionary.styleStatus.bestForWord;
  }

  return dictionary.styleStatus.bestForGeneral;
}
```

- [ ] **Step 4: Update existing selected style bar to use shared helpers**

In `src/components/cursive-generator/selected-style-bar.tsx`, add:

```ts
import { getCopyModeLabel, getPlatformLabel } from "./style-labels";
```

Then remove the local `getCopyModeLabel` and `getPlatformLabel` functions at the bottom of the file.

Update the compatibility import to remove unused types:

```ts
import { getCopyMode, getPlatformRecommendation } from "@/lib/style-compatibility";
```

- [ ] **Step 5: Run helper tests**

Run:

```bash
npm run test -- src/components/cursive-generator/style-labels.test.ts
```

Expected result: PASS.

- [ ] **Step 6: Run lint**

Run:

```bash
npm run lint
```

Expected result: PASS.

---

## Task 3: Lighten global visual primitives

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/ui/button.tsx`
- Modify: `src/components/ui/input.tsx`
- Modify: `src/components/ui/slider.tsx`

- [ ] **Step 1: Replace global body background**

In `src/app/globals.css`, replace the `html` and `body` background rules with:

```css
html {
  min-height: 100%;
  background: #f6f3ee;
}

body {
  min-height: 100%;
  margin: 0;
  background:
    radial-gradient(circle at top left, rgba(10, 143, 124, 0.1), transparent 34rem),
    linear-gradient(180deg, #fffaf3 0, #f6f3ee 34rem, #f8f8f6 100%);
  color: #1c2430;
}
```

- [ ] **Step 2: Replace button primitive classes**

In `src/components/ui/button.tsx`, replace the `buttonVariants` definition with:

```ts
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full border text-sm font-semibold transition-all duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-ink bg-ink text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md",
        accent:
          "border-accent bg-accent text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md",
        outline:
          "border-slate-200 bg-white text-ink shadow-sm hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md",
        ghost:
          "border-transparent bg-transparent text-ink hover:bg-white/70 hover:text-accent"
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3",
        lg: "h-12 px-6"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
```

- [ ] **Step 3: Replace input primitive class**

In `src/components/ui/input.tsx`, replace the class string passed to `cn()` with:

```ts
"flex h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-ink shadow-sm transition-all placeholder:text-slate-400 focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
```

- [ ] **Step 4: Replace slider primitive classes**

In `src/components/ui/slider.tsx`, replace the track and thumb classes with:

```tsx
<SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-200">
  <SliderPrimitive.Range className="absolute h-full bg-accent" />
</SliderPrimitive.Track>
<SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border border-accent bg-white shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50" />
```

- [ ] **Step 5: Run lint**

Run:

```bash
npm run lint
```

Expected result: PASS.

- [ ] **Step 6: Run full tests**

Run:

```bash
npm run test
```

Expected result: PASS.

---

## Task 4: Create redesigned header component

**Files:**
- Create: `src/components/cursive-generator/generator-header.tsx`
- Modify: `src/components/cursive-generator/cursive-generator-page.tsx`

- [ ] **Step 1: Create header component**

Create `src/components/cursive-generator/generator-header.tsx`:

```tsx
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { getDictionary, Locale } from "@/lib/i18n";

type Dictionary = ReturnType<typeof getDictionary>;

type GeneratorHeaderProps = {
  dictionary: Dictionary;
  locale: Locale;
};

export function GeneratorHeader({ dictionary, locale }: GeneratorHeaderProps) {
  const nextLocale = locale === "en" ? "zh" : "en";
  const localeLabel = locale === "en" ? "中文" : "EN";

  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 md:px-8">
      <Link
        className="group flex items-center gap-3 text-base font-semibold text-ink"
        href={`/${locale}/cursive-text-generator`}
      >
        <span className="grid h-9 w-9 place-items-center rounded-2xl bg-ink font-serif text-lg text-white shadow-sm transition group-hover:-translate-y-0.5">
          C
        </span>
        <span>{dictionary.brand}</span>
      </Link>
      <nav className="flex items-center gap-2">
        <Button asChild size="sm" variant="ghost">
          <Link href={`/${locale}/cursive-text-generator#faq`}>FAQ</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href={`/${nextLocale}/cursive-text-generator`}>{localeLabel}</Link>
        </Button>
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Import header in page**

In `src/components/cursive-generator/cursive-generator-page.tsx`, remove:

```ts
import Link from "next/link";
```

Add:

```ts
import { GeneratorHeader } from "./generator-header";
```

- [ ] **Step 3: Replace inline header markup**

In `src/components/cursive-generator/cursive-generator-page.tsx`, replace the existing `<header ...>...</header>` block with:

```tsx
      <GeneratorHeader dictionary={dictionary} locale={locale} />
```

- [ ] **Step 4: Run lint**

Run:

```bash
npm run lint
```

Expected result: PASS.

---

## Task 5: Create main style preview panel

**Files:**
- Create: `src/components/cursive-generator/style-preview-panel.tsx`
- Create: `src/components/cursive-generator/style-preview-panel.test.tsx`

- [ ] **Step 1: Write failing preview panel tests**

Create `src/components/cursive-generator/style-preview-panel.test.tsx`:

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import { getDictionary } from "@/lib/i18n";
import { textStyles } from "@/lib/text-styles";

import { StylePreviewPanel } from "./style-preview-panel";

function findStyle(styleId: string) {
  const textStyle = textStyles.find((style) => style.id === styleId);

  if (!textStyle) {
    throw new Error(`Text style not found: ${styleId}`);
  }

  return textStyle;
}

describe("StylePreviewPanel", () => {
  test("renders selected style, preview text, and copyable hint", () => {
    render(
      <StylePreviewPanel
        copyLabel="Copy"
        dictionary={getDictionary("en")}
        fontSize={48}
        onCopy={vi.fn()}
        onPreview={vi.fn()}
        onSave={vi.fn()}
        previewText="𝒽𝑒𝓁𝓁𝑜"
        selectedStyle={findStyle("unicode-script")}
        textColor="#1c2430"
        transparentBackground={false}
      />
    );

    expect(screen.getByText("Selected style")).toBeInTheDocument();
    expect(screen.getByText("Unicode Script")).toBeInTheDocument();
    expect(screen.getByText("𝒽𝑒𝓁𝓁𝑜")).toBeInTheDocument();
    expect(screen.getByText("Copyable")).toBeInTheDocument();
    expect(
      screen.getByText("Copy this Unicode cursive text for social apps, bios, and messages.")
    ).toBeInTheDocument();
  });

  test("calls action handlers", () => {
    const handleCopy = vi.fn();
    const handleSave = vi.fn();
    const handlePreview = vi.fn();

    render(
      <StylePreviewPanel
        copyLabel="Copy"
        dictionary={getDictionary("en")}
        fontSize={48}
        onCopy={handleCopy}
        onPreview={handlePreview}
        onSave={handleSave}
        previewText="hello"
        selectedStyle={findStyle("dancing-script")}
        textColor="#1c2430"
        transparentBackground
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Copy" }));
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    fireEvent.click(screen.getByRole("button", { name: "Preview" }));

    expect(handleCopy).toHaveBeenCalledTimes(1);
    expect(handleSave).toHaveBeenCalledTimes(1);
    expect(handlePreview).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run failing tests**

Run:

```bash
npm run test -- src/components/cursive-generator/style-preview-panel.test.tsx
```

Expected result: FAIL because `style-preview-panel.tsx` does not exist.

- [ ] **Step 3: Create preview panel component**

Create `src/components/cursive-generator/style-preview-panel.tsx`:

```tsx
"use client";

import { Copy, Download, Eye } from "lucide-react";

import { getCopyModeLabel, getPlatformLabel } from "./style-labels";
import { Button } from "@/components/ui/button";
import type { getDictionary } from "@/lib/i18n";
import { getCopyMode, getPlatformRecommendation } from "@/lib/style-compatibility";
import type { TextStyle } from "@/lib/text-styles";

type Dictionary = ReturnType<typeof getDictionary>;

type StylePreviewPanelProps = {
  dictionary: Dictionary;
  selectedStyle: TextStyle;
  previewText: string;
  fontSize: number;
  textColor: string;
  transparentBackground: boolean;
  copyLabel: string;
  onCopy: () => void;
  onSave: () => void;
  onPreview: () => void;
};

export function StylePreviewPanel({
  dictionary,
  selectedStyle,
  previewText,
  fontSize,
  textColor,
  transparentBackground,
  copyLabel,
  onCopy,
  onSave,
  onPreview
}: StylePreviewPanelProps) {
  const copyMode = getCopyMode(selectedStyle);
  const platformRecommendation = getPlatformRecommendation(selectedStyle);
  const statusHint =
    copyMode === "copyable"
      ? dictionary.workbench.copyableHint
      : dictionary.workbench.previewOnlyHint;

  return (
    <section className="flex min-h-[420px] flex-col rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-[0_24px_80px_rgba(28,36,48,0.08)] backdrop-blur md:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
            {dictionary.workbench.selectedStyleTitle}
          </p>
          <h2 className="mt-2 truncate text-2xl font-semibold text-ink">
            {selectedStyle.displayName}
          </h2>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <StatusPill label={getCopyModeLabel(copyMode, dictionary)} tone={copyMode} />
          <StatusPill
            label={getPlatformLabel(platformRecommendation, dictionary)}
            tone="platform"
          />
        </div>
      </div>

      <div
        className="my-7 grid flex-1 place-items-center rounded-[1.5rem] border border-slate-100 px-5 py-10 text-center"
        data-testid="main-style-preview-output"
        style={{
          backgroundColor: transparentBackground ? "transparent" : "#ffffff",
          color: textColor,
          fontFamily: selectedStyle.fontFamily,
          fontSize
        }}
      >
        <span className="max-w-full break-words leading-tight">{previewText || " "}</span>
      </div>

      <p className="mb-5 text-sm leading-6 text-slate-600">{statusHint}</p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Button onClick={onCopy} type="button" variant="accent">
          <Copy className="h-4 w-4" />
          {copyLabel}
        </Button>
        <Button onClick={onSave} type="button" variant="outline">
          <Download className="h-4 w-4" />
          {dictionary.actions.save}
        </Button>
        <Button onClick={onPreview} type="button" variant="outline">
          <Eye className="h-4 w-4" />
          {dictionary.actions.preview}
        </Button>
      </div>
    </section>
  );
}

function StatusPill({
  label,
  tone
}: {
  label: string;
  tone: "copyable" | "preview-only" | "platform";
}) {
  const toneClassName =
    tone === "copyable"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : tone === "preview-only"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${toneClassName}`}>
      {label}
    </span>
  );
}
```

- [ ] **Step 4: Run preview panel tests**

Run:

```bash
npm run test -- src/components/cursive-generator/style-preview-panel.test.tsx
```

Expected result: PASS.

- [ ] **Step 5: Run lint**

Run:

```bash
npm run lint
```

Expected result: PASS.

---

## Task 6: Redesign generator toolbar as settings panel

**Files:**
- Modify: `src/components/cursive-generator/generator-toolbar.tsx`

- [ ] **Step 1: Replace toolbar component markup and classes**

Replace the return value of `GeneratorToolbar` with:

```tsx
  return (
    <aside className="rounded-[2rem] border border-slate-200 bg-white/85 p-5 shadow-[0_18px_50px_rgba(28,36,48,0.07)] backdrop-blur md:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-ink">{dictionary.workbench.settingsTitle}</h2>
        <Button onClick={onClear} size="sm" type="button" variant="ghost">
          {dictionary.actions.clear}
        </Button>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-slate-700">
              {dictionary.controls.size}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {fontSize}px
            </span>
          </div>
          <Slider
            aria-label={dictionary.controls.size}
            max={96}
            min={16}
            onValueChange={([value]) => onFontSizeChange(value)}
            step={1}
            value={[fontSize]}
          />
        </div>

        <div className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">
            {dictionary.controls.color}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {presetColors.map((color) => (
              <button
                aria-label={`${dictionary.controls.color} ${color}`}
                className="h-8 w-8 rounded-full border border-white shadow-[0_0_0_1px_rgba(15,23,42,0.12),0_6px_16px_rgba(15,23,42,0.12)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                key={color}
                onClick={() => onTextColorChange(color)}
                style={{ backgroundColor: color }}
                type="button"
              />
            ))}
            <input
              aria-label={dictionary.controls.customColor}
              className="h-9 w-12 cursor-pointer rounded-full border border-slate-200 bg-white p-1 shadow-sm"
              onChange={handleColorInputChange}
              type="color"
              value={textColor}
            />
          </div>
        </div>

        <label
          className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
          htmlFor="transparent-background-checkbox"
        >
          <span>{dictionary.controls.transparent}</span>
          <Checkbox
            checked={transparentBackground}
            id="transparent-background-checkbox"
            onChange={handleTransparentBackgroundInputChange}
          />
        </label>
      </div>
    </aside>
  );
```

- [ ] **Step 2: Remove unused input props**

`GeneratorToolbarProps` currently includes `inputText`, `inputFontFamily`, and `onInputTextChange`. Remove these from the type and function destructuring because the redesigned input will live in the hero area of `CursiveGeneratorPage`.

Remove these lines from the props type:

```ts
  inputText: string;
  inputFontFamily: string;
  onInputTextChange: (value: string) => void;
```

Remove these names from the destructuring:

```ts
  inputText,
  inputFontFamily,
  onInputTextChange,
```

- [ ] **Step 3: Run lint**

Run:

```bash
npm run lint
```

Expected result: PASS if `Input` import is removed from `generator-toolbar.tsx`. If lint reports `Input` as unused, remove:

```ts
import { Input } from "@/components/ui/input";
```

---

## Task 7: Create lightweight filter tabs

**Files:**
- Create: `src/components/cursive-generator/style-filter-tabs.tsx`
- Create: `src/components/cursive-generator/style-filter-tabs.test.tsx`

- [ ] **Step 1: Write failing filter tab tests**

Create `src/components/cursive-generator/style-filter-tabs.test.tsx`:

```tsx
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
});
```

- [ ] **Step 2: Run failing tests**

Run:

```bash
npm run test -- src/components/cursive-generator/style-filter-tabs.test.tsx
```

Expected result: FAIL because `style-filter-tabs.tsx` does not exist.

- [ ] **Step 3: Create filter tabs component**

Create `src/components/cursive-generator/style-filter-tabs.tsx`:

```tsx
"use client";

import type { getDictionary } from "@/lib/i18n";
import type { StyleFilter } from "@/lib/text-styles";
import { cn } from "@/lib/utils";

type Dictionary = ReturnType<typeof getDictionary>;

type FilterLabelKey = "all" | "social" | "googleDocsDefault" | "googleDocsInstallable" | "msWord";

type StyleFilterTabsProps = {
  dictionary: Dictionary;
  selectedFilter: StyleFilter;
  filterOptions: Array<{
    value: StyleFilter;
    labelKey: FilterLabelKey;
  }>;
  onFilterChange: (value: StyleFilter) => void;
};

export function StyleFilterTabs({
  dictionary,
  selectedFilter,
  filterOptions,
  onFilterChange
}: StyleFilterTabsProps) {
  return (
    <section className="mx-auto mb-6 w-full max-w-7xl px-4 md:px-8">
      <div className="flex gap-2 overflow-x-auto rounded-full border border-slate-200 bg-white/75 p-1 shadow-sm backdrop-blur">
        {filterOptions.map((filterOption) => {
          const isSelected = selectedFilter === filterOption.value;

          return (
            <button
              aria-pressed={isSelected}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition",
                isSelected
                  ? "bg-ink text-white shadow-sm"
                  : "hover:bg-slate-100 hover:text-ink"
              )}
              key={filterOption.value}
              onClick={() => onFilterChange(filterOption.value)}
              type="button"
            >
              <span className="md:hidden">
                {dictionary.filtersShort[filterOption.labelKey]}
              </span>
              <span className="hidden md:inline">
                {dictionary.filters[filterOption.labelKey]}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run filter tab tests**

Run:

```bash
npm run test -- src/components/cursive-generator/style-filter-tabs.test.tsx
```

Expected result: PASS.

- [ ] **Step 5: Run lint**

Run:

```bash
npm run lint
```

Expected result: PASS.

---

## Task 8: Redesign font library cards and grid

**Files:**
- Modify: `src/components/cursive-generator/font-card.tsx`
- Modify: `src/components/cursive-generator/font-grid.tsx`

- [ ] **Step 1: Replace font card article classes and layout**

In `src/components/cursive-generator/font-card.tsx`, replace the `<article>` opening block with:

```tsx
    <article
      className={cn(
        "group relative min-h-[138px] min-w-0 overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white/90 text-ink shadow-sm transition-all hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg",
        isSelected && "border-accent bg-emerald-50/70 shadow-md ring-2 ring-accent/20"
      )}
    >
```

Replace the main card button class with:

```tsx
        className="flex h-full w-full min-w-0 flex-col items-start justify-between px-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
```

Replace the badge wrapper and badge classes with:

```tsx
        <div className="mb-3 flex max-w-[calc(100%-2.5rem)] flex-wrap gap-1.5">
          {textStyle.sourceBadges.map((badge) => (
            <span
              className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500"
              key={badge}
            >
              {badge}
            </span>
          ))}
        </div>
```

Replace the preview text block with:

```tsx
        <div
          className="flex min-h-12 max-w-full items-center overflow-hidden text-ellipsis whitespace-nowrap leading-none text-ink"
          style={{ fontFamily: textStyle.fontFamily, fontSize: sampleFontSize }}
          title={previewText}
        >
          {previewText || " "}
        </div>
```

Replace the display name block with:

```tsx
        <div
          className="mt-4 max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold leading-tight text-slate-600"
          title={textStyle.displayName}
        >
          {textStyle.displayName}
        </div>
```

Replace the action icon button class with:

```tsx
          "absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:text-ink hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          copyMode === "copyable" && isCopied && "border-accent bg-accent text-white"
```

- [ ] **Step 2: Adjust font-size helper**

In `src/components/cursive-generator/font-card.tsx`, replace `getSampleFontSize` with:

```ts
function getSampleFontSize(previewText: string): string {
  const characterCount = Array.from(previewText).length;

  if (characterCount > 20) {
    return "1rem";
  }

  if (characterCount > 14) {
    return "1.2rem";
  }

  if (characterCount > 9) {
    return "1.45rem";
  }

  return "2.15rem";
}
```

- [ ] **Step 3: Replace font grid wrapper**

In `src/components/cursive-generator/font-grid.tsx`, replace the returned `<section>` opening class with:

```tsx
    <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-3 px-4 pb-12 sm:grid-cols-2 md:px-8 lg:grid-cols-3 xl:grid-cols-4">
```

- [ ] **Step 4: Run tests**

Run:

```bash
npm run test
```

Expected result: PASS.

- [ ] **Step 5: Run lint**

Run:

```bash
npm run lint
```

Expected result: PASS.

---

## Task 9: Redesign bottom content and FAQ section

**Files:**
- Modify: `src/components/cursive-generator/faq-section.tsx`

- [ ] **Step 1: Replace FAQ section implementation**

Replace all contents of `src/components/cursive-generator/faq-section.tsx` with:

```tsx
import type { getDictionary } from "@/lib/i18n";

type Dictionary = ReturnType<typeof getDictionary>;

type FaqSectionProps = {
  dictionary: Dictionary;
};

export function FaqSection({ dictionary }: FaqSectionProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-20 pt-4 md:px-8" id="faq">
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-sm md:p-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted">
            {dictionary.contentSections.howItWorks.title}
          </p>
          <ol className="grid gap-3">
            {dictionary.contentSections.howItWorks.steps.map((step, index) => (
              <li className="flex gap-3 text-sm leading-6 text-slate-700" key={step}>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-xs font-semibold text-white">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-sm md:p-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted">
            {dictionary.contentSections.useCases.title}
          </p>
          <p className="text-sm leading-6 text-slate-700">
            {dictionary.contentSections.useCases.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {dictionary.contentSections.useCases.items.map((item) => (
              <span
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
                key={item}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-[2rem] border border-slate-200 bg-ink p-6 text-white shadow-sm md:p-8">
        <h2 className="text-2xl font-semibold">
          {dictionary.contentSections.copyableVsPreview.title}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-white/75">
          {dictionary.contentSections.copyableVsPreview.description}
        </p>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-2xl font-semibold text-ink">{dictionary.faq.title}</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {dictionary.faq.items.map((item) => (
            <article
              className="rounded-[1.5rem] border border-slate-200 bg-white/85 p-5 shadow-sm"
              key={item.question}
            >
              <h3 className="mb-2 text-base font-semibold text-ink">{item.question}</h3>
              <p className="text-sm leading-6 text-slate-700">{item.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Run dictionary and lint checks**

Run:

```bash
npm run test -- src/lib/i18n.test.ts
npm run lint
```

Expected result: both commands PASS.

---

## Task 10: Compose the redesigned page layout

**Files:**
- Modify: `src/components/cursive-generator/cursive-generator-page.tsx`

- [ ] **Step 1: Update imports**

In `src/components/cursive-generator/cursive-generator-page.tsx`, remove these imports:

```ts
import Link from "next/link";
import { SelectedStyleBar } from "./selected-style-bar";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
```

Add these imports:

```ts
import { GeneratorHeader } from "./generator-header";
import { StyleFilterTabs } from "./style-filter-tabs";
import { StylePreviewPanel } from "./style-preview-panel";
import { Input } from "@/components/ui/input";
```

Keep these existing imports:

```ts
import { FaqSection } from "./faq-section";
import { FontGrid } from "./font-grid";
import { GeneratorToolbar } from "./generator-toolbar";
import { PreviewDialog } from "./preview-dialog";
```

- [ ] **Step 2: Replace header and title section**

Replace the beginning of the returned JSX from:

```tsx
    <main className="min-h-screen">
      <header ...>
        ...
      </header>

      <section className="px-4 text-center md:px-8">
        <h1 className="mb-4 text-3xl font-black tracking-normal text-ink md:mb-5 md:text-5xl">
          {dictionary.title}
        </h1>
      </section>
```

with:

```tsx
    <main className="min-h-screen">
      <GeneratorHeader dictionary={dictionary} locale={locale} />

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-8 pt-4 md:px-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)] lg:items-start lg:pb-10 lg:pt-8">
        <div className="grid gap-5 lg:pt-8">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.26em] text-accent">
              Online font workbench
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-ink md:text-6xl">
              {dictionary.title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
              {dictionary.hero.description}
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-3 shadow-sm backdrop-blur">
            <label className="sr-only" htmlFor="generator-input">
              {dictionary.inputLabel}
            </label>
            <Input
              className="h-16 border-0 bg-transparent px-4 text-2xl shadow-none focus-visible:ring-0 md:h-20 md:text-4xl"
              id="generator-input"
              onChange={(event) => setInputText(event.target.value)}
              style={{ fontFamily: selectedStyle.fontFamily }}
              value={inputText}
            />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <StylePreviewPanel
            copyLabel={copyLabel}
            dictionary={dictionary}
            fontSize={fontSize}
            onCopy={handleCopy}
            onPreview={() => setIsPreviewOpen(true)}
            onSave={handleSave}
            previewText={selectedPreviewText}
            selectedStyle={selectedStyle}
            textColor={textColor}
            transparentBackground={transparentBackground}
          />

          <GeneratorToolbar
            dictionary={dictionary}
            fontSize={fontSize}
            onClear={handleClear}
            onFontSizeChange={setFontSize}
            onTextColorChange={setTextColor}
            onTransparentBackgroundChange={setTransparentBackground}
            textColor={textColor}
            transparentBackground={transparentBackground}
          />
        </div>
      </section>
```

- [ ] **Step 3: Remove old toolbar and selected style bar blocks**

Remove the old standalone `<GeneratorToolbar ... />` block that passed `inputText`, `inputFontFamily`, and `onInputTextChange`.

Remove the old `<SelectedStyleBar ... />` block.

- [ ] **Step 4: Replace radio filter section**

Replace the old `<section>` containing `<RadioGroup>` with:

```tsx
      <StyleFilterTabs
        dictionary={dictionary}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
        selectedFilter={selectedFilter}
      />
```

- [ ] **Step 5: Update filter handler type**

Change `handleFilterChange` from:

```ts
  function handleFilterChange(value: string) {
    const nextFilter = value as StyleFilter;
```

to:

```ts
  function handleFilterChange(nextFilter: StyleFilter) {
```

Keep the rest of the function body unchanged.

- [ ] **Step 6: Run component tests**

Run:

```bash
npm run test -- src/components/cursive-generator/style-preview-panel.test.tsx src/components/cursive-generator/style-filter-tabs.test.tsx
```

Expected result: PASS.

- [ ] **Step 7: Run lint**

Run:

```bash
npm run lint
```

Expected result: PASS. If lint reports unused imports from the old UI, remove only the reported unused imports.

---

## Task 11: Lighten preview dialog and PNG export consistency

**Files:**
- Modify: `src/components/cursive-generator/preview-dialog.tsx`
- Modify: `src/components/cursive-generator/cursive-generator-page.tsx`

- [ ] **Step 1: Lighten preview dialog output styling**

In `src/components/cursive-generator/preview-dialog.tsx`, replace the preview output class with:

```tsx
          className="grid min-h-52 place-items-center rounded-[1.5rem] border border-slate-200 p-8 shadow-sm"
```

- [ ] **Step 2: Lighten dialog actions layout**

In `src/components/cursive-generator/preview-dialog.tsx`, replace the action wrapper class with:

```tsx
        <div className="flex flex-wrap justify-end gap-3">
```

The wrapper already matches this string in the current file, so this step is a verification step unless earlier changes altered it.

- [ ] **Step 3: Keep PNG export aligned with main preview**

In `src/components/cursive-generator/cursive-generator-page.tsx`, verify the hidden PNG export node still uses:

```ts
            backgroundColor: transparentBackground ? "transparent" : "#ffffff",
            color: textColor,
            fontFamily: selectedStyle.fontFamily,
            fontSize,
```

Do not change these four properties.

- [ ] **Step 4: Run tests and lint**

Run:

```bash
npm run test
npm run lint
```

Expected result: both commands PASS.

---

## Task 12: Final browser smoke test

**Files:**
- No planned file changes.

- [ ] **Step 1: Start the app**

Run:

```bash
npm run dev
```

Expected result: Next.js starts. If port 3000 is busy, Next.js may choose another port such as 3002. Use the printed `Local:` URL.

- [ ] **Step 2: Open English page**

Open:

```text
http://localhost:3002/en/cursive-text-generator
```

If the dev server prints a different port, replace `3002` with that port.

Expected visual result:

- Header is light and mature.
- Page no longer has a full grid background.
- Hero includes title, description, and input field.
- Main preview panel is visible in the first screen on desktop.
- Settings panel is beside the preview panel on desktop.
- Filter tabs are lightweight pills.
- Font cards are compact white library cards.

- [ ] **Step 3: Open Chinese page**

Open:

```text
http://localhost:3002/zh/cursive-text-generator
```

Expected visual result:

- Chinese title and body labels render.
- Layout matches the English page.
- No missing dictionary key appears on screen.

- [ ] **Step 4: Interact with the page**

Manual interaction checklist:

```text
1. Type "signature test" in the input.
2. Confirm main preview updates.
3. Select "Dancing Script" or another font card.
4. Confirm main preview font changes.
5. Change size slider.
6. Confirm main preview size changes.
7. Change color.
8. Confirm main preview color changes.
9. Toggle transparent background.
10. Confirm preview background setting changes.
11. Click Social / Word filter tab.
12. Confirm visible cards change.
13. Click Preview.
14. Confirm dialog opens with matching style.
15. Click Save.
16. Confirm PNG download starts.
```

- [ ] **Step 5: Final automated verification**

Run:

```bash
npm run test
npm run lint
```

Expected result: both commands PASS.

---

## Self-Review

### Spec coverage

- Mature font-workbench direction: covered by Tasks 3, 5, 6, 8, 10, and 12.
- Top navigation redesign: covered by Task 4.
- Hero with description and input: covered by Tasks 1 and 10.
- Main preview panel: covered by Task 5 and Task 10.
- Settings panel: covered by Task 6.
- Lightweight filters: covered by Task 7 and Task 10.
- Compact font library cards: covered by Task 8.
- Richer content and FAQ: covered by Task 1 and Task 9.
- i18n for new labels: covered by Task 1.
- Preserve copy/save/preview behavior: covered by Tasks 5, 10, 11, and 12.
- Avoid unrelated feature expansion: covered by the task list; no new accounts, templates, payments, search, or editor features are included.

### Placeholder scan

The plan contains no `TBD`, no `TODO`, no undefined future feature, and no open-ended “handle edge cases” instruction. Each task names exact files, code blocks, commands, and expected outcomes.

### Type consistency

- `Dictionary` additions are used as `dictionary.hero`, `dictionary.workbench`, and `dictionary.contentSections` consistently.
- `StyleFilterTabs` accepts `StyleFilter` values and `handleFilterChange` is updated to receive `StyleFilter`.
- `StylePreviewPanel` uses existing `TextStyle`, `getCopyMode`, `getPlatformRecommendation`, and the new shared label helpers.
- `GeneratorToolbar` no longer accepts input props after the input moves into the hero section.
