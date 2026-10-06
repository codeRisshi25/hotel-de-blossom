import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useBooking } from "./BookingContext";
import { BookingForm } from "./BookingForm";
import { gsap, lockScroll, prefersReducedMotion } from "../lib/motion";

export function BookingDrawer() {
  const { isOpen, prefill, closeBooking } = useBooking();
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const panel = panelRef.current;
    if (!root || !panel) return;
    const reduced = prefersReducedMotion();
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    if (isOpen) {
      lastFocus.current = document.activeElement as HTMLElement | null;
      lockScroll(true);
      gsap.set(root, { display: "block" });
      gsap.fromTo(root.querySelector("[data-scrim]"), { opacity: 0 }, { opacity: 1, duration: reduced ? 0 : 0.35 });
      gsap.fromTo(panel, mobile ? { yPercent: 100 } : { xPercent: 100 }, { yPercent: 0, xPercent: 0, duration: reduced ? 0 : 0.6, ease: "expo.out" });
      gsap.fromTo(panel.querySelectorAll("[data-drawer-item]"), { y: 18, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, delay: reduced ? 0 : 0.15, duration: reduced ? 0 : 0.5, ease: "power3.out" });
      panel.focus();
    } else if (root.style.display === "block") {
      lockScroll(false);
      gsap.to(root.querySelector("[data-scrim]"), { opacity: 0, duration: reduced ? 0 : 0.3 });
      gsap.to(panel, { ...(mobile ? { yPercent: 100 } : { xPercent: 100 }), duration: reduced ? 0 : 0.45, ease: "power3.in", onComplete: () => { gsap.set(root, { display: "none" }); lastFocus.current?.focus(); } });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") closeBooking(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeBooking]);

  return (
    <div ref={rootRef} className="fixed inset-0 z-[70] hidden" aria-hidden={!isOpen}>
      <div data-scrim className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={closeBooking} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        tabIndex={-1}
        data-lenis-prevent
        className="absolute inset-x-0 bottom-0 max-h-[92dvh] overflow-y-auto rounded-t-[28px] bg-champagne outline-none md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[560px] md:rounded-l-[28px] md:rounded-tr-none"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-forest/10 bg-champagne/95 px-6 pb-5 pt-6 backdrop-blur md:px-9 md:pt-9">
          <div data-drawer-item>
            <p className="eyebrow text-gold">Reserve your stay</p>
            <h2 id="booking-title" className="display mt-2 text-4xl text-forest md:text-5xl">Request a booking</h2>
            <p className="mt-2 text-sm text-charcoal/60">Sent to our front desk · confirmed personally by reception</p>
          </div>
          <button onClick={closeBooking} aria-label="Close booking request" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-forest/15 text-forest transition hover:rotate-90 hover:bg-forest/5">
            <X size={18} />
          </button>
        </div>
        <div data-drawer-item className="px-6 pb-10 pt-6 md:px-9">
          <BookingForm prefill={prefill} onDone={closeBooking} compact />
        </div>
      </div>
    </div>
  );
}
