# Technical SEO URL Schema Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish technical SEO for `https://cursivegenerator.pro` by making `/` the English canonical page, redirecting `/en/cursive-text-generator` to `/`, keeping `/zh/cursive-text-generator` as the Chinese page, and adding canonical/hreflang, sitemap, robots, WebApplication JSON-LD, and FAQPage JSON-LD.

**Architecture:** Keep visual tool components unchanged. Put URL constants and SEO helpers in focused modules, use Next.js metadata/sitemap/robots APIs for crawl signals, and render JSON-LD through a non-visual component that reads from the existing i18n dictionary. Route changes happen only at App Router entry points.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest, Next metadata routes.

---

## File Structure

- Create: `src/lib/site-url.ts`
  - Responsibility: central production origin and canonical path helpers.
- Create: `src/components/seo/structured-data.tsx`
  - Responsibility: render WebApplication and FAQPage JSON-LD as non-visual script tags.
- Create: `src/components/seo/structured-data.test.tsx`
  - Responsibility: verify JSON-LD uses locale-specific URLs and FAQ content.
- Create: `src/app/sitemap.ts`
  - Responsibility: expose canonical URLs only: `/` and `/zh/cursive-text-generator`.
- Create: `src/app/sitemap.test.ts`
  - Responsibility: verify sitemap entries and exclusion of `/en/cursive-text-generator`.
- Create: `src/app/robots.ts`
  - Responsibility: allow crawling and point to production sitemap.
- Create: `src/app/robots.test.ts`
  - Responsibility: verify robots rules and sitemap URL.
- Modify: `src/app/page.tsx`
  - Responsibility: render English page at root and provide root metadata.
- Modify: `src/app/[locale]/cursive-text-generator/page.tsx`
  - Responsibility: redirect English locale page to `/`; render Chinese page with JSON-LD.
- Modify: `src/app/[locale]/layout.tsx`
  - Responsibility: provide Chinese page metadata; prevent English locale route from being canonical.
- Modify: existing route/metadata tests as needed.

No tool component structure, layout, `className`, interaction logic, visible hidden text, or font-card/button layout changes are allowed.

---

### Task 1: Add shared production URL helpers

**Files:**
- Create: `src/lib/site-url.ts`
- Test: no direct test required; later tasks test usage through metadata/sitemap/robots/JSON-LD.

- [ ] **Step 1: Create `src/lib/site-url.ts`**

```ts
export const siteOrigin = "https://cursivegenerator.pro";

export const englishCanonicalPath = "/";
export const chineseCanonicalPath = "/zh/cursive-text-generator";

export const canonicalUrls = {
  en: `${siteOrigin}${englishCanonicalPath}`,
  zh: `${siteOrigin}${chineseCanonicalPath}`
} as const;

export const hreflangAlternates = {
  en: canonicalUrls.en,
  zh: canonicalUrls.zh,
  "x-default": canonicalUrls.en
} as const;
```

- [ ] **Step 2: Run lint**

Run:

```bash
npm run lint
```

Expected: pass.

---

### Task 2: Make root `/` render the English canonical page

**Files:**
- Modify: `src/app/page.tsx`
- Test: create or update a root page test if one exists. If no test exists, create `src/app/page.test.tsx`.

- [ ] **Step 1: Replace root redirect with English page rendering and metadata**

Use this full file for `src/app/page.tsx`:

```tsx
import type { Metadata } from "next";

import { CursiveGeneratorPage } from "@/components/cursive-generator/cursive-generator-page";
import { StructuredData } from "@/components/seo/structured-data";
import { getDictionary } from "@/lib/i18n";
import { canonicalUrls, hreflangAlternates, siteOrigin } from "@/lib/site-url";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: "Cursive Generator - Copy and Paste Cursive Text Fonts",
  description:
    "Use this free cursive generator to create cursive text fonts you can copy and paste for social bios, messages, documents, signatures, and images.",
  alternates: {
    canonical: canonicalUrls.en,
    languages: hreflangAlternates
  }
};

export default function HomePage() {
  const locale = "en";
  const dictionary = getDictionary(locale);

  return (
    <>
      <StructuredData dictionary={dictionary} locale={locale} />
      <CursiveGeneratorPage dictionary={dictionary} locale={locale} />
    </>
  );
}
```

