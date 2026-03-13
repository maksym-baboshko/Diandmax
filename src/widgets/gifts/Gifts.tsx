"use client";

import { useTranslations } from "next-intl";
import { SectionWrapper, SectionHeading, AnimatedReveal, Ornament } from "@/shared/ui";

export function Gifts() {
  const t = useTranslations("Gifts");

  return (
    <SectionWrapper id="gifts" className="relative overflow-hidden py-24">
      <Ornament position="top-left" size="sm" className="opacity-30" />
      <Ornament position="bottom-right" size="sm" className="opacity-30" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <SectionHeading subtitle={t("subtitle")}>
        {t("title")}
      </SectionHeading>

      <div className="max-w-4xl mx-auto px-4 mt-16 md:mt-24 relative z-10">
        <AnimatedReveal direction="up" blur>
          <div className="relative p-8 md:p-16 rounded-[2.5rem] bg-bg-primary/45 backdrop-blur-xl border border-accent/15 shadow-[0_30px_100px_rgba(0,0,0,0.25)] group overflow-hidden">
            <div className="absolute inset-4 rounded-[1.8rem] border border-accent/10 pointer-events-none" />
            
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10">
              <div className="flex justify-center mb-8 text-accent/60 group-hover:text-accent transition-colors duration-700">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>

              <p className="text-lg md:text-xl lg:text-2xl text-text-primary leading-relaxed md:leading-loose text-center font-medium max-w-2xl mx-auto">
                {t.rich("description", {
                  bold: (chunks) => <strong className="text-accent font-bold">{chunks}</strong>
                })}
              </p>

              <div className="mt-12 flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-linear-to-r from-transparent to-accent/30" />
                <div className="w-1.5 h-1.5 rounded-full bg-accent/40" />
                <div className="h-px w-12 bg-linear-to-l from-transparent to-accent/30" />
              </div>
            </div>
          </div>
        </AnimatedReveal>
      </div>
    </SectionWrapper>
  );
}
