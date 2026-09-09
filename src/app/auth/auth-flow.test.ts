import assert from "node:assert/strict";
import test from "node:test";

import { errorMessage, usernameCompletionMode, validateUsername } from "./auth-flow.ts";

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
