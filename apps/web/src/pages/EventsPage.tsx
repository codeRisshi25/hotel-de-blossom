import { useRef } from "react";
import { PageHero, SectionHeading } from "../components/PageHero";
import { Picture } from "../components/Picture";
import { BookingForm } from "../booking/BookingForm";
import { hotel } from "../content/site";
import { useScrollAnimations } from "../lib/useScrollAnimations";
import { useTitle } from "../lib/useTitle";

const occasions = [
  { title: "Weddings & receptions", body: `Banquet seating for up to ${hotel.banquetCapacity}, with buffet lines and a warm, gold-lit setting for your family's biggest day.` },
  { title: "Engagements & anniversaries", body: "Intimate celebrations planned with our kitchen — menus, timings and décor arranged around you." },
  { title: "Corporate meetings", body: "Conference and classroom layouts, with working lunches and tea service from our restaurant." },
  { title: "Birthdays & gatherings", body: "From milestone birthdays to family get-togethers, with rooms upstairs for guests who travel in." },
];
const prefill = { purpose: "event" as const, guests: 50 };

export default function EventsPage() {
  const ref = useRef<HTMLDivElement>(null);
  useTitle("Banquet & Events");
  useScrollAnimations(ref);
  return (
    <div ref={ref}>
      <PageHero eyebrow="Banquet & events" image="banquet/banquet-3" alt="Banquet hall set for a celebration" title={<>The <em className="gold-text">Occasion.</em></>} intro="Every celebration deserves a remarkable setting. We create the atmosphere — you bring the moment." />

      <section className="px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-[1500px] items-center gap-14 lg:grid-cols-2">
          <SectionHeading eyebrow={`Up to ${hotel.banquetCapacity} guests`} title={<>A hall made for <em className="text-gold">milestones.</em></>} intro="Warm timber, illuminated marble and soft cove lighting set the tone; our kitchen and service team handle the rest." />
          <div className="grid grid-cols-2 gap-4">
            <div data-reveal-img className="row-span-2 overflow-hidden rounded-[24px]"><Picture path="banquet/banquet-2" alt="Banquet hall feature wall" sizes="30vw" className="h-full w-full object-cover" /></div>
            <div data-reveal-img className="overflow-hidden rounded-[24px]"><Picture path="banquet/buffet-2" alt="Buffet setup in the banquet hall" sizes="30vw" className="aspect-square w-full object-cover" /></div>
            <div data-reveal-img className="overflow-hidden rounded-[24px]"><Picture path="banquet/meeting-2" alt="Meeting layout in the banquet hall" sizes="30vw" className="aspect-square w-full object-cover" /></div>
          </div>
        </div>
      </section>

      <section className="royal-pattern px-5 py-24 text-ivory md:px-10 md:py-32">
        <div className="mx-auto max-w-[1500px]">
          <SectionHeading tone="dark" eyebrow="Occasions" title={<>For every kind of <em className="gold-text">celebration.</em></>} />
          <div data-reveal="stagger" className="mt-14 grid gap-px overflow-hidden rounded-[28px] border border-gold/20 bg-gold/20 md:grid-cols-2">
            {occasions.map((item, index) => (
              <article key={item.title} className="bg-night p-8 md:p-12">
                <span className="royal text-sm text-gold-soft">{["I", "II", "III", "IV"][index]}</span>
                <h3 className="display mt-4 text-4xl">{item.title}</h3>
                <p className="mt-3 max-w-md leading-7 text-ivory/65">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="plan" className="px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-[1300px] gap-14 lg:grid-cols-[1fr_1.1fr]">
          <SectionHeading eyebrow="Plan an occasion" title={<>Tell us about your <em className="text-gold">day.</em></>} intro="Share the date and guest count. Your request reaches our front desk, and the team will call you to plan menus, layout and pricing." />
          <div data-reveal className="rounded-[28px] border border-gold/30 bg-ivory p-6 md:p-10">
            <BookingForm prefill={prefill} />
          </div>
        </div>
      </section>
    </div>
  );
}
