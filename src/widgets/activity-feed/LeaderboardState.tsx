"use client";

import { LeaderboardEmptyState } from "./LeaderboardEmptyState";

interface LeaderboardStateProps {
  variant?: "loading" | "error";
}

export function LeaderboardState({ variant = "loading" }: LeaderboardStateProps) {
  return <LeaderboardEmptyState variant={variant} />;
}
