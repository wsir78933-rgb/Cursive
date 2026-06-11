# Text Overflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-line text input with a multiline textarea, add a non-blocking 60-character suggestion, and prevent long cursive text from overflowing preview and PNG export containers.

**Architecture:** Keep business state in `CursiveGeneratorPage`, add a small reusable `Textarea` UI primitive, and keep preview components responsible only for display. Use i18n string fragments for visible counter text so English and Chinese pages stay localized without passing functions across the server/client boundary.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Vitest, Testing Library, jsdom.

---

## Notes Before Execution

- The design spec approved by the user is on the Desktop: `/Users/wusir/Desktop/2026-06-10-text-overflow-design.md`.
- The project is currently **not a git repository**, so the commit steps that normally belong after each task are replaced with checkpoints. If the project is later initialized as a git repo, use the suggested commit messages.
- Run commands from project root: `/Users/wusir/Desktop/开发项目集合/Cursive Generator`.

## File Structure

- Modify: `src/lib/i18n.ts`
  - Add localized text fragments for the input character suggestion.
  - Keep dictionary values serializable strings only.
- Modify: `src/lib/i18n.test.ts`
  - Verify English and Chinese counter labels exist.
- Create: `src/components/ui/textarea.tsx`
  - Reusable textarea primitive matching existing shadcn-style UI component patterns.
- Create: `src/components/ui/textarea.test.tsx`
  - Verify the component renders as a textarea and preserves custom classes.
- Modify: `src/components/cursive-generator/cursive-generator-page.tsx`
  - Replace `Input` with `Textarea`.
  - Add suggested character count constant, count calculation, and counter UI.
  - Prevent PNG export node from expanding horizontally.
- Modify: `src/components/cursive-generator/cursive-generator-page.test.tsx`
  - Verify textarea behavior, counter text, warning color, and PNG wrapping style.
- Modify: `src/components/cursive-generator/style-preview-panel.tsx`
  - Strengthen wrapping for the main preview output.
- Modify: `src/components/cursive-generator/style-preview-panel.test.tsx`
  - Verify the long text span has forced wrapping classes.
- Modify: `src/components/cursive-generator/preview-dialog.tsx`
  - Strengthen wrapping for the dialog preview output.
- No backend, route, database, or external service changes.

---

## Task 1: Add Localized Character Count Copy

**Files:**
- Modify: `src/lib/i18n.ts`
- Modify: `src/lib/i18n.test.ts`

- [ ] **Step 1: Write failing dictionary tests**

Add these assertions to the existing `getDictionary` tests in `src/lib/i18n.test.ts`.

In `provides English labels for the redesigned workbench`, add:

```ts
expect(dictionary.inputCharacterCount.suggestedPrefix).toBe("Suggested");
expect(dictionary.inputCharacterCount.suggestedSuffix).toBe("characters or fewer");
```

In `provides Chinese labels for the redesigned workbench`, add:

```ts
expect(dictionary.inputCharacterCount.suggestedPrefix).toBe("建议");
expect(dictionary.inputCharacterCount.suggestedSuffix).toBe("字以内");
```

- [ ] **Step 2: Run the i18n test and verify it fails**

Run:

```bash
npm test -- src/lib/i18n.test.ts
```

Expected: FAIL because `inputCharacterCount` does not exist on the dictionary yet.

- [ ] **Step 3: Add dictionary type fields**

In `src/lib/i18n.ts`, update the `Dictionary` type near the existing `inputLabel` field:

```ts
type Dictionary = {
  title: string;
  brand: string;
  inputLabel: string;
  inputCharacterCount: {
    suggestedPrefix: string;
    suggestedSuffix: string;
  };
  hero: {
    description: string;
  };
```

- [ ] **Step 4: Add English dictionary values**

In the `en` dictionary, directly after `inputLabel: "Your text",`, add:

```ts
inputCharacterCount: {
  suggestedPrefix: "Suggested",
  suggestedSuffix: "characters or fewer"
},
```

- [ ] **Step 5: Add Chinese dictionary values**

In the `zh` dictionary, directly after `inputLabel: "输入文本",`, add:

```ts
inputCharacterCount: {
  suggestedPrefix: "建议",
  suggestedSuffix: "字以内"
},
```

