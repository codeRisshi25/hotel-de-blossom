import { errorResponse, json, requestId } from "../../../src/server/http";
import { requireStaff } from "../../../src/server/staff-auth";
import { listStaff } from "../../../src/server/supabase-rest";
import type { Env } from "../../../src/server/types";

export const onRequestGet = async ({ request, env }: { request: Request; env: Env }) => {
  const id = requestId(request);
  const auth = await requireStaff(request, env);
  if ("response" in auth) return auth.response;
  try {
    return json({ data: await listStaff(env) }, 200, { "x-request-id": id });
  } catch (error) {
    console.error(JSON.stringify({ requestId: id, error: error instanceof Error ? error.message : "unknown" }));
    return errorResponse(503, "STAFF_UNAVAILABLE", "The staff directory is temporarily unavailable.", id);
  }
};
