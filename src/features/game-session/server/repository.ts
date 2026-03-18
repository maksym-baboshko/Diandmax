import "server-only";

import type { GameSlug, SupportedLocale } from "@/shared/config";
import type {
  GameLeaderboardSnapshot,
  LeaderboardEntrySnapshot,
  LiveFeedEventSnapshot,
  LocalizedTextSnapshot,
  PlayerSessionSnapshot,
  WheelRoundResolution,
  WheelRoundResolutionReason,
  WheelRoundSnapshot,
  WheelRoundTimerSnapshot,
} from "../types";
import type {
  GameRoundRow,
  GameSessionRow,
  JsonValue,
  LeaderboardGameViewRow,
  LeaderboardGlobalViewRow,
  LiveFeedViewRow,
  PlayerProfileRow,
  WheelCategoryRow,
  WheelPlayerTaskHistoryRow,
  WheelRoundAssignmentRow,
  WheelRoundPayload,
  WheelTaskRow,
} from "./types";
import { getSupabaseAdminClient } from "./supabase";

const WHEEL_GAME_SLUG = "wheel-of-fortune";
const MIN_TEXT_RESPONSE_LENGTH = 10;

const LEADERBOARD_GLOBAL_SELECT =
  "player_id, nickname, avatar_key, total_points, last_scored_at, onboarding_completed, created_at, updated_at, last_seen_at, score_reached_at, rank";
const LEADERBOARD_GAME_SELECT =
  "player_id, game_slug, nickname, avatar_key, total_points, last_scored_at, onboarding_completed, score_reached_at, rank";
const PLAYER_PROFILE_SELECT =
  "id, display_name, display_name_normalized, avatar_key, locale, onboarding_completed, created_at, updated_at, last_seen_at";
const GAME_SESSION_SELECT =
  "id, player_id, game_slug, status, current_cycle, total_rounds, resolved_rounds, last_round_started_at, last_round_resolved_at, metadata, created_at, updated_at";
const GAME_ROUND_SELECT =
  "id, session_id, player_id, game_slug, status, started_at, resolved_at, resolution, resolution_reason, timer_status, timer_duration_seconds, timer_remaining_seconds, timer_last_started_at, timer_last_paused_at, timer_last_sync_at, response_payload, metadata";
const WHEEL_CATEGORY_SELECT =
  "id, slug, sort_order, weight, title_i18n, description_i18n, is_active, created_at, updated_at";
const WHEEL_TASK_SELECT =
  "id, category_id, task_key, interaction_type, response_mode, execution_mode, allow_promise, allow_early_completion, difficulty, prompt_i18n, details_i18n, base_xp, promise_xp, skip_penalty_xp, timeout_penalty_xp, timer_seconds, feed_safe, requires_other_guest, phone_allowed, public_speaking, physical_contact_level, couple_centric, is_active, metadata, created_at, updated_at";
const WHEEL_ASSIGNMENT_SELECT =
  "round_id, category_id, task_id, spin_angle, cycle_number, selection_rank, created_at";
const LIVE_FEED_SELECT =
  "id, session_id, player_id, game_slug, round_id, event_type, visibility, payload, snapshot_name, snapshot_avatar_key, snapshot_prompt_i18n, snapshot_answer_text, snapshot_xp_delta, is_hero_event, created_at";

export class PlayerProfileNotReadyError extends Error {
  constructor() {
    super("The player profile is not ready yet.");
    this.name = "PlayerProfileNotReadyError";
  }
}

export class WheelTasksDepletedError extends Error {
  constructor() {
    super("No wheel tasks remain for this player.");
    this.name = "WheelTasksDepletedError";
  }
}

export class WheelRoundNotFoundError extends Error {
  constructor() {
    super("The wheel round was not found.");
    this.name = "WheelRoundNotFoundError";
  }
}

export class WheelRoundAlreadyResolvedError extends Error {
  constructor() {
    super("The wheel round is already resolved.");
    this.name = "WheelRoundAlreadyResolvedError";
  }
}

export class InvalidWheelRoundResponseError extends Error {
  constructor() {
    super("The wheel round response is invalid.");
    this.name = "InvalidWheelRoundResponseError";
  }
}

export class InvalidWheelRoundStateError extends Error {
  constructor() {
    super("The wheel round state is invalid.");
    this.name = "InvalidWheelRoundStateError";
  }
}

const PLAYER_AVATAR_KEYS = [
  "olive-branch",
  "golden-bell",
  "cedar-leaf",
  "quiet-dove",
  "linen-ribbon",
  "warm-candle",
  "harbor-light",
  "north-star",
] as const;

type JsonObject = Record<string, JsonValue | undefined>;

function hashString(value: string) {
  let hash = 0;

  for (const char of value) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0;
  }

  return Math.abs(hash);
}

function getAvatarKeyForPlayer(playerId: string) {
  return PLAYER_AVATAR_KEYS[hashString(playerId) % PLAYER_AVATAR_KEYS.length];
}

function normalizeDisplayName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeOptionalResponseText(value?: string | null) {
  const normalized = value?.trim().replace(/\s+/g, " ") ?? "";
  return normalized.length > 0 ? normalized : null;
}

function hasMeaningfulTextResponse(value: string | null) {
  if (!value || value.length < MIN_TEXT_RESPONSE_LENGTH) {
    return false;
  }

  const wordMatches = value.match(/\p{L}[\p{L}\p{N}'’-]*/gu) ?? [];
  const symbolMatches = value.match(/[\p{L}\p{N}]/gu) ?? [];

  return wordMatches.length >= 2 && symbolMatches.length >= MIN_TEXT_RESPONSE_LENGTH;
}

function asJsonObject(value: unknown): JsonObject {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as JsonObject;
  }

  return {};
}

function mapPlayerSnapshot(row: LeaderboardGlobalViewRow): PlayerSessionSnapshot {
  return {
    playerId: row.player_id,
    nickname: row.nickname ?? "",
    avatarKey: row.avatar_key,
    totalPoints: row.total_points,
  };
}

function mapLeaderboardEntry(
  row: LeaderboardGlobalViewRow | LeaderboardGameViewRow
): LeaderboardEntrySnapshot {
  return {
    playerId: row.player_id,
    nickname: row.nickname ?? "",
    avatarKey: row.avatar_key,
    totalPoints: row.total_points,
    rank: row.rank,
  };
}

function readLocalizedText(
  value: unknown,
  locale: SupportedLocale,
  fallback: string
) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const localizedRecord = value as Record<string, unknown>;
    const exact = localizedRecord[locale];
    if (typeof exact === "string" && exact.trim().length > 0) {
      return exact;
    }

    const alternateLocale = locale === "uk" ? "en" : "uk";
    const alternate = localizedRecord[alternateLocale];
    if (typeof alternate === "string" && alternate.trim().length > 0) {
      return alternate;
    }
  }

  return fallback;
}