- [ ] **Step 6: Run the i18n test and verify it passes**

Run:

```bash
npm test -- src/lib/i18n.test.ts
```

Expected: PASS.

- [ ] **Step 7: Checkpoint**

No git commit because this project is not a git repository. If git is initialized later, commit with:

```bash
git add src/lib/i18n.ts src/lib/i18n.test.ts
git commit -m "feat: add localized input character count labels"
```

---

## Task 2: Add a Reusable Textarea Component

**Files:**
- Create: `src/components/ui/textarea.tsx`
- Create: `src/components/ui/textarea.test.tsx`

- [ ] **Step 1: Write the failing textarea component test**

Create `src/components/ui/textarea.test.tsx` with:

```tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("renders a multiline textbox and preserves custom classes", () => {
    render(
      <Textarea aria-label="Message" className="min-h-32 text-lg">
        hello
      </Textarea>
    );

    const textarea = screen.getByRole("textbox", { name: "Message" });

    expect(textarea.tagName).toBe("TEXTAREA");
    expect(textarea).toHaveClass("min-h-32");
    expect(textarea).toHaveClass("text-lg");
  });
});
```

- [ ] **Step 2: Run the textarea test and verify it fails**

Run:

```bash
npm test -- src/components/ui/textarea.test.tsx
```

Expected: FAIL because `./textarea` does not exist.

- [ ] **Step 3: Create the Textarea component**

Create `src/components/ui/textarea.tsx` with:

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-ink shadow-sm transition-all placeholder:text-slate-400 focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = "Textarea";
```

- [ ] **Step 4: Run the textarea test and verify it passes**

Run:

```bash
npm test -- src/components/ui/textarea.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Checkpoint**

No git commit because this project is not a git repository. If git is initialized later, commit with:

```bash
git add src/components/ui/textarea.tsx src/components/ui/textarea.test.tsx
git commit -m "feat: add textarea ui primitive"
```

---

## Task 3: Replace the Generator Input with Textarea and Counter

**Files:**
- Modify: `src/components/cursive-generator/cursive-generator-page.tsx`
- Modify: `src/components/cursive-generator/cursive-generator-page.test.tsx`

- [ ] **Step 1: Add failing page tests for textarea and counter**

In `src/components/cursive-generator/cursive-generator-page.test.tsx`, add these tests inside `describe("CursiveGeneratorPage", () => { ... })`:

```tsx
it("uses a multiline text area with a non-blocking suggested character count", () => {
  mockClipboardWriteText(vi.fn());

  render(<CursiveGeneratorPage dictionary={getDictionary("en")} locale="en" />);

  const textInput = screen.getByLabelText("Your text");

  expect(textInput.tagName).toBe("TEXTAREA");
  expect(screen.getByText("11 / Suggested 60 characters or fewer")).toHaveClass("text-slate-500");

  fireEvent.change(textInput, {
    target: { value: "a".repeat(61) }
  });

  expect(textInput).toHaveValue("a".repeat(61));
  expect(screen.getByText("61 / Suggested 60 characters or fewer")).toHaveClass("text-amber-700");
});

it("uses localized Chinese suggested character count text", () => {
  mockClipboardWriteText(vi.fn());

  render(<CursiveGeneratorPage dictionary={getDictionary("zh")} locale="zh" />);

  expect(screen.getByText("11 / 建议 60 字以内")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the page test and verify it fails**

Run:

```bash
npm test -- src/components/cursive-generator/cursive-generator-page.test.tsx
```

Expected: FAIL because the page still renders an `input` and does not render the character count.

- [ ] **Step 3: Replace the import**

In `src/components/cursive-generator/cursive-generator-page.tsx`, replace:

```ts
import { Input } from "@/components/ui/input";
```

with:

```ts
import { Textarea } from "@/components/ui/textarea";
```

- [ ] **Step 4: Add the suggested count constant**

Near the existing defaults:

```ts
const defaultInputText = "hello world";
const defaultTextColor = "#1c2430";
const defaultFontSize = 48;
const suggestedInputCharacterCount = 60;
```

- [ ] **Step 5: Add count variables inside the component**

After `const selectedPreviewText = getPreviewText(selectedStyle);`, add:

```ts
const inputCharacterCount = Array.from(inputText).length;
const isOverSuggestedInputCharacterCount =
  inputCharacterCount > suggestedInputCharacterCount;
