import { useRef } from "react";
import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { PageHero, SectionHeading } from "../components/PageHero";
import { Picture } from "../components/Picture";
import { useScrollAnimations } from "../lib/useScrollAnimations";
import { useTitle } from "../lib/useTitle";

const pillars = [
  { title: "Quiet elegance", body: "Sage, ivory, brass and warm timber — interiors chosen to calm rather than impress." },
  { title: "Warm, personal service", body: "A front desk that knows your name, your arrival time and how you take your tea." },
  { title: "Rooted in Guwahati", body: "Assamese Jolpan at breakfast, local advice at reception, and a central address in Chandmari." },
];

export default function AboutPage() {
  const ref = useRef<HTMLDivElement>(null);
  useTitle("Our Story");
  useScrollAnimations(ref);
  return (
    <div ref={ref}>
      <PageHero eyebrow="About" image="reception/reception-4" alt="Lobby seating with green wing chairs" title={<>Our story, <em className="gold-text">in bloom.</em></>} intro="Rooted in warmth and family, Hotel De Blossom was built with the dream of creating a quiet, comforting space for every guest who walks through our doors." />

      <section className="px-5 py-24 md:px-10 md:py-36">
        <div className="mx-auto grid max-w-[1360px] items-center gap-16 lg:grid-cols-2">
          <div className="relative mx-auto w-full max-w-[440px]">
            <div data-reveal-img className="arch aspect-[3/4] overflow-hidden"><Picture path="reception/reception-2" alt="Reception lounge" sizes="(min-width: 1024px) 45vw, 100vw" className="h-full w-full object-cover" /></div>
            <img src="/images/brand/logo-stacked.webp" alt="" aria-hidden className="absolute -bottom-10 -right-4 w-32 rounded-3xl bg-champagne p-4 shadow-xl md:-right-10 md:w-40" />
          </div>
          <div>
            <SectionHeading eyebrow="The house" title={<>Refined aesthetics, <em className="text-gold">natural warmth.</em></>} intro="Hotel De Blossom brings together quiet elegance and genuine hospitality. Every room, every plate and every celebration is shaped by the same idea: that a stay should feel immersive, comfortable and unhurried." />
            <p data-reveal className="mt-5 text-base leading-7 text-charcoal/70">Our golden lotus emblem — a flower opening above a gentle arc — is a promise we keep at every touchpoint: to help each guest's stay unfold, beautifully.</p>
            <Link data-reveal to="/rooms" className="mt-10 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-ivory">Explore the rooms <ArrowUpRight size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="royal-pattern px-5 py-24 text-ivory md:px-10 md:py-32">
        <div className="mx-auto max-w-[1360px]">
          <SectionHeading tone="dark" align="center" eyebrow="What we believe" title={<>Three quiet <em className="gold-text">promises.</em></>} />
          <div data-reveal="stagger" className="mt-16 grid gap-6 md:grid-cols-3">
            {pillars.map((pillar, index) => (
              <article key={pillar.title} className="rounded-[28px] border border-gold/25 p-8 text-center md:p-10">
                <span className="royal text-gold-soft">{["I", "II", "III"][index]}</span>
                <div data-line="center" className="mx-auto my-6 h-px w-16 bg-gold" />
                <h3 className="display text-2xl">{pillar.title}</h3>
                <p className="mt-4 leading-7 text-ivory/65">{pillar.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
