import assert from "node:assert/strict";
import { afterEach, describe, test } from "node:test";
import { onRequestPost } from "../functions/api/inquiries.ts";
import { onRequestGet as getPublicRates } from "../functions/api/rates.ts";
import { assetUrl, hotelAssets } from "@hdb/shared";

const env = {
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_ANON_KEY: "anon-key",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
  INTERNAL_API_SECRET: "internal-secret",
};

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

const requestFor = (body: unknown, headers: Record<string, string> = {}) => new Request("https://hoteldeblossom.com/api/inquiries", {
  method: "POST",
  headers: { "content-type": "application/json", ...headers },
  body: JSON.stringify(body),
});

const invoke = (body: unknown, headers: Record<string, string> = {}) => onRequestPost({
  request: requestFor(body, headers),
  env,
});

const validPayload = {
  purpose: "stay",
  checkIn: "2026-11-14",
  checkOut: "2026-11-16",
  guests: 2,
  roomType: "Deluxe Double",
  name: "Guest Name",
  phone: "+91 90000 00000",
  email: "guest@example.com",
  message: "A quiet room if possible.",
  consent: true,
};

describe("public enquiry API", () => {
  test("creates a valid enquiry and forwards the idempotency key", async () => {
    const calls: Array<{ url: string; init?: RequestInit }> = [];
    globalThis.fetch = async (input, init) => {
      calls.push({ url: String(input), init });
      return new Response(JSON.stringify([{ inquiry_id: "inquiry-1", reference: "HDB-2026-000001", status: "new" }]), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    };

    const response = await invoke(validPayload, { "Idempotency-Key": "guest-request-2026-0001", "cf-ray": "test-ray" });
    const data = await response.json() as { data: { inquiryId: string; reference: string; status: string } };

    assert.equal(response.status, 201);
    assert.equal(response.headers.get("x-request-id"), "test-ray");
    assert.deepEqual(data.data, { inquiryId: "inquiry-1", reference: "HDB-2026-000001", status: "new" });
    assert.equal(calls.length, 1);
    assert.equal(calls[0]?.url, "https://example.supabase.co/rest/v1/rpc/create_public_inquiry");
    assert.equal(JSON.parse(String(calls[0]?.init?.body)).p_request_id, "guest-request-2026-0001");
  });

  test("rejects invalid enquiries before contacting the database", async () => {
    let fetchCalled = false;
    globalThis.fetch = async () => {
      fetchCalled = true;
      return new Response("unexpected", { status: 500 });
    };

    const response = await invoke({ ...validPayload, checkOut: "2026-11-10", consent: false });
    const data = await response.json() as { error: { code: string } };

    assert.equal(response.status, 422);
    assert.equal(data.error.code, "VALIDATION_ERROR");
    assert.equal(fetchCalled, false);
  });

  test("silently accepts honeypot submissions without creating an enquiry", async () => {
    let fetchCalled = false;
    globalThis.fetch = async () => {
      fetchCalled = true;
      return new Response("unexpected", { status: 500 });
    };

    const response = await invoke({ honeypot: "filled-by-bot" });

    assert.equal(response.status, 202);
    assert.deepEqual(await response.json(), { ok: true });
    assert.equal(fetchCalled, false);
  });

  test("rejects oversized bodies even when the request length is not trusted", async () => {
    let fetchCalled = false;
    globalThis.fetch = async () => {
      fetchCalled = true;
      return new Response("unexpected", { status: 500 });
    };

    const response = await invoke({ message: "x".repeat(20_000) });
    const data = await response.json() as { error: { code: string } };

    assert.equal(response.status, 413);
    assert.equal(data.error.code, "BODY_TOO_LARGE");
    assert.equal(fetchCalled, false);
  });

  test("returns the existing enquiry when a database write is retried", async () => {
    const calls: string[] = [];
    globalThis.fetch = async (input) => {
      calls.push(String(input));
      if (calls.length === 1) return new Response("temporary failure", { status: 503 });
      return new Response(JSON.stringify([{ id: "inquiry-1", reference_code: "HDB-2026-000001", status: "new" }]), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    };

    const response = await invoke(validPayload, { "Idempotency-Key": "guest-request-retry-01" });
    const data = await response.json() as { data: { inquiryId: string; reference: string; status: string }; deduplicated: boolean };

    assert.equal(response.status, 200);
    assert.equal(data.deduplicated, true);
    assert.deepEqual(data.data, { inquiryId: "inquiry-1", reference: "HDB-2026-000001", status: "new" });
    assert.deepEqual(calls, [
      "https://example.supabase.co/rest/v1/rpc/create_public_inquiry",
      "https://example.supabase.co/rest/v1/inquiries?select=id%2Creference_code%2Cstatus&idempotency_key=eq.guest-request-retry-01&limit=1",
    ]);
  });
});

describe("public room rates API", () => {
  test("exposes only room type and nightly price, cacheable", async () => {
    globalThis.fetch = async () => new Response(JSON.stringify([
      { id: "rate-1", room_type: "Deluxe Double", base_nightly_inr: 7200, is_active: true, updated_at: "2026-10-01T00:00:00Z" },
    ]), { status: 200, headers: { "content-type": "application/json" } });

    const response = await getPublicRates({ request: new Request("https://hoteldeblossom.com/api/rates"), env });

    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "public, max-age=300");
    assert.deepEqual(await response.json(), { data: [{ roomType: "Deluxe Double", baseNightlyInr: 7200 }] });
  });

  test("answers 503 when the database is unreachable", async () => {
    globalThis.fetch = async () => new Response("down", { status: 500 });
    const response = await getPublicRates({ request: new Request("https://hoteldeblossom.com/api/rates"), env });
    assert.equal(response.status, 503);
  });
});

describe("public asset URLs", () => {
  test("uses local CDN-friendly paths by default", () => {
    assert.equal(assetUrl(hotelAssets.heroBuilding), "/images/hero/building.webp");
  });

  test("switches to the configured public bucket without changing asset keys", () => {
    assert.equal(
      assetUrl(hotelAssets.heroBuilding, "https://project.supabase.co/storage/v1/object/public/hotel-assets/"),
      "https://project.supabase.co/storage/v1/object/public/hotel-assets/images/hero/building.webp",
    );
  });
});
