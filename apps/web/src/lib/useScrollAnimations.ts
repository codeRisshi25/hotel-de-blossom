import type { RefObject } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "./motion";

/**
 * Declarative scroll choreography for a page. Mark elements with:
 * - `data-split`             headline lines rise out of a mask
 * - `data-reveal`            fade + lift (`data-reveal="stagger"` staggers its children)
 * - `data-reveal-img`        clip-path curtain reveal with the inner <img> settling from a zoom
 * - `data-parallax="0.2"`    scrubbed vertical drift (fraction of the element height)
 * - `data-line`              gold hairline draws in
 * - `data-count="190"`       number counts up
 */
export function useScrollAnimations(scope: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        root.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
          const split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "split-line" });
          gsap.set(el, { visibility: "visible" });
          gsap.from(split.lines, {
            yPercent: 110,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.09,
            scrollTrigger: { trigger: el, start: "top 88%" },
          });
        });

        root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
          const targets = el.dataset.reveal === "stagger" ? Array.from(el.children) : [el];
          if (el.dataset.reveal === "stagger") gsap.set(el, { opacity: 1 });
          gsap.fromTo(
            targets,
            { y: 36, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.1, scrollTrigger: { trigger: el, start: "top 90%" } },
          );
        });

        root.querySelectorAll<HTMLElement>("[data-reveal-img]").forEach((el) => {
          const image = el.querySelector("img");
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%" } });
          tl.fromTo(el, { clipPath: "inset(18% 12% 18% 12% round 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 24px)", duration: 1.4, ease: "expo.out" });
          if (image) tl.fromTo(image, { scale: 1.3 }, { scale: 1, duration: 1.6, ease: "expo.out" }, 0);
        });

        root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
          const amount = Number(el.dataset.parallax) || 0.15;
          gsap.fromTo(el, { yPercent: -amount * 50 }, { yPercent: amount * 50, ease: "none", scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true } });
        });

        root.querySelectorAll<HTMLElement>("[data-line]").forEach((el) => {
          gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, transformOrigin: el.dataset.line === "center" ? "50% 50%" : "0% 50%", duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: el, start: "top 92%" } });
        });

        root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
          const end = Number(el.dataset.count);
          const counter = { value: 0 };
          gsap.to(counter, { value: end, duration: 2, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 90%" }, onUpdate: () => { el.textContent = Math.round(counter.value).toString(); } });
        });
      });

      // Images and fonts change layout after first paint.
      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh);
      window.addEventListener("load", refresh);
      return () => { window.removeEventListener("load", refresh); mm.revert(); };
    },
    { scope, dependencies: deps, revertOnUpdate: true },
  );
}
