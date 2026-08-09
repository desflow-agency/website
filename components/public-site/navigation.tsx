"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

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
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      setScrolled(scrollY > 30);

      let currentSection = "";

      for (const [, id] of links) {
        const element = document.getElementById(id);

        if (!element) continue;

        const rect = element.getBoundingClientRect();

        if (rect.top <= 180 && rect.bottom >= 180) {
          currentSection = id;
        }
      }

      setActiveSection(currentSection);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <motion.header
      initial={{
        y: -30,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        fixed
        inset-x-0
        top-4
        z-100
        flex
        justify-center
        px-4
        sm:top-5
      "
    >
      <div className="relative w-full max-w-6xl">
        {/* ================================================== */}
        {/* NAVBAR */}
        {/* ================================================== */}

        <motion.nav
          animate={{
            height: scrolled ? 64 : 72,
          }}
          transition={{
            type: "spring",
            stiffness: 180,
            damping: 24,
          }}
          className={`
            relative
            flex
            w-full
            items-center
            justify-between
            rounded-[22px]
            border
            px-3
            shadow-[0_15px_50px_rgba(0,0,0,0.08)]
            backdrop-blur-2xl
            transition-all
            duration-500
            sm:rounded-[26px]
            sm:px-4
            ${scrolled
              ? "border-black/8 bg-white/75"
              : "border-black/6 bg-white/65"
            }
          `}
        >
          {/* SUBTELNY GLOW */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              overflow-hidden
              rounded-[22px]
              sm:rounded-[26px]
            "
          >
            <div
              className="
                absolute
                -left-20
                -top-20
                h-32
                w-32
                rounded-full
                bg-[#5b5cf0]/10
                blur-3xl
              "
            />

            <div
              className="
                absolute
                -bottom-20
                right-20
                h-32
                w-32
                rounded-full
                bg-purple-400/5
                blur-3xl
              "
            />
          </div>

          {/* ================================================== */}
          {/* LOGO */}
          {/* ================================================== */}

          <motion.a
            href="#home"
            onClick={closeMenu}
            whileTap={{ scale: 0.96 }}
            className="
    relative
    z-10
    flex
    items-center
    rounded-xl
    px-2
    py-2
  "
          >
            <img
              src="/dfblack.png"
              alt="Desflow"
              className="
      h-9
      w-auto
      max-w-37.5
      object-contain
      sm:h-10
    "
            />
          </motion.a>

          {/* ================================================== */}
          {/* DESKTOP LINKS */}
          {/* ================================================== */}

          <div
            className="
              absolute
              left-1/2
              hidden
              -translate-x-1/2
              items-center
              gap-1
              rounded-full
              border
              border-black/5
              bg-black/2.5
              p-1
              md:flex
            "
          >
            {links.map(([label, id]) => {
              const active = activeSection === id;

              return (
                <motion.a
                  key={id}
                  href={`#${id}`}
                  whileTap={{ scale: 0.96 }}
                  className="
                    relative
                    rounded-full
                    px-4
                    py-2
                    text-[13px]
                    font-medium
                    text-black/55
                    transition-colors
                    duration-300
                    hover:text-black
                  "
                >
                  {active && (
                    <motion.span
                      layoutId="active-nav"
                      className="
                        absolute
                        inset-0
                        rounded-full
                        bg-white
                        shadow-sm
                      "
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}

                  <span
                    className={`
                      relative
                      z-10
                      transition-colors
                      duration-300
                      ${active
                        ? "font-semibold text-black"
                        : ""
                      }
                    `}
                  >
                    {label}
                  </span>
                </motion.a>
              );
            })}
          </div>

          {/* ================================================== */}
          {/* DESKTOP CTA */}
          {/* ================================================== */}

          <motion.a
            href="#contact"
            whileHover={{
              scale: 1.025,
            }}
            whileTap={{
              scale: 0.97,
            }}
            className="
              relative
              z-10
              hidden
              items-center
              gap-2
              rounded-full
              bg-black
              px-5
              py-2.5
              text-xs
              font-semibold
              text-white
              shadow-lg
              shadow-black/10
              transition-all
              duration-300
              hover:bg-[#5b5cf0]
              hover:shadow-[#5b5cf0]/20
              md:flex
            "
          >
            Umów konsultację

            <ArrowRight
              size={15}
              strokeWidth={2.2}
            />
          </motion.a>

          {/* ================================================== */}
          {/* MOBILE MENU BUTTON */}
          {/* ================================================== */}

          <motion.button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            whileTap={{
              scale: 0.9,
            }}
            aria-label={
              open
                ? "Zamknij menu"
                : "Otwórz menu"
            }
            aria-expanded={open}
            className="
              relative
              z-10
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-black/[0.07]
              bg-white/70
              text-black
              shadow-sm
              transition-colors
              hover:bg-white
              md:hidden
            "
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.div
                  key="close"
                  initial={{
                    rotate: -90,
                    opacity: 0,
                  }}
                  animate={{
                    rotate: 0,
                    opacity: 1,
                  }}
                  exit={{
                    rotate: 90,
                    opacity: 0,
                  }}
                >
                  <X size={19} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{
                    rotate: 90,
                    opacity: 0,
                  }}
                  animate={{
                    rotate: 0,
                    opacity: 1,
                  }}
                  exit={{
                    rotate: -90,
                    opacity: 0,
                  }}
                >
                  <Menu size={19} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.nav>

        {/* ================================================== */}
        {/* MOBILE MENU */}
        {/* ================================================== */}

        <AnimatePresence>
          {open && (
            <>
              {/* BACKDROP */}

              <motion.button
                type="button"
                aria-label="Zamknij menu"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                className="
                  fixed
                  inset-0
                  -z-10
                  h-dvh
                  w-full
                  cursor-default
                  bg-black/5
                  backdrop-blur-[2px]
                  md:hidden
                "
                onClick={closeMenu}
              />

              {/* PANEL */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: -12,
                  scale: 0.98,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -12,
                  scale: 0.98,
                }}
                transition={{
                  duration: 0.22,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  absolute
                  left-0
                  right-0
                  top-[calc(100%+10px)]
                  overflow-hidden
                  rounded-[26px]
                  border
                  border-black/[0.07]
                  bg-white/90
                  p-2
                  shadow-[0_25px_80px_rgba(0,0,0,0.14)]
                  backdrop-blur-2xl
                  md:hidden
                "
              >
                <div className="rounded-[20px] bg-black/2.5 p-2">
                  {links.map(([label, id], index) => {
                    const active = activeSection === id;

                    return (
                      <motion.a
                        key={id}
                        href={`#${id}`}
                        onClick={closeMenu}
                        initial={{
                          opacity: 0,
                          x: -10,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          delay: index * 0.035,
                        }}
                        className="
                          group
                          flex
                          items-center
                          justify-between
                          rounded-2xl
                          px-4
                          py-3.5
                          text-sm
                          font-medium
                          text-black/65
                          transition-all
                          duration-200
                          hover:bg-white
                          hover:text-black
                        "
                      >
                        <span
                          className={
                            active
                              ? "font-semibold text-[#5b5cf0]"
                              : ""
                          }
                        >
                          {label}
                        </span>

                        <ChevronRight
                          size={16}
                          className="
                            text-black/20
                            transition-transform
                            duration-200
                            group-hover:translate-x-1
                            group-hover:text-[#5b5cf0]
                          "
                        />
                      </motion.a>
                    );
                  })}
                </div>

                {/* CTA */}

                <motion.a
                  href="#contact"
                  onClick={closeMenu}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className="
                    mt-2
                    flex
                    items-center
                    justify-between
                    rounded-[20px]
                    bg-black
                    px-5
                    py-4
                    text-sm
                    font-semibold
                    text-white
                    shadow-lg
                    shadow-black/10
                  "
                >
                  <span>Umów konsultację</span>

                  <span
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-full
                      bg-[#5b5cf0]
                    "
                  >
                    <ArrowRight size={16} />
                  </span>
                </motion.a>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}