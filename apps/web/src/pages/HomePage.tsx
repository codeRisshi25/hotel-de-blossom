import { useRef } from "react";
import { Hero } from "../home/Hero";
import { Manifesto } from "../home/Manifesto";
import { RoomsShowcase } from "../home/RoomsShowcase";
import { ArrivalCta, BanquetPanel, DiningPreview, GalleryRibbon, StayDetails } from "../home/HomeSections";
import { useScrollAnimations } from "../lib/useScrollAnimations";

export function HomePage() {
  const ref = useRef<HTMLDivElement>(null);
  useScrollAnimations(ref);
  return (
    <div ref={ref}>
      <Hero />
      <Manifesto />
      <RoomsShowcase />
      <DiningPreview />
      <BanquetPanel />
      <StayDetails />
      <GalleryRibbon />
      <ArrivalCta />
    </div>
  );
}
