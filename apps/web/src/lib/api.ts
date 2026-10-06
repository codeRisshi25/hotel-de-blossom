import { localIsoDate } from "./dates";
import { validateInquiry, type ApiError, type InquiryCreated, type InquiryPurpose } from "@hdb/shared";

export type BookingForm = {
  purpose: InquiryPurpose;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  consent: boolean;
  honeypot: string;
};

export class BookingError extends Error {}

/** A one-day event may repeat its start date as the end date; the API expects no end date then. */
const normalise = (form: BookingForm): BookingForm =>
  form.checkOut && form.checkOut === form.checkIn ? { ...form, checkOut: "" } : form;

/** Same rules the API enforces, so guests see problems before submitting. */
export const checkBooking = (raw: BookingForm) => {
  const form = normalise(raw);
  const result = validateInquiry({ ...form, honeypot: "" });
  if (result.error) return result.error;
  const today = localIsoDate();
  if (form.checkIn && form.checkIn < today) return "Check-in cannot be in the past.";
  if (form.purpose !== "event" && !form.checkIn) return "Choose your check-in date.";
  return null;
};

/**
 * Sends a booking *request* to the front desk. It is stored with status `new`;
 * reception confirms availability and price before anything is booked.
 */
export const sendBookingRequest = async (raw: BookingForm, idempotencyKey: string) => {
  const form = normalise(raw);
  const response = await fetch("/api/inquiries", {
    method: "POST",
    headers: { "content-type": "application/json", "idempotency-key": idempotencyKey },
    body: JSON.stringify({
      ...form,
      checkIn: form.checkIn || undefined,
      checkOut: form.checkOut || undefined,
      email: form.email || undefined,
      roomType: form.roomType || undefined,
      message: form.message || undefined,
    }),
  });
  const payload = (await response.json().catch(() => null)) as (InquiryCreated & ApiError) | { ok: true } | null;
  if (!response.ok || !payload) {
    const message = payload && "error" in payload ? payload.error.message : null;
    throw new BookingError(message ?? "We could not reach the front desk. Please try again, or call us directly.");
  }
  if (!("data" in payload)) throw new BookingError("We could not send this request. Please call the front desk.");
  return payload.data;
};

export type PublicRate = { roomType: string; baseNightlyInr: number };

export const fetchRates = async (): Promise<PublicRate[]> => {
  const response = await fetch("/api/rates");
  if (!response.ok) return [];
  const payload = (await response.json().catch(() => null)) as { data?: PublicRate[] } | null;
  return payload?.data ?? [];
};

export const newRequestKey = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}-web`;

export const inr = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
