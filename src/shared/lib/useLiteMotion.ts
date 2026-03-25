"use client";

import { useSyncExternalStore } from "react";

/**
 * Returns true when the user prefers reduced motion, is on a touch-only device,
 * or is on a small screen. Use this to tone down heavy animations.
 */
const MEDIA_QUERIES = [
  "(prefers-reduced-motion: reduce)",
  "(hover: none) and (pointer: coarse)",
  "(max-width: 767px)",
] as const;

function getServerSnapshot() {
  return false;
}

function getSnapshot() {
  if (typeof window === "undefined") return false;
  return MEDIA_QUERIES.some((q) => window.matchMedia(q).matches);
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const cleanups = MEDIA_QUERIES.map((q) => {
    const mq = window.matchMedia(q);
    const handler = () => callback();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  });

  return () => {
    for (const cleanup of cleanups) cleanup();
  };
}

export function useLiteMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