function readLocalizedTextSnapshot(value: unknown, fallback: string) {
  return {
    uk: readLocalizedText(value, "uk", fallback),
    en: readLocalizedText(value, "en", fallback),
  } satisfies Record<SupportedLocale, string>;
}

function readOptionalLocalizedTextSnapshot(value: unknown): LocalizedTextSnapshot {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const localizedRecord = value as Record<string, unknown>;
    return {
      uk: typeof localizedRecord.uk === "string" ? localizedRecord.uk : null,
      en: typeof localizedRecord.en === "string" ? localizedRecord.en : null,
    };
  }

  return {
    uk: null,
    en: null,
  };
}

function buildWeightedCategoryPool(categories: readonly WheelCategoryRow[]) {
  return categories.flatMap((category) =>
    Array.from({ length: Math.max(category.weight, 1) }, () => category)
  );
}

function pickRandomItem<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function clampRemainingSeconds(value: number, durationSeconds: number) {
  return Math.min(Math.max(Math.round(value), 0), durationSeconds);
}

function getCategorySpinAngle(
  categories: readonly WheelCategoryRow[],
  categoryId: string
) {
  const categoryIndex = categories.findIndex((category) => category.id === categoryId);
  const normalizedIndex = categoryIndex >= 0 ? categoryIndex : 0;
  const segmentAngle = 360 / Math.max(categories.length, 1);

  return Math.round(normalizedIndex * segmentAngle + segmentAngle / 2);
}

function getWheelRoundTimerSnapshot({
  round,
  task,
}: {
  round: Pick<
    GameRoundRow,
    | "resolved_at"
    | "timer_status"
    | "timer_duration_seconds"
    | "timer_remaining_seconds"
    | "timer_last_started_at"
    | "timer_last_paused_at"
  >;
  task: Pick<WheelTaskRow, "execution_mode" | "timer_seconds">;
}): WheelRoundTimerSnapshot | null {
  if (task.execution_mode !== "timed") {
    return null;
  }

  const durationSeconds = round.timer_duration_seconds ?? task.timer_seconds ?? null;
  const effectiveStatus = round.resolved_at
    ? "done"
    : round.timer_status === "none"
      ? "idle"
      : round.timer_status;
  const remainingSeconds =
    effectiveStatus === "done"
      ? 0
      : round.timer_remaining_seconds ?? durationSeconds;

  return {
    status:
      effectiveStatus === "running" ||
      effectiveStatus === "paused" ||
      effectiveStatus === "done"
        ? effectiveStatus
        : "idle",
    durationSeconds,
    startedAt: round.timer_last_started_at,
    pausedAt: round.timer_last_paused_at,
    remainingSeconds,
  };
}

function getWheelRoundPayload({
  round,
  assignment,
  category,
  task,
  locale,
}: {
  round: Pick<
    GameRoundRow,
    | "session_id"
    | "timer_status"
    | "timer_duration_seconds"
    | "timer_remaining_seconds"
    | "timer_last_started_at"
    | "timer_last_paused_at"
  >;
  assignment: Pick<WheelRoundAssignmentRow, "spin_angle" | "cycle_number" | "selection_rank">;
  category: WheelCategoryRow;
  task: WheelTaskRow;
  locale: SupportedLocale;
}): WheelRoundPayload {
  return {
    sessionId: round.session_id,
    cycleNumber: assignment.cycle_number,
    selectionRank: assignment.selection_rank,
    categorySlug: category.slug,
    categoryTitle: readLocalizedText(category.title_i18n, locale, category.slug),
    taskKey: task.task_key,
    interactionType: task.interaction_type,
    responseMode: task.response_mode,
    executionMode: task.execution_mode,
    allowPromise: task.allow_promise,
    allowEarlyCompletion: task.allow_early_completion,
    difficulty: task.difficulty,
    prompt: readLocalizedText(task.prompt_i18n, locale, task.task_key),
    details: readLocalizedText(task.details_i18n, locale, ""),
    timerSeconds: task.timer_seconds,
    completionXp: task.base_xp,
    promiseXp: task.promise_xp,
    skipPenaltyXp: task.skip_penalty_xp,
    timeoutPenaltyXp: task.timeout_penalty_xp,
    locale,
    spinAngle: assignment.spin_angle,
    timerStatus: round.timer_status,
    timerDurationSeconds: round.timer_duration_seconds,
    timerRemainingSeconds: round.timer_remaining_seconds,
    timerLastStartedAt: round.timer_last_started_at,
    timerLastPausedAt: round.timer_last_paused_at,
  };
}

function mapWheelRoundSnapshot({
  round,
  assignment,
  category,
  task,
  locale,
}: {
  round: Pick<
    GameRoundRow,
    | "id"
    | "session_id"
    | "resolved_at"
    | "timer_status"
    | "timer_duration_seconds"
    | "timer_remaining_seconds"
    | "timer_last_started_at"
    | "timer_last_paused_at"
  >;
  assignment: Pick<WheelRoundAssignmentRow, "spin_angle" | "cycle_number" | "selection_rank">;
  category: WheelCategoryRow;
  task: WheelTaskRow;
  locale: SupportedLocale;
}): WheelRoundSnapshot {
  return {
    roundId: round.id,
    sessionId: round.session_id,
    cycleNumber: assignment.cycle_number,
    selectionRank: assignment.selection_rank,
    spinAngle: assignment.spin_angle,
    category: {
      slug: category.slug,
      title: readLocalizedText(category.title_i18n, locale, category.slug),
      description: readLocalizedText(
        category.description_i18n,
        locale,
        category.slug
      ),
    },
    task: {
      taskKey: task.task_key,
      interactionType: task.interaction_type,
      responseMode: task.response_mode,
      executionMode: task.execution_mode,
      allowPromise: task.allow_promise,
      allowEarlyCompletion: task.allow_early_completion,
      difficulty: task.difficulty,
      prompt: readLocalizedText(task.prompt_i18n, locale, task.task_key),
      details: normalizeOptionalResponseText(
        readLocalizedText(task.details_i18n, locale, "")
      ),
      timerSeconds: task.timer_seconds,
      completionXp: task.base_xp,
      promiseXp: task.promise_xp,
      skipPenaltyXp: task.skip_penalty_xp,
      timeoutPenaltyXp: task.timeout_penalty_xp,
    },
    timer: getWheelRoundTimerSnapshot({ round, task }),
  };
}

