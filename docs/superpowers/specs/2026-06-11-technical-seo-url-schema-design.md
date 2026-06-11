# Technical SEO URL and Schema Design

## Goal

Finish the remaining technical SEO work for the Cursive Generator site without changing the visible tool layout, component styling, or interaction behavior.

## Confirmed Domain

Use the production origin:

```txt
https://cursivegenerator.pro
```

Use the non-www domain for every canonical URL, sitemap URL, robots sitemap entry, and JSON-LD URL.

## URL Strategy

The English page should become the site root:

```txt
https://cursivegenerator.pro/
```

The current English locale URL should redirect permanently to the root:

```txt
https://cursivegenerator.pro/en/cursive-text-generator -> https://cursivegenerator.pro/
```

The Chinese page remains:

```txt
https://cursivegenerator.pro/zh/cursive-text-generator
```

## Canonical URLs

English root page:

```txt
https://cursivegenerator.pro/
```

Chinese page:

```txt
https://cursivegenerator.pro/zh/cursive-text-generator
```

Do not set `/en/cursive-text-generator` as a canonical page because it redirects to `/`.

## Hreflang

Use these alternates:

```txt
en        https://cursivegenerator.pro/
zh        https://cursivegenerator.pro/zh/cursive-text-generator
x-default https://cursivegenerator.pro/
```

## Sitemap

Create `src/app/sitemap.ts` and include only canonical pages:

```txt
https://cursivegenerator.pro/
https://cursivegenerator.pro/zh/cursive-text-generator
```

Use:

```txt
changeFrequency: weekly
priority: 1
```

## Robots

Create `src/app/robots.ts` with:

```txt
User-agent: *
Allow: /
Sitemap: https://cursivegenerator.pro/sitemap.xml
```

## Structured Data

Create an isolated SEO component for JSON-LD. It should render `<script type="application/ld+json">` only and must not affect visual layout.

The component should output:

1. `WebApplication`
2. `FAQPage`

The JSON-LD should use the current locale and dictionary:

- English root page uses `https://cursivegenerator.pro/` and English FAQ content.
- Chinese page uses `https://cursivegenerator.pro/zh/cursive-text-generator` and Chinese FAQ content.

FAQPage must read from `dictionary.faq.items` to avoid duplicating FAQ copy.

## Rendering Plan

Root page `/` should render the English tool page directly instead of redirecting:

```txt
src/app/page.tsx -> English CursiveGeneratorPage + English StructuredData
```

English locale page should redirect permanently to root:

```txt
src/app/[locale]/cursive-text-generator/page.tsx
```

When `locale === "en"`, redirect to `/`.

When `locale === "zh"`, render Chinese page and Chinese StructuredData.

## Metadata Plan

Set `metadataBase` to:

```txt
https://cursivegenerator.pro
```

The root layout or route metadata should provide the English canonical and hreflang alternates for `/`.

The locale layout metadata should provide the Chinese canonical and the same hreflang alternates for `/zh/cursive-text-generator`.

The English locale route redirects, so it should not be the canonical target.

## Constraints

Do not change:

- Tool component structure
- Tool area layout
- `className` values
- User interactions
- Font card layout
- Button layout
- Visible hidden SEO text

Allowed changes:

- Next.js metadata
- Route rendering/redirect behavior
- `sitemap.ts`
- `robots.ts`
- A non-visual JSON-LD component
- Tests for metadata, routing, sitemap, robots, and structured data

## Verification

Run:

```bash
npm run lint
npx vitest run
npm run build
```

Also verify:

- `/` builds as the English page.
- `/en/cursive-text-generator` redirects to `/`.
- `/zh/cursive-text-generator` remains the Chinese page.
- Generated metadata includes canonical and hreflang alternates.
- Sitemap contains `/` and `/zh/cursive-text-generator`, not `/en/cursive-text-generator`.
- Robots references `https://cursivegenerator.pro/sitemap.xml`.
- Rendered HTML includes `application/ld+json` for WebApplication and FAQPage.

## Self-Review

- No placeholders remain.
- The URL strategy is internally consistent: English root is canonical, `/en/cursive-text-generator` redirects, Chinese page remains canonical.
- The design stays within the user's boundary: no visual layout, className, or interaction changes.
- The work is one focused technical SEO implementation and does not require decomposition.

## Git Note

The project directory is not currently a git repository, so this design document cannot be committed from this environment.
