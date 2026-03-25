"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ActivityFeedSnapshot } from "./types";

const POLL_INTERVAL_MS = 30_000;
const FETCH_URL = "/api/activity-feed?feed_limit=20&leaderboard_limit=30";

export function useActivityFeedSnapshot(): {
  snapshot: ActivityFeedSnapshot | null;
  isLoading: boolean;
  error: boolean;
} {
  const [snapshot, setSnapshot] = useState<ActivityFeedSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const snapshotRef = useRef(snapshot);
  snapshotRef.current = snapshot;

  const fetchSnapshot = useCallback(async () => {
    try {
      const res = await fetch(FETCH_URL);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = (await res.json()) as ActivityFeedSnapshot;
      setSnapshot(data);
      setError(false);
      setIsLoading(false);
    } catch {
      setError(true);
      // Keep previous snapshot; only stop loading if we had one
      if (snapshotRef.current !== null) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void fetchSnapshot();

    const intervalId = setInterval(() => {
      void fetchSnapshot();
    }, POLL_INTERVAL_MS);

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        void fetchSnapshot();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchSnapshot]);

  return { snapshot, isLoading, error };
}
