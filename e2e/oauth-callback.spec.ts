import { expect, test } from "@playwright/test";

test("OAuth continuation and account transfers stay on local static auth pages", async ({ page }) => {
  await page.goto("/auth/callback");
  const callback = page.getByTestId("oauth-callback");
  await expect(callback).toContainText('"continueSignUpUrl":"/auth/sign-up"');
  await expect(callback).toContainText('"signInUrl":"/auth/sign-in"');
  await expect(callback).toContainText('"signUpUrl":"/auth/sign-up"');
  await expect(callback).toContainText('"signInForceRedirectUrl":"/"');
  await expect(callback).toContainText('"signUpForceRedirectUrl":"/"');

  for (const [path, component, counterpart] of [
    ["sign-up", "signup-component", '"signInUrl":"/auth/sign-in"'],
    ["sign-in", "signin-component", '"signUpUrl":"/auth/sign-up"'],
  ]) {
    await page.goto(`/auth/${path}`);
    await expect(page.getByRole("heading", { name: "JahezDev" })).toBeVisible();
    await expect(page.getByTestId(component)).toContainText('"routing":"hash"');
    await expect(page.getByTestId(component)).toContainText('"forceRedirectUrl":"/"');
    await expect(page.getByTestId(component)).toContainText(counterpart);
  }
});
