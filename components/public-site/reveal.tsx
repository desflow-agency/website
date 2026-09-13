"use client";

import { motion } from "framer-motion";

export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
}) {
  const Component = as === "li" ? motion.li : motion.div;

  return (
    <Component
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Component>
  );
}

export function SectionHeader({
  kicker,
  title,
  description,
  id,
}: {
  kicker: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  id?: string;
}) {
  return (
    <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div className="max-w-2xl">
        <p className="kicker">{kicker}</p>
        <h2 id={id} className="title-lg mt-5 text-balance">
          {title}
        </h2>
      </div>
      {description && (
        <p className="max-w-sm text-[15px] leading-7 text-soft">{description}</p>
      )}
    </Reveal>
  );
}
