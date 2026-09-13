import "../globals.css";

import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

import { fontClassName } from "../fonts";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  robots: { index: false, follow: false },
};

// Osobny główny layout panelu admina — bez wersji językowych i motywów strony publicznej.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={fontClassName}>
      <body>{children}</body>
    </html>
  );
}
