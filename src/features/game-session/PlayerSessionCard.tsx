"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button, Input, Label } from "@/shared/ui";
import { cn } from "@/shared/lib";
import type { GameApiErrorCode, PlayerSessionSnapshot } from "./types";

interface PlayerSessionCardProps {
  session: PlayerSessionSnapshot | null;
  isHydrating: boolean;
  isSaving: boolean;
  errorCode: GameApiErrorCode | null;
  onSave: (nickname: string) => Promise<PlayerSessionSnapshot | null>;
  onClear: () => void;
  compact?: boolean;
  className?: string;
}

function resolveErrorMessage(
  errorCode: GameApiErrorCode | null,
  t: ReturnType<typeof useTranslations>
) {
  if (!errorCode) {
    return null;
  }

  if (errorCode === "SUPABASE_NOT_CONFIGURED") {
    return t("errors.storage_unavailable");
  }

  if (errorCode === "PLAYER_NOT_FOUND") {
    return t("errors.session_missing");
  }

  return t("errors.generic");
}

export function PlayerSessionCard({
  session,
  isHydrating,
  isSaving,
  errorCode,
  onSave,
  onClear,
  compact = false,
  className,
}: PlayerSessionCardProps) {
  const t = useTranslations("GamesSession");
  const [nickname, setNickname] = useState(session?.nickname ?? "");
  const [isEditing, setIsEditing] = useState(false);

  const errorMessage = resolveErrorMessage(errorCode, t);
  const isSummaryVisible = session && !isEditing;
  const cardClass = cn(
    "relative overflow-hidden rounded-4xl border border-accent/14 bg-bg-primary/55 p-6 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.45)] md:p-8",
    compact && "p-5 md:p-6",
    className
  );
  const chrome = (
    <>
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-accent/35 to-transparent" />
      <div className="pointer-events-none absolute -right-8 top-8 h-24 w-24 rounded-full bg-accent/8 blur-3xl" />
    </>
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedNickname = nickname.trim().replace(/\s+/g, " ");
    const savedSession = await onSave(normalizedNickname);

    if (savedSession) {
      setNickname(savedSession.nickname);
      setIsEditing(false);
    }
  }

  if (isHydrating) {
    return (
      <div className={cardClass}>
        {chrome}
        <div className="relative z-10 space-y-3 animate-pulse">
          <div className="h-3 w-24 rounded-full bg-accent/20" />
          <div className="h-8 w-48 rounded-full bg-accent/12" />
          <div className="h-4 w-full rounded-full bg-accent/10" />
          <div className="h-4 w-3/4 rounded-full bg-accent/10" />
        </div>
      </div>
    );
  }

  if (isSummaryVisible) {
    return (
      <div className={cardClass}>
        {chrome}
        <div className="relative z-10">
          <p className="text-[10px] uppercase tracking-[0.34em] text-accent md:text-xs">
            {t("playing_as_label")}
          </p>

          {/* Name + points */}
          <div className="mt-4 flex items-end justify-between gap-4">
            <h2
              className={cn(
                "heading-serif min-w-0 truncate leading-[0.94] text-text-primary",
                compact ? "text-3xl" : "text-4xl"
              )}
              title={session.nickname}
            >
              {session.nickname}
            </h2>
            <div className="shrink-0 text-right">
              <p
                className={cn(
                  "font-cinzel leading-none text-text-primary",
                  compact ? "text-3xl" : "text-4xl"
                )}
              >
                {session.totalPoints}
              </p>
              <p className="mt-1.5 text-[10px] uppercase tracking-[0.28em] text-accent">
                {t("points_label")}
              </p>
            </div>
          </div>

          {/* Thin divider + status inline */}
          <div className="mt-5 border-t border-accent/10 pt-4">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-2 w-2 shrink-0 rounded-full bg-accent shadow-[0_0_0_5px_rgba(var(--accent-rgb,180,140,100),0.1)]" />
              <p className="text-sm text-text-secondary">
                {t("status_ready")}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 flex items-center gap-4">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setNickname(session.nickname);
                setIsEditing(true);
              }}
            >
              {t("edit_cta")}
            </Button>

            <button
              type="button"
              onClick={() => {
                onClear();
                setNickname("");
                setIsEditing(false);
              }}
              className="text-sm text-text-secondary transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
            >
              {t("reset_cta")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cardClass}>
      {chrome}
      <div className="relative z-10">
        <p className="text-[10px] uppercase tracking-[0.34em] text-accent md:text-xs">
          {session ? t("edit_label") : t("new_label")}
        </p>
        <h2 className="heading-serif mt-4 text-3xl text-text-primary md:text-4xl">
          {session ? t("edit_title") : t("new_title")}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary md:text-base">
          {session ? t("edit_note") : t("new_note")}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="player-nickname">{t("nickname_label")}</Label>
            <Input
              id="player-nickname"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              placeholder={t("nickname_placeholder")}
              minLength={2}
              maxLength={40}
              autoComplete="nickname"
              disabled={isSaving}
            />
          </div>

          {errorMessage ? (
            <p className="rounded-2xl border border-accent/18 bg-bg-primary/70 px-4 py-3 text-sm text-text-secondary">
              {errorMessage}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button
              type="submit"
              size={compact ? "sm" : "md"}
              disabled={isSaving || nickname.trim().length < 2}
            >
              {isSaving
                ? t("saving_cta")
                : session
                  ? t("update_cta")
                  : t("save_cta")}
            </Button>

            {session ? (
              <Button
                type="button"
                variant="ghost"
                size={compact ? "sm" : "md"}
                onClick={() => {
                  setIsEditing(false);
                  setNickname(session.nickname);
                }}
              >
                {t("cancel_cta")}
              </Button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}
