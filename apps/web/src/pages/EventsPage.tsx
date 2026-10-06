import { useRef } from "react";
import { PageHero } from "../components/PageHero";
import { Picture } from "../components/Picture";
import { useBooking } from "../booking/BookingContext";
import { hotel } from "../content/site";
import { useScrollAnimations } from "../lib/useScrollAnimations";

const eventPrefill = { purpose: "event" as const, guests: 50 };

export default function EventsPage() {
  const ref = useRef<HTMLDivElement>(null);
  const { openBooking } = useBooking();
  useScrollAnimations(ref);

  const plan = (
    <button onClick={() => openBooking(eventPrefill)} className="min-h-13 rounded-full bg-gold px-8 text-[15px] font-semibold text-night transition-colors hover:bg-gold-soft">
      Plan your event
    </button>
  );

  return (
    <div ref={ref}>
      <PageHero
        eyebrow="Banquet & events"
        image="banquet/banquet-3"
        alt="Banquet hall set for a dinner celebration with white chair covers"
        title="Celebrate under warm gold light."
        intro={`Weddings, receptions, birthdays and business meetings for up to ${hotel.banquetCapacity} guests, with catering from our own kitchen.`}
      />

      {/* The room */}
      <section className="px-5 py-14 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-[1360px] items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div data-reveal className="max-w-md">
            <h2 className="display text-[2.25rem] text-forest [text-wrap:balance] md:text-[3.25rem]">A hall made for milestones.</h2>
            <p className="mt-6 text-[17px] leading-8 text-charcoal/70">
              Warm timber, illuminated marble and soft cove lighting set the mood. Our kitchen and service team take care of everything else, so you can spend the evening with your guests.
            </p>
            <p className="mt-4 text-[17px] leading-8 text-charcoal/70">
              Weddings and receptions. Engagements and anniversaries. Birthdays and family gatherings. Conferences and corporate meetings. And rooms upstairs for the guests who travel in.
            </p>
          </div>
          <div data-reveal-img className="overflow-hidden rounded-[20px]">
            <Picture path="banquet/banquet-2" alt="Banquet hall with a lit marble feature wall and a long buffet" sizes="(min-width: 1024px) 55vw, 100vw" className="aspect-[4/3] w-full object-cover" />
          </div>
        </div>
      </section>

      {/* Three ways the hall is set */}
      <section className="px-5 pb-14 md:px-10 md:pb-24">
        <div className="mx-auto grid max-w-[1360px] gap-5 md:grid-cols-3 md:gap-6">
          {[
            { path: "banquet/banquet-1", alt: "Banquet hall with a buffet line and blue patterned carpet", caption: "Set for a wedding reception" },
            { path: "banquet/buffet-2", alt: "Buffet counters in front of a lit marble wall", caption: "Buffets from our own kitchen" },
            { path: "banquet/meeting-2", alt: "Round tables and chairs arranged for a meeting", caption: "Arranged for meetings" },
          ].map((item) => (
            <figure key={item.path}>
              <div data-reveal-img className="overflow-hidden rounded-[20px]">
                <Picture path={item.path} alt={item.alt} sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[4/5] w-full object-cover" />
              </div>
              <figcaption className="mt-4 text-[15px] text-charcoal/70">{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Closing invitation */}
      <section className="px-5 pb-20 pt-4 text-center md:px-10 md:pb-28">
        <div data-reveal className="mx-auto max-w-2xl">
          <h2 className="display text-[2.25rem] text-forest [text-wrap:balance] md:text-[3.25rem]">Tell us the date. We'll plan the rest.</h2>
          <p className="mx-auto mt-6 max-w-md text-[17px] leading-8 text-charcoal/70">
            Share your date and guest count. Our team will call you to plan the menu, the layout and the pricing.
          </p>
          <div className="mt-9">{plan}</div>
        </div>
      </section>
    </div>
  );
}
