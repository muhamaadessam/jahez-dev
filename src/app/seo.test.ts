import assert from "node:assert/strict";
import test from "node:test";

import { questions } from "../content/questions.ts";
import { localizedMetadata } from "./metadata.ts";
import { siteUrl } from "./site-config.ts";
import sitemap from "./sitemap.ts";

test("SEO metadata uses the production domain and keeps private workflows out of search", () => {
  const publicPage = localizedMetadata("ar", "/questions", "الأسئلة", "الوصف");
  assert.equal(publicPage.openGraph?.url, "/ar/questions");
  assert.equal((publicPage.twitter as { card?: string } | undefined)?.card, "summary_large_image");
  assert.equal(publicPage.robots, undefined);
  assert.deepEqual(localizedMetadata("ar", "/moderator", "المراجعة", "الوصف").robots, { index: false, follow: false });
});

test("sitemap publishes localized canonical questions with review dates", () => {
  const entries = sitemap();
  assert.ok(entries.every(({ url }) => url.startsWith(siteUrl)));
  assert.ok(!entries.some(({ url }) => new URL(url).pathname.endsWith("/progress")));

  const question = questions[0];
  assert.ok(question);
  const entry = entries.find(({ url }) => url === `${siteUrl}/ar/questions/${question.slug}`);
  assert.ok(entry);
  assert.equal(entry.lastModified, question.lastReviewedAt);
  assert.deepEqual(entry.alternates?.languages, {
    ar: `${siteUrl}/ar/questions/${question.slug}`,
    en: `${siteUrl}/en/questions/${question.slug}`,
    "x-default": `${siteUrl}/ar/questions/${question.slug}`,
  });
});
