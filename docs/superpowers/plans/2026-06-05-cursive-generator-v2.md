# Cursive Generator V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js cursive text generator that matches TheWordFinder visible functionality with a cleaner modern UI.

**Architecture:** Create a small App Router project with i18n routes under `/[locale]/cursive-text-generator`. Keep style configuration, Unicode transforms, filtering, translations, canvas export, and UI components separate so each file has one responsibility. Use shadcn-style components for Button, Slider, Switch, RadioGroup, Dialog, and Input while custom-building the font card grid.

**Tech Stack:** Next.js App Router, React, TypeScript, shadcn/ui-style components, Tailwind CSS, Vitest, Testing Library, html-to-image/canvas helpers.

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.ts`
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/[locale]/cursive-text-generator/page.tsx`
- Create: `src/app/[locale]/layout.tsx`

- [ ] Add Next.js, React, TypeScript, Tailwind, Vitest, Testing Library, Radix primitives, lucide-react, class helpers, and html-to-image dependencies.
- [ ] Configure App Router and locale redirect from `/` to `/en/cursive-text-generator`.
- [ ] Configure Tailwind content paths and global styles.

### Task 2: Core Data and Transform Tests

**Files:**
- Create: `src/lib/text-styles.ts`
- Create: `src/lib/text-transform.ts`
- Create: `src/lib/text-transform.test.ts`
- Create: `src/lib/style-filters.test.ts`

- [ ] Write failing tests for Unicode Script transforming `hello world` while preserving spaces and unmapped characters.
- [ ] Write failing tests that font styles copy original text.
- [ ] Write failing tests for filter membership across All, Instagram/TikTok/Youtube, Google Docs Default, Google Docs Installable, and MS Word.
- [ ] Implement style definitions and transform functions until tests pass.

### Task 3: i18n Copy

**Files:**
- Create: `src/lib/i18n.ts`
- Create: `src/lib/i18n.test.ts`

- [ ] Write failing tests for supported locale normalization and required English/Chinese labels.
- [ ] Implement translation dictionaries for UI labels and FAQ.

### Task 4: shadcn-style UI Primitives

**Files:**
- Create: `src/lib/utils.ts`
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/slider.tsx`
- Create: `src/components/ui/switch.tsx`
- Create: `src/components/ui/radio-group.tsx`
- Create: `src/components/ui/dialog.tsx`

- [ ] Add small shadcn-style wrappers around Radix primitives and shared styling.

### Task 5: Generator UI

**Files:**
- Create: `src/components/cursive-generator/cursive-generator-page.tsx`
- Create: `src/components/cursive-generator/font-card.tsx`
- Create: `src/components/cursive-generator/font-grid.tsx`
- Create: `src/components/cursive-generator/generator-toolbar.tsx`
- Create: `src/components/cursive-generator/preview-dialog.tsx`
- Create: `src/components/cursive-generator/faq-section.tsx`

- [ ] Implement desktop six-column grid and mobile two-column grid.
- [ ] Implement text input default `hello world`, size 16-96px, preset/custom color, transparent switch.
- [ ] Implement filter radio group and card selection behavior.
- [ ] Implement Preview dialog with current text/style/color/size/background.

### Task 6: Copy and Save PNG

**Files:**
- Create: `src/lib/export-image.ts`
- Modify: `src/components/cursive-generator/cursive-generator-page.tsx`

- [ ] Implement copy behavior: Unicode styles copy transformed text, font styles copy original text.
- [ ] Implement PNG save from the current preview using canvas/html-to-image behavior.
- [ ] Ensure transparent background only affects Preview/Save output.

### Task 7: Verification

**Commands:**
- `npm test -- --run`
- `npm run lint`
- `npm run build`
- `npm run dev`

- [ ] Verify routes `/`, `/en/cursive-text-generator`, `/zh/cursive-text-generator`.
- [ ] Verify input, filters, card selection, copy, preview, save PNG, desktop grid, mobile grid.
