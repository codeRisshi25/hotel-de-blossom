import { useRef } from "react";
import { Link } from "react-router";
import { Navigation } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { Picture } from "../components/Picture";
import { useBooking } from "../booking/BookingContext";
import { hotel, testimonials } from "../content/site";
import { useScrollAnimations } from "../lib/useScrollAnimations";

const offerings = [
  {
    title: "Stay",
    heading: "Three ways to rest.",
    body: "Deluxe Double and Deluxe Twin rooms of 23 m², and the 50 m² Executive Suite with a separate living area. Every room has air conditioning, Wi-Fi, a glass shower and a front desk that answers at any hour.",
    image: { path: "rooms/deluxe-double/double-bed", alt: "Deluxe Double bedroom with sage cushions" },
    link: { to: "/rooms", label: "See the rooms" },
  },
  {
    title: "Dine",
    heading: "A kitchen that cooks across India and Asia.",
    body: `Assamese Jolpan for breakfast, Naga chicken, Galouti kebabs and Thai curries later in the day. The restaurant is open ${hotel.restaurantHours.replace(", Monday to Sunday", " daily")}, and breakfast starts at 07:00.`,
    image: { path: "food/chicken-lababdar", alt: "Chicken Lababdar served with whole spices" },
    link: { to: "/dining", label: "Read the menu" },
  },
  {
    title: "Celebrate",
    heading: `${hotel.banquetHallName}, for up to ${hotel.banquetCapacity} guests.`,
    body: "Weddings, receptions, birthdays and business meetings, with catering from our own kitchen and rooms upstairs for the guests who travel in.",
    image: { path: "banquet/banquet-3", alt: "Banquet hall set for a dinner celebration" },
    link: { to: "/events", label: "Plan an event" },
  },
];

export default function AboutPage() {
  const ref = useRef<HTMLDivElement>(null);
  const { openBooking } = useBooking();
  useScrollAnimations(ref);

  return (
    <div ref={ref}>
      <PageHero
        eyebrow="About"
        image="reception/reception-4"
        alt="Lobby seating with green wing chairs"
        title="A quiet house in the middle of Guwahati."
        intro="Hotel De Blossom was built on one idea: a stay should feel unhurried, comfortable and personal."
      />

      {/* The idea */}
      <section className="px-5 py-14 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-[1360px] items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div data-reveal>
            <p className="display text-[1.75rem] leading-[1.3] text-forest [text-wrap:balance] md:text-[2.4rem]">
              We are a hotel rooted in warmth and family. Sage, ivory, brass and warm timber. A front desk that knows your name and your arrival time. A kitchen that remembers how you take your tea.
            </p>
            <p className="mt-8 max-w-lg text-[17px] leading-8 text-charcoal/70">
              The golden lotus on our sign is the promise we try to keep at every touchpoint: to help each guest's stay open up, one small, considered detail at a time.
            </p>
          </div>
          <div data-reveal-img className="overflow-hidden rounded-[20px]">
            <Picture path="reception/reception-2" alt="Reception lounge with sage sofas" sizes="(min-width: 1024px) 45vw, 100vw" className="aspect-[4/5] w-full object-cover" />
          </div>
        </div>
      </section>

      {/* What the hotel offers: each block leads to its own page */}
      <section className="px-5 pb-14 md:px-10 md:pb-24">
        <div className="mx-auto grid max-w-[1360px] gap-16 md:gap-24">
          {offerings.map((item, index) => (
            <article key={item.title} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-20">
              <div data-reveal-img className={`overflow-hidden rounded-[20px] ${index % 2 ? "lg:order-2" : ""}`}>
                <Picture path={item.image.path} alt={item.image.alt} sizes="(min-width: 1024px) 45vw, 100vw" className="aspect-[4/3] w-full object-cover" />
              </div>
              <div data-reveal className="max-w-md">
                <h2 className="display text-[2rem] text-forest [text-wrap:balance] md:text-[2.75rem]">{item.heading}</h2>
                <p className="mt-5 text-[17px] leading-8 text-charcoal/70">{item.body}</p>
                <Link to={item.link.to} className="mt-7 inline-block border-b border-gold/70 py-1 text-[15px] font-medium text-forest transition-colors hover:border-forest hover:text-gold">
                  {item.link.label}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Guests */}
      <section className="px-5 pb-14 md:px-10 md:pb-24">
        <div className="mx-auto max-w-[1360px]">
          <div data-reveal className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <h2 className="display text-[2rem] text-forest [text-wrap:balance] md:text-[2.75rem]">What our guests say.</h2>
            <a href={hotel.mapsUrl} target="_blank" rel="noreferrer" className="text-[15px] text-charcoal/70 transition-colors hover:text-gold">
              Rated <span className="display text-[1.5rem] text-forest">4.7</span> out of 5 on Google
            </a>
          </div>
          <div data-reveal="stagger" className="mt-10 grid gap-10 border-t border-forest/15 pt-10 md:grid-cols-3 md:gap-12">
            {testimonials.map((item) => (
              <figure key={item.quote} className="flex flex-col">
                <blockquote className="display text-[1.4rem] leading-[1.4] text-forest">“{item.quote}”</blockquote>
                <figcaption className="mt-6 text-[15px] text-charcoal/70">
                  <span className="font-medium text-forest">{item.name}</span>
                  <span className="block">{item.stay}</span>
                  {item.sample && <span className="mt-2 inline-block rounded-full bg-gold/15 px-3 py-0.5 text-[12px] text-[#7a5a17]">Sample, replace with a real review</span>}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Where we are */}
      <section className="px-5 pb-14 md:px-10 md:pb-24">
        <div className="relative mx-auto max-w-[1360px] overflow-hidden rounded-[20px] bg-ink">
          <Picture path="hero/night-sky" alt="Hotel De Blossom lit up at night" sizes="100vw" className="absolute inset-0 h-full w-full object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
          <div data-reveal className="relative max-w-xl px-6 py-14 text-ivory md:px-14 md:py-20">
            <h2 className="display text-[2rem] [text-wrap:balance] md:text-[2.75rem]">Easy to find, easy to reach.</h2>
            <p className="mt-5 text-[17px] leading-8 text-ivory/75">
              We are at {hotel.address[0]}, in the heart of Chandmari. The railway station, the airport road and the city centre are all close by, and we arrange airport pickups and drops on request.
            </p>
            <a href={hotel.mapsUrl} target="_blank" rel="noreferrer" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-gold px-7 text-[15px] font-semibold text-night transition-colors hover:bg-gold-soft">
              <Navigation size={16} /> Get directions
            </a>
          </div>
        </div>
      </section>

      {/* Close */}
      <section className="px-5 pb-20 pt-2 text-center md:px-10 md:pb-28">
        <div data-reveal className="mx-auto max-w-2xl">
          <h2 className="display text-[2.25rem] text-forest [text-wrap:balance] md:text-[3.25rem]">Come and stay with us.</h2>
          <p className="mx-auto mt-6 max-w-md text-[17px] leading-8 text-charcoal/70">Send a request and our front desk will call you to confirm your dates, room and rate.</p>
          <button onClick={() => openBooking()} className="mt-9 min-h-13 rounded-full bg-gold px-8 text-[15px] font-semibold text-night transition-colors hover:bg-gold-soft">
            Request a stay
          </button>
        </div>
      </section>
    </div>
  );
}
