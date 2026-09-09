import assert from "node:assert/strict";
import test from "node:test";

import { errorMessage, saveUsernameWithRecovery, usernameCompletionMode, validateUsername } from "./auth-flow.ts";

test("username validation matches the Clerk username policy", () => {
  assert.equal(validateUsername("abc"), "short");
  assert.equal(validateUsername("abcd"), null);
  assert.equal(validateUsername("a".repeat(65)), "long");
});

test("Clerk errors keep their useful message", () => {
  assert.equal(errorMessage(new Error("That username is already taken."), "fallback"), "That username is already taken.");
});

test("a completed OAuth session saves its missing username on the user", () => {
  assert.equal(usernameCompletionMode({ mode: "signUp", isSignedIn: true, hasUser: true, hasUsername: false, signUpStatus: "missing_requirements" }), "user");
});

test("an empty Clerk update response does not block the username flow", async () => {
  const user = {
    async update() {
      throw new Error("Failed to execute 'json' on 'Response': Unexpected end of JSON input");
    },
  };

  await assert.doesNotReject(() => saveUsernameWithRecovery(user, "dev"));
});

test("real Clerk update errors still surface", async () => {
  const user = { async update() { throw new Error("Username is already taken."); } };
  await assert.rejects(() => saveUsernameWithRecovery(user, "dev"), /Username is already taken/);
});

test("Clerk errors returned in the update result still surface", async () => {
  const user = { async update() { return { error: new Error("Username is already taken.") }; } };
  await assert.rejects(() => saveUsernameWithRecovery(user, "dev"), /Username is already taken/);
});
