import { useRef } from "react";
import { Hero } from "../home/Hero";
import { Manifesto } from "../home/Manifesto";
import { RoomsShowcase } from "../home/RoomsShowcase";
import { ArrivalCta, BanquetPanel, DiningPreview, GalleryRibbon, StayDetails } from "../home/HomeSections";
import { useScrollAnimations } from "../lib/useScrollAnimations";
import { useTitle } from "../lib/useTitle";

export function HomePage() {
  const ref = useRef<HTMLDivElement>(null);
  useTitle("A royal stay in Guwahati");
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
