import { useRef } from "react";
import { Mail, MapPin, Navigation, Phone } from "lucide-react";
import { PageHero, SectionHeading } from "../components/PageHero";
import { BookingForm } from "../booking/BookingForm";
import { WhatsApp } from "../components/BrandIcons";
import { faqs, hotel, whatsappLink } from "../content/site";
import { useScrollAnimations } from "../lib/useScrollAnimations";
import { useTitle } from "../lib/useTitle";

export default function ContactPage() {
  const ref = useRef<HTMLDivElement>(null);
  useTitle("Contact & Arrival");
  useScrollAnimations(ref);
  const cards = [
    { icon: Phone, label: "Front desk · 24×7", value: hotel.phone, href: hotel.phoneHref },
    { icon: WhatsApp, label: "WhatsApp", value: "Message reception", href: whatsappLink("Hello Hotel De Blossom, I have a question.") },
    { icon: Mail, label: "Email", value: hotel.email, href: `mailto:${hotel.email}` },
    { icon: MapPin, label: "Address", value: hotel.address.join(", "), href: hotel.mapsUrl },
  ];
  return (
    <div ref={ref}>
      <PageHero eyebrow="Contact" image="hero/night-sky" alt="Hotel De Blossom at night" title={<>We're always <em className="gold-text">awake.</em></>} intro="Call, WhatsApp or send a request — a real person at our front desk will help, any hour of the day." />

      <section className="px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1360px]">
          <div data-reveal="stagger" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map(({ icon: Icon, label, value, href }) => (
              <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="group rounded-[24px] border border-forest/10 bg-ivory p-7 transition hover:-translate-y-1 hover:border-gold">
                <Icon size={22} className="text-gold" />
                <p className="eyebrow mt-6 text-[10px] text-charcoal/55">{label}</p>
                <p className="mt-2 font-semibold text-forest group-hover:text-gold">{value}</p>
              </a>
            ))}
          </div>

          <div className="mt-20 grid gap-14 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <SectionHeading eyebrow="Booking request" title={<>Send it to the <em className="text-gold">front desk.</em></>} intro="Reception reviews every request personally and confirms availability and tariff with you — your booking is confirmed only after that." />
              <div data-reveal className="mt-10 overflow-hidden rounded-[24px] border border-forest/10">
                <iframe title="Map to Hotel De Blossom" src={hotel.mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-80 w-full" />
              </div>
              <a data-reveal href={hotel.mapsUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-forest hover:text-gold"><Navigation size={15} /> Open directions in Google Maps</a>
            </div>
            <div data-reveal className="rounded-[28px] border border-gold/30 bg-ivory p-6 md:p-10">
              <BookingForm />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ivory px-5 py-24 md:px-10">
        <div className="mx-auto max-w-4xl">
          <SectionHeading align="center" eyebrow="FAQ" title={<>Questions, <em className="text-gold">answered.</em></>} />
          <div data-reveal="stagger" className="mt-12 divide-y divide-forest/10 border-y border-forest/10">
            {faqs.map((faq) => (
              <details key={faq.q} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold text-forest">
                  {faq.q}
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-forest/15 text-gold transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 leading-7 text-charcoal/65">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
