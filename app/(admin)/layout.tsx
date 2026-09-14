import "../globals.css";

import type { Metadata, Viewport } from "next";

import { siteConfig } from "@/lib/site";
import { themeInitScript } from "@/lib/theme";

import { fontClassName } from "../fonts";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Panel administracyjny | desflow",
    template: "%s | desflow",
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#07070b",
  colorScheme: "dark light",
};

// Osobny główny layout panelu admina — bez wersji językowych, ale z tym samym motywem (jasny / ciemny) co strona.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" data-theme="dark" suppressHydrationWarning className={fontClassName}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
