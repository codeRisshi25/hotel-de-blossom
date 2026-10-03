import { bearerToken, errorResponse, json, requestId } from "../../../../src/server/http";
import { rpc } from "../../../../src/server/supabase-rest";
import type { Env } from "../../../../src/server/types";

type Notification = {
  id: string;
  kind: "reception_new_inquiry";
  payload: Record<string, string | number | null | undefined>;
  attempts: number;
  lease_token: string;
};

const sendReceptionEmail = async (env: Env, notification: Notification) => {
  if (!env.RESEND_API_KEY || !env.RECEPTION_EMAIL || !env.RESEND_FROM_EMAIL) throw new Error("Notification email is not configured.");
  const p = notification.payload;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL,
      to: [env.RECEPTION_EMAIL],
      subject: `New Hotel De Blossom enquiry ${p.reference ?? ""}`.trim(),
      text: [
        `Reference: ${p.reference ?? ""}`,
        `Type: ${p.purpose ?? ""}`,
        `Guest: ${p.name ?? ""}`,
        `Phone: ${p.phone ?? ""}`,
        `Email: ${p.email ?? ""}`,
        `Check-in: ${p.checkIn ?? "Not specified"}`,
        `Check-out: ${p.checkOut ?? "Not specified"}`,
        `Guests: ${p.guests ?? ""}`,
        `Room: ${p.roomType ?? "Not specified"}`,
        `Message: ${p.message ?? ""}`,
      ].join("\n"),
    }),
  });
  if (!response.ok) throw new Error(`Notification provider returned ${response.status}.`);
};

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  const id = requestId(request);
  const secret = bearerToken(request);
  if (!secret || secret !== env.INTERNAL_API_SECRET) return errorResponse(401, "UNAUTHORIZED", "Unauthorized.", id);

  try {
    const claimed = await rpc<Notification[]>(env, "claim_notification_batch", { p_limit: 10 });
    let sent = 0;
    let failed = 0;
    for (const notification of claimed) {
      try {
        await sendReceptionEmail(env, notification);
        await rpc(env, "mark_notification_sent", { p_id: notification.id, p_lease_token: notification.lease_token });
        sent += 1;
      } catch (error) {
        const delay = Math.min(3_600_000, 30_000 * (2 ** Math.min(notification.attempts, 7)));
        await rpc(env, "mark_notification_failed", {
          p_id: notification.id,
          p_lease_token: notification.lease_token,
          p_error: error instanceof Error ? error.message : "Unknown notification error.",
          p_retry_at: new Date(Date.now() + delay).toISOString(),
        }).catch(() => undefined);
        failed += 1;
      }
    }
    return json({ data: { claimed: claimed.length, sent, failed } }, 200, { "x-request-id": id });
  } catch (error) {
    console.error(JSON.stringify({ requestId: id, error: error instanceof Error ? error.message : "unknown" }));
    return errorResponse(503, "NOTIFICATIONS_UNAVAILABLE", "Notifications could not be processed.", id);
  }
};
