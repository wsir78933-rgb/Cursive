import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { getDictionary, Locale } from "@/lib/i18n";

type Dictionary = ReturnType<typeof getDictionary>;

type GeneratorHeaderProps = {
  dictionary: Dictionary;
  locale: Locale;
};

export function GeneratorHeader({ dictionary, locale }: GeneratorHeaderProps) {
  const nextLocale = locale === "en" ? "zh" : "en";
  const localeLabel = locale === "en" ? "中文" : "EN";

  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 md:px-8">
      <Link
        className="group flex items-center gap-3 text-base font-semibold text-ink"
        href={`/${locale}/cursive-text-generator`}
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
          <Link href={`/${locale}/cursive-text-generator#faq`}>FAQ</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href={`/${nextLocale}/cursive-text-generator`}>{localeLabel}</Link>
        </Button>
      </nav>
    </header>
  );
}
