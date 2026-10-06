import { createClient, type Session } from "@supabase/supabase-js";

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
export const configured = Boolean(url && key);
export const supabase = configured ? createClient(url!, key!, { auth: { persistSession: true, autoRefreshToken: true } }) : null;

export type InquiryStatus = "new" | "contacted" | "provisional" | "confirmed" | "cancelled" | "closed";
export type Inquiry = { id: string; reference_code: string; purpose: "stay" | "event" | "group_stay"; check_in: string | null; check_out: string | null; guests: number; room_type: string | null; guest_name: string; phone: string; email: string | null; message: string | null; status: InquiryStatus; assigned_to: string | null; follow_up_at: string | null; archived_at?: string | null; created_at: string; updated_at: string };
export type StaffMember = { user_id: string; display_name: string; role: "receptionist" | "manager" | "admin"; is_active: boolean };
export type Rate = { id: string; room_type: string; base_nightly_inr: number; is_active: boolean; updated_at: string };
export type Summary = { new: number; unassignedNew: number; overdueFollowups: number; dueToday: number };
export type InquiryDetail = { inquiry: Inquiry & { source: string; consent_at: string; internal_notes: string | null }; notes: Array<{ id: string; body: string; author_user_id: string; created_at: string }>; events: Array<{ id: number; event_type: string; actor_user_id: string | null; from_status: InquiryStatus | null; to_status: InquiryStatus | null; metadata: Record<string, unknown>; created_at: string }> };

export async function api<T>(session: Session, path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, { ...init, headers: { authorization: `Bearer ${session.access_token}`, "content-type": "application/json", ...init?.headers } });
  const payload = await response.json().catch(() => ({})) as { data?: T; error?: { message?: string }; message?: string };
  if (!response.ok) throw new Error(payload.error?.message || payload.message || "The staff desk could not complete that request.");
  return payload as T;
}
