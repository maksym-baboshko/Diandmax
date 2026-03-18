"use client";

import {
  startTransition,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import type {
  LeaderboardEntrySnapshot,
  LiveFeedEventSnapshot,
  LivePageApiResponse,
} from "@/features/game-session";
import { getSupabaseBrowserClient } from "@/features/game-session";
import type { SupportedLocale } from "@/shared/config";
import { cn } from "@/shared/lib";

const HERO_EVENT_DURATION_MS = 5000;
const LIVE_SNAPSHOT_URL = "/api/live?leaderboardLimit=10&feedLimit=5";

function getAvatarMonogram(avatarKey: string | null, fallbackName?: string | null) {
  const normalizedKey = avatarKey?.trim();

  if (normalizedKey) {
    return normalizedKey
      .split("-")
      .map((part) => part.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  }

  return fallbackName?.trim().charAt(0).toUpperCase() ?? "•";
}

function formatEventTime(value: string, locale: SupportedLocale) {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getEventPrompt(
  event: LiveFeedEventSnapshot,
  fallbackLocale: SupportedLocale
) {
  const eventLocale = event.locale ?? fallbackLocale;
  return eventLocale === "uk" ? event.promptI18n.uk : event.promptI18n.en;
}

function getHeroLabelKey(eventType: LiveFeedEventSnapshot["eventType"]) {
  switch (eventType) {
    case "wheel.round.promised":
      return "hero_promised";
    case "leaderboard.new_top_player":
      return "hero_new_top_player";
    case "player.joined":
      return "event_player_joined";
    case "xp.awarded":
      return "event_xp_awarded";
  }
}

function getEventLabelKey(eventType: LiveFeedEventSnapshot["eventType"]) {
  switch (eventType) {
    case "player.joined":
      return "event_player_joined";
    case "xp.awarded":
      return "event_xp_awarded";
    case "wheel.round.promised":
      return "event_promised";
    case "leaderboard.new_top_player":
      return "event_new_top_player";
  }
}

function FeedEventCard({
  event,
  locale,
}: {
  event: LiveFeedEventSnapshot;
  locale: SupportedLocale;
}) {
  const t = useTranslations("LivePage");
  const prompt = getEventPrompt(event, locale);
  const timestamp = formatEventTime(event.createdAt, locale);

  return (
    <div className="rounded-3xl border border-accent/10 bg-bg-primary/65 p-5 shadow-[0_24px_48px_-36px_rgba(0,0,0,0.6)] backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-accent/20 bg-accent/10 font-cinzel text-sm tracking-[0.16em] text-accent">
            {getAvatarMonogram(event.avatarKey, event.playerName)}
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.26em] text-accent">
              {t(getEventLabelKey(event.eventType))}
            </p>
            <p className="mt-1 text-lg text-text-primary">
              {event.playerName ?? t("anonymous_player")}
            </p>
          </div>
        </div>
        <p className="text-[10px] uppercase tracking-[0.22em] text-text-secondary/55">
          {timestamp}
        </p>
      </div>

      {event.eventType === "player.joined" ? (
        <p className="mt-4 text-base leading-relaxed text-text-secondary">
          {event.welcomeText ?? t("welcome_default")}
        </p>
      ) : null}

      {event.eventType === "xp.awarded" ? (
        <p className="mt-4 font-cinzel text-4xl text-accent">
          +{event.xpDelta ?? 0}
          <span className="ml-2 text-sm uppercase tracking-[0.2em] text-text-secondary/60">
            XP
          </span>
        </p>
      ) : null}

      {event.eventType === "wheel.round.promised" ? (
        <div className="mt-4 space-y-3">
          {prompt ? (
            <p className="heading-serif text-2xl leading-snug text-text-primary">
              {prompt}
            </p>
          ) : null}
          {event.answerText ? (
            <p className="rounded-2xl border border-accent/10 bg-bg-secondary/40 px-4 py-3 text-sm leading-relaxed text-text-secondary">
              {event.answerText}
            </p>
          ) : null}
        </div>
      ) : null}

      {event.eventType === "leaderboard.new_top_player" ? (
        <p className="mt-4 text-base leading-relaxed text-text-secondary">
          {t("new_top_player_note")}
        </p>
      ) : null}
    </div>
  );
}

function LeaderboardRow({
  entry,
  isLeader,
}: {
  entry: LeaderboardEntrySnapshot;
  isLeader: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors duration-200",
        isLeader
          ? "border-accent/22 bg-accent/10"
          : "border-accent/8 bg-bg-primary/55"
      )}
    >
      <div className="w-8 shrink-0 text-center font-cinzel text-lg text-accent">
        {entry.rank}
      </div>
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-accent/18 bg-accent/8 font-cinzel text-xs tracking-[0.16em] text-accent">
        {getAvatarMonogram(entry.avatarKey, entry.nickname)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-text-primary">{entry.nickname}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="font-cinzel text-xl text-text-primary">{entry.totalPoints}</p>
        <p className="text-[9px] uppercase tracking-[0.2em] text-text-secondary/50">
          XP
        </p>
      </div>
    </div>
  );
}

export function LiveProjectorPage() {
  const locale = useLocale() as SupportedLocale;
  const t = useTranslations("LivePage");
  const [snapshot, setSnapshot] = useState<LivePageApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [heroEvent, setHeroEvent] = useState<LiveFeedEventSnapshot | null>(null);
  const heroTimeoutRef = useRef<number | null>(null);
  const lastSeenFeedIdRef = useRef<string | null>(null);
  const hasLoadedOnceRef = useRef(false);

  const queueHeroEvent = useEffectEvent((nextHeroEvent: LiveFeedEventSnapshot) => {
    setHeroEvent(nextHeroEvent);

    if (heroTimeoutRef.current) {
      window.clearTimeout(heroTimeoutRef.current);
    }

    heroTimeoutRef.current = window.setTimeout(() => {
      setHeroEvent(null);
      heroTimeoutRef.current = null;
    }, HERO_EVENT_DURATION_MS);
  });

  const loadSnapshot = useEffectEvent(async () => {
    try {
      const response = await fetch(LIVE_SNAPSHOT_URL, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        setError(true);
        setIsLoading(false);
        return;
      }

      const nextSnapshot = (await response.json()) as LivePageApiResponse;
      const latestFeedEvent = nextSnapshot.feed[0] ?? null;

      startTransition(() => {
        setSnapshot(nextSnapshot);
        setError(false);
        setIsLoading(false);
      });

      if (
        hasLoadedOnceRef.current &&
        latestFeedEvent?.isHeroEvent &&
        latestFeedEvent.id !== lastSeenFeedIdRef.current
      ) {
        queueHeroEvent(latestFeedEvent);
      }

      lastSeenFeedIdRef.current = latestFeedEvent?.id ?? null;
      hasLoadedOnceRef.current = true;
    } catch {
      setError(true);
      setIsLoading(false);
    }
  });

  useEffect(() => {
    void loadSnapshot();

    return () => {
      if (heroTimeoutRef.current) {
        window.clearTimeout(heroTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    try {
      const supabase = getSupabaseBrowserClient();
      const channel = supabase
        .channel(`live-projector-${locale}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "activity_events" },
          () => {
            void loadSnapshot();
          }
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "xp_transactions" },
          () => {
            void loadSnapshot();
          }
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "player_profiles" },
          () => {
            void loadSnapshot();
          }
        )
        .subscribe();

      return () => {
        void supabase.removeChannel(channel);
      };
    } catch {
      return undefined;
    }
  }, [locale]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-bg-primary text-text-primary">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--accent)_12%,transparent),transparent_38%),radial-gradient(circle_at_bottom_right,color-mix(in_srgb,var(--accent)_10%,transparent),transparent_34%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1600px] flex-col px-4 py-4 md:px-6 md:py-6">
        <div className="mb-4 flex items-end justify-between gap-6 rounded-4xl border border-accent/10 bg-bg-primary/55 px-6 py-5 shadow-[0_28px_72px_-48px_rgba(0,0,0,0.7)] backdrop-blur-sm">
          <div>
            <p className="text-[10px] uppercase tracking-[0.34em] text-accent">
              {t("eyebrow")}
            </p>
            <h1 className="heading-serif mt-3 text-4xl leading-none text-text-primary md:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-secondary md:text-base">
              {t("description")}
            </p>
          </div>

          <div className="hidden rounded-2xl border border-accent/12 bg-bg-secondary/35 px-4 py-3 text-right lg:block">
            <p className="text-[10px] uppercase tracking-[0.24em] text-text-secondary/55">
              {t("leaderboard_label")}
            </p>
            <p className="mt-2 font-cinzel text-3xl text-accent">Top 10</p>
          </div>
        </div>

        <div className="grid flex-1 gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.9fr)]">
          <div className="rounded-4xl border border-accent/10 bg-bg-primary/50 p-5 shadow-[0_32px_80px_-56px_rgba(0,0,0,0.75)] backdrop-blur-sm md:p-6">
            <div className="mb-4 flex items-center gap-4">
              <p className="text-[10px] uppercase tracking-[0.32em] text-accent">
                {t("feed_label")}
              </p>
              <span className="h-px flex-1 bg-linear-to-r from-accent/25 to-transparent" />
            </div>

            {isLoading ? (
              <div className="grid gap-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-32 animate-pulse rounded-3xl border border-accent/8 bg-bg-secondary/25"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="flex h-full min-h-64 items-center justify-center rounded-3xl border border-accent/10 bg-bg-secondary/25 px-6 text-center text-base text-text-secondary">
                {t("feed_error")}
              </div>
            ) : snapshot?.feed.length ? (
              <div className="grid gap-3">
                {snapshot.feed.map((event) => (
                  <FeedEventCard key={event.id} event={event} locale={locale} />
                ))}
              </div>
            ) : (
              <div className="flex h-full min-h-64 items-center justify-center rounded-3xl border border-accent/10 bg-bg-secondary/25 px-6 text-center text-base text-text-secondary">
                {t("feed_empty")}
              </div>
            )}
          </div>

          <div className="rounded-4xl border border-accent/10 bg-bg-primary/50 p-5 shadow-[0_32px_80px_-56px_rgba(0,0,0,0.75)] backdrop-blur-sm md:p-6">
            <div className="mb-4 flex items-center gap-4">
              <p className="text-[10px] uppercase tracking-[0.32em] text-accent">
                {t("leaderboard_label")}
              </p>
              <span className="h-px flex-1 bg-linear-to-r from-accent/25 to-transparent" />
            </div>

            {isLoading ? (
              <div className="grid gap-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-16 animate-pulse rounded-2xl border border-accent/8 bg-bg-secondary/25"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="flex min-h-64 items-center justify-center rounded-3xl border border-accent/10 bg-bg-secondary/25 px-6 text-center text-base text-text-secondary">
                {t("leaderboard_error")}
              </div>
            ) : snapshot?.leaderboard.length ? (
              <div className="grid gap-3">
                {snapshot.leaderboard.map((entry) => (
                  <LeaderboardRow
                    key={entry.playerId}
                    entry={entry}
                    isLeader={entry.rank === 1}
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-64 items-center justify-center rounded-3xl border border-accent/10 bg-bg-secondary/25 px-6 text-center text-base text-text-secondary">
                {t("leaderboard_empty")}
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {heroEvent ? (
          <motion.div
            key={heroEvent.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-[rgba(9,12,17,0.94)] backdrop-blur-lg"
          >
            <div className="mx-auto max-w-4xl px-6 text-center">
              <p className="text-[10px] uppercase tracking-[0.38em] text-accent">
                {t(getHeroLabelKey(heroEvent.eventType))}
              </p>
              <div className="mt-8 flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border border-accent/24 bg-accent/10 font-cinzel text-3xl tracking-[0.16em] text-accent">
                  {getAvatarMonogram(heroEvent.avatarKey, heroEvent.playerName)}
                </div>
              </div>
              <h2 className="heading-serif mt-8 text-5xl leading-[0.92] text-text-primary md:text-7xl">
                {heroEvent.playerName ?? t("anonymous_player")}
              </h2>

              {heroEvent.eventType === "wheel.round.promised" ? (
                <div className="mt-6 space-y-4">
                  {getEventPrompt(heroEvent, locale) ? (
                    <p className="text-xl leading-relaxed text-text-primary/95 md:text-2xl">
                      {getEventPrompt(heroEvent, locale)}
                    </p>
                  ) : null}
                  {heroEvent.answerText ? (
                    <p className="mx-auto max-w-3xl rounded-3xl border border-accent/12 bg-bg-secondary/35 px-5 py-4 text-base leading-relaxed text-text-secondary md:text-lg">
                      {heroEvent.answerText}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {heroEvent.eventType === "leaderboard.new_top_player" ? (
                <p className="mt-6 text-xl leading-relaxed text-text-secondary md:text-2xl">
                  {t("new_top_player_note")}
                </p>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
