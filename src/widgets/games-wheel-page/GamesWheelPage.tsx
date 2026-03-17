"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/shared/i18n/navigation";
import { PlayerSessionCard, usePlayerSession } from "@/features/game-session";
import { WheelOfFortuneGame } from "@/features/wheel-of-fortune";
import { getGameBySlug, type SupportedLocale } from "@/shared/config";
import { Button, SectionWrapper } from "@/shared/ui";

const wheelGame = getGameBySlug("wheel-of-fortune");

export function GamesWheelPage() {
  const locale = useLocale() as SupportedLocale;
  const t = useTranslations("WheelOfFortune");
  const tCommon = useTranslations("GamesCommon");
  const {
    session,
    isHydrating,
    isSaving,
    errorCode,
    registerPlayer,
    clearPlayer,
    updatePlayerSnapshot,
  } = usePlayerSession();

  if (!wheelGame) {
    return null;
  }

  return (
    <>
      <SectionWrapper noFade noPadding className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 pb-10 pt-10 md:px-8 md:pb-12 md:pt-16">
          <Button
            as={Link}
            href="/games"
            variant="ghost"
            size="sm"
            className="px-0 text-xs uppercase tracking-[0.24em]"
          >
            {tCommon("back_to_games")}
          </Button>

          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,360px)] lg:items-start">
            <div className="max-w-3xl">
              <p className="text-[10px] uppercase tracking-[0.34em] text-accent md:text-xs">
                {t("page_subtitle")}
              </p>
              <h1 className="heading-serif mt-4 text-5xl leading-[0.94] text-text-primary md:text-6xl">
                {wheelGame.title[locale]}
              </h1>
              <div className="mt-5 h-px w-24 bg-linear-to-r from-accent to-transparent" />
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
                {t("page_description")}
              </p>
            </div>

            <PlayerSessionCard
              session={session}
              isHydrating={isHydrating}
              isSaving={isSaving}
              errorCode={errorCode}
              onSave={registerPlayer}
              onClear={clearPlayer}
              compact
              className="lg:justify-self-end"
            />
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper noPadding noFade className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">
          {session ? (
            <WheelOfFortuneGame
              session={session}
              onPlayerUpdate={updatePlayerSnapshot}
            />
          ) : (
            <div className="rounded-4xl border border-accent/12 bg-bg-primary/55 p-6 shadow-[0_22px_60px_-46px_rgba(0,0,0,0.4)] md:p-8">
              <p className="text-[10px] uppercase tracking-[0.34em] text-accent md:text-xs">
                {t("locked_label")}
              </p>
              <h2 className="heading-serif mt-4 text-3xl text-text-primary md:text-4xl">
                {t("locked_title")}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary md:text-base">
                {t("locked_description")}
              </p>
            </div>
          )}
        </div>
      </SectionWrapper>
    </>
  );
}
