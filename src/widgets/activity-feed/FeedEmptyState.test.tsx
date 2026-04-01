// @vitest-environment jsdom

import { renderWithAppProviders } from "@/testing/react/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FeedEmptyState } from "./FeedEmptyState";

describe("FeedEmptyState", () => {
  it("renders only the loading slot for the loading variant", () => {
    const { container } = renderWithAppProviders(<FeedEmptyState variant="loading" />);

    expect(screen.getByTestId("live-feed-state-loading")).toHaveAttribute("aria-hidden", "false");
    expect(screen.getByTestId("live-feed-state-empty")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByTestId("live-feed-state-error")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelectorAll(".af-card-scroll")).toHaveLength(0);
    expect(container.querySelector(".af-error-drift")).not.toBeInTheDocument();
  });

  it("renders animated ghost cards for the empty variant", () => {
    const { container } = renderWithAppProviders(<FeedEmptyState variant="empty" />);

    expect(screen.getByTestId("live-feed-state-loading")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByTestId("live-feed-state-empty")).toHaveAttribute("aria-hidden", "false");
    expect(screen.getByTestId("live-feed-state-error")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelectorAll(".af-card-scroll").length).toBeGreaterThan(0);
    expect(container.querySelector(".af-error-drift")).not.toBeInTheDocument();
  });

  it("renders the frozen error treatment for the error variant", () => {
    const { container } = renderWithAppProviders(<FeedEmptyState variant="error" />);

    expect(screen.getByTestId("live-feed-state-loading")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByTestId("live-feed-state-empty")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByTestId("live-feed-state-error")).toHaveAttribute("aria-hidden", "false");
    expect(container.querySelector(".af-error-drift")).toBeInTheDocument();
    expect(container.querySelector(".af-error-icon")).toBeInTheDocument();
    expect(container.querySelectorAll(".af-card-scroll")).toHaveLength(0);
  });
});
