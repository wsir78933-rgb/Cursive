# Static Layout SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove request-header driven root layout rendering and delete the now-unneeded middleware so the site is more static/cache friendly.

**Architecture:** Make `src/app/layout.tsx` a static root layout with fixed `lang="en"`. Remove the locale-header bridge by deleting `src/middleware.ts`. Keep all visible components, layout classes, interactions, and page copy unchanged.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest.

---

## File Structure

- Modify: `src/app/layout.tsx`
  - Responsibility: root HTML shell only; no request headers.
- Modify: `src/app/layout.test.tsx`
  - Responsibility: verify root layout always renders `lang="en"`.
- Delete: `src/middleware.ts`
  - Responsibility removed; it only passed locale through a request header for root layout.
- Review: `src/lib/locale-routing.ts`
  - It may become unused. Delete it only if lint shows it has no imports and tests no longer need it.
- Review/Delete if obsolete: `src/lib/locale-routing.test.ts`
  - Delete only if `src/lib/locale-routing.ts` is removed.

No component structure, className, visible layout, interactions, hidden SEO text, or page copy changes.

---

### Task 1: Add failing static root layout test

**Files:**
- Modify: `src/app/layout.test.tsx`

- [ ] **Step 1: Replace dynamic-header tests with static lang test**

Use this full file for `src/app/layout.test.tsx`:

```tsx
import React from "react";
import { describe, expect, it } from "vitest";

import RootLayout from "./layout";

describe("RootLayout", () => {
  it("renders a static English html shell without reading request headers", () => {
    const layoutElement = RootLayout({
      children: <main />
    });

    expect(layoutElement.props.lang).toBe("en");
    expect(layoutElement.props.suppressHydrationWarning).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
npx vitest run src/app/layout.test.tsx
```

Expected: fail before implementation because current `RootLayout` is async and depends on mocked `headers()` behavior removed from the test.

---

### Task 2: Make root layout static

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace `src/app/layout.tsx` with static version**

Use this full file:

```tsx
import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Cursive Text Generator",
  description: "Generate, copy, preview, and save cursive text styles."
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Run root layout test**

Run:

```bash
npx vitest run src/app/layout.test.tsx
```

Expected: pass.

---

### Task 3: Remove middleware and obsolete locale header bridge

**Files:**
- Delete: `src/middleware.ts`
- Delete if unused: `src/lib/locale-routing.ts`
- Delete if unused: `src/lib/locale-routing.test.ts`

- [ ] **Step 1: Delete `src/middleware.ts`**

Remove the file because root layout no longer reads `x-cursive-generator-locale`.

- [ ] **Step 2: Check whether `src/lib/locale-routing.ts` is still imported**

Run:

```bash
grep -R "locale-routing" -n src || true
```

Expected after deleting middleware: no imports except maybe the test file.

- [ ] **Step 3: If only the test imports it, delete both locale-routing files**

Delete:

```txt
src/lib/locale-routing.ts
src/lib/locale-routing.test.ts
```

Reason: the helper existed only for middleware -> root layout header propagation.

- [ ] **Step 4: Run lint**

Run:

```bash
npm run lint
```

Expected: pass. If lint reports unused imports or missing test paths, remove only obsolete references.

---

### Task 4: Verify static/cache-friendly behavior

**Files:**
- Verify all changed files.

- [ ] **Step 1: Run full tests**

Run:

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 2: Run build**

Run:

```bash
npm run build
```

Expected: build succeeds. Confirm no middleware route appears in build output.

- [ ] **Step 3: Run clean local server and inspect responses**

Run:

```bash
rm -rf .next
npm run dev
```

Then request:

```txt
http://localhost:3000/
http://localhost:3000/zh/cursive-text-generator
http://localhost:3000/robots.txt
http://localhost:3000/sitemap.xml
http://localhost:3000/og-image.png
http://localhost:3000/llms.txt
```

Expected:

```txt
/ returns 200 and contains <html lang="en">
/zh/cursive-text-generator returns 200 and still has Chinese content/metadata/JSON-LD
robots/sitemap/og-image/llms return 200
```

Stop the dev server after verification.

---

## Self-Review

- Spec coverage: The plan removes `headers()` from root layout, deletes middleware, updates tests, and verifies build/runtime behavior.
- Placeholder scan: No TBD/TODO placeholders remain.
- Type consistency: `RootLayout` becomes synchronous and tests call it synchronously.
- Scope check: This is a focused static-layout SEO optimization and does not require decomposition.

## Git Note

This project directory is not currently a git repository, so commit steps are intentionally omitted.