const characterCountHintClassName = getCharacterCountHintClassName(
  isOverSuggestedInputCharacterCount
);
const characterCountHint = `${inputCharacterCount} / ${dictionary.inputCharacterCount.suggestedPrefix} ${suggestedInputCharacterCount} ${dictionary.inputCharacterCount.suggestedSuffix}`;
```

- [ ] **Step 6: Add the class helper**

Add this helper below `CursiveGeneratorPage`, before the final end of the file:

```ts
function getCharacterCountHintClassName(isOverSuggestedInputCharacterCount: boolean): string {
  if (isOverSuggestedInputCharacterCount) {
    return "mt-2 text-right text-xs font-semibold text-amber-700";
  }

  return "mt-2 text-right text-xs font-semibold text-slate-500";
}
```

- [ ] **Step 7: Replace the input JSX**

Replace the current block:

```tsx
<Input
  className="h-16 border-0 bg-transparent px-4 text-2xl shadow-none focus-visible:ring-0 md:h-20 md:text-4xl"
  id="generator-input"
  onChange={(event) => setInputText(event.target.value)}
  style={{ fontFamily: selectedStyle.fontFamily }}
  value={inputText}
/>
```

with:

```tsx
<Textarea
  className="min-h-28 resize-y border-0 bg-transparent px-4 text-2xl leading-tight shadow-none focus-visible:ring-0 md:min-h-36 md:text-4xl"
  id="generator-input"
  onChange={(event) => setInputText(event.target.value)}
  style={{ fontFamily: selectedStyle.fontFamily }}
  value={inputText}
/>
<p className={characterCountHintClassName}>{characterCountHint}</p>
```

- [ ] **Step 8: Run the page test and verify it passes**

Run:

```bash
npm test -- src/components/cursive-generator/cursive-generator-page.test.tsx
```

Expected: PASS.

- [ ] **Step 9: Checkpoint**

No git commit because this project is not a git repository. If git is initialized later, commit with:

```bash
git add src/components/cursive-generator/cursive-generator-page.tsx src/components/cursive-generator/cursive-generator-page.test.tsx
git commit -m "feat: use multiline generator input with count hint"
```

---

## Task 4: Force Wrapping in Main and Dialog Previews

**Files:**
- Modify: `src/components/cursive-generator/style-preview-panel.tsx`
- Modify: `src/components/cursive-generator/style-preview-panel.test.tsx`
- Modify: `src/components/cursive-generator/preview-dialog.tsx`
- Modify: `src/components/cursive-generator/cursive-generator-page.test.tsx`

- [ ] **Step 1: Add failing test for main preview wrapping classes**

In `src/components/cursive-generator/style-preview-panel.test.tsx`, add:

```tsx
test("forces long preview text to wrap inside the preview card", () => {
  const longPreviewText = "dasdasdasdasdadasdasdasdasdasdasdas";

  render(
    <StylePreviewPanel
      copyLabel="Copy"
      dictionary={getDictionary("en")}
      fontSize={48}
      onCopy={vi.fn()}
      onPreview={vi.fn()}
      onSave={vi.fn()}
      previewText={longPreviewText}
      selectedStyle={findStyle("unicode-script")}
      textColor="#1c2430"
      transparentBackground={false}
    />
  );

  const previewText = screen.getByText(longPreviewText);

  expect(previewText).toHaveClass("max-w-full");
  expect(previewText).toHaveClass("whitespace-pre-wrap");
  expect(previewText.className).toContain("[overflow-wrap:anywhere]");
  expect(previewText.className).toContain("[word-break:break-word]");
});
```

- [ ] **Step 2: Add failing page test for dialog wrapping classes**

In `src/components/cursive-generator/cursive-generator-page.test.tsx`, add:

```tsx
it("forces long preview text to wrap inside the preview dialog", async () => {
  mockClipboardWriteText(vi.fn());

  render(<CursiveGeneratorPage dictionary={getDictionary("en")} locale="en" />);

  const longInputText = "dasdasdasdasdadasdasdasdasdasdasdas";
  fireEvent.change(screen.getByLabelText("Your text"), {
    target: { value: longInputText }
  });
  fireEvent.click(screen.getByRole("button", { name: "Preview" }));

  const previewText = await screen.findByText(longInputText);

  expect(previewText).toHaveClass("max-w-full");
  expect(previewText).toHaveClass("whitespace-pre-wrap");
  expect(previewText.className).toContain("[overflow-wrap:anywhere]");
  expect(previewText.className).toContain("[word-break:break-word]");
});
```

- [ ] **Step 3: Run the preview tests and verify they fail**

Run:

```bash
npm test -- src/components/cursive-generator/style-preview-panel.test.tsx src/components/cursive-generator/cursive-generator-page.test.tsx
```

Expected: FAIL because the wrapping classes are not present yet.

- [ ] **Step 4: Update main preview span classes**

In `src/components/cursive-generator/style-preview-panel.tsx`, replace:

```tsx
<span className="max-w-full break-words leading-tight">{previewText || " "}</span>
```

with:

```tsx
<span className="block max-w-full whitespace-pre-wrap break-words text-center leading-tight [overflow-wrap:anywhere] [word-break:break-word]">
  {previewText || " "}