- [ ] **Step 2: Create `src/app/page.test.tsx`**

```tsx
import { describe, expect, it, vi } from "vitest";

import HomePage, { metadata } from "./page";

vi.mock("@/components/cursive-generator/cursive-generator-page", () => ({
  CursiveGeneratorPage: vi.fn(() => <main data-testid="generator-page" />)
}));

vi.mock("@/components/seo/structured-data", () => ({
  StructuredData: vi.fn(() => <script data-testid="structured-data" />)
}));

import { CursiveGeneratorPage } from "@/components/cursive-generator/cursive-generator-page";
import { StructuredData } from "@/components/seo/structured-data";

describe("HomePage", () => {
  it("renders the English generator page at the root URL", () => {
    const pageElement = HomePage();

    expect(pageElement.type).toBe(React.Fragment);
    expect(StructuredData).toHaveBeenCalledWith(
      expect.objectContaining({ locale: "en" }),
      undefined
    );
    expect(CursiveGeneratorPage).toHaveBeenCalledWith(
      expect.objectContaining({ locale: "en" }),
      undefined
    );
  });

  it("uses the root URL as the English canonical URL", () => {
    expect(metadata.alternates?.canonical).toBe("https://cursivegenerator.pro/");
    expect(metadata.alternates?.languages).toEqual({
      en: "https://cursivegenerator.pro/",
      zh: "https://cursivegenerator.pro/zh/cursive-text-generator",
      "x-default": "https://cursivegenerator.pro/"
    });
  });
});
```

- [ ] **Step 3: If the test fails because `React` is not imported**

Use this import at the top of `src/app/page.test.tsx`:

```tsx
import React from "react";
```

- [ ] **Step 4: Run the root page test**

Run:

```bash
npx vitest run src/app/page.test.tsx
```

Expected: pass after `StructuredData` exists in Task 3. If run before Task 3, it should fail because `@/components/seo/structured-data` does not exist; continue to Task 3.

---

### Task 3: Add JSON-LD structured data component

**Files:**
- Create: `src/components/seo/structured-data.tsx`
- Create: `src/components/seo/structured-data.test.tsx`

- [ ] **Step 1: Create `src/components/seo/structured-data.tsx`**

```tsx
import type { getDictionary, Locale } from "@/lib/i18n";
import { canonicalUrls } from "@/lib/site-url";

type Dictionary = ReturnType<typeof getDictionary>;

type StructuredDataProps = {
  dictionary: Dictionary;
  locale: Locale;
};

type JsonLdRecord = Record<string, unknown>;

export function StructuredData({ dictionary, locale }: StructuredDataProps) {
  const pageUrl = canonicalUrls[locale];
  const structuredData = [
    createWebApplicationStructuredData(dictionary, locale, pageUrl),
    createFaqStructuredData(dictionary, locale, pageUrl)
  ];

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      type="application/ld+json"
    />
  );
}

function createWebApplicationStructuredData(
  dictionary: Dictionary,
  locale: Locale,
  pageUrl: string
): JsonLdRecord {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: dictionary.brand,
    url: pageUrl,
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    inLanguage: locale,
    description: dictionary.hero.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    }
  };
}

function createFaqStructuredData(
  dictionary: Dictionary,
  locale: Locale,
  pageUrl: string
): JsonLdRecord {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: pageUrl,
    inLanguage: locale,
    mainEntity: dictionary.faq.items.map((faqItem) => ({
      "@type": "Question",
      name: faqItem.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faqItem.answer
      }
    }))
  };
}
```

- [ ] **Step 2: Create `src/components/seo/structured-data.test.tsx`**

