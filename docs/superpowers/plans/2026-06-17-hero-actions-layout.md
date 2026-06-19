# Hero Actions Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the hero selected-style preview card and move the main Copy/Save/Preview actions under the input, with Preview hidden on mobile.

**Architecture:** Keep the existing `CursiveGeneratorPage` state and handlers. Replace the `StylePreviewPanel` hero usage with a small focused action row inside `cursive-generator-page.tsx`; keep the hidden PNG export node and preview dialog as the real preview/export targets.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Vitest, Testing Library.

---

### File Structure

- Modify: `src/components/cursive-generator/cursive-generator-page.tsx`
  - Remove the hero import and render usage of `StylePreviewPanel`.
  - Add the Copy/Save/Preview buttons below the input card.
  - Use responsive classes so Preview is hidden below the `sm` breakpoint.
  - Keep `GeneratorToolbar`, `PreviewDialog`, and the hidden PNG export node.
- Modify: `src/components/cursive-generator/cursive-generator-page.test.tsx`
  - Update tests that expected the removed `main-style-preview-output` element.
  - Add assertions for desktop/mobile button class behavior.

### Task 1: Move hero actions under the input

**Files:**
- Modify: `src/components/cursive-generator/cursive-generator-page.tsx`

- [ ] **Step 1: Update imports**

Remove `StylePreviewPanel` and import icons/buttons used by the new action row:

```tsx
import { Copy, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
```

- [ ] **Step 2: Add action buttons below the input card**

After the textarea card, render:

```tsx
<div className="flex flex-wrap gap-3">
  <Button onClick={handleCopy} type="button" variant="accent">
    <Copy className="h-4 w-4" />
    {copyLabel}
  </Button>
  <Button onClick={handleSave} type="button" variant="outline">
    <Download className="h-4 w-4" />
    {dictionary.actions.save}
  </Button>
  <Button className="hidden sm:inline-flex" onClick={openPreview} type="button" variant="outline">
    <Eye className="h-4 w-4" />
    {dictionary.actions.preview}
  </Button>
</div>
```

- [ ] **Step 3: Remove selected preview panel from hero layout**

Replace the two-column hero with a single content column plus toolbar below it. Remove the `StylePreviewPanel` JSX block entirely.

- [ ] **Step 4: Run focused tests**

Run:

```bash
npm test -- src/components/cursive-generator/cursive-generator-page.test.tsx src/components/cursive-generator/cursive-generator-page.render.test.tsx
```

Expected: tests pass after test updates in Task 2.

### Task 2: Update focused tests

**Files:**
- Modify: `src/components/cursive-generator/cursive-generator-page.test.tsx`

- [ ] **Step 1: Replace removed main preview assertion**

In the save Google font test, remove this assertion because the main preview card no longer exists:

```tsx
expect(screen.getByTestId("main-style-preview-output").style.fontFamily).toContain(
  "Dancing Script"
);
```

Keep the input and PNG export assertions.

- [ ] **Step 2: Add responsive preview button assertion**

Add this test:

```tsx
it("keeps preview as a desktop-only hero action", () => {
  mockClipboardWriteText(vi.fn());

  render(<CursiveGeneratorPage dictionary={getDictionary("en")} locale="en" />);

  const previewButton = screen.getByRole("button", { name: "Preview" });

  expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  expect(previewButton).toHaveClass("hidden");
  expect(previewButton).toHaveClass("sm:inline-flex");
});
```

- [ ] **Step 3: Run focused tests**

Run:

```bash
npm test -- src/components/cursive-generator/cursive-generator-page.test.tsx src/components/cursive-generator/cursive-generator-page.render.test.tsx
```

Expected: all focused tests pass.

### Task 3: Final validation

**Files:**
- Check: `src/components/cursive-generator/cursive-generator-page.tsx`
- Check: `src/components/cursive-generator/cursive-generator-page.test.tsx`

- [ ] **Step 1: Run lint**

Run:

```bash
npm run lint
```

Expected: no lint errors from the changed files.

- [ ] **Step 2: Summarize result**

Report:

- What changed.
- Why it matches the requested layout.
- Which tests were run and whether they passed.
- Any remaining caveats.

### Self-Review

- Spec coverage: The plan removes the right preview card, moves actions under the input, hides Preview on mobile, and preserves copy/save/preview behavior.
- Placeholder scan: No TBD/TODO placeholders.
- Type consistency: Uses existing `handleCopy`, `handleSave`, `openPreview`, `copyLabel`, and dictionary keys already defined in `CursiveGeneratorPage`.
