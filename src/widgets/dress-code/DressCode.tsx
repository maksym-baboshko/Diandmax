"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { SectionWrapper, SectionHeading, Ornament } from "@/shared/ui";
import { DRESS_CODE } from "@/shared/config";

const ease = [0.22, 1, 0.36, 1] as const;

function ColorSwatch({
  hex,
  name,
  index,
  groupOffset,
}: {
  hex: string;
  name: string;
  index: number;
  groupOffset: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, delay: (index + groupOffset) * 0.09, ease }}
      className="group flex flex-col"
    >
      <div className="relative aspect-3/4 rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer shadow-md transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl">
        {/* Color fill */}
        <div
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundColor: hex }}
        />
        {/* Specular sheen */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 55%)",
          }}
        />
        {/* Hex reveal on hover */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-4 pt-10 bg-linear-to-t from-black/50 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <span className="text-white/80 text-[10px] uppercase tracking-[0.2em] font-mono">
            {hex}
          </span>
        </div>
        {/* Color-matched border glow */}
        <div
          className="absolute inset-0 rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ boxShadow: `inset 0 0 0 1px ${hex}80, 0 20px 60px ${hex}40` }}
        />
      </div>
      <p className="mt-3 text-center text-xs md:text-sm text-text-secondary/70 font-medium group-hover:text-accent transition-colors duration-300 leading-tight px-1">
        {name}
      </p>
    </motion.div>
  );
}

function GroupHeading({
  title,
  note,
  direction,
  delay,
}: {
  title: string;
  note: string;
  direction: "left" | "right";
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: direction === "left" ? -24 : 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.75, delay, ease }}
      className="mb-8 md:mb-10 text-center md:text-left"
    >
      <h3 className="heading-serif text-2xl md:text-3xl text-accent mb-2">
        {title}
      </h3>
      <p className="text-sm text-text-secondary/55 italic tracking-wide">{note}</p>
    </motion.div>
  );
}

export function DressCode() {
  const t = useTranslations("DressCode");
  const locale = useLocale() as "uk" | "en";
  const allColors = [
    ...DRESS_CODE.ladies.colors,
    ...DRESS_CODE.gentlemen.colors,
  ];

  return (
    <SectionWrapper id="dress-code" className="py-24 relative overflow-hidden">
      <Ornament position="top-right" size="sm" className="opacity-40" />
      <Ornament position="bottom-left" size="sm" className="opacity-40" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-150 bg-accent/4 rounded-full blur-[150px] pointer-events-none" />

      <SectionHeading subtitle={t("subtitle")}>
        {t("title")}
      </SectionHeading>

      {/* Animated palette strip */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.3, delay: 0.15, ease }}
        style={{ transformOrigin: "left" }}
        className="max-w-xl mx-auto mt-10 h-0.75 flex rounded-full overflow-hidden"
      >
        {allColors.map((c, i) => (
          <div key={i} className="flex-1" style={{ backgroundColor: c.hex }} />
        ))}
      </motion.div>

      <div className="max-w-5xl mx-auto px-4 mt-16 md:mt-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">

          {/* Ladies */}
          <div>
            <GroupHeading
              title={t("ladies_title")}
              note={t("ladies_note")}
              direction="left"
              delay={0.2}
            />
            <div className="grid grid-cols-2 gap-4 md:gap-5">
              {DRESS_CODE.ladies.colors.map((color, i) => (
                <ColorSwatch
                  key={i}
                  hex={color.hex}
                  name={color.name[locale]}
                  index={i}
                  groupOffset={0}
                />
              ))}
            </div>
          </div>

          {/* Gentlemen */}
          <div>
            <GroupHeading
              title={t("gentlemen_title")}
              note={t("gentlemen_note")}
              direction="right"
              delay={0.35}
            />
            <div className="grid grid-cols-2 gap-4 md:gap-5">
              {DRESS_CODE.gentlemen.colors.map((color, i) => (
                <ColorSwatch
                  key={i}
                  hex={color.hex}
                  name={color.name[locale]}
                  index={i}
                  groupOffset={4}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </SectionWrapper>
  );
}
