import { useRef, useState } from "react";
import { BedDouble, CalendarDays, ChevronDown, Minus, Plus, Users } from "lucide-react";
import { useBooking } from "../booking/BookingContext";
import { Wordmark } from "../components/Wordmark";
import { rooms } from "../content/site";
import { gsap, SplitText, useGSAP } from "../lib/motion";
import { addDays, localIsoDate } from "../lib/dates";

const isoToday = () => localIsoDate();
const plusDays = addDays;

/**
 * Depth stack, back to front:
 *   1. night sky photograph            (slowest)
 *   2. "DE BLOSSOM" wordmark           (aria-hidden, sinks behind the building on scroll)
 *   3. transparent building cut-out    (rises toward the viewer)
 *   4. legibility gradient + content   (accessible H1, stats, booking bar)
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { openBooking } = useBooking();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [roomType, setRoomType] = useState("");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 768px)", fine: "(pointer: fine)" },
        (context) => {
          const { motion, desktop, fine } = context.conditions as { motion: boolean; desktop: boolean; fine: boolean };
          if (!motion) return;

          const headline = SplitText.create("[data-hero-title]", { type: "lines", mask: "lines" });

          // Opening: sky settles, letters rise from behind the building, building lifts into place.
          const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
          intro
            .fromTo("[data-hero-card]", { clipPath: "inset(6% 4% 6% 4% round 48px)" }, { clipPath: "inset(0% 0% 0% 0% round 32px)", duration: 1.8 })
            .fromTo("[data-layer='sky']", { scale: 1.35, opacity: 0 }, { scale: 1.08, opacity: 1, duration: 2.4 }, 0)
            .fromTo("[data-letter]", { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.6, stagger: { each: 0.06, from: "center" } }, 0.35)
            .fromTo("[data-layer='building']", { yPercent: 10, scale: 1.12 }, { yPercent: 0, scale: 1, duration: 2.2 }, 0.2)
            .from(headline.lines, { yPercent: 110, duration: 1.2, stagger: 0.1 }, 0.9)
            .from("[data-hero-fade]", { y: 24, opacity: 0, duration: 1, stagger: 0.08 }, 1.1)
            .from("[data-hero-stat]", { x: 40, opacity: 0, duration: 1, stagger: 0.12 }, 1.2);

          // Scroll: hero pins briefly while the layers separate in depth.
          const scroll = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: ref.current, start: "top top", end: desktop ? "+=85%" : "+=55%", scrub: 0.6, pin: true, anticipatePin: 1 },
          });
          scroll
            .to("[data-layer='sky']", { yPercent: 3, scale: 1.1 }, 0)
            .to("[data-layer='wordmark']", { yPercent: desktop ? 55 : 38, scale: 0.88, opacity: 0.3, filter: "blur(5px)" }, 0)
            .to("[data-layer='building']", { scale: desktop ? 1.3 : 1.18, yPercent: -7, transformOrigin: "50% 88%" }, 0)
            .to("[data-hero-content]", { y: -80, opacity: 0 }, 0)
            .to("[data-hero-stats]", { x: 60, opacity: 0 }, 0)
            .to("[data-hero-shade]", { opacity: 0.85 }, 0.3);

          // Pointer depth: each layer drifts by a different amount.
          if (desktop && fine) {
            const layers = [
              { el: "[data-depth='sky']", amount: 16 },
              { el: "[data-depth='wordmark']", amount: 46 },
              { el: "[data-depth='building']", amount: 96 },
            ].map(({ el, amount }) => ({ amount, x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" }), y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3.out" }) }));
            const onMove = (event: PointerEvent) => {
              const nx = event.clientX / window.innerWidth - 0.5;
              const ny = event.clientY / window.innerHeight - 0.5;
              layers.forEach((layer) => { layer.x(-nx * layer.amount); layer.y(-ny * layer.amount * 0.4); });
            };
            window.addEventListener("pointermove", onMove);
            return () => window.removeEventListener("pointermove", onMove);
          }
        },
      );
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-labelledby="hero-title" className="relative h-[100svh] min-h-[640px] bg-champagne p-2 md:p-4">
      <div data-hero-card className="relative h-full overflow-hidden rounded-[32px] bg-ink">
        {/* 1 — sky */}
        <div data-depth="sky" className="absolute -inset-10">
          <img
            data-layer="sky"
            src="/images/hero/night-sky.webp"
            srcSet="/images/hero/night-sky-sm.webp 1600w, /images/hero/night-sky.webp 3072w"
            sizes="100vw"
            alt=""
            fetchPriority="high"
            className="h-full w-full scale-[1.08] object-cover object-[50%_55%] [filter:saturate(.5)_brightness(.6)_contrast(1.05)]"
          />
          <div className="absolute inset-0 bg-ink/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(217,180,106,.1),transparent_55%)]" />
        </div>

        {/* 2 — wordmark (decorative) */}
        <div data-depth="wordmark" className="pointer-events-none absolute inset-x-0 top-[16%] flex justify-center md:top-[19%]" aria-hidden>
          <div data-layer="wordmark">
            <Wordmark variant="hero" trackRef={ref} className="text-[16.5vw] md:text-[13.2vw]" />
          </div>
        </div>

        {/* fog between the lettering and the building sells the distance */}
        <div className="pointer-events-none absolute inset-x-0 top-[34%] h-[30%] bg-gradient-to-b from-transparent via-ink/35 to-transparent" />

        {/* 3 — building cut-out, sits in front of the letters */}
        <div data-depth="building" className="pointer-events-none absolute -inset-14">
          <img
            data-layer="building"
            src="/images/hero/building.webp"
            srcSet="/images/hero/building-sm.webp 1600w, /images/hero/building.webp 3072w"
            sizes="100vw"
            alt="Hotel De Blossom lit up at night above the Guwahati skyline"
            className="h-full w-full object-cover object-[50%_55%]"
          />
        </div>

        {/* 4 — shade + content */}
        <div data-hero-shade className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent opacity-90" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/70 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-[1360px] px-5 pb-24 md:px-10 md:pb-10">
          <div data-hero-content className="text-ivory">
            <p data-hero-fade className="eyebrow mb-5 flex items-center gap-3 text-[10px] text-gold-soft md:text-[11px]">
              <span className="h-px w-10 bg-gold" /> Chandmari · Guwahati · Assam
            </p>

            <form
              data-hero-fade
              aria-label="Request a stay"
              onSubmit={(event) => { event.preventDefault(); openBooking({ checkIn, checkOut, guests, roomType: roomType || undefined, purpose: "stay" }); }}
              className="hidden items-end gap-3 rounded-[22px] bg-ivory p-4 text-forest shadow-[0_30px_70px_rgba(8,26,23,.4)] md:flex"
            >
              <DateField label="Check in" value={checkIn} min={isoToday()} onChange={(value) => { setCheckIn(value); if (!checkOut || checkOut <= value) setCheckOut(plusDays(value, 1)); }} />
              <DateField label="Check out" value={checkOut} min={checkIn ? plusDays(checkIn, 1) : plusDays(isoToday(), 1)} onChange={setCheckOut} />

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
function DateField({ label, value, min, onChange }: { label: string; value: string; min: string; onChange: (value: string) => void }) {
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
