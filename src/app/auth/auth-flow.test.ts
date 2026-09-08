import assert from "node:assert/strict";
import test from "node:test";

import { errorMessage, validateUsername } from "./auth-flow.ts";

test("username validation matches the Clerk username policy", () => {
  assert.equal(validateUsername("abc"), "short");
  assert.equal(validateUsername("abcd"), null);
  assert.equal(validateUsername("a".repeat(65)), "long");
});

test("Clerk errors keep their useful message", () => {
  assert.equal(errorMessage(new Error("That username is already taken."), "fallback"), "That username is already taken.");
});
