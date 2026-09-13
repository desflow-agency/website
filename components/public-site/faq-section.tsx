"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { useState } from "react";

import type { Dictionary } from "@/lib/i18n";

import { Reveal } from "./reveal";
import { Accent } from "./rich-text";

export function FaqSection({ t }: { t: Dictionary["faq"] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-title" className="section border-t border-line">
      <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal>
          <p className="kicker">{t.kicker}</p>
          <h2 id="faq-title" className="title-lg mt-5">
            <Accent text={t.title} />
          </h2>
          <p className="mt-5 max-w-sm leading-7 text-soft">{t.description}</p>
          <a href="#contact" className="group mt-7 inline-flex items-center gap-2 text-sm font-semibold text-fg">
            {t.ask}
            <ArrowUpRight size={16} className="text-brand transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </Reveal>

        <div className="flex flex-col gap-3">
          {t.items.map(([question, answer], index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;

            return (
              <div
                key={question}
                className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
                  isOpen ? "border-line-strong bg-ink/[0.04]" : "border-line bg-ink/[0.015] hover:bg-ink/[0.03]"
                }`}
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full cursor-pointer items-center gap-4 p-5 text-left md:p-6"
                  >
                    <span className={`font-mono text-xs transition-colors ${isOpen ? "text-brand" : "text-faint"}`}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-[15px] font-semibold md:text-base">{question}</span>
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
                        isOpen ? "rotate-45 border-fg bg-fg text-canvas" : "border-line-strong text-soft"
                      }`}
                    >
                      <Plus size={16} strokeWidth={2} />
                    </span>
                  </button>
                </h3>

                {/* Treść zawsze w HTML (dla SEO), zwijana wizualnie. */}
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ height: { duration: 0.35, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.2 } }}
                  className="overflow-hidden"
                  inert={!isOpen}
                >
                  <p className="px-5 pb-6 pl-14 pr-12 text-sm leading-7 text-soft md:px-6 md:pb-7 md:pl-[3.75rem]">{answer}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