function getWheelXpDelta(
  task: WheelTaskRow,
  resolution: WheelRoundResolution,
  resolutionReason: WheelRoundResolutionReason
) {
  switch (resolution) {
    case "completed":
      return task.base_xp;
    case "promised":
      return task.promise_xp;
    case "skipped":
      return resolutionReason === "timed_out"
        ? task.timeout_penalty_xp
        : task.skip_penalty_xp;
  }
}

function getWheelXpReason(
  resolution: WheelRoundResolution,
  resolutionReason: WheelRoundResolutionReason
) {
  if (resolution === "completed") {
    return "wheel_round_completed";
  }

  if (resolution === "promised") {
    return "wheel_round_promised";
  }

  return resolutionReason === "timed_out"
    ? "wheel_round_timed_out"
    : "wheel_round_skipped";
}

function getFeedPromptSnapshot(task: WheelTaskRow) {
  return readLocalizedTextSnapshot(task.prompt_i18n, task.task_key);
}

function buildEventSnapshot({
  profile,
  task,
  responseText,
  xpDelta,
}: {
  profile: Pick<PlayerProfileRow, "display_name" | "avatar_key">;
  task?: WheelTaskRow;
  responseText?: string | null;
  xpDelta?: number | null;
}) {
  return {
    snapshotName: profile.display_name,
    snapshotAvatarKey: profile.avatar_key,
    snapshotPromptI18n: task ? getFeedPromptSnapshot(task) : {},
    snapshotAnswerText: responseText ?? null,
    snapshotXpDelta: xpDelta ?? null,
  };
}

function mapLiveFeedEntry(row: LiveFeedViewRow): LiveFeedEventSnapshot {
  const payload = asJsonObject(row.payload);

  return {
    id: row.id,
    gameSlug: row.game_slug as GameSlug,
    eventType: row.event_type as LiveFeedEventSnapshot["eventType"],
    locale:
      payload.locale === "uk" || payload.locale === "en"
        ? payload.locale
        : null,
    playerId: row.player_id,
    playerName: row.snapshot_name,
    avatarKey: row.snapshot_avatar_key,
    promptI18n: readOptionalLocalizedTextSnapshot(row.snapshot_prompt_i18n),
    answerText: row.snapshot_answer_text,
    xpDelta: row.snapshot_xp_delta,
    welcomeText:
      typeof payload.welcomeText === "string" ? payload.welcomeText : null,
    isHeroEvent: row.is_hero_event,
    createdAt: row.created_at,
  };
}

async function getPlayerSnapshotByPlayerId(playerId: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("leaderboard_global_view")
    .select(LEADERBOARD_GLOBAL_SELECT)
    .eq("player_id", playerId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapPlayerSnapshot(data as LeaderboardGlobalViewRow) : null;
}

async function getGlobalLeaderboardEntryByPlayerId(playerId: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("leaderboard_global_view")
    .select(LEADERBOARD_GLOBAL_SELECT)
    .eq("player_id", playerId)
    .eq("onboarding_completed", true)
    .not("nickname", "is", null)
    .gt("total_points", 0)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as LeaderboardGlobalViewRow | null) ?? null;
}

async function getPlayerProfileById(playerId: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("player_profiles")
    .select(PLAYER_PROFILE_SELECT)
    .eq("id", playerId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as PlayerProfileRow | null) ?? null;
}

export async function getGlobalLeaderboard(limit = 10) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("leaderboard_global_view")
    .select(LEADERBOARD_GLOBAL_SELECT)
    .eq("onboarding_completed", true)
    .not("nickname", "is", null)
    .gt("total_points", 0)
    .order("rank", { ascending: true })
    .limit(limit);

  if (error) {
    throw error;
  }

  return ((data ?? []) as LeaderboardGlobalViewRow[]).map(mapLeaderboardEntry);
}

export async function getGameLeaderboard({
  gameSlug,
  playerId,
  topLimit = 5,
  windowRadius = 2,
}: {
  gameSlug: GameSlug;
  playerId: string;
  topLimit?: number;
  windowRadius?: number;
}): Promise<GameLeaderboardSnapshot> {
  const supabase = getSupabaseAdminClient();
  const [topResponse, playerEntryResponse] = await Promise.all([
    supabase
      .from("leaderboard_game_view")
      .select(LEADERBOARD_GAME_SELECT)
      .eq("game_slug", gameSlug)
      .eq("onboarding_completed", true)
      .not("nickname", "is", null)
      .gt("total_points", 0)
      .order("rank", { ascending: true })
      .limit(topLimit),
    supabase
      .from("leaderboard_game_view")
      .select(LEADERBOARD_GAME_SELECT)
      .eq("game_slug", gameSlug)
      .eq("player_id", playerId)
      .eq("onboarding_completed", true)
      .not("nickname", "is", null)
      .gt("total_points", 0)
      .maybeSingle(),
  ]);

  if (topResponse.error) {
    throw topResponse.error;
  }

  if (playerEntryResponse.error) {
    throw playerEntryResponse.error;
  }

  const playerEntry = (playerEntryResponse.data as LeaderboardGameViewRow | null) ?? null;
  let playerWindow: LeaderboardGameViewRow[] = [];

  if (playerEntry) {
    const startRank = Math.max(1, playerEntry.rank - windowRadius);
    const endRank = playerEntry.rank + windowRadius;
    const { data, error } = await supabase
      .from("leaderboard_game_view")
      .select(LEADERBOARD_GAME_SELECT)
      .eq("game_slug", gameSlug)
      .eq("onboarding_completed", true)
      .not("nickname", "is", null)
      .gt("total_points", 0)
      .gte("rank", startRank)
      .lte("rank", endRank)
      .order("rank", { ascending: true });

    if (error) {
      throw error;
    }

    playerWindow = (data ?? []) as LeaderboardGameViewRow[];
  }

  return {
    gameSlug,
    currentPlayerId: playerId,
    top: ((topResponse.data ?? []) as LeaderboardGameViewRow[]).map(
      mapLeaderboardEntry
    ),
    playerEntry: playerEntry ? mapLeaderboardEntry(playerEntry) : null,
    playerWindow: playerWindow.map(mapLeaderboardEntry),
  };
}

