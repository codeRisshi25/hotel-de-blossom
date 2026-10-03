import { errorResponse, json, requestId } from "../../../src/server/http";
import { requireStaff } from "../../../src/server/staff-auth";
import { listInquiries } from "../../../src/server/supabase-rest";
import type { Env, InquiryStatus } from "../../../src/server/types";

const statuses = new Set<InquiryStatus>(["new", "contacted", "provisional", "confirmed", "cancelled", "closed"]);

export const onRequestGet = async ({ request, env }: { request: Request; env: Env }) => {
  const id = requestId(request);
  const auth = await requireStaff(request, env);
  if ("response" in auth) return auth.response;

  const url = new URL(request.url);
  const requestedStatus = url.searchParams.get("status") as InquiryStatus | null;
  if (requestedStatus && !statuses.has(requestedStatus)) return errorResponse(422, "INVALID_STATUS", "The enquiry status is invalid.", id);
  const status = requestedStatus || undefined;
  const requestedLimit = Number(url.searchParams.get("limit") || 25);
  const limit = Number.isInteger(requestedLimit) ? Math.max(1, Math.min(requestedLimit, 50)) : 25;
  const before = url.searchParams.get("before") || undefined;
  if (before) {
    const [createdAt, inquiryId] = before.split("|", 2);
    if (!createdAt || !inquiryId || Number.isNaN(Date.parse(createdAt))) return errorResponse(400, "INVALID_CURSOR", "The pagination cursor is invalid.", id);
  }

  try {
    const rows = await listInquiries(env, { status, limit, before }) as Array<{ id: string; created_at: string }>;
    const last = rows[rows.length - 1];
    return json({ data: rows, nextBefore: rows.length === limit && last ? `${last.created_at}|${last.id}` : null }, 200, { "x-request-id": id });
  } catch (error) {
    console.error(JSON.stringify({ requestId: id, error: error instanceof Error ? error.message : "unknown" }));
    return errorResponse(503, "INQUIRIES_UNAVAILABLE", "The enquiry list is temporarily unavailable.", id);
  }
};
