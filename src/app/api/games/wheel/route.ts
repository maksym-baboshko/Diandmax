import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getWheelSegmentById,
  type SupportedLocale,
} from "@/shared/config";
import {
  recordWheelSpin,
  SupabaseConfigurationError,
} from "@/features/game-session/server";

export const runtime = "nodejs";

const wheelPayloadSchema = z.object({
  playerId: z.string().uuid(),
  segmentId: z.string().min(1),
  locale: z.enum(["uk", "en"]),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = wheelPayloadSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid wheel payload.", code: "INVALID_DATA" },
        { status: 400 }
      );
    }

    const segment = getWheelSegmentById(result.data.segmentId);
    if (!segment) {
      return NextResponse.json(
        { error: "Wheel segment was not found.", code: "INVALID_DATA" },
        { status: 400 }
      );
    }

    const wheelResult = await recordWheelSpin({
      playerId: result.data.playerId,
      segment,
      locale: result.data.locale as SupportedLocale,
    });

    return NextResponse.json({
      player: wheelResult.player,
      awardedPoints: wheelResult.awardedPoints,
      segment: {
        id: segment.id,
        type: segment.type,
      },
    });
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

    console.error("Wheel route error:", error);
    return NextResponse.json(
      { error: "Failed to save wheel spin.", code: "PERSISTENCE_ERROR" },
      { status: 500 }
    );
  }
}