export async function getLivePageSnapshot({
  leaderboardLimit = 10,
  feedLimit = 5,
}: {
  leaderboardLimit?: number;
  feedLimit?: number;
} = {}) {
  const [leaderboard, feed] = await Promise.all([
    getGlobalLeaderboard(leaderboardLimit),
    (async () => {
      const supabase = getSupabaseAdminClient();
      const { data, error } = await supabase
        .from("live_feed_view")
        .select(LIVE_FEED_SELECT)
        .order("created_at", { ascending: false })
        .limit(feedLimit);

      if (error) {
        throw error;
      }

      return ((data ?? []) as LiveFeedViewRow[]).map(mapLiveFeedEntry);
    })(),
  ]);

  return {
    leaderboard,
    feed,
  };
}

async function getWheelSessionByPlayerId(playerId: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("game_sessions")
    .select(GAME_SESSION_SELECT)
    .eq("player_id", playerId)
    .eq("game_slug", WHEEL_GAME_SLUG)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as GameSessionRow | null) ?? null;
}

async function getWheelSessionById(sessionId: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("game_sessions")
    .select(GAME_SESSION_SELECT)
    .eq("id", sessionId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as GameSessionRow | null) ?? null;
}

async function getOrCreateWheelSession(playerId: string) {
  const existingSession = await getWheelSessionByPlayerId(playerId);
  if (existingSession) {
    return existingSession;
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("game_sessions")
    .insert({
      player_id: playerId,
      game_slug: WHEEL_GAME_SLUG,
      status: "active",
      current_cycle: 1,
      total_rounds: 0,
      resolved_rounds: 0,
      metadata: {
        source: "wheel-session",
      },
    })
    .select(GAME_SESSION_SELECT)
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      const collisionSession = await getWheelSessionByPlayerId(playerId);
      if (collisionSession) {
        return collisionSession;
      }
    }

    throw error;
  }

  if (!data) {
    throw new Error("Failed to create wheel session.");
  }

  return data as GameSessionRow;
}

async function updateWheelSession(
  sessionId: string,
  patch: Record<string, unknown>
) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("game_sessions")
    .update(patch)
    .eq("id", sessionId)
    .select(GAME_SESSION_SELECT)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Failed to update wheel session.");
  }

  return data as GameSessionRow;
}

async function getActiveWheelCategories() {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("wheel_categories")
    .select(WHEEL_CATEGORY_SELECT)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as WheelCategoryRow[];
}

async function getActiveWheelTasks() {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("wheel_tasks")
    .select(WHEEL_TASK_SELECT)
    .eq("is_active", true);

  if (error) {
    throw error;
  }

  return (data ?? []) as WheelTaskRow[];
}

async function getWheelHistoryForCycle(sessionId: string, cycleNumber: number) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("wheel_player_task_history")
    .select("session_id, player_id, task_id, round_id, cycle_number, assigned_at")
    .eq("session_id", sessionId)
    .eq("cycle_number", cycleNumber);

  if (error) {
    throw error;
  }

  return (data ?? []) as WheelPlayerTaskHistoryRow[];
}

async function getRecentWheelHistoryForSession(sessionId: string, limit = 20) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("wheel_player_task_history")
    .select("session_id, player_id, task_id, round_id, cycle_number, assigned_at")
    .eq("session_id", sessionId)
    .order("assigned_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return (data ?? []) as WheelPlayerTaskHistoryRow[];
}

async function getWheelTaskById(taskId: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("wheel_tasks")
    .select(WHEEL_TASK_SELECT)
    .eq("id", taskId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as WheelTaskRow | null) ?? null;
}

async function getWheelCategoryById(categoryId: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("wheel_categories")
    .select(WHEEL_CATEGORY_SELECT)
    .eq("id", categoryId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as WheelCategoryRow | null) ?? null;
}

async function getWheelRoundById(roundId: string, playerId: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("game_rounds")
    .select(GAME_ROUND_SELECT)
    .eq("id", roundId)
    .eq("player_id", playerId)
    .eq("game_slug", WHEEL_GAME_SLUG)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as GameRoundRow | null) ?? null;
}

async function getOpenWheelRoundForSession(sessionId: string, playerId: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("game_rounds")
    .select(GAME_ROUND_SELECT)
    .eq("session_id", sessionId)
    .eq("player_id", playerId)
    .eq("game_slug", WHEEL_GAME_SLUG)
    .eq("status", "open")
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as GameRoundRow | null) ?? null;
}

async function getWheelRoundAssignment(roundId: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("wheel_round_assignments")
    .select(WHEEL_ASSIGNMENT_SELECT)
    .eq("round_id", roundId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as WheelRoundAssignmentRow | null) ?? null;
}

async function getWheelRoundContext(roundId: string, playerId: string) {
  const [round, assignment] = await Promise.all([
    getWheelRoundById(roundId, playerId),
    getWheelRoundAssignment(roundId),
  ]);

  if (!round || !assignment) {
    throw new WheelRoundNotFoundError();
  }

  const [category, task, session] = await Promise.all([
    getWheelCategoryById(assignment.category_id),
    getWheelTaskById(assignment.task_id),
    getWheelSessionById(round.session_id),
  ]);

  if (!category || !task || !session) {
    throw new WheelRoundNotFoundError();
  }

  return {
    round,
    assignment,
    category,
    task,
    session,
  };
}

async function deleteWheelRound(roundId: string) {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("game_rounds").delete().eq("id", roundId);

  if (error) {
    console.error("Failed to delete wheel round during cleanup:", error);
  }
}

