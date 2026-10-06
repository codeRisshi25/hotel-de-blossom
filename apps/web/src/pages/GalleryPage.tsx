import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { Picture } from "../components/Picture";
import { gallery } from "../content/site";
import { gsap, lockScroll, prefersReducedMotion, useGSAP } from "../lib/motion";
import { useScrollAnimations } from "../lib/useScrollAnimations";
import { useTitle } from "../lib/useTitle";

const categories = ["All", "Rooms", "Reception", "Dining", "Banquet", "Property"] as const;

export default function GalleryPage() {
  const ref = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<(typeof categories)[number]>("All");
  const [open, setOpen] = useState<number | null>(null);
  const items = filter === "All" ? gallery : gallery.filter((item) => item.category === filter);
  useTitle("Gallery");
  useScrollAnimations(ref);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.fromTo("[data-tile]", { y: 40, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.05, ease: "power3.out" });
  }, { scope: gridRef, dependencies: [filter] });

  useEffect(() => {
    lockScroll(open !== null);
    if (open === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(null);
      if (event.key === "ArrowRight") setOpen((index) => (index === null ? null : (index + 1) % items.length));
      if (event.key === "ArrowLeft") setOpen((index) => (index === null ? null : (index - 1 + items.length) % items.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, items.length]);

  const current = open !== null ? items[open] : null;

  return (
    <div ref={ref}>
      <PageHero eyebrow="Gallery" image="reception/reception-1" alt="Hotel De Blossom reception" title={<>The hotel <em className="gold-text">in bloom.</em></>} intro="Rooms, reception, dining and the banquet hall — a look around the house." />
      <section className="px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1500px]">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Gallery categories">
            {categories.map((category) => (
              <button key={category} role="tab" aria-selected={filter === category} onClick={() => setFilter(category)} className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${filter === category ? "border-forest bg-forest text-ivory" : "border-forest/15 text-forest hover:border-gold"}`}>
                {category}
              </button>
            ))}
          </div>
          <div ref={gridRef} className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {items.map((item, index) => (
              <button data-tile key={item.path} onClick={() => setOpen(index)} className="group relative block w-full overflow-hidden rounded-[22px] text-left">
                <Picture path={item.path} alt={item.alt} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className={`w-full object-cover transition duration-700 group-hover:scale-105 ${index % 3 === 0 ? "aspect-[3/4]" : "aspect-[4/3]"}`} />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent opacity-0 transition group-hover:opacity-100" />
                <span className="absolute bottom-4 left-4 right-4 translate-y-3 text-ivory opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="eyebrow block text-[9px] text-gold-soft">{item.category}</span>
                  <span className="display text-xl">{item.alt}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {current && open !== null && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-ink/95 p-4" role="dialog" aria-modal="true" aria-label={current.alt} onClick={() => setOpen(null)}>
          <Picture key={current.path} path={current.path} alt={current.alt} sizes="100vw" className="max-h-[82vh] w-auto max-w-full rounded-2xl object-contain" onClick={(event) => event.stopPropagation()} />
          <p className="mt-4 text-center text-sm text-ivory/70">{current.alt}</p>
          <button aria-label="Close" onClick={() => setOpen(null)} className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full border border-ivory/20 text-ivory"><X /></button>
          <button aria-label="Previous" onClick={(event) => { event.stopPropagation(); setOpen((open - 1 + items.length) % items.length); }} className="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-ivory/20 text-ivory"><ArrowLeft /></button>
          <button aria-label="Next" onClick={(event) => { event.stopPropagation(); setOpen((open + 1) % items.length); }} className="absolute right-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-ivory/20 text-ivory"><ArrowRight /></button>
        </div>
      )}
    </div>
  );
}
