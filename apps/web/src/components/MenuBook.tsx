import { useMemo, useRef, useState } from "react";
import { Download, Leaf } from "lucide-react";
import { menu, type Diet } from "../content/menu";
import { gsap, prefersReducedMotion, useGSAP } from "../lib/motion";

/** FSSAI-style square marks: green dot for vegetarian, red for non-vegetarian. */
function DietMark({ diet }: { diet: Diet }) {
  if (diet === "none") return <span className="inline-block w-4" aria-hidden />;
  const mark = (color: string, label: string) => (
    <span title={label} aria-label={label} className="grid h-4 w-4 shrink-0 place-items-center border-[1.5px]" style={{ borderColor: color }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
    </span>
  );
  if (diet === "both") return <span className="flex gap-1">{mark("#1f7a3d", "Vegetarian option")}{mark("#b3261e", "Non-vegetarian option")}</span>;
  return diet === "veg" ? mark("#1f7a3d", "Vegetarian") : mark("#b3261e", "Non-vegetarian");
}

export function MenuBook() {
  const [active, setActive] = useState(menu[0].id);
  const [vegOnly, setVegOnly] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const section = menu.find((item) => item.id === active) ?? menu[0];
  const dishes = useMemo(() => section.dishes.filter((dish) => !vegOnly || dish.diet === "veg" || dish.diet === "both" || dish.diet === "none"), [section, vegOnly]);

  // Turning a page: the dish list fades in line by line.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo("[data-dish]", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.035, ease: "power3.out" });
      gsap.fromTo("[data-menu-title]", { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: "expo.out" });
    },
    { scope: ref, dependencies: [active, vegOnly] },
  );

  return (
    <div ref={ref} className="relative overflow-clip rounded-[32px] border border-gold/30 bg-ivory shadow-[0_40px_120px_rgba(13,40,35,.12)]">
      <div className="royal-pattern px-5 py-10 text-center text-ivory md:px-12 md:py-14">
        <img src="/images/brand/emblem.webp" alt="" aria-hidden className="mx-auto h-12 w-auto" />
        <p className="eyebrow mt-5 text-gold-soft">The Blossom Kitchen</p>
        <h2 className="display mt-3 text-4xl md:text-[3.6rem]">The Menu</h2>
        <p className="mx-auto mt-4 max-w-lg text-sm text-ivory/65">Indian, Assamese, Asian and continental — served {`07:30 – 23:30`}, with breakfast from 07:00 to 10:00.</p>
      </div>

      <div className="sticky top-0 z-10 border-b border-forest/10 bg-ivory/95 backdrop-blur">
        <div data-lenis-prevent className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-4 md:justify-center md:px-8" role="tablist" aria-label="Menu sections">
          {menu.map((item) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={active === item.id}
              onClick={() => setActive(item.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-[13px] font-semibold transition ${active === item.id ? "border-forest bg-forest text-ivory" : "border-forest/15 text-forest/75 hover:border-gold hover:text-forest"}`}
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-12 md:px-14 md:py-16" role="tabpanel">
        <div className="mb-10 flex flex-col items-center gap-5 text-center">
          <div className="overflow-hidden">
            <h3 data-menu-title className="royal text-2xl tracking-[.2em] text-[#8a3a24] md:text-3xl">{section.title.toUpperCase()}</h3>
          </div>
          {section.subtitle && <p className="eyebrow text-[10px] text-gold">{section.subtitle}</p>}
          <div className="ornament w-56"><span className="text-xs">✦</span></div>
          <label className="flex cursor-pointer items-center gap-2 rounded-full border border-forest/15 px-4 py-2 text-xs font-semibold text-forest">
            <input type="checkbox" checked={vegOnly} onChange={(event) => setVegOnly(event.target.checked)} className="accent-[#1f7a3d]" />
            <Leaf size={13} className="text-[#1f7a3d]" /> Vegetarian only
          </label>
        </div>

        <ul className="mx-auto grid max-w-[920px] gap-x-14 gap-y-6 md:grid-cols-2">
          {dishes.map((dish) => (
            <li data-dish key={dish.name} className="group">
              <div className="flex items-baseline gap-3">
                <span className="relative top-0.5"><DietMark diet={dish.diet} /></span>
                <span className="display text-[1.25rem] leading-tight text-forest">{dish.name}</span>
                <span className="mb-1.5 min-w-6 flex-1 border-b border-dotted border-forest/30 transition group-hover:border-gold" />
                <span className="display shrink-0 text-lg text-[#8a3a24]">{dish.price}</span>
              </div>
              {(dish.note || dish.signature) && (
                <p className="ml-7 mt-1 text-sm leading-6 text-charcoal/60">
                  {dish.signature && <span className="mr-2 rounded-full bg-gold/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[.16em] text-[#7a5a17]">Signature</span>}
                  {dish.note}
                </p>
              )}
            </li>
          ))}
        </ul>
        {!dishes.length && <p className="text-center text-charcoal/60">No vegetarian dishes in this section.</p>}

        <div className="mx-auto mt-14 flex max-w-5xl flex-col items-center justify-between gap-4 border-t border-forest/10 pt-8 text-center text-xs text-charcoal/55 md:flex-row md:text-left">
          <p>Prices in ₹. We levy a 10% service charge · Government taxes as applicable.</p>
          <a href="/menu/hotel-de-blossom-menu.pdf" download className="inline-flex min-h-11 items-center gap-2 rounded-full border border-forest/20 px-5 text-sm font-semibold text-forest hover:border-gold">
            <Download size={15} /> Download menu (PDF)
          </a>
        </div>
      </div>
    </div>
  );
}
