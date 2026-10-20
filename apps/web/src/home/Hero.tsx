import { useRef, useState } from "react";
import { BedDouble, CalendarDays, ChevronDown, Minus, Plus, Users } from "lucide-react";
import { useBooking } from "../booking/BookingContext";
import { rooms } from "../content/site";
import { gsap, useGSAP } from "../lib/motion";
import { addDays, useToday } from "../lib/dates";

const plusDays = addDays;
const heroImageSrcSet = "/images/hero/window-room-sm.avif 900w, /images/hero/window-room-md.avif 1200w, /images/hero/window-room.avif 1800w, /images/hero/window-room-2x.avif 2600w";
const heroImageWebpSrcSet = "/images/hero/window-room-sm.webp 900w, /images/hero/window-room-md.webp 1200w, /images/hero/window-room.webp 1800w, /images/hero/window-room-2x.webp 2600w";
const heroImageSizes = "(min-width: 768px) calc(min(100vw, 1440px, 132svh) - 32px), calc(min(100vw, 1440px, 132svh) - 16px)";

/**
 * The hero uses a calm window view, a quiet positioning line, and the existing
 * booking ribbon. The typography supplies the subtle movement on scroll.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { openBooking } = useBooking();
  const today = useToday();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [roomType, setRoomType] = useState("");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)" },
        (context) => {
          const { motion } = context.conditions as { motion: boolean };
          if (!motion) return;

          // A short, restrained entrance; keep the full photo frame steady.
          const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
          intro
            .from("[data-hero-fade]", { y: 16, opacity: 0, duration: 0.85, stagger: 0.1 }, 0.35);

          // Let the positioning line and headline drift gently as the hero scrolls away.
          const scroll = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: 0.7 },
          });
          scroll.to("[data-hero-copy]", { y: -34 }, 0);

        },
      );
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-labelledby="hero-title" className="relative mx-auto h-[100svh] min-h-[640px] max-w-[min(1440px,132svh)] bg-champagne p-2 md:p-4">
      <div data-hero-card className="relative h-full overflow-hidden rounded-[32px] bg-ink">
        <h1 id="hero-title" className="sr-only">Hotel De Blossom — a quieter stay in the heart of Guwahati</h1>
        {/* Keep the original portrait photograph; crop it gently for the wider hero. */}
        <div className="absolute inset-0">
          <picture className="absolute inset-0">
            <source type="image/avif" srcSet={heroImageSrcSet} sizes={heroImageSizes} />
            <source type="image/webp" srcSet={heroImageWebpSrcSet} sizes={heroImageSizes} />
            <img
              src="/images/hero/window-room.webp"
              srcSet={heroImageWebpSrcSet}
              sizes={heroImageSizes}
              width={2600}
              height={3751}
              alt=""
              fetchPriority="high"
              decoding="async"
              className="hero-window-photo h-full w-full object-cover object-[50%_57%]"
            />
          </picture>
          <div aria-hidden="true" className="hero-photo-shade pointer-events-none absolute inset-0" />
        </div>

        <div data-hero-copy className="pointer-events-none absolute left-[6%] top-[37%] z-10 w-[min(88%,560px)] text-left text-white md:top-[42%] md:w-[min(48%,650px)]">
          <p data-hero-fade className="eyebrow text-[9px] tracking-[.2em] text-white/85 sm:text-[10px]">
            GUWAHATI · ASSAM
          </p>
          <h2 data-hero-fade className="mt-3 max-w-[13ch] font-display text-[clamp(2.7rem,5vw,4.6rem)] font-normal leading-[.93] tracking-[-.025em] text-white [text-shadow:0_2px_24px_rgba(8,26,23,.56)]">
            A quieter <span className="block">window on</span> Guwahati.
          </h2>
          <p data-hero-fade className="mt-5 max-w-[34ch] text-sm leading-relaxed text-white/90 [text-shadow:0_1px_12px_rgba(8,26,23,.6)] sm:text-base">
            A calm corner of Chandmari, with the green hills and city just beyond.
          </p>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-[1360px] px-5 pb-24 md:px-10 md:pb-10">
          <div className="text-ivory">
            <p data-hero-fade className="eyebrow mb-5 flex items-center gap-3 text-[10px] tracking-[.16em] text-gold-soft sm:tracking-[.24em] md:text-[11px]">
              <span className="h-px w-6 shrink-0 bg-gold sm:w-10" /> Chandmari · Guwahati · Assam
            </p>

            <form
              data-hero-fade
              aria-label="Request a stay"
              onSubmit={(event) => { event.preventDefault(); openBooking({ checkIn, checkOut, guests, roomType: roomType || undefined, purpose: "stay" }); }}
              className="hidden items-end gap-3 rounded-[22px] bg-ivory p-4 text-forest shadow-[0_30px_70px_rgba(8,26,23,.4)] md:flex"
            >
              <DateField label="Check in" value={checkIn} min={today || undefined} onChange={(value) => { setCheckIn(value); if (!checkOut || checkOut <= value) setCheckOut(plusDays(value, 1)); }} />
              <DateField label="Check out" value={checkOut} min={checkIn ? plusDays(checkIn, 1) : today ? plusDays(today, 1) : undefined} onChange={setCheckOut} />

              <div className="grid min-w-0 flex-1 gap-2">
                <span className="text-[13px] font-medium text-forest/80">Room</span>
                <label className="relative flex h-14 items-center gap-3 rounded-[12px] bg-champagne px-4 transition-colors focus-within:ring-2 focus-within:ring-gold/60 hover:bg-sandstone/30">
                  <BedDouble size={19} strokeWidth={1.5} className="shrink-0 text-gold" />
                  <select value={roomType} onChange={(e) => setRoomType(e.target.value)} aria-label="Room" className="h-full w-full cursor-pointer appearance-none bg-transparent pr-6 text-[15px] text-forest outline-none">
                    <option value="">Any room</option>
                    {rooms.map((room) => <option key={room.slug} value={room.name}>{room.name}</option>)}
                  </select>
                  <ChevronDown size={17} strokeWidth={1.5} className="pointer-events-none absolute right-4 text-forest/50" />
                </label>
              </div>

              <div className="grid min-w-0 flex-1 gap-2">
                <span className="text-[13px] font-medium text-forest/80">Guests</span>
                <div className="flex h-14 items-center gap-3 rounded-[12px] bg-champagne px-4">
                  <Users size={19} strokeWidth={1.5} className="shrink-0 text-gold" />
                  <span className="flex-1 text-[15px] tabular-nums">{guests} {guests === 1 ? "guest" : "guests"}</span>
                  <button type="button" aria-label="Fewer guests" disabled={guests <= 1} onClick={() => setGuests((g) => Math.max(1, g - 1))} className="grid h-7 w-7 place-items-center rounded-full bg-ivory text-forest/70 transition hover:text-gold disabled:opacity-30"><Minus size={14} strokeWidth={1.75} /></button>
                  <button type="button" aria-label="More guests" disabled={guests >= 30} onClick={() => setGuests((g) => Math.min(30, g + 1))} className="grid h-7 w-7 place-items-center rounded-full bg-ivory text-forest/70 transition hover:text-gold disabled:opacity-30"><Plus size={14} strokeWidth={1.75} /></button>
                </div>
              </div>

              <button type="submit" className="h-14 shrink-0 rounded-[12px] bg-forest px-9 text-[15px] font-semibold text-ivory transition-colors hover:bg-gold hover:text-night">
                Request a stay
              </button>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
}

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

