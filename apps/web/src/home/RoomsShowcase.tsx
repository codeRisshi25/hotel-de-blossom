import { useRef } from "react";
import { Link } from "react-router";
import { ArrowUpRight, BedDouble, Ruler, Users } from "lucide-react";
import { rooms } from "../content/site";
import { useBooking } from "../booking/BookingContext";
import { inr } from "../lib/api";
import { Picture } from "../components/Picture";
import { gsap, useGSAP } from "../lib/motion";

export function RoomCard({ room, index }: { room: (typeof rooms)[number]; index: number }) {
  const { openBooking, priceFor } = useBooking();
  return (
    <article data-room-card className="group relative flex w-full shrink-0 flex-col overflow-hidden rounded-[28px] border border-gold/25 bg-ivory md:w-[44vw] lg:w-[36vw] xl:w-[32vw]">
      <Link to={`/rooms/${room.slug}`} className="relative block aspect-[4/3] overflow-hidden" aria-label={`View ${room.name}`}>
        <Picture data-room-img path={room.cover} alt={room.gallery[0]?.alt ?? room.name} sizes="(min-width: 768px) 40vw, 100vw" className="h-full w-full scale-110 object-cover transition duration-[1.2s] ease-out group-hover:scale-[1.16]" />
        <span className="absolute left-5 top-5 rounded-full bg-ink/55 px-3 py-1.5 font-mono text-[10px] tracking-[.2em] text-ivory backdrop-blur">0{index + 1}</span>
      </Link>
      <div className="flex flex-1 flex-col p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <h3 className="display text-4xl text-forest md:text-5xl">{room.name}</h3>
          <p className="shrink-0 text-right">
            <span className="eyebrow block text-[9px] text-charcoal/50">From</span>
            <span className="display text-2xl text-gold">{inr(priceFor(room.rateKey, room.fromPrice))}</span>
          </p>
        </div>
        <p className="mt-3 text-[15px] leading-7 text-charcoal/65">{room.short}</p>
        <ul className="mt-6 flex flex-wrap gap-2 text-xs text-forest">
          <li className="flex items-center gap-1.5 rounded-full border border-forest/15 px-3 py-1.5"><Ruler size={13} className="text-gold" />{room.size}</li>
          <li className="flex items-center gap-1.5 rounded-full border border-forest/15 px-3 py-1.5"><Users size={13} className="text-gold" />{room.occupancy}</li>
          <li className="flex items-center gap-1.5 rounded-full border border-forest/15 px-3 py-1.5"><BedDouble size={13} className="text-gold" />{room.bed}</li>
        </ul>
        <div className="mt-auto flex gap-3 pt-8">
          <button onClick={() => openBooking({ roomType: room.name, purpose: "stay" })} className="min-h-12 flex-1 rounded-full bg-forest px-5 text-sm font-semibold text-ivory transition hover:bg-night">Request this room</button>
          <Link to={`/rooms/${room.slug}`} aria-label={`${room.name} details`} className="grid h-12 w-12 place-items-center rounded-full border border-forest/20 text-forest transition hover:rotate-45 hover:border-gold">
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </article>
  );
}

/** Desktop: the section pins and the room cards glide sideways with the scroll. Mobile: a simple stack. */
export function RoomsShowcase() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const track = trackRef.current!;
        const distance = () => track.scrollWidth - window.innerWidth + 80;
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top top", end: () => `+=${distance()}`, scrub: 0.8, pin: true, invalidateOnRefresh: true, anticipatePin: 1 },
        });
        gsap.utils.toArray<HTMLElement>("[data-room-card]").forEach((card) => {
          const image = card.querySelector("[data-room-img]");
          if (image) gsap.fromTo(image, { xPercent: -8 }, { xPercent: 8, ease: "none", scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
          gsap.fromTo(card, { rotate: 2.5, y: 40 }, { rotate: 0, y: 0, ease: "none", scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "center center", scrub: true } });
        });
        gsap.to("[data-rooms-progress]", { scaleX: 1, ease: "none", scrollTrigger: { trigger: ref.current, start: "top top", end: () => `+=${distance()}`, scrub: true } });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative overflow-hidden bg-champagne py-20 md:flex md:h-screen md:flex-col md:justify-center md:py-0">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6 px-5 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <p className="eyebrow text-gold">The Blossom Collection</p>
          <h2 className="display mt-4 text-5xl text-forest md:text-7xl">Rooms to <em className="text-gold">unfold</em> in.</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden h-px w-48 overflow-hidden bg-forest/15 md:block"><div data-rooms-progress className="h-full w-full origin-left scale-x-0 bg-gold" /></div>
          <Link to="/rooms" className="eyebrow flex items-center gap-2 text-[11px] text-forest hover:text-gold">All rooms <ArrowUpRight size={14} /></Link>
        </div>
      </div>
      <div ref={trackRef} className="mt-10 flex flex-col gap-6 px-5 md:mt-12 md:flex-row md:gap-8 md:pl-10 md:pr-[10vw]">
        {rooms.map((room, index) => <RoomCard key={room.slug} room={room} index={index} />)}
        <div className="hidden w-[28vw] shrink-0 flex-col justify-center rounded-[28px] border border-dashed border-gold/40 p-10 md:flex">
          <p className="display text-4xl text-forest">Not sure which room suits you?</p>
          <p className="mt-4 text-charcoal/65">Tell the front desk who's travelling and we'll suggest the right fit.</p>
          <Link to="/contact" className="mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-forest/20 px-5 py-3 text-sm font-semibold text-forest hover:border-gold">Talk to us <ArrowUpRight size={15} /></Link>
        </div>
      </div>
    </section>
  );
}
