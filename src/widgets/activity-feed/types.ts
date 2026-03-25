export type FeedEventType =
  | "player_joined"
  | "xp_awarded"
  | "answered"
  | "promised"
  | "new_top_player";

export interface FeedEventSnapshot {
  id: string;
  type: FeedEventType;
  playerId: string | null;
  avatarKey: string | null;
  playerName: string | null;
  gameSlug: string | null;
  promptI18n: Record<string, string> | null;
  answerI18n: Record<string, string> | null;
  xpDelta: number | null;
  createdAt: string; // ISO string
}

export interface LeaderboardEntrySnapshot {
  rank: number;
  playerId: string;
  avatarKey: string | null;
  nickname: string;
  totalPoints: number;
}

export interface ActivityFeedSnapshot {
  feed: FeedEventSnapshot[];
  leaderboard: LeaderboardEntrySnapshot[];
  generatedAt: string; // ISO string
}