```tsx
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { getDictionary } from "@/lib/i18n";
import { StructuredData } from "./structured-data";

describe("StructuredData", () => {
  it("renders English WebApplication and FAQPage JSON-LD for the root URL", () => {
    const { container } = render(
      <StructuredData dictionary={getDictionary("en")} locale="en" />
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    const jsonLd = JSON.parse(script?.textContent ?? "[]");

    expect(jsonLd).toHaveLength(2);
    expect(jsonLd[0]).toMatchObject({
      "@type": "WebApplication",
      name: "Cursive Generator",
      url: "https://cursivegenerator.pro/",
      inLanguage: "en"
    });
    expect(jsonLd[1]).toMatchObject({
      "@type": "FAQPage",
      url: "https://cursivegenerator.pro/",
      inLanguage: "en"
    });
    expect(jsonLd[1].mainEntity[0]).toMatchObject({
      "@type": "Question",
      name: "Which cursive text styles can I copy and paste?"
    });
  });

  it("renders Chinese WebApplication and FAQPage JSON-LD for the Chinese URL", () => {
    const { container } = render(
      <StructuredData dictionary={getDictionary("zh")} locale="zh" />
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    const jsonLd = JSON.parse(script?.textContent ?? "[]");

    expect(jsonLd[0]).toMatchObject({
      "@type": "WebApplication",
      name: "花体生成器",
      url: "https://cursivegenerator.pro/zh/cursive-text-generator",
      inLanguage: "zh"
    });
    expect(jsonLd[1]).toMatchObject({
      "@type": "FAQPage",
      url: "https://cursivegenerator.pro/zh/cursive-text-generator",
      inLanguage: "zh"
    });
    expect(jsonLd[1].mainEntity[0]).toMatchObject({
      "@type": "Question",
      name: "哪些样式复制后还是花体？"
    });
  });
});
```

- [ ] **Step 3: Run the structured-data test**

Run:

```bash
npx vitest run src/components/seo/structured-data.test.tsx
```

Expected: pass.

---

### Task 4: Redirect English locale generator and keep Chinese rendering

**Files:**
- Modify: `src/app/[locale]/cursive-text-generator/page.tsx`
- Test: update `src/app/[locale]/page.test.tsx` if route behavior changes are already tested there; create `src/app/[locale]/cursive-text-generator/page.test.tsx` if missing.

- [ ] **Step 1: Replace `src/app/[locale]/cursive-text-generator/page.tsx`**

```tsx
import { redirect } from "next/navigation";

import { CursiveGeneratorPage } from "@/components/cursive-generator/cursive-generator-page";
import { StructuredData } from "@/components/seo/structured-data";
import { getDictionary, normalizeLocale } from "@/lib/i18n";

export default async function CursiveTextGeneratorRoute({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);

  if (locale === "en") {
    redirect("/");
  }

  const dictionary = getDictionary(locale);

  return (
    <>
      <StructuredData dictionary={dictionary} locale={locale} />
      <CursiveGeneratorPage dictionary={dictionary} locale={locale} />
    </>
  );
}
```

- [ ] **Step 2: Create `src/app/[locale]/cursive-text-generator/page.test.tsx`**

```tsx
import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("next/navigation", () => ({
  redirect: vi.fn()
}));

vi.mock("@/components/cursive-generator/cursive-generator-page", () => ({
  CursiveGeneratorPage: vi.fn(() => <main data-testid="generator-page" />)
}));

vi.mock("@/components/seo/structured-data", () => ({
  StructuredData: vi.fn(() => <script data-testid="structured-data" />)
}));

import { redirect } from "next/navigation";
import { CursiveGeneratorPage } from "@/components/cursive-generator/cursive-generator-page";
import { StructuredData } from "@/components/seo/structured-data";
import CursiveTextGeneratorRoute from "./page";

describe("CursiveTextGeneratorRoute", () => {
  beforeEach(() => {
    vi.mocked(redirect).mockReset();
    vi.mocked(CursiveGeneratorPage).mockClear();
    vi.mocked(StructuredData).mockClear();
  });

  it("redirects the English locale generator route to the root page", async () => {
    await CursiveTextGeneratorRoute({
      params: Promise.resolve({ locale: "en" })
    });

    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("renders the Chinese generator page for the Chinese locale route", async () => {
    const pageElement = await CursiveTextGeneratorRoute({
      params: Promise.resolve({ locale: "zh" })
    });

    expect(pageElement.type).toBe(React.Fragment);
    expect(StructuredData).toHaveBeenCalledWith(
      expect.objectContaining({ locale: "zh" }),
      undefined
    );
    expect(CursiveGeneratorPage).toHaveBeenCalledWith(
      expect.objectContaining({ locale: "zh" }),
      undefined
    );
  });
});
```