async function logActivityEvent(event: {
  sessionId?: string | null;
  playerId: string | null;
  roundId?: string | null;
  eventType: string;
  visibility: "private" | "feed";
  payload: JsonValue;
  snapshotName?: string | null;
  snapshotAvatarKey?: string | null;
  snapshotPromptI18n?: JsonValue;
  snapshotAnswerText?: string | null;
  snapshotXpDelta?: number | null;
}) {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("activity_events").insert({
    session_id: event.sessionId ?? null,
    player_id: event.playerId,
    game_slug: WHEEL_GAME_SLUG,
    round_id: event.roundId ?? null,
    event_type: event.eventType,
    visibility: event.visibility,
    payload: event.payload,
    snapshot_name: event.snapshotName ?? null,
    snapshot_avatar_key: event.snapshotAvatarKey ?? null,
    snapshot_prompt_i18n: event.snapshotPromptI18n ?? {},
    snapshot_answer_text: event.snapshotAnswerText ?? null,
    snapshot_xp_delta: event.snapshotXpDelta ?? null,
  });

  if (error) {
    console.error("Activity event insert failed:", error);
  }
}

function buildSelectableTaskGroups({
  categories,
  tasks,
  usedTaskIds,
  recentTaskIds,
}: {
  categories: readonly WheelCategoryRow[];
  tasks: readonly WheelTaskRow[];
  usedTaskIds: Set<string>;
  recentTaskIds: Set<string>;
}) {
  return categories
    .map((category) => {
      const eligibleTasks = tasks.filter(
        (task) => task.category_id === category.id && !usedTaskIds.has(task.id)
      );

      if (eligibleTasks.length === 0) {
        return null;
      }

      const preferredTasks = eligibleTasks.filter((task) => !recentTaskIds.has(task.id));

      return {
        category,
        tasks: preferredTasks.length > 0 ? preferredTasks : eligibleTasks,
      };
    })
    .filter(Boolean) as { category: WheelCategoryRow; tasks: WheelTaskRow[] }[];
}

async function ensureWheelSessionCycle(
  session: GameSessionRow,
  totalTaskCount: number
) {
  let cycleNumber = session.current_cycle;
  let cycleHistory = await getWheelHistoryForCycle(session.id, cycleNumber);

  if (cycleHistory.length < totalTaskCount) {
    return { session, cycleNumber, cycleHistory };
  }

  const updatedSession = await updateWheelSession(session.id, {
    current_cycle: session.current_cycle + 1,
  });

  cycleNumber = updatedSession.current_cycle;
  cycleHistory = [];

  return {
    session: updatedSession,
    cycleNumber,
    cycleHistory,
  };
}

async function updateRunningRoundToPaused(
  round: GameRoundRow,
  playerId: string
) {
  if (round.timer_status !== "running") {
    return round;
  }

  const supabase = getSupabaseAdminClient();
  const pausedAt = new Date().toISOString();
  const { data, error } = await supabase
    .from("game_rounds")
    .update({
      timer_status:
        (round.timer_remaining_seconds ?? round.timer_duration_seconds ?? 0) <= 0
          ? "done"
          : "paused",
      timer_last_started_at: null,
      timer_last_paused_at: pausedAt,
      timer_last_sync_at: pausedAt,
    })
    .eq("id", round.id)
    .eq("player_id", playerId)
    .eq("status", "open")
    .select(GAME_ROUND_SELECT)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as GameRoundRow | null) ?? round;
}

export async function bootstrapPlayerProfile({
  authUserId,
  locale,
}: {
  authUserId: string;
  locale: SupportedLocale;
}) {
  const supabase = getSupabaseAdminClient();
  const existingProfile = await getPlayerProfileById(authUserId);
  const avatarKey = existingProfile?.avatar_key ?? getAvatarKeyForPlayer(authUserId);

  if (!existingProfile) {
    const { error } = await supabase.from("player_profiles").insert({
      id: authUserId,
      avatar_key: avatarKey,
      locale,
      onboarding_completed: false,
    });

    if (error) {
      throw error;
    }
  } else {
    const { error } = await supabase
      .from("player_profiles")
      .update({
        locale,
        last_seen_at: new Date().toISOString(),
      })
      .eq("id", authUserId);

    if (error) {
      throw error;
    }
  }

  const profile = await getPlayerProfileById(authUserId);

  if (!profile) {
    throw new Error("Failed to read player profile after bootstrap.");
  }

  if (!profile.onboarding_completed || !profile.display_name) {
    return null;
  }

  const playerSnapshot = await getPlayerSnapshotByPlayerId(authUserId);
  if (!playerSnapshot) {
    throw new Error("Failed to read player snapshot after bootstrap.");
  }

  return playerSnapshot;
}

export async function savePlayerProfile({
  authUserId,
  nickname,
  locale,
}: {
  authUserId: string;
  nickname: string;
  locale: SupportedLocale;
}) {
  const supabase = getSupabaseAdminClient();
  const existingProfile = await getPlayerProfileById(authUserId);
  const normalizedNickname = normalizeDisplayName(nickname);
  const shouldLogJoin = !existingProfile?.onboarding_completed;

  const { error } = await supabase.from("player_profiles").upsert(
    {
      id: authUserId,
      display_name: normalizedNickname,
      display_name_normalized: normalizedNickname.toLocaleLowerCase(),
      avatar_key: existingProfile?.avatar_key ?? getAvatarKeyForPlayer(authUserId),
      locale,
      onboarding_completed: true,
      last_seen_at: new Date().toISOString(),
    },
    {
      onConflict: "id",
    }
  );

  if (error) {
    throw error;
  }

  const profile = await getPlayerProfileById(authUserId);
  const playerSnapshot = await getPlayerSnapshotByPlayerId(authUserId);

  if (!profile || !playerSnapshot) {
    throw new Error("Failed to read player snapshot after save.");
  }

  if (shouldLogJoin) {
    void logActivityEvent({
      playerId: authUserId,
      eventType: "player.joined",
      visibility: "feed",
      payload: {
        locale,
        welcomeText: locale === "uk" ? "Новий гравець у грі" : "A new player joined",
      },
      snapshotName: profile.display_name,
      snapshotAvatarKey: profile.avatar_key,
      snapshotPromptI18n: {},
      snapshotAnswerText: null,
      snapshotXpDelta: null,
    });
  }

  return playerSnapshot;
}

