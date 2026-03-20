import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getLivePageSnapshot,
  SupabaseConfigurationError,
} from "@/features/game-session/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const liveQuerySchema = z.object({
  leaderboardLimit: z.coerce.number().int().min(1).max(10).optional(),
  feedLimit: z.coerce.number().int().min(1).max(10).optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = liveQuerySchema.safeParse({
      leaderboardLimit: searchParams.get("leaderboardLimit") ?? undefined,
      feedLimit: searchParams.get("feedLimit") ?? undefined,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid live snapshot query.", code: "INVALID_DATA" },
        { status: 400 }
      );
    }

    const snapshot = await getLivePageSnapshot({
      leaderboardLimit: result.data.leaderboardLimit ?? 10,
      feedLimit: result.data.feedLimit ?? 5,
    });

    return NextResponse.json(snapshot, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) {
      return NextResponse.json(
        { error: "Supabase is not configured.", code: "SUPABASE_NOT_CONFIGURED" },
        { status: 503 }
      );
    }

    console.error("Live snapshot route error:", error);
    return NextResponse.json(
      { error: "Failed to read live snapshot.", code: "PERSISTENCE_ERROR" },
      { status: 500 }
    );
  }
}
