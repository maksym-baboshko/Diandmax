"use client";

import { mockActivityFeedSource } from "@/entities/event";
import type {
  ActivityFeedSnapshot,
  ActivityFeedSource,
  FeedEventSnapshot,
  LiveFeedState,
} from "@/entities/event";
import { startTransition, useCallback, useEffect, useRef, useState } from "react";
import { HERO_EVENT_DURATION_MS, filterQueueableHeroEvents } from "./activity-feed-helpers";

interface UseActivityFeedSnapshotResult {
  snapshot: ActivityFeedSnapshot | null;
  state: LiveFeedState;
  heroEvent: FeedEventSnapshot | null;
}

interface UseActivityFeedSnapshotOptions {
  initialState?: Exclude<LiveFeedState, "loading">;
  source?: ActivityFeedSource;
}

export function useActivityFeedSnapshot({
  initialState = "populated",
  source = mockActivityFeedSource,
}: UseActivityFeedSnapshotOptions = {}): UseActivityFeedSnapshotResult {
  const [snapshot, setSnapshot] = useState<ActivityFeedSnapshot | null>(null);
  const [state, setState] = useState<LiveFeedState>("loading");
  const [heroEvent, setHeroEvent] = useState<FeedEventSnapshot | null>(null);

  const heroTimeoutRef = useRef<number | null>(null);
  const heroQueueRef = useRef<FeedEventSnapshot[]>([]);
  const activeHeroEventIdRef = useRef<string | null>(null);

  const showNextHeroEvent = useCallback(() => {
    if (heroTimeoutRef.current) {
      window.clearTimeout(heroTimeoutRef.current);
    }

    const nextHeroEvent = heroQueueRef.current.shift() ?? null;
    activeHeroEventIdRef.current = nextHeroEvent?.id ?? null;
    setHeroEvent(nextHeroEvent);

    if (!nextHeroEvent) {
      heroTimeoutRef.current = null;
      return;
    }

    heroTimeoutRef.current = window.setTimeout(() => {
      showNextHeroEvent();
    }, HERO_EVENT_DURATION_MS);
  }, []);

  const queueHeroEvents = useCallback(
    (nextHeroEvents: FeedEventSnapshot[]) => {
      if (nextHeroEvents.length === 0) {
        return;
      }

      const queuedHeroIds = new Set(heroQueueRef.current.map((event) => event.id));
      const uniqueHeroEvents = filterQueueableHeroEvents(
        nextHeroEvents,
        activeHeroEventIdRef.current,
        queuedHeroIds,
      );

      if (uniqueHeroEvents.length === 0) {
        return;
      }

      heroQueueRef.current.push(...uniqueHeroEvents);

      if (!activeHeroEventIdRef.current) {
        showNextHeroEvent();
      }
    },
    [showNextHeroEvent],
  );

  useEffect(() => {
    let isCancelled = false;

    startTransition(() => {
      setSnapshot(null);
      setState("loading");
      setHeroEvent(null);
    });

    heroQueueRef.current = [];
    activeHeroEventIdRef.current = null;

    void source
      .getSnapshot(initialState)
      .then((nextSnapshot) => {
        if (isCancelled) {
          return;
        }

        startTransition(() => {
          setSnapshot(nextSnapshot);
          setState(nextSnapshot.feed.length > 0 ? "populated" : "empty");
        });

        if (initialState === "populated") {
          queueHeroEvents([...filterQueueableHeroEvents(nextSnapshot.feed)].reverse());
        }
      })
      .catch(() => {
        if (isCancelled) {
          return;
        }

        startTransition(() => {
          setSnapshot(null);
          setState("error");
        });
      });

    return () => {
      isCancelled = true;

      if (heroTimeoutRef.current) {
        window.clearTimeout(heroTimeoutRef.current);
      }

      heroQueueRef.current = [];
      activeHeroEventIdRef.current = null;
    };
  }, [initialState, queueHeroEvents, source]);

  return { snapshot, state, heroEvent };
}
