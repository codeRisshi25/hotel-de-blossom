import { BodyTooLargeError, errorResponse, isUuid, json, readJsonObject, requestId, routeParam } from "../../../../../src/server/http";
import { requireStaff } from "../../../../../src/server/staff-auth";
import { addNote, getInquiry } from "../../../../../src/server/supabase-rest";
import type { Env } from "../../../../../src/server/types";

export const onRequestPost = async ({ request, env, params }: { request: Request; env: Env; params: Record<string, string | string[]> }) => {
  const id = requestId(request);
  const auth = await requireStaff(request, env);
  if ("response" in auth) return auth.response;
  const inquiryId = routeParam(params, "id");
  if (!isUuid(inquiryId)) return errorResponse(404, "NOT_FOUND", "Enquiry not found.", id);

  let body: Record<string, unknown>;
  try {
    body = await readJsonObject(request, 8_192);
  } catch (error) {
    if (error instanceof BodyTooLargeError) return errorResponse(413, "BODY_TOO_LARGE", "The note is too large.", id);
    return errorResponse(400, "INVALID_JSON", "Send a valid JSON request.", id);
  }
  const note = typeof body.body === "string" ? body.body.trim() : "";
  if (note.length < 1 || note.length > 4_000) return errorResponse(422, "INVALID_NOTE", "Enter a note between 1 and 4,000 characters.", id);

  try {
    if (!(await getInquiry(env, inquiryId))) return errorResponse(404, "NOT_FOUND", "Enquiry not found.", id);
    const result = await addNote(env, inquiryId, auth.userId, note);
    return json({ data: result }, 201, { "x-request-id": id });
  } catch (error) {
    console.error(JSON.stringify({ requestId: id, error: error instanceof Error ? error.message : "unknown" }));
    return errorResponse(503, "NOTE_UNAVAILABLE", "The note could not be saved.", id);
  }
};
