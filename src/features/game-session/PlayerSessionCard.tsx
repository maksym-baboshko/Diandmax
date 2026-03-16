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
  const tCommon = useTranslations("GamesCommon");
  const [nickname, setNickname] = useState(session?.nickname ?? "");
  const [isEditing, setIsEditing] = useState(false);

  const errorMessage = resolveErrorMessage(errorCode, t);
  const isSummaryVisible = session && !isEditing;

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
      <div
        className={cn(
          "rounded-[2rem] border border-accent/18 bg-bg-secondary/60 p-6 shadow-lg shadow-accent/8 md:p-8",
          compact && "rounded-[1.75rem] p-5",
          className
        )}
      >
        <div className="space-y-3 animate-pulse">
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
      <div
        className={cn(
          "rounded-[2rem] border border-accent/18 bg-bg-secondary/70 p-6 shadow-lg shadow-accent/8 md:p-8",
          compact && "rounded-[1.75rem] p-5",
          className
        )}
      >
        <p className="text-[10px] uppercase tracking-[0.34em] text-accent md:text-xs">
          {t("playing_as_label")}
        </p>
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="heading-serif text-3xl text-text-primary md:text-4xl">
              {session.nickname}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary md:text-base">
              {compact ? t("compact_note") : t("saved_note")}
            </p>
          </div>

          <div className="rounded-full border border-accent/20 bg-bg-primary/80 px-5 py-3 text-left md:text-center">
            <span className="block text-[10px] uppercase tracking-[0.28em] text-accent">
              {t("points_label")}
            </span>
            <span className="mt-1 block font-cinzel text-2xl text-text-primary">
              {session.totalPoints}
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            type="button"
            variant="secondary"
            size={compact ? "sm" : "md"}
            onClick={() => {
              setNickname(session.nickname);
              setIsEditing(true);
            }}
          >
            {t("edit_cta")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size={compact ? "sm" : "md"}
            onClick={() => {
              onClear();
              setNickname("");
              setIsEditing(false);
            }}
          >
            {t("reset_cta")}
          </Button>
          {!compact ? (
            <span className="inline-flex items-center rounded-full border border-accent/16 px-4 py-2 text-xs uppercase tracking-[0.22em] text-text-secondary">
              {tCommon("tap_ready")}
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-[2rem] border border-accent/18 bg-bg-secondary/70 p-6 shadow-lg shadow-accent/8 md:p-8",
        compact && "rounded-[1.75rem] p-5",
        className
      )}
    >
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
          <p className="rounded-2xl border border-accent/18 bg-bg-primary/75 px-4 py-3 text-sm text-text-secondary">
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
  );
}
