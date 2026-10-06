import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, Check, Minus, Phone, Plus } from "lucide-react";
import type { InquiryPurpose } from "@hdb/shared";
import { BookingError, checkBooking, newRequestKey, sendBookingRequest, type BookingForm as Form } from "../lib/api";
import { hotel, whatsappLink } from "../content/site";
import { roomOptions, type BookingPrefill } from "./BookingContext";
import { gsap, prefersReducedMotion } from "../lib/motion";
import { addDays, localIsoDate, nightsBetween } from "../lib/dates";

const purposes: Array<{ id: InquiryPurpose; label: string }> = [
  { id: "stay", label: "Stay" },
  { id: "group_stay", label: "Group stay" },
  { id: "event", label: "Event" },
];

const today = () => localIsoDate();

const emptyForm = (prefill: BookingPrefill): Form => ({
  purpose: prefill.purpose ?? "stay",
  checkIn: prefill.checkIn ?? "",
  checkOut: prefill.checkOut ?? "",
  guests: prefill.guests ?? 2,
  roomType: prefill.roomType ?? "",
  name: "",
  phone: "",
  email: "",
  message: "",
  consent: false,
  honeypot: "",
});

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="grid gap-1.5">
      <span className="eyebrow text-[10px] text-forest/70">{label}</span>
      {children}
      {hint && <span className="text-xs text-charcoal/55">{hint}</span>}
    </label>
  );
}

const inputClass =
  "min-h-12 w-full rounded-xl border border-forest/15 bg-ivory px-4 text-[15px] text-charcoal outline-none transition placeholder:text-charcoal/35 focus:border-gold focus:ring-4 focus:ring-gold/15";

type Done = { reference: string; name: string; purpose: InquiryPurpose; checkIn: string; checkOut: string };

