import type { WheelSegmentType } from "@/shared/config";

export type GameApiErrorCode =
  | "INVALID_DATA"
  | "PLAYER_NOT_FOUND"
  | "SUPABASE_NOT_CONFIGURED"
  | "PERSISTENCE_ERROR";

export interface PlayerSessionSnapshot {
  playerId: string;
  clientSessionId: string;
  nickname: string;
  totalPoints: number;
}

export interface PlayerApiResponse {
  player: PlayerSessionSnapshot;
}

export interface WheelSpinApiResponse {
  player: PlayerSessionSnapshot;
  awardedPoints: number;
  segment: {
    id: string;
    type: WheelSegmentType;
  };
}
