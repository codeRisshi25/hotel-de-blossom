import { errorResponse, isUuid, json, requestId, routeParam } from "../../../../../src/server/http";
import { requireStaff } from "../../../../../src/server/staff-auth";
import { archiveInquiry } from "../../../../../src/server/supabase-rest";
import type { Env } from "../../../../../src/server/types";

export const onRequestPost = async ({ request, env, params }: { request: Request; env: Env; params: Record<string, string | string[]> }) => {
  const id = requestId(request);
  const auth = await requireStaff(request, env);
  if ("response" in auth) return auth.response;
  const inquiryId = routeParam(params, "id");
  if (!isUuid(inquiryId)) return errorResponse(404, "NOT_FOUND", "Enquiry not found.", id);
  const archived = new URL(request.url).searchParams.get("archived") !== "false";

  try {
    const row = await archiveInquiry(env, inquiryId, auth.userId, archived);
    if (!row) return errorResponse(422, "ARCHIVE_NOT_ALLOWED", "Only closed or cancelled enquiries can be archived.", id);
    return json({ data: row }, 200, { "x-request-id": id });
  } catch (error) {
    console.error(JSON.stringify({ requestId: id, error: error instanceof Error ? error.message : "unknown" }));
    return errorResponse(503, "ARCHIVE_UNAVAILABLE", "The enquiry could not be archived.", id);
  }
};
