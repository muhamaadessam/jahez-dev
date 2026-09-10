import assert from "node:assert/strict";
import test from "node:test";

import { formatApproximateCount } from "./i18n.ts";

test("formatApproximateCount uses Play tiers below 1K, then floors unit counts", () => {
  assert.equal(formatApproximateCount(1, "en"), "+1");
  assert.equal(formatApproximateCount(5, "en"), "+5");
  assert.equal(formatApproximateCount(10, "en"), "+10");
  assert.equal(formatApproximateCount(50, "en"), "+50");
  assert.equal(formatApproximateCount(116, "ar"), "+100");
  assert.equal(formatApproximateCount(910, "en"), "+500");
  assert.equal(formatApproximateCount(1_000, "en"), "+1K");
  assert.equal(formatApproximateCount(2_100, "ar"), "+2K");
  assert.equal(formatApproximateCount(21_500, "en"), "+21K");
  assert.equal(formatApproximateCount(999_999, "en"), "+999K");
  assert.equal(formatApproximateCount(1_000_000, "en"), "+1M");
  assert.equal(formatApproximateCount(2_100_000_000, "en"), "+2B");
});
