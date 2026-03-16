"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/shared/i18n/navigation";
import { PlayerSessionCard, usePlayerSession } from "@/features/game-session";
import {
  GAMES,
  type GameCatalogItem,
  type SupportedLocale,
} from "@/shared/config";
import {
  AnimatedReveal,
  Button,
  SectionHeading,
  SectionWrapper,
} from "@/shared/ui";

function GameCard({
  game,
  index,
  locale,
}: {
  game: GameCatalogItem;
  index: number;
  locale: SupportedLocale;
}) {
  const tCommon = useTranslations("GamesCommon");
  const isLive = game.status === "live";

  return (
    <AnimatedReveal direction="up" delay={Math.min(index * 0.06, 0.24)}>
      <div className="flex h-full flex-col rounded-[2rem] border border-accent/18 bg-bg-secondary/70 p-6 shadow-lg shadow-accent/8 transition-transform duration-300 hover:-translate-y-1 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <span className="font-cinzel text-3xl text-accent/45">
            {(index + 1).toString().padStart(2, "0")}
          </span>
          <span className="rounded-full border border-accent/18 bg-bg-primary/75 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-accent">
            {isLive ? tCommon("live_badge") : tCommon("coming_soon_badge")}
          </span>
        </div>

        <h3 className="heading-serif mt-6 text-2xl text-text-primary md:text-3xl">
          {game.title[locale]}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary md:text-base">
          {game.description[locale]}
        </p>

        <div className="mt-6">
          {isLive ? (
            <Button as={Link} href={`/games/${game.slug}`} className="w-full">
              {tCommon("play_cta")}
            </Button>
          ) : (
            <Button type="button" variant="secondary" disabled className="w-full">
              {tCommon("coming_soon_cta")}
            </Button>
          )}
        </div>
      </div>
    </AnimatedReveal>
  );
}

export function GamesHubPage() {
  const locale = useLocale() as SupportedLocale;
  const t = useTranslations("GamesHub");
  const tCommon = useTranslations("GamesCommon");
  const {
    session,
    isHydrating,
    isSaving,
    errorCode,
    registerPlayer,
    clearPlayer,
  } = usePlayerSession();

  const featureChips = [t("chip_quick"), t("chip_fun"), t("chip_no_signup")];

  return (
    <>
      <SectionWrapper noFade noPadding className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 pb-12 pt-10 md:px-8 md:pb-16 md:pt-16">
          <AnimatedReveal direction="up" delay={0.04}>
            <div className="max-w-3xl">
              <p className="text-[10px] uppercase tracking-[0.34em] text-accent md:text-xs">
                {t("eyebrow")}
              </p>
              <h1 className="heading-serif mt-5 text-5xl leading-[0.94] text-text-primary md:text-7xl">
                {t("title")}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
                {t("description")}
              </p>
            </div>
          </AnimatedReveal>

          <AnimatedReveal direction="up" delay={0.1}>
            <div className="mt-7 flex flex-wrap gap-3">
              {featureChips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-accent/18 bg-bg-secondary/75 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-text-secondary"
                >
                  {chip}
                </span>
              ))}
            </div>
          </AnimatedReveal>

          <AnimatedReveal direction="up" delay={0.14}>
            <PlayerSessionCard
              session={session}
              isHydrating={isHydrating}
              isSaving={isSaving}
              errorCode={errorCode}
              onSave={registerPlayer}
              onClear={clearPlayer}
              className="mt-10"
            />
          </AnimatedReveal>
        </div>
      </SectionWrapper>

      <SectionWrapper noPadding alternate className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
          <SectionHeading subtitle={t("grid_subtitle")}>
            {t("grid_title")}
          </SectionHeading>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {GAMES.map((game, index) => (
              <GameCard
                key={game.slug}
                game={game}
                index={index}
                locale={locale}
              />
            ))}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper noPadding noFade className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-12 md:px-8 md:pb-20">
          <AnimatedReveal direction="up">
            <div className="rounded-[2rem] border border-accent/18 bg-bg-secondary/70 p-6 shadow-lg shadow-accent/8 md:p-8">
              <p className="text-[10px] uppercase tracking-[0.34em] text-accent md:text-xs">
                {tCommon("live_nav")}
              </p>
              <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl">
                  <h2 className="heading-serif text-3xl text-text-primary md:text-4xl">
                    {t("live_title")}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary md:text-base">
                    {t("live_description")}
                  </p>
                </div>
                <Button as={Link} href="/live" variant="outline">
                  {t("live_cta")}
                </Button>
              </div>
            </div>
          </AnimatedReveal>
        </div>
      </SectionWrapper>
    </>
  );
}
