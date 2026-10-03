import type { Env, InquiryPayload, InquiryStatus, StaffRole } from "./types";

const endpoint = (env: Env, path: string) => `${env.SUPABASE_URL.replace(/\/$/, "")}${path}`;

const responseJson = async <T>(response: Response): Promise<T> => {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = typeof data === "object" && data && "message" in data ? String(data.message) : "Database request failed.";
    throw new Error(message);
  }
  return data as T;
};

const serviceHeaders = (env: Env, extra: HeadersInit = {}) => ({
  apikey: env.SUPABASE_SERVICE_ROLE_KEY,
  authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
  ...extra,
});

export const createInquiry = async (env: Env, payload: InquiryPayload, idempotencyKey: string) => {
  const response = await fetch(endpoint(env, "/rest/v1/rpc/create_public_inquiry"), {
    method: "POST",
    headers: serviceHeaders(env, { "content-type": "application/json" }),
    body: JSON.stringify({ p_payload: payload, p_request_id: idempotencyKey }),
  });
  const result = await responseJson<Array<{ inquiry_id: string; reference: string; status: InquiryStatus }>>(response);
  return result[0];
};

export const getAuthUser = async (env: Env, token: string) => {
  const response = await fetch(endpoint(env, "/auth/v1/user"), {
    headers: { apikey: env.SUPABASE_ANON_KEY, authorization: `Bearer ${token}` },
  });
  if (!response.ok) return null;
  return response.json() as Promise<{ id: string; email?: string }>;
};

export const getStaffProfile = async (env: Env, userId: string) => {
  const query = new URLSearchParams({ select: "user_id,display_name,role,is_active", user_id: `eq.${userId}`, is_active: "eq.true", limit: "1" });
  const response = await fetch(endpoint(env, `/rest/v1/staff_profiles?${query}`), { headers: serviceHeaders(env) });
  const rows = await responseJson<Array<{ user_id: string; display_name: string; role: StaffRole; is_active: boolean }>>(response);
  return rows[0] ?? null;
};

export const listInquiries = async (env: Env, params: { status?: InquiryStatus; limit: number; before?: string }) => {
  const query = new URLSearchParams({
    select: "id,reference_code,purpose,check_in,check_out,guests,room_type,guest_name,phone,email,message,status,assigned_to,follow_up_at,created_at,updated_at",
    order: "created_at.desc,id.desc",
    limit: String(params.limit),
  });
  if (params.status) query.set("status", `eq.${params.status}`);
  if (params.before) {
    const [beforeCreatedAt, beforeId] = params.before.split("|", 2);
    if (beforeCreatedAt && beforeId) {
      query.set("or", `(created_at.lt.${beforeCreatedAt},and(created_at.eq.${beforeCreatedAt},id.lt.${beforeId}))`);
    }
  }
  const response = await fetch(endpoint(env, `/rest/v1/inquiries?${query}`), { headers: serviceHeaders(env) });
  return responseJson(response);
};

export const getInquiry = async (env: Env, id: string) => {
  const query = new URLSearchParams({ select: "*", id: `eq.${id}`, limit: "1" });
  const response = await fetch(endpoint(env, `/rest/v1/inquiries?${query}`), { headers: serviceHeaders(env) });
  const rows = await responseJson<unknown[]>(response);
  return rows[0] ?? null;
};

export const findInquiryByIdempotencyKey = async (env: Env, idempotencyKey: string) => {
  const query = new URLSearchParams({ select: "id,reference_code,status", idempotency_key: `eq.${idempotencyKey}`, limit: "1" });
  const response = await fetch(endpoint(env, `/rest/v1/inquiries?${query}`), { headers: serviceHeaders(env) });
  const rows = await responseJson<Array<{ id: string; reference_code: string; status: InquiryStatus }>>(response);
  return rows[0] ?? null;
};

export const listInquiryNotes = async (env: Env, inquiryId: string) => {
  const query = new URLSearchParams({ select: "id,body,author_user_id,created_at", inquiry_id: `eq.${inquiryId}`, order: "created_at.desc" });
  const response = await fetch(endpoint(env, `/rest/v1/inquiry_notes?${query}`), { headers: serviceHeaders(env) });
  return responseJson(response);
};

export const listInquiryEvents = async (env: Env, inquiryId: string) => {
  const query = new URLSearchParams({ select: "id,event_type,actor_user_id,from_status,to_status,metadata,created_at", inquiry_id: `eq.${inquiryId}`, order: "created_at.desc" });
  const response = await fetch(endpoint(env, `/rest/v1/inquiry_events?${query}`), { headers: serviceHeaders(env) });
  return responseJson(response);
};

export const updateInquiry = async (env: Env, id: string, actorUserId: string, patch: { status?: InquiryStatus; assigned_to?: string | null; has_assigned_to: boolean; follow_up_at?: string | null; has_follow_up_at: boolean }) => {
  const response = await fetch(endpoint(env, "/rest/v1/rpc/update_inquiry_as_staff"), {
    method: "POST",
    headers: serviceHeaders(env, { "content-type": "application/json", prefer: "return=representation" }),
    body: JSON.stringify({
      p_id: id,
      p_actor_user_id: actorUserId,
      p_status: patch.status ?? null,
      p_assigned_to: patch.assigned_to ?? null,
      p_has_assigned_to: patch.has_assigned_to,
      p_follow_up_at: patch.follow_up_at ?? null,
      p_has_follow_up_at: patch.has_follow_up_at,
    }),
  });
  const rows = await responseJson<unknown[]>(response);
  return rows[0] ?? null;
};

export const addNote = async (env: Env, inquiryId: string, authorUserId: string, body: string) => {
  const response = await fetch(endpoint(env, "/rest/v1/inquiry_notes"), {
    method: "POST",
    headers: serviceHeaders(env, { "content-type": "application/json", prefer: "return=representation" }),
    body: JSON.stringify({ inquiry_id: inquiryId, author_user_id: authorUserId, body }),
  });
  const rows = await responseJson<unknown[]>(response);
  return rows[0] ?? null;
};

export const rpc = async <T>(env: Env, name: string, body: Record<string, unknown>) => {
  const response = await fetch(endpoint(env, `/rest/v1/rpc/${name}`), {
    method: "POST",
    headers: serviceHeaders(env, { "content-type": "application/json" }),
    body: JSON.stringify(body),
  });
  return responseJson<T>(response);
};
