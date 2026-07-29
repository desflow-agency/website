// Navigation.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";

const links = [
  ["Oferta", "offer"],
  ["Portfolio", "portfolio"],
  ["Opinie", "reviews"],
  ["FAQ", "faq"],
  ["Kontakt", "contact"],
] as const;

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120 }}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      <motion.nav
        animate={{
          width: scrolled ? "78%" : "92%",
          height: scrolled ? 60 : 72,
        }}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 22,
        }}
        className="max-w-7xl rounded-3xl border border-white/15 bg-white/20 backdrop-blur-2xl shadow-2xl shadow-black/10"
      >
        <div className="flex h-full items-center justify-between px-6">
          <a href="#home" className="flex items-center">
            <img
              src="/dfblack.png"
              alt="Desflow"
              className="h-10 w-auto object-contain"
            />
          </a>

          <div className="hidden gap-2 rounded-full bg-white/10 p-1 md:flex">
            {links.map(([label, id]) => (
              <motion.a
                key={id}
                href={`#${id}`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-full px-4 py-2 text-sm text-black/80 transition hover:bg-black/10 hover:text-black"
              >
                {label}
              </motion.a>
            ))}
          </div>

          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="hidden items-center gap-2 rounded-full bg-violet-500 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-violet-500/30 md:flex"
          >
            Umów konsultację
            <ArrowRight size={16} />
          </motion.a>

          <button
            onClick={() => setOpen((prev) => !prev)}
            className="rounded-xl p-2 text-black transition hover:bg-black/10 md:hidden"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              className="mx-3 mb-3 overflow-hidden rounded-3xl border border-white/20 bg-white/80 backdrop-blur-3xl shadow-2xl shadow-black/20 md:hidden"
            >
              <div className="flex flex-col gap-2 p-4">
                {links.map(([label, id]) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={() => setOpen(false)}
                    className="rounded-2xl px-4 py-3 text-black transition-all duration-200 hover:bg-white/20 active:scale-[0.98]"
                  >
                    {label}
                  </a>
                ))}

                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-violet-600 to-indigo-500 px-4 py-3 font-semibold text-white shadow-lg shadow-violet-500/30 transition-transform active:scale-[0.98]"
                >
                  Umów konsultację
                  <ArrowRight size={16} />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </motion.header>
  );
}