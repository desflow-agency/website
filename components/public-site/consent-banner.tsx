"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Cookie } from "lucide-react";
import { useEffect, useState } from "react";

import { onConsentOpen, openConsentSettings, readConsent, saveConsent } from "@/lib/consent";
import type { Dictionary } from "@/lib/i18n";

export function ConsentBanner({ t, privacyHref }: { t: Dictionary["consent"]; privacyHref: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!readConsent()) {
      const timer = window.setTimeout(() => setOpen(true), 900);
      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => onConsentOpen(() => setOpen(true)), []);

  const choose = (analytics: boolean) => {
    saveConsent(analytics);
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-labelledby="consent-title"
          aria-describedby="consent-text"
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="fixed inset-x-3 bottom-3 z-[160] mx-auto max-w-md overflow-hidden rounded-3xl border border-line-strong bg-panel/95 p-5 shadow-float backdrop-blur-2xl sm:bottom-6 sm:left-6 sm:right-auto sm:mx-0"
        >
          <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-amber/15 blur-3xl" />

          <div className="relative flex gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-line bg-ink/[0.04] text-amber">
              <Cookie size={20} strokeWidth={1.8} />
            </span>
            <div className="min-w-0">
              <p id="consent-title" className="font-semibold tracking-tight">
                {t.title}
              </p>
              <p id="consent-text" className="mt-1 text-sm leading-6 text-soft">
                {t.text}{" "}
                <a href={privacyHref} className="text-fg underline decoration-line-strong underline-offset-2 hover:decoration-fg">
                  {t.policy}
                </a>
                .
              </p>
            </div>
          </div>

          {/* Oba przyciski równie widoczne — odrzucenie musi być tak łatwe jak akceptacja. */}
          <div className="relative mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => choose(false)}
              className="h-10 cursor-pointer rounded-full border border-line-strong px-4 text-sm font-semibold text-fg transition hover:bg-ink/5"
            >
              {t.reject}
            </button>
            <button
              type="button"
              onClick={() => choose(true)}
              className="h-10 cursor-pointer rounded-full bg-fg px-4 text-sm font-semibold text-canvas transition hover:shadow-[0_8px_30px_rgba(139,140,255,0.35)]"
            >
              {t.accept}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CookieSettingsButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={openConsentSettings}
      className="cursor-pointer transition hover:text-fg"
    >
      {label}
    </button>
  );
}
