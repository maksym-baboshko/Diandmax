import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getPlayerSnapshotByClientSessionId,
  savePlayerSession,
  SupabaseConfigurationError,
} from "@/features/game-session/server";

export const runtime = "nodejs";

const playerPayloadSchema = z.object({
  clientSessionId: z.string().uuid(),
  nickname: z
    .string()
    .trim()
    .min(2)
    .max(40)
    .transform((value) => value.replace(/\s+/g, " ")),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientSessionId = searchParams.get("clientSessionId");
    const result = z.string().uuid().safeParse(clientSessionId);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid client session id.", code: "INVALID_DATA" },
        { status: 400 }
      );
    }

    const player = await getPlayerSnapshotByClientSessionId(result.data);
    if (!player) {
      return NextResponse.json(
        { error: "Player was not found.", code: "PLAYER_NOT_FOUND" },
        { status: 404 }
      );
    }

    return NextResponse.json({ player });
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) {
      return NextResponse.json(
        {
          error: "Supabase is not configured.",
          code: "SUPABASE_NOT_CONFIGURED",
        },
        { status: 503 }
      );
    }

    console.error("Games player GET error:", error);
    return NextResponse.json(
      { error: "Failed to read player session.", code: "PERSISTENCE_ERROR" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = playerPayloadSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid player payload.", code: "INVALID_DATA" },
        { status: 400 }
      );
    }

    const player = await savePlayerSession(result.data);
    return NextResponse.json({ player });
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) {
      return NextResponse.json(
        {
          error: "Supabase is not configured.",
          code: "SUPABASE_NOT_CONFIGURED",
        },
        { status: 503 }
      );
    }

    console.error("Games player POST error:", error);
    return NextResponse.json(
      { error: "Failed to save player session.", code: "PERSISTENCE_ERROR" },
      { status: 500 }
    );
  }
}
