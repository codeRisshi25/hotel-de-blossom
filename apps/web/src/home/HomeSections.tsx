import { useRef } from "react";
import { Link } from "react-router";
import { ArrowUpRight, BellRing, Building2, ConciergeBell, MapPin, Plane, UtensilsCrossed, Navigation } from "lucide-react";
import { Picture } from "../components/Picture";
import { SectionHeading } from "../components/PageHero";
import { useBooking } from "../booking/BookingContext";
import { gallery, hotel, stayDetails } from "../content/site";
import { menu } from "../content/menu";
import { gsap, useGSAP } from "../lib/motion";

export function DiningPreview() {
  const signatures = menu.flatMap((section) => section.dishes.filter((dish) => dish.signature)).slice(0, 6);
  return (
    <section className="relative overflow-hidden px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto grid max-w-[1500px] items-center gap-16 lg:grid-cols-[1fr_1.05fr]">
        <div className="relative mx-auto w-full max-w-[520px]">
          <div data-reveal-img className="arch relative aspect-[3/4] overflow-hidden">
            <Picture path="food/chicken-lababdar" alt="Chicken Lababdar served with whole spices on a timber table" sizes="(min-width: 1024px) 40vw, 90vw" className="h-full w-full object-cover" />
          </div>
          <div data-parallax="0.6" className="absolute -bottom-10 -right-4 w-40 overflow-hidden rounded-2xl border-4 border-champagne shadow-2xl md:-right-16 md:w-56">
            <Picture path="food/mango-and-banana-shake" alt="Mango and banana shakes" sizes="240px" className="aspect-square w-full object-cover" />
          </div>
          <img src="/images/brand/emblem.webp" alt="" aria-hidden className="absolute -left-6 -top-8 w-28 rotate-[-12deg] opacity-80" />
        </div>
        <div>
          <SectionHeading eyebrow="The Table · All-day dining" title={<>Flavours, <em className="text-gold">artfully</em> plated.</>} intro="From an Assamese Jolpan breakfast to Naga chicken, Galouti kebabs and Thai curries — our restaurant cooks across Indian, Asian and continental kitchens from early morning until late." />
          <div data-reveal className="mt-10 grid grid-cols-2 gap-4 border-y border-forest/15 py-6 text-sm">
            <p><span className="eyebrow block text-[10px] text-charcoal/50">Restaurant</span><span className="mt-1 block font-semibold text-forest">{hotel.restaurantHours}</span></p>
            <p><span className="eyebrow block text-[10px] text-charcoal/50">Breakfast</span><span className="mt-1 block font-semibold text-forest">{hotel.breakfastHours}</span></p>
          </div>
          <ul data-reveal="stagger" className="mt-8 grid gap-4">
            {signatures.map((dish) => (
              <li key={dish.name} className="flex items-baseline gap-3">
                <span className="display text-2xl text-forest">{dish.name}</span>
                <span className="mb-1.5 flex-1 border-b border-dotted border-forest/30" />
                <span className="font-mono text-sm text-gold">₹{dish.price}</span>
              </li>
            ))}
          </ul>
          <Link data-reveal to="/dining#menu" className="group mt-10 inline-flex items-center gap-3 rounded-full bg-forest py-2 pl-6 pr-2 text-sm font-semibold text-ivory">
            Explore the full menu
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gold text-night transition group-hover:rotate-45"><ArrowUpRight size={16} /></span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function BanquetPanel() {
  const ref = useRef<HTMLElement>(null);
  const { openBooking } = useBooking();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The panel opens like an invitation: the central image grows to fill as you scroll in.
        gsap.fromTo("[data-banquet-main]", { clipPath: "inset(12% 22% 12% 22% round 400px 400px 24px 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 28px 28px 28px 28px)", ease: "none", scrollTrigger: { trigger: "[data-banquet-main]", start: "top 90%", end: "center 55%", scrub: true } });
        gsap.fromTo("[data-banquet-main] img", { scale: 1.3 }, { scale: 1, ease: "none", scrollTrigger: { trigger: "[data-banquet-main]", start: "top bottom", end: "bottom top", scrub: true } });
        gsap.to("[data-marquee]", { xPercent: -50, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 1 } });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const occasions = ["Weddings", "Receptions", "Engagements", "Birthdays", "Anniversaries", "Corporate meets", "Conferences", "Family gatherings"];

  return (
    <section ref={ref} className="royal-pattern relative overflow-hidden py-28 text-ivory md:py-40">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <SectionHeading tone="dark" align="center" eyebrow="The Occasion · Banquet & events" title={<>Every celebration deserves a <em className="gold-text">remarkable</em> setting.</>} intro="We create the atmosphere — you bring the moment. An elegant hall dressed in warm light, with catering from our own kitchen and a team that plans every detail with you." />
        <div className="mt-16 grid items-center gap-6 md:grid-cols-[1fr_2fr_1fr]">
          <div data-parallax="0.35" className="hidden overflow-hidden rounded-[24px] md:block"><Picture path="banquet/meeting-2" alt="Banquet hall arranged for a conference" sizes="25vw" className="aspect-[3/4] w-full object-cover" /></div>
          <div data-banquet-main className="overflow-hidden rounded-[28px]"><Picture path="banquet/banquet-3" alt="Banquet hall set for a dinner celebration with white chair covers" sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[4/3] w-full object-cover" /></div>
          <div data-parallax="-0.35" className="hidden overflow-hidden rounded-[24px] md:block"><Picture path="banquet/banquet-2" alt="Banquet hall with illuminated marble feature wall" sizes="25vw" className="aspect-[3/4] w-full object-cover" /></div>
        </div>
        <div className="mx-auto mt-16 grid max-w-4xl gap-8 text-center sm:grid-cols-3">
          <div data-reveal><p className="display text-7xl text-gold-soft"><span data-count={hotel.banquetCapacity}>{hotel.banquetCapacity}</span></p><p className="eyebrow mt-2 text-[10px] text-ivory/60">Guests, banquet style</p></div>
          <div data-reveal><p className="display text-7xl text-gold-soft">3</p><p className="eyebrow mt-2 text-[10px] text-ivory/60">Kitchens · Indian, Asian, Continental</p></div>
          <div data-reveal><p className="display text-7xl text-gold-soft">24×7</p><p className="eyebrow mt-2 text-[10px] text-ivory/60">Front desk support</p></div>
        </div>
        <div data-reveal className="mt-14 flex flex-wrap justify-center gap-3">
          <button onClick={() => openBooking({ purpose: "event", guests: 50 })} className="min-h-13 rounded-full bg-gold px-7 text-[15px] font-semibold text-night transition hover:bg-[#c99a40]">Plan an occasion</button>
          <Link to="/events" className="inline-flex min-h-13 items-center gap-2 rounded-full border border-ivory/25 px-7 text-[15px] font-semibold text-ivory hover:border-gold">Explore the hall <ArrowUpRight size={16} /></Link>
        </div>
      </div>
      <div className="mt-24 overflow-hidden border-y border-gold/20 py-6" aria-hidden>
        <div data-marquee className="flex w-max gap-12 whitespace-nowrap">
          {[...occasions, ...occasions, ...occasions].map((word, index) => (
            <span key={index} className="display flex items-center gap-12 text-5xl italic text-ivory/80 md:text-7xl">{word}<span className="text-2xl text-gold not-italic">✦</span></span>
          ))}
        </div>
      </div>
    </section>
  );
}

