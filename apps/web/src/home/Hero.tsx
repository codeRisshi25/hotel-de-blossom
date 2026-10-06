import { useRef, useState } from "react";
import { ArrowDown, ArrowRight, CalendarDays, Minus, Plus, Users } from "lucide-react";
import { useBooking } from "../booking/BookingContext";
import { Wordmark } from "../components/Wordmark";
import { hotel } from "../content/site";
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
            .to("[data-layer='sky']", { yPercent: 8, scale: 1.18 }, 0)
            .to("[data-layer='wordmark']", { yPercent: desktop ? 42 : 30, scale: 0.92, opacity: 0.35 }, 0)
            .to("[data-layer='building']", { scale: desktop ? 1.16 : 1.1, yPercent: -3, transformOrigin: "50% 85%" }, 0)
            .to("[data-hero-content]", { y: -80, opacity: 0 }, 0)
            .to("[data-hero-stats]", { x: 60, opacity: 0 }, 0)
            .to("[data-hero-shade]", { opacity: 0.85 }, 0.3);

          // Pointer depth: each layer drifts by a different amount.
          if (desktop && fine) {
            const layers = [
              { el: "[data-depth='sky']", amount: 8 },
              { el: "[data-depth='wordmark']", amount: 22 },
              { el: "[data-depth='building']", amount: 36 },
            ].map(({ el, amount }) => ({ amount, x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" }), y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3.out" }) }));
            const onMove = (event: PointerEvent) => {
              const nx = event.clientX / window.innerWidth - 0.5;
              const ny = event.clientY / window.innerHeight - 0.5;
              layers.forEach((layer) => { layer.x(-nx * layer.amount); layer.y(-ny * layer.amount * 0.5); });
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
        <div data-depth="sky" className="absolute -inset-6">
          <img
            data-layer="sky"
            src="/images/hero/night-sky.webp"
            srcSet="/images/hero/night-sky-sm.webp 1200w, /images/hero/night-sky.webp 2400w"
            sizes="100vw"
            alt=""
            fetchPriority="high"
            className="h-full w-full scale-[1.08] object-cover object-[50%_55%]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(217,180,106,.22),transparent_55%)]" />
        </div>

        {/* 2 — wordmark (decorative) */}
        <div data-depth="wordmark" className="pointer-events-none absolute inset-x-0 top-[16%] flex justify-center md:top-[19%]" aria-hidden>
          <div data-layer="wordmark">
            <Wordmark variant="hero" trackRef={ref} className="text-[16.5vw] md:text-[13.2vw]" />
          </div>
        </div>

        {/* 3 — building cut-out, sits in front of the letters */}
        <div data-depth="building" className="pointer-events-none absolute -inset-6">
          <img
            data-layer="building"
            src="/images/hero/building.webp"
            srcSet="/images/hero/building-sm.webp 900w, /images/hero/building.webp 1536w"
            sizes="100vw"
            alt="Hotel De Blossom lit up at night above the Guwahati skyline"
            className="h-full w-full object-cover object-[50%_55%]"
          />
        </div>

        {/* 4 — shade + content */}
        <div data-hero-shade className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent opacity-90" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/70 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto flex max-w-[1360px] flex-col gap-8 px-5 pb-24 md:flex-row md:items-end md:justify-between md:px-10 md:pb-10">
          <div data-hero-content className="max-w-2xl text-ivory">
            <p data-hero-fade className="eyebrow mb-5 flex items-center gap-3 text-[10px] text-gold-soft md:text-[11px]">
              <span className="h-px w-10 bg-gold" /> Chandmari · Guwahati · Assam
            </p>
            <h1 id="hero-title" data-hero-title className="display text-[10.5vw] leading-[.95] sm:text-5xl lg:text-[4.25rem]">
              A royal stay,
              <br />
              <em className="gold-text pr-2">in full bloom.</em>
            </h1>
            <p data-hero-fade className="mt-4 max-w-sm text-[15px] leading-7 text-ivory/70">
              Quiet rooms, an all-day restaurant and a grand banquet hall at Tulip Tower, MRD Road — with a front desk that's awake whenever you are.
            </p>

            <form
              data-hero-fade
              onSubmit={(event) => { event.preventDefault(); openBooking({ checkIn, checkOut, guests, purpose: "stay" }); }}
              className="glass-dark mt-7 hidden max-w-[600px] items-center gap-1 rounded-full p-1.5 pl-2 md:flex"
            >
              <label className="flex flex-1 items-center gap-2 rounded-full px-3 py-2 transition hover:bg-ivory/5">
                <CalendarDays size={16} className="shrink-0 text-gold-soft" />
                <span className="grid">
                  <span className="eyebrow text-[9px] text-ivory/55">Check-in</span>
                  <input type="date" min={isoToday()} value={checkIn} onChange={(e) => { setCheckIn(e.target.value); if (!checkOut || checkOut <= e.target.value) setCheckOut(plusDays(e.target.value, 1)); }} className="bg-transparent text-[13px] text-ivory outline-none [color-scheme:dark]" />
                </span>
              </label>
              <span className="h-8 w-px bg-ivory/15" />
              <label className="flex flex-1 items-center gap-2 rounded-full px-3 py-2 transition hover:bg-ivory/5">
                <CalendarDays size={16} className="shrink-0 text-gold-soft" />
                <span className="grid">
                  <span className="eyebrow text-[9px] text-ivory/55">Check-out</span>
                  <input type="date" min={checkIn ? plusDays(checkIn, 1) : isoToday()} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="bg-transparent text-[13px] text-ivory outline-none [color-scheme:dark]" />
                </span>
              </label>
              <span className="h-8 w-px bg-ivory/15" />
              <div className="flex items-center gap-2 px-3 py-2">
                <Users size={16} className="text-gold-soft" />
                <span className="grid">
                  <span className="eyebrow text-[9px] text-ivory/55">Guests</span>
                  <span className="flex items-center gap-2 text-sm text-ivory">
                    <button type="button" aria-label="Fewer guests" onClick={() => setGuests((g) => Math.max(1, g - 1))} className="grid h-5 w-5 place-items-center rounded-full border border-ivory/25"><Minus size={11} /></button>
                    <span className="w-4 text-center tabular-nums">{guests}</span>
                    <button type="button" aria-label="More guests" onClick={() => setGuests((g) => Math.min(30, g + 1))} className="grid h-5 w-5 place-items-center rounded-full border border-ivory/25"><Plus size={11} /></button>
                  </span>
                </span>
              </div>
              <button type="submit" className="group ml-auto flex h-11 items-center gap-2 rounded-full bg-gold pl-5 pr-1.5 text-[13px] font-semibold text-night transition hover:bg-[#c99a40]">
                Request
                <span className="grid h-8 w-8 place-items-center rounded-full bg-night text-ivory transition group-hover:translate-x-0.5"><ArrowRight size={15} /></span>
              </button>
            </form>
          </div>

          <div data-hero-stats className="hidden gap-3 lg:grid">
            {[
              { value: "3", label: "Room categories", note: "Deluxe & Executive Suite" },
              { value: String(hotel.banquetCapacity), label: "Banquet guests", note: "Weddings to boardrooms" },
              { value: "24×7", label: "Front desk", note: "Always a person to call" },
            ].map((stat) => (
              <div data-hero-stat key={stat.label} className="glass-dark w-48 rounded-2xl px-4 py-3 text-ivory">
                <p className="display text-3xl text-gold-soft">{stat.value}</p>
                <p className="mt-1 text-sm font-semibold">{stat.label}</p>
                <p className="text-xs text-ivory/55">{stat.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div data-hero-fade className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-ivory/50 xl:flex">
          <ArrowDown size={14} className="animate-bounce" /><span className="eyebrow text-[9px]">Scroll</span>
        </div>
      </div>
    </section>
  );
}