</span>
```

- [ ] **Step 5: Update dialog preview span classes**

In `src/components/cursive-generator/preview-dialog.tsx`, replace:

```tsx
<span className="max-w-full break-words text-center leading-tight">
  {previewText || " "}
</span>
```

with:

```tsx
<span className="block max-w-full whitespace-pre-wrap break-words text-center leading-tight [overflow-wrap:anywhere] [word-break:break-word]">
  {previewText || " "}
</span>
```

- [ ] **Step 6: Run the preview tests and verify they pass**

Run:

```bash
npm test -- src/components/cursive-generator/style-preview-panel.test.tsx src/components/cursive-generator/cursive-generator-page.test.tsx
```

Expected: PASS.

- [ ] **Step 7: Checkpoint**

No git commit because this project is not a git repository. If git is initialized later, commit with:

```bash
git add src/components/cursive-generator/style-preview-panel.tsx src/components/cursive-generator/style-preview-panel.test.tsx src/components/cursive-generator/preview-dialog.tsx src/components/cursive-generator/cursive-generator-page.test.tsx
git commit -m "fix: wrap long cursive preview text"
```

---

## Task 5: Prevent PNG Export Node from Expanding Horizontally

**Files:**
- Modify: `src/components/cursive-generator/cursive-generator-page.tsx`
- Modify: `src/components/cursive-generator/cursive-generator-page.test.tsx`

- [ ] **Step 1: Add failing PNG export wrapping test**

In `src/components/cursive-generator/cursive-generator-page.test.tsx`, add:

```tsx
it("keeps the PNG export node at a fixed width and wraps long text", () => {
  mockClipboardWriteText(vi.fn());

  render(<CursiveGeneratorPage dictionary={getDictionary("en")} locale="en" />);

  const exportOutput = screen.getByTestId("png-export-output");

  expect(exportOutput.style.boxSizing).toBe("border-box");
  expect(exportOutput.style.width).toBe("620px");
  expect(exportOutput.style.maxWidth).toBe("620px");
  expect(exportOutput.style.overflowWrap).toBe("anywhere");
  expect(exportOutput.style.wordBreak).toBe("break-word");
  expect(exportOutput.style.whiteSpace).toBe("pre-wrap");
});
```

- [ ] **Step 2: Run the page test and verify it fails**

Run:

```bash
npm test -- src/components/cursive-generator/cursive-generator-page.test.tsx
```

Expected: FAIL because the PNG export node still uses `minWidth` and does not define fixed wrapping styles.

- [ ] **Step 3: Update PNG export node style**

In `src/components/cursive-generator/cursive-generator-page.tsx`, replace this style section:

```tsx
style={{
  alignItems: "center",
  backgroundColor: transparentBackground ? "transparent" : "#ffffff",
  color: textColor,
  display: "flex",
  fontFamily: selectedStyle.fontFamily,
  fontSize,
  justifyContent: "center",
  lineHeight: 1.18,
  minHeight: 220,
  minWidth: 620,
  padding: 36,
  textAlign: "center",
  whiteSpace: "pre-wrap"
}}
```

with:

```tsx
style={{
  alignItems: "center",
  backgroundColor: transparentBackground ? "transparent" : "#ffffff",
  boxSizing: "border-box",
  color: textColor,
  display: "flex",
  fontFamily: selectedStyle.fontFamily,
  fontSize,
  justifyContent: "center",
  lineHeight: 1.18,
  maxWidth: 620,
  minHeight: 220,
  overflowWrap: "anywhere",
  padding: 36,
  textAlign: "center",
  whiteSpace: "pre-wrap",
  width: 620,
  wordBreak: "break-word"
}}
```

- [ ] **Step 4: Run the page test and verify it passes**

Run:

```bash
npm test -- src/components/cursive-generator/cursive-generator-page.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Checkpoint**

