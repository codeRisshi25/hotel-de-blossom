import { useRef, type ReactNode } from "react";
import { Link } from "react-router";
import { Picture } from "./Picture";
import { gsap, SplitText, useGSAP } from "../lib/motion";

/** Dark, framed opening for inner pages: image drifts on scroll, title rises line by line. */
export function PageHero({ eyebrow, title, intro, image, alt, children }: { eyebrow: string; title: ReactNode; intro?: string; image: string; alt: string; children?: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const title = ref.current!.querySelector("h1")!;
        const split = SplitText.create(title, { type: "lines", mask: "lines" });
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.fromTo("[data-hero-frame]", { clipPath: "inset(10% 6% 10% 6% round 40px)" }, { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.6 })
          .fromTo("[data-hero-img]", { scale: 1.35 }, { scale: 1.08, duration: 2 }, 0)
          .from(split.lines, { yPercent: 110, duration: 1.2, stagger: 0.1 }, 0.35)
          .from("[data-hero-fade]", { y: 20, opacity: 0, duration: 1, stagger: 0.08 }, 0.6);
        gsap.to("[data-hero-img]", { yPercent: 12, ease: "none", scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="bg-champagne p-2 md:p-4">
      <div data-hero-frame className="relative isolate flex min-h-[68svh] flex-col justify-end overflow-hidden rounded-[28px] bg-night text-ivory">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <Picture data-hero-img path={image} alt={alt} priority className="h-full w-full scale-[1.08] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/30" />
        </div>
        <div className="mx-auto w-full max-w-[1360px] px-5 pb-12 pt-36 md:px-10 md:pb-16">
          <nav data-hero-fade aria-label="Breadcrumb" className="eyebrow mb-6 flex gap-2 text-[10px] text-sandstone/80">
            <Link to="/" className="hover:text-ivory">Home</Link><span>/</span><span className="text-ivory">{eyebrow}</span>
          </nav>
          <h1 className="display max-w-4xl text-[11vw] leading-[.92] sm:text-6xl lg:text-[5.5rem]">{title}</h1>
          {intro && <p data-hero-fade className="mt-5 max-w-lg text-base leading-7 text-ivory/75">{intro}</p>}
          {children && <div data-hero-fade className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, intro, align = "left", tone = "light" }: { eyebrow: string; title: ReactNode; intro?: string; align?: "left" | "center"; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p data-reveal className={`eyebrow ${align === "center" ? "ornament" : ""} ${dark ? "text-gold-soft" : "text-gold"}`}>{eyebrow}</p>
      <h2 data-split className={`display mt-4 text-4xl md:text-[3.6rem] ${dark ? "text-ivory" : "text-forest"}`}>{title}</h2>
      {intro && <p data-reveal className={`mt-5 text-base leading-7 ${dark ? "text-ivory/70" : "text-charcoal/70"}`}>{intro}</p>}
    </div>
  );
}
