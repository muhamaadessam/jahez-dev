import assert from "node:assert/strict";
import test from "node:test";

import { createInterview, findResumableInterview, getSavedInterviews, updateInterview } from "./interviews.ts";

function storage() {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => { data.set(key, value); },
  };
}

test("interview sessions persist, resume, and complete", () => {
  const local = storage();
  const interview = createInterview(local, { trackId: "ui-ux", trackSlug: "ui-ux", topicSlugs: ["a", "b"], difficulty: "Mid", questionIds: ["q1", "q2"] });
  assert.equal(findResumableInterview(getSavedInterviews(local), { trackId: "ui-ux", topicSlugs: ["b", "a"], difficulty: "Mid" })?.id, interview.id);
  updateInterview(local, interview.id, { currentIndex: 1 });
  assert.equal(getSavedInterviews(local)[0].currentIndex, 1);
  updateInterview(local, interview.id, { completed: true });
  assert.equal(findResumableInterview(getSavedInterviews(local), interview), undefined);
});