No git commit because this project is not a git repository. If git is initialized later, commit with:

```bash
git add src/components/cursive-generator/cursive-generator-page.tsx src/components/cursive-generator/cursive-generator-page.test.tsx
git commit -m "fix: constrain png export text wrapping"
```

---

## Task 6: Full Verification

**Files:**
- No code changes unless verification reveals a defect.

- [ ] **Step 1: Run focused tests**

Run:

```bash
npm test -- src/lib/i18n.test.ts src/components/ui/textarea.test.tsx src/components/cursive-generator/style-preview-panel.test.tsx src/components/cursive-generator/cursive-generator-page.test.tsx
```

Expected: PASS.

- [ ] **Step 2: Run all tests**

Run:

```bash
npm test
```

Expected: PASS.

- [ ] **Step 3: Run lint**

Run:

```bash
npm run lint
```

Expected: PASS with no new lint errors.

- [ ] **Step 4: Run production build**

Run:

```bash
npm run build
```

Expected: PASS and Next.js build completes successfully.

- [ ] **Step 5: Manual browser verification**

Run:

```bash
npm run dev
```

Open the local Next.js URL printed by the command. Verify:

1. Input area is a multiline textarea.
2. Default text shows `11 / Suggested 60 characters or fewer` on English pages.
3. Chinese page shows `11 / 建议 60 字以内`.
4. Enter `dasdasdasdasdadasdasdasdasdasdasdas` and confirm the input wraps instead of staying on one line.
5. Main preview does not run under the right-side settings panel.
6. Open Preview and confirm dialog preview wraps the same long text.
7. Increase font size to 96px and confirm long text still stays inside the preview card by wrapping.
8. Toggle transparent background and confirm preview/dialog/PNG export background behavior still works.
9. Click Copy and Save to confirm existing actions still work.

Stop the dev server with `Ctrl+C` after verification.

- [ ] **Step 6: Final checkpoint**

No git commit because this project is not a git repository. If git is initialized later, commit remaining verified changes with:

```bash
git add src/lib/i18n.ts src/lib/i18n.test.ts src/components/ui/textarea.tsx src/components/ui/textarea.test.tsx src/components/cursive-generator/cursive-generator-page.tsx src/components/cursive-generator/cursive-generator-page.test.tsx src/components/cursive-generator/style-preview-panel.tsx src/components/cursive-generator/style-preview-panel.test.tsx src/components/cursive-generator/preview-dialog.tsx
git commit -m "fix: improve long text input and preview wrapping"
```

---

## Self-Review

- Spec coverage:
  - Multiline input: Task 3.
  - Non-blocking 60-character suggestion: Tasks 1 and 3.
  - Main preview wrapping: Task 4.
  - Dialog preview wrapping: Task 4.
  - PNG export wrapping: Task 5.
  - Existing copy/save/preview behavior not broken: Task 6.
- Placeholder scan: No TBD, TODO, unspecified implementation, or vague test instructions remain.
- Type consistency:
  - `inputCharacterCount.suggestedPrefix` and `inputCharacterCount.suggestedSuffix` are added to the `Dictionary` type and both locale objects.
  - `Textarea` uses `React.TextareaHTMLAttributes<HTMLTextAreaElement>` and is imported by `CursiveGeneratorPage`.
  - The suggested count constant name is consistently `suggestedInputCharacterCount`.
  - The helper name is consistently `getCharacterCountHintClassName`.
