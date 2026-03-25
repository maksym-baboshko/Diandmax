"use client";

import { VENUE, WEDDING_DATE, WEDDING_DATE_ROMAN } from "@/shared/config";
import { MOTION_EASE, useLiteMotion } from "@/shared/lib";
import { Ornament } from "@/shared/ui";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("Footer");
  const tHero = useTranslations("Hero");
  const tNavbar = useTranslations("Navbar");
  const liteMotion = useLiteMotion();
  const reduceMotion = useReducedMotion();

  const navLinks = [
    { href: "#our-story", label: tNavbar("story") },
    { href: "#timeline", label: tNavbar("timeline") },
    { href: "#location", label: tNavbar("location") },
    { href: "#dress-code", label: tNavbar("dress_code") },
    { href: "#gifts", label: tNavbar("gifts") },
    { href: "#rsvp", label: tNavbar("rsvp") },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <footer id="site-footer" className="relative overflow-hidden bg-bg-secondary">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-linear-to-b from-bg-primary to-transparent md:h-32"
      />

      <div className="relative z-20 mt-12 md:mt-28">
        <hr className="gold-rule" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none"
      >
        <span className="font-vibes text-[55vw] leading-none whitespace-nowrap text-accent/4.5 md:hidden -translate-x-[10%]">
          М &amp; Д
        </span>
        <span className="font-vibes hidden text-[26vw] leading-none whitespace-nowrap text-accent/4.5 md:inline -translate-x-[8%] translate-y-[12%]">
          {tHero("groom_name")} &amp; {tHero("bride_name")}
        </span>
      </div>

      <Ornament position="top-left" size="lg" className="opacity-[0.09]" />
      <Ornament position="top-right" size="lg" className="opacity-[0.09]" />
      <Ornament position="bottom-left" size="sm" className="opacity-[0.06]" />
      <Ornament position="bottom-right" size="sm" className="opacity-[0.06]" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-10 px-6 pb-10 pt-10 md:pt-32">
        <div className="flex items-center gap-3">
          <span className="block h-px w-10 bg-linear-to-r from-transparent to-accent/35" />
          <span className="text-[9px] font-medium uppercase tracking-[0.35em] text-text-secondary/90">
            {VENUE.locationShort}
          </span>
          <span className="block h-px w-10 bg-linear-to-l from-transparent to-accent/35" />
        </div>

        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="heading-serif text-[2.5rem] leading-none tracking-tight text-text-primary md:text-[4.25rem]">
            {tHero("groom_name")}
            <span className="heading-serif-italic mx-3 text-[2rem] text-accent md:mx-5 md:text-[3.25rem]">
              &amp;
            </span>
            {tHero("bride_name")}
          </h2>

          <p className="mt-1 font-cinzel text-[0.6rem] uppercase tracking-[0.45em] text-text-secondary/90 md:text-[0.7rem]">
            {WEDDING_DATE_ROMAN}
          </p>

          <p className="mt-0.5 text-xs tracking-wider text-text-secondary/90">{VENUE.name}</p>
        </div>

        <div className="flex w-full max-w-[12rem] items-center gap-3">
          <div className="h-px flex-1 bg-linear-to-r from-transparent to-accent/35" />
          <svg
            width="7"
            height="7"
            viewBox="0 0 7 7"
            className="shrink-0 rotate-45 text-accent/45"
            aria-hidden="true"
          >
            <rect width="7" height="7" fill="currentColor" />
          </svg>
          <div className="h-px flex-1 bg-linear-to-l from-transparent to-accent/35" />
        </div>

        <nav aria-label={t("section_navigation")}>
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="rounded-sm px-1 py-0.5 text-[9px] uppercase tracking-[0.2em] text-text-secondary/90 transition-colors duration-300 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary md:text-[10px]"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label={t("back_to_top")}
          className="group mt-1 flex cursor-pointer flex-col items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary"
          animate={
            reduceMotion
              ? undefined
              : {
                  y: [0, liteMotion ? -3 : -4, 0],
                }
          }
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: liteMotion ? 3.2 : 3.6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }
          }
          style={{ willChange: reduceMotion ? "auto" : "transform" }}
        >
          <motion.div
            animate={
              reduceMotion
                ? undefined
                : {
                    scale: [1, liteMotion ? 1.035 : 1.05, 1],
                    borderColor: [
                      "rgba(var(--accent-rgb),0.34)",
                      "rgba(var(--accent-rgb),0.52)",
                      "rgba(var(--accent-rgb),0.34)",
                    ],
                    backgroundColor: [
                      "rgba(var(--accent-rgb),0)",
                      "rgba(var(--accent-rgb),0.08)",
                      "rgba(var(--accent-rgb),0)",
                    ],
                    color: [
                      "rgba(var(--accent-rgb),0.82)",
                      "rgba(var(--accent-rgb),1)",
                      "rgba(var(--accent-rgb),0.82)",
                    ],
                  }
            }
            whileHover={
              liteMotion || reduceMotion
                ? undefined
                : {
                    scale: 1.06,
                    backgroundColor: "rgba(var(--accent-rgb),0.1)",
                    borderColor: "rgba(var(--accent-rgb),0.5)",
                    color: "rgba(var(--accent-rgb),1)",
                  }
            }
            transition={
              reduceMotion
                ? undefined
                : {
                    duration: liteMotion ? 3.2 : 3.6,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: MOTION_EASE,
                  }
            }
            className="flex h-11 w-11 items-center justify-center rounded-full border border-accent/34 text-accent transition-all duration-500"
            style={{ willChange: reduceMotion ? "auto" : "transform, opacity" }}
          >
            <motion.svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={reduceMotion ? undefined : { y: [0, liteMotion ? -1 : -1.5, 0] }}
              transition={
                reduceMotion
                  ? undefined
                  : {
                      duration: liteMotion ? 1.9 : 2.2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }
              }
              style={{ willChange: reduceMotion ? "auto" : "transform" }}
              aria-hidden="true"
            >
              <path d="M18 15l-6-6-6 6" />
            </motion.svg>
          </motion.div>
          <motion.span
            className="text-[8px] uppercase tracking-[0.25em] text-text-secondary/90 transition-colors duration-300"
            animate={
              reduceMotion
                ? undefined
                : {
                    opacity: [0.88, 1, 0.88],
                  }
            }
            whileHover={
              liteMotion || reduceMotion
                ? undefined
                : {
                    opacity: 0.8,
                  }
            }
            transition={
              reduceMotion
                ? undefined
                : {
                    duration: liteMotion ? 3.2 : 3.6,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: MOTION_EASE,
                  }
            }
          >
            {t("back_to_top")}
          </motion.span>
        </motion.button>

        <div className="flex w-full items-center justify-center border-t border-accent/[0.12] pt-5">
          <p className="text-center text-[8px] uppercase tracking-[0.25em] text-text-secondary/90 md:text-[9px]">
            &copy; {WEDDING_DATE.getFullYear()} &middot; {t("made_with_love")}
          </p>
        </div>
      </div>
    </footer>
  );
}
