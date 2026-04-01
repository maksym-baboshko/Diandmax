type ChangeListener = (event: MediaQueryListEvent) => void;

const defaultMatches = new Map<string, boolean>([
  ["(prefers-color-scheme: dark)", false],
  ["(prefers-reduced-motion: reduce)", true],
  ["(hover: none) and (pointer: coarse)", false],
  ["(max-width: 767px)", false],
  ["(min-width: 1024px)", false],
]);

const queryMatches = new Map(defaultMatches);
const listeners = new Map<string, Set<ChangeListener>>();

function ensureListenerBucket(query: string): Set<ChangeListener> {
  let bucket = listeners.get(query);

  if (!bucket) {
    bucket = new Set();
    listeners.set(query, bucket);
  }

  return bucket;
}

function createMediaQueryList(query: string): MediaQueryList {
  return {
    get matches() {
      return queryMatches.get(query) ?? false;
    },
    media: query,
    onchange: null,
    addEventListener: (_type: string, listener: ChangeListener) => {
      ensureListenerBucket(query).add(listener);
    },
    removeEventListener: (_type: string, listener: ChangeListener) => {
      ensureListenerBucket(query).delete(listener);
    },
    addListener: (listener: ChangeListener) => {
      ensureListenerBucket(query).add(listener);
    },
    removeListener: (listener: ChangeListener) => {
      ensureListenerBucket(query).delete(listener);
    },
    dispatchEvent: (event: Event) => {
      const mediaEvent = event as MediaQueryListEvent;

      for (const listener of ensureListenerBucket(query)) {
        listener(mediaEvent);
      }

      return true;
    },
  } as MediaQueryList;
}

export function installMockMatchMedia(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.matchMedia = (query: string) => createMediaQueryList(query);
}

export function setMockMatchMedia(query: string, matches: boolean): void {
  queryMatches.set(query, matches);
  const event = { matches, media: query } as MediaQueryListEvent;

  for (const listener of ensureListenerBucket(query)) {
    listener(event);
  }
}

export function resetMockMatchMedia(): void {
  queryMatches.clear();

  for (const [query, matches] of defaultMatches) {
    queryMatches.set(query, matches);
  }

  listeners.clear();
}
