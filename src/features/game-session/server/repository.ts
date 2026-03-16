import "server-only";

import type { SupportedLocale, WheelSegment } from "@/shared/config";
import type { PlayerSessionSnapshot } from "../types";
import type {
  GameSubmissionRow,
  LeaderboardViewRow,
  PlayerRow,
  WheelSubmissionPayload,
} from "./types";
import { getSupabaseAdminClient } from "./supabase";

function mapPlayerSnapshot(row: LeaderboardViewRow): PlayerSessionSnapshot {
  return {
    playerId: row.player_id,
    clientSessionId: row.client_session_id,
    nickname: row.nickname,
    totalPoints: row.total_points,
  };
}

async function getPlayerSnapshotByPlayerId(playerId: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("leaderboard_view")
    .select("player_id, client_session_id, nickname, total_points")
    .eq("player_id", playerId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapPlayerSnapshot(data as LeaderboardViewRow) : null;
}

export async function getPlayerSnapshotByClientSessionId(
  clientSessionId: string
) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("leaderboard_view")
    .select("player_id, client_session_id, nickname, total_points")
    .eq("client_session_id", clientSessionId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapPlayerSnapshot(data as LeaderboardViewRow) : null;
}

export async function savePlayerSession({
  clientSessionId,
  nickname,
}: {
  clientSessionId: string;
  nickname: string;
}) {
  const supabase = getSupabaseAdminClient();
  const { data: existingPlayer, error: existingPlayerError } = await supabase
    .from("players")
    .select("id, client_session_id, nickname, created_at, updated_at")
    .eq("client_session_id", clientSessionId)
    .maybeSingle();

  if (existingPlayerError) {
    throw existingPlayerError;
  }

  let playerId = (existingPlayer as PlayerRow | null)?.id ?? null;

  if (!existingPlayer) {
    const { data: createdPlayer, error: createPlayerError } = await supabase
      .from("players")
      .insert({
        client_session_id: clientSessionId,
        nickname,
      })
      .select("id")
      .single();

    if (createPlayerError) {
      throw createPlayerError;
    }

    playerId = (createdPlayer as Pick<PlayerRow, "id">).id;
  } else if ((existingPlayer as PlayerRow).nickname !== nickname) {
    const { error: updatePlayerError } = await supabase
      .from("players")
      .update({ nickname })
      .eq("id", (existingPlayer as PlayerRow).id);

    if (updatePlayerError) {
      throw updatePlayerError;
    }

    playerId = (existingPlayer as PlayerRow).id;
  }

  if (!playerId) {
    throw new Error("Player id is missing after save.");
  }

  const playerSnapshot = await getPlayerSnapshotByPlayerId(playerId);
  if (!playerSnapshot) {
    throw new Error("Failed to read player snapshot after save.");
  }

  return playerSnapshot;
}

export async function recordWheelSpin({
  playerId,
  segment,
  locale,
}: {
  playerId: string;
  segment: WheelSegment;
  locale: SupportedLocale;
}) {
  const supabase = getSupabaseAdminClient();
  const payload: WheelSubmissionPayload = {
    segmentId: segment.id,
    segmentType: segment.type,
    label: segment.label[locale],
    prompt: segment.prompt[locale],
    points: segment.points,
  };

  const { data: submission, error: submissionError } = await supabase
    .from("game_submissions")
    .insert({
      player_id: playerId,
      game_slug: "wheel-of-fortune",
      submission_type: "wheel_spin",
      prompt_key: segment.id,
      payload,
      live_eligible: false,
    })
    .select("id, player_id, game_slug, submission_type, prompt_key, text_value, choice_value, is_correct, live_eligible, payload, created_at")
    .single();

  if (submissionError) {
    throw submissionError;
  }

  const submissionRecord = submission as GameSubmissionRow;

  const { error: pointsError } = await supabase.from("points_ledger").insert({
    player_id: playerId,
    source_type: "wheel_spin",
    source_id: submissionRecord.id,
    points: segment.points,
  });

  if (pointsError) {
    throw pointsError;
  }

  const playerSnapshot = await getPlayerSnapshotByPlayerId(playerId);
  if (!playerSnapshot) {
    throw new Error("Failed to read player snapshot after wheel spin.");
  }

  return {
    player: playerSnapshot,
    awardedPoints: segment.points,
  };
}
