import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
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

const leftNavLinks = [
  { to: "/", label: "Home" },
  { to: "/rooms", label: "Rooms" },
  { to: "/about", label: "About" },
];

const rightNavLinks = [
  { to: "/dining", label: "Dining" },
  { to: "/events", label: "Banquet" },
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
      <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 px-4 py-4">
        <nav
          className={`mx-auto flex max-w-[1360px] items-center justify-between gap-8 px-6 py-3 transition-all duration-500 ${
            scrolled ? "rounded-full border border-gold/25 bg-night/85 shadow-[0_20px_60px_rgba(8,26,23,.35)] backdrop-blur-xl" : ""
          }`}
        >
          {/* Left Navigation */}
          <div className="hidden items-center gap-6 lg:flex">
            {leftNavLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `text-sm transition ${isActive ? "text-gold font-semibold" : "text-ivory/70 hover:text-ivory"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Center Logo */}
          <Link to="/" aria-label="Hotel De Blossom home">
            <img src="/images/brand/logo-navbar.png" alt="Hotel De Blossom" width={120} height={22} className="h-5 w-auto" />
          </Link>

          {/* Right Navigation */}
          <div className="hidden items-center gap-6 lg:flex">
            {rightNavLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `text-sm transition ${isActive ? "text-gold font-semibold" : "text-ivory/70 hover:text-ivory"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu */}
          <button onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen} className="grid h-11 w-11 place-items-center rounded-full border border-ivory/20 text-ivory lg:hidden">
            <Menu size={18} />
          </button>
        </nav>
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
