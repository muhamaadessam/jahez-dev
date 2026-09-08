import assert from "node:assert/strict";
import test from "node:test";

import { createSiteStatsStore } from "./site-stats.ts";

test("site stats count Clerk users and register a hashed visitor", async () => {
  const requests: Request[] = [];
  const store = createSiteStatsStore({
    url: "https://supabase.example",
    serviceRoleKey: "service-role",
    clerkSecretKey: "clerk-secret",
    fetchImpl: async (input, init) => {
      const request = new Request(input, init);
      requests.push(request);
      if (request.url.endsWith("/users/count")) return Response.json({ count: 7 });
      return Response.json([{ register_site_visitor: "12" }]);
    },
  });

  assert.deepEqual(await store.recordVisitor("visitor-123456789"), { users: 7, visitors: 12 });
  assert.equal(requests.length, 2);
  const visitorRequest = requests.find((request) => request.url.includes("register_site_visitor"));
  assert.ok(visitorRequest);
  const body = JSON.parse(await visitorRequest.text()) as { p_visitor_hash: string };
  assert.match(body.p_visitor_hash, /^[a-f0-9]{64}$/);
  assert.equal(visitorRequest.headers.get("authorization"), "Bearer service-role");
});

test("site stats cache the Clerk user count while recording each visitor", async () => {
  let clerkCalls = 0;
  let visitorCalls = 0;
  const store = createSiteStatsStore({
    url: "https://supabase.example",
    serviceRoleKey: "service-role",
    clerkSecretKey: "clerk-secret",
    fetchImpl: async (input) => {
      if (String(input).endsWith("/users/count")) {
        clerkCalls += 1;
        return Response.json(3);
      }
      visitorCalls += 1;
      return Response.json(visitorCalls);
    },
  });

  assert.deepEqual(await store.recordVisitor("visitor-123456789"), { users: 3, visitors: 1 });
  assert.deepEqual(await store.recordVisitor("visitor-987654321"), { users: 3, visitors: 2 });
  assert.equal(clerkCalls, 1);
  assert.equal(visitorCalls, 2);
});