/** Field box that opens the native date picker; the real input stays invisible. */
function DateField({ label, value, min, onChange }: { label: string; value: string; min?: string; onChange: (value: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const open = () => {
    const input = inputRef.current;
    if (!input) return;
    try { input.showPicker(); } catch { input.focus(); }
  };
  return (
    <div className="grid min-w-0 flex-1 gap-2">
      <span className="text-[13px] font-medium text-forest/80">{label}</span>
      <div className="relative">
        <button type="button" onClick={open} className="flex h-14 w-full items-center gap-3 rounded-[12px] bg-champagne px-4 text-left transition-colors hover:bg-sandstone/30 focus-visible:outline-gold">
          <CalendarDays size={19} strokeWidth={1.5} className="shrink-0 text-gold" />
          <span className={`flex-1 truncate text-[15px] ${value ? "text-forest" : "text-forest/45"}`}>{value ? formatDate(value) : "Select date"}</span>
          <ChevronDown size={17} strokeWidth={1.5} className="shrink-0 text-forest/50" />
        </button>
        <input ref={inputRef} type="date" tabIndex={-1} aria-label={label} min={min} value={value} onChange={(e) => onChange(e.target.value)} className="pointer-events-none absolute bottom-0 left-4 h-px w-px opacity-0" />
      </div>
    </div>
  );
}
