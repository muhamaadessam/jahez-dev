import assert from "node:assert/strict";
import test from "node:test";

import { createSupabaseSubmissionStore, SubmissionRouteError } from "./submissions.ts";

const draft = { trackId: "flutter", topicIds: ["dart"], question: "What is final?", shortAnswer: "A", explanation: "B", difficulty: "Junior" as const, sources: ["https://dart.dev"], licenseConsent: true, idempotencyKey: "123e4567-e89b-12d3-a456-426614174000" };

test("submission adapter validates input and keeps provider credentials server-side", async () => {
  const requests: Request[] = [];
  const previousUrl = process.env.SUPABASE_URL;
  const previousKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.SUPABASE_URL = "https://db.example";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "service-secret";
  const store = createSupabaseSubmissionStore({ url: "https://db.example", serviceRoleKey: "service-secret", fetchImpl: async (input, init) => {
    const request = new Request(input, init);
    requests.push(request);
    return Response.json(request.url.includes("/rpc/create_submission_for_account")
      ? [{ submission_id: "s1", submission_status: "pending", duplicate_advisory: false }]
      : []);
  } });
  try {
    const result = await store.submit(draft, "clerk-token", "account-1") as { submissionId: string; status: string; prompt?: string };
    assert.equal(result.submissionId, "s1");
    assert.equal(result.status, "pending");
    assert.equal(result.prompt, undefined);
    assert.equal(requests[0].url, "https://db.example/rest/v1/submissions?select=id,payload,topic_ids&track_id=eq.flutter&status=in.(pending,issue_created,changes_requested,approved,published)&order=created_at.desc&limit=100");
    assert.equal(requests[0].headers.get("Authorization"), "Bearer service-secret");
    const create = requests.find((request) => request.url.includes("/rpc/create_submission_for_account"));
    assert.ok(create);
    assert.deepEqual(await create.json(), { p_account_id: "account-1", p_track_id: "flutter", p_topic_ids: ["dart"], p_difficulty: "Junior", p_payload: { question: "What is final?", shortAnswer: "A", explanation: "B", sources: ["https://dart.dev"] }, p_idempotency_key: draft.idempotencyKey, p_duplicate_of: null, p_display_name: null });
    assert.ok(requests.every((request) => !request.url.includes("/functions/v1/")));
    await assert.rejects(store.submit({ ...draft, question: "<script>" }, "clerk-token", "account-1"), (error: unknown) => error instanceof SubmissionRouteError && error.status === 400);
  } finally {
    if (previousUrl === undefined) delete process.env.SUPABASE_URL; else process.env.SUPABASE_URL = previousUrl;
    if (previousKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY; else process.env.SUPABASE_SERVICE_ROLE_KEY = previousKey;
  }
});
