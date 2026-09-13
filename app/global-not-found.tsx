import "./globals.css";

import type { Metadata } from "next";

import { NotFoundView } from "@/components/public-site/not-found-view";
import { themeInitScript } from "@/lib/theme";

import { fontClassName } from "./fonts";

export const metadata: Metadata = {
  title: "Nie znaleziono strony | desflow",
};

// Awaryjna 404 dla adresów spoza wersji językowych (np. /admin/cokolwiek). Zwykle działa app/[locale]/not-found.tsx.
export default function GlobalNotFound() {
  return (
    <html lang="pl" data-theme="dark" suppressHydrationWarning className={fontClassName}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <NotFoundView locale="pl" />
      </body>
    </html>
  );
}
