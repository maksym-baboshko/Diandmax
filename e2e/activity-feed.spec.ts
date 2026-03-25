import { expect, test } from "@playwright/test";

test.describe("/live page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/live");
  });

  test("renders the activity feed page", async ({ page }) => {
    await expect(page.locator('[data-testid="live-projector-page"]')).toBeVisible();
  });

  test("shows LIVE indicator in header", async ({ page }) => {
    await expect(page.getByText("Live").first()).toBeVisible();
  });

  test("shows the live clock", async ({ page }) => {
    // Clock is desktop-only — check it's rendered (may be visually hidden on small viewport)
    await expect(page.locator("time")).toBeAttached();
  });

  test("shows feed panel — either events or empty state", async ({ page }) => {
    // Either real feed cards or the empty state glitch LIVE text
    const feedOrEmpty = page.locator('[class*="rounded-3xl"]').or(page.getByText("LIVE").first());
    await expect(feedOrEmpty.first()).toBeVisible();
  });

  test("page is marked noindex", async ({ page }) => {
    const metaRobots = await page.locator('meta[name="robots"]').getAttribute("content");
    expect(metaRobots).toContain("noindex");
  });

  test("/en/live renders in English locale", async ({ page }) => {
    await page.goto("/en/live");
    await expect(page.locator('[data-testid="live-projector-page"]')).toBeVisible();
  });
});
