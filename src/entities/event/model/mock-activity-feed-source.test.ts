import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  MOCK_EMPTY_ACTIVITY_FEED_SNAPSHOT,
  MOCK_POPULATED_ACTIVITY_FEED_SNAPSHOT,
  mockActivityFeedSource,
  resolveLiveFeedState,
} from "./mock-activity-feed-source";

describe("mockActivityFeedSource", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("window", { setTimeout: globalThis.setTimeout });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("returns a cloned populated snapshot by default", async () => {
    const snapshotPromise = mockActivityFeedSource.getSnapshot();

    await vi.advanceTimersByTimeAsync(680);

    const snapshot = await snapshotPromise;

    expect(snapshot).toEqual(MOCK_POPULATED_ACTIVITY_FEED_SNAPSHOT);
    expect(snapshot).not.toBe(MOCK_POPULATED_ACTIVITY_FEED_SNAPSHOT);
  });

  it("returns the empty snapshot when requested", async () => {
    const snapshotPromise = mockActivityFeedSource.getSnapshot("empty");

    await vi.advanceTimersByTimeAsync(680);

    await expect(snapshotPromise).resolves.toEqual(MOCK_EMPTY_ACTIVITY_FEED_SNAPSHOT);
  });

  it("throws for the mock error state", async () => {
    const snapshotPromise = mockActivityFeedSource.getSnapshot("error");
    const rejection = expect(snapshotPromise).rejects.toThrow("Mock activity feed is unavailable.");

    await vi.advanceTimersByTimeAsync(680);

    await rejection;
  });
});

describe("resolveLiveFeedState", () => {
  it("accepts the supported live states", () => {
    expect(resolveLiveFeedState("populated")).toBe("populated");
    expect(resolveLiveFeedState("empty")).toBe("empty");
    expect(resolveLiveFeedState("error")).toBe("error");
  });

  it("falls back to populated for unknown states", () => {
    expect(resolveLiveFeedState(undefined)).toBe("populated");
    expect(resolveLiveFeedState("unexpected")).toBe("populated");
  });
});
