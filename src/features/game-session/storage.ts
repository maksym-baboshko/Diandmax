"use client";

import type { PlayerSessionSnapshot } from "./types";

const PLAYER_SESSION_STORAGE_KEY = "big-day.games.player-session.v1";
const playerSessionListeners = new Set<() => void>();

function isPlayerSessionSnapshot(
  value: unknown
): value is PlayerSessionSnapshot {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<PlayerSessionSnapshot>;

  return (
    typeof candidate.playerId === "string" &&
    typeof candidate.clientSessionId === "string" &&
    typeof candidate.nickname === "string" &&
    typeof candidate.totalPoints === "number"
  );
}

export function readStoredPlayerSession() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(PLAYER_SESSION_STORAGE_KEY);
    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(rawValue) as unknown;
    return isPlayerSessionSnapshot(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
}

export function writeStoredPlayerSession(session: PlayerSessionSnapshot) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    PLAYER_SESSION_STORAGE_KEY,
    JSON.stringify(session)
  );
  playerSessionListeners.forEach((listener) => listener());
}

export function clearStoredPlayerSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(PLAYER_SESSION_STORAGE_KEY);
  playerSessionListeners.forEach((listener) => listener());
}

export function subscribeToPlayerSession(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === PLAYER_SESSION_STORAGE_KEY) {
      callback();
    }
  };

  playerSessionListeners.add(callback);
  window.addEventListener("storage", handleStorage);

  return () => {
    playerSessionListeners.delete(callback);
    window.removeEventListener("storage", handleStorage);
  };
}

export function getPlayerSessionSnapshot() {
  return readStoredPlayerSession();
}

export function getServerPlayerSessionSnapshot() {
  return null;
}
