"use client";

import { useSyncExternalStore } from "react";

const MEDIA_QUERIES = [
  "(prefers-reduced-motion: reduce)",
  "(hover: none) and (pointer: coarse)",
  "(max-width: 767px)",
] as const;

function getServerSnapshot() {
  return false;
}

function getSnapshot() {
  if (typeof window === "undefined") {
    return false;
  }

  return MEDIA_QUERIES.some((query) => window.matchMedia(query).matches);
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const cleanups = MEDIA_QUERIES.map((query) => {
    const mediaQuery = window.matchMedia(query);
    const handler = () => callback();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }

    mediaQuery.addListener(handler);
    return () => mediaQuery.removeListener(handler);
  });

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}

export function useLiteMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
