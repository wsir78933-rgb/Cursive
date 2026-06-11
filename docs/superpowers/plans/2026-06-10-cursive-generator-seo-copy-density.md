# Cursive Generator SEO Copy Density Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the English SEO copy for `/en/cursive-text-generator` without changing the tool/component layout, while keeping exact phrase `cursive generator` at or above 2% visible-text character density.

**Architecture:** Keep the existing component structure. Store SEO-facing text in `src/lib/i18n.ts`, use it from the existing page components, and change semantic heading tags without changing class names. Verify the exact keyword density from the same dictionary strings that render visible English page text.

**Tech Stack:** Next.js App Router, React, TypeScript, existing i18n dictionary, shell/Python verification script.

---

## File Structure

- Modify: `src/app/[locale]/layout.tsx`
  - Responsibility: metadata title and description per locale.
- Modify: `src/lib/i18n.ts`
  - Responsibility: visible English and Chinese page copy.
- Modify: `src/components/cursive-generator/cursive-generator-page.tsx`
  - Responsibility: render the hero eyebrow from the dictionary instead of hard-coded English text.
- Modify: `src/components/cursive-generator/faq-section.tsx`
  - Responsibility: use semantic heading tags for existing content section titles while keeping the same CSS classes.
- No new UI components.
- No layout or className changes.
- No sitemap, robots, canonical, hreflang, or JSON-LD in this pass.

## Keyword Density Rule

- Scope: English visible page text only.
- Exact phrase: `cursive generator`.
- Phrase character length: `17`, including the space.
- Page total characters: include spaces and punctuation.
- Formula: `density = phrase_count * 17 / total_visible_characters`.
- Requirement: `density >= 0.02`.

---

### Task 1: Update dictionary shape and SEO copy

**Files:**
- Modify: `src/lib/i18n.ts`

- [ ] **Step 1: Add hero eyebrow to the dictionary type**

Change the `Dictionary` type at the top of `src/lib/i18n.ts` so `hero` includes `eyebrow`.

```ts
hero: {
  eyebrow: string;
  description: string;
};
```

- [ ] **Step 2: Replace the English visible SEO copy**

In the English dictionary, use these exact strings:

```ts
title: "Cursive Text Generator",
brand: "Cursive Generator",
inputLabel: "Your text",
hero: {
  eyebrow: "Online cursive generator",
  description:
    "Use this cursive generator to create cursive text fonts you can copy and paste into social bios, messages, documents, signatures, invitations, and images."
},
contentSections: {
  howItWorks: {
    title: "How to use the cursive generator",
    steps: [
      "Type the text you want to style in the cursive generator.",
      "Choose a copyable cursive style or preview-only font from the library.",
      "Copy and paste the generated cursive text, or save the preview as a PNG."
    ]
  },
  useCases: {
    title: "Where to use this cursive generator",
    description:
      "Use this cursive generator for social bios, short messages, document headings, names, signature-style text, invitations, image graphics, and decorative details.",
    items: ["Social bios", "Messages", "Documents", "Names", "Signatures", "Images"]
  },
  copyableVsPreview: {
    title: "Copyable cursive text vs font preview",
    description:
      "The cursive generator includes Unicode styles that copy as decorative characters. Google, system, and Word fonts preview the visual style, so saving a PNG is the reliable way to preserve their exact look."
  }
},
preview: {
  title: "Style preview",
  description: "Preview uses the selected text, font, size, color, and background setting."
},
faq: {
  title: "Compatibility guide for this cursive generator",
  items: [
    {
      question: "Which cursive text styles can I copy and paste?",
      answer:
        "Unicode styles in this cursive generator copy as decorative cursive characters and work best across social apps, messages, and bios."
    },
    {
      question: "Which styles are preview-only in the cursive generator?",
      answer:
        "Google Fonts, system fonts, and Word fonts copy the original text. Use Preview or Save PNG in the cursive generator to keep their exact look."
    },
    {
      question: "When should I save cursive text as a PNG?",
      answer:
        "Save a PNG from the cursive generator when you need the style to look identical everywhere, especially for non-Unicode font styles."
    }
  ]
}
```

- [ ] **Step 3: Replace the Chinese hero eyebrow only**

In the Chinese dictionary, add the eyebrow without changing the existing Chinese SEO direction:

```ts
hero: {
  eyebrow: "在线花体字体生成器",
  description: "生成适合社交资料、文档、邀请函和图片的花体文字。"
},
```

- [ ] **Step 4: Run TypeScript/lint after this task**

Run:

```bash
npm run lint
```

Expected: no TypeScript or ESLint errors from the new `hero.eyebrow` field.

---

### Task 2: Use dictionary eyebrow in the hero without changing layout

**Files:**
- Modify: `src/components/cursive-generator/cursive-generator-page.tsx`

- [ ] **Step 1: Replace hard-coded hero eyebrow text**

Find this block:

```tsx
<p className="mb-3 text-xs font-semibold uppercase tracking-[0.26em] text-accent">
  Online font workbench
</p>
```

Replace only the text with the dictionary value. Keep the same tag and className:

```tsx
<p className="mb-3 text-xs font-semibold uppercase tracking-[0.26em] text-accent">
  {dictionary.hero.eyebrow}
</p>
```

- [ ] **Step 2: Run lint**

Run:

```bash
npm run lint
```

Expected: pass.

---

### Task 3: Improve heading semantics without changing visual layout

