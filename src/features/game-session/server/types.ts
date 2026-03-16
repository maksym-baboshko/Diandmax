import type { WheelSegmentType } from "@/shared/config";

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue | undefined }
  | JsonValue[];

export type PlayerRow = Record<string, unknown> & {
  id: string;
  client_session_id: string;
  nickname: string;
  created_at: string;
  updated_at: string;
};

export type GameSubmissionRow = Record<string, unknown> & {
  id: string;
  player_id: string;
  game_slug: string;
  submission_type: string;
  prompt_key: string | null;
  text_value: string | null;
  choice_value: string | null;
  is_correct: boolean | null;
  live_eligible: boolean;
  payload: JsonValue;
  created_at: string;
};

export type PointsLedgerRow = Record<string, unknown> & {
  id: string;
  player_id: string;
  source_type: string;
  source_id: string | null;
  points: number;
  created_at: string;
};

export type LeaderboardViewRow = Record<string, unknown> & {
  player_id: string;
  client_session_id: string;
  nickname: string;
  total_points: number;
  last_scored_at: string | null;
  created_at: string;
  updated_at: string;
};

export type WheelSubmissionPayload = Record<string, JsonValue> & {
  segmentId: string;
  segmentType: WheelSegmentType;
  label: string;
  prompt: string;
  points: number;
};

export interface GamesDatabase {
  public: {
    Tables: {
      players: {
        Row: PlayerRow;
        Insert: {
          id?: string;
          client_session_id: string;
          nickname: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_session_id?: string;
          nickname?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      game_submissions: {
        Row: GameSubmissionRow;
        Insert: {
          id?: string;
          player_id: string;
          game_slug: string;
          submission_type: string;
          prompt_key?: string | null;
          text_value?: string | null;
          choice_value?: string | null;
          is_correct?: boolean | null;
          live_eligible?: boolean;
          payload?: JsonValue;
          created_at?: string;
        };
        Update: {
          id?: string;
          player_id?: string;
          game_slug?: string;
          submission_type?: string;
          prompt_key?: string | null;
          text_value?: string | null;
          choice_value?: string | null;
          is_correct?: boolean | null;
          live_eligible?: boolean;
          payload?: JsonValue;
          created_at?: string;
        };
        Relationships: [];
      };
      points_ledger: {
        Row: PointsLedgerRow;
        Insert: {
          id?: string;
          player_id: string;
          source_type: string;
          source_id?: string | null;
          points: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          player_id?: string;
          source_type?: string;
          source_id?: string | null;
          points?: number;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      leaderboard_view: {
        Row: LeaderboardViewRow;
        Insert: {
          player_id?: string;
          client_session_id?: string;
          nickname?: string;
          total_points?: number;
          last_scored_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          player_id?: string;
          client_session_id?: string;
          nickname?: string;
          total_points?: number;
          last_scored_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
  };
}
