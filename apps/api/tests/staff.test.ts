import assert from "node:assert/strict";
import { afterEach, describe, test } from "node:test";
import { onRequestGet as getInquiry, onRequestPatch as patchInquiry } from "../functions/api/staff/inquiries/[id].ts";
import { onRequestPost as postNote } from "../functions/api/staff/inquiries/[id]/notes.ts";
import { onRequestPatch as patchRate } from "../functions/api/staff/rates.ts";
import { onRequestGet as getSummary } from "../functions/api/staff/summary.ts";
import { summary } from "../src/server/supabase-rest.ts";

const env = {
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_ANON_KEY: "anon-key",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
  INTERNAL_API_SECRET: "internal-secret",
};
const ID = "6f1c2a3e-1b2c-4d5e-8f90-a1b2c3d4e5f6";
const originalFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = originalFetch; });

const reply = (body: unknown, init: ResponseInit = {}) => new Response(JSON.stringify(body), { status: 200, headers: { "content-type": "application/json" }, ...init });

/** Fakes Supabase: auth user lookup, staff profile lookup, then whatever `rest` returns. */
const fakeSupabase = (role: string | null, rest: (url: string, init?: RequestInit) => Response = () => reply([])) => {
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    if (url.includes("/auth/v1/user")) return reply({ id: "user-1" });
    if (url.includes("/rest/v1/staff_profiles")) return reply(role ? [{ user_id: "user-1", display_name: "Asha", role, is_active: true }] : []);
    return rest(url, init);
  };
};

const staffRequest = (path: string, method: string, body?: BodyInit) =>
  new Request(`https://hoteldeblossom.com${path}`, { method, headers: { authorization: "Bearer token", "content-type": "application/json" }, body });

const code = async (response: Response) => ((await response.json()) as { error: { code: string } }).error.code;

describe("staff auth", () => {
  test("rejects requests without a token", async () => {
    const response = await getSummary({ request: new Request("https://hoteldeblossom.com/api/staff/summary"), env });
    assert.equal(response.status, 401);
  });

  test("answers 403 for a signed-in user without a staff profile", async () => {
    fakeSupabase(null);
    const response = await getSummary({ request: staffRequest("/api/staff/summary", "GET"), env });
    assert.equal(response.status, 403);
    assert.equal(await code(response), "STAFF_ACCESS_REQUIRED");
  });

  test("answers 503, not an unhandled error, when Supabase is unreachable", async () => {
    globalThis.fetch = async () => { throw new TypeError("network down"); };
    const response = await getSummary({ request: staffRequest("/api/staff/summary", "GET"), env });
    assert.equal(response.status, 503);
    assert.equal(await code(response), "AUTH_UNAVAILABLE");
  });
});

describe("staff enquiry routes", () => {
  test("treats a malformed enquiry id as not found instead of hitting the database", async () => {
    fakeSupabase("receptionist");
    const response = await getInquiry({ request: staffRequest("/api/staff/inquiries/nope", "GET"), env, params: { id: "nope" } });
    assert.equal(response.status, 404);
  });

  test("rejects an empty update", async () => {
    fakeSupabase("receptionist");
    const response = await patchInquiry({ request: staffRequest(`/api/staff/inquiries/${ID}`, "PATCH", "{}"), env, params: { id: ID } });
    assert.equal(response.status, 422);
    assert.equal(await code(response), "EMPTY_UPDATE");
  });

  test("rejects a JSON null body", async () => {
    fakeSupabase("receptionist");
    const response = await patchInquiry({ request: staffRequest(`/api/staff/inquiries/${ID}`, "PATCH", "null"), env, params: { id: ID } });
    assert.equal(response.status, 400);
  });

  test("forwards a valid status change to the update RPC", async () => {
    let rpcBody: Record<string, unknown> = {};
    fakeSupabase("receptionist", (url, init) => {
      assert.ok(url.endsWith("/rest/v1/rpc/update_inquiry_as_staff"));
      rpcBody = JSON.parse(String(init?.body));
      return reply([{ id: ID, status: "contacted" }]);
    });
    const response = await patchInquiry({ request: staffRequest(`/api/staff/inquiries/${ID}`, "PATCH", JSON.stringify({ status: "contacted" })), env, params: { id: ID } });
    assert.equal(response.status, 200);
    assert.equal(rpcBody.p_status, "contacted");
    assert.equal(rpcBody.p_has_assigned_to, false);
  });

  test("validates note length and enquiry id", async () => {
    fakeSupabase("receptionist");
    const blank = await postNote({ request: staffRequest(`/api/staff/inquiries/${ID}/notes`, "POST", JSON.stringify({ body: "  " })), env, params: { id: ID } });
    assert.equal(blank.status, 422);
    const badId = await postNote({ request: staffRequest("/api/staff/inquiries/x/notes", "POST", JSON.stringify({ body: "hi" })), env, params: { id: "x" } });
    assert.equal(badId.status, 404);
  });
});

describe("staff rate routes", () => {
  const patch = (body: unknown, id = ID) => patchRate({ request: staffRequest(`/api/staff/rates/${id}`, "PATCH", JSON.stringify(body)), env, params: { id } });

  test("receptionists cannot change prices", async () => {
    fakeSupabase("receptionist");
    assert.equal((await patch({ baseNightlyInr: 7200 })).status, 403);
  });

  test("managers get validation errors for bad prices", async () => {
    fakeSupabase("manager");
    assert.equal((await patch({ baseNightlyInr: -1 })).status, 422);
    assert.equal((await patch({ baseNightlyInr: 99.5 })).status, 422);
    assert.equal((await patch({ baseNightlyInr: "7200" })).status, 422);
  });

  test("answers 404 when the rate does not exist", async () => {
    fakeSupabase("manager", () => reply([]));
    assert.equal((await patch({ baseNightlyInr: 7200 })).status, 404);
  });

  test("returns the updated rate", async () => {
    fakeSupabase("admin", () => reply([{ id: ID, room_type: "Deluxe", base_nightly_inr: 7200 }]));
    const response = await patch({ baseNightlyInr: 7200 });
    assert.equal(response.status, 200);
    assert.deepEqual(((await response.json()) as { data: { base_nightly_inr: number } }).data.base_nightly_inr, 7200);
  });
});

describe("dashboard summary", () => {
  test("counts 'due today' against the India (IST) day, not UTC", async () => {
    const urls: string[] = [];
    globalThis.fetch = async (input) => {
      urls.push(decodeURIComponent(String(input)));
      return new Response("[]", { status: 200, headers: { "content-range": "0-0/3" } });
    };
    // 20:00 UTC on 6 Oct is already 01:30 IST on 7 Oct.
    const result = await summary(env, new Date("2026-10-06T20:00:00Z"));
    assert.equal(result.dueToday, 3);
    const due = urls.find((url) => url.includes("follow_up_at=gte."))!;
    assert.ok(due.includes("follow_up_at=gte.2026-10-06T18:30:00.000Z"));
    assert.ok(due.includes("follow_up_at=lt.2026-10-07T18:30:00.000Z"));
  });

  test("fails loudly instead of reporting zeros when a count query fails", async () => {
    globalThis.fetch = async () => new Response("boom", { status: 500 });
    await assert.rejects(() => summary(env));
  });
});
