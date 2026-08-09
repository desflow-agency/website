"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { useState } from "react";

const questions = [
  [
    "Ile trwa realizacja projektu?",
    "Zależnie od projektu, oprawę graficzną wykonujemy zwykle do 3 dni roboczych, montaż oraz zarządzanie social mediami jest wyliczane indywidualnie.",
  ],
  [
    "Czy można zacząć od jednej usługi?",
    "Tak. Możemy wejść w pojedynczy projekt lub zostać Twoim stałym zespołem kreatywnym.",
  ],
  [
    "Jak wygląda wycena?",
    "Po krótkiej rozmowie wysyłamy jasną propozycję zakresu, terminów i budżetu.",
  ],
] as const;

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="shell py-20 md:py-28"
    >
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        {/* LEFT */}

        <div>
          <p className="eyebrow">
            FAQ
          </p>

          <h2 className="mt-3 max-w-xl text-4xl font-bold tracking-[-.055em] md:text-5xl">
            Kilka dobrych pytań.
          </h2>

          <p className="mt-5 max-w-sm leading-7 text-[#686b7d]">
            Wolimy, gdy wszystko jest jasne jeszcze przed pierwszym
            spotkaniem.
          </p>

          <motion.a
            href="#contact"
            whileHover={{ x: 4 }}
            className="
              mt-7
              inline-flex
              items-center
              gap-2
              text-sm
              font-bold
              text-[#5b5cf0]
            "
          >
            Zadaj własne pytanie

            <ArrowUpRight
              size={16}
              strokeWidth={2.2}
            />
          </motion.a>
        </div>

        {/* RIGHT */}

        <div className="flex flex-col gap-3">
          {questions.map(([question, answer], index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={question}
                layout
                initial={false}
                animate={{
                  backgroundColor: isOpen
                    ? "rgba(91,92,240,0.035)"
                    : "rgba(0,0,0,0.02)",
                }}
                className="
                  overflow-hidden
                  rounded-[24px]
                  border
                  border-black/[0.07]
                  transition-colors
                  duration-300
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenIndex(
                      isOpen ? null : index
                    )
                  }
                  aria-expanded={isOpen}
                  className="
                    flex
                    w-full
                    cursor-pointer
                    items-center
                    gap-4
                    p-5
                    text-left
                    md:p-6
                  "
                >
                  {/* NUMBER */}

                  <span
                    className={`
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      text-[11px]
                      font-bold
                      transition-all
                      duration-300
                      ${
                        isOpen
                          ? "bg-[#5b5cf0] text-white shadow-lg shadow-[#5b5cf0]/20"
                          : "bg-[#eeeeff] text-[#5b5cf0]"
                      }
                    `}
                  >
                    0{index + 1}
                  </span>

                  {/* QUESTION */}

                  <span
                    className={`
                      flex-1
                      text-sm
                      font-bold
                      transition-colors
                      duration-300
                      md:text-base
                      ${
                        isOpen
                          ? "text-black"
                          : "text-black/80"
                      }
                    `}
                  >
                    {question}
                  </span>

                  {/* PLUS */}

                  <span
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
                        isOpen
                          ? "rotate-45 border-[#5b5cf0] bg-[#5b5cf0] text-white"
                          : "border-black/10 bg-white text-black/40"
                      }
                    `}
                  >
                    <Plus
                      size={18}
                      strokeWidth={1.8}
                    />
                  </span>
                </button>

                {/* ANSWER */}

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      transition={{
                        height: {
                          duration: 0.35,
                          ease: [0.22, 1, 0.36, 1],
                        },
                        opacity: {
                          duration: 0.2,
                        },
                      }}
                    >
                      <div className="px-5 pb-6 pl-18 pr-12 text-sm leading-7 text-[#686b7d] md:px-6 md:pb-7 md:pl-19 md:pr-14">
                        {answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}