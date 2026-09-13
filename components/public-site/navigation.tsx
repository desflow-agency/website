"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronRight, Menu, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import type { Dictionary, Locale } from "@/lib/i18n";
import { localizePath } from "@/lib/i18n/config";
import { navSections } from "@/lib/site";

import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";

type NavigationText = Pick<Dictionary, "nav" | "common" | "theme" | "language">;

export function Navigation({
  locale,
  internalPath,
  sectionLinksToHome,
  t,
}: {
  locale: Locale;
  internalPath: string;
  sectionLinksToHome: boolean;
  t: NavigationText;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const home = localizePath(locale, "/");
  const href = (id: string) => (sectionLinksToHome ? `${home}#${id}` : `#${id}`);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      let current = "";
      for (const id of navSections) {
        const rect = document.getElementById(id)?.getBoundingClientRect();
        if (rect && rect.top <= 180 && rect.bottom >= 180) current = id;
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-3 z-100 flex justify-center px-3 sm:top-5 sm:px-4"
    >
      <div className="relative w-full max-w-6xl">
        <nav
          aria-label={t.nav.aria}
          className={`relative flex h-16 w-full items-center justify-between rounded-2xl border px-3 backdrop-blur-2xl transition-all duration-500 sm:px-4 ${
            scrolled || open ? "border-line-strong bg-canvas/80 shadow-float" : "border-transparent bg-transparent"
          }`}
        >
          {/* LOGO */}
          <a
            href={sectionLinksToHome ? home : "#main"}
            onClick={closeMenu}
            className="flex items-center gap-2.5 rounded-xl px-1.5 py-1.5"
            aria-label={t.common.homeAria}
          >
            <Image src="/dfblack.png" alt="" width={36} height={36} priority className="logo-mark h-8 w-8" />
            <span className="text-lg font-semibold tracking-tight">desflow</span>
          </a>

          {/* LINKI — DESKTOP */}
          <ul className="mx-auto hidden items-center gap-0.5 rounded-full border border-line bg-ink/[0.03] p-1 lg:flex xl:gap-1">
            {navSections.map((id) => {
              const active = activeSection === id;

              return (
                <li key={id}>
                  <a
                    href={href(id)}
                    aria-current={active ? "true" : undefined}
                    className={`relative block whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-medium transition-colors duration-300 xl:px-4 ${
                      active ? "text-fg" : "text-soft hover:text-fg"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="active-nav"
                        className="absolute inset-0 rounded-full bg-ink/10"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative">{t.nav.links[id]}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <LanguageSwitcher locale={locale} internalPath={internalPath} label={t.language.label} />
            <ThemeToggle t={t.theme} />

            {/* CTA — DESKTOP */}
            <a
              href={href("contact")}
              className="group hidden items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-[13px] font-semibold text-canvas transition-all duration-300 hover:shadow-[0_8px_30px_rgba(139,140,255,0.4)] sm:flex lg:hidden xl:flex"
            >
              {t.common.freeQuote}
              <ArrowRight size={15} strokeWidth={2.2} className="transition-transform group-hover:translate-x-0.5" />
            </a>

            {/* PRZYCISK MENU — MOBILE */}
            <button
              type="button"
              onClick={() => setOpen((previous) => !previous)}
              aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-line-strong bg-ink/5 text-fg lg:hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? "close" : "menu"}
                  initial={{ rotate: open ? -90 : 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: open ? 90 : -90, opacity: 0 }}
                >
                  {open ? <X size={19} /> : <Menu size={19} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </nav>

        {/* MENU — MOBILE */}
        <AnimatePresence>
          {open && (
            <>
              <motion.button
                type="button"
                aria-label={t.nav.closeMenu}
                tabIndex={-1}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 -z-10 h-dvh w-full cursor-default bg-black/60 backdrop-blur-sm lg:hidden"
                onClick={closeMenu}
              />

              <motion.div
                id="mobile-menu"
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-x-0 top-[calc(100%+10px)] overflow-hidden rounded-3xl border border-line-strong bg-panel/95 p-2 shadow-float backdrop-blur-2xl lg:hidden"
              >
                <ul className="p-1">
                  {navSections.map((id, index) => (
                    <motion.li
                      key={id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.035 }}
                    >
                      <a
                        href={href(id)}
                        onClick={closeMenu}
                        className="group flex items-center justify-between rounded-2xl px-4 py-3.5 text-[15px] font-medium text-soft transition hover:bg-ink/5 hover:text-fg"
                      >
                        <span className={activeSection === id ? "text-fg" : ""}>{t.nav.links[id]}</span>
                        <ChevronRight size={16} className="text-faint transition-transform group-hover:translate-x-1 group-hover:text-brand" />
                      </a>
                    </motion.li>
                  ))}
                </ul>

                <a
                  href={href("contact")}
                  onClick={closeMenu}
                  className="mt-1 flex items-center justify-between rounded-2xl bg-fg px-5 py-4 text-[15px] font-semibold text-canvas"
                >
                  {t.common.freeQuote}
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-canvas text-fg">
                    <ArrowRight size={16} />
                  </span>
                </a>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
