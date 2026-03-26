import { expect, test } from "@playwright/test";

test.describe("/live page", () => {
  test("renders the loading state and then the empty state", async ({ page }) => {
    await page.goto("/live?state=empty");

    await expect(page.locator('[data-testid="live-projector-page"]')).toBeVisible();
    await expect(page.getByTestId("live-feed-state-loading")).toHaveAttribute(
      "aria-hidden",
      "false",
    );
    await expect(page.getByTestId("live-feed-state-loading")).toContainText(
      "Завантажуємо стрічку...",
    );
    await expect(page.getByTestId("live-feed-state-empty")).toHaveAttribute("aria-hidden", "false");
    await expect(page.getByTestId("live-feed-state-empty")).toContainText("Поки тут тихо...");
    await expect(page.getByTestId("live-leaderboard-state-skeleton")).toBeVisible();
  });

  test("renders populated feed and leaderboard cards from the mock snapshot", async ({ page }) => {
    await page.goto("/live?state=populated");

    const olenaFeedCard = page.locator(
      '[data-testid="feed-event-card"][data-event-id="event-1"]:visible',
    );
    const tarasFeedCard = page.locator(
      '[data-testid="feed-event-card"][data-event-id="event-2"]:visible',
    );
    const olenaLeaderboardRow = page
      .getByTestId("leaderboard-row")
      .filter({ hasText: "Олена" })
      .first();
    const tarasLeaderboardRow = page
      .getByTestId("leaderboard-row")
      .filter({ hasText: "Тарас" })
      .first();

    await expect(olenaFeedCard).toBeVisible();
    await expect(olenaFeedCard).toContainText("Wheel Of Fortune");
    await expect(olenaFeedCard).toContainText(
      "— Коли почала сміятися ще до того, як він договорив.",
    );
    await expect(tarasFeedCard).toBeVisible();
    await expect(olenaLeaderboardRow).toContainText("210");
    await expect(tarasLeaderboardRow).toContainText("184");
  });

  test("shows the queued hero overlay for the populated mock snapshot", async ({ page }) => {
    await page.goto("/live?state=populated");

    await expect(
      page
        .getByTestId("hero-event-overlay")
        .getByText("Вийшов на перше місце глобального рейтингу."),
    ).toBeVisible();
  });

  test("preserves the redesigned error state for the mock error scenario", async ({ page }) => {
    await page.goto("/live?state=error");

    await expect(page.getByTestId("live-feed-state-error")).toHaveAttribute("aria-hidden", "false");
    await expect(page.getByTestId("live-feed-state-error")).toContainText("Зв'язок перервано");
    await expect(page.getByTestId("live-feed-state-error")).toContainText(
      "Сервер тимчасово недоступний — спробуємо підключитися автоматично.",
    );
    await expect(page.getByTestId("live-leaderboard-state-error")).toBeVisible();
  });

  test("page is marked noindex", async ({ page }) => {
    await page.goto("/live?state=empty");

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("/en/live renders the English empty state", async ({ page }) => {
    await page.goto("/en/live?state=empty");

    await expect(page.locator('[data-testid="live-projector-page"]')).toBeVisible();
    await expect(page.getByTestId("live-feed-state-empty")).toHaveAttribute("aria-hidden", "false");
    await expect(page.getByTestId("live-feed-state-empty")).toContainText("Still quiet here...");
  });
});

test.describe("/live page — mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("renders the empty state on a mobile viewport", async ({ page }) => {
    await page.goto("/live?state=empty");

    await expect(page.locator('[data-testid="live-projector-page"]')).toBeVisible();
    await expect(page.getByTestId("live-feed-state-empty")).toHaveAttribute("aria-hidden", "false");
  });
});
