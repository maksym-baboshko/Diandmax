"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/shared/i18n/navigation";
import { AnimatedReveal, Button, SectionWrapper } from "@/shared/ui";

export function LivePlaceholderPage() {
  const t = useTranslations("LivePage");
  const tCommon = useTranslations("GamesCommon");

  return (
    <SectionWrapper noFade noPadding className="relative overflow-hidden">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute left-1/2 top-20 h-100 w-150 -translate-x-1/2 rounded-full bg-accent/5 blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <AnimatedReveal direction="up" delay={0.04}>
          <p className="text-[10px] uppercase tracking-[0.34em] text-accent md:text-xs">
            {t("eyebrow")}
          </p>
        </AnimatedReveal>

        <AnimatedReveal direction="up" delay={0.08}>
          <div className="mt-6 max-w-3xl">
            <p className="font-cinzel text-xs tracking-wider text-accent/40">
              {t("subtitle")}
            </p>
            <h1 className="heading-serif-italic mt-4 text-5xl leading-[0.94] text-text-primary md:text-6xl lg:text-7xl">
              {t("title")}
            </h1>
            <div className="mt-6 h-px w-20 bg-linear-to-r from-accent/50 to-transparent" />
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
              {t("description")}
            </p>
          </div>
        </AnimatedReveal>

        <AnimatedReveal direction="up" delay={0.14}>
          <div className="mt-14 rounded-4xl border border-accent/12 bg-linear-to-br from-accent/6 via-transparent to-transparent p-8 md:p-10">
            <div className="md:grid md:grid-cols-2 md:gap-10">
              <div>
                <p className="text-[10px] uppercase tracking-[0.34em] text-accent md:text-xs">
                  {t("status_label")}
                </p>
                <h2 className="heading-serif mt-4 text-3xl text-text-primary md:text-4xl">
                  {t("status_title")}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary md:text-base">
                  {t("status_description")}
                </p>
              </div>

              <div className="mt-8 flex flex-col items-start gap-3 md:mt-2 md:justify-center">
                <Button as={Link} href="/games">
                  {t("primary_cta")}
                </Button>
                <Button as={Link} href="/" variant="ghost" size="sm">
                  {tCommon("home_nav")}
                </Button>
              </div>
            </div>
          </div>
        </AnimatedReveal>
      </div>
    </SectionWrapper>
  );
}
