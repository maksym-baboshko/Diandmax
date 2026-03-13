"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SectionWrapper, SectionHeading, Ornament } from "@/shared/ui";

const ease = [0.22, 1, 0.36, 1] as const;

function EnvelopeIllustration() {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className="relative flex items-center justify-center"
    >
      <svg
        width="120"
        height="96"
        viewBox="0 0 120 96"
        fill="none"
        className="text-accent drop-shadow-[0_0_24px_rgba(var(--accent-rgb,180,140,100),0.35)]"
        aria-hidden="true"
      >
        {/* Envelope body */}
        <rect
          x="4"
          y="20"
          width="112"
          height="72"
          rx="6"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Inner inset */}
        <rect
          x="10"
          y="26"
          width="100"
          height="60"
          rx="4"
          stroke="currentColor"
          strokeWidth="0.75"
          strokeOpacity="0.3"
          fill="none"
        />
        {/* Fold lines */}
        <path
          d="M4 92 L46 56"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeOpacity="0.4"
        />
        <path
          d="M116 92 L74 56"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeOpacity="0.4"
        />
        {/* Flap */}
        <path
          d="M4 24 L60 58 L116 24"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Heart wax seal */}
        <motion.g
          animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="60" cy="14" r="12" fill="currentColor" fillOpacity="0.08" />
          <path
            d="M60 20 C60 20 54 14 51 14 C48 14 46 16.5 46 19 C46 24 54 30 60 34 C66 30 74 24 74 19 C74 16.5 72 14 69 14 C66 14 60 20 60 20Z"
            fill="currentColor"
            fillOpacity="0.6"
          />
        </motion.g>
      </svg>
    </motion.div>
  );
}

export function Gifts() {
  const t = useTranslations("Gifts");

  return (
    <SectionWrapper id="gifts" className="relative overflow-hidden py-24">
      <Ornament position="top-left" size="sm" className="opacity-30" />
      <Ornament position="bottom-right" size="sm" className="opacity-30" />

      {/* Ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 left-1/3 w-72 h-72 bg-accent/4 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/3 w-72 h-72 bg-accent/4 rounded-full blur-[100px] pointer-events-none" />

      <SectionHeading subtitle={t("subtitle")}>
        {t("title")}
      </SectionHeading>

      <div className="max-w-3xl mx-auto px-4 mt-16 relative z-10">

        {/* Envelope */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease }}
          className="flex justify-center mb-12"
        >
          <EnvelopeIllustration />
        </motion.div>

        {/* Intro */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
          className="text-center text-lg md:text-xl text-text-secondary leading-relaxed mb-12"
        >
          {t("intro")}
        </motion.p>

        {/* Amount cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
          {(["nok", "eur"] as const).map((currency, i) => (
            <motion.div
              key={currency}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.18 + i * 0.14, ease }}
              className="group relative rounded-3xl overflow-hidden border border-accent/20 bg-bg-primary/40 backdrop-blur-lg hover:border-accent/40 transition-all duration-500 hover:-translate-y-1"
            >
              {/* Card glow on hover */}
              <div className="absolute inset-0 bg-linear-to-b from-accent/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              {/* Inner border */}
              <div className="absolute inset-[1px] rounded-[calc(1.5rem-1px)] border border-accent/8 pointer-events-none" />

              <div className="relative z-10 p-8 flex flex-col items-center text-center">
                <p className="text-xs uppercase tracking-[0.22em] text-text-secondary/50 mb-3">
                  {t("from")}
                </p>
                <p className="heading-serif text-5xl md:text-6xl text-accent font-bold leading-none">
                  {currency === "nok" ? "1300" : "120"}
                </p>
                <p className="font-cinzel text-lg text-accent/70 tracking-widest mt-2 mb-3">
                  {currency === "nok" ? "NOK" : "EUR"}
                </p>
                <div className="h-px w-8 bg-accent/20 mb-3" />
                <p className="text-xs uppercase tracking-[0.18em] text-text-secondary/50">
                  {t("per_guest")}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Details */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
          className="text-center text-base md:text-lg text-text-secondary/80 leading-relaxed mb-10"
        >
          {t("details")}
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.38, ease }}
          className="flex items-center justify-center gap-4 mb-10"
        >
          <div className="h-px w-20 bg-linear-to-r from-transparent to-accent/30" />
          <svg width="14" height="12" viewBox="0 0 14 12" fill="none" aria-hidden="true" className="text-accent/50">
            <path d="M7 11 C7 11 1 6.5 1 3.5 C1 2 2.5 1 4 1 C5.5 1 7 2.5 7 2.5 C7 2.5 8.5 1 10 1 C11.5 1 13 2 13 3.5 C13 6.5 7 11 7 11Z" fill="currentColor" />
          </svg>
          <div className="h-px w-20 bg-linear-to-l from-transparent to-accent/30" />
        </motion.div>

        {/* Closing */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.44, ease }}
          className="text-center text-base text-text-secondary/60 italic leading-relaxed"
        >
          {t("closing")}
        </motion.p>

      </div>
    </SectionWrapper>
  );
}
