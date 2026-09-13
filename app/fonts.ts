import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

import { cn } from "@/lib/utils";

const geist = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-mono",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const fontClassName = cn(geist.variable, geistMono.variable, instrumentSerif.variable, "font-sans");
