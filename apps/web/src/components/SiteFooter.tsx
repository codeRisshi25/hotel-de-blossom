import { WaveEdge } from "./WaveEdge";
import { useRef } from "react";
import { Link } from "react-router";
import { ArrowUp, Clock3, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { Facebook, Instagram, WhatsApp } from "./BrandIcons";
import { Wordmark } from "./Wordmark";
import { hotel, whatsappLink } from "../content/site";
import { getLenis, gsap, useGSAP } from "../lib/motion";

const explore = [
  { to: "/rooms", label: "Rooms & Suites" },
  { to: "/dining", label: "Restaurant" },
  { to: "/dining#menu", label: "Menu" },
  { to: "/events", label: "Banquet & Events" },
  { to: "/about", label: "Our Story" },
  { to: "/contact", label: "Contact" },
  { to: "/book", label: "Request a booking" },
];

export function SiteFooter() {
  const ref = useRef<HTMLElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The wordmark rises letter by letter as the footer scrolls into view.
        gsap.fromTo(
          "[data-footer-mark] [data-letter]",
          { yPercent: 105 },
          { yPercent: 0, ease: "none", stagger: 0.04, scrollTrigger: { trigger: "[data-footer-mark]", start: "top bottom", end: "bottom bottom", scrub: 0.8 } },
        );
        gsap.from("[data-footer-col]", { y: 30, opacity: 0, duration: 0.9, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: "[data-footer-grid]", start: "top 90%" } });
        gsap.fromTo("[data-footer-rule]", { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: "[data-footer-rule]", start: "top 95%" } });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const backToTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer ref={ref} className="royal-pattern relative overflow-hidden text-ivory">
      <WaveEdge position="top" />

      <div className="mx-auto max-w-[1360px] px-5 pt-20 md:px-10 md:pt-28">
        {/* Directory */}
        <div data-footer-grid className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr] lg:gap-8 lg:py-16">
          <div data-footer-col>
            <img src="/images/brand/logo-horizontal-light-sm.webp" alt="Hotel De Blossom" width={420} height={76} className="h-8 w-auto" />
            <p className="mt-5 max-w-xs text-sm leading-6 text-ivory/60">A quiet, royal stay at the heart of Chandmari — rooms, all-day dining and {hotel.banquetHallName}, for up to {hotel.banquetCapacity} guests.</p>
            <div className="mt-6 flex gap-2">
              <a aria-label="Instagram" href={hotel.socials.instagram} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full border border-ivory/15 transition hover:-translate-y-0.5 hover:border-gold hover:text-gold-soft"><Instagram size={16} /></a>
              <a aria-label="Facebook" href={hotel.socials.facebook} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full border border-ivory/15 transition hover:-translate-y-0.5 hover:border-gold hover:text-gold-soft"><Facebook size={16} /></a>
              <a aria-label="WhatsApp" href={whatsappLink("Hello Hotel De Blossom")} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full border border-ivory/15 transition hover:-translate-y-0.5 hover:border-gold hover:text-gold-soft"><WhatsApp size={16} /></a>
            </div>
          </div>

          <div data-footer-col>
            <p className="eyebrow mb-5 text-[10px] text-sandstone/80">Explore</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm text-ivory/70">
              {explore.map((link) => (
                <li key={link.to}>
                  <Link className="group inline-flex items-center transition hover:text-gold-soft" to={link.to}>
                    <span className="h-px w-0 bg-gold transition-all duration-300 group-hover:mr-2 group-hover:w-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div data-footer-col>
            <p className="eyebrow mb-5 text-[10px] text-sandstone/80">Visit</p>
            <address className="flex gap-3 text-sm not-italic leading-6 text-ivory/70">
              <MapPin size={16} className="mt-1 shrink-0 text-gold" />
              <span>{hotel.address.map((line) => <span key={line} className="block">{line}</span>)}</span>
            </address>
            <a href={hotel.mapsUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold-soft hover:text-ivory">
              <Navigation size={14} /> Get directions
            </a>
            <p className="mt-6 flex gap-3 text-sm leading-6 text-ivory/70">
              <Clock3 size={16} className="mt-1 shrink-0 text-gold" />
              <span>Restaurant {hotel.restaurantHours}<span className="block text-ivory/50">Breakfast {hotel.breakfastHours}</span></span>
            </p>
          </div>

          <div data-footer-col>
            <p className="eyebrow mb-5 text-[10px] text-sandstone/80">Front desk · 24×7</p>
            <ul className="grid gap-3 text-sm text-ivory/70">
              <li><a className="flex items-center gap-3 transition hover:text-gold-soft" href={hotel.phoneHref}><Phone size={15} className="text-gold" />{hotel.phone}</a></li>
              <li><a className="flex items-center gap-3 break-all transition hover:text-gold-soft" href={`mailto:${hotel.email}`}><Mail size={15} className="shrink-0 text-gold" />{hotel.email}</a></li>
            </ul>
            <p className="mt-6 rounded-2xl border border-gold/20 px-4 py-3 text-xs leading-5 text-ivory/55">Booking requests are reviewed by reception and confirmed personally — no payment is taken online.</p>
          </div>
        </div>

        <div data-footer-rule className="h-px origin-left bg-gradient-to-r from-gold/50 via-gold/20 to-transparent" />
      </div>

      {/* Interactive wordmark */}
      <div ref={markRef} data-footer-mark className="overflow-hidden px-2 pt-8 md:pt-10">
        <Wordmark variant="footer" trackRef={markRef} className="cursor-default py-[0.14em] text-[13.4vw]" />
      </div>

      <div className="mx-auto flex max-w-[1360px] flex-col items-center justify-between gap-4 px-5 pb-28 pt-6 text-xs text-ivory/45 sm:flex-row md:px-10 md:pb-8">
        <p>© {new Date().getFullYear()} Hotel De Blossom, Guwahati. All rights reserved.</p>
        <p className="hidden md:block">Tulip Tower · MRD Road · Chandmari</p>
        <button onClick={backToTop} className="group inline-flex items-center gap-2 rounded-full border border-ivory/15 px-4 py-2 text-ivory/70 transition hover:border-gold hover:text-gold-soft">
          Back to top <ArrowUp size={13} className="transition group-hover:-translate-y-0.5" />
        </button>
      </div>
    </footer>
  );
}
