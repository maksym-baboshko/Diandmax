"use client";

import { useLocale, useTranslations } from "next-intl";

import type { GuestProfile } from "@/entities/guest";
import { COUPLE } from "@/shared/config";
import { AnimatedReveal, Ornament, SectionWrapper } from "@/shared/ui";

interface PersonalInvitationSectionProps {
  guest: GuestProfile;
}

export function PersonalInvitationSection({ guest }: PersonalInvitationSectionProps) {
  const locale = useLocale() as "uk" | "en";
  const t = useTranslations("PersonalInvitation");
  const heroT = useTranslations("Hero");

  const signature = `${COUPLE.groom.name[locale]} & ${COUPLE.bride.name[locale]}`;

  return (
    <SectionWrapper noPadding noFade className="relative overflow-visible">
      <div className="mx-auto w-full max-w-6xl px-5 pb-12 pt-24 md:px-8 md:pb-24 md:pt-32">
        <AnimatedReveal direction="up" delay={0.08} className="relative">
          <div className="relative overflow-hidden rounded-4xl border border-accent/18 bg-text-primary/96 text-bg-primary shadow-2xl shadow-accent/10 dark:bg-bg-secondary dark:text-text-primary md:rounded-[2.75rem]">
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-accent/12 via-transparent to-accent/10 dark:from-accent/10 dark:to-accent/6" />
            <div className="pointer-events-none absolute -left-20 top-12 h-40 w-40 rounded-full bg-accent/12 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 bottom-8 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-accent/70 to-transparent" />
            <div className="pointer-events-none absolute inset-x-10 bottom-0 h-px bg-linear-to-r from-transparent via-accent/35 to-transparent" />

            <Ornament
              position="top-left"
              size="sm"
              className="left-3 top-4 opacity-20 md:left-6 md:top-6"
            />
            <Ornament
              position="top-right"
              size="sm"
              className="right-3 top-4 opacity-20 md:right-6 md:top-6"
            />
            <Ornament
              position="bottom-left"
              size="sm"
              className="bottom-3 left-3 opacity-[0.16] md:bottom-6 md:left-6"
            />
            <Ornament
              position="bottom-right"
              size="sm"
              className="bottom-3 right-3 opacity-[0.16] md:bottom-6 md:right-6"
            />

            <div className="relative grid gap-8 px-6 py-8 md:px-10 md:py-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)] lg:gap-10 lg:px-14 lg:py-16">
              <div className="relative z-10">
                <p className="text-[10px] uppercase tracking-[0.34em] text-accent/85 md:text-xs">
                  {t("eyebrow")}
                </p>

                <div className="mt-5 max-w-4xl">
                  <p className="heading-serif text-4xl leading-none text-bg-primary dark:text-text-primary md:text-6xl lg:text-7xl">
                    {guest.name[locale]}
                  </p>
                  <h2 className="heading-serif mt-5 max-w-3xl text-2xl leading-tight text-bg-primary/92 dark:text-text-primary/92 md:text-4xl lg:text-[2.8rem]">
                    {t("headline")}
                  </h2>
                </div>

                <div className="mt-8 max-w-3xl space-y-5 text-base leading-relaxed text-bg-primary/72 dark:text-text-secondary md:text-lg">
                  <p>{t("body_1", { name: guest.vocative[locale] })}</p>
                  <p>{t("body_2")}</p>
                </div>

                <div className="mt-10">
                  <p className="text-sm uppercase tracking-[0.26em] text-accent/70 md:text-[13px]">
                    {t("closing")}
                  </p>
                  <p className="mt-3 font-[family-name:var(--font-vibes)] text-4xl text-accent md:text-5xl">
                    {signature}
                  </p>
                </div>
              </div>

              <div className="relative z-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-[1.75rem] border border-accent/16 bg-bg-primary/8 p-6 dark:bg-bg-primary/35">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-accent/78">
                    {t("seats_label")}
                  </p>
                  <div className="mt-5 flex items-end gap-3">
                    <span className="font-cinzel text-6xl leading-none text-bg-primary dark:text-text-primary">
                      {guest.seats}
                    </span>
                    <span className="pb-2 text-sm uppercase tracking-[0.22em] text-bg-primary/55 dark:text-text-secondary">
                      {t("seat_word", { seats: guest.seats })}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-bg-primary/66 dark:text-text-secondary">
                    {t("seats_note")}
                  </p>
                </div>

                <div className="rounded-[1.75rem] border border-accent/16 bg-linear-to-br from-accent/14 to-transparent p-6">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-accent/78">
                    {t("details_label")}
                  </p>
                  <dl className="mt-5 space-y-4">
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.2em] text-bg-primary/45 dark:text-text-secondary/80">
                        {t("date_label")}
                      </dt>
                      <dd className="heading-serif mt-1 text-xl text-bg-primary dark:text-text-primary">
                        {heroT("date")}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.2em] text-bg-primary/45 dark:text-text-secondary/80">
                        {t("venue_label")}
                      </dt>
                      <dd className="heading-serif mt-1 text-xl text-bg-primary dark:text-text-primary">
                        {heroT("location")}
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-6 h-px bg-linear-to-r from-accent/30 to-transparent" />
                  <p className="mt-6 text-sm leading-relaxed text-bg-primary/66 dark:text-text-secondary">
                    {t("details_note")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedReveal>
      </div>
    </SectionWrapper>
  );
}
