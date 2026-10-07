import { errorResponse, json, requestId } from "../../../src/server/http";
import { drainInBackground } from "../../../src/server/notifications";
import { requireStaff } from "../../../src/server/staff-auth";
import { summary } from "../../../src/server/supabase-rest";
import type { Env } from "../../../src/server/types";

export const onRequestGet = async ({ request, env, waitUntil }: { request: Request; env: Env; waitUntil?: (promise: Promise<unknown>) => void }) => {
  const id = requestId(request);
  const auth = await requireStaff(request, env);
  if ("response" in auth) return auth.response;
  // Opportunistically retry any enquiry emails that failed earlier.
  drainInBackground(env, waitUntil);
  try {
    return json({ data: await summary(env) }, 200, { "x-request-id": id });
  } catch (error) {
    console.error(JSON.stringify({ requestId: id, error: error instanceof Error ? error.message : "unknown" }));
    return errorResponse(503, "SUMMARY_UNAVAILABLE", "The dashboard summary is temporarily unavailable.", id);
  }
};
