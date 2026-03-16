"use client";

import {
  useEffect,
  useEffectEvent,
  useState,
  useSyncExternalStore,
} from "react";
import {
  clearStoredPlayerSession,
  getPlayerSessionSnapshot,
  getServerPlayerSessionSnapshot,
  subscribeToPlayerSession,
  writeStoredPlayerSession,
} from "./storage";
import type {
  GameApiErrorCode,
  PlayerApiResponse,
  PlayerSessionSnapshot,
} from "./types";

interface ApiErrorPayload {
  code?: GameApiErrorCode;
}

function getMountedSnapshot() {
  return true;
}

function getServerMountedSnapshot() {
  return false;
}

function createClientSessionId() {
  if (typeof window === "undefined") {
    return "";
  }

  if (typeof window.crypto?.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));
  return [
    hex.slice(0, 4).join(""),
    hex.slice(4, 6).join(""),
    hex.slice(6, 8).join(""),
    hex.slice(8, 10).join(""),
    hex.slice(10, 16).join(""),
  ].join("-");
}

async function readApiErrorCode(response: Response) {
  try {
    const payload = (await response.json()) as ApiErrorPayload;
    return payload.code ?? "PERSISTENCE_ERROR";
  } catch {
    return "PERSISTENCE_ERROR";
  }
}

async function fetchPlayerSnapshot(clientSessionId: string) {
  const response = await fetch(
    `/api/games/player?clientSessionId=${encodeURIComponent(clientSessionId)}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return {
      player: null,
      status: response.status,
      errorCode: await readApiErrorCode(response),
    };
  }

  const payload = (await response.json()) as PlayerApiResponse;
  return { player: payload.player, status: response.status, errorCode: null };
}

async function savePlayerSession(
  clientSessionId: string,
  nickname: string
) {
  const response = await fetch("/api/games/player", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ clientSessionId, nickname }),
  });

  if (!response.ok) {
    return {
      player: null,
      status: response.status,
      errorCode: await readApiErrorCode(response),
    };
  }

  const payload = (await response.json()) as PlayerApiResponse;
  return { player: payload.player, status: response.status, errorCode: null };
}

export function usePlayerSession() {
  const mounted = useSyncExternalStore(
    () => () => {},
    getMountedSnapshot,
    getServerMountedSnapshot
  );
  const session = useSyncExternalStore(
    subscribeToPlayerSession,
    getPlayerSessionSnapshot,
    getServerPlayerSessionSnapshot
  );
  const [isSaving, setIsSaving] = useState(false);
  const [errorCode, setErrorCode] = useState<GameApiErrorCode | null>(null);

  function applySnapshot(nextSession: PlayerSessionSnapshot) {
    writeStoredPlayerSession(nextSession);
    setErrorCode(null);
  }

  const syncStoredSession = useEffectEvent(
    async ({
      clientSessionId,
      nickname,
    }: {
      clientSessionId: string;
      nickname: string;
    }) => {
      const existingPlayer = await fetchPlayerSnapshot(clientSessionId);

      if (existingPlayer.player) {
        applySnapshot(existingPlayer.player);
        return;
      }

      if (existingPlayer.status === 404) {
        const recreatedPlayer = await savePlayerSession(clientSessionId, nickname);

        if (recreatedPlayer.player) {
          applySnapshot(recreatedPlayer.player);
          return;
        }

        setErrorCode(recreatedPlayer.errorCode);
        return;
      }

      setErrorCode(existingPlayer.errorCode);
    }
  );

  useEffect(() => {
    if (!mounted || !session?.clientSessionId || !session.nickname) {
      return;
    }

    void syncStoredSession({
      clientSessionId: session.clientSessionId,
      nickname: session.nickname,
    });
  }, [mounted, session?.clientSessionId, session?.nickname]);

  async function registerPlayer(nickname: string) {
    setIsSaving(true);
    setErrorCode(null);

    const clientSessionId = session?.clientSessionId || createClientSessionId();
    const response = await savePlayerSession(clientSessionId, nickname);

    if (!response.player) {
      setErrorCode(response.errorCode);
      setIsSaving(false);
      return null;
    }

    applySnapshot(response.player);
    setIsSaving(false);
    return response.player;
  }

  function clearPlayer() {
    clearStoredPlayerSession();
    setErrorCode(null);
  }

  function updatePlayerSnapshot(nextSession: PlayerSessionSnapshot) {
    applySnapshot(nextSession);
  }

  return {
    session,
    isHydrating: !mounted,
    isSaving,
    errorCode,
    registerPlayer,
    clearPlayer,
    updatePlayerSnapshot,
  };
}
