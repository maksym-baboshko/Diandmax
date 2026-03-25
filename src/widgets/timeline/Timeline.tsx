"use client";

import { MOTION_EASE, cn, useLiteMotion } from "@/shared/lib";
import { AnimatedReveal, Ornament, SectionHeading, SectionWrapper } from "@/shared/ui";
import { type Variants, motion } from "motion/react";
import { useTranslations } from "next-intl";

const ease = MOTION_EASE;

const mobileMarkerVariants: Variants = {
  hidden: { opacity: 0.001, x: -10, scale: 0.96 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.36, ease } },
};

const mobileCardVariants: Variants = {
  hidden: { opacity: 0.001, x: -26 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.52, ease } },
};

const EVENT_ICONS: Record<string, React.ReactNode> = {
  ceremony: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <circle cx="9" cy="12" r="5" />
      <circle cx="15" cy="12" r="5" />
    </svg>
  ),
  photo_session: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  ),
  banquet: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M8 3v5a4 4 0 0 0 8 0V3" />
      <path d="M12 12v9" />
      <path d="M5 20h14" />
    </svg>
  ),
  activities: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  cake: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
      <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
      <path d="M2 21h20" />
      <path d="M7 8v3M12 8v3M17 8v3" />
      <path d="M7 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM17 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
    </svg>
  ),
  sparklers: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M12 3v3M18.5 5.5l-2.1 2.1M21 12h-3M18.5 18.5l-2.1-2.1M12 21v-3M5.5 18.5l2.1-2.1M3 12h3M5.5 5.5l2.1 2.1" />
    </svg>
  ),
};

const EVENT_KEYS = [
  "ceremony",
  "photo_session",
  "banquet",
  "activities",
  "cake",
  "sparklers",
] as const;

export function Timeline() {
  const t = useTranslations("Timeline");
  const liteMotion = useLiteMotion();

  const events = EVENT_KEYS.map((key) => ({
    id: key,
    time: t(`events.${key}.time`),
    title: t(`events.${key}.title`),
    description: t(`events.${key}.description`),
  }));

  return (
    <SectionWrapper id="timeline" className="relative overflow-hidden py-24">
      <Ornament position="top-right" size="sm" />
      <Ornament position="bottom-left" size="sm" />

      <SectionHeading subtitle={t("subtitle")}>{t("title")}</SectionHeading>

      <div className="relative mx-auto mt-16 max-w-5xl px-4 md:mt-24">
        {/* Vertical line */}
        <div className="absolute bottom-0 left-9 top-0 w-px bg-linear-to-b from-transparent via-accent/40 to-transparent md:left-1/2 md:-translate-x-1/2" />

        <div className="flex flex-col gap-12 md:gap-16">
          {events.map((event, index) => {
            const isEven = index % 2 === 0;
            const icon = EVENT_ICONS[event.id];

            const cardContent = (
              <div className="group/card rounded-2xl border border-accent/20 bg-bg-secondary/32 px-5 py-5 transition-colors duration-300 hover:border-accent/32 md:px-6 md:py-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors duration-300 group-hover/card:bg-accent/20">
                    {icon}
                  </div>
                  <h3 className="heading-serif text-xl text-text-primary transition-colors duration-300 group-hover/card:text-accent md:text-2xl">
                    {event.title}
                  </h3>
                </div>
                <p className="pl-10 text-sm leading-relaxed text-text-secondary md:text-base">
                  {event.description}
                </p>
              </div>
            );

            return (
              <div key={event.id} className="relative">
                {/* Mobile layout */}
                <div className="flex items-start md:hidden">
                  <motion.div
                    initial={liteMotion ? "hidden" : undefined}
                    whileInView={liteMotion ? "visible" : undefined}
                    viewport={liteMotion ? { once: true, amount: 0.45 } : undefined}
                    variants={liteMotion ? mobileMarkerVariants : undefined}
                    transition={liteMotion ? { delay: Math.min(index * 0.04, 0.12) } : undefined}
                    className="absolute left-9 top-5 z-10 flex -translate-x-1/2 flex-col items-center"
                  >
                    <span className="mb-3 whitespace-nowrap rounded-full border border-accent/25 bg-bg-primary px-2.5 py-1 font-cinzel text-sm text-accent">
                      {event.time}
                    </span>
                    <div className="relative flex h-4 w-4 items-center justify-center">
                      <div
                        className={cn(
                          "absolute h-6 w-6 rounded-full bg-accent/8",
                          !liteMotion && "animate-pulse",
                        )}
                      />
                      <div className="absolute h-3 w-3 rounded-full bg-accent/15" />
                      <div className="h-1.5 w-1.5 rounded-full bg-accent/60" />
                    </div>
                  </motion.div>

                  {liteMotion ? (
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.45 }}
                      variants={mobileCardVariants}
                      transition={{ delay: Math.min(0.05 + index * 0.04, 0.16) }}
                      className="w-full transform-gpu pl-20"
                      style={{ willChange: "transform, opacity" }}
                    >
                      {cardContent}
                    </motion.div>
                  ) : (
                    <AnimatedReveal direction="right" delay={index * 0.1} className="w-full pl-20">
                      {cardContent}
                    </AnimatedReveal>
                  )}
                </div>

                {/* Desktop layout — alternating */}
                <div className="hidden md:grid md:grid-cols-[1fr_8rem_1fr] md:items-center">
                  {isEven ? (
                    <AnimatedReveal
                      direction={liteMotion ? "up" : "right"}
                      delay={liteMotion ? 0 : index * 0.1}
                    >
                      {cardContent}
                    </AnimatedReveal>
                  ) : (
                    <div />
                  )}

                  <div className="relative z-10 flex items-center justify-center">
                    <span className="whitespace-nowrap rounded-full border border-accent/25 bg-bg-primary px-3 py-1.5 font-cinzel text-base text-accent">
                      {event.time}
                    </span>
                  </div>

                  {!isEven ? (
                    <AnimatedReveal
                      direction={liteMotion ? "up" : "left"}
                      delay={liteMotion ? 0 : index * 0.1}
                    >
                      {cardContent}
                    </AnimatedReveal>
                  ) : (
                    <div />
                  )}
                </div>

                {/* Connecting line desktop */}
                <div
                  className={cn(
                    "absolute top-1/2 hidden h-px w-16 -translate-y-1/2 md:block",
                    isEven
                      ? "left-[calc(50%-4rem)] bg-linear-to-r from-transparent to-accent/35"
                      : "right-[calc(50%-4rem)] bg-linear-to-l from-transparent to-accent/35",
                  )}
                />
              </div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
