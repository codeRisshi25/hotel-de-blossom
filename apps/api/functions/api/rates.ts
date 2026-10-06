import { errorResponse, json, requestId } from "../../src/server/http";
import { listRoomRates } from "../../src/server/supabase-rest";
import type { Env, RoomRate } from "../../src/server/types";

/** Public, read-only "from" prices for the website. Staff edit these in the dashboard. */
export const onRequestGet = async ({ request, env }: { request: Request; env: Env }) => {
  const id = requestId(request);
  try {
    const rates = (await listRoomRates(env)) as RoomRate[];
    const data = rates.map(({ room_type, base_nightly_inr }) => ({ roomType: room_type, baseNightlyInr: base_nightly_inr }));
    return json({ data }, 200, { "x-request-id": id, "cache-control": "public, max-age=300" });
  } catch {
    return errorResponse(503, "RATES_UNAVAILABLE", "Room rates are temporarily unavailable.", id);
  }
};
