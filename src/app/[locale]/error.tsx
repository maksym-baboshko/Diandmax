"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { Link } from "@/shared/i18n/navigation";
import { Button, GlassPanel } from "@/shared/ui";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function LocaleError({ error, reset }: ErrorProps) {
  const t = useTranslations("ErrorPage");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg-primary px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-accent/8 via-transparent to-accent/10" />
      <div className="pointer-events-none absolute -left-12 top-10 h-48 w-48 rounded-full bg-accent/12 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-14 right-0 h-60 w-60 rounded-full bg-accent/10 blur-3xl" />

      <GlassPanel className="relative z-10 w-full max-w-2xl">
        <div className="px-8 py-10 text-center md:px-12 md:py-14">
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent/80">{t("eyebrow")}</p>
          <h1 className="heading-serif mt-5 text-4xl leading-tight text-text-primary md:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-text-secondary/90 md:text-lg">
            {t("description")}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button type="button" onClick={reset}>
              {t("retry_cta")}
            </Button>
            <Button as={Link} href="/" variant="outline">
              {t("home_cta")}
            </Button>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
