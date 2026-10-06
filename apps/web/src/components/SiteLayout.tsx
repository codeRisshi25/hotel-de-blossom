import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { CalendarHeart } from "lucide-react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { WhatsApp } from "./BrandIcons";
import { BookingDrawer } from "../booking/BookingDrawer";
import { useBooking } from "../booking/BookingContext";
import { hotel, whatsappLink } from "../content/site";
import { ScrollTrigger, scrollToTop, startSmoothScroll, stopSmoothScroll } from "../lib/motion";

function MobileReserveBar() {
  const { openBooking } = useBooking();
  return (
    <div className="fixed inset-x-3 bottom-3 z-40 flex gap-2 md:hidden">
      <button onClick={() => openBooking()} className="flex min-h-13 flex-1 items-center justify-center gap-2 rounded-full bg-gold text-[15px] font-semibold text-night shadow-[0_16px_40px_rgba(8,26,23,.35)]">
        <CalendarHeart size={18} /> Reserve your stay
      </button>
      <a href={whatsappLink("Hello Hotel De Blossom, I would like to enquire about a stay.")} target="_blank" rel="noreferrer" aria-label="WhatsApp the front desk" className="grid min-h-13 w-13 place-items-center rounded-full bg-night text-ivory shadow-[0_16px_40px_rgba(8,26,23,.35)]">
        <WhatsApp size={20} />
      </a>
    </div>
  );
}

export function SiteLayout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    document.documentElement.classList.add("js-motion");
    startSmoothScroll();
    return () => stopSmoothScroll();
  }, []);

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash);
      if (target) { setTimeout(() => target.scrollIntoView({ behavior: "smooth" }), 200); return; }
    }
    scrollToTop();
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => window.clearTimeout(id);
  }, [pathname, hash]);

  return (
    <div className="paper-noise min-h-screen bg-champagne">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-ivory focus:px-4 focus:py-2">Skip to content</a>
      <SiteHeader />
      <main id="main">
        <Outlet />
      </main>
      <SiteFooter />
      <MobileReserveBar />
      <BookingDrawer />
      <span className="sr-only">{hotel.name}</span>
    </div>
  );
}
