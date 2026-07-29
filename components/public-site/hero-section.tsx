"use client";

import { motion } from "framer-motion";
import { ArrowRight, Gem, Star } from "lucide-react";

export function HeroSection() {
  return <section className="gradient grid-bg overflow-hidden pt-28"><div className="shell grid min-h-170 items-center gap-12 py-20 lg:grid-cols-2">
    <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
      <p className="eyebrow">Desflow · Wybierz profesjonalizm</p><h1 className="headline font-semibold">Marki, które ludzie <span className="text-[#5b5cf0]">pamiętają.</span></h1>
      <p className="sub">Łączymy strategię, design i technologię, żeby Twoja marka miała znaczenie — i wyniki.</p>
      <div className="mt-8 flex flex-wrap gap-3"><a href="#oferta" className="btn btn-primary">Zobacz ofertę <ArrowRight size={17} /></a><a href="#kontakt" className="btn btn-light">Darmowa wycena</a></div>
      <div className="mt-10 flex items-center gap-3 text-sm text-[#686b7d]"><div className="flex -space-x-2">{[1, 2, 3].map((item) => <div className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-[#dad9ff]" key={item}><Star size={12} fill="currentColor" /></div>)}</div> Zaufali nam ambitni founderzy i zespoły</div>
    </motion.div>
    <div className="relative mx-auto w-full max-w-135"><div className="float card relative overflow-hidden p-5"><div className="flex items-center justify-between"><div><p className="text-xs text-[#77798b]">Statystyki</p><p className="text-2xl font-bold">+184.2%</p></div><span className="rounded-full bg-[#e2f7ee] px-3 py-1 text-xs font-bold text-[#21835d]">Ten miesiąc</span></div><div className="mt-8 flex h-44 items-end gap-3">{[34, 56, 46, 75, 62, 91, 82, 112].map((height, index) => <div key={index} className="flex-1 rounded-t-lg bg-linear-to-t from-[#5b5cf0] to-[#a7a5ff]" style={{ height: `${height}%` }} />)}</div></div><div className="card absolute -left-5 -top-8 p-4 text-sm shadow-xl"><Gem size={18} className="mb-2 text-[#5b5cf0]" /><b>Twój rozwój</b><br /><span className="text-[#686b7d]">zamów konsultację</span></div><div className="card absolute -bottom-7 -right-3 p-4 text-sm shadow-xl"><span className="text-[#5b5cf0]">●</span> Popraw branding<br /><b>dzięki naszym usługom</b></div></div>
  </div></section>;
}
