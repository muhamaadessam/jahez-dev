import assert from "node:assert/strict";
import test from "node:test";

import { createSiteStatsStore } from "./site-stats.ts";

test("site stats count Clerk users and register every visit", async () => {
  const requests: Request[] = [];
  const store = createSiteStatsStore({
    url: "https://supabase.example",
    serviceRoleKey: "service-role",
    clerkSecretKey: "clerk-secret",
    fetchImpl: async (input, init) => {
      const request = new Request(input, init);
      requests.push(request);
      if (request.url.endsWith("/users/count")) return Response.json({ count: 7 });
      return Response.json([{ register_site_visit: "12" }]);
    },
  });

  assert.deepEqual(await store.recordVisit(), { users: 7, visits: 12 });
  assert.equal(requests.length, 2);
  const visitRequest = requests.find((request) => request.url.includes("register_site_visit"));
  assert.ok(visitRequest);
  assert.deepEqual(await visitRequest.json(), {});
  assert.equal(visitRequest.headers.get("authorization"), "Bearer service-role");
});

test("site stats cache the Clerk user count while recording each visit", async () => {
  let clerkCalls = 0;
  let visitCalls = 0;
  const store = createSiteStatsStore({
    url: "https://supabase.example",
    serviceRoleKey: "service-role",
    clerkSecretKey: "clerk-secret",
    fetchImpl: async (input) => {
      if (String(input).endsWith("/users/count")) {
        clerkCalls += 1;
        return Response.json(3);
      }
      visitCalls += 1;
      return Response.json(visitCalls);
    },
  });

  assert.deepEqual(await store.recordVisit(), { users: 3, visits: 1 });
  assert.deepEqual(await store.recordVisit(), { users: 3, visits: 2 });
  assert.equal(clerkCalls, 1);
  assert.equal(visitCalls, 2);
});