const detailIcons = [Plane, BellRing, UtensilsCrossed, Building2, MapPin, ConciergeBell];

export function StayDetails() {
  return (
    <section className="px-5 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1500px]">
        <SectionHeading eyebrow="Thoughtfully yours" title={<>The small things, <em className="text-gold">handled.</em></>} />
        <div data-reveal="stagger" className="mt-16 grid gap-px overflow-hidden rounded-[28px] border border-forest/10 bg-forest/10 sm:grid-cols-2 lg:grid-cols-3">
          {stayDetails.map((item, index) => {
            const Icon = detailIcons[index] ?? ConciergeBell;
            return (
              <article key={item.title} className="group relative bg-champagne p-8 transition-colors duration-500 hover:bg-forest md:p-10">
                <span className="font-mono text-xs text-gold">0{index + 1}</span>
                <Icon size={28} strokeWidth={1.3} className="mt-6 text-forest transition-colors duration-500 group-hover:text-gold-soft" />
                <h3 className="display mt-6 text-3xl text-forest transition-colors duration-500 group-hover:text-ivory">{item.title}</h3>
                <p className="mt-3 leading-7 text-charcoal/65 transition-colors duration-500 group-hover:text-ivory/70">{item.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function GalleryRibbon() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo("[data-ribbon='a']", { xPercent: 0 }, { xPercent: -30, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 1 } });
        gsap.fromTo("[data-ribbon='b']", { xPercent: -30 }, { xPercent: 0, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 1 } });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  const rowA = gallery.filter((_, i) => i % 2 === 0);
  const rowB = gallery.filter((_, i) => i % 2 === 1);
  return (
    <section ref={ref} className="overflow-hidden bg-night py-24 md:py-32">
      <div className="mx-auto mb-14 flex max-w-[1500px] flex-col justify-between gap-6 px-5 md:flex-row md:items-end md:px-10">
        <SectionHeading tone="dark" eyebrow="The hotel in bloom" title={<>A look <em className="gold-text">inside.</em></>} />
        <Link to="/gallery" className="eyebrow flex items-center gap-2 text-[11px] text-ivory hover:text-gold-soft">Full gallery <ArrowUpRight size={14} /></Link>
      </div>
      {[rowA, rowB].map((row, r) => (
        <div key={r} data-ribbon={r === 0 ? "a" : "b"} className={`flex w-max gap-4 md:gap-6 ${r === 1 ? "mt-4 md:mt-6" : ""}`}>
          {[...row, ...row].map((item, index) => (
            <Link to="/gallery" key={`${item.path}-${index}`} className="group relative h-48 w-72 shrink-0 overflow-hidden rounded-2xl md:h-72 md:w-[28rem]">
              <Picture path={item.path} alt={item.alt} sizes="450px" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              <span className="absolute bottom-3 left-3 rounded-full bg-ink/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[.18em] text-ivory opacity-0 backdrop-blur transition group-hover:opacity-100">{item.category}</span>
            </Link>
          ))}
        </div>
      ))}
    </section>
  );
}

export function ArrivalCta() {
  const { openBooking } = useBooking();
  return (
    <section className="px-5 py-28 md:px-10 md:py-36">
      <div className="mx-auto grid max-w-[1500px] gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div data-reveal className="relative overflow-hidden rounded-[28px] bg-forest p-8 text-ivory md:p-14">
          <p className="eyebrow text-gold-soft">Arrival</p>
          <h2 data-split className="display mt-5 text-5xl md:text-7xl">Find us at <em className="gold-text">Tulip Tower.</em></h2>
          <address className="mt-8 not-italic leading-8 text-ivory/75">{hotel.address.map((line) => <span key={line} className="block">{line}</span>)}</address>
          <div className="mt-10 flex flex-wrap gap-3">
            <button onClick={() => openBooking()} className="min-h-13 rounded-full bg-gold px-7 text-[15px] font-semibold text-night">Request a booking</button>
            <a href={hotel.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-13 items-center gap-2 rounded-full border border-ivory/25 px-6 text-[15px] font-semibold hover:border-gold"><Navigation size={16} /> Directions</a>
          </div>
          <img src="/images/brand/emblem.webp" alt="" aria-hidden className="pointer-events-none absolute -bottom-6 -right-10 w-64 opacity-15" />
        </div>
        <div data-reveal-img className="min-h-[360px] overflow-hidden rounded-[28px] border border-forest/10">
          <iframe title="Hotel De Blossom on Google Maps" src={hotel.mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-full min-h-[360px] w-full grayscale-[.4] sepia-[.15]" />
        </div>
      </div>
    </section>
  );
}
