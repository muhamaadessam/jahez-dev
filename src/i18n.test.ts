import assert from "node:assert/strict";
import test from "node:test";

import { formatApproximateCount } from "./i18n.ts";

test("formatApproximateCount rounds hundreds, then floors unit counts", () => {
  assert.equal(formatApproximateCount(116, "ar"), "+100");
  assert.equal(formatApproximateCount(910, "en"), "+900");
  assert.equal(formatApproximateCount(1_000, "en"), "+1K");
  assert.equal(formatApproximateCount(2_100, "ar"), "+2K");
  assert.equal(formatApproximateCount(21_500, "en"), "+21K");
  assert.equal(formatApproximateCount(999_999, "en"), "+999K");
  assert.equal(formatApproximateCount(1_000_000, "en"), "+1M");
  assert.equal(formatApproximateCount(2_100_000_000, "en"), "+2B");
});
