# FAQ Hover Accordion Design

## Context

The FAQ section has already been converted from static cards to an Accordion. The current rounded white row style is acceptable. The requested improvement is interaction-only: desktop users should be able to open FAQ answers by hovering, and the answer should collapse when the mouse leaves.

## Approved Behavior

- Keep the current FAQ Accordion visual style.
- When a mouse pointer enters a FAQ item, open that item.
- When the pointer leaves that FAQ item, close it.
- Keep click/tap behavior available for mobile and keyboard users.
- Keep single-item behavior: only one FAQ item should be open at a time.
- Preserve the existing `#faq` section anchor and localized FAQ content.

## Implementation Direction

Use controlled Accordion state in `src/components/cursive-generator/faq-section.tsx`:

- Track the currently open FAQ item value with React state.
- Pass the state to the Accordion with `value` and `onValueChange`.
- Add `onMouseEnter` to each `AccordionItem` to set the hovered item value.
- Add `onMouseLeave` to each `AccordionItem` to close that item if it is currently open.
- Leave `AccordionTrigger` clickable so touch and keyboard users can still operate the FAQ.

## Testing

Update `src/components/cursive-generator/faq-section.test.tsx` to verify:

- Hovering the first FAQ item expands its trigger.
- Leaving that FAQ item collapses it.
- Clicking still expands an FAQ item.
- Existing English/Chinese FAQ rendering tests continue to pass.

## Scope

This design does not change FAQ copy, SEO data, page routing, or the overall page layout.