- [ ] **Step 3: Run route test**

Run:

```bash
npx vitest run src/app/[locale]/cursive-text-generator/page.test.tsx
```

Expected: pass.

---

### Task 5: Update locale layout metadata for Chinese canonical and hreflang

**Files:**
- Modify: `src/app/[locale]/layout.tsx`
- Create or update: metadata tests if existing coverage is missing.

- [ ] **Step 1: Update imports in `src/app/[locale]/layout.tsx`**

Add site URL helpers:

```ts
import { canonicalUrls, hreflangAlternates, siteOrigin } from "@/lib/site-url";
```

- [ ] **Step 2: Update returned metadata**

The `return` object should include `metadataBase` and `alternates`:

```ts
return {
  metadataBase: new URL(siteOrigin),
  title:
    locale === "zh"
      ? dictionary.title
      : "Cursive Generator - Copy and Paste Cursive Text Fonts",
  description:
    locale === "zh"
      ? "输入文本，选择花体样式，复制、预览或保存为 PNG。"
      : "Use this free cursive generator to create cursive text fonts you can copy and paste for social bios, messages, documents, signatures, and images.",
  alternates: {
    canonical: locale === "zh" ? canonicalUrls.zh : canonicalUrls.en,
    languages: hreflangAlternates
  }
};
```

The English locale route redirects, but this fallback keeps metadata consistent if layout metadata is evaluated.

- [ ] **Step 3: Create `src/app/[locale]/layout.test.ts` if missing**

```ts
import { describe, expect, it } from "vitest";

import { generateMetadata } from "./layout";

describe("locale generateMetadata", () => {
  it("uses the Chinese canonical URL for Chinese locale pages", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "zh" })
    });

    expect(metadata.metadataBase?.toString()).toBe("https://cursivegenerator.pro/");
    expect(metadata.alternates?.canonical).toBe(
      "https://cursivegenerator.pro/zh/cursive-text-generator"
    );
    expect(metadata.alternates?.languages).toEqual({
      en: "https://cursivegenerator.pro/",
      zh: "https://cursivegenerator.pro/zh/cursive-text-generator",
      "x-default": "https://cursivegenerator.pro/"
    });
  });

  it("falls back to the root canonical URL for English locale metadata", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "en" })
    });

    expect(metadata.alternates?.canonical).toBe("https://cursivegenerator.pro/");
  });
});
```

- [ ] **Step 4: Run metadata test**

Run:

```bash
npx vitest run src/app/[locale]/layout.test.ts
```

Expected: pass.

---

### Task 6: Add sitemap metadata route

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/sitemap.test.ts`

- [ ] **Step 1: Create `src/app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";

import { canonicalUrls } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: canonicalUrls.en,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: canonicalUrls.zh,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    }
  ];
}
```

- [ ] **Step 2: Create `src/app/sitemap.test.ts`**

```ts
import { describe, expect, it } from "vitest";

import sitemap from "./sitemap";

describe("sitemap", () => {
  it("includes only canonical English and Chinese URLs", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toEqual([
      "https://cursivegenerator.pro/",
      "https://cursivegenerator.pro/zh/cursive-text-generator"
    ]);
    expect(urls).not.toContain("https://cursivegenerator.pro/en/cursive-text-generator");
  });

  it("uses weekly priority-one entries", () => {
    for (const entry of sitemap()) {
      expect(entry.changeFrequency).toBe("weekly");
      expect(entry.priority).toBe(1);
      expect(entry.lastModified).toBeInstanceOf(Date);
    }
  });
});
```

- [ ] **Step 3: Run sitemap test**

Run:

```bash
npx vitest run src/app/sitemap.test.ts
```

Expected: pass.

---

### Task 7: Add robots metadata route

**Files:**
- Create: `src/app/robots.ts`
- Create: `src/app/robots.test.ts`

- [ ] **Step 1: Create `src/app/robots.ts`**

```ts
import type { MetadataRoute } from "next";

import { siteOrigin } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: `${siteOrigin}/sitemap.xml`
  };
}
```

- [ ] **Step 2: Create `src/app/robots.test.ts`**

```ts
import { describe, expect, it } from "vitest";

import robots from "./robots";

