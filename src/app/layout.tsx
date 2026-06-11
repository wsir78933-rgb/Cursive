import type { Metadata } from "next";
import { headers } from "next/headers";

import { normalizeLocale } from "@/lib/i18n";
import { localeRequestHeaderName } from "@/lib/locale-routing";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cursive Text Generator",
  description: "Generate, copy, preview, and save cursive text styles."
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const requestHeaders = await headers();
  const locale = normalizeLocale(requestHeaders.get(localeRequestHeaderName) ?? undefined);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
