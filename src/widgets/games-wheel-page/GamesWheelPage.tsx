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
        <div className="mx-auto max-w-6xl px-5 pb-12 pt-10 md:px-8 md:pb-16 md:pt-16">
          <Button
            as={Link}
            href="/games"
            variant="ghost"
            size="sm"
            className="px-0 text-xs uppercase tracking-[0.24em]"
          >
            {tCommon("back_to_games")}
          </Button>

          <div className="mt-6 max-w-3xl">
            <p className="text-[10px] uppercase tracking-[0.34em] text-accent md:text-xs">
              {t("page_subtitle")}
            </p>
            <h1 className="heading-serif mt-4 text-5xl leading-[0.94] text-text-primary md:text-6xl">
              {wheelGame.title[locale]}
            </h1>
            <div className="mt-5 h-px w-24 bg-linear-to-r from-accent to-transparent" />
            <p className="max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
              {t("page_description")}
            </p>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper noPadding alternate className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-12 md:px-8 md:py-16 xl:grid-cols-[340px_minmax(0,1fr)] xl:items-start">
          <PlayerSessionCard
            session={session}
            isHydrating={isHydrating}
            isSaving={isSaving}
            errorCode={errorCode}
            onSave={registerPlayer}
            onClear={clearPlayer}
            compact
          />

          {session ? (
            <WheelOfFortuneGame
              session={session}
              onPlayerUpdate={updatePlayerSnapshot}
            />
          ) : (
            <div className="rounded-[2rem] border border-accent/18 bg-bg-secondary/70 p-6 shadow-lg shadow-accent/8 md:p-8">
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
