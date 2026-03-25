"use client";

import { MOTION_EASE, useLiteMotion } from "@/shared/lib";
import { AnimatedReveal, Ornament, SectionHeading, SectionWrapper } from "@/shared/ui";
import { type Variants, motion } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";

const ease = MOTION_EASE;

const portraitVariants: Variants = {
  hidden: (direction: "left" | "right") => ({
    opacity: 0.001,
    x: direction === "left" ? -18 : 18,
    y: 18,
    scale: 0.985,
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: { duration: 0.56, ease },
  },
};

const imageVariants: Variants = {
  hidden: { scale: 1.045, opacity: 0.001 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.72, ease },
  },
};

function StarDivider() {
  return (
    <div className="my-10 flex items-center justify-center gap-3 md:my-12">
      <div className="h-px w-10 bg-accent/25 md:w-14" />
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        className="shrink-0 text-accent/45"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M6 0L7.2 4.8L12 6L7.2 7.2L6 12L4.8 7.2L0 6L4.8 4.8L6 0Z" />
      </svg>
      <div className="h-px w-10 bg-accent/25 md:w-14" />
    </div>
  );
}

function Portrait({
  src,
  name,
  role,
  direction,
  delay,
  liteMotion,
}: {
  src: string;
  name: string;
  role: string;
  direction: "left" | "right";
  delay: number;
  liteMotion: boolean;
}) {
  const content = (
    <div className={`flex w-full flex-col items-center ${direction === "right" ? "md:pt-16" : ""}`}>
      <div className="group relative mb-4 aspect-3/4 w-[80%] max-w-[280px] sm:w-full md:mb-8">
        <div className="pointer-events-none absolute inset-0 z-10 rounded-t-[100px] rounded-b-sm border border-accent/70 shadow-[0_0_0_0_transparent] transition-all duration-500 group-hover:border-accent group-hover:shadow-[0_0_30px_4px_color-mix(in_srgb,var(--accent)_15%,transparent)]" />
        <div className="pointer-events-none absolute inset-2 z-20 rounded-t-[92px] rounded-b-sm border border-accent/60" />
        <div className="absolute inset-0 overflow-hidden rounded-t-[100px] rounded-b-sm">
          {liteMotion ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={imageVariants}
              className="relative h-full w-full transform-gpu"
              style={{ willChange: "transform, opacity" }}
            >
              <Image src={src} alt={name} fill sizes="280px" className="object-cover" />
            </motion.div>
          ) : (
            <Image
              src={src}
              alt={name}
              fill
              sizes="280px"
              className="object-cover grayscale-[0.3] transition-all duration-1000 group-hover:scale-110 group-hover:grayscale-0"
            />
          )}
        </div>
      </div>
      <h3 className="heading-serif mb-2 text-center text-3xl text-text-primary md:text-4xl">
        {name}
      </h3>
      <span className="text-center text-xs font-medium uppercase tracking-widest text-accent">
        {role}
      </span>
    </div>
  );

  if (liteMotion) {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        variants={portraitVariants}
        custom={direction}
        className="w-full"
        style={{ willChange: "transform, opacity" }}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <AnimatedReveal direction="up" delay={delay} className="w-full">
      {content}
    </AnimatedReveal>
  );
}

export function OurStory() {
  const t = useTranslations("OurStory");
  const liteMotion = useLiteMotion();

  return (
    <SectionWrapper id="our-story" className="relative overflow-hidden py-24">
      <Ornament position="top-left" size="sm" />
      <Ornament position="top-right" size="sm" />
      <Ornament position="bottom-left" size="sm" />
      <Ornament position="bottom-right" size="sm" />

      <SectionHeading subtitle={t("how_we_met_title")}>{t("title")}</SectionHeading>

      <div className="mx-auto mt-16 max-w-5xl px-4 md:mt-24">
        {/* Portraits */}
        <div className="relative mb-12 grid grid-cols-1 gap-8 md:mb-24 md:grid-cols-2 md:gap-16 lg:gap-24">
          {!liteMotion && (
            <>
              <div className="pointer-events-none absolute left-1/4 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/8 blur-[80px]" />
              <div className="pointer-events-none absolute right-1/4 top-1/2 h-72 w-72 translate-x-1/2 rounded-full bg-accent/8 blur-[80px]" />
            </>
          )}
          <Portrait
            src="/images/story/groom.jpg"
            name={t("groom_name")}
            role={t("groom_bio")}
            direction="left"
            delay={0.1}
            liteMotion={liteMotion}
          />
          <Portrait
            src="/images/story/bride.jpg"
            name={t("bride_name")}
            role={t("bride_bio")}
            direction="right"
            delay={0.2}
            liteMotion={liteMotion}
          />
        </div>

        {/* Story narrative */}
        <div className="mx-auto max-w-2xl">
          <AnimatedReveal direction="up" delay={liteMotion ? 0 : 0.05} threshold={0.1}>
            <StarDivider />
          </AnimatedReveal>

          {(["story_p1", "story_p2", "story_p3", "story_p4"] as const).map((key, i) => (
            <AnimatedReveal
              key={key}
              direction="up"
              delay={liteMotion ? 0 : 0.05 * i}
              threshold={0.1}
            >
              <p
                className={
                  i === 0
                    ? "mb-6 leading-relaxed text-text-secondary first-letter:float-left first-letter:mr-2 first-letter:font-cinzel first-letter:text-5xl first-letter:font-bold first-letter:leading-none first-letter:text-accent"
                    : "mb-6 leading-relaxed text-text-secondary"
                }
              >
                {t(key)}
              </p>
            </AnimatedReveal>
          ))}

          <AnimatedReveal direction="up" delay={liteMotion ? 0 : 0.1}>
            <StarDivider />
          </AnimatedReveal>

          <AnimatedReveal direction="up" delay={liteMotion ? 0 : 0.12}>
            <p className="heading-serif-italic mt-4 text-center text-xl text-accent md:text-2xl">
              — {t("story_closing")}
            </p>
          </AnimatedReveal>
        </div>
      </div>
    </SectionWrapper>
  );
}
