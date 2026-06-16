import type { ReactNode } from "react";

import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { MicrosoftClarity } from "@/components/analytics/microsoft-clarity";
import "../globals.css";

type EnglishRootLayoutProps = {
  children: ReactNode;
};

export default function EnglishRootLayout({ children }: EnglishRootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <GoogleAnalytics />
        <MicrosoftClarity />
      </body>
    </html>
  );
}
