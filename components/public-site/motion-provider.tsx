"use client";

import { MotionConfig } from "framer-motion";

// Szanuje systemowe ustawienie "ogranicz ruch" dla wszystkich animacji framer-motion.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
