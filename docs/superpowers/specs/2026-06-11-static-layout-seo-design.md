# Static Layout SEO Design

## Goal

Improve crawl efficiency and cacheability by removing the root layout dependency on request headers and eliminating middleware that only existed to pass locale state into the layout.

## Chosen Approach

Use the simplest static-first approach:

- Root layout renders `<html lang="en">`.
- Remove `headers()` usage from `src/app/layout.tsx`.
- Remove the locale request header dependency from root layout.
- Delete `src/middleware.ts` because it no longer has a purpose.
- Keep all visible page components, layouts, class names, and interactions unchanged.

## Trade-off

The English root page gets correct `<html lang="en">` and can be static-friendly.

The Chinese page still has Chinese visible content, Chinese metadata, canonical, hreflang, JSON-LD, and URL path, but the root `<html lang>` remains `en`. This is accepted for this project to avoid a more invasive App Router root-layout restructuring.

## Files to Change

- `src/app/layout.tsx`
  - Remove `headers` import.
  - Remove `normalizeLocale` and `localeRequestHeaderName` imports.
  - Make `RootLayout` synchronous.
  - Set `<html lang="en" suppressHydrationWarning>`.

- `src/app/layout.test.tsx`
  - Remove mock of `next/headers`.
  - Verify root layout always uses `lang="en"`.

- `src/middleware.ts`
  - Delete the file.

- Tests that depend on locale request header behavior should be updated or removed if they only test the deleted middleware/header bridge.

## Verification

Run:

```bash
npm run lint
npx vitest run
npm run build
```

Then inspect build output. The goal is that `/` and relevant metadata routes no longer depend on root `headers()` usage.

## Constraints

Do not change:

- Tool component structure
- Tool area layout
- `className` values
- User interactions
- Visible page copy
- Hidden SEO text

## Self-Review

- No placeholders remain.
- Design matches the user's selected option A.
- Scope is focused on static layout and middleware removal.
- The accepted `html lang` trade-off is explicit.
