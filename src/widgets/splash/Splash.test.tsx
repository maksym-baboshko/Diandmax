// @vitest-environment jsdom

import { renderWithAppProviders } from "@/testing/react/render";
import { act, screen } from "@testing-library/react";
import type { ComponentProps, ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Splash } from "./Splash";

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();

  return {
    ...actual,
    AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
    motion: new Proxy(
      {},
      {
        get:
          () =>
          ({ children, ...props }: ComponentProps<"div">) => <div {...props}>{children}</div>,
      },
    ),
  };
});

describe("Splash", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the splash only on first visit and persists the seen flag", async () => {
    renderWithAppProviders(<Splash />);

    expect(screen.getByTestId("splash-overlay")).toBeInTheDocument();
    expect(window.sessionStorage.getItem("splashSeen")).toBe("true");

    act(() => {
      vi.advanceTimersByTime(3499);
    });

    expect(screen.getByTestId("splash-overlay")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(screen.queryByTestId("splash-overlay")).not.toBeInTheDocument();
  });

  it("skips the splash when the session flag already exists", () => {
    window.sessionStorage.setItem("splashSeen", "true");

    renderWithAppProviders(<Splash />);

    expect(screen.queryByTestId("splash-overlay")).not.toBeInTheDocument();
  });
});