export async function getOpenWheelRound({
  playerId,
  locale,
}: {
  playerId: string;
  locale: SupportedLocale;
}) {
  const profile = await getPlayerProfileById(playerId);

  if (!profile?.onboarding_completed || !profile.display_name) {
    throw new PlayerProfileNotReadyError();
  }

  const session = await getWheelSessionByPlayerId(playerId);
  if (!session) {
    return {
      round: null,
    };
  }

  const openRound = await getOpenWheelRoundForSession(session.id, playerId);
  if (!openRound) {
    return {
      round: null,
    };
  }

  const { assignment, category, task } = await getWheelRoundContext(openRound.id, playerId);
  const restoredRound =
    task.execution_mode === "timed" && openRound.timer_status === "running"
      ? await updateRunningRoundToPaused(openRound, playerId)
      : openRound;

  return {
    round: mapWheelRoundSnapshot({
      round: restoredRound,
      assignment,
      category,
      task,
      locale,
    }),
  };
}

export async function startWheelRound({
  playerId,
  locale,
}: {
  playerId: string;
  locale: SupportedLocale;
}) {
  const supabase = getSupabaseAdminClient();
  const profile = await getPlayerProfileById(playerId);

  if (!profile?.onboarding_completed || !profile.display_name) {
    throw new PlayerProfileNotReadyError();
  }

  const session = await getOrCreateWheelSession(playerId);
  const existingOpenRound = await getOpenWheelRoundForSession(session.id, playerId);

  if (existingOpenRound) {
    const { assignment, category, task } = await getWheelRoundContext(
      existingOpenRound.id,
      playerId
    );

    return {
      round: mapWheelRoundSnapshot({
        round: existingOpenRound,
        assignment,
        category,
        task,
        locale,
      }),
    };
  }

  const [categories, tasks, recentHistory] = await Promise.all([
    getActiveWheelCategories(),
    getActiveWheelTasks(),
    getRecentWheelHistoryForSession(session.id, 20),
  ]);

  if (categories.length === 0 || tasks.length === 0) {
    throw new WheelTasksDepletedError();
  }

  const sessionState = await ensureWheelSessionCycle(session, tasks.length);
  const usedTaskIds = new Set(sessionState.cycleHistory.map((entry) => entry.task_id));
  const recentTaskIds = new Set(recentHistory.map((entry) => entry.task_id));
  const availableGroups = buildSelectableTaskGroups({
    categories,
    tasks,
    usedTaskIds,
    recentTaskIds,
  });

  if (availableGroups.length === 0) {
    throw new WheelTasksDepletedError();
  }

  const weightedCategories = buildWeightedCategoryPool(
    availableGroups.map((group) => group.category)
  );
  const selectedCategory = pickRandomItem(weightedCategories);
  const selectedGroup = availableGroups.find(
    (group) => group.category.id === selectedCategory.id
  );

  if (!selectedGroup || selectedGroup.tasks.length === 0) {
    throw new WheelTasksDepletedError();
  }

  const selectedTask = pickRandomItem(selectedGroup.tasks);
  const spinAngle = getCategorySpinAngle(categories, selectedCategory.id);
  const selectionRank = sessionState.cycleHistory.length + 1;
  const startedAt = new Date().toISOString();
  const isTimedTask = selectedTask.execution_mode === "timed";

  const { data: round, error: roundError } = await supabase
    .from("game_rounds")
    .insert({
      session_id: sessionState.session.id,
      player_id: playerId,
      game_slug: WHEEL_GAME_SLUG,
      status: "open",
      started_at: startedAt,
      resolution_reason: null,
      timer_status: isTimedTask ? "idle" : "none",
      timer_duration_seconds: selectedTask.timer_seconds,
      timer_remaining_seconds: selectedTask.timer_seconds,
      timer_last_started_at: null,
      timer_last_paused_at: null,
      timer_last_sync_at: null,
      metadata: {
        source: "wheel-round",
        locale,
        categorySlug: selectedCategory.slug,
        taskKey: selectedTask.task_key,
        cycleNumber: sessionState.cycleNumber,
        selectionRank,
      },
    })
    .select(GAME_ROUND_SELECT)
    .single();

  if (roundError) {
    if (roundError.code === "23505") {
      const latestOpenRound = await getOpenWheelRoundForSession(
        sessionState.session.id,
        playerId
      );

      if (latestOpenRound) {
        const { assignment, category, task } = await getWheelRoundContext(
          latestOpenRound.id,
          playerId
        );

        return {
          round: mapWheelRoundSnapshot({
            round: latestOpenRound,
            assignment,
            category,
            task,
            locale,
          }),
        };
      }
    }

    throw roundError;
  }

  const roundRecord = round as GameRoundRow;
  const { error: assignmentError } = await supabase
    .from("wheel_round_assignments")
    .insert({
      round_id: roundRecord.id,
      category_id: selectedCategory.id,
      task_id: selectedTask.id,
      spin_angle: spinAngle,
      cycle_number: sessionState.cycleNumber,
      selection_rank: selectionRank,
    });

  if (assignmentError) {
    await deleteWheelRound(roundRecord.id);
    throw assignmentError;
  }

  const { error: historyError } = await supabase
    .from("wheel_player_task_history")
    .insert({
      session_id: sessionState.session.id,
      player_id: playerId,
      task_id: selectedTask.id,
      first_round_id: roundRecord.id,
      round_id: roundRecord.id,
      cycle_number: sessionState.cycleNumber,
      assigned_at: startedAt,
    });

  if (historyError) {
    await deleteWheelRound(roundRecord.id);
    throw historyError;
  }

  await updateWheelSession(sessionState.session.id, {
    current_cycle: sessionState.cycleNumber,
    total_rounds: sessionState.session.total_rounds + 1,
    last_round_started_at: startedAt,
  });

  const assignment: WheelRoundAssignmentRow = {
    round_id: roundRecord.id,
    category_id: selectedCategory.id,
    task_id: selectedTask.id,
    spin_angle: spinAngle,
    cycle_number: sessionState.cycleNumber,
    selection_rank: selectionRank,
    created_at: startedAt,
  };
  const payload = getWheelRoundPayload({
    round: roundRecord,
    assignment,
    category: selectedCategory,
    task: selectedTask,
    locale,
  });

  void logActivityEvent({
    sessionId: sessionState.session.id,
    playerId,
    roundId: roundRecord.id,
    eventType: "wheel.round.started",
    visibility: "private",
    payload,
  });

  return {
    round: mapWheelRoundSnapshot({
      round: roundRecord,
      assignment,
      category: selectedCategory,
      task: selectedTask,
      locale,
    }),
  };
}

