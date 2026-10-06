import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { ArrowUpRight, Menu, Phone, X } from "lucide-react";
import { useBooking } from "../booking/BookingContext";
import { hotel } from "../content/site";
import { gsap, lockScroll, prefersReducedMotion, ScrollTrigger } from "../lib/motion";

export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/rooms", label: "Rooms" },
  { to: "/dining", label: "Dining" },
  { to: "/events", label: "Banquet" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const { openBooking } = useBooking();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Solid pill once past the hero, and hide while scrolling down quickly.
    const trigger = ScrollTrigger.create({
      start: 80,
      end: "max",
      onUpdate: (self) => {
        setScrolled(self.scroll() > 80);
        if (!headerRef.current || prefersReducedMotion()) return;
        gsap.to(headerRef.current, { yPercent: self.direction === 1 && self.scroll() > 600 ? -130 : 0, duration: 0.45, ease: "power3.out", overwrite: "auto" });
      },
    });
    return () => trigger.kill();
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    lockScroll(menuOpen);
    if (menuOpen) {
      gsap.set(menu, { display: "flex" });
      gsap.fromTo(menu, { clipPath: "circle(0% at 92% 4%)" }, { clipPath: "circle(150% at 92% 4%)", duration: prefersReducedMotion() ? 0 : 0.9, ease: "expo.inOut" });
      gsap.fromTo(menu.querySelectorAll("[data-menu-item]"), { yPercent: 120 }, { yPercent: 0, stagger: 0.05, delay: 0.25, duration: 0.8, ease: "expo.out" });
    } else if (menu.style.display === "flex") {
      gsap.to(menu, { clipPath: "circle(0% at 92% 4%)", duration: prefersReducedMotion() ? 0 : 0.6, ease: "expo.inOut", onComplete: () => { gsap.set(menu, { display: "none" }); } });
    }
  }, [menuOpen]);

  return (
    <>
      <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-5">
        <div
          className={`mx-auto flex max-w-[1360px] items-center justify-between gap-4 rounded-full px-3 py-2 transition-all duration-500 md:px-4 ${
            scrolled ? "border border-gold/25 bg-night/85 shadow-[0_20px_60px_rgba(8,26,23,.35)] backdrop-blur-xl" : "border border-transparent"
          }`}
        >
          <Link to="/" className="flex items-center gap-3 pl-2" aria-label="Hotel De Blossom home">
            <img src="/images/brand/logo-horizontal-light.webp" alt="Hotel De Blossom" width={190} height={34} className="h-6 w-auto md:h-7" />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 rounded-full border border-ivory/15 bg-ink/25 p-1 backdrop-blur-md lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-[13px] font-medium transition ${isActive ? "bg-ivory text-night" : "text-ivory/80 hover:bg-ivory/10 hover:text-ivory"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a href={hotel.phoneHref} aria-label={`Call ${hotel.phone}`} className="hidden h-11 w-11 place-items-center rounded-full border border-ivory/20 text-ivory transition hover:bg-ivory/10 md:grid">
              <Phone size={16} />
            </a>
            <button onClick={() => openBooking()} className="group hidden h-11 items-center gap-2 rounded-full bg-ivory pl-5 pr-1.5 text-[13px] font-semibold text-night transition hover:bg-champagne sm:flex">
              Reserve
              <span className="grid h-8 w-8 place-items-center rounded-full bg-night text-ivory transition group-hover:rotate-45">
                <ArrowUpRight size={15} />
              </span>
            </button>
            <button onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen} className="grid h-11 w-11 place-items-center rounded-full border border-ivory/20 text-ivory lg:hidden">
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      <div ref={menuRef} className="royal-pattern fixed inset-0 z-[65] hidden flex-col px-6 pb-8 pt-6 text-ivory" role="dialog" aria-modal="true" aria-label="Site menu">
        <div className="flex items-center justify-between">
          <img src="/images/brand/logo-horizontal-light.webp" alt="Hotel De Blossom" className="h-7 w-auto" />
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="grid h-11 w-11 place-items-center rounded-full border border-ivory/20">
            <X size={18} />
          </button>
        </div>
        <nav className="mt-12 grid gap-1" aria-label="Mobile">
          {navLinks.map((link, index) => (
            <div key={link.to} className="overflow-hidden">
              <NavLink data-menu-item to={link.to} end={link.to === "/"} className={({ isActive }) => `flex items-baseline gap-4 py-1 ${isActive ? "text-gold-soft" : "text-ivory"}`}>
                <span className="font-mono text-xs text-sandstone/60">0{index + 1}</span>
                <span className="display text-4xl">{link.label}</span>
              </NavLink>
            </div>
          ))}
        </nav>
        <div className="mt-auto grid gap-3">
          <button onClick={() => { setMenuOpen(false); openBooking(); }} className="min-h-13 rounded-full bg-gold py-3.5 text-[15px] font-semibold text-night">Request a booking</button>
          <a href={hotel.phoneHref} className="text-center text-sm text-ivory/70">{hotel.phone} · 24×7 front desk</a>
        </div>
      </div>
    </>
  );
}
