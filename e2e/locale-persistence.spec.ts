import { test, expect } from "@playwright/test";

test("keeps English content after refreshing a locale-free route", async ({ page }) => {
  await page.goto("/en/interview");
  await expect(page.getByRole("heading", { name: "Build a complete interview" })).toBeVisible();
  await expect(page).toHaveURL(/\/interview$/);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Build a complete interview" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});
