import { db } from "@/infrastructure/db/client";
import { gameEvents, leaderboard, players } from "@/infrastructure/db/schema";
import {
  getRequestId,
  logServerError,
  logServerInfo,
  makeApiErrorResponse,
} from "@/shared/lib/server";
import type {
  ActivityFeedSnapshot,
  FeedEventSnapshot,
  FeedEventType,
  LeaderboardEntrySnapshot,
} from "@/widgets/activity-feed/types";
import { desc, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const requestId = getRequestId(req);

  const searchParams = req.nextUrl.searchParams;

  const feedLimit = clamp(Number(searchParams.get("feed_limit") ?? "20"), 1, 50);
  const leaderboardLimit = clamp(Number(searchParams.get("leaderboard_limit") ?? "30"), 1, 50);

  try {
    const [feedRows, leaderboardRows] = await Promise.all([
      db
        .select({
          id: gameEvents.id,
          type: gameEvents.type,
          xpDelta: gameEvents.xpDelta,
          createdAt: gameEvents.createdAt,
          payload: gameEvents.payload,
          playerId: players.id,
          playerNickname: players.nickname,
          playerAvatarKey: players.avatarKey,
        })
        .from(gameEvents)
        .leftJoin(players, eq(gameEvents.playerId, players.id))
        .orderBy(desc(gameEvents.createdAt))
        .limit(feedLimit),

      db
        .select({
          playerId: leaderboard.playerId,
          nickname: leaderboard.nickname,
          totalXp: leaderboard.totalXp,
          avatarKey: players.avatarKey,
        })
        .from(leaderboard)
        .leftJoin(players, eq(leaderboard.playerId, players.id))
        .orderBy(desc(leaderboard.totalXp))
        .limit(leaderboardLimit),
    ]);

    const feed: FeedEventSnapshot[] = feedRows.map((row) => {
      const payload = row.payload as Record<string, unknown> | null;
      return {
        id: row.id,
        type: row.type as FeedEventType,
        playerId: row.playerId ?? null,
        avatarKey: row.playerAvatarKey ?? null,
        playerName: row.playerNickname ?? null,
        gameSlug: (payload?.gameSlug as string | undefined) ?? null,
        promptI18n: (payload?.promptI18n as Record<string, string> | undefined) ?? null,
        answerI18n: (payload?.answerI18n as Record<string, string> | undefined) ?? null,
        xpDelta: row.xpDelta > 0 ? row.xpDelta : null,
        createdAt: row.createdAt.toISOString(),
      };
    });

    const leaderboardEntries: LeaderboardEntrySnapshot[] = leaderboardRows.map((row, index) => ({
      rank: index + 1,
      playerId: row.playerId,
      avatarKey: row.avatarKey ?? null,
      nickname: row.nickname,
      totalPoints: row.totalXp,
    }));

    const snapshot: ActivityFeedSnapshot = {
      feed,
      leaderboard: leaderboardEntries,
      generatedAt: new Date().toISOString(),
    };

    logServerInfo({
      scope: "api/activity-feed",
      event: "snapshot_generated",
      requestId,
      context: {
        feedCount: feed.length,
        leaderboardCount: leaderboardEntries.length,
      },
    });

    return NextResponse.json(snapshot, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "x-request-id": requestId,
      },
    });
  } catch (err) {
    logServerError({
      scope: "api/activity-feed",
      event: "db_query_failed",
      requestId,
      error: err,
    });

    return makeApiErrorResponse(req, {
      error: "Failed to load activity feed",
      code: "DB_ERROR",
      status: 503,
      requestId,
      retryAfterSeconds: 5,
    });
  }
}
