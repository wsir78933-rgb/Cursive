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
