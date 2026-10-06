import { useRef } from "react";
import { Clock3, UtensilsCrossed, Wallet } from "lucide-react";
import { PageHero, SectionHeading } from "../components/PageHero";
import { Picture } from "../components/Picture";
import { MenuBook } from "../components/MenuBook";
import { hotel } from "../content/site";
import { useBooking } from "../booking/BookingContext";
import { useScrollAnimations } from "../lib/useScrollAnimations";
import { useTitle } from "../lib/useTitle";

const plates = [
  { path: "food/veg-biryani", alt: "Veg biryani with raita and whole spices" },
  { path: "food/lemon-coriander-soup", alt: "Lemon coriander soup" },
  { path: "food/kungpao-chicken", alt: "Kung pao chicken" },
  { path: "food/shahi-paneer", alt: "Shahi paneer" },
  { path: "food/sweet-and-sour-prawn", alt: "Sweet and sour prawn" },
  { path: "food/yellow-dal-tadka", alt: "Yellow dal tadka" },
];

export default function DiningPage() {
  const ref = useRef<HTMLDivElement>(null);
  const { openBooking } = useBooking();
  useTitle("Restaurant & Menu");
  useScrollAnimations(ref);
  return (
    <div ref={ref}>
      <PageHero eyebrow="Dining" image="food/chicken-lababdar" alt="Chicken Lababdar with spices on a timber table" title={<>The <em className="gold-text">Table.</em></>} intro="Carefully curated flavours, artfully plated and served in a warm, elegant room — from Assamese Jolpan at sunrise to tandoor platters at night." />

      <section className="px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[1360px]">
          <div data-reveal="stagger" className="grid gap-4 md:grid-cols-3">
            {[
              { icon: Clock3, label: "Open daily", value: hotel.restaurantHours },
              { icon: UtensilsCrossed, label: "Cuisine", value: "Indian · Assamese · Asian · Continental" },
              { icon: Wallet, label: "Price range", value: "₹500 – ₹2,500" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-[24px] border border-forest/10 bg-ivory p-7">
                <Icon size={22} strokeWidth={1.4} className="text-gold" />
                <p className="eyebrow mt-5 text-[10px] text-charcoal/55">{label}</p>
                <p className="display mt-2 text-xl text-forest">{value}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-20 grid max-w-[1100px] grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
            {plates.map((plate, index) => (
              <div key={plate.path} className={index % 3 === 1 ? "md:translate-y-16" : ""}>
                <div data-reveal-img className="overflow-hidden rounded-[24px]">
                  <Picture path={plate.path} alt={plate.alt} sizes="(min-width: 768px) 33vw, 50vw" className="aspect-[4/5] w-full object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="menu" className="scroll-mt-24 px-3 pb-28 pt-10 md:px-10">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-12"><SectionHeading align="center" eyebrow="À la carte" title={<>Our <em className="text-gold">menu.</em></>} /></div>
          <MenuBook />
          <div data-reveal className="mt-10 text-center">
            <button onClick={() => openBooking({ purpose: "event", roomType: "Banquet — Other celebration", guests: 20 })} className="min-h-13 rounded-full bg-forest px-7 text-[15px] font-semibold text-ivory">Planning a group meal? Send a request</button>
          </div>
        </div>
      </section>
    </div>
  );
}
