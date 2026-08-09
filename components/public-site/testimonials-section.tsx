"use client";

import { useState } from "react";
import { ArrowUpRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Jakub B.",
    role: "CEO, mcgramy.pl",
    text: "Zespół wykonał dla mnie profesjonalnie cały branding mojej marki oraz zarządza moimi profilami social media.",
  },
  {
    name: "Michał Sz.",
    role: "CEO, Taniej.",
    text: "Cała szata graficzna została wykonana dla mnie ekspresowo oraz dokładnie tak jak chciałem.",
  },
  {
    name: "Daniel Pawlak",
    role: "YouTuber · DeeJayPallaside",
    text: "Zespół zarządzał moją społecznością Discord przez dłuższy czas, sprawował się przy tym perfekcyjnie.",
  },
] as const;

export function TestimonialsSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="w-full pt-12" id="reviews">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5b5cf0]">
              Opinie
            </p>

            <h2 className="mt-2 text-4xl font-bold tracking-[-.045em]">
              Partnerstwo, które czuć.
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-6 text-black/50">
            Nie wierzymy w obietnice bez pokrycia. Najlepiej o naszej pracy
            mówią ludzie, z którymi mieliśmy okazję pracować.
          </p>
        </div>

        {/* TESTIMONIALS */}

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial, index) => {
            const isHovered = hovered === index;

            return (
              <article
                key={testimonial.name}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                className={`
                  group
                  relative
                  overflow-hidden
                  rounded-[28px]
                  border
                  p-7
                  transition-all
                  duration-500
                  ${
                    isHovered
                      ? "border-[#5b5cf0]/30 bg-white shadow-[0_25px_70px_rgba(168,85,247,0.12)] md:-translate-y-2"
                      : "border-black/[0.07] bg-black/2.5"
                  }
                `}
              >
                {/* BACKGROUND GLOW */}

                <div
                  className={`
                    pointer-events-none
                    absolute
                    -right-20
                    -top-20
                    h-40
                    w-40
                    rounded-full
                    bg-[#5b5cf0]/10
                    blur-3xl
                    transition-opacity
                    duration-500
                    ${
                      isHovered
                        ? "opacity-100"
                        : "opacity-0"
                    }
                  `}
                />

                {/* TOP */}

                <div className="relative flex items-center justify-between">
                  {/* NUMBER */}

                  <span className="text-xs font-semibold tracking-[0.15em] text-black/25">
                    {String(index + 1).padStart(2, "0")} /{" "}
                    {String(testimonials.length).padStart(2, "0")}
                  </span>

                  {/* QUOTE */}

                  <div
                    className={`
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      border
                      transition-all
                      duration-500
                      ${
                        isHovered
                          ? "border-[#5b5cf0]/30 bg-[#5b5cf0] text-white"
                          : "border-black/10 bg-black/3 text-black/30"
                      }
                    `}
                  >
                    <Quote size={17} />
                  </div>
                </div>

                {/* STARS */}

                <div className="relative mt-10 flex gap-1 text-[#f2aa3b]">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <span
                      key={starIndex}
                      className="text-sm"
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* TEXT */}

                <blockquote className="relative my-7 text-[17px] font-medium leading-7 tracking-[-0.01em] text-black/80">
                  „{testimonial.text}”
                </blockquote>

                {/* DIVIDER */}

                <div className="relative mb-6 h-px w-full bg-black/[0.07]" />

                {/* AUTHOR */}

                <div className="relative flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    {/* AVATAR */}

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-linear-to-br
                        from-[#5b5cf0]
                        to-[#4040eb]
                        text-xs
                        font-bold
                        text-white
                        shadow-lg
                        shadow-[#5b5cf0]/20
                      "
                    >
                      {testimonial.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-black">
                        {testimonial.name}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-[#686b7d]">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  {/* ARROW */}

                  <div
                    className={`
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      transition-all
                      duration-300
                      ${
                        isHovered
                          ? "translate-x-0 border-[#5b5cf0]/20 bg-[#5b5cf0] text-white"
                          : "-translate-x-1 border-black/10 bg-transparent text-black/30"
                      }
                    `}
                  >
                    <ArrowUpRight size={16} />
                  </div>
                </div>

                {/* BOTTOM ACCENT */}

                <div
                  className={`
                    absolute
                    bottom-0
                    left-7
                    right-7
                    h-0.5
                    origin-left
                    rounded-full
                    bg-[#5b5cf0]
                    transition-transform
                    duration-500
                    ${
                      isHovered
                        ? "scale-x-100"
                        : "scale-x-0"
                    }
                  `}
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}