export function BookingForm({ prefill = {}, onDone, compact }: { prefill?: BookingPrefill; onDone?: () => void; compact?: boolean }) {
  const [form, setForm] = useState<Form>(() => emptyForm(prefill));
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<Done | null>(null);
  const requestKey = useRef(newRequestKey());
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setForm(emptyForm(prefill)); setDone(null); setError(null); requestKey.current = newRequestKey(); }, [prefill]);

  // The idempotency key survives retries, so a flaky connection can't create duplicate requests.
  const update = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError(null);
  };

  const nights = useMemo(() => {
    if (!form.checkIn || !form.checkOut) return 0;
    return nightsBetween(form.checkIn, form.checkOut);
  }, [form.checkIn, form.checkOut]);

  useEffect(() => {
    if (!done || !successRef.current || prefersReducedMotion()) return;
    gsap.from(successRef.current.querySelectorAll("[data-step]"), { y: 16, opacity: 0, stagger: 0.12, duration: 0.6, ease: "power3.out" });
  }, [done]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    const problem = checkBooking(form);
    if (problem) { setError(problem); return; }
    setBusy(true);
    setError(null);
    try {
      const result = await sendBookingRequest(form, requestKey.current);
      setDone({ reference: result.reference, name: form.name, purpose: form.purpose, checkIn: form.checkIn, checkOut: form.checkOut });
      requestKey.current = newRequestKey();
    } catch (failure) {
      setError(failure instanceof BookingError ? failure.message : "We could not reach the front desk. Please try again, or call us directly.");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    const text = `Hello Hotel De Blossom, I just sent a booking request (${done.reference})${done.checkIn ? ` for ${done.checkIn}${done.checkOut ? ` to ${done.checkOut}` : ""}` : ""}. My name is ${done.name}.`;
    return (
      <div ref={successRef} className="grid gap-6" role="status" aria-live="polite">
        <div data-step className="rounded-2xl border border-gold/40 bg-[#fffaf0] p-6">
          <p className="eyebrow text-gold">Request received</p>
          <p className="display mt-3 text-3xl text-forest">Thank you, {done.name.split(" ")[0]}.</p>
          <p className="mt-4 text-[15px] leading-7 text-charcoal/75">
            Your request is now with our front desk. <strong className="font-semibold text-forest">This is not yet a confirmed booking</strong> — reception will
            contact you to confirm availability and the final tariff.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl bg-forest px-4 py-3 text-ivory">
            <span className="eyebrow text-[10px] text-sandstone">Your reference</span>
            <span className="font-mono text-lg tracking-wider">{done.reference}</span>
          </div>
        </div>
        <ol className="grid gap-3">
          {[
            { title: "Request sent to the front desk", body: "Saved with your reference number.", state: "done" },
            { title: "Reception reviews & contacts you", body: "By phone or WhatsApp, on the number you shared.", state: "next" },
            { title: "Booking confirmed by reception", body: "Your stay is confirmed only after this step.", state: "later" },
          ].map((step, index) => (
            <li data-step key={step.title} className="flex gap-4 rounded-xl border border-forest/10 bg-ivory p-4">
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-semibold ${step.state === "done" ? "bg-gold text-night" : "border border-forest/20 text-forest"}`}>
                {step.state === "done" ? <Check size={16} /> : index + 1}
              </span>
              <span>
                <span className="block font-semibold text-forest">{step.title}</span>
                <span className="text-sm text-charcoal/60">{step.body}</span>
              </span>
            </li>
          ))}
        </ol>
        <div data-step className="flex flex-wrap gap-3">
          <a href={whatsappLink(text)} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#1f6f4a] px-5 text-sm font-semibold text-white transition hover:bg-[#185a3c]">
            Share on WhatsApp <ArrowRight size={16} />
          </a>
          <button type="button" onClick={() => { setDone(null); setForm(emptyForm({})); onDone?.(); }} className="min-h-12 rounded-full border border-forest/20 px-5 text-sm font-semibold text-forest transition hover:bg-forest/5">
            Done
          </button>
        </div>
      </div>
    );
  }

  const isEvent = form.purpose === "event";

  return (
    <form onSubmit={submit} noValidate className="grid gap-5">
      <div role="radiogroup" aria-label="Request type" className="grid grid-cols-3 gap-1 rounded-full border border-forest/15 bg-ivory p-1">
        {purposes.map((purpose) => (
          <button
            key={purpose.id}
            type="button"
            role="radio"
            aria-checked={form.purpose === purpose.id}
            onClick={() => update("purpose", purpose.id)}
            className={`min-h-10 rounded-full text-sm font-semibold transition ${form.purpose === purpose.id ? "bg-forest text-ivory shadow" : "text-forest/70 hover:text-forest"}`}
          >
            {purpose.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 rounded-2xl border border-forest/10 bg-gradient-to-br from-ivory to-ivory/50 p-5 sm:grid-cols-2">
        <Field label={isEvent ? "Event date" : "Check-in"}>
          <div className="relative">
            <input
              className="min-h-13 w-full rounded-xl border-2 border-forest/20 bg-white px-4 text-[15px] text-charcoal outline-none transition placeholder:text-charcoal/35 focus:border-gold focus:ring-4 focus:ring-gold/15 hover:border-forest/30"
              type="date"
              min={today()}
              value={form.checkIn}
              onChange={(event) => {
                const checkIn = event.target.value;
                setForm((current) => ({ ...current, checkIn, checkOut: !isEvent && checkIn && (!current.checkOut || current.checkOut <= checkIn) ? addDays(checkIn, 1) : current.checkOut }));
                setError(null);
              }}
            />
            {form.checkIn && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-xs font-semibold text-gold pointer-events-none">
                <span className="inline-block w-2 h-2 rounded-full bg-gold" />
                Selected
              </div>
            )}
          </div>
        </Field>
        <Field label={isEvent ? "Ends (optional)" : "Check-out"}>
          <div className="relative">
            <input
              className="min-h-13 w-full rounded-xl border-2 border-forest/20 bg-white px-4 text-[15px] text-charcoal outline-none transition placeholder:text-charcoal/35 focus:border-gold focus:ring-4 focus:ring-gold/15 hover:border-forest/30"
              type="date"
              min={form.checkIn ? addDays(form.checkIn, isEvent ? 0 : 1) : today()}
              value={form.checkOut}
              onChange={(event) => update("checkOut", event.target.value)}
            />
            {form.checkOut && form.checkIn && nights > 0 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-semibold text-gold pointer-events-none">
                <span className="inline-block w-2 h-2 rounded-full bg-gold" />
                <span>{nights}N</span>
              </div>
            )}
          </div>
        </Field>
      </div>

      <div className={`grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`}>
        <Field label={isEvent ? "Expected guests" : "Guests"} hint={nights > 0 && !isEvent ? `${nights} night${nights > 1 ? "s" : ""}` : undefined}>
          <div className="flex min-h-12 items-center justify-between rounded-xl border border-forest/15 bg-ivory px-2">
            <button type="button" aria-label="Fewer guests" onClick={() => update("guests", Math.max(1, form.guests - 1))} className="grid h-9 w-9 place-items-center rounded-full text-forest hover:bg-forest/5"><Minus size={16} /></button>
            <input aria-label="Number of guests" inputMode="numeric" className="w-16 bg-transparent text-center text-[15px] font-semibold text-forest outline-none" value={form.guests} onChange={(event) => update("guests", Math.max(1, Math.min(isEvent ? 100 : 30, Number(event.target.value.replace(/\D/g, "")) || 1)))} />
            <button type="button" aria-label="More guests" onClick={() => update("guests", Math.min(isEvent ? 100 : 30, form.guests + 1))} className="grid h-9 w-9 place-items-center rounded-full text-forest hover:bg-forest/5"><Plus size={16} /></button>
          </div>
        </Field>
        <Field label={isEvent ? "Occasion" : "Preferred room"}>
          {isEvent ? (
            <select className={inputClass} value={form.roomType} onChange={(event) => update("roomType", event.target.value)}>
              <option value="">Select an occasion</option>
              {["Banquet — Wedding / Reception", "Banquet — Birthday / Anniversary", "Banquet — Corporate meeting", "Banquet — Other celebration"].map((option) => <option key={option}>{option}</option>)}
            </select>
          ) : (
            <select className={inputClass} value={form.roomType} onChange={(event) => update("roomType", event.target.value)}>
              <option value="">No preference</option>
              {roomOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          )}
        </Field>
      </div>

      <div className={`grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`}>
        <Field label="Full name">
          <input className={inputClass} autoComplete="name" value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Your name" />
        </Field>
        <Field label="Phone / WhatsApp">
          <input className={inputClass} type="tel" autoComplete="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder="+91 98765 43210" />
        </Field>
      </div>
      <Field label="Email (optional)">
        <input className={inputClass} type="email" autoComplete="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="you@example.com" />
      </Field>
      <Field label="Anything we should know? (optional)">
        <textarea className={`${inputClass} min-h-24 py-3`} value={form.message} onChange={(event) => update("message", event.target.value)} placeholder={isEvent ? "Menu preferences, timings, decor…" : "Arrival time, airport pickup, extra bed…"} />
      </Field>

      {/* Honeypot: hidden from people, tempting for bots */}
      <input tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" value={form.honeypot} onChange={(event) => update("honeypot", event.target.value)} />

      <label className="flex items-start gap-3 text-sm leading-6 text-charcoal/70">
        <input type="checkbox" checked={form.consent} onChange={(event) => update("consent", event.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[#163831]" />
        <span>I agree that Hotel De Blossom may contact me about this request by phone, WhatsApp or email.</span>
      </label>

      <p className="rounded-xl border border-gold/30 bg-[#fffaf0] px-4 py-3 text-sm leading-6 text-charcoal/75">
        This sends a <strong className="text-forest">booking request</strong> to our front desk — no payment is taken. Reception confirms availability and the final price with you.
      </p>

      {error && <p role="alert" className="rounded-xl border-l-4 border-red-700 bg-red-50 px-4 py-3 text-sm text-red-900">{error}</p>}

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={busy} className="group inline-flex min-h-13 flex-1 items-center justify-center gap-3 rounded-full bg-gold px-6 py-3.5 text-[15px] font-semibold text-night transition hover:bg-[#c99a40] disabled:opacity-60">
          {busy ? "Sending to the front desk…" : <>Send booking request <ArrowRight size={18} className="transition group-hover:translate-x-1" /></>}
        </button>
        <a href={hotel.phoneHref} className="inline-flex min-h-13 items-center gap-2 rounded-full border border-forest/20 px-5 py-3.5 text-sm font-semibold text-forest hover:bg-forest/5">
          <Phone size={16} /> Call
        </a>
      </div>
    </form>
  );
}
