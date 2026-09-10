import assert from "node:assert/strict";
import test from "node:test";

import { formatApproximateCount } from "./i18n.ts";

test("formatApproximateCount uses Google Play-style thresholds", () => {
  assert.equal(formatApproximateCount(4, "en"), "+1");
  assert.equal(formatApproximateCount(5, "en"), "+5");
  assert.equal(formatApproximateCount(116, "ar"), "+100");
  assert.equal(formatApproximateCount(910, "en"), "+500");
  assert.equal(formatApproximateCount(1_000, "en"), "+1K");
  assert.equal(formatApproximateCount(4_900, "ar"), "+1K");
  assert.equal(formatApproximateCount(1_000_000, "en"), "+1M");
});
