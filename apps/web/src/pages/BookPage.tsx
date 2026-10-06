import { useMemo, useRef } from "react";
import { useSearchParams } from "react-router";
import type { InquiryPurpose } from "@hdb/shared";
import { PageHero } from "../components/PageHero";
import { BookingForm } from "../booking/BookingForm";
import { useScrollAnimations } from "../lib/useScrollAnimations";
import { useTitle } from "../lib/useTitle";

/** Shareable booking-request page, e.g. /book?room=Deluxe%20Double&checkIn=2026-11-14 */
export default function BookPage() {
  const ref = useRef<HTMLDivElement>(null);
  const [params] = useSearchParams();
  useTitle("Request a booking");
  useScrollAnimations(ref);
  const prefill = useMemo(() => {
    const purpose = params.get("purpose");
    return {
      roomType: params.get("room") ?? undefined,
      checkIn: params.get("checkIn") ?? undefined,
      checkOut: params.get("checkOut") ?? undefined,
      guests: Number(params.get("guests")) || undefined,
      purpose: purpose === "event" || purpose === "group_stay" ? (purpose as InquiryPurpose) : undefined,
    };
  }, [params]);
  return (
    <div ref={ref}>
      <PageHero eyebrow="Reserve" image="rooms/deluxe-double/double-bed" alt="Deluxe Double bedroom" title={<>Request your <em className="gold-text">stay.</em></>} intro="Your request goes straight to our front desk. Reception confirms availability and tariff with you before anything is booked." />
      <section className="px-5 py-20 md:px-10 md:py-28">
        <div data-reveal className="mx-auto max-w-2xl rounded-[28px] border border-gold/30 bg-ivory p-6 md:p-10">
          <BookingForm prefill={prefill} />
        </div>
      </section>
    </div>
  );
}
