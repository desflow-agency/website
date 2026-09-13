"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Play, Star, TrendingUp } from "lucide-react";
import { useEffect } from "react";

import type { Dictionary } from "@/lib/i18n";

import { BrowserFrame } from "./browser-frame";
import { Gradient } from "./rich-text";
import { SiteDemo } from "./site-demos";
import { useInView } from "./use-in-view";

const clients = [
  "mcgramy.pl",
  "AdviceBot",
  "Surova",
  "zentrify",
  "Hostero",
  "e-liq",
  "detailing.detmer",
  "Wąsaty Jeżor",
  "Taniej.",
  "DeeJayPallaside",
];

const ease = [0.22, 1, 0.36, 1] as const;

export function HeroSection({
  t,
  common,
  demo,
}: {
  t: Dictionary["hero"];
  common: Dictionary["common"];
  demo: Dictionary["saasDemo"];
}) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 60, damping: 20 });
  const y = useSpring(pointerY, { stiffness: 60, damping: 20 });

  const rotateY = useTransform(x, [-1, 1], [4, -4]);
  const rotateX = useTransform(y, [-1, 1], [-3, 3]);
  const floatX = useTransform(x, [-1, 1], [-18, 18]);
  const floatY = useTransform(y, [-1, 1], [-14, 14]);
  const counterX = useTransform(x, [-1, 1], [14, -14]);
  const counterY = useTransform(y, [-1, 1], [10, -10]);

  return (
    <section
      aria-labelledby="hero-title"
      className="noise relative overflow-hidden pt-32 sm:pt-40"
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        pointerX.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
        pointerY.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
      }}
    >
      {/* TŁO */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="grid-lines absolute inset-0" />
        <div className="absolute -top-40 left-[10%] h-[560px] w-[560px] animate-aurora rounded-full bg-brand-strong/30 blur-[140px]" />
        <div className="absolute right-[5%] top-10 h-[460px] w-[460px] animate-aurora rounded-full bg-mint/15 blur-[140px] [animation-delay:-9s]" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-canvas to-transparent" />
      </div>

      <div className="container-site flex flex-col items-center text-center">
        <motion.a
          href="#contact"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="group inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-ink/[0.04] py-1.5 pl-2 pr-4 text-[13px] text-soft backdrop-blur transition hover:border-ink/25 hover:text-fg"
        >
          <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-mint/10 px-2 py-0.5 font-medium text-mint">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-mint" />
            </span>
            {t.badge}
          </span>
          <span className="whitespace-nowrap">
            <span className="sm:hidden">{t.badgeShort}</span>
            <span className="hidden sm:inline">{t.badgeLong}</span>
          </span>
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </motion.a>

        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05, ease }}
          className="title-xl mt-8 max-w-5xl text-balance"
        >
          <Gradient text={t.title} />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease }}
          className="mt-7 max-w-2xl text-pretty text-base leading-7 text-soft sm:text-lg sm:leading-8"
        >
          {t.lead}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease }}
          className="mt-10 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row"
        >
          <a href="#contact" className="btn-site btn-site-primary">
            {common.freeQuote}
            <ArrowRight size={17} />
          </a>
          <a href="#websites" className="btn-site btn-site-ghost">
            <Play size={15} className="fill-current" />
            {t.ctaSecondary}
          </a>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 grid grid-cols-3 gap-6 sm:gap-14"
        >
          {t.stats.map(([value, label]) => (
            <div key={label} className="flex flex-col items-center">
              <dt className="order-2 mt-1 text-xs text-faint sm:text-sm">{label}</dt>
              <dd className="order-1 text-2xl font-semibold tracking-tight sm:text-3xl">{value}</dd>
            </div>
          ))}
        </motion.dl>

        {/* KOMPOZYCJA */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.35, ease }}
          className="relative mt-16 w-full max-w-5xl [perspective:1600px] sm:mt-20"
        >
          <motion.div style={{ rotateX, rotateY }} className="relative mx-auto w-full lg:w-[82%]">
            <div className="pointer-events-none absolute -inset-10 -z-10 rounded-[60px] bg-brand-strong/25 blur-[80px]" />
            <BrowserFrame address="twojafirma.pl">
              <SiteDemo kind="saas" t={demo} />
            </BrowserFrame>
          </motion.div>

          <motion.div style={{ x: floatX, y: floatY }} className="absolute -left-2 bottom-[-8%] hidden w-[19%] lg:block">
            <PhoneVideo badge={t.phoneBadge} label={t.phoneAria} />
          </motion.div>

          <motion.div
            style={{ x: counterX, y: counterY }}
            className="absolute -right-4 top-[12%] hidden w-56 text-left lg:block"
          >
            <div className="surface rounded-2xl p-4 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs text-soft">{t.engagement}</span>
                <TrendingUp size={14} className="text-mint" />
              </div>
              <p className="mt-2 text-3xl font-semibold tracking-tight">+240%</p>
              <div className="mt-3 flex h-10 items-end gap-1">
                {[30, 45, 38, 60, 52, 75, 68, 90, 100].map((height, index) => (
                  <span
                    key={index}
                    className="flex-1 rounded-sm bg-linear-to-t from-brand-strong to-mint"
                    style={{ height: `${height}%`, opacity: 0.4 + index * 0.07 }}
                  />
                ))}
              </div>
            </div>

            <div className="surface ml-8 mt-3 rounded-2xl p-4 shadow-2xl backdrop-blur-xl">
              <div className="flex gap-0.5 text-amber">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={12} className="fill-current" />
                ))}
              </div>
              <p className="mt-2 text-xs leading-5 text-soft">{t.quote}</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* KLIENCI */}
      <div className="container-site mt-20 pb-6 sm:mt-28">
        <p className="text-center font-mono text-xs uppercase tracking-[0.2em] text-faint">{t.clientsTitle}</p>
        <div className="mask-fade-x mt-6 overflow-hidden">
          <div className="flex w-max animate-marquee gap-14 pr-14 hover:[animation-play-state:paused]">
            {[...clients, ...clients].map((client, index) => (
              <span
                key={index}
                aria-hidden={index >= clients.length}
                className="whitespace-nowrap text-xl font-semibold tracking-tight text-ink/30 transition-colors hover:text-ink/70"
              >
                {client}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneVideo({ badge, label }: { badge: string; label: string }) {
  const [ref, inView] = useInView<HTMLVideoElement>();

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (inView) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [inView, ref]);

  return (
    <div className="rounded-[28px] border border-line-strong bg-[#0c0c12] p-1.5 shadow-[0_30px_80px_rgba(0,0,0,0.7)]">
      <div className="relative overflow-hidden rounded-[22px]">
        <video
          ref={ref}
          src="/advice_tt_1.mp4"
          muted
          loop
          playsInline
          preload="none"
          aria-label={label}
          className="block aspect-[9/16] w-full bg-raised object-cover"
        />
        <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
          {badge}
        </span>
      </div>
    </div>
  );
}
