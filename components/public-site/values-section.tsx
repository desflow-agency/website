"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Zap,
  Palette,
  Users,
  Target,
} from "lucide-react";

const values = [
  {
    number: "01",
    title: "Szybko, ale świadomie",
    description: "Krótka droga od decyzji do publikacji.",
    icon: Zap,
  },
  {
    number: "02",
    title: "Design bez kompromisów",
    description: "Detale, które budują zaufanie do marki.",
    icon: Palette,
  },
  {
    number: "03",
    title: "Wspólny kierunek",
    description: "Transparentny proces i jedno źródło prawdy.",
    icon: Users,
  },
  {
    number: "04",
    title: "Wyniki, nie hałas",
    description: "Kreatywność połączona z konkretnym celem.",
    icon: Target,
  },
] as const;

export function ValuesSection() {
  return (
    <section className="w-full pt-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}

        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5b5cf0]">
              Dlaczego Desflow
            </p>

            <h2 className="mt-3 max-w-2xl text-4xl font-bold tracking-tighter sm:text-5xl">
              Dobre pomysły potrzebują świetnego wykonania.
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-6 text-black/50">
            Łączymy strategię, design i technologię, żeby tworzyć rzeczy,
            które nie tylko dobrze wyglądają, ale mają konkretny cel.
          </p>
        </div>

        {/* VALUES */}

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => {
            const Icon = value.icon;

            return (
              <motion.article
                key={value.title}
                initial={{
                  opacity: 0,
                  y: 24,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{
                  y: -6,
                }}
                className="
                  group
                  relative
                  min-w-0
                  overflow-hidden
                  rounded-[28px]
                  border
                  border-black/[0.07]
                  bg-black/2.5
                  p-7
                  transition-colors
                  duration-500
                  hover:border-[#5b5cf0]/20
                  hover:bg-white
                  hover:shadow-[0_25px_70px_rgba(168,85,247,0.09)]
                "
              >
                {/* GLOW */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-20
                    -top-20
                    h-44
                    w-44
                    rounded-full
                    bg-[#5b5cf0]/10
                    opacity-0
                    blur-3xl
                    transition-opacity
                    duration-500
                    group-hover:opacity-100
                  "
                />

                {/* TOP */}

                <div className="relative flex items-center justify-between">
                  <span
                    className="
                      text-xs
                      font-bold
                      tracking-[0.18em]
                      text-black/25
                      transition-colors
                      duration-300
                      group-hover:text-[#5b5cf0]
                    "
                  >
                    {value.number}
                  </span>

                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-black/10
                      bg-white
                      text-black/40
                      shadow-sm
                      transition-all
                      duration-300
                      group-hover:border-[#5b5cf0]/20
                      group-hover:bg-[#5b5cf0]
                      group-hover:text-white
                      group-hover:shadow-lg
                      group-hover:shadow-[#5b5cf0]/20
                    "
                  >
                    <Icon size={17} strokeWidth={1.8} />
                  </div>
                </div>

                {/* TITLE */}

                <h3
                  className="
                    relative
                    mt-12
                    text-xl
                    font-bold
                    tracking-tight
                    text-black
                  "
                >
                  {value.title}
                </h3>

                {/* DESCRIPTION */}

                <p
                  className="
                    relative
                    mt-3
                    text-sm
                    leading-6
                    text-[#686b7d]
                  "
                >
                  {value.description}
                </p>

                {/* BOTTOM */}

                <div className="relative mt-10 flex items-center justify-between">
                  <div
                    className="
                      h-px
                      w-12
                      bg-black/10
                      transition-all
                      duration-500
                      group-hover:w-20
                      group-hover:bg-[#5b5cf0]
                    "
                  />

                  <div
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      text-black/20
                      transition-all
                      duration-300
                      group-hover:translate-x-1
                      group-hover:text-[#5b5cf0]
                    "
                  >
                    <ArrowUpRight size={17} />
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}