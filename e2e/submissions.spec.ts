import { expect, test, type Page } from "@playwright/test";

async function signedInSubmissionPage(page: Page, verified = true) {
  await page.addInitScript(({ verified }) => {
    localStorage.setItem("playwright-authenticated", "true");
    localStorage.setItem("playwright-email-verified", String(verified));
  }, { verified });
  await page.route("http://127.0.0.1:3001/v1/me/track-preferences**", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify({ tracks: [{ id: "flutter", slug: "flutter", name: "Flutter" }], preferences: [{ trackId: "flutter", isDefault: true }], unavailableTracks: [] }) }));
  await page.route("http://127.0.0.1:3001/v1/me/learner-state**", (route) => route.fulfill({ status: route.request().method() === "PUT" ? 204 : 200, contentType: "application/json", body: route.request().method() === "PUT" ? "" : JSON.stringify({ progress: [], favorites: [] }) }));
  await page.goto("/en/submissions");
}

test("anonymous Accounts are explicitly blocked", async ({ page }) => {
  await page.goto("/en/submissions");
  await expect(page.getByRole("heading", { name: "Sign in to submit a question." })).toBeVisible();
});

test("minimal Submission retries with one idempotency key and shows success feedback", async ({ page }) => {
  await signedInSubmissionPage(page);
  const requests: Array<Record<string, unknown>> = [];
  await page.route("http://127.0.0.1:3001/v1/submissions", async (route) => {
    requests.push(route.request().postDataJSON());
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify(requests.length === 1
        ? { submissionId: "submission-1", status: "failed", retryable: true }
        : { submissionId: "submission-1", status: "pending" }),
    });
  });

  await expect(page.getByLabel("Track")).toHaveValue("flutter");
  await expect(page.getByLabel("Difficulty")).toHaveValue("");
  await page.getByLabel("Question", { exact: true }).fill("What is final?");
  await page.getByLabel(/CC BY 4\.0/).check();
  await page.getByRole("button", { name: "Submit for review" }).click();
  await expect(page.getByText("The review Issue could not be created.")).toBeVisible();
  await page.getByRole("button", { name: "Retry" }).click();
  await expect(page.getByText("Contribution saved and sent for review.")).toBeVisible();

  expect(requests).toHaveLength(2);
  expect(requests[0].idempotencyKey).toBe(requests[1].idempotencyKey);
  expect(requests[0]).toMatchObject({ trackId: "flutter", topicIds: [], difficulty: null, shortAnswer: "", explanation: "", sources: [] });
});

for (const [code, message] of [
  ["daily_limit_reached", "Daily limit reached (5 submissions)."],
  ["cooldown_active", "Wait a minute before sending another contribution."],
] as const) test(`shows localized ${code} feedback`, async ({ page }) => {
  await signedInSubmissionPage(page);
  await page.route("http://127.0.0.1:3001/v1/submissions", (route) => route.fulfill({ status: 429, contentType: "application/json", body: JSON.stringify({ error: code }) }));
  await page.getByLabel("Question", { exact: true }).fill("What is final?");
  await page.getByLabel(/CC BY 4\.0/).check();
  await page.getByRole("button", { name: "Submit for review" }).click();
  await expect(page.locator("p[role=alert]")).toHaveText(message);
});
