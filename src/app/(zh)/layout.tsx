import type { ReactNode } from "react";

import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import "../globals.css";

type ChineseRootLayoutProps = {
  children: ReactNode;
};

export default function ChineseRootLayout({ children }: ChineseRootLayoutProps) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body>
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
