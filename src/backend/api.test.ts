import assert from "node:assert/strict";
import test from "node:test";

import { nodeRequest } from "./api.ts";

test("nodeRequest omits JSON content type for an empty DELETE", async () => {
  process.env.NEXT_PUBLIC_API_URL = "https://api.example";
  try {
    let request: Request | undefined;
    await nodeRequest({
      path: "/me/account",
      token: "clerk-token",
      init: { method: "DELETE" },
      fetchImpl: async (input, init) => {
        request = new Request(input, init);
        return Response.json({ ok: true });
      },
    });
    assert.equal(request?.headers.get("content-type"), null);
    assert.equal(request?.headers.get("authorization"), "Bearer clerk-token");
  } finally {
    delete process.env.NEXT_PUBLIC_API_URL;
  }
});

test("nodeRequest keeps JSON content type for requests with a body", async () => {
  process.env.NEXT_PUBLIC_API_URL = "https://api.example";
  try {
    let request: Request | undefined;
    await nodeRequest({
      path: "/example",
      init: { method: "POST", body: "{}" },
      fetchImpl: async (input, init) => {
        request = new Request(input, init);
        return Response.json({ ok: true });
      },
    });
    assert.equal(request?.headers.get("content-type"), "application/json");
  } finally {
    delete process.env.NEXT_PUBLIC_API_URL;
  }
});