**Files:**
- Modify: `src/components/cursive-generator/faq-section.tsx`

- [ ] **Step 1: Change the How-to title from `p` to `h2`**

Find:

```tsx
<p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted">
  {dictionary.contentSections.howItWorks.title}
</p>
```

Replace with:

```tsx
<h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted">
  {dictionary.contentSections.howItWorks.title}
</h2>
```

- [ ] **Step 2: Change the use-case title from `p` to `h2`**

Find:

```tsx
<p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted">
  {dictionary.contentSections.useCases.title}
</p>
```

Replace with:

```tsx
<h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted">
  {dictionary.contentSections.useCases.title}
</h2>
```

- [ ] **Step 3: Run lint**

Run:

```bash
npm run lint
```

Expected: pass. Visual layout should not change because className is unchanged.

---

### Task 4: Update English metadata description

**Files:**
- Modify: `src/app/[locale]/layout.tsx`

- [ ] **Step 1: Replace the English metadata description**

Keep the title already selected by the user. Replace only the English description string with:

```ts
"Use this free cursive generator to create cursive text fonts you can copy and paste for social bios, messages, documents, signatures, and images."
```

The return object should be:

```ts
return {
  title:
    locale === "zh"
      ? dictionary.title
      : "Cursive Generator - Copy and Paste Cursive Text Fonts",
  description:
    locale === "zh"
      ? "输入文本，选择花体样式，复制、预览或保存为 PNG。"
      : "Use this free cursive generator to create cursive text fonts you can copy and paste for social bios, messages, documents, signatures, and images."
};
```

- [ ] **Step 2: Run lint**

Run:

```bash
npm run lint
```

Expected: pass.

---

### Task 5: Verify keyword density from visible English text

**Files:**
- No source file changes unless verification fails.

- [ ] **Step 1: Run the density script**

Run this command from the project root:

```bash
python3 - <<'PY'
import re
from pathlib import Path

path = Path('src/lib/i18n.ts')
source = path.read_text(encoding='utf-8')
english_block = source.split('en: {', 1)[1].split('\n  },\n  zh:', 1)[0]
strings = re.findall(r'"((?:[^"\\]|\\.)*)"', english_block)
visible_strings = [
    text.encode('utf-8').decode('unicode_escape')
    for text in strings
    if text not in {
        'all', 'social', 'googleDocsDefault', 'googleDocsInstallable', 'msWord'
    }
]
visible_text = ' '.join(visible_strings)
phrase = 'cursive generator'
phrase_count = visible_text.lower().count(phrase)
total_characters = len(visible_text)
density = phrase_count * len(phrase) / total_characters if total_characters else 0
print(f'total_characters={total_characters}')
print(f'phrase_count={phrase_count}')
print(f'phrase_characters={len(phrase)}')
print(f'density={density:.4%}')
if density < 0.02:
    raise SystemExit('FAILED: cursive generator density is below 2%')
PY
```

Expected output:

```txt
total_characters=<number>
phrase_count=<number>
phrase_characters=17
density=<number greater than or equal to 2.0000%>
```

- [ ] **Step 2: If density is below 2%, adjust only visible English copy**

Use the least invasive natural copy changes first. Prefer adding exact phrase `cursive generator` to existing English strings in this order:

1. `contentSections.howItWorks.steps[1]`
2. `contentSections.useCases.description`
3. `faq.items[0].answer`

Do not change layout, class names, component structure, or add hidden text.

- [ ] **Step 3: Re-run the density script**

Run the same Python command again.

Expected: density is `>= 2.0000%`.

---

### Task 6: Final verification

**Files:**
- Verify all modified files.

- [ ] **Step 1: Run lint**

Run:

```bash
npm run lint
```

Expected: pass.

- [ ] **Step 2: Run tests**

Run:

```bash
npm test
```

Expected: pass.

- [ ] **Step 3: Build the Next.js app**

Run:

```bash
npm run build
```

Expected: build completes successfully.

- [ ] **Step 4: Report exact modified files and density result**

Final report must include:

```txt
Modified files:
- src/app/[locale]/layout.tsx
- src/lib/i18n.ts
- src/components/cursive-generator/cursive-generator-page.tsx
- src/components/cursive-generator/faq-section.tsx

Keyword density check:
- Scope: English visible text from dictionary-rendered content
- Formula: count("cursive generator") * 17 / total visible characters
- Result: <density>
```

---

## Self-Review

- Spec coverage: The plan covers metadata description, hero copy, i18n hard-coded text removal, semantic headings, and exact phrase density verification. It explicitly excludes layout changes and technical SEO items outside方案 B.
- Placeholder scan: No TBD/TODO placeholders remain. Every code change has exact target text.
- Type consistency: `hero.eyebrow` is added to the dictionary type and consumed only through `dictionary.hero.eyebrow`.
- Scope check: This is one focused SEO copy/semantic update and does not need decomposition into separate subsystems.

## Git Note

This directory is not currently a git repository, so commit steps are not included as executable steps. If the project is later placed under git, commit after final verification with a message such as:

```bash
git add src/app/[locale]/layout.tsx src/lib/i18n.ts src/components/cursive-generator/cursive-generator-page.tsx src/components/cursive-generator/faq-section.tsx docs/superpowers/plans/2026-06-10-cursive-generator-seo-copy-density.md
git commit -m "seo: improve cursive generator copy density"
```
