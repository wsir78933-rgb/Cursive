# FAQ Hover Accordion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the FAQ Accordion open on mouse hover and close when the mouse leaves, while preserving click/tap and keyboard behavior.

**Architecture:** Keep the existing shared Accordion UI and current FAQ visual styling. Convert `FaqSection` to control the Accordion's open value with React state, then set/clear that value from each FAQ item's mouse enter/leave handlers.

**Tech Stack:** Next.js, React, TypeScript, Radix Accordion, Vitest, React Testing Library.

---

## File Structure

- Modify: `src/components/cursive-generator/faq-section.tsx`
  - Add client state for the open FAQ value.
  - Add `onMouseEnter` and `onMouseLeave` handlers to each `AccordionItem`.
  - Keep click/tap behavior through Radix `onValueChange`.
- Modify: `src/components/cursive-generator/faq-section.test.tsx`
  - Add tests for hover open and mouse-leave collapse.

## Task 1: Add failing hover interaction tests

**Files:**
- Modify: `src/components/cursive-generator/faq-section.test.tsx`

- [ ] **Step 1: Add hover assertions to the English FAQ test**

Change the first test body to this complete version:

```tsx
  it("preserves the FAQ anchor and renders English FAQ items as accordion triggers", () => {
    const dictionary = getDictionary("en");
    const firstFaqItem = dictionary.faq.items[0];
    const { container } = render(<FaqSection dictionary={dictionary} />);

    expect(container.querySelector("#faq")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: dictionary.faq.title })).toBeInTheDocument();

    const firstQuestion = screen.getByRole("button", {
      name: firstFaqItem.question
    });
    const firstFaqPanel = firstQuestion.closest("[data-state]");

    expect(firstQuestion).toHaveAttribute("aria-expanded", "false");

    fireEvent.mouseEnter(firstFaqPanel!);

    expect(firstQuestion).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(firstFaqItem.answer)).toBeInTheDocument();

    fireEvent.mouseLeave(firstFaqPanel!);

    expect(firstQuestion).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(firstQuestion);

    expect(firstQuestion).toHaveAttribute("aria-expanded", "true");
  });
```

This keeps the click/tap assertion in the same test so mobile behavior is not accidentally removed.

- [ ] **Step 2: Run the FAQ test and verify it fails before implementation**

```bash
npm test -- src/components/cursive-generator/faq-section.test.tsx --run
```

Expected: FAIL because `mouseEnter` does not yet open the Accordion item.

## Task 2: Implement controlled hover behavior

**Files:**
- Modify: `src/components/cursive-generator/faq-section.tsx`

- [ ] **Step 1: Add React state import**

Replace the top imports with:

```tsx
import * as React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import type { getDictionary } from "@/lib/i18n";
```

- [ ] **Step 2: Add controlled open value state inside `FaqSection`**

At the start of the component body, change:

```tsx
export function FaqSection({ dictionary }: FaqSectionProps) {
  return (
```

to:

```tsx
export function FaqSection({ dictionary }: FaqSectionProps) {
  const [openFaqValue, setOpenFaqValue] = React.useState<string>();

  return (
```

- [ ] **Step 3: Make the Accordion controlled**

Replace:

```tsx
<Accordion className="grid gap-3" collapsible type="single">
```

with:

```tsx
<Accordion
  className="grid gap-3"
  collapsible
  onValueChange={setOpenFaqValue}
  type="single"
  value={openFaqValue}
>
```

- [ ] **Step 4: Add hover handlers to each item**

Replace the FAQ item mapping with this complete block:

```tsx
{dictionary.faq.items.map((item, index) => {
  const faqValue = `faq-${index}`;

  return (
    <AccordionItem
      className="rounded-[1.5rem] border border-slate-200 bg-white/85 px-5 shadow-sm"
      key={item.question}
      onMouseEnter={() => setOpenFaqValue(faqValue)}
      onMouseLeave={() => {
        setOpenFaqValue((currentValue) =>
          currentValue === faqValue ? undefined : currentValue
        );
      }}
      value={faqValue}
    >
      <AccordionTrigger>{item.question}</AccordionTrigger>
      <AccordionContent>{item.answer}</AccordionContent>
    </AccordionItem>
  );
})}
```

This keeps click/tap behavior because Radix still calls `onValueChange`.

- [ ] **Step 5: Run the FAQ test and verify it passes**

```bash
npm test -- src/components/cursive-generator/faq-section.test.tsx --run
```

Expected: PASS.

## Task 3: Run focused regression tests

**Files:**
- Test: `src/components/cursive-generator/faq-section.test.tsx`
- Test: `src/components/ui/accordion.test.tsx`
- Test: `src/components/cursive-generator/generator-header.test.tsx`

- [ ] **Step 1: Run focused tests**

```bash
npm test -- src/components/cursive-generator/faq-section.test.tsx src/components/ui/accordion.test.tsx src/components/cursive-generator/generator-header.test.tsx --run
```

Expected: PASS.

## Task 4: Run final verification

**Files:**
- Whole project

- [ ] **Step 1: Run full test suite**

```bash
npm test -- --run
```

Expected: PASS.

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: PASS.

- [ ] **Step 3: Run build with required analytics env vars**

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-TEST NEXT_PUBLIC_CLARITY_PROJECT_ID=claritytest npm run build
```

Expected: PASS.

## Self-Review Notes

- Spec coverage: Hover opens, mouse leave closes, click/tap remains, single-item behavior remains, existing anchor/content stay unchanged.
- Placeholder scan: No placeholders remain.
- Type consistency: `openFaqValue` is `string | undefined`, matching Radix single collapsible controlled value behavior.
