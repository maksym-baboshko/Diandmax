"use client";

import { useTranslations, useLocale } from "next-intl";
import { SectionWrapper, SectionHeading, AnimatedReveal, Ornament } from "@/shared/ui";
import { DRESS_CODE } from "@/shared/config";
import { motion } from "framer-motion";

export function DressCode() {
  const t = useTranslations("DressCode");
  const locale = useLocale() as "uk" | "en";

  return (
    <SectionWrapper id="dress-code" className="py-24 relative overflow-hidden">
      <Ornament position="top-right" size="sm" className="opacity-40" />
      <Ornament position="bottom-left" size="sm" className="opacity-40" />

      <SectionHeading subtitle={t("subtitle")}>
        {t("title")}
      </SectionHeading>

      <div className="max-w-6xl mx-auto px-4 mt-16 md:mt-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          <AnimatedReveal direction="right" delay={0.2}>
            <div className="space-y-8">
              <div className="space-y-4 text-center md:text-left">
                <h3 className="heading-serif text-2xl md:text-3xl text-accent flex items-center justify-center md:justify-start gap-4">
                  <span className="w-8 h-px bg-accent/30 hidden md:block" />
                  {t("ladies_title")}
                </h3>
                <p className="text-text-secondary text-lg leading-relaxed max-w-md mx-auto md:mx-0">
                  {t("ladies_description")}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {DRESS_CODE.ladies.colors.map((color, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index }}
                    className="group"
                  >
                    <div className="relative aspect-square rounded-3xl overflow-hidden shadow-lg border border-white/10 group-hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer">
                      <div 
                        className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                        <span className="text-white text-xs font-medium uppercase tracking-widest">{color.hex}</span>
                      </div>
                    </div>
                    <p className="mt-3 text-center md:text-left text-sm font-medium text-text-primary group-hover:text-accent transition-colors duration-300">
                      {color.name[locale]}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedReveal>

          <AnimatedReveal direction="left" delay={0.4}>
            <div className="space-y-8">
              <div className="space-y-4 text-center md:text-left">
                <h3 className="heading-serif text-2xl md:text-3xl text-accent flex items-center justify-center md:justify-start gap-4">
                  <span className="w-8 h-px bg-accent/30 hidden md:block" />
                  {t("gentlemen_title")}
                </h3>
                <p className="text-text-secondary text-lg leading-relaxed max-w-md mx-auto md:mx-0">
                  {t("gentlemen_description")}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {DRESS_CODE.gentlemen.colors.map((color, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * (index + 4) }}
                    className="group"
                  >
                    <div className="relative aspect-square rounded-3xl overflow-hidden shadow-lg border border-white/10 group-hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer">
                      <div 
                        className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                        <span className="text-white text-xs font-medium uppercase tracking-widest">{color.hex}</span>
                      </div>
                    </div>
                    <p className="mt-3 text-center md:text-left text-sm font-medium text-text-primary group-hover:text-accent transition-colors duration-300">
                      {color.name[locale]}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedReveal>
        </div>
      </div>
    </SectionWrapper>
  );
}
