import { BodyTooLargeError, errorResponse, isUuid, json, readJsonObject, requestId, routeParam } from "../../../src/server/http";
import { requireStaff } from "../../../src/server/staff-auth";
import { listRoomRates, updateRoomRate } from "../../../src/server/supabase-rest";
import type { Env } from "../../../src/server/types";

type Params = Record<string, string | string[]>;

export const onRequestGet = async ({ request, env }: { request: Request; env: Env }) => {
  const id = requestId(request);
  const auth = await requireStaff(request, env);
  if ("response" in auth) return auth.response;
  try {
    return json({ data: await listRoomRates(env) }, 200, { "x-request-id": id });
  } catch (error) {
    console.error(JSON.stringify({ requestId: id, error: error instanceof Error ? error.message : "unknown" }));
    return errorResponse(503, "RATES_UNAVAILABLE", "Room rates are temporarily unavailable.", id);
  }
};

export const onRequestPatch = async ({ request, env, params }: { request: Request; env: Env; params: Params }) => {
  const id = requestId(request);
  const auth = await requireStaff(request, env);
  if ("response" in auth) return auth.response;
  if (!["manager", "admin"].includes(auth.profile.role)) return errorResponse(403, "MANAGER_REQUIRED", "Manager access is required.", id);

  const rateId = routeParam(params, "id");
  if (!isUuid(rateId)) return errorResponse(404, "NOT_FOUND", "Room rate not found.", id);

  let body: Record<string, unknown>;
  try {
    body = await readJsonObject(request, 4_096);
  } catch (error) {
    if (error instanceof BodyTooLargeError) return errorResponse(413, "BODY_TOO_LARGE", "The update is too large.", id);
    return errorResponse(400, "INVALID_JSON", "Send a valid JSON request.", id);
  }

  const price = body.baseNightlyInr;
  if (typeof price !== "number" || !Number.isInteger(price) || price < 0 || price > 10_000_000) {
    return errorResponse(422, "INVALID_PRICE", "Price must be a whole, non-negative INR amount.", id);
  }

  try {
    const updated = await updateRoomRate(env, rateId, price);
    if (!updated) return errorResponse(404, "NOT_FOUND", "Room rate not found.", id);
    return json({ data: updated }, 200, { "x-request-id": id });
  } catch (error) {
    console.error(JSON.stringify({ requestId: id, error: error instanceof Error ? error.message : "unknown" }));
    return errorResponse(503, "RATES_UNAVAILABLE", "The room rate could not be updated.", id);
  }
};
