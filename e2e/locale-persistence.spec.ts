import { test, expect } from "@playwright/test";

test("keeps English content after refreshing a locale-free route", async ({ page }) => {
  await page.goto("/en/interview");
  await expect(page.getByRole("heading", { name: "Build a complete interview" })).toBeVisible();
  await expect(page).toHaveURL(/\/interview$/);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Build a complete interview" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("does not render an Arabic shell before an English locale settles", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("jahezdev-locale", "en");
    (window as Window & { __localeSnapshots?: string[] }).__localeSnapshots = [];
    new MutationObserver(() => {
      const text = document.querySelector(".nav-links")?.textContent?.trim();
      if (text) (window as Window & { __localeSnapshots?: string[] }).__localeSnapshots?.push(text);
    }).observe(document, { childList: true, subtree: true, characterData: true });
  });
  await page.goto("/en/interview", { waitUntil: "commit" });
  expect(await page.evaluate(() => document.documentElement.hasAttribute("data-locale-pending"))).toBe(true);
  await expect(page.getByRole("heading", { name: "Build a complete interview" })).toBeVisible();
  const snapshots = await page.evaluate(() => (window as Window & { __localeSnapshots?: string[] }).__localeSnapshots ?? []);
  expect(snapshots.some((text) => text.includes("الموضوعات"))).toBe(false);
});
