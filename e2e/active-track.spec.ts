import { expect, test, type Page } from "@playwright/test";

type Preference = { trackId: "flutter" | "backend"; isDefault: boolean };

async function selectTrack(page: Page, name: string) {
  await page.locator(".active-track-selector .filter-trigger").click();
  await page.getByRole("dialog").locator(".track-filter-option").filter({ hasText: name }).click();
}

async function authenticate(page: Page, preferences: Preference[]) {
  await page.addInitScript(() => localStorage.setItem("playwright-authenticated", "true"));
  await page.route("http://127.0.0.1:3001/v1/**", async (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith("/tracks")) return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ tracks: [{ id: "flutter", slug: "flutter", name: "Flutter" }, { id: "backend", slug: "backend", name: "Backend" }] }) });
    if (path.endsWith("/learner-state")) return route.fulfill({ status: route.request().method() === "PUT" ? 204 : 200, contentType: "application/json", body: route.request().method() === "PUT" ? "" : JSON.stringify({ progress: [], favorites: [] }) });
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ tracks: preferences.map(({ trackId }) => ({ id: trackId, slug: trackId, name: trackId === "flutter" ? "Flutter" : "Backend" })), preferences, unavailableTracks: [] }) });
  });
}

test.beforeEach(async ({ page }) => {
  await page.route("http://127.0.0.1:3001/v1/tracks**", async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ tracks: [{ id: "flutter", slug: "flutter", name: "Flutter" }, { id: "backend", slug: "backend", name: "Backend" }] }) });
  });
});

test("anonymous Track catalogue can be served by the Node migration route", async ({ page }) => {
  let nodeRequests = 0;
  await page.route("http://127.0.0.1:3001/v1/tracks?locale=en", async (route) => {
    nodeRequests += 1;
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ tracks: [{ id: "backend", slug: "backend", name: "Backend" }] }) });
  });
  await page.goto("/en/topics");
  await expect(page.locator(".active-track-selector .filter-trigger-summary")).toContainText("Backend");
  expect(nodeRequests).toBeGreaterThan(0);
});

test("home Track cards keep the selected Track after client navigation", async ({ page }) => {
  await page.route("http://127.0.0.1:3001/v1/tracks**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ tracks: [
        { id: "flutter", slug: "flutter", name: "Flutter" },
        { id: "php", slug: "php", name: "PHP & Laravel" },
      ] }),
    });
  });
  await page.goto("/en");
  await page.locator('[data-track-card="php"]').click();
  await expect(page).toHaveURL(/\/topics\?track=php$/);
  await expect(page.locator(".active-track-selector .filter-trigger-summary")).toHaveText("PHP & Laravel");
  await expect(page.getByRole("heading", { name: "PHP Core Fundamentals" })).toBeVisible();
});

test("anonymous browsing exposes active Tracks and keeps a temporary Track in shareable links", async ({ page }) => {
  const preferenceWrites: string[] = [];
  page.on("request", (request) => { if (request.url().includes("set_track_preferences")) preferenceWrites.push(request.url()); });
  await page.goto("/en/topics");
  await expect(page.locator(".active-track-selector .filter-trigger-summary")).toContainText("Flutter");
  await selectTrack(page, "Backend");
  await expect(page).toHaveURL(/\/topics\?track=backend$/);
  await expect(page.getByRole("heading", { name: "This Track has no content yet" })).toBeVisible();
  await page.getByRole("link", { name: "Question Library" }).click();
  await expect(page).toHaveURL(/\/questions\?track=backend$/);
  expect(preferenceWrites).toEqual([]);
});

test("global navigation drops route-specific query context", async ({ page }) => {
  await page.goto("/en/interview?topics=dart&difficulty=Senior&track=flutter");
  await page.getByRole("link", { name: "Question Library", exact: true }).click();
  await expect(page).toHaveURL(/\/questions\?track=flutter$/);
});

