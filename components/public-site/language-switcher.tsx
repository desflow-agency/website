"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { type Locale, localeMeta, locales } from "@/lib/i18n/config";

import { Flag } from "./flags";
import { switchLocale } from "./locale-actions";

export function LanguageSwitcher({
  locale,
  internalPath,
  label,
}: {
  locale: Locale;
  internalPath: string;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${localeMeta[locale].name}`}
        className="flex h-10 cursor-pointer items-center gap-1.5 rounded-full border border-line-strong bg-ink/[0.04] pl-2.5 pr-2 text-xs font-semibold uppercase text-fg transition-colors hover:bg-ink/[0.09]"
      >
        <Flag code={localeMeta[locale].flag} className="h-3 w-[18px] rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.15)]" />
        {locale}
        <ChevronDown size={13} className={`text-faint transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label={label}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-[calc(100%+8px)] z-10 w-44 origin-top-right overflow-hidden rounded-2xl border border-line-strong bg-panel/95 p-1.5 shadow-float backdrop-blur-2xl"
          >
            {locales.map((option) => {
              const selected = option === locale;

              return (
                <li key={option} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    lang={localeMeta[option].htmlLang}
                    onClick={() => {
                      setOpen(false);
                      if (!selected) switchLocale(option, internalPath);
                    }}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                      selected ? "bg-ink/[0.06] font-semibold text-fg" : "text-soft hover:bg-ink/[0.05] hover:text-fg"
                    }`}
                  >
                    <Flag code={localeMeta[option].flag} className="h-3.5 w-5 rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.15)]" />
                    <span className="flex-1">{localeMeta[option].name}</span>
                    {selected && <Check size={15} className="text-brand" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