export async function startWheelRoundTimer({
  playerId,
  roundId,
  locale,
}: {
  playerId: string;
  roundId: string;
  locale: SupportedLocale;
}) {
  const supabase = getSupabaseAdminClient();
  const profile = await getPlayerProfileById(playerId);

  if (!profile?.onboarding_completed || !profile.display_name) {
    throw new PlayerProfileNotReadyError();
  }

  const { round, assignment, category, task } = await getWheelRoundContext(
    roundId,
    playerId
  );

  if (round.resolved_at || round.resolution || round.status !== "open") {
    throw new WheelRoundAlreadyResolvedError();
  }

  if (task.execution_mode !== "timed" || !task.timer_seconds) {
    throw new InvalidWheelRoundStateError();
  }

  if (round.timer_status === "running") {
    return {
      round: mapWheelRoundSnapshot({
        round,
        assignment,
        category,
        task,
        locale,
      }),
    };
  }

  if (round.timer_status === "done" && (round.timer_remaining_seconds ?? 0) <= 0) {
    throw new InvalidWheelRoundStateError();
  }

  const startedAt = new Date().toISOString();
  const { data: updatedRound, error: updateError } = await supabase
    .from("game_rounds")
    .update({
      timer_status: "running",
      timer_duration_seconds: round.timer_duration_seconds ?? task.timer_seconds,
      timer_remaining_seconds:
        round.timer_remaining_seconds ?? round.timer_duration_seconds ?? task.timer_seconds,
      timer_last_started_at: startedAt,
      timer_last_sync_at: startedAt,
    })
    .eq("id", roundId)
    .eq("player_id", playerId)
    .eq("status", "open")
    .select(GAME_ROUND_SELECT)
    .maybeSingle();

  if (updateError) {
    throw updateError;
  }

  if (!updatedRound) {
    throw new InvalidWheelRoundStateError();
  }

  const roundRecord = updatedRound as GameRoundRow;
  const payload = getWheelRoundPayload({
    round: roundRecord,
    assignment,
    category,
    task,
    locale,
  });

  void logActivityEvent({
    sessionId: roundRecord.session_id,
    playerId,
    roundId,
    eventType: "wheel.round.timer_started",
    visibility: "private",
    payload,
  });

  return {
    round: mapWheelRoundSnapshot({
      round: roundRecord,
      assignment,
      category,
      task,
      locale,
    }),
  };
}

export async function pauseWheelRoundTimer({
  playerId,
  roundId,
  locale,
  remainingSeconds,
}: {
  playerId: string;
  roundId: string;
  locale: SupportedLocale;
  remainingSeconds?: number | null;
}) {
  const supabase = getSupabaseAdminClient();
  const profile = await getPlayerProfileById(playerId);

  if (!profile?.onboarding_completed || !profile.display_name) {
    throw new PlayerProfileNotReadyError();
  }

  const { round, assignment, category, task } = await getWheelRoundContext(
    roundId,
    playerId
  );

  if (round.resolved_at || round.resolution || round.status !== "open") {
    throw new WheelRoundAlreadyResolvedError();
  }

  if (task.execution_mode !== "timed" || !task.timer_seconds) {
    throw new InvalidWheelRoundStateError();
  }

  if (round.timer_status !== "running") {
    return {
      round: mapWheelRoundSnapshot({
        round,
        assignment,
        category,
        task,
        locale,
      }),
    };
  }

  const durationSeconds = round.timer_duration_seconds ?? task.timer_seconds;
  const nextRemainingSeconds = clampRemainingSeconds(
    remainingSeconds ?? round.timer_remaining_seconds ?? durationSeconds,
    durationSeconds
  );
  const pausedAt = new Date().toISOString();
  const nextTimerStatus = nextRemainingSeconds <= 0 ? "done" : "paused";

  const { data: updatedRound, error: updateError } = await supabase
    .from("game_rounds")
    .update({
      timer_status: nextTimerStatus,
      timer_duration_seconds: durationSeconds,
      timer_remaining_seconds: nextRemainingSeconds,
      timer_last_started_at: null,
      timer_last_paused_at: pausedAt,
      timer_last_sync_at: pausedAt,
    })
    .eq("id", roundId)
    .eq("player_id", playerId)
    .eq("status", "open")
    .select(GAME_ROUND_SELECT)
    .maybeSingle();

  if (updateError) {
    throw updateError;
  }

  if (!updatedRound) {
    throw new InvalidWheelRoundStateError();
  }

  const roundRecord = updatedRound as GameRoundRow;

  return {
    round: mapWheelRoundSnapshot({
      round: roundRecord,
      assignment,
      category,
      task,
      locale,
    }),
  };
}

