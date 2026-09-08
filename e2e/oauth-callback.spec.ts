import { expect, test } from "@playwright/test";

test("OAuth continuation and account transfers stay on local static auth pages", async ({ page }) => {
  await page.goto("/auth/callback");
  const callback = page.getByTestId("oauth-callback");
  await expect(callback).toContainText('"continueSignUpUrl":"/auth/sign-up"');
  await expect(callback).toContainText('"signInUrl":"/auth/sign-in"');
  await expect(callback).toContainText('"signUpUrl":"/auth/sign-up"');
  await expect(callback).toContainText('"signInForceRedirectUrl":"/"');
  await expect(callback).toContainText('"signUpForceRedirectUrl":"/"');
});

test("sign-up page uses website-owned design with a username step for Google", async ({ page }) => {
  await page.goto("/auth/sign-up");
  // No Clerk prebuilt component should be rendered.
  await expect(page.getByTestId("signup-component")).toHaveCount(0);
  await expect(page.getByTestId("signin-component")).toHaveCount(0);
  // Website-owned username field + Google button.
  await expect(page.getByLabel(/اسم المستخدم|Username/)).toBeVisible();
  await expect(page.getByRole("button", { name: /Google/ })).toBeVisible();
});

test("sign-in page uses website-owned design without Clerk components", async ({ page }) => {
  await page.goto("/auth/sign-in");
  await expect(page.getByTestId("signup-component")).toHaveCount(0);
  await expect(page.getByTestId("signin-component")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Google/ })).toBeVisible();
});
