"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";

import { type Locale, localizePath } from "@/lib/i18n/config";
import type { SectionPage } from "@/lib/site";

/*
 * Link do sekcji, który jest prawdziwym adresem podstrony (np. /oferta) — Google widzi osobne strony
 * i może pokazać je w wynikach jako linki pod desflow. Na stronie głównej (scroll = true) klik
 * przewija do sekcji o tym samym id, więc strona dalej działa jak jeden płynny scroll.
 */
export function SectionLink({
  locale,
  section,
  scroll,
  onClick,
  ...props
}: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  locale: Locale;
  section: SectionPage;
  scroll: boolean;
}) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    const plainClick =
      !event.defaultPrevented &&
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey;
    const target = plainClick && scroll ? document.getElementById(section) : null;
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView();
    history.pushState(null, "", `#${section}`);
  };

  return <a href={localizePath(locale, `/${section}`)} onClick={handleClick} {...props} />;
}
