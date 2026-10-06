import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Navigation } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { BookingForm } from "../booking/BookingForm";
import { faqs, hotel, whatsappLink } from "../content/site";
import { gsap, useGSAP } from "../lib/motion";
import { useScrollAnimations } from "../lib/useScrollAnimations";

const channels = [
  { label: "Call the front desk", value: hotel.phone, href: hotel.phoneHref },
  { label: "Message us on WhatsApp", value: "Say hello to reception", href: whatsappLink("Hello Hotel De Blossom, I have a question.") },
  { label: "Write to us", value: hotel.email, href: `mailto:${hotel.email}` },
  { label: "Visit us", value: `${hotel.address[0]}, ${hotel.address[1].split(",")[0]}`, href: hotel.mapsUrl },
];

const steps = [
  { title: "You send a request.", body: "Choose your dates and room. You get a reference number straight away." },
  { title: "We call you back.", body: "Reception phones or messages you on WhatsApp to confirm availability and the final rate." },
  { title: "Your stay is confirmed.", body: "Nothing is booked or charged until that conversation." },
];

/** Guwahati time, ticking. The desk never closes, so the line under it never changes. */
function DeskClock() {
  const format = () =>
    new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date());
  const [time, setTime] = useState(format);
  useEffect(() => {
    const id = window.setInterval(() => setTime(format()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div>
      <p suppressHydrationWarning aria-label={`Guwahati time ${time}`} className="display text-[3.5rem] leading-none tabular-nums text-forest md:text-[5.5rem]">{time}</p>
      <div className="mt-4 md:mt-5">
        <p className="flex items-center gap-2.5 text-[15px] font-medium text-forest">
          <span className="relative grid h-2.5 w-2.5 place-items-center">
            <span className="absolute inset-0 rounded-full bg-gold/60 motion-safe:animate-ping" />
            <span className="h-2 w-2 rounded-full bg-gold" />
          </span>
          The front desk is open
        </p>
        <p className="mt-1 text-[15px] text-charcoal/65">Guwahati time, 24 hours a day.</p>
      </div>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-forest/15">
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between gap-6 py-6 text-left">
        <span className="display text-[1.4rem] leading-snug text-forest md:text-[1.6rem]">{q}</span>
        <span className="relative h-5 w-5 shrink-0" aria-hidden>
          <span className="absolute left-0 top-1/2 h-px w-full bg-gold" />
          <span className={`absolute left-0 top-1/2 h-px w-full bg-gold transition-transform duration-500 ${open ? "rotate-0" : "rotate-90"}`} />
        </span>
      </button>
      <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <p className="max-w-2xl pb-6 text-[17px] leading-8 text-charcoal/70">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const ref = useRef<HTMLDivElement>(null);
  useScrollAnimations(ref);

  // The request timeline draws itself as you scroll, lighting each step as the line reaches it.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo("[data-timeline-line]", { scaleY: 0 }, { scaleY: 1, ease: "none", transformOrigin: "top", scrollTrigger: { trigger: "[data-timeline]", start: "top 65%", end: "bottom 65%", scrub: true } });
        gsap.utils.toArray<HTMLElement>("[data-step]").forEach((step) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: step, start: "top 65%", toggleActions: "play none none reverse" } });
          tl.to(step, { opacity: 1, duration: 0.5 }, 0).to(step.querySelector("[data-dot]"), { backgroundColor: "#b8872e", scale: 1.25, duration: 0.5 }, 0);
          gsap.set(step, { opacity: 0.7 });
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref}>
      <PageHero
        eyebrow="Contact"
        image="reception/reception-1"
        alt="Reception desk with a backlit marble counter"
        title="We're always awake."
        intro="Call, WhatsApp or send a request. A real person at our front desk will help, at any hour."
      />

      {/* Reach a person */}
      <section className="px-5 py-14 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-[1360px] grid-cols-1 gap-12 lg:grid-cols-[minmax(280px,.8fr)_1.6fr] lg:gap-20 [&>*]:min-w-0">
          <div data-reveal className="lg:sticky lg:top-32 lg:self-start">
            <DeskClock />
          </div>
          <ul data-reveal="stagger" className="border-t border-forest/15">
            {channels.map((channel) => (
              <li key={channel.label}>
                <a
                  href={channel.href}
                  target={channel.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="group relative flex items-center justify-between gap-6 overflow-hidden border-b border-forest/15 px-1 py-7 before:absolute before:inset-0 before:origin-left before:scale-x-0 before:bg-forest before:transition-transform before:duration-500 before:ease-out hover:before:scale-x-100 focus-visible:before:scale-x-100 md:px-6 md:py-9"
                >
                  <span className="relative z-10 transition-transform duration-500 group-hover:translate-x-3 md:group-hover:translate-x-4">
                    <span className="block text-[14px] text-charcoal/60 transition-colors duration-500 group-hover:text-ivory/60">{channel.label}</span>
                    <span className="display mt-1 block text-[1.6rem] leading-tight text-forest [overflow-wrap:anywhere] transition-colors duration-500 group-hover:text-ivory md:text-[2.5rem]">{channel.value}</span>
                  </span>
                  <ArrowUpRight size={28} strokeWidth={1.25} className="relative z-10 shrink-0 text-gold transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:rotate-12" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Request */}
      <section className="px-5 pb-14 md:px-10 md:pb-24">
        <div className="mx-auto grid max-w-[1360px] gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <h2 data-reveal className="display text-[2.25rem] text-forest [text-wrap:balance] md:text-[3.25rem]">Send a request to the front desk.</h2>
            <ol data-timeline className="relative mt-12 grid gap-12 pl-10">
              <span aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-forest/15" />
              <span aria-hidden data-timeline-line className="absolute bottom-2 left-[7px] top-2 w-px bg-gold" />
              {steps.map((step) => (
                <li key={step.title} data-step className="relative">
                  <span data-dot className="absolute -left-10 top-2 h-[15px] w-[15px] rounded-full border border-gold bg-champagne" />
                  <h3 className="display text-[1.5rem] text-forest md:text-[1.75rem]">{step.title}</h3>
                  <p className="mt-2 max-w-sm text-[17px] leading-8 text-charcoal/70">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
          <div data-reveal className="rounded-[20px] border border-gold/30 bg-ivory p-6 md:p-10">
            <BookingForm />
          </div>
        </div>
      </section>

      {/* Find us */}
      <section className="px-5 pb-14 md:px-10 md:pb-24">
        <div data-reveal-img className="relative mx-auto max-w-[1360px] overflow-hidden rounded-[20px] bg-ink">
          <iframe
            title="Hotel De Blossom on Google Maps"
            src={`${hotel.mapsEmbed}&z=16`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-[420px] w-full [filter:invert(.92)_hue-rotate(180deg)_saturate(.55)_brightness(.85)_contrast(.95)]"
          />
          <div className="pointer-events-none absolute inset-0 bg-forest/25 mix-blend-color" />
          <div className="absolute bottom-5 left-5 max-w-xs rounded-[14px] bg-ink/90 p-5 text-ivory backdrop-blur-md">
            <address className="not-italic leading-7 text-ivory/85">
              {hotel.address.map((line) => <span key={line} className="block">{line}</span>)}
            </address>
            <a href={hotel.mapsUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-[15px] font-medium text-gold-soft transition-colors hover:text-ivory">
              <Navigation size={15} /> Get directions
            </a>
          </div>
        </div>
      </section>

      {/* Good to know */}
      <section className="px-5 pb-20 md:px-10 md:pb-28">
        <div className="mx-auto grid max-w-[1360px] gap-8 lg:grid-cols-[.8fr_1.6fr] lg:gap-20">
          <h2 data-reveal className="display text-[2.25rem] text-forest [text-wrap:balance] md:text-[3.25rem]">Good to know.</h2>
          <div data-reveal className="border-t border-forest/15">
            {faqs.map((faq) => <Faq key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
