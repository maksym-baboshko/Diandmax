import { NextResponse } from "next/server";
import { z } from "zod";
import type { SupportedLocale } from "@/shared/config";
import {
  getOpenWheelRound,
  InvalidWheelRoundResponseError,
  PlayerProfileNotReadyError,
  requireAuthenticatedGameUser,
  startWheelRound,
  SupabaseConfigurationError,
  UnauthorizedGameRequestError,
  WheelRoundAlreadyResolvedError,
  WheelRoundNotFoundError,
  WheelTasksDepletedError,
} from "@/features/game-session/server";

export const runtime = "nodejs";

const wheelStartSchema = z.object({
  locale: z.enum(["uk", "en"]),
});

function getLocaleFromRequest(request: Request) {
  const { searchParams } = new URL(request.url);
  const result = z.enum(["uk", "en"]).safeParse(searchParams.get("locale"));

  return result.success ? (result.data as SupportedLocale) : null;
}

export async function GET(request: Request) {
  try {
    const locale = getLocaleFromRequest(request);

    if (!locale) {
      return NextResponse.json(
        { error: "Invalid wheel read payload.", code: "INVALID_DATA" },
        { status: 400 }
      );
    }

    const user = await requireAuthenticatedGameUser(request);
    const wheelRound = await getOpenWheelRound({
      playerId: user.id,
      locale,
    });

    return NextResponse.json(wheelRound, {
      headers: {
        "Cache-Control": "no-store",
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

    if (error instanceof UnauthorizedGameRequestError) {
      return NextResponse.json(
        {
          error: "Unauthorized game request.",
          code: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }

    if (error instanceof PlayerProfileNotReadyError) {
      return NextResponse.json(
        {
          error: "Player profile is not ready yet.",
          code: "PLAYER_NOT_FOUND",
        },
        { status: 409 }
      );
    }

    console.error("Wheel read route error:", error);
    return NextResponse.json(
      { error: "Failed to read wheel round.", code: "PERSISTENCE_ERROR" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuthenticatedGameUser(request);
    const body = await request.json();
    const result = wheelStartSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid wheel start payload.", code: "INVALID_DATA" },
        { status: 400 }
      );
    }

    const wheelRound = await startWheelRound({
      playerId: user.id,
      locale: result.data.locale as SupportedLocale,
    });

    return NextResponse.json(wheelRound);
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

    if (error instanceof UnauthorizedGameRequestError) {
      return NextResponse.json(
        {
          error: "Unauthorized game request.",
          code: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }

    if (error instanceof PlayerProfileNotReadyError) {
      return NextResponse.json(
        {
          error: "Player profile is not ready yet.",
          code: "PLAYER_NOT_FOUND",
        },
        { status: 409 }
      );
    }

    if (error instanceof WheelTasksDepletedError) {
      return NextResponse.json(
        {
          error: "No wheel tasks remain for this player.",
          code: "NO_TASKS_LEFT",
        },
        { status: 409 }
      );
    }

    if (error instanceof WheelRoundNotFoundError) {
      return NextResponse.json(
        {
          error: "Wheel round was not found.",
          code: "ROUND_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    if (error instanceof WheelRoundAlreadyResolvedError) {
      return NextResponse.json(
        {
          error: "Wheel round is already resolved.",
          code: "ROUND_ALREADY_RESOLVED",
        },
        { status: 409 }
      );
    }

    if (error instanceof InvalidWheelRoundResponseError) {
      return NextResponse.json(
        {
          error: "Wheel round response is invalid.",
          code: "INVALID_DATA",
        },
        { status: 400 }
      );
    }

    console.error("Wheel route error:", error);
    return NextResponse.json(
      { error: "Failed to start wheel round.", code: "PERSISTENCE_ERROR" },
      { status: 500 }
    );
  }
}
