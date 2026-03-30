import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { installMockMatchMedia, resetMockMatchMedia } from "@/testing/react/match-media";
import { createElement } from "react";
import { afterEach, beforeAll, vi } from "vitest";

function createMemoryStorage(): Storage {
  const storage = new Map<string, string>();

  return {
    get length() {
      return storage.size;
    },
    clear() {
      storage.clear();
    },
    getItem(key) {
      return storage.get(key) ?? null;
    },
    key(index) {
      return [...storage.keys()][index] ?? null;
    },
    removeItem(key) {
      storage.delete(key);
    },
    setItem(key, value) {
      storage.set(key, value);
    },
  };
}

vi.mock("next/image", () => ({
  default: ({
    alt = "",
    fill: _fill,
    priority: _priority,
    quality: _quality,
    sizes: _sizes,
    loader: _loader,
    blurDataURL: _blurDataURL,
    placeholder: _placeholder,
    ...props
  }: Record<string, unknown>) => createElement("img", { alt, ...props }),
}));

beforeAll(() => {
  if (typeof window === "undefined") {
    return;
  }

  const globalWindow = globalThis as typeof globalThis &
    Window & {
      IntersectionObserver?: typeof IntersectionObserver;
      cancelAnimationFrame?: (id: number) => void;
      localStorage?: Storage;
      requestAnimationFrame?: (callback: FrameRequestCallback) => number;
      sessionStorage?: Storage;
    };

  installMockMatchMedia();
  (
    globalThis as typeof globalThis & {
      IS_REACT_ACT_ENVIRONMENT?: boolean;
    }
  ).IS_REACT_ACT_ENVIRONMENT = true;
  const scheduleTimeout = globalWindow.setTimeout as unknown as (
    handler: TimerHandler,
    timeout?: number,
  ) => number;
  const clearScheduledTimeout = globalWindow.clearTimeout as unknown as (id: number) => void;

  if (typeof globalWindow.requestAnimationFrame !== "function") {
    globalWindow.requestAnimationFrame = (callback: FrameRequestCallback) =>
      scheduleTimeout(() => callback(Date.now()), 16);
    globalWindow.cancelAnimationFrame = (id: number) => clearScheduledTimeout(id);
  }

  Object.defineProperty(globalWindow, "localStorage", {
    configurable: true,
    value: createMemoryStorage(),
  });

  Object.defineProperty(globalWindow, "sessionStorage", {
    configurable: true,
    value: createMemoryStorage(),
  });

  if (typeof globalWindow.IntersectionObserver === "undefined") {
    class MockIntersectionObserver implements IntersectionObserver {
      readonly root = null;
      readonly rootMargin = "";
      readonly thresholds = [];

      constructor(private readonly callback: IntersectionObserverCallback) {}

      disconnect(): void {}

      observe(target: Element): void {
        this.callback(
          [
            {
              boundingClientRect: target.getBoundingClientRect(),
              intersectionRatio: 1,
              intersectionRect: target.getBoundingClientRect(),
              isIntersecting: true,
              rootBounds: null,
              target,
              time: Date.now(),
            },
          ],
          this,
        );
      }

      takeRecords(): IntersectionObserverEntry[] {
        return [];
      }

      unobserve(): void {}
    }

    globalWindow.IntersectionObserver = MockIntersectionObserver;
    globalThis.IntersectionObserver = MockIntersectionObserver;
  }

  globalWindow.scrollTo = vi.fn();
});

afterEach(() => {
  if (typeof document !== "undefined") {
    cleanup();
    document.documentElement.className = "";
    document.documentElement.lang = "uk";
    document.documentElement.dataset.scrollBehavior = "smooth";
    document.body.style.overflow = "";
    document.cookie = "";
  }

  if (typeof window !== "undefined") {
    resetMockMatchMedia();
    window.localStorage?.clear();
    window.sessionStorage?.clear();
  }
});
