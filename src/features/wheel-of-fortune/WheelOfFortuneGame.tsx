"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  WHEEL_OF_FORTUNE_SEGMENTS,
  type SupportedLocale,
  type WheelSegment,
} from "@/shared/config";
import { Button } from "@/shared/ui";
import type {
  GameApiErrorCode,
  PlayerSessionSnapshot,
  WheelSpinApiResponse,
} from "@/features/game-session";
import { cn } from "@/shared/lib";

const wheelEase = [0.22, 1, 0.36, 1] as const;
const wheelDurationSeconds = 4.6;
const segmentFills = [
  "color-mix(in srgb, var(--accent) 18%, var(--bg-secondary))",
  "color-mix(in srgb, var(--accent) 10%, var(--bg-primary))",
  "color-mix(in srgb, var(--accent) 24%, var(--bg-secondary))",
  "color-mix(in srgb, var(--accent) 14%, var(--bg-primary))",
  "color-mix(in srgb, var(--accent) 20%, var(--bg-secondary))",
  "color-mix(in srgb, var(--accent) 12%, var(--bg-primary))",
  "color-mix(in srgb, var(--accent) 26%, var(--bg-secondary))",
  "color-mix(in srgb, var(--accent) 16%, var(--bg-primary))",
] as const;
const legendAccentTones = [
  "bg-accent/14 border-accent/18",
  "bg-bg-primary/92 border-accent/14",
  "bg-accent/18 border-accent/18",
  "bg-bg-primary/92 border-accent/14",
  "bg-accent/14 border-accent/18",
  "bg-bg-primary/92 border-accent/14",
  "bg-accent/18 border-accent/18",
  "bg-bg-primary/92 border-accent/14",
] as const;

interface WheelOfFortuneGameProps {
  session: PlayerSessionSnapshot;
  onPlayerUpdate: (session: PlayerSessionSnapshot) => void;
}

function resolveWheelError(
  errorCode: GameApiErrorCode | null,
  t: ReturnType<typeof useTranslations>
) {
  if (!errorCode) {
    return null;
  }

  if (errorCode === "SUPABASE_NOT_CONFIGURED") {
    return t("errors.storage_unavailable");
  }

  return t("errors.generic");
}

function polarToCartesian(radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: 50 + radius * Math.cos(angleInRadians),
    y: 50 + radius * Math.sin(angleInRadians),
  };
}

