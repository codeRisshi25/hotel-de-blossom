import { BodyTooLargeError, errorResponse, json, readJson, requestId } from "../../../../src/server/http";
import { requireStaff } from "../../../../src/server/staff-auth";
import { getInquiry, listInquiryEvents, listInquiryNotes, getStaffProfile, updateInquiry } from "../../../../src/server/supabase-rest";
import type { Env, InquiryStatus } from "../../../../src/server/types";

const statuses = new Set<InquiryStatus>(["new", "contacted", "provisional", "confirmed", "cancelled", "closed"]);

type RouteContext = { request: Request; env: Env; params: Record<string, string | string[]> };

const getId = (params: RouteContext["params"]) => {
  const value = params.id;
  return (Array.isArray(value) ? value[0] : value)?.trim();
};

export const onRequestGet = async ({ request, env, params }: RouteContext) => {
  const id = requestId(request);
  const auth = await requireStaff(request, env);
  if ("response" in auth) return auth.response;
  const inquiryId = getId(params);
  if (!inquiryId) return errorResponse(400, "INVALID_ID", "An enquiry ID is required.", id);

  try {
    const inquiry = await getInquiry(env, inquiryId);
    if (!inquiry) return errorResponse(404, "NOT_FOUND", "Enquiry not found.", id);
    const [notes, events] = await Promise.all([listInquiryNotes(env, inquiryId), listInquiryEvents(env, inquiryId)]);
    return json({ data: { inquiry, notes, events } }, 200, { "x-request-id": id });
  } catch (error) {
    console.error(JSON.stringify({ requestId: id, error: error instanceof Error ? error.message : "unknown" }));
    return errorResponse(503, "INQUIRY_UNAVAILABLE", "The enquiry is temporarily unavailable.", id);
  }
};

export const onRequestPatch = async ({ request, env, params }: RouteContext) => {
  const id = requestId(request);
  const auth = await requireStaff(request, env);
  if ("response" in auth) return auth.response;
  const inquiryId = getId(params);
  if (!inquiryId) return errorResponse(400, "INVALID_ID", "An enquiry ID is required.", id);

  let body: Record<string, unknown>;
  try {
    body = await readJson(request, 8_192) as Record<string, unknown>;
  } catch (error) {
    if (error instanceof BodyTooLargeError) return errorResponse(413, "BODY_TOO_LARGE", "The update is too large.", id);
    return errorResponse(400, "INVALID_JSON", "Send a valid JSON request.", id);
  }

  const patch: { status?: InquiryStatus; assigned_to?: string | null; has_assigned_to: boolean; follow_up_at?: string | null; has_follow_up_at: boolean } = {
    has_assigned_to: false,
    has_follow_up_at: false,
  };
  if (body.status !== undefined) {
    if (typeof body.status !== "string" || !statuses.has(body.status as InquiryStatus)) return errorResponse(422, "INVALID_STATUS", "The enquiry status is invalid.", id);
    patch.status = body.status as InquiryStatus;
  }
  if (body.assignedTo !== undefined) {
    if (body.assignedTo !== null && typeof body.assignedTo !== "string") return errorResponse(422, "INVALID_ASSIGNEE", "The assignee is invalid.", id);
    if (typeof body.assignedTo === "string" && !(await getStaffProfile(env, body.assignedTo))) return errorResponse(422, "INVALID_ASSIGNEE", "The assignee is not active staff.", id);
    patch.assigned_to = body.assignedTo as string | null;
    patch.has_assigned_to = true;
  }
  if (body.followUpAt !== undefined) {
    if (body.followUpAt !== null && (typeof body.followUpAt !== "string" || Number.isNaN(Date.parse(body.followUpAt)))) return errorResponse(422, "INVALID_FOLLOW_UP", "The follow-up date is invalid.", id);
    patch.follow_up_at = body.followUpAt as string | null;
    patch.has_follow_up_at = true;
  }
  if (!Object.keys(patch).length) return errorResponse(422, "EMPTY_UPDATE", "Provide a status, assignee, or follow-up date.", id);

  try {
    const updated = await updateInquiry(env, inquiryId, auth.userId, patch);
    if (!updated) return errorResponse(404, "NOT_FOUND", "Enquiry not found.", id);
    return json({ data: updated }, 200, { "x-request-id": id });
  } catch (error) {
    console.error(JSON.stringify({ requestId: id, error: error instanceof Error ? error.message : "unknown" }));
    return errorResponse(503, "UPDATE_UNAVAILABLE", "The enquiry could not be updated.", id);
  }
};
