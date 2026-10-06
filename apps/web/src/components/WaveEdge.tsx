/**
 * Soft wave that cuts into a dark section's top or bottom edge, filled with the cream of the
 * neighbouring section so the colour change reads as a gentle wave instead of a straight line.
 */
export function WaveEdge({ position }: { position: "top" | "bottom" }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 64"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 z-10 h-8 w-full fill-champagne md:h-14 ${position === "top" ? "-top-px" : "-bottom-px rotate-180"}`}
    >
      <path d="M0 0H1440V30C1290 58 1140 6 990 26C840 46 690 60 540 38C390 16 240 8 120 22C80 27 40 34 0 40Z" />
    </svg>
  );
}
