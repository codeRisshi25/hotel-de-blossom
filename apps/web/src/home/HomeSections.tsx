import { useRef } from "react";
import { Link } from "react-router";
import { ArrowUpRight, BellRing, Building2, Clock3, ConciergeBell, Mail, MapPin, Navigation, Phone, Plane, UtensilsCrossed } from "lucide-react";
import { Picture } from "../components/Picture";
import { SectionHeading } from "../components/PageHero";
import { WaveEdge } from "../components/WaveEdge";
import { useBooking } from "../booking/BookingContext";
import { gallery, hotel, stayDetails } from "../content/site";
import { menu } from "../content/menu";
import { gsap, useGSAP } from "../lib/motion";

export function DiningPreview() {
  const signatures = menu.flatMap((section) => section.dishes.filter((dish) => dish.signature)).slice(0, 6);
  return (
    <section className="relative overflow-hidden px-5 py-14 md:px-10 md:py-20">
      <div className="mx-auto grid max-w-[1360px] items-center gap-16 lg:grid-cols-[1fr_1.05fr]">
        <div className="relative mx-auto w-full max-w-[430px]">
          <div data-reveal-img data-parallax="0.2" className="arch relative aspect-[3/4] overflow-hidden">
            <Picture path="food/chicken-lababdar" alt="Chicken Lababdar served with whole spices on a timber table" sizes="(min-width: 1024px) 40vw, 90vw" className="h-full w-full object-cover" />
          </div>
          <div data-parallax="0.6" className="absolute -bottom-10 -right-4 w-32 overflow-hidden rounded-2xl border-4 border-champagne shadow-2xl md:-right-12 md:w-44">
            <Picture path="food/mango-and-banana-shake" alt="Mango and banana shakes" sizes="240px" className="aspect-square w-full object-cover" />
          </div>
        </div>
        <div>
          <SectionHeading eyebrow="The Table · All-day dining" title={<>Flavours, <em className="text-gold">artfully</em> plated.</>} intro="From an Assamese Jolpan breakfast to Naga chicken, Galouti kebabs and Thai curries — our restaurant cooks across Indian, Asian and continental kitchens from early morning until late." />
          <div data-reveal className="mt-10 grid grid-cols-2 gap-4 border-y border-forest/15 py-6 text-sm">
            <p><span className="eyebrow block text-[10px] text-charcoal/65">Restaurant</span><span className="mt-1 block font-semibold text-forest">{hotel.restaurantHours}</span></p>
            <p><span className="eyebrow block text-[10px] text-charcoal/65">Breakfast</span><span className="mt-1 block font-semibold text-forest">{hotel.breakfastHours}</span></p>
          </div>
          <ul data-reveal="stagger" className="mt-8 grid gap-x-8 sm:grid-cols-2">
            {signatures.map((dish, index) => (
              <li key={dish.name} className="group flex min-h-[76px] items-center gap-4 border-b border-forest/15 py-3">
                <span className="font-mono text-[10px] tracking-[.12em] text-gold">0{index + 1}</span>
                <span className="min-w-0"><span className="display block text-xl leading-tight text-forest">{dish.name}</span>{dish.note && <span className="mt-1 block text-xs leading-5 text-charcoal/55">{dish.note}</span>}</span>
                <span className="ml-auto text-gold transition-transform group-hover:translate-x-1" aria-hidden>↗</span>
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
    <section ref={ref} className="royal-pattern relative overflow-hidden pb-10 pt-20 text-ivory md:pb-14 md:pt-28">
      <WaveEdge position="top" />
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <SectionHeading tone="dark" align="center" eyebrow={`The Occasion · ${hotel.banquetHallName}`} title={<>Every celebration deserves a <em className="gold-text">remarkable</em> setting.</>} intro={`Welcome to ${hotel.banquetHallName} — an elegant hall dressed in warm light, with catering from our own kitchen and a team that plans every detail with you.`} />
        <div className="mx-auto mt-12 grid max-w-6xl items-center gap-5 md:grid-cols-[1fr_2fr_1fr]">
          <div data-parallax="0.35" className="hidden overflow-hidden rounded-[24px] md:block"><Picture path="banquet/meeting-2" alt="Banquet hall arranged for a conference" sizes="25vw" className="aspect-[3/4] w-full object-cover" /></div>
          <div data-banquet-main className="overflow-hidden rounded-[28px]"><Picture path="banquet/banquet-3" alt="Banquet hall set for a dinner celebration with white chair covers" sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[4/3] w-full object-cover" /></div>
          <div data-parallax="-0.35" className="hidden overflow-hidden rounded-[24px] md:block"><Picture path="banquet/banquet-2" alt="Banquet hall with illuminated marble feature wall" sizes="25vw" className="aspect-[3/4] w-full object-cover" /></div>
        </div>
        <div className="mx-auto mt-12 grid max-w-4xl gap-8 text-center sm:grid-cols-3">
          <div data-reveal><p className="display text-5xl text-gold-soft"><span data-count={hotel.banquetCapacity}>{hotel.banquetCapacity}</span></p><p className="eyebrow mt-2 text-[10px] text-ivory/60">Guests, banquet style</p></div>
          <div data-reveal><p className="display text-5xl text-gold-soft">3</p><p className="eyebrow mt-2 text-[10px] text-ivory/60">Kitchens · Indian, Asian, Continental</p></div>
          <div data-reveal><p className="display text-5xl text-gold-soft">24×7</p><p className="eyebrow mt-2 text-[10px] text-ivory/60">Front desk support</p></div>
        </div>
        <div data-reveal className="mt-14 flex flex-wrap justify-center gap-3">
          <button onClick={() => openBooking({ purpose: "event", guests: 50 })} className="min-h-13 rounded-full bg-gold px-7 text-[15px] font-semibold text-night transition hover:bg-[#c99a40]">Plan an occasion</button>
          <Link to="/events" className="inline-flex min-h-13 items-center gap-2 rounded-full border border-ivory/25 px-7 text-[15px] font-semibold text-ivory hover:border-gold">Explore {hotel.banquetHallName} <ArrowUpRight size={16} /></Link>
        </div>
      </div>
      <div className="mt-12 overflow-hidden border-t border-gold/20 py-6 md:mt-14" aria-hidden>
        <div data-marquee className="flex w-max gap-12 whitespace-nowrap">
          {[...occasions, ...occasions, ...occasions].map((word, index) => (
            <span key={index} className="display flex items-center gap-10 text-4xl italic text-ivory/80 md:text-[3.5rem]">{word}<span className="text-2xl text-gold not-italic">✦</span></span>
          ))}
        </div>
      </div>
      <WaveEdge position="bottom" />
    </section>
  );
}

const detailIcons = [Plane, BellRing, UtensilsCrossed, Building2, MapPin, ConciergeBell];

export function StayDetails() {
  return (
    <section className="px-5 py-14 md:px-10 md:py-20">
      <div className="mx-auto max-w-[1360px]">
        <SectionHeading eyebrow="Thoughtfully yours" title={<>The small things, <em className="text-gold">handled.</em></>} />
        <div data-reveal="stagger" className="mt-10 grid gap-px overflow-hidden rounded-[28px] border border-forest/10 bg-forest/10 sm:grid-cols-2 lg:grid-cols-3">
          {stayDetails.map((item, index) => {
            const Icon = detailIcons[index] ?? ConciergeBell;
            return (
              <article key={item.title} className="group relative bg-champagne p-7 transition-colors duration-500 hover:bg-forest md:p-9">
                <span className="font-mono text-xs text-gold">0{index + 1}</span>
                <Icon size={24} strokeWidth={1.3} className="mt-6 text-forest transition-colors duration-500 group-hover:text-gold-soft" />
                <h3 className="display mt-5 text-2xl text-forest transition-colors duration-500 group-hover:text-ivory">{item.title}</h3>
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
    <section ref={ref} className="relative overflow-hidden bg-night pb-16 pt-20 md:pb-24 md:pt-28">
      <WaveEdge position="top" />
      <div className="mx-auto mb-10 flex max-w-[1360px] flex-col justify-between gap-6 px-5 md:flex-row md:items-end md:px-10">
        <SectionHeading tone="dark" eyebrow="The hotel in bloom" title={<>A look <em className="gold-text">inside.</em></>} />
      </div>
      {[rowA, rowB].map((row, r) => (
        <div key={r} data-ribbon={r === 0 ? "a" : "b"} className={`flex w-max gap-4 md:gap-6 ${r === 1 ? "mt-4 md:mt-6" : ""}`}>
          {[...row, ...row].map((item, index) => (
            <div key={`${item.path}-${index}`} className="group relative h-40 w-60 shrink-0 overflow-hidden rounded-2xl md:h-56 md:w-[22rem]">
              <Picture path={item.path} alt={item.alt} sizes="450px" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              <span className="absolute bottom-3 left-3 rounded-full bg-ink/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[.18em] text-ivory opacity-0 backdrop-blur transition group-hover:opacity-100">{item.category}</span>
            </div>
          ))}
        </div>
      ))}
      <WaveEdge position="bottom" />
    </section>
  );
}

export function ArrivalCta() {
  const { openBooking } = useBooking();
  const details = [
    { icon: MapPin, lines: hotel.address, href: hotel.mapsUrl },
    { icon: Phone, lines: [hotel.phone], href: hotel.phoneHref },
    { icon: Mail, lines: [hotel.email], href: `mailto:${hotel.email}` },
    { icon: Clock3, lines: [`Restaurant ${hotel.restaurantHours.replace(", Monday to Sunday", ", daily")}`, `Breakfast ${hotel.breakfastHours}`] },
  ];
  return (
    <section className="px-5 py-14 md:px-10 md:py-20">
      <div data-reveal className="relative mx-auto grid max-w-[1360px] overflow-hidden rounded-[20px] bg-ink lg:min-h-[580px] lg:grid-cols-[minmax(420px,40%)_1fr]">
        {/* Dark-mode map: the embed is inverted, re-hued and muted toward the hotel's green. */}
        <div className="relative order-2 min-h-[340px] lg:absolute lg:inset-0 lg:order-none">
          <iframe
            title="Hotel De Blossom on Google Maps"
            src={`${hotel.mapsEmbed}&z=16`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full min-h-[340px] w-full [filter:invert(.92)_hue-rotate(180deg)_saturate(.55)_brightness(.85)_contrast(.95)]"
          />
          <div className="pointer-events-none absolute inset-0 bg-forest/25 mix-blend-color" />
        </div>

        <div className="relative z-10 flex flex-col justify-center gap-10 bg-ink px-6 py-10 text-ivory md:px-12 md:py-14 lg:bg-gradient-to-r lg:from-ink lg:from-75% lg:to-transparent lg:pr-24">
          <h2 data-split className="display text-[2.25rem] leading-[1.05] [text-wrap:balance] md:text-[3.25rem]">Find us at Tulip Tower.</h2>

          <ul className="grid gap-6">
            {details.map(({ icon: Icon, lines, href }) => {
              const body = lines.map((line) => <span key={line} className="block">{line}</span>);
              return (
                <li key={lines[0]} className="flex gap-4">
                  <Icon size={18} strokeWidth={1.5} className="mt-1 shrink-0 text-gold-soft" />
                  {href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="leading-7 text-ivory/80 transition-colors hover:text-gold-soft">{body}</a> : <p className="leading-7 text-ivory/80">{body}</p>}
                </li>
              );
            })}
          </ul>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <a href={hotel.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-gold px-7 text-[15px] font-semibold text-night transition-colors hover:bg-gold-soft"><Navigation size={16} /> Get directions</a>
            <button onClick={() => openBooking()} className="border-b border-gold-soft/60 py-1 text-[15px] text-ivory transition-colors hover:border-ivory hover:text-gold-soft">Request a stay</button>
          </div>
          <p className="-mt-4 text-sm text-ivory/55">Airport pickups and drops on request.</p>
        </div>
      </div>
    </section>
  );
}
