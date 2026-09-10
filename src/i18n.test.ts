import assert from "node:assert/strict";
import test from "node:test";

import { formatApproximateCount } from "./i18n.ts";

test("formatApproximateCount uses hundred and thousand thresholds", () => {
  assert.equal(formatApproximateCount(116, "ar"), "+100");
  assert.equal(formatApproximateCount(910, "en"), "+900");
  assert.equal(formatApproximateCount(1_000, "en"), "+1K");
  assert.equal(formatApproximateCount(2_100, "ar"), "+2K");
});
