export type FeedEventType =
  | "player_joined"
  | "xp_awarded"
  | "answered"
  | "promised"
  | "new_top_player";

export interface FeedEvent {
  id: string;
  type: FeedEventType;
  playerId: string | null;
  avatarKey: string | null;
  playerName: string | null;
  gameSlug: string | null;
  promptI18n: Record<string, string> | null;
  answerI18n: Record<string, string> | null;
  xpDelta: number | null;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  avatarKey: string | null;
  nickname: string;
  totalPoints: number;
}

export interface ActivityFeedSnapshot {
  feed: FeedEvent[];
  leaderboard: LeaderboardEntry[];
  generatedAt: string;
}

export type LiveFeedState = "loading" | "populated" | "empty" | "error";

export interface ActivityFeedSource {
  getSnapshot(state?: Exclude<LiveFeedState, "loading">): Promise<ActivityFeedSnapshot>;
}

export interface GameEvent {
  id: string;
  type: string;
  playerId: string;
  payload: Record<string, unknown>;
  xpDelta: number;
  createdAt: Date;
}

export type FeedEventSnapshot = FeedEvent;
export type LeaderboardEntrySnapshot = LeaderboardEntry;
