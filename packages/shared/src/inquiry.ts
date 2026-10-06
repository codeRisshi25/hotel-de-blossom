export type InquiryPurpose = "stay" | "event" | "group_stay";
export type InquiryStatus = "new" | "contacted" | "provisional" | "confirmed" | "cancelled" | "closed";

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

/** Successful `POST /api/inquiries` body. Every new request lands at the front desk as `new`. */
export type InquiryCreated = {
  data: { inquiryId: string; reference: string; status: InquiryStatus };
  deduplicated?: boolean;
};

export type ApiError = { error: { code: string; message: string; requestId: string } };
