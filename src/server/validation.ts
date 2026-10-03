import type { InquiryPayload, InquiryPurpose } from "./types";

const purposes = new Set<InquiryPurpose>(["stay", "event", "group_stay"]);
const isoDate = /^\d{4}-\d{2}-\d{2}$/;
const phone = /^\+?[0-9 ()-]{7,32}$/;
const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const text = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export const validateInquiry = (input: unknown): { value?: InquiryPayload; error?: string; honeypot?: boolean } => {
  if (!input || typeof input !== "object") return { error: "Invalid request body." };
  const raw = input as Record<string, unknown>;
  if (text(raw.honeypot, 80)) return { honeypot: true };

  const purpose = text(raw.purpose, 20) as InquiryPurpose;
  const name = text(raw.name, 120);
  const phoneNumber = text(raw.phone, 32);
  const emailAddress = text(raw.email, 254);
  const checkIn = text(raw.checkIn, 10);
  const checkOut = text(raw.checkOut, 10);
  const guests = Number(raw.guests);

  if (!purposes.has(purpose)) return { error: "Select a valid enquiry type." };
  if (!name) return { error: "Name is required." };
  if (!phone.test(phoneNumber)) return { error: "Enter a valid phone number." };
  if (emailAddress && !email.test(emailAddress)) return { error: "Enter a valid email address." };
  if (!Number.isInteger(guests) || guests < 1 || guests > 100) return { error: "Enter a valid guest count." };
  if (checkIn && !isoDate.test(checkIn)) return { error: "Check-in date is invalid." };
  if (checkOut && !isoDate.test(checkOut)) return { error: "Check-out date is invalid." };
  if (checkIn && checkOut && checkOut <= checkIn) return { error: "Check-out must be after check-in." };
  if (raw.consent !== true) return { error: "Consent is required." };

  return {
    value: {
      purpose,
      checkIn: checkIn || undefined,
      checkOut: checkOut || undefined,
      guests,
      roomType: text(raw.roomType, 120) || undefined,
      name,
      phone: phoneNumber,
      email: emailAddress || undefined,
      message: text(raw.message, 4000) || undefined,
      consent: true,
      source: "website",
    },
  };
};