function describeSlice(startAngle: number, endAngle: number) {
  const start = polarToCartesian(49, endAngle);
  const end = polarToCartesian(49, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  return [
    "M 50 50",
    `L ${start.x} ${start.y}`,
    `A 49 49 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

async function readApiErrorCode(response: Response) {
  try {
    const payload = (await response.json()) as { code?: GameApiErrorCode };
    return payload.code ?? "PERSISTENCE_ERROR";
  } catch {
    return "PERSISTENCE_ERROR";
  }
}

function buildWheelRotation(
  currentRotation: number,
  selectedIndex: number,
  segmentAngle: number
) {
  const normalizedRotation = ((currentRotation % 360) + 360) % 360;
  const targetAngle = selectedIndex * segmentAngle + segmentAngle / 2;
  const angleDelta =
    (360 - targetAngle - normalizedRotation + 360) % 360;

  return currentRotation + 5 * 360 + angleDelta;
}

export function WheelOfFortuneGame({
  session,
  onPlayerUpdate,
}: WheelOfFortuneGameProps) {
  const locale = useLocale() as SupportedLocale;
  const t = useTranslations("WheelOfFortune");
  const tCommon = useTranslations("GamesCommon");
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeResult, setActiveResult] = useState<WheelSegment | null>(null);
  const [recentResults, setRecentResults] = useState<WheelSegment[]>([]);
  const [errorCode, setErrorCode] = useState<GameApiErrorCode | null>(null);
  const spinTimeoutRef = useRef<number | null>(null);

  const segmentAngle = 360 / WHEEL_OF_FORTUNE_SEGMENTS.length;
  const wheelError = resolveWheelError(errorCode, t);

  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) {
        window.clearTimeout(spinTimeoutRef.current);
      }
    };
  }, []);

  async function persistSpinResult(segment: WheelSegment) {
    setIsSaving(true);
    const response = await fetch("/api/games/wheel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playerId: session.playerId,
        segmentId: segment.id,
        locale,
      }),
    });

    if (!response.ok) {
      setErrorCode(await readApiErrorCode(response));
      setIsSaving(false);
      return;
    }

    const payload = (await response.json()) as WheelSpinApiResponse;
    onPlayerUpdate(payload.player);
    setIsSaving(false);
  }

  function handleSpin() {
    if (isSpinning || isSaving) {
      return;
    }

    const selectedIndex = Math.floor(
      Math.random() * WHEEL_OF_FORTUNE_SEGMENTS.length
    );
    const selectedSegment = WHEEL_OF_FORTUNE_SEGMENTS[selectedIndex];
    const nextRotation = buildWheelRotation(
      rotation,
      selectedIndex,
      segmentAngle
    );

    setErrorCode(null);
    setActiveResult(null);
    setIsSpinning(true);
    setRotation(nextRotation);

    spinTimeoutRef.current = window.setTimeout(() => {
      setIsSpinning(false);
      setActiveResult(selectedSegment);
      setRecentResults((currentResults) =>
        [selectedSegment, ...currentResults].slice(0, 3)
      );
      void persistSpinResult(selectedSegment);
    }, wheelDurationSeconds * 1000);
  }

  const wheelLegend = (
    <div className="rounded-4xl border border-accent/12 bg-bg-primary/55 p-5 shadow-[0_22px_60px_-46px_rgba(0,0,0,0.4)] md:p-6">
      <p className="text-[10px] uppercase tracking-[0.28em] text-accent">
        {t("legend_label")}
      </p>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-secondary">
        {tCommon("results_saved")}
      </p>

      <div className="mt-5 grid gap-3 xl:grid-cols-2">
        {WHEEL_OF_FORTUNE_SEGMENTS.map((segment, index) => (
          <div
            key={segment.id}
            className={cn(
              "flex items-start justify-between gap-4 rounded-3xl border px-4 py-4 md:px-5",
              legendAccentTones[index % legendAccentTones.length]
            )}
          >
            <div className="flex min-w-0 items-start gap-4">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent/18 bg-bg-secondary font-cinzel text-sm text-text-primary">
                {(index + 1).toString().padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-lg leading-tight font-medium text-text-primary">
                  {segment.label[locale]}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-text-secondary">
                  {segment.type === "question"
                    ? t("question_badge")
                    : t("task_badge")}
                </p>
              </div>
            </div>
            <span className="shrink-0 pt-1 text-[11px] uppercase tracking-[0.18em] text-text-secondary">
              +{segment.points} {tCommon("points_unit")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const stageCardClass =
    "rounded-[2.5rem] border border-accent/12 bg-bg-primary/60 p-6 shadow-[0_26px_70px_-54px_rgba(0,0,0,0.45)] md:p-8";

  return (
    <div className="space-y-6">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className={stageCardClass}>
          <div className="grid gap-8 xl:grid-cols-[minmax(240px,0.52fr)_minmax(0,1fr)] xl:items-center">
            <div className="max-w-md">
              <p className="text-[10px] uppercase tracking-[0.34em] text-accent md:text-xs">
                {t("eyebrow")}
              </p>
              <h2 className="heading-serif mt-4 text-3xl leading-[0.94] text-text-primary md:text-4xl">
                {t("title")}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-text-secondary md:text-base">
                {t("description")}
              </p>

              <div className="mt-6 flex flex-col gap-4">
                <Button
                  type="button"
                  size="lg"
                  onClick={handleSpin}
                  disabled={isSpinning || isSaving}
                  className="min-w-50 md:min-w-60"
                >
                  {isSpinning ? t("spinning_cta") : t("spin_cta")}
                </Button>

                <p className="text-xs uppercase tracking-[0.24em] text-text-secondary">
                  {isSaving ? t("saving_result") : tCommon("results_saved")}
                </p>
              </div>
            </div>

            <div className="flex flex-1 flex-col items-center">
              <div className="relative">
                <div className="absolute left-1/2 -top-2 z-20 -translate-x-1/2">
                  <div className="h-0 w-0 border-x-18 border-b-28 border-x-transparent border-b-accent drop-shadow-[0_10px_20px_rgba(0,0,0,0.18)]" />
                </div>

                <div className="relative aspect-square w-full max-w-84 rounded-full border border-accent/24 bg-bg-primary p-3 shadow-[0_24px_70px_-36px_rgba(0,0,0,0.55)] md:max-w-[25rem]">
                  <div className="absolute inset-0 rounded-full bg-linear-to-br from-accent/8 via-transparent to-accent/10" />

                  <motion.div
                    animate={{ rotate: rotation }}
                    transition={{
                      duration: wheelDurationSeconds,
                      ease: wheelEase,
                    }}
                    className="relative h-full w-full"
                    style={{ willChange: "transform" }}
                  >
                    <svg viewBox="0 0 100 100" className="h-full w-full">
                      {WHEEL_OF_FORTUNE_SEGMENTS.map((segment, index) => {
                        const startAngle = index * segmentAngle;
                        const endAngle = (index + 1) * segmentAngle;
                        const midAngle = startAngle + segmentAngle / 2;
                        const numberPosition = polarToCartesian(34, midAngle);

                        return (
                          <g key={segment.id}>
                            <path
                              d={describeSlice(startAngle, endAngle)}
                              style={{
                                fill: segmentFills[index % segmentFills.length],
                              }}
                              stroke="color-mix(in srgb, var(--accent) 26%, transparent)"
                              strokeWidth="0.9"
                            />
                            <text
                              x={numberPosition.x}
                              y={numberPosition.y}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fill="var(--text-primary)"
                              fontSize="9"
                              fontWeight="600"
                              className="font-cinzel"
                            >
                              {(index + 1).toString().padStart(2, "0")}
                            </text>
                          </g>
                        );
                      })}

                      <circle
                        cx="50"
                        cy="50"
                        r="10.5"
                        fill="var(--bg-primary)"
                        stroke="color-mix(in srgb, var(--accent) 38%, transparent)"
                        strokeWidth="1.1"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="4.5"
                        fill="var(--accent)"
                        opacity="0.78"
                      />
                    </svg>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.75rem] border border-accent/12 bg-accent/[0.07] p-5">
            <p className="text-[10px] uppercase tracking-[0.28em] text-accent">
              {t("result_label")}
            </p>

            {activeResult ? (
              <div className="mt-4">
                <span
                  className={cn(
                    "inline-flex rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.22em]",
                    activeResult.type === "question"
                      ? "border-accent/24 bg-accent/10 text-accent"
                      : "border-accent/20 bg-bg-primary/80 text-text-primary"
                  )}
                >
                  {activeResult.type === "question"
                    ? t("question_badge")
                    : t("task_badge")}
                </span>
                <h3 className="heading-serif mt-4 text-2xl text-text-primary">
                  {activeResult.prompt[locale]}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {t("points_awarded", { points: activeResult.points })}
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                {t("empty_state")}
              </p>
            )}

            {wheelError ? (
              <p className="mt-4 rounded-2xl border border-accent/16 bg-bg-primary/65 px-4 py-3 text-sm text-text-secondary">
                {wheelError}
              </p>
            ) : null}
          </div>

          <div className="rounded-[1.75rem] border border-accent/12 bg-bg-primary/50 p-5">
            <p className="text-[10px] uppercase tracking-[0.28em] text-accent">
              {t("rules_label")}
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-text-secondary">
              <li>{t("rule_one")}</li>
              <li>{t("rule_two")}</li>
              <li>{t("rule_three")}</li>
            </ul>
          </div>

          <div className="rounded-[1.75rem] border border-accent/12 bg-bg-primary/50 p-5">
            <p className="text-[10px] uppercase tracking-[0.28em] text-accent">
              {t("recent_label")}
            </p>
            {recentResults.length > 0 ? (
              <div className="mt-4 space-y-3">
                {recentResults.map((segment) => (
                  <div
                    key={`${segment.id}-${segment.prompt[locale]}`}
                    className="rounded-2xl border border-accent/12 bg-bg-primary/70 px-4 py-3"
                  >
                    <p className="text-sm text-text-primary">
                      {segment.prompt[locale]}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-text-secondary">
                      +{segment.points} {tCommon("points_unit")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                {t("recent_empty")}
              </p>
            )}
          </div>
        </div>
      </div>

      {wheelLegend}
    </div>
  );
}
