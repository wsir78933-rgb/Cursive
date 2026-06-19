import Image from "next/image";
import Link from "next/link";

import { AnimatedButtonBorder } from "./animated-button-border";
import { Button } from "@/components/ui/button";
import type { getDictionary, Locale } from "@/lib/i18n";

type Dictionary = ReturnType<typeof getDictionary>;

type GeneratorHeaderProps = {
  dictionary: Dictionary;
  locale: Locale;
};

export function GeneratorHeader({ dictionary, locale }: GeneratorHeaderProps) {
  const homeHref = locale === "en" ? "/" : `/${locale}/cursive-text-generator`;
  const faqHref = locale === "en" ? "/#faq" : `/${locale}/cursive-text-generator#faq`;
  const nextLocaleHref = locale === "en" ? "/zh/cursive-text-generator" : "/";
  const localeLabel = locale === "en" ? "中文" : "EN";

  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 md:px-8">
      <Link
        className="group flex items-center gap-3 text-base font-semibold text-ink"
        href={homeHref}
      >
        <Image
          alt="Cursive Generator icon"
          className="h-9 w-9 rounded-2xl shadow-sm transition group-hover:-translate-y-0.5"
          height={36}
          src="/icon.svg"
          width={36}
        />
        <span>{dictionary.brand}</span>
      </Link>
      <nav className="flex items-center gap-2">
        <Button asChild size="sm" variant="ghost">
          <Link href={faqHref}>FAQ</Link>
        </Button>
        <Button asChild className="relative overflow-hidden" size="sm" variant="outline">
          <Link href={nextLocaleHref}>
            <AnimatedButtonBorder />
            <span className="relative z-10">{localeLabel}</span>
          </Link>
        </Button>
      </nav>
    </header>
  );
}