export async function resolveWheelRound({
  playerId,
  roundId,
  locale,
  resolution,
  responseText,
  remainingSeconds,
}: {
  playerId: string;
  roundId: string;
  locale: SupportedLocale;
  resolution: WheelRoundResolution;
  responseText?: string | null;
  remainingSeconds?: number | null;
}) {
  const supabase = getSupabaseAdminClient();
  const profile = await getPlayerProfileById(playerId);

  if (!profile?.onboarding_completed || !profile.display_name) {
    throw new PlayerProfileNotReadyError();
  }

  const { round, assignment, category, task, session } = await getWheelRoundContext(
    roundId,
    playerId
  );

  if (round.resolved_at || round.resolution || round.status !== "open") {
    throw new WheelRoundAlreadyResolvedError();
  }

  const normalizedResponseText = normalizeOptionalResponseText(responseText);
  if (
    resolution === "completed" &&
    task.response_mode === "text_input" &&
    !hasMeaningfulTextResponse(normalizedResponseText)
  ) {
    throw new InvalidWheelRoundResponseError();
  }

  if (resolution === "promised" && !task.allow_promise) {
    throw new InvalidWheelRoundResponseError();
  }

  if (
    resolution === "completed" &&
    task.execution_mode === "timed" &&
    round.timer_status === "idle"
  ) {
    throw new InvalidWheelRoundStateError();
  }

  const timerDurationSeconds = round.timer_duration_seconds ?? task.timer_seconds ?? null;
  const synchronizedRemainingSeconds =
    task.execution_mode === "timed" && timerDurationSeconds
      ? clampRemainingSeconds(
          remainingSeconds ??
            round.timer_remaining_seconds ??
            timerDurationSeconds,
          timerDurationSeconds
        )
      : null;

  const resolutionReason: WheelRoundResolutionReason =
    resolution === "skipped"
      ? task.execution_mode === "timed" && synchronizedRemainingSeconds === 0
        ? "timed_out"
      : "manual_skip"
      : "not_applicable";
  const xpDelta = getWheelXpDelta(task, resolution, resolutionReason);
  const previousLeaderboardEntry =
    xpDelta > 0 ? await getGlobalLeaderboardEntryByPlayerId(playerId) : null;
  const resolvedAt = new Date().toISOString();
  const payload = getWheelRoundPayload({
    round: {
      ...round,
      timer_status:
        task.execution_mode === "timed"
          ? synchronizedRemainingSeconds === 0
            ? "done"
            : round.timer_status
          : round.timer_status,
      timer_duration_seconds: timerDurationSeconds,
      timer_remaining_seconds: synchronizedRemainingSeconds,
      timer_last_started_at: round.timer_last_started_at,
      timer_last_paused_at: round.timer_last_paused_at,
    },
    assignment,
    category,
    task,
    locale,
  });

  const { data: updatedRound, error: updateError } = await supabase
    .from("game_rounds")
    .update({
      status: "resolved",
      resolved_at: resolvedAt,
      resolution,
      resolution_reason: resolutionReason,
      timer_status: task.execution_mode === "timed" ? "done" : round.timer_status,
      timer_duration_seconds: timerDurationSeconds,
      timer_remaining_seconds:
        task.execution_mode === "timed" ? synchronizedRemainingSeconds : null,
      timer_last_started_at: null,
      timer_last_paused_at:
        task.execution_mode === "timed" ? resolvedAt : round.timer_last_paused_at,
      timer_last_sync_at:
        task.execution_mode === "timed" ? resolvedAt : round.timer_last_sync_at,
      response_payload: {
        resolution,
        resolutionReason,
        responseText: normalizedResponseText,
      },
      metadata: {
        ...asJsonObject(round.metadata),
        ...payload,
        resolution,
        resolutionReason,
        xpDelta,
      },
    })
    .eq("id", roundId)
    .eq("player_id", playerId)
    .eq("status", "open")
    .select(GAME_ROUND_SELECT)
    .maybeSingle();

  if (updateError) {
    throw updateError;
  }

  if (!updatedRound) {
    throw new WheelRoundAlreadyResolvedError();
  }

  const updatedRoundRecord = updatedRound as GameRoundRow;
  const eventSnapshot = buildEventSnapshot({
    profile,
    task,
    responseText: normalizedResponseText,
    xpDelta,
  });

  if (xpDelta !== 0) {
    const { error: xpError } = await supabase.from("xp_transactions").insert({
      player_id: playerId,
      game_slug: WHEEL_GAME_SLUG,
      round_id: roundId,
      reason: getWheelXpReason(resolution, resolutionReason),
      delta: xpDelta,
      event_snapshot: {
        ...eventSnapshot,
        resolution,
        resolutionReason,
      },
      metadata: {
        ...payload,
        resolution,
        resolutionReason,
        responseText: normalizedResponseText,
      },
    });

    if (xpError) {
      throw xpError;
    }
  }

  await updateWheelSession(session.id, {
    resolved_rounds: session.resolved_rounds + 1,
    last_round_resolved_at: resolvedAt,
  });

  void logActivityEvent({
    sessionId: session.id,
    playerId,
    roundId,
    eventType: `wheel.round.${resolution}`,
    visibility: "private",
    payload: {
      ...payload,
      resolution,
      resolutionReason,
      responseText: normalizedResponseText,
      xpDelta,
    },
    ...eventSnapshot,
  });

  if (resolution === "promised") {
    void logActivityEvent({
      sessionId: session.id,
      playerId,
      roundId,
      eventType: "wheel.round.promised",
      visibility: "feed",
      payload: {
        ...payload,
        resolution,
        resolutionReason,
        responseText: normalizedResponseText,
        heroEvent: true,
      },
      ...eventSnapshot,
    });
  }

  if (xpDelta > 0) {
    void logActivityEvent({
      sessionId: session.id,
      playerId,
      roundId,
      eventType: "xp.awarded",
      visibility: "feed",
      payload: {
        amount: xpDelta,
        locale,
      },
      snapshotName: profile.display_name,
      snapshotAvatarKey: profile.avatar_key,
      snapshotPromptI18n: {},
      snapshotAnswerText: null,
      snapshotXpDelta: xpDelta,
    });
  }

  const playerLeaderboardEntry = await getGlobalLeaderboardEntryByPlayerId(playerId);

  if (
    xpDelta > 0 &&
    playerLeaderboardEntry?.rank === 1 &&
    previousLeaderboardEntry?.rank !== 1
  ) {
    void logActivityEvent({
      sessionId: session.id,
      playerId,
      roundId,
      eventType: "leaderboard.new_top_player",
      visibility: "feed",
      payload: {
        rank: 1,
        previousRank: previousLeaderboardEntry?.rank ?? null,
        heroEvent: true,
      },
      snapshotName: profile.display_name,
      snapshotAvatarKey: profile.avatar_key,
      snapshotPromptI18n: {},
      snapshotAnswerText: null,
      snapshotXpDelta: xpDelta,
    });
  }

  const playerSnapshot = await getPlayerSnapshotByPlayerId(playerId);
  if (!playerSnapshot) {
    throw new Error("Failed to read player snapshot after wheel resolution.");
  }

  return {
    player: playerSnapshot,
    round: {
      ...mapWheelRoundSnapshot({
        round: updatedRoundRecord,
        assignment,
        category,
        task,
        locale,
      }),
      resolution,
      resolutionReason,
      xpDelta,
      responseText: normalizedResponseText,
    },
  };
}