test("anonymous progress asks learners to sign in", async ({ page }) => {
  await page.goto("/ar/progress?track=flutter");
  await expect(page.getByRole("heading", { name: "سجّل الدخول لمتابعة تقدّمك عبر أجهزتك." })).toBeVisible();
  await expect(page.locator("#main-content").getByRole("button", { name: "تسجيل الدخول" })).toBeVisible();
  await expect(page.getByLabel("المسار النشط")).toHaveCount(0);
});

test("progress lets learners switch the active Track in place", async ({ page }) => {
  await authenticate(page, [{ trackId: "flutter", isDefault: true }, { trackId: "backend", isDefault: false }]);
  await page.goto("/en/progress?track=flutter");
  await expect(page.locator(".active-track-selector .filter-trigger-summary")).toHaveText("Flutter");
  await selectTrack(page, "Backend");
  await expect(page).toHaveURL(/\/progress\?track=backend$/);
  await expect(page.getByText(/Reviewed 0 of 0 questions/)).toBeVisible();
});

test("authenticated catalogue exposes only active Track Preferences", async ({ page }) => {
  await authenticate(page, [{ trackId: "backend", isDefault: true }]);
  await page.goto("/en/questions");
  await expect(page.locator(".active-track-selector .filter-trigger-summary")).toContainText("Backend");
  await page.locator(".active-track-selector .filter-trigger").click();
  await expect(page.getByRole("dialog").locator(".track-filter-option")).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "This Track has no content yet" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Manage Track Preferences" })).toBeVisible();
});

test("valid URL Track wins over Account Default Track and invalid Topic context recovers", async ({ page }) => {
  await authenticate(page, [
    { trackId: "flutter", isDefault: false },
    { trackId: "backend", isDefault: true },
  ]);
  await page.goto("/en/questions?track=flutter&topic=dart");
  await expect(page.locator(".active-track-selector .filter-trigger-summary")).toContainText("Flutter");
  await expect(page.getByText("What should a Flutter developer know about Final Vs Const In Dart?")).toBeVisible();

  await page.goto("/en/questions?track=flutter&topic=api");
  await expect(page.getByRole("heading", { name: "This Topic does not belong to the Active Track" })).toBeVisible();
  await expect(page.locator(".card .question-title")).toHaveCount(0);
});

test("Study Session stays within one Topic and Full Interview includes multiple Topics in its Track", async ({ page }) => {
  await page.goto("/en/session?track=flutter&topic=dart&difficulty=Junior&started=1");
  await expect(page.getByText(/Question 1 of \d+/)).toBeVisible();
  await expect(page.getByRole("heading", { level: 2 })).toContainText("Final Vs Const In Dart");

  await page.goto("/en/session?track=backend&topic=dart&difficulty=Junior");
  await expect(page.getByRole("heading", { name: "This Topic does not belong to the Active Track" })).toBeVisible();

  await page.goto("/en/interview?track=flutter&topics=dart,widgets&difficulty=Senior&started=1");
  await expect(page.locator(".session-progress")).toHaveText(/Question 1 of \d+/);
  await page.locator(".active-track-selector .filter-trigger").click();
  const interviewDialog = page.getByRole("dialog");
  await expect(interviewDialog.getByLabel("Dart")).toBeChecked();
  await expect(interviewDialog.getByLabel("Widgets")).toBeChecked();
  await expect(interviewDialog.getByText("The selected level includes every lower level.")).toBeVisible();
});

test("switching Active Track clears the previous session Topic", async ({ page }) => {
  await page.goto("/en/session?track=flutter&topic=dart&difficulty=Junior&started=1");
  await expect(page.locator(".session-progress")).toHaveText(/Question 1 of \d+/);
  await selectTrack(page, "Backend");
  await expect(page).toHaveURL(/\/session\?(?:difficulty=Junior&track=backend|track=backend&difficulty=Junior)$/);
  await expect(page.getByRole("heading", { name: "This Track has no content yet" })).toBeVisible();
});

test("Arabic and English keep Track context with RTL and LTR direction", async ({ page }) => {
  await page.goto("/ar/topics?track=flutter");
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/topics\?track=flutter$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
});
