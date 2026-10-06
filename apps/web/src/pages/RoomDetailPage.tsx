import { useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router";
import { ArrowLeft, ArrowRight, BedDouble, Check, Ruler, Users } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { Picture } from "../components/Picture";
import { RoomCard } from "../home/RoomsShowcase";
import { rooms } from "../content/site";
import { useBooking } from "../booking/BookingContext";
import { inr } from "../lib/api";
import { gsap, prefersReducedMotion, useGSAP } from "../lib/motion";
import { useScrollAnimations } from "../lib/useScrollAnimations";
import { useTitle } from "../lib/useTitle";

export default function RoomDetailPage() {
  const { slug } = useParams();
  const room = rooms.find((item) => item.slug === slug);
  const ref = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0);
  const { openBooking, priceFor } = useBooking();
  useTitle(room?.name ?? "Room");
  useScrollAnimations(ref, [slug]);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.fromTo("[data-viewer-img]", { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" });
  }, { scope: viewerRef, dependencies: [shown, slug] });

  if (!room) return <Navigate to="/rooms" replace />;
  const others = rooms.filter((item) => item.slug !== room.slug);
  const image = room.gallery[shown] ?? room.gallery[0];
  const price = priceFor(room.rateKey, room.fromPrice);
  const [first, ...rest] = room.name.split(" ");

  return (
    <div ref={ref} key={room.slug}>
      <PageHero eyebrow={room.name} image={room.cover} alt={room.gallery[0].alt} title={<>{first} <em className="gold-text">{rest.join(" ")}</em></>} intro={room.short} />

      <section className="px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1360px] gap-12 lg:grid-cols-[1.45fr_1fr] xl:gap-16">
          <div>
            <div ref={viewerRef} className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-forest/10">
              <Picture key={image.path} data-viewer-img path={image.path} alt={image.alt} sizes="(min-width: 1024px) 60vw, 100vw" className="h-full w-full object-cover" />
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button aria-label="Previous photo" onClick={() => setShown((shown - 1 + room.gallery.length) % room.gallery.length)} className="grid h-11 w-11 place-items-center rounded-full bg-ivory/90 text-forest"><ArrowLeft size={18} /></button>
                <button aria-label="Next photo" onClick={() => setShown((shown + 1) % room.gallery.length)} className="grid h-11 w-11 place-items-center rounded-full bg-ivory/90 text-forest"><ArrowRight size={18} /></button>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {room.gallery.map((item, index) => (
                <button key={item.path} onClick={() => setShown(index)} aria-label={`Show photo ${index + 1}`} className={`aspect-[4/3] overflow-hidden rounded-xl border-2 transition ${index === shown ? "border-gold" : "border-transparent opacity-70 hover:opacity-100"}`}>
                  <Picture path={item.path} alt="" sizes="200px" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <p data-reveal className="mt-10 max-w-2xl text-base leading-8 text-charcoal/75">{room.description}</p>
            <h2 data-reveal className="eyebrow mt-12 text-gold">In the room</h2>
            <ul data-reveal="stagger" className="mt-6 grid gap-3 sm:grid-cols-2">
              {room.features.map((feature) => <li key={feature} className="flex items-center gap-3 rounded-xl border border-forest/10 bg-ivory px-4 py-3 text-forest"><Check size={16} className="text-gold" />{feature}</li>)}
            </ul>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[28px] border border-gold/30 bg-ivory p-7 shadow-[0_30px_80px_rgba(13,40,35,.08)]">
              <p className="eyebrow text-[10px] text-charcoal/55">Nightly, from</p>
              <p className="display mt-2 text-5xl text-forest">{inr(price)}</p>
              <p className="mt-1 text-xs text-charcoal/55">Plus taxes · final tariff confirmed by reception</p>
              <ul className="mt-6 grid gap-3 border-y border-forest/10 py-6 text-sm text-forest">
                <li className="flex items-center gap-3"><Ruler size={16} className="text-gold" />{room.size}</li>
                <li className="flex items-center gap-3"><Users size={16} className="text-gold" />{room.occupancy}</li>
                <li className="flex items-center gap-3"><BedDouble size={16} className="text-gold" />{room.bed}</li>
              </ul>
              <button onClick={() => openBooking({ roomType: room.name, purpose: "stay" })} className="mt-6 min-h-13 w-full rounded-full bg-gold text-[15px] font-semibold text-night transition hover:bg-[#c99a40]">Request this room</button>
              <p className="mt-4 text-center text-xs leading-5 text-charcoal/55">Your request goes to the front desk. Nothing is charged; reception will contact you to confirm.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-ivory px-5 py-24 md:px-10">
        <div className="mx-auto max-w-[1360px]">
          <div className="flex items-end justify-between gap-6">
            <h2 data-split className="display text-4xl text-forest md:text-5xl">You may also <em className="text-gold">love</em></h2>
            <Link to="/rooms" className="eyebrow hidden text-[11px] text-forest hover:text-gold md:block">All rooms</Link>
          </div>
          <div data-reveal="stagger" className="mt-12 grid gap-8 md:grid-cols-2 [&>article]:md:w-full [&>article]:lg:w-full [&>article]:xl:w-full">
            {others.map((item) => <RoomCard key={item.slug} room={item} index={rooms.indexOf(item)} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
