import { expect, test } from "@playwright/test";

test("question card hover stays on the outer card", async ({ page }) => {
  await page.goto("/en/questions?track=flutter&topic=dart");
  const card = page.locator(".question-card").first();
  await expect(card).toBeVisible();

  await card.hover();
  const styles = await card.evaluate((element) => {
    const link = element.querySelector<HTMLElement>(".card-link");
    if (!link) throw new Error("question card link is missing");
    return {
      cardTransform: getComputedStyle(element).transform,
      cardShadow: getComputedStyle(element).boxShadow,
      linkTransform: getComputedStyle(link).transform,
      linkShadow: getComputedStyle(link).boxShadow,
    };
  });

  expect(styles.cardTransform).not.toBe("none");
  expect(styles.cardShadow).not.toBe("none");
  expect(styles.linkTransform).toBe("none");
  expect(styles.linkShadow).toBe("none");
});
