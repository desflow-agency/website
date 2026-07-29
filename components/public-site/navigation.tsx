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
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
        className="max-w-7xl rounded-3xl bg-gray-400/25 backdrop-blur-2xl shadow-2xl shadow-black/10"
      >
        <div className="flex h-full items-center justify-between px-6">
          <a href="#home" className="flex items-center">
            <img
              src="/dfblack.png"
              alt="Desflow"
              className="h-10 w-auto object-contain"
            />
          </a>

          <div className="hidden md:flex gap-2 rounded-full bg-white/5 p-1">
            {links.map(([label, id]) => (
              <motion.a
                key={id}
                href={`#${id}`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: .97 }}
                className="rounded-full px-4 py-2 text-sm text-black/80 hover:text-black hover:bg-black/10 transition"
              >
                {label}
              </motion.a>
            ))}
          </div>

          <motion.a
            href="#kontakt"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: .98 }}
            className="hidden md:flex items-center gap-2 rounded-full bg-violet-500 px-5 py-3 text-sm font-normal text-white shadow-lg"
          >
            Umów konsultację
            <ArrowRight size={16} />
          </motion.a>

          <button onClick={() => setOpen(!open)} className="md:hidden text-white">
            {open ? <X /> : <Menu />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="border-t border-white/10 p-5 md:hidden"
            >
              <div className="flex flex-col gap-3">
                {links.map(([label, id]) => (
                  <a key={id} href={`#${id}`} onClick={() => setOpen(false)}
                    className="rounded-xl px-4 py-3 hover:bg-white/10">
                    {label}
                  </a>
                ))}
                <a href="#kontakt" className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-indigo-500 px-4 py-3 font-semibold">
                  Umów konsultację <ArrowRight size={16} />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </motion.header>
  );
}
