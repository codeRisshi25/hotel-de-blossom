export type InquiryPurpose = "stay" | "event" | "group_stay";
export type InquiryStatus = "new" | "contacted" | "provisional" | "confirmed" | "cancelled" | "closed";
export type StaffRole = "receptionist" | "manager" | "admin";
export type RoomRate = { id: string; room_type: string; base_nightly_inr: number; is_active: boolean; updated_at: string };

export type InquiryPayload = {
  purpose: InquiryPurpose;
  checkIn?: string;
  checkOut?: string;
  guests: number;
  roomType?: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  consent: boolean;
  source?: string;
};

export type Env = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  INTERNAL_API_SECRET: string;
  RESEND_API_KEY?: string;
  RECEPTION_EMAIL?: string;
  RESEND_FROM_EMAIL?: string;
};
