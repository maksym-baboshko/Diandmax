"use client";

import { AnimatePresence } from "motion/react";
import { LeaderboardRow } from "./LeaderboardRow";
import type { LeaderboardEntrySnapshot } from "./types";

interface LeaderboardListProps {
  entries: LeaderboardEntrySnapshot[];
}

export function LeaderboardList({ entries }: LeaderboardListProps) {
  return (
    <div className="grid gap-3" data-testid="leaderboard-list">
      <AnimatePresence mode="popLayout" initial={false}>
        {entries.map((entry) => (
          <LeaderboardRow key={entry.playerId} entry={entry} isLeader={entry.rank === 1} />
        ))}
      </AnimatePresence>
    </div>
  );
}
