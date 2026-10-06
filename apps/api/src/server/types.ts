import type { InquiryPayload, InquiryPurpose, InquiryStatus } from "@hdb/shared";

export type { InquiryPayload, InquiryPurpose, InquiryStatus };
export type StaffRole = "receptionist" | "manager" | "admin";
export type RoomRate = { id: string; room_type: string; base_nightly_inr: number; is_active: boolean; updated_at: string };

export type Env = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  INTERNAL_API_SECRET: string;
  RESEND_API_KEY?: string;
  RECEPTION_EMAIL?: string;
  RESEND_FROM_EMAIL?: string;
};
