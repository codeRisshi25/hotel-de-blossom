import { useRef } from "react";
import { PageHero, SectionHeading } from "../components/PageHero";
import { RoomCard } from "../home/RoomsShowcase";
import { rooms, faqs } from "../content/site";
import { useScrollAnimations } from "../lib/useScrollAnimations";
import { useTitle } from "../lib/useTitle";

export default function RoomsPage() {
  const ref = useRef<HTMLDivElement>(null);
  useTitle("Rooms & Suites");
  useScrollAnimations(ref);
  return (
    <div ref={ref}>
      <PageHero
        eyebrow="Rooms"
        image="rooms/deluxe-double/double-entrance"
        alt="Deluxe Double room with lounge chairs"
        title={<>The Blossom <em className="gold-text">Collection.</em></>}
        intro="Three ways to stay — each in sage, ivory and warm timber, each looked after by a front desk that never sleeps."
      />
      <section className="px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[1500px]">
          <SectionHeading eyebrow="Choose your room" title={<>Rest, <em className="text-gold">beautifully.</em></>} intro="Prices are starting nightly rates. Send a request and reception will confirm availability and your final tariff." />
          <div data-reveal="stagger" className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3 [&>article]:md:w-full [&>article]:lg:w-full [&>article]:xl:w-full">
            {rooms.map((room, index) => <RoomCard key={room.slug} room={room} index={index} />)}
          </div>
        </div>
      </section>
      <section className="bg-ivory px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-[1500px] gap-14 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading eyebrow="Good to know" title={<>Before you <em className="text-gold">arrive.</em></>} />
          <div data-reveal="stagger" className="divide-y divide-forest/10 border-y border-forest/10">
            {faqs.map((faq) => (
              <details key={faq.q} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold text-forest">
                  {faq.q}
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-forest/15 text-gold transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 max-w-2xl leading-7 text-charcoal/65">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
