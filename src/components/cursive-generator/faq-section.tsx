import * as React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import type { getDictionary } from "@/lib/i18n";

type Dictionary = ReturnType<typeof getDictionary>;

type FaqSectionProps = {
  dictionary: Dictionary;
};

export function FaqSection({ dictionary }: FaqSectionProps) {
  const [openFaqValue, setOpenFaqValue] = React.useState("");

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-20 pt-4 md:px-8" id="faq">
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-sm md:p-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted">
            {dictionary.contentSections.howItWorks.title}
          </h2>
          <ol className="grid gap-3">
            {dictionary.contentSections.howItWorks.steps.map((step, index) => (
              <li className="flex gap-3 text-sm leading-6 text-slate-700" key={step}>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-xs font-semibold text-white">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-sm md:p-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted">
            {dictionary.contentSections.useCases.title}
          </h2>
          <p className="text-sm leading-6 text-slate-700">
            {dictionary.contentSections.useCases.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {dictionary.contentSections.useCases.items.map((item) => (
              <span
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
                key={item}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-[2rem] border border-slate-200 bg-ink p-6 text-white shadow-sm md:p-8">
        <h2 className="text-2xl font-semibold">
          {dictionary.contentSections.copyableVsPreview.title}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-white/75">
          {dictionary.contentSections.copyableVsPreview.description}
        </p>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-2xl font-semibold text-ink">{dictionary.faq.title}</h2>
        <Accordion
          className="grid gap-3"
          collapsible
          onValueChange={setOpenFaqValue}
          type="single"
          value={openFaqValue}
        >
          {dictionary.faq.items.map((item, index) => {
            const faqValue = `faq-${index}`;

            return (
              <AccordionItem
                className="rounded-[1.5rem] border border-slate-200 bg-white/85 px-5 shadow-sm"
                key={item.question}
                onMouseEnter={() => setOpenFaqValue(faqValue)}
                onMouseLeave={() => {
                  setOpenFaqValue((currentValue) =>
                    currentValue === faqValue ? "" : currentValue
                  );
                }}
                value={faqValue}
              >
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
}
