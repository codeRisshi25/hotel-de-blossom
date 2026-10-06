import { useEffect, useRef, type RefObject } from "react";
import { gsap, prefersReducedMotion } from "../lib/motion";

type Props = {
  text?: string;
  variant: "hero" | "footer";
  /** Element that receives pointer movement (defaults to the wordmark itself). */
  trackRef?: RefObject<HTMLElement | null>;
  className?: string;
};

/**
 * Two stacked copies of the word: a quiet base layer and a bright gold layer revealed
 * through a soft spotlight that follows the pointer. Letters near the pointer lift toward it.
 * On touch screens the spotlight drifts across the word by itself.
 */
export function Wordmark({ text = "DE BLOSSOM", variant, trackRef, className = "" }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const words = text.split(" ");

  // A passive effect (not a layout effect) so a parent's `trackRef` is already attached.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    const target = trackRef?.current ?? root;
    const pairs = Array.from(root.querySelectorAll<HTMLElement>("[data-base] [data-letter]")).map((base, index) => ({
      base,
      lifts: [base, root.querySelectorAll<HTMLElement>("[data-glow] [data-letter]")[index]].map((el) => gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" })),
    }));

    const spot = { x: -400, y: 0, r: 0 };
    const paint = () => {
      root.style.setProperty("--mx", `${spot.x}px`);
      root.style.setProperty("--my", `${spot.y}px`);
      root.style.setProperty("--mr", `${spot.r}px`);
    };
    const moveX = gsap.quickTo(spot, "x", { duration: 0.5, ease: "power3.out", onUpdate: paint });
    const moveY = gsap.quickTo(spot, "y", { duration: 0.5, ease: "power3.out", onUpdate: paint });
    const radius = () => Math.max(140, root.offsetHeight * (variant === "hero" ? 1.1 : 1.3));
    paint();

    const lift = (clientX: number | null) => {
      pairs.forEach(({ base, lifts }) => {
        let y = 0;
        if (clientX !== null) {
          const box = base.getBoundingClientRect();
          const distance = Math.abs(clientX - (box.left + box.width / 2));
          const reach = box.height * 1.4;
          y = -Math.max(0, 1 - distance / reach) * box.height * (variant === "hero" ? 0.08 : 0.12);
        }
        lifts.forEach((to) => to(y));
      });
    };

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!finePointer) {
      // Touch: a slow, continuous sweep so the gold still travels through the letters.
      spot.r = radius();
      spot.y = root.offsetHeight / 2;
      paint();
      const sweep = gsap.fromTo(spot, { x: -spot.r }, { x: () => root.offsetWidth + spot.r, duration: variant === "hero" ? 5 : 4, ease: "sine.inOut", repeat: -1, yoyo: true, onUpdate: paint });
      return () => sweep.kill();
    }

    const onMove = (event: PointerEvent) => {
      const box = root.getBoundingClientRect();
      moveX(event.clientX - box.left);
      moveY(event.clientY - box.top);
      lift(event.clientX);
    };
    const onEnter = () => gsap.to(spot, { r: radius(), duration: 0.6, ease: "power2.out", onUpdate: paint, overwrite: "auto" });
    const onLeave = () => { gsap.to(spot, { r: 0, duration: 0.6, ease: "power2.in", onUpdate: paint, overwrite: "auto" }); lift(null); };
    target.addEventListener("pointermove", onMove);
    target.addEventListener("pointerenter", onEnter);
    target.addEventListener("pointerleave", onLeave);
    return () => {
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerenter", onEnter);
      target.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(spot);
    };
  }, [trackRef, variant]);

  const layer = (kind: "base" | "glow") => (
    <div
      {...{ [`data-${kind}`]: "" }}
      aria-hidden={kind === "glow" ? true : undefined}
      className={`wordmark-${variant} wordmark-${kind} ${kind === "glow" ? "pointer-events-none absolute inset-0" : ""}`}
    >
      {words.map((word, w) => (
        <span key={word} className={variant === "hero" ? "block md:inline-block" : "inline-block"}>
          {word.split("").map((letter, i) => (
            <span key={i} data-letter className="inline-block will-change-transform">
              {letter}
            </span>
          ))}
          {w < words.length - 1 && <span className={variant === "hero" ? "hidden md:inline-block" : "inline-block"}>&nbsp;</span>}
        </span>
      ))}
    </div>
  );

  return (
    <div ref={rootRef} aria-hidden className={`wordmark relative select-none ${className}`}>
      {layer("base")}
      {layer("glow")}
    </div>
  );
}
