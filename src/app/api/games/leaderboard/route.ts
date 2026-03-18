import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getGameLeaderboard,
  requireAuthenticatedGameUser,
  SupabaseConfigurationError,
  UnauthorizedGameRequestError,
} from "@/features/game-session/server";

export const runtime = "nodejs";

const GAME_SLUGS = [
  "wheel-of-fortune",
  "baby-detective",
  "secret-missions",
  "roast",
  "time-machine",
  "advice-booth",
] as const;

const leaderboardQuerySchema = z.object({
  game: z.enum(GAME_SLUGS),
  topLimit: z.coerce.number().int().min(1).max(10).optional(),
  radius: z.coerce.number().int().min(1).max(3).optional(),
});

export async function GET(request: Request) {
  try {
    const user = await requireAuthenticatedGameUser(request);
    const { searchParams } = new URL(request.url);
    const result = leaderboardQuerySchema.safeParse({
      game: searchParams.get("game"),
      topLimit: searchParams.get("topLimit") ?? undefined,
      radius: searchParams.get("radius") ?? undefined,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid leaderboard query.", code: "INVALID_DATA" },
        { status: 400 }
      );
    }

    const leaderboard = await getGameLeaderboard({
      gameSlug: result.data.game,
      playerId: user.id,
      topLimit: result.data.topLimit ?? 5,
      windowRadius: result.data.radius ?? 2,
    });

    return NextResponse.json(
      { leaderboard },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    if (error instanceof UnauthorizedGameRequestError) {
      return NextResponse.json(
        { error: "Unauthorized game request.", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    if (error instanceof SupabaseConfigurationError) {
      return NextResponse.json(
        { error: "Supabase is not configured.", code: "SUPABASE_NOT_CONFIGURED" },
        { status: 503 }
      );
    }

    console.error("Games leaderboard route error:", error);
    return NextResponse.json(
      { error: "Failed to read game leaderboard.", code: "PERSISTENCE_ERROR" },
      { status: 500 }
    );
  }
}
