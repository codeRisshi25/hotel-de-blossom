import { BodyTooLargeError, errorResponse, json, readJson, requestId } from "../../src/server/http";
import { createInquiry, findInquiryByIdempotencyKey } from "../../src/server/supabase-rest";
import { validateInquiry } from "@hdb/shared";
import type { Env } from "../../src/server/types";

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  const id = requestId(request);

  let body: unknown;
  try {
    body = await readJson(request);
  } catch (error) {
    if (error instanceof BodyTooLargeError) return errorResponse(413, "BODY_TOO_LARGE", "The enquiry is too large.", id);
    return errorResponse(400, "INVALID_JSON", "Send a valid JSON request.", id);
  }

  const parsed = validateInquiry(body);
  if (parsed.honeypot) return json({ ok: true }, 202, { "x-request-id": id });
  if (parsed.error || !parsed.value) return errorResponse(422, "VALIDATION_ERROR", parsed.error ?? "Invalid enquiry.", id);

  const idempotencyKey = request.headers.get("idempotency-key")?.trim() || crypto.randomUUID();
  if (idempotencyKey.length < 16 || idempotencyKey.length > 160) {
    return errorResponse(400, "INVALID_IDEMPOTENCY_KEY", "The request key is invalid.", id);
  }

  try {
    const result = await createInquiry(env, parsed.value, idempotencyKey);
    return json({ data: { inquiryId: result.inquiry_id, reference: result.reference, status: result.status } }, 201, { "x-request-id": id });
  } catch (error) {
    const existing = await findInquiryByIdempotencyKey(env, idempotencyKey).catch(() => null);
    if (existing) {
      return json({ data: { inquiryId: existing.id, reference: existing.reference_code, status: existing.status }, deduplicated: true }, 200, { "x-request-id": id });
    }
    console.error(JSON.stringify({ requestId: id, error: error instanceof Error ? error.message : "unknown" }));
    return errorResponse(503, "INQUIRY_UNAVAILABLE", "We could not save the enquiry. Please try again.", id);
  }
};
