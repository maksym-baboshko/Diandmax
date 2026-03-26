import type { ActivityFeedSnapshot, ActivityFeedSource, LiveFeedState } from "../types";

const DEFAULT_DELAY_MS = 680;
const GENERATED_AT = "2026-06-28T17:45:00.000Z";

export const MOCK_EMPTY_ACTIVITY_FEED_SNAPSHOT: ActivityFeedSnapshot = {
  feed: [],
  leaderboard: [],
  generatedAt: GENERATED_AT,
};

export const MOCK_POPULATED_ACTIVITY_FEED_SNAPSHOT: ActivityFeedSnapshot = {
  feed: [
    {
      id: "event-1",
      type: "answered",
      playerId: "player-1",
      avatarKey: "olena-ry",
      playerName: "Олена",
      gameSlug: "wheel-of-fortune",
      promptI18n: {
        uk: "Коли ти зрозуміла, що це точно любов?",
        en: "When did you know this was definitely love?",
      },
      answerI18n: {
        uk: "Коли почала сміятися ще до того, як він договорив.",
        en: "When I started laughing before he even finished the sentence.",
      },
      xpDelta: 18,
      createdAt: "2026-06-28T17:45:00.000Z",
    },
    {
      id: "event-2",
      type: "player_joined",
      playerId: "player-2",
      avatarKey: "taras-ko",
      playerName: "Тарас",
      gameSlug: null,
      promptI18n: null,
      answerI18n: null,
      xpDelta: null,
      createdAt: "2026-06-28T17:40:00.000Z",
    },
    {
      id: "event-3",
      type: "promised",
      playerId: "player-3",
      avatarKey: "anna-mi",
      playerName: "Анна",
      gameSlug: "wheel-of-fortune",
      promptI18n: {
        uk: "Яку смішну обіцянку ти готова виконати після весілля?",
        en: "What funny promise are you willing to keep after the wedding?",
      },
      answerI18n: {
        uk: "Тиждень носити воду чоловіку в ліжко, якщо він прибере кухню.",
        en: "Bring my husband water in bed for a week if he handles the kitchen.",
      },
      xpDelta: 12,
      createdAt: "2026-06-28T17:35:00.000Z",
    },
    {
      id: "event-4",
      type: "new_top_player",
      playerId: "player-1",
      avatarKey: "olena-ry",
      playerName: "Олена",
      gameSlug: null,
      promptI18n: null,
      answerI18n: null,
      xpDelta: null,
      createdAt: "2026-06-28T17:33:00.000Z",
    },
  ],
  leaderboard: [
    {
      rank: 1,
      playerId: "player-1",
      avatarKey: "olena-ry",
      nickname: "Олена",
      totalPoints: 210,
    },
    {
      rank: 2,
      playerId: "player-2",
      avatarKey: "taras-ko",
      nickname: "Тарас",
      totalPoints: 184,
    },
    {
      rank: 3,
      playerId: "player-3",
      avatarKey: "anna-mi",
      nickname: "Анна",
      totalPoints: 167,
    },
  ],
  generatedAt: GENERATED_AT,
};

function wait(delayMs: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, delayMs));
}

function cloneSnapshot(snapshot: ActivityFeedSnapshot): ActivityFeedSnapshot {
  return structuredClone(snapshot);
}

export const mockActivityFeedSource: ActivityFeedSource = {
  async getSnapshot(state = "populated") {
    await wait(DEFAULT_DELAY_MS);

    if (state === "error") {
      throw new Error("Mock activity feed is unavailable.");
    }

    return cloneSnapshot(
      state === "empty" ? MOCK_EMPTY_ACTIVITY_FEED_SNAPSHOT : MOCK_POPULATED_ACTIVITY_FEED_SNAPSHOT,
    );
  },
};

export function resolveLiveFeedState(value: string | undefined): Exclude<LiveFeedState, "loading"> {
  if (value === "empty" || value === "error" || value === "populated") {
    return value;
  }

  return "populated";
}
