import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "../lib/motion";
import { hotel } from "../content/site";

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Each word brightens from a whisper as the paragraph passes through the viewport.
        const split = SplitText.create("[data-manifesto]", { type: "words" });
        gsap.fromTo(split.words, { opacity: 0.14 }, { opacity: 1, stagger: 0.05, ease: "none", scrollTrigger: { trigger: "[data-manifesto]", start: "top 80%", end: "bottom 45%", scrub: true } });
        gsap.fromTo("[data-emblem]", { rotate: -8, scale: 0.7, opacity: 0 }, { rotate: 0, scale: 1, opacity: 1, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ref.current, start: "top 75%" } });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative overflow-hidden px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-6xl text-center">
        <img data-emblem src="/images/brand/emblem.webp" alt="" aria-hidden width={170} height={77} className="mx-auto h-16 w-auto md:h-20" />
        <p className="eyebrow ornament mx-auto mt-8 max-w-md text-gold">Welcome to the house</p>
        <p data-manifesto className="display mt-10 text-[2.15rem] leading-[1.12] text-forest sm:text-5xl md:text-6xl lg:text-[4.4rem]">
          Rooted in warmth and family, Hotel De Blossom was built to be a <em className="text-gold">quiet, comforting</em> house for every guest who walks
          through our doors — refined in its details, natural in its welcome, and <em className="text-gold">unmistakably Guwahati.</em>
        </p>
        <div className="mx-auto mt-20 grid max-w-5xl grid-cols-2 gap-y-10 border-t border-forest/15 pt-12 md:grid-cols-4">
          {[
            { count: 3, suffix: "", label: "Room categories" },
            { count: 50, suffix: "m²", label: "Executive Suite" },
            { count: hotel.banquetCapacity, suffix: "", label: "Banquet guests" },
            { count: 24, suffix: "/7", label: "Front desk" },
          ].map((stat) => (
            <div key={stat.label} data-reveal>
              <p className="display text-6xl text-forest md:text-7xl">
                <span data-count={stat.count}>{stat.count}</span>
                <span className="text-3xl text-gold">{stat.suffix}</span>
              </p>
              <p className="eyebrow mt-3 text-[10px] text-charcoal/55">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