describe("robots", () => {
  it("allows crawling and points to the production sitemap", () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/"
      },
      sitemap: "https://cursivegenerator.pro/sitemap.xml"
    });
  });
});
```

- [ ] **Step 3: Run robots test**

Run:

```bash
npx vitest run src/app/robots.test.ts
```

Expected: pass.

---

### Task 8: Update locale home redirect behavior

**Files:**
- Modify: `src/app/[locale]/page.tsx`
- Modify: `src/app/[locale]/page.test.tsx`

- [ ] **Step 1: Update `src/app/[locale]/page.tsx`**

Use English locale home as root redirect and Chinese locale home as Chinese generator redirect:

```tsx
import { redirect } from "next/navigation";

import { normalizeLocale } from "@/lib/i18n";

export default async function LocaleHomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);

  if (locale === "en") {
    redirect("/");
  }

  redirect(`/${locale}/cursive-text-generator`);
}
```

- [ ] **Step 2: Update `src/app/[locale]/page.test.tsx`**

Replace the English test expectation:

```ts
it("redirects English locale home to the root English generator page", async () => {
  await LocaleHomePage({
    params: Promise.resolve({ locale: "en" })
  });

  expect(redirect).toHaveBeenCalledWith("/");
});
```

Keep the Chinese expectation:

```ts
expect(redirect).toHaveBeenCalledWith("/zh/cursive-text-generator");
```

- [ ] **Step 3: Run locale home test**

Run:

```bash
npx vitest run src/app/[locale]/page.test.tsx
```

Expected: pass.

---

### Task 9: Final verification

**Files:**
- Verify all changed files.

- [ ] **Step 1: Run lint**

Run:

```bash
npm run lint
```

Expected: pass.

- [ ] **Step 2: Run all tests**

Run:

```bash
npx vitest run
```

Expected: all test files pass.

- [ ] **Step 3: Build**

Run:

```bash
npm run build
```

Expected: build completes successfully.

- [ ] **Step 4: Inspect generated routes manually if needed**

Run:

```bash
npm run dev
```

Then check:

```txt
http://localhost:3000/
http://localhost:3000/en/cursive-text-generator
http://localhost:3000/zh/cursive-text-generator
http://localhost:3000/sitemap.xml
http://localhost:3000/robots.txt
```

Expected:

```txt
/ renders English page
/en/cursive-text-generator redirects to /
/zh/cursive-text-generator renders Chinese page
/sitemap.xml contains https://cursivegenerator.pro/ and https://cursivegenerator.pro/zh/cursive-text-generator
/robots.txt contains Sitemap: https://cursivegenerator.pro/sitemap.xml
```

- [ ] **Step 5: Final report**

Report:

```txt
Changed files:
- src/lib/site-url.ts
- src/components/seo/structured-data.tsx
- src/components/seo/structured-data.test.tsx
- src/app/page.tsx
- src/app/page.test.tsx
- src/app/[locale]/cursive-text-generator/page.tsx
- src/app/[locale]/cursive-text-generator/page.test.tsx
- src/app/[locale]/layout.tsx
- src/app/[locale]/layout.test.ts
- src/app/[locale]/page.tsx
- src/app/[locale]/page.test.tsx
- src/app/sitemap.ts
- src/app/sitemap.test.ts
- src/app/robots.ts
- src/app/robots.test.ts

SEO behavior:
- English canonical: https://cursivegenerator.pro/
- Chinese canonical: https://cursivegenerator.pro/zh/cursive-text-generator
- /en/cursive-text-generator redirects to /
- Sitemap excludes /en/cursive-text-generator
- JSON-LD includes WebApplication and FAQPage
```

---

## Self-Review

- Spec coverage: Tasks cover URL strategy, canonical/hreflang, sitemap, robots, WebApplication JSON-LD, FAQPage JSON-LD, root rendering, English redirect, Chinese route preservation, and verification.
- Placeholder scan: No TBD/TODO placeholders remain. Code snippets are complete.
- Type consistency: `siteOrigin`, `canonicalUrls`, and `hreflangAlternates` are defined once and reused consistently.
- Scope check: This is one focused technical SEO implementation and does not require decomposition.

## Git Note

This project directory is not currently a git repository, so commit steps are intentionally omitted. If the project is later placed under git, commit after final verification.
