import { bearerToken, errorResponse, json, requestId } from "../../../../src/server/http";
import { drainNotifications } from "../../../../src/server/notifications";
import type { Env } from "../../../../src/server/types";

/** Manual / scheduled retry of the notification outbox. Normal delivery already happens on submit. */
export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  const id = requestId(request);
  const secret = bearerToken(request);
  if (!secret || secret !== env.INTERNAL_API_SECRET) return errorResponse(401, "UNAUTHORIZED", "Unauthorized.", id);

  try {
    return json({ data: await drainNotifications(env) }, 200, { "x-request-id": id });
  } catch (error) {
    console.error(JSON.stringify({ requestId: id, error: error instanceof Error ? error.message : "unknown" }));
    return errorResponse(503, "NOTIFICATIONS_UNAVAILABLE", "Notifications could not be processed.", id);
  }
};
