"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/shared/i18n/navigation";
import { Button, SectionWrapper } from "@/shared/ui";

export function LivePlaceholderPage() {
  const t = useTranslations("LivePage");
  const tCommon = useTranslations("GamesCommon");

  return (
    <SectionWrapper noFade noPadding className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <p className="text-[10px] uppercase tracking-[0.34em] text-accent md:text-xs">
          {t("eyebrow")}
        </p>

        <div className="mt-6 max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.34em] text-accent md:text-xs">
            {t("subtitle")}
          </p>
          <h1 className="heading-serif mt-4 text-5xl leading-[0.94] text-text-primary md:text-6xl">
            {t("title")}
          </h1>
          <div className="mt-5 h-px w-24 bg-linear-to-r from-accent to-transparent" />
          <p className="text-base leading-relaxed text-text-secondary md:text-lg">
            {t("description")}
          </p>
        </div>

        <div className="mt-10 rounded-[2rem] border border-accent/18 bg-bg-secondary/70 p-6 shadow-lg shadow-accent/8 md:p-8">
          <p className="text-[10px] uppercase tracking-[0.34em] text-accent md:text-xs">
            {t("status_label")}
          </p>
          <h2 className="heading-serif mt-4 text-3xl text-text-primary md:text-4xl">
            {t("status_title")}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary md:text-base">
            {t("status_description")}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button as={Link} href="/games">
              {t("primary_cta")}
            </Button>
            <Button as={Link} href="/" variant="outline">
              {tCommon("home_nav")}
            </Button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
