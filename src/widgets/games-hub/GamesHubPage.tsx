"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/shared/i18n/navigation";
import { PlayerSessionCard, usePlayerSession } from "@/features/game-session";
import {
  GAMES,
  getPlayableGames,
  type GameCatalogItem,
  type SupportedLocale,
} from "@/shared/config";
import { AnimatedReveal, Button } from "@/shared/ui";
import { cn } from "@/shared/lib";

/* ═══════════════════════════════════════════════════
   Decorative mini-wheel (purely visual, no interaction)
   ═══════════════════════════════════════════════════ */

function polar(r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: 50 + r * Math.cos(rad), y: 50 + r * Math.sin(rad) };
}

function DecorativeWheel({ className }: { className?: string }) {
  const n = 8;
  const a = 360 / n;

  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      {Array.from({ length: n }, (_, i) => {
        const s = polar(48, (i + 1) * a);
        const e = polar(48, i * a);
        return (
          <path
            key={i}
            d={`M50 50L${s.x} ${s.y}A48 48 0 0 0 ${e.x} ${e.y}Z`}
            fill="currentColor"
            opacity={i % 2 === 0 ? 0.08 : 0.03}
          />
        );
      })}
      <circle
        cx="50"
        cy="50"
        r="13"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity={0.15}
      />
      <circle cx="50" cy="50" r="5" fill="currentColor" opacity={0.12} />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════
   Coming-soon game card
   ═══════════════════════════════════════════════════ */

function ComingSoonCard({
  game,
  index,
  locale,
}: {
  game: GameCatalogItem;
  index: number;
  locale: SupportedLocale;
}) {
  const tCommon = useTranslations("GamesCommon");
  const num = (index + 1).toString().padStart(2, "0");

  return (
    <AnimatedReveal direction="up" delay={Math.min(index * 0.07, 0.28)}>
      <div
        className="group relative flex h-full flex-col overflow-hidden rounded-4xl border border-accent/10 bg-linear-to-br from-accent/5 via-transparent to-accent/4 p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-accent/22 hover:shadow-[0_32px_80px_-36px_rgba(0,0,0,0.35)] md:p-7"
      >
        {/* Giant watermark number */}
        <span
          className="pointer-events-none absolute -right-2 -top-5 select-none font-cinzel text-[7.5rem] leading-none text-accent/5 transition-colors duration-700 group-hover:text-accent/10 md:text-[9rem]"
          aria-hidden="true"
        >
          {num}
        </span>

        {/* Hover glow orb */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-accent/0 blur-3xl transition-all duration-700 group-hover:bg-accent/6" />

        <div className="relative z-10 flex flex-1 flex-col">
          <div className="flex items-center gap-3">
            <span className="font-cinzel text-sm tracking-wider text-accent/35">
              {num}
            </span>
            <span className="rounded-full border border-accent/14 bg-accent/8 px-2.5 py-0.5 text-[9px] uppercase tracking-[0.28em] text-accent">
              {tCommon("coming_soon_badge")}
            </span>
          </div>

          <h3 className="heading-serif mt-5 text-xl text-text-primary md:text-2xl">
            {game.title[locale]}
          </h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">
            {game.description[locale]}
          </p>

          <div className="mt-5">
            <span className="text-[10px] uppercase tracking-[0.24em] text-text-secondary/50">
              {tCommon("coming_soon_cta")}
            </span>
          </div>
        </div>
      </div>
    </AnimatedReveal>
  );
}

/* ═══════════════════════════════════════════════════
   Live game card (for extra live games beyond featured)
   ═══════════════════════════════════════════════════ */

function LiveGameCard({
  game,
  index,
  locale,
}: {
  game: GameCatalogItem;
  index: number;
  locale: SupportedLocale;
}) {
  const tCommon = useTranslations("GamesCommon");
  const num = (index + 1).toString().padStart(2, "0");

  return (
    <AnimatedReveal direction="up" delay={Math.min(index * 0.07, 0.28)}>
      <div className="group relative flex h-full flex-col overflow-hidden rounded-4xl border border-accent/12 bg-bg-primary/55 p-6 shadow-[0_22px_60px_-46px_rgba(0,0,0,0.4)] transition-all duration-500 hover:-translate-y-2 hover:border-accent/22 hover:shadow-[0_32px_80px_-36px_rgba(0,0,0,0.35)] md:p-7">
        <span
          className="pointer-events-none absolute -right-2 -top-5 select-none font-cinzel text-[7.5rem] leading-none text-accent/5 transition-colors duration-700 group-hover:text-accent/10 md:text-[9rem]"
          aria-hidden="true"
        >
          {num}
        </span>

        <div className="relative z-10 flex flex-1 flex-col">
          <div className="flex items-center gap-3">
            <span className="font-cinzel text-sm tracking-wider text-accent/35">
              {num}
            </span>
            <span className="rounded-full border border-accent/16 bg-accent/8 px-2.5 py-0.5 text-[9px] uppercase tracking-[0.28em] text-accent">
              {tCommon("live_badge")}
            </span>
          </div>

          <h3 className="heading-serif mt-5 text-2xl text-text-primary md:text-3xl">
            {game.title[locale]}
          </h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary md:text-base">
            {game.description[locale]}
          </p>

          <div className="mt-6">
            <Button
              as={Link}
              href={`/games/${game.slug}`}
              className="w-full md:w-auto"
            >
              {tCommon("play_cta")}
            </Button>
          </div>
        </div>
      </div>
    </AnimatedReveal>
  );
}

/* ═══════════════════════════════════════════════════
   Hub page
   ═══════════════════════════════════════════════════ */

export function GamesHubPage() {
  const locale = useLocale() as SupportedLocale;
  const t = useTranslations("GamesHub");
  const tCommon = useTranslations("GamesCommon");
  const playableGames = getPlayableGames();
  const liveGame = playableGames[0] ?? null;
  const extraLiveGames = playableGames.slice(1);
  const upcomingGames = GAMES.filter((g) => g.status === "comingSoon");

  const {
    session,
    isHydrating,
    isSaving,
    errorCode,
    registerPlayer,
    clearPlayer,
  } = usePlayerSession();

  const chips = [t("chip_quick"), t("chip_fun"), t("chip_no_signup")];

  return (
    <div className="relative">

      {/* ══════ HERO ══════ */}
      <div className="relative mx-auto max-w-6xl px-5 pb-8 pt-12 md:px-8 md:pb-12 md:pt-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
          {/* Left: title block */}
          <div>
            <AnimatedReveal direction="up" delay={0.04}>
              <h1 className="heading-serif-italic max-w-2xl text-[2.75rem] leading-[0.96] text-text-primary md:text-7xl lg:text-[5.25rem]">
                {t("title")}
              </h1>
            </AnimatedReveal>

            <AnimatedReveal direction="up" delay={0.08}>
              <div className="mt-6 h-px w-20 bg-linear-to-r from-accent/50 to-transparent" />
              <p className="mt-5 max-w-xl text-base leading-relaxed text-text-secondary md:text-lg">
                {t("description")}
              </p>
            </AnimatedReveal>

            <AnimatedReveal direction="up" delay={0.12}>
              <div className="mt-7 flex flex-wrap gap-2.5">
                {chips.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-accent/10 px-4 py-1.5 text-[10px] uppercase tracking-[0.26em] text-text-secondary"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </AnimatedReveal>
          </div>

          {/* Right: player session */}
          <AnimatedReveal direction="up" delay={0.16}>
            <PlayerSessionCard
              session={session}
              isHydrating={isHydrating}
              isSaving={isSaving}
              errorCode={errorCode}
              onSave={registerPlayer}
              onClear={clearPlayer}
            />
          </AnimatedReveal>
        </div>
      </div>

      {/* ══════ FEATURED GAME ══════ */}
      {liveGame ? (
        <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">
          <AnimatedReveal direction="up" delay={0.06}>
            <div className="group relative rounded-[2.5rem] border border-accent/14 bg-linear-to-br from-accent/9 via-bg-primary/80 to-bg-primary/50 p-8 shadow-[0_32px_80px_-40px_rgba(0,0,0,0.4)] transition-shadow duration-700 hover:shadow-[0_40px_100px_-36px_rgba(0,0,0,0.5)] md:p-10 lg:p-12">
              {/* Clip wrapper keeps wheel inside card radius */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.5rem]">
                <motion.div
                  className="absolute -right-10 top-1/2 h-65 w-65 -translate-y-1/2 text-accent md:right-4 md:h-80 md:w-80 lg:right-12 lg:h-95 lg:w-95"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 180,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <DecorativeWheel className="h-full w-full" />
                </motion.div>
              </div>

              {/* Top accent stripe */}
              <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-accent/30 to-transparent" />

              <div className="relative z-10 max-w-2xl">
                {/* Live pulse */}
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.34em] text-accent md:text-xs">
                    {tCommon("live_badge")}
                  </span>
                </div>

                <h2 className="heading-serif mt-7 text-4xl leading-[0.94] text-text-primary md:text-5xl lg:text-6xl">
                  {liveGame.title[locale]}
                </h2>
                <p className="mt-4 max-w-lg text-base leading-relaxed text-text-secondary md:text-lg">
                  {liveGame.description[locale]}
                </p>

                <div className="mt-8 flex items-center gap-5">
                  <Button
                    as={Link}
                    href={`/games/${liveGame.slug}`}
                    size="lg"
                  >
                    {tCommon("play_cta")}
                  </Button>
                  <span className="hidden font-cinzel text-3xl tracking-wider text-accent/20 sm:inline">
                    01
                  </span>
                </div>
              </div>

              {/* Giant watermark */}
              <span
                className="pointer-events-none absolute bottom-2 right-10 select-none font-cinzel text-[11rem] leading-none text-accent/3 md:text-[15rem]"
                aria-hidden="true"
              >
                01
              </span>
            </div>
          </AnimatedReveal>
        </div>
      ) : null}

      {/* ══════ EXTRA LIVE GAMES (if any) ══════ */}
      {extraLiveGames.length > 0 ? (
        <div className="mx-auto max-w-6xl px-5 py-4 md:px-8">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {extraLiveGames.map((game, i) => (
              <LiveGameCard
                key={game.slug}
                game={game}
                index={i + 1}
                locale={locale}
              />
            ))}
          </div>
        </div>
      ) : null}

      {/* ══════ ORNAMENTAL DIVIDER ══════ */}
      <div
        className="mx-auto max-w-6xl px-5 py-6 md:px-8 md:py-8"
        aria-hidden="true"
      >
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-linear-to-r from-transparent to-accent/15" />
          <span className="font-cinzel text-[10px] tracking-[0.5em] text-accent/25">
            ✦
          </span>
          <div className="h-px flex-1 bg-linear-to-l from-transparent to-accent/15" />
        </div>
      </div>

      {/* ══════ COMING SOON ══════ */}
      <div className="mx-auto max-w-6xl px-5 pb-10 md:px-8 md:pb-14">
        <AnimatedReveal direction="up" delay={0.04}>
          <p className="text-[10px] uppercase tracking-[0.34em] text-accent md:text-xs">
            {t("grid_subtitle")}
          </p>
          <h2 className="heading-serif mt-4 text-3xl text-text-primary md:text-5xl">
            {t("grid_title")}
          </h2>
        </AnimatedReveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {upcomingGames.map((game, i) => (
            <ComingSoonCard
              key={game.slug}
              game={game}
              index={i + playableGames.length}
              locale={locale}
            />
          ))}
        </div>
      </div>

      {/* ══════ LIVE SCREEN PROMO ══════ */}
      <div className="mx-auto max-w-6xl px-5 pb-16 pt-4 md:px-8 md:pb-20">
        <AnimatedReveal direction="up">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-accent/12 bg-linear-to-br from-accent/8 via-accent/3 to-transparent p-8 shadow-[0_28px_70px_-40px_rgba(0,0,0,0.4)] md:p-10">
            {/* Glow blob */}
            <div className="pointer-events-none absolute -left-16 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full bg-accent/7 blur-3xl" />
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-accent/20 to-transparent" />

            <div className="relative z-10">
              <p className="text-[10px] uppercase tracking-[0.34em] text-accent md:text-xs">
                {tCommon("live_nav")}
              </p>
              <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
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
          </div>
        </AnimatedReveal>
      </div>
    </div>
  );
}
