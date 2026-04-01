// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildThresholds,
  formatTranslate,
  getIntersectionRatio,
  getNavigationType,
  resolveRevealMotion,
} from "./reveal-shared";

describe("reveal-shared", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("reads the current navigation type when a navigation entry is available", () => {
    vi.spyOn(window.performance, "getEntriesByType").mockReturnValue([
      { type: "reload" } as PerformanceNavigationTiming,
    ]);

    expect(getNavigationType()).toBe("reload");
  });

  it("returns null when navigation entries are missing or malformed", () => {
    vi.spyOn(window.performance, "getEntriesByType").mockReturnValue([]);
    expect(getNavigationType()).toBeNull();

    vi.spyOn(window.performance, "getEntriesByType").mockReturnValue([
      {} as PerformanceNavigationTiming,
    ]);
    expect(getNavigationType()).toBeNull();
  });

  it("normalizes thresholds into a unique ordered set", () => {
    expect(buildThresholds(-1)).toEqual([0, 1]);
    expect(buildThresholds(0.35)).toEqual([0, 0.35, 1]);
    expect(buildThresholds(2)).toEqual([0, 1]);
  });

  it("measures the visible intersection ratio inside the viewport", () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 100 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 100 });

    const node = {
      getBoundingClientRect: () =>
        ({
          bottom: 100,
          height: 100,
          left: -50,
          right: 50,
          top: 0,
          width: 100,
        }) as DOMRect,
    } as Element;

    expect(getIntersectionRatio(node)).toBe(0.5);
  });

  it("returns zero when the element has no visible area", () => {
    const node = {
      getBoundingClientRect: () =>
        ({
          bottom: 0,
          height: 0,
          left: 0,
          right: 0,
          top: 0,
          width: 0,
        }) as DOMRect,
    } as Element;

    expect(getIntersectionRatio(node)).toBe(0);
  });

  it("formats translate values and resolves full-motion offsets with blur", () => {
    expect(formatTranslate(12, -8)).toBe("translate3d(12px, -8px, 0)");

    expect(resolveRevealMotion("down-right", false, 0.7, 0.3, true)).toEqual({
      backdropBlur: "blur(18px)",
      delay: 0.3,
      duration: 0.7,
      x: -80,
      y: -80,
    });
  });

  it("uses lite offsets and clamps duration and delay in lite motion", () => {
    expect(resolveRevealMotion("up-left", true, 0.8, 0.4, true)).toEqual({
      backdropBlur: undefined,
      delay: 0.12,
      duration: 0.45,
      x: 20,
      y: 20,
    });
  });
});